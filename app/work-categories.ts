export const workCategories = [
  { id: 'client', label: 'Client Work', anchor: 'archive' },
  { id: 'personal', label: 'My Projects', anchor: 'my-projects' },
] as const;

export type WorkCategory = typeof workCategories[number]['id'];
