'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { contentStorageConfigured, deleteProject, deleteSkill, nameKey, saveProject, saveSkill, type ProjectImage } from '../content';
import { personalProjects, skillGroups, teamProjects } from '../portfolio';
import { workCategories } from '../work-categories';
import { adminConfigured, endSession, requireAdmin, startSession } from './auth';

function text(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

function recordId(value: string) {
  const id = Number(value);
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(id) ? id : undefined;
}

function webLink(value: string) {
  if (!value) return true;
  if (value.length > 500) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function imageMime(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return 'image/jpeg';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return undefined;
}

function finish(section: 'projects' | 'skills', notice: string): never {
  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect(`/dashboard/?notice=${notice}#${section}`);
}

export async function signIn(_previous: string, form: FormData): Promise<string> {
  if (!adminConfigured()) return 'Set the dashboard password in your server environment first.';
  const candidate = form.get('password');
  if (typeof candidate !== 'string' || !(await startSession(candidate))) return 'That password didn’t match. Try again.';
  redirect('/dashboard/');
}

export async function signOut() {
  await endSession();
  redirect('/dashboard/');
}

export async function publishProject(_previous: string, form: FormData): Promise<string> {
  await requireAdmin();
  if (!contentStorageConfigured()) return 'Connect a database before publishing.';
  const entry = text(form, 'id');
  const id = recordId(entry);
  if (entry && id === undefined) return 'This project could not be found.';
  const category = workCategories.find(({ id }) => id === text(form, 'category'));
  if (!category) return 'Choose Client Work or Personal Project.';

  const project = {
    name: text(form, 'name'),
    category: category.id,
    type: text(form, 'type'),
    summary: text(form, 'summary'),
    details: text(form, 'details'),
    clientName: category.id === 'client' ? text(form, 'clientName') : '',
    role: text(form, 'role'),
    technologies: text(form, 'technologies'),
    live: text(form, 'live'),
    source: text(form, 'source'),
  };
  if (!project.name || project.name.length > 80) return 'Enter a project name of up to 80 characters.';
  if (!project.type || project.type.length > 60) return 'Enter a project type of up to 60 characters.';
  if (!project.summary || project.summary.length > 420) return 'Enter a summary of up to 420 characters.';
  if (project.details.length > 4000) return 'Keep the project details under 4,000 characters.';
  if (project.clientName.length > 100 || project.role.length > 100) return 'Keep the client name and your role under 100 characters each.';
  if (project.technologies.length > 180) return 'Keep the technologies list under 180 characters.';
  if (!webLink(project.live) || !webLink(project.source)) return 'Use full HTTP or HTTPS links for the project and repository.';
  if ([...personalProjects, ...teamProjects].some((original) => nameKey(original.name) === nameKey(project.name))) {
    return 'A portfolio project already uses this name.';
  }

  const uploaded = form.get('screenshot');
  let image: ProjectImage | null | undefined = form.get('removeImage') === 'on' ? null : undefined;
  if (uploaded instanceof File && uploaded.size > 0) {
    if (uploaded.size > 3 * 1024 * 1024) return 'Choose a screenshot under 3 MB.';
    const bytes = Buffer.from(await uploaded.arrayBuffer());
    const mime = imageMime(bytes);
    if (!mime) return 'Choose a PNG, JPEG, or WebP screenshot.';
    image = { bytes, mime };
  }
  const changed = await saveProject(id, project, image);
  if (!changed) return 'This name is already in use or the project was removed.';
  finish('projects', category.id === 'client' ? 'client-saved' : 'personal-saved');
}

export async function removeProject(form: FormData) {
  await requireAdmin();
  const id = recordId(text(form, 'id'));
  const removed = contentStorageConfigured() && id !== undefined && await deleteProject(id);
  finish('projects', removed ? 'project-removed' : 'project-missing');
}

export async function publishSkill(_previous: string, form: FormData): Promise<string> {
  await requireAdmin();
  if (!contentStorageConfigured()) return 'Connect a database before publishing.';
  const entry = text(form, 'id');
  const id = recordId(entry);
  if (entry && id === undefined) return 'This skill could not be found.';

  const name = text(form, 'name');
  if (!name || name.length > 60) return 'Enter a skill name of up to 60 characters.';
  const group = skillGroups.find(({ id }) => id === text(form, 'group'));
  if (!group) return 'Choose a skill group.';
  if (group.items.some((item) => nameKey(item) === nameKey(name))) return 'This skill is already listed in that group.';
  if (!(await saveSkill(id, group.id, name))) return 'This skill is already listed in that group or the entry was removed.';
  finish('skills', 'skill-saved');
}

export async function removeSkill(form: FormData) {
  await requireAdmin();
  const id = recordId(text(form, 'id'));
  const removed = contentStorageConfigured() && id !== undefined && await deleteSkill(id);
  finish('skills', removed ? 'skill-removed' : 'skill-missing');
}
