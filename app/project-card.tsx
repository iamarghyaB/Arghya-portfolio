import Image from 'next/image';
import { External, Icon, OrbitMark, Tags } from './ui';

type Project = {
  name: string;
  type: string;
  summary: string;
  number?: string;
  stack: string[];
  live?: string;
  source?: string;
  features?: string[];
  contribution?: string;
  details?: string;
  clientName?: string;
  role?: string;
};

export function ProjectCard({ project, image, featured = false, sourceLabel = 'Source code' }: {
  project: Project;
  image?: { src: string; alt: string };
  featured?: boolean;
  sourceLabel?: string;
}) {
  const screenshot = image && (
    <Image src={image.src} alt={image.alt} fill
      sizes={featured ? '245px' : '(max-width: 740px) 40vw, 24vw'} />
  );
  const preview = featured ? (
    <>
      {screenshot ?? <div className="device-title" aria-hidden="true"><OrbitMark size={29} /><span>{project.type}</span><strong>{project.name}</strong></div>}
      <span className="device-camera" aria-hidden="true" />
      <span className="device-home-bar" aria-hidden="true" />
    </>
  ) : screenshot;

  return (
    <article className={featured ? 'project featured' : 'project'} data-reveal={featured ? undefined : ''}>
      <div className="project-title">
        <p className="project-meta">{project.number && <span>{project.number} / </span>}{project.type}</p>
        <h3>{project.name}</h3>
      </div>
      {(featured || image) && <div className="project-media" data-device={featured ? '' : undefined}>
        {project.live ? (
          <a className="project-image" href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Open the live ${project.name} project`}>
            {preview}
            <span className="image-arrow"><Icon name="external" size={22} /></span>
          </a>
        ) : <div className="project-image">{preview}</div>}
      </div>}
      <div className="project-copy">
        <p>{project.summary}</p>
        {project.contribution && <p className="project-meta project-credit">{project.contribution}</p>}
        {project.clientName && <p className="project-meta project-credit">Client · {project.clientName}</p>}
        {project.role && <p className="project-meta project-credit">My role · {project.role}</p>}
        {(project.details || Boolean(project.features?.length)) && (
          <details className="project-details">
            <summary>Project details</summary>
            {project.details && <p>{project.details}</p>}
            {project.features && <ul className="project-features">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>}
          </details>
        )}
        {project.stack.length > 0 && <Tags items={project.stack} />}
        {(project.live || project.source) && (
          <div className="project-links">
            {project.live && <External href={project.live} label={`Live demo of ${project.name}`}>Live demo</External>}
            {project.source && <External href={project.source} label={`${sourceLabel} for ${project.name}`}>{sourceLabel}</External>}
          </div>
        )}
      </div>
    </article>
  );
}
