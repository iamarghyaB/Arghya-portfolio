import type { Metadata } from 'next';
import { contentStorageConfigured, getContent } from '../content';
import { skillGroups } from '../portfolio';
import { Brand, Chapter, Icon } from '../ui';
import { workCategories } from '../work-categories';
import { removeProject, removeSkill, signOut } from './actions';
import { adminConfigured, isAdmin } from './auth';
import { ProjectForm, SignInForm, SkillForm } from './forms';
import './dashboard.css';

export const metadata: Metadata = {
  title: 'Portfolio Dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const notices = {
  'client-saved': 'Project saved. It’s visible in Client Work on your portfolio.',
  'personal-saved': 'Project saved. It’s visible in My Projects on your portfolio.',
  'skill-saved': 'Skill published. It’s visible in its group on your portfolio.',
  'project-removed': 'Project removed from the portfolio.',
  'skill-removed': 'Skill removed from the portfolio.',
  'project-missing': 'That project was already removed.',
  'skill-missing': 'That skill was already removed.',
};

function RemoveEntry({ id, name, kind }: { id: number; name: string; kind: 'project' | 'skill' }) {
  return (
    <details className="dash-remove">
      <summary className="text-link" aria-label={`Remove ${name}`}>Remove</summary>
      <form action={kind === 'project' ? removeProject : removeSkill}>
        <input type="hidden" name="id" value={id} />
        <button className="button danger" type="submit" aria-label={`Confirm removal of ${name}`}>Confirm removal</button>
      </form>
    </details>
  );
}

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Dashboard({ searchParams }: { searchParams: Search }) {
  const storageReady = contentStorageConfigured();
  const authorized = storageReady && await isAdmin();
  if (!authorized) {
    return (
      <div className="dashboard">
        <header className="dash-header"><div className="shell dash-top"><Brand href="/" /><a className="text-link" href="/">View portfolio <Icon name="external" size={16} /></a></div></header>
        <main className="shell dash-login">
          <Chapter number="ADMIN" title="OWNER ACCESS" />
          <h1 className="display">Portfolio <em>dashboard.</em></h1>
          <p>Sign in to publish projects and skills to your portfolio.</p>
          <div className="dash-panel">
            {!storageReady ? <p>Connect a database to enable dashboard publishing.</p>
              : adminConfigured() ? <SignInForm /> : <p>Set <code>PORTFOLIO_ADMIN_PASSWORD</code> in the server environment to enable sign-in.</p>}
          </div>
        </main>
      </div>
    );
  }

  const { projects, skills } = await getContent();
  const query = await searchParams;
  const editedProject = projects.find(({ id }) => String(id) === query.project);
  const initialCategory = query.category === 'personal' ? 'personal' : 'client';
  const editedSkill = skills.find(({ id }) => String(id) === query.skill);
  const notice = typeof query.notice === 'string' && Object.hasOwn(notices, query.notice)
    ? notices[query.notice as keyof typeof notices]
    : undefined;
  const skillNotice = typeof query.notice === 'string' && query.notice.startsWith('skill-');

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="shell dash-top">
          <Brand href="/" />
          <div className="dash-top-actions">
            <a className="text-link" href="/">View portfolio <Icon name="external" size={16} /></a>
            <form action={signOut}><button className="dash-sign-out" type="submit">Sign out</button></form>
          </div>
        </div>
      </header>
      <main className="shell dash-main">
        <div className="dash-intro">
          <div>
            <Chapter number="ADMIN" title="PORTFOLIO EDITOR" />
            <h1 className="display">Manage <em>your portfolio.</em></h1>
            <p>Publish client work, personal projects, and skills to your portfolio.</p>
          </div>
          <nav className="dash-shortcuts" aria-label="Dashboard sections">
            <a href="#client-library"><span>01</span> Client Work <Icon name="arrow-down" size={17} /></a>
            <a href="#personal-library"><span>02</span> My Projects <Icon name="arrow-down" size={17} /></a>
            <a href="#skills"><span>03</span> Skills <Icon name="arrow-down" size={17} /></a>
          </nav>
        </div>

        <section className="dash-section" id="projects">
          <div className="dash-section-heading">
            <div><Chapter number="01" title="WORK" /><h2>Publish work</h2></div>
            <a className="text-link" href="/#work">View Work on site <Icon name="external" size={16} /></a>
          </div>
          {notice && !skillNotice && <p className="dash-notice" role="status">{notice}</p>}
          <div className="dash-columns">
            <div className="dash-panel" id="project-editor">
              <h3>{editedProject ? 'Edit project' : 'Add a project'}</h3>
              <ProjectForm key={editedProject?.id ?? initialCategory} project={editedProject} initialCategory={initialCategory} />
            </div>
            <div className="dash-work-libraries">
              {workCategories.map(({ id, label, anchor }) => {
                const entries = projects.filter((project) => project.category === id);
                return (
                  <section className="dash-panel dash-library" id={`${id}-library`} key={id} aria-labelledby={`${id}-library-title`}>
                    <div className="dash-library-title"><h3 id={`${id}-library-title`}>{label}</h3><span>{entries.length} added</span></div>
                    {entries.length ? (
                      <ul className="dash-list">{entries.map((project) => (
                        <li key={project.id}>
                          <div><strong>{project.name}</strong><p>{project.type}</p></div>
                          <div className="dash-row-actions">
                            <a className="text-link" href={`/dashboard/?project=${project.id}#project-editor`} aria-label={`Edit ${project.name}`}>Edit</a>
                            <RemoveEntry id={project.id} name={project.name} kind="project" />
                          </div>
                        </li>
                      ))}</ul>
                    ) : <p className="dash-empty">No entries published in this category yet.</p>}
                    <div className="dash-library-foot dash-library-links">
                      <a className="text-link" href={`/dashboard/?category=${id}#project-editor`}>{id === 'client' ? 'Add client work' : 'Add personal project'}</a>
                      <a className="text-link" href={`/#${anchor}`}>View on site <Icon name="external" size={16} /></a>
                    </div>
                  </section>
                );
              })}
              <p className="dash-empty">The latest published entry also appears in Featured Work.</p>
            </div>
          </div>
        </section>

        <section className="dash-section" id="skills">
          <div className="dash-section-heading">
            <div><Chapter number="02" title="CAPABILITIES" /><h2>Skills</h2></div>
            <a className="text-link" href="/#skills">View Skills on site <Icon name="external" size={16} /></a>
          </div>
          {notice && skillNotice && <p className="dash-notice" role="status">{notice}</p>}
          <div className="dash-columns">
            <div className="dash-panel" id="skill-editor">
              <h3>{editedSkill ? 'Edit skill' : 'Add a skill'}</h3>
              <SkillForm key={editedSkill?.id ?? 'new'} skill={editedSkill} />
            </div>
            <div className="dash-panel dash-library">
              <div className="dash-library-title"><h3>Skill groups</h3><span>{skills.length} added</span></div>
              {skillGroups.map(({ id, title, items }) => (
                <div className="dash-skill-group" key={id}>
                  <h4>{title}</h4>
                  <p>{items.join(' · ')}</p>
                  <ul className="dash-list">
                    {skills.filter((skill) => skill.group === id).map((skill) => (
                      <li key={skill.id}>
                        <strong>{skill.name}</strong>
                        <div className="dash-row-actions">
                          <a className="text-link" href={`/dashboard/?skill=${skill.id}#skill-editor`} aria-label={`Edit ${skill.name}`}>Edit</a>
                          <RemoveEntry id={skill.id} name={skill.name} kind="skill" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
