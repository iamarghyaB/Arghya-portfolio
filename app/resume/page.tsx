import type { Metadata } from 'next';
import { personalProjects, profile, skillGroups } from '../portfolio';
import { Brand, External } from '../ui';
import { PrintButton } from './print-button';

export const metadata: Metadata = { title: 'Résumé', description: 'Résumé of Arghya Biswas, full-stack MERN developer based in Bangladesh.' };

export default function Resume() {
  return (
    <div className="resume-page light">
      <div className="resume-toolbar shell">
        <Brand href="/" />
        <PrintButton />
      </div>
      <main className="resume-sheet">
        <header>
          <p className="project-meta">FULL-STACK WEB DEVELOPMENT</p>
          <h1>{profile.name}</h1>
          <p>{profile.role} · MERN Stack · {profile.location}</p>
          <div className="project-links">
            <External href={profile.linkedin}>LinkedIn</External>
            <External href={profile.github}>GitHub</External>
            <External href={profile.studio}>Makezaa</External>
          </div>
        </header>
        <section>
          <h2>Profile</h2>
          <p>Full-stack developer and Computer Science and Engineering student with about four years of hands-on development across independent and collaborative projects. Experienced with responsive interfaces, REST APIs, authentication, and database-driven workflows. Currently studying system design and backend architecture.</p>
        </section>
        <section>
          <h2>Selected personal projects</h2>
          {personalProjects.map((project) => <article key={project.slug}>
            <h3>{project.name}</h3>
            <p>{project.summary} {project.features.join(' · ')}.</p>
            <p className="resume-stack">{project.stack.join(' · ')}</p>
            <div className="project-links">
              <External href={project.live} label={`Live demo of ${project.name}`}>Live demo</External>
              <External href={project.source} label={`${project.name} source on GitHub`}>GitHub</External>
            </div>
          </article>)}
        </section>
        <section>
          <h2>Collaborative experience</h2>
          <p>Collaborated with Makezaa, a Bangladesh-based digital development studio with project work for clients in the United States and United Kingdom. Makezaa credited me for marketing work on CampusFlow, a digital companion for Bangladesh University students.</p>
        </section>
        <section>
          <h2>Skills</h2>
          <dl>{skillGroups.map(({ title, items }) => <div key={title}><dt>{title}</dt><dd>{items.join(', ')}</dd></div>)}</dl>
        </section>
      </main>
    </div>
  );
}
