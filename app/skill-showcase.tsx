import { OrbitMark, Tags } from './ui';

type SkillGroup = { id: string; title: string; items: string[] };

export function SkillShowcase({ groups }: { groups: SkillGroup[] }) {
  return (
    <fieldset className="skill-showcase">
      <legend>Skill categories</legend>
      {groups.map(({ id, title, items }, index) => (
        <div className="skill-choice" key={id}>
          <input type="radio" name="skill-category" id={`skill-${id}`} defaultChecked={index === 0} aria-controls={`skill-panel-${id}`} />
          <label htmlFor={`skill-${id}`}>{title}</label>
          <div className="skill-panel" id={`skill-panel-${id}`} data-skill={id}>
            <div className="skill-art" aria-hidden="true">
              <div className="skill-emblem"><OrbitMark size={124} /></div>
              <span>( 0{index + 1} )</span>
            </div>
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
