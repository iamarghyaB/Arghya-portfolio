export const profile = {
  name: 'Arghya Biswas',
  role: 'Full-Stack Developer',
  location: 'Bangladesh',
  github: 'https://github.com/iamarghyaB',
  linkedin: 'https://www.linkedin.com/in/-biswas-arghya',
  studio: 'https://www.makezaa.com/',
  instagram: 'https://www.instagram.com/arghya477/',
  facebook: 'https://www.facebook.com/arghya477',
};

export const personalProjects = [
  {
    number: '01',
    slug: 'import-export-hub',
    name: 'Import Export Hub',
    type: 'Inventory management',
    summary: 'A full-stack app for discovering products, managing exports, and tracking inventory through authenticated workflows.',
    features: ['Searchable product catalog', 'Inventory quantity validation', 'Protected export management'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Tailwind CSS'],
    live: 'https://import-export-hub-arghya.netlify.app/',
    source: 'https://github.com/iamarghyaB/export-import-client',
  },
  {
    number: '02',
    slug: 'hero-io',
    name: 'Hero.io',
    type: 'App discovery',
    summary: 'A responsive app directory that makes it easy to explore mobile apps and compare ratings, reviews, and downloads.',
    features: ['Search and app detail pages', 'Interactive ratings charts', 'App-store links'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Recharts'],
    live: 'https://game-store-arghya.netlify.app/',
    source: 'https://github.com/iamarghyaB/game-store-Arghya',
  },
  {
    number: '03',
    slug: 'greennest',
    name: 'GreenNest',
    type: 'Plant care',
    summary: 'A plant discovery and care app with a searchable catalog, protected accounts, and consultation booking.',
    features: ['Search and catalog filters', 'Google and email sign-in', 'Care guidance and booking'],
    stack: ['React', 'Vite', 'Firebase', 'Tailwind CSS', 'DaisyUI'],
    live: 'https://greennest-arghya.netlify.app/',
    source: 'https://github.com/iamarghyaB/Green-nest',
  },
];

export const teamProjects = [
  {
    number: '01',
    slug: 'campusflow',
    name: 'CampusFlow',
    type: 'Bangladesh · Student productivity',
    summary: 'A digital companion for Bangladesh University students that brings schedules, exams, notifications, and bus tools together.',
    contribution: 'Makezaa team project · My role focused on marketing',
    stack: [],
    live: 'https://campusflow.makezaa.com/',
  },
  {
    number: '02',
    slug: 'an-noor',
    name: 'An-Noor',
    type: 'UK · Charity & donations',
    summary: 'A responsive charity website with online donation workflows and integrated payments.',
    contribution: 'Makezaa team delivery',
    stack: ['WordPress', 'Elementor Pro', 'WooCommerce', 'Stripe', 'PayPal'],
    live: 'https://annoor.co.uk/',
    source: 'https://www.makezaa.com/projects/an-noor-charity-donation-platform-with-payment-integration',
  },
  {
    number: '03',
    slug: 'golden-touch',
    name: 'Golden Touch Contractors',
    type: 'US · Business website',
    summary: 'A website for a New York roofing and exterior contractor, with clear service information, inquiry paths, and editable content.',
    contribution: 'Makezaa team delivery',
    stack: ['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript'],
    live: 'https://goldentouchcontractors.com/',
    source: 'https://www.makezaa.com/projects/golden-touch-contractors-wordpress-project',
  },
];

export const skillGroups = [
  { id: 'frontend', title: 'Frontend', items: ['React', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Vite', 'DaisyUI', 'React Router', 'Data visualization'] },
  { id: 'backend', title: 'Backend & data', items: ['Node.js', 'Express', 'REST APIs', 'MongoDB', 'Firebase Authentication', 'CRUD workflows'] },
  { id: 'delivery', title: 'Development & delivery', items: ['Git & GitHub', 'Debugging', 'Frontend–backend integration', 'Netlify', 'Vercel'] },
  { id: 'product', title: 'Product & collaboration', items: ['Feature planning', 'Usability', 'Client communication', 'SEO', 'Digital marketing'] },
];

export const process = [
  ['Understand the problem', 'Talk through who will use the product, what they need to accomplish, and where their current workflow gets in the way.'],
  ['Define requirements', 'Agree on the essential user flows, the constraints, and what a useful first version needs to do.'],
  ['Plan the application', 'Map the interface, data model, and API boundaries around those flows. Identify the decisions that will be expensive to change later.'],
  ['Build interfaces and services', 'Connect the UI to the backend in working increments so the important paths can be tested early.'],
  ['Test and refine', 'Check failure states, validation, responsiveness, and accessibility alongside the expected user journeys.'],
  ['Deliver and improve', 'Deploy, gather feedback, and use what people actually do with the product to decide what to improve next.'],
];
