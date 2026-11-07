import 'server-only';

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createClient, type Client } from '@libsql/client/http';
import type { WorkCategory } from './work-categories';

export type ProjectFields = {
  name: string;
  category: WorkCategory;
  type: string;
  summary: string;
  details: string;
  clientName: string;
  role: string;
  technologies: string;
  live: string;
  source: string;
};

export type ProjectEntry = ProjectFields & { id: number; hasImage: number };
export type SkillEntry = { id: number; group: string; name: string };
export type ProjectImage = { bytes: Uint8Array; mime: string };

let connection: DatabaseSync | undefined;
let remote: Promise<Client> | undefined;

const schema = [
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_key TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'client' CHECK (category IN ('client', 'personal')),
    type TEXT NOT NULL,
    summary TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '',
    client_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '',
    technologies TEXT NOT NULL,
    live TEXT NOT NULL,
    source TEXT NOT NULL,
    image BLOB,
    image_mime TEXT
  ) STRICT`,
  `CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT NOT NULL,
    name TEXT NOT NULL,
    name_key TEXT NOT NULL,
    UNIQUE (group_id, name_key)
  ) STRICT`,
];

const newProjectColumns = {
  category: "TEXT NOT NULL DEFAULT 'client' CHECK (category IN ('client', 'personal'))",
  details: "TEXT NOT NULL DEFAULT ''",
  client_name: "TEXT NOT NULL DEFAULT ''",
  role: "TEXT NOT NULL DEFAULT ''",
};

export function contentStorageConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) || process.env.VERCEL !== '1';
}

function localDatabase() {
  if (connection) return connection;
  const path = resolve(/* turbopackIgnore: true */ process.env.PORTFOLIO_DB_PATH || '.data/portfolio.sqlite');
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  try {
    db.exec('PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; BEGIN IMMEDIATE;');
    for (const sql of schema) db.exec(sql);
    const columns = new Set(db.prepare('PRAGMA table_info(projects)').all().map(({ name }) => name));
    for (const [name, definition] of Object.entries(newProjectColumns)) {
      if (!columns.has(name)) db.exec(`ALTER TABLE projects ADD COLUMN ${name} ${definition}`);
    }
    db.exec('COMMIT');
    connection = db;
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

async function remoteDatabase(url: string, authToken: string) {
  if (!remote) {
    const client = createClient({ url, authToken });
    remote = client.batch(schema, 'write').then(() => client).catch((error) => {
      client.close();
      remote = undefined;
      throw error;
    });
  }
  return remote;
}

type SqlValue = string | number | Uint8Array | null;

async function execute<Row>(sql: string, args: SqlValue[] = [], read = false) {
  const { TURSO_DATABASE_URL: url, TURSO_AUTH_TOKEN: token } = process.env;
  if (url && token) {
    const db = await remoteDatabase(url, token);
    const result = await db.execute({
      sql, args: args.map((value) => value instanceof Uint8Array ? Uint8Array.from(value).buffer : value),
    });
    return { rows: result.rows as unknown as Row[], changes: result.rowsAffected };
  }
  if (!contentStorageConfigured()) throw new Error('Portfolio database is not configured.');
  const statement = localDatabase().prepare(sql);
  return read ? { rows: statement.all(...args) as Row[], changes: 0 }
    : { rows: [] as Row[], changes: Number(statement.run(...args).changes) };
}

export function nameKey(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

export async function getContent() {
  if (!contentStorageConfigured()) return { projects: [] as ProjectEntry[], skills: [] as SkillEntry[] };
  const [projects, skills] = await Promise.all([
    execute<ProjectEntry>(`SELECT id, name, category, type, summary, details, client_name AS clientName,
      role, technologies, live, source, image IS NOT NULL AS hasImage
      FROM projects ORDER BY id DESC`, [], true),
    execute<SkillEntry>('SELECT id, group_id AS "group", name FROM skills ORDER BY id', [], true),
  ]);
  return {
    projects: projects.rows.map((project) => ({ ...project })),
    skills: skills.rows.map((skill) => ({ ...skill })),
  };
}

export async function saveProject(id: number | undefined, project: ProjectFields, image: ProjectImage | null | undefined) {
  const fields = [project.name, nameKey(project.name), project.category, project.type, project.summary,
    project.details, project.clientName, project.role, project.technologies, project.live, project.source];
  if (id === undefined) {
    return (await execute(`
      INSERT INTO projects (name, name_key, category, type, summary, details, client_name, role, technologies, live, source, image, image_mime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (name_key) DO NOTHING
    `, [...fields, image?.bytes ?? null, image?.mime ?? null])).changes;
  }
  const replaceImage = Number(image !== undefined);
  return (await execute(`
    UPDATE OR IGNORE projects SET name = ?, name_key = ?, category = ?, type = ?, summary = ?, details = ?,
      client_name = ?, role = ?, technologies = ?,
      live = ?, source = ?, image = CASE WHEN ? THEN ? ELSE image END,
      image_mime = CASE WHEN ? THEN ? ELSE image_mime END
    WHERE id = ?
  `, [...fields, replaceImage, image?.bytes ?? null, replaceImage, image?.mime ?? null, id])).changes;
}

export async function getProjectImage(id: number) {
  if (!contentStorageConfigured()) return;
  const { rows: [image] } = await execute<{ bytes: Uint8Array | ArrayBuffer; mime: string }>(
    'SELECT image AS bytes, image_mime AS mime FROM projects WHERE id = ? AND image IS NOT NULL', [id], true,
  );
  if (image) return { bytes: image.bytes instanceof Uint8Array ? image.bytes : new Uint8Array(image.bytes), mime: image.mime };
}

export async function deleteProject(id: number) {
  return (await execute('DELETE FROM projects WHERE id = ?', [id])).changes;
}

export async function saveSkill(id: number | undefined, group: string, name: string) {
  if (id === undefined) {
    return (await execute('INSERT INTO skills (group_id, name, name_key) VALUES (?, ?, ?) ON CONFLICT (group_id, name_key) DO NOTHING',
      [group, name, nameKey(name)])).changes;
  }
  return (await execute('UPDATE OR IGNORE skills SET group_id = ?, name = ?, name_key = ? WHERE id = ?',
    [group, name, nameKey(name), id])).changes;
}

export async function deleteSkill(id: number) {
  return (await execute('DELETE FROM skills WHERE id = ?', [id])).changes;
}
