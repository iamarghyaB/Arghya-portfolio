import Image from 'next/image';
import { getContent } from './content';
import { Motion, Navigation } from './motion';
import { Opening, PortfolioHero } from './portfolio-hero';
import { ProjectCard } from './project-card';
import { SkillShowcase } from './skill-showcase';
import { SystemDiagram } from './system-diagram';
import { personalProjects, process, profile, skillGroups, teamProjects } from './portfolio';
import { External, Icon, OrbitMark, Tags } from './ui';
import './experience.css';

const projectImages: Record<string, string> = {
  'an-noor': 'An-Noor live charity website homepage',
  'golden-touch': 'Golden Touch Contractors live business website homepage',
  campusflow: 'CampusFlow live student platform homepage',
};

export const dynamic = 'force-dynamic';

function ChapterEdge({ title, number }: { title: string; number: string }) {
  return <div className="chapter-edge"><span>{title}</span><span>Chapter {number}</span></div>;
}

export default async function Home() {
  const { projects, skills } = await getContent();
  const published = projects.map(({ id, category, hasImage, technologies, ...project }) => ({
    id,
    category,
    project: {
      ...project,
      stack: [...new Set(technologies.split(',').map((tag) => tag.trim()).filter(Boolean))],
    },
    image: hasImage ? { src: `/project-image/${id}/`, alt: `Screenshot of ${project.name}` } : undefined,
  }));
  const clientWork = published.filter(({ category }) => category === 'client');
  const personalWork = published.filter(({ category }) => category === 'personal');
  const [importExportHub] = personalProjects;
  const [newest] = published;
  const [campusFlow] = teamProjects;
  const featured = newest ?? {
    project: campusFlow,
    image: { src: '/images/campusflow-phone.webp', alt: 'CampusFlow homepage on a phone screen' },
  };
  const groups = skillGroups.map(({ id, title, items }) => ({
    id,
    title,
    items: [...items, ...skills.filter((skill) => skill.group === id).map((skill) => skill.name)],
  }));

  return (
    <div className="portfolio-experience">
      <Opening />
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header">
        <div className="shell header-inner">
          <a href="#home" className="portfolio-mark" aria-label="Arghya Biswas home"><OrbitMark size={30} /><span>ARGHYA</span></a>
          <p>Full-stack developer in Bangladesh.<br />I build web apps and study system design.</p>
          <a href="#work" className="button primary">Explore my work</a>
        </div>
      </header>
      <Navigation />
      <Motion />
      <main id="main" tabIndex={-1}>
        <PortfolioHero />

        <section id="about" className="profile-section">
          <div className="shell">
            <ChapterEdge number="01" title="About me" />
            <h2 className="display profile-heading">
              <span data-line>Before the</span>
              <span data-line>system, there’s</span>
              <span data-line>a person.</span>
            </h2>
            <div className="profile-copy" data-reveal>
              <p className="lead">I’m Arghya, a full-stack developer and Computer Science and Engineering student in Bangladesh.</p>
              <div>
                <p>I’ve spent about four years learning by building, from independent MERN applications to work with Makezaa, a digital studio in Bangladesh. That work has introduced me to client needs in the United States and United Kingdom and to the decisions that shape a product before development begins.</p>
                <p>I’m most curious about how the pieces fit together, from the first screen someone sees to the services and data behind it.</p>
                <a className="text-link" href="/resume/">View résumé <Icon name="external" size={16} /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="light work">
          <section className="feature-chapter" aria-labelledby="featured-title">
            <div className="shell">
              <ChapterEdge number="02" title="Featured work" />
              <h2 id="featured-title" className="display feature-heading"><span data-line>From idea</span><span data-line>to application.</span></h2>
              <div className="feature-ghost" aria-hidden="true" data-device-ghost>BUILD 01</div>
              <ProjectCard project={featured.project} image={featured.image} featured />
            </div>
          </section>
          <section id="archive" className="archive-sheet" aria-labelledby="archive-title" data-sheet>
            <div className="shell">
              <ChapterEdge number="03" title="Project archive" />
              <div className="archive-heading">
                <h2 id="archive-title" className="display"><span data-line>Client work.</span></h2>
                <p>Projects I’ve worked on directly with clients, from understanding their needs to shaping what we built.</p>
              </div>
              {clientWork.length > 0 && (
                <section className="latest-work" aria-label="Latest client work">
                  <p className="group-label"><span className="signal-dot" /> LATEST CLIENT WORK <span>{clientWork.length} {clientWork.length === 1 ? 'PROJECT' : 'PROJECTS'}</span></p>
                  <div className="project-grid">
                    {clientWork.map(({ id, project, image }) => (
                      <ProjectCard key={id} project={project} image={image} />
                    ))}
                  </div>
                </section>
              )}
              <p className="group-label team-label"><span className="signal-dot" /> MAKEZAA COLLABORATIONS <span>{teamProjects.length} PROJECTS</span></p>
              <div className="team-list">
                {teamProjects.map((project) => (
                  <details className="team-project" key={project.slug}>
                    <summary>
                      <span className="team-number">{project.number}</span>
                      <span className="team-title">{project.name}</span>
                      <span className="team-type">{project.type}</span>
                      <span className="team-icon"><Icon name="plus" /></span>
                    </summary>
                    <div className="team-content">
                      <div className="team-image"><Image src={`/images/${project.slug}.webp`} alt={projectImages[project.slug]} fill sizes="(max-width: 740px) 94vw, 40vw" /></div>
                      <div>
                        <p className="project-meta">{project.contribution}</p>
                        <p>{project.summary}</p>
                        {project.stack.length > 0 && <Tags items={project.stack} />}
                        <div className="project-links">
                          <External href={project.live} label={`${project.name} live website`}>Live website</External>
                          {project.source && <External href={project.source} label={`Makezaa case study for ${project.name}`}>Makezaa case study</External>}
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
          <section id="my-projects" className="archive-sheet personal-sheet" aria-labelledby="personal-title" data-sheet>
            <div className="shell">
              <ChapterEdge number="04" title="Independent builds" />
              <div className="archive-heading">
                <h2 id="personal-title" className="display"><span data-line>My projects.</span></h2>
                <p>Apps I build on my own to test ideas and solve problems I’m curious about.</p>
              </div>
              <div className="project-grid">
                {personalWork.map(({ id, project, image }) => (
                  <ProjectCard key={id} project={project} image={image} />
                ))}
                <ProjectCard project={importExportHub} sourceLabel="GitHub"
                  image={{ src: '/images/import-export-hub.webp', alt: 'Import Export Hub application homepage' }} />
              </div>
            </div>
          </section>
        </section>

        <section className="light process" id="process">
          <div className="shell">
            <ChapterEdge number="05" title="My process" />
            <div className="process-grid">
              <div className="process-intro">
                <h2 className="display"><span data-line>Start with</span><span data-line>the problem.</span></h2>
                <p>I start with what someone is trying to do, then work outward to the interface, services, and data that make it possible.</p>
              </div>
              <div className="process-steps" data-reveal>
                <p className="process-label"><OrbitMark size={19} /> How I build</p>
                {process.map(([title, content], index) => (
                  <details key={title} name="process" open={index === 0}>
                    <summary><span className="process-number">0{index + 1}</span>{title}<Icon name="plus" /></summary>
                    <p>{content}</p>
                  </details>
                ))}
              </div>
              <figure className="process-photo" data-reveal>
                <Image src="/images/lab.webp" alt="Arghya at a computer in the university lab" fill sizes="(max-width: 720px) 90vw, 23vw" />
                <figcaption>From the lab</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="skills" className="skills">
          <div className="shell">
            <ChapterEdge number="06" title="My toolkit" />
            <h2 className="display skill-heading"><span data-line>The tools</span><span data-line>I build with.</span></h2>
            <SkillShowcase groups={groups} />
          </div>
        </section>

        <section id="systems" className="systems">
          <div className="shell">
            <ChapterEdge number="07" title="Thinking in systems" />
            <div className="section-intro">
              <h2 className="display"><span data-line>Beyond the screen.</span></h2>
              <p>I’m actively studying system design, especially how data flows through an application and what changes as load grows. This conceptual exercise explores a typical read request.</p>
            </div>
            <SystemDiagram />
          </div>
        </section>

        <section id="ahead" className="ahead-sheet light" data-sheet>
          <div className="shell">
            <ChapterEdge number="08" title="The road ahead" />
            <div className="ahead-layout">
              <div>
                <h2 className="display"><span data-line>I’m still</span><span data-line>becoming.</span></h2>
                <p>I want to deepen my backend and architecture skills, work closely with product teams, and take more ownership of the decisions that make software reliable and maintainable.</p>
              </div>
              <figure className="ahead-image" data-reveal>
                <Image src="/images/shore.webp" alt="Arghya standing by the sea at sunset" fill sizes="(max-width: 720px) 90vw, 48vw" />
              </figure>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="shell">
            <ChapterEdge number="09" title="Get in touch" />
            <div className="contact-copy" data-reveal>
              <div className="contact-emblem" aria-hidden="true"><OrbitMark size={64} /></div>
              <h2>Have something worth building?</h2>
              <p>I’d love to hear about engineering opportunities, product ideas, and the problems you’re working on.</p>
            </div>
            <a className="display contact-link" aria-label="Connect on LinkedIn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <span data-line>Let’s talk</span><Icon name="external" size={25} />
            </a>
            <footer className="site-footer">
              <a className="portfolio-mark" href="#home" aria-label="Arghya Biswas home"><OrbitMark size={24} /><span>ARGHYA</span></a>
              <div className="footer-links">
                <a className="text-link" href="/resume/">Résumé <Icon name="external" size={16} /></a>
                <External href={profile.github}>GitHub</External>
                <External href={profile.studio}>Makezaa</External>
                <External href={profile.instagram}>Instagram</External>
                <External href={profile.facebook}>Facebook</External>
              </div>
              <a className="text-link" href="#home">Back to top <Icon name="arrow-up" size={16} /></a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
