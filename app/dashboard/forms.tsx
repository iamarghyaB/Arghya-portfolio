'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import type { ProjectEntry, ProjectFields, SkillEntry } from '../content';
import { skillGroups } from '../portfolio';
import { Icon } from '../ui';
import type { WorkCategory } from '../work-categories';
import { publishProject, publishSkill, signIn } from './actions';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className="button primary" type="submit" disabled={pending}>
    {pending ? 'Working…' : label} <Icon name="arrow-right" size={17} />
  </button>;
}

function FormError({ error }: { error: string }) {
  return error ? <p className="dash-error" role="alert">{error}</p> : null;
}

export function SignInForm() {
  const [error, action] = useActionState(signIn, '');
  return (
    <form className="dash-form" action={action}>
      <label>Dashboard password
        <input type="password" name="password" autoComplete="current-password" maxLength={1024} required />
      </label>
      <FormError error={error} />
      <Submit label="Sign in" />
    </form>
  );
}

const emptyProject: Omit<ProjectFields, 'category'> = {
  name: '', type: '', summary: '', details: '', clientName: '', role: '', technologies: '', live: '', source: '',
};

export function ProjectForm({ project, initialCategory }: { project?: ProjectEntry; initialCategory: WorkCategory }) {
  const [values, setValues] = useState<ProjectFields>(project ?? { ...emptyProject, category: initialCategory });
  const [error, action] = useActionState(publishProject, '');

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  return (
    <form className="dash-form" action={action}>
      {project && <input type="hidden" name="id" value={project.id} />}
      <label>Publish under
        <select name="category" value={values.category}
          onChange={(event) => setValues({ ...values, category: event.target.value === 'personal' ? 'personal' : 'client' })}>
          <option value="client">Client Work</option>
          <option value="personal">Personal Project</option>
        </select>
      </label>
      <div className="dash-fields">
        <label>Project name
          <input name="name" value={values.name} onChange={update} placeholder="e.g. Studio Inventory" maxLength={80} required />
        </label>
        <label>Project type
          <input name="type" value={values.type} onChange={update} placeholder="e.g. Full-stack application" maxLength={60} required />
        </label>
      </div>
      <div className="dash-fields">
        {values.category === 'client' && (
          <label>Client name <small>Optional · shown publicly</small>
            <input name="clientName" value={values.clientName} onChange={update} maxLength={100} />
          </label>
        )}
        <label>Your role <small>Optional</small>
          <input name="role" value={values.role} onChange={update} placeholder="e.g. Full-stack developer" maxLength={100} />
        </label>
      </div>
      <label>Summary
        <textarea name="summary" value={values.summary} onChange={update} placeholder="What did you build, and what problem does it solve?" maxLength={420} rows={3} required />
      </label>
      <label>Project details <small>Optional</small>
        <textarea name="details" value={values.details} onChange={update} maxLength={4000} rows={6}
          placeholder="Describe the goal, your approach, and what you delivered." />
      </label>
      <label>Technologies <small>Optional · separate with commas</small>
        <input name="technologies" value={values.technologies} onChange={update} placeholder="Next.js, TypeScript, PostgreSQL" maxLength={180} />
      </label>
      <div className="dash-fields">
        <label>Live URL <small>Optional</small>
          <input name="live" type="url" value={values.live} onChange={update} placeholder="https://…" maxLength={500} />
        </label>
        <label>Repository URL <small>Optional</small>
          <input name="source" type="url" value={values.source} onChange={update} placeholder="https://…" maxLength={500} />
        </label>
      </div>
      <label>{project?.hasImage ? 'Replace screenshot' : 'Screenshot'} <small>Optional · PNG, JPEG, or WebP · up to 3 MB</small>
        <input name="screenshot" type="file" accept="image/png,image/jpeg,image/webp" />
      </label>
      {Boolean(project?.hasImage) && <label className="dash-check"><input type="checkbox" name="removeImage" /> Remove current screenshot</label>}
      <FormError error={error} />
      <div className="dash-form-actions">
        <Submit label={project ? 'Save project changes' : 'Publish project'} />
        {project && <a className="text-link" href="/dashboard/#projects">Cancel</a>}
      </div>
    </form>
  );
}

export function SkillForm({ skill }: { skill?: SkillEntry }) {
  const [name, setName] = useState(skill?.name ?? '');
  const [group, setGroup] = useState(skill?.group ?? skillGroups[0].id);
  const [error, action] = useActionState(publishSkill, '');
  return (
    <form className="dash-form" action={action}>
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <label>Skill name
        <input name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. TypeScript" maxLength={60} required />
      </label>
      <label>Skill group
        <select name="group" value={group} onChange={(event) => setGroup(event.target.value)}>
          {skillGroups.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
        </select>
      </label>
      <FormError error={error} />
      <div className="dash-form-actions">
        <Submit label={skill ? 'Save skill changes' : 'Publish skill'} />
        {skill && <a className="text-link" href="/dashboard/#skills">Cancel</a>}
      </div>
    </form>
  );
}
