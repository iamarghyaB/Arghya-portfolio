import Image from 'next/image';
import { OrbitMark, Tags } from './ui';

type SkillGroup = { id: string; title: string; items: string[] };

const skillPhotos: Partial<Record<string, { src: string; alt: string }>> = {
  frontend: { src: '/images/skill-frontend.webp', alt: 'Arghya writing code with a code editor open on his monitor' },
  backend: { src: '/images/skill-backend.webp', alt: 'Arghya working at a desktop computer in the university lab' },
  delivery: { src: '/images/skill-delivery.webp', alt: 'Arghya working alongside classmates on laptops in the lab' },
};

export function SkillShowcase({ groups }: { groups: SkillGroup[] }) {
  return (
    <fieldset className="skill-showcase">
      <legend>Skill categories</legend>
      {groups.map(({ id, title, items }, index) => (
        <div className="skill-choice" key={id}>
          <input type="radio" name="skill-category" id={`skill-${id}`} defaultChecked={index === 0} aria-controls={`skill-panel-${id}`} />
          <label htmlFor={`skill-${id}`}>{title}</label>
          <div className="skill-panel" id={`skill-panel-${id}`} data-skill={id}>
            <SkillArtwork photo={skillPhotos[id]} number={index + 1} />
            <div className="skill-description">
              <h3>{title}</h3>
              <Tags items={items} label="Skills" />
            </div>
          </div>
        </div>
      ))}
    </fieldset>
  );
}

function SkillArtwork({ photo, number }: { photo?: { src: string; alt: string }; number: number }) {
  return (
    <div className="skill-art">
      {photo ? (
        <div className="skill-photo">
          <Image {...photo} fill sizes="(max-width: 440px) 90vw, 400px" />
        </div>
      ) : <div className="skill-emblem" aria-hidden="true"><OrbitMark size={124} /></div>}
      <span aria-hidden="true">( {String(number).padStart(2, '0')} )</span>
    </div>
  );
}
