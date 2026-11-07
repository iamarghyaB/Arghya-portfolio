'use client';

import { useState } from 'react';
import { Icon } from './ui';

const nodes = [
  { id: '01', label: 'Client', caption: 'REQUEST', detail: 'The browser requests a resource over HTTP. Pagination and a small response payload keep the interface responsive.' },
  { id: '02', label: 'API', caption: 'VALIDATE', detail: 'The API checks access and validates the request. For cacheable reads, it looks for a fresh cached response before querying persistent storage.' },
  { id: '03', label: 'Cache', caption: 'CHECK FIRST', detail: 'A cache hit saves a database round trip. Expiration and invalidation rules determine how long the response can safely be reused.' },
  { id: '04', label: 'Database', caption: 'ON CACHE MISS', detail: 'On a cache miss, the API queries the source of truth. Indexes can speed up frequent reads at the cost of storage and write overhead.' },
];

export function SystemDiagram() {
  const [active, setActive] = useState(0);
  const node = nodes[active];

  return (
    <div className="system-diagram" data-reveal>
      <div className="diagram-top"><span><span className="signal-dot" /> STUDY 01 / CACHE-ASIDE READ</span><span>CONCEPTUAL ARCHITECTURE</span></div>
      <div className="diagram-flow">
        {nodes.map(({ id, label, caption }, index) => (
          <button key={id} type="button" className={`diagram-node diagram-node-${id}`} aria-pressed={active === index} onClick={() => setActive(index)}>
            <span className="diagram-node-id">{id} / {caption}</span>
            <span>{label}</span>
            <Icon name="plus" size={14} />
          </button>
        ))}
        <svg className="diagram-connector diagram-request" aria-hidden="true" viewBox="0 0 48 12" preserveAspectRatio="none">
          <path data-draw pathLength="1" d="M0 6h46m-5-4 5 4-5 4" />
        </svg>
        <svg className="diagram-connector diagram-branch" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path data-draw pathLength="1" d="M0 50h30v-25h68m-6-4 6 4-6 4" />
          <path data-draw pathLength="1" d="M30 50v25h68m-6-4 6 4-6 4" />
        </svg>
        <svg className="diagram-connector diagram-branch-mobile" aria-hidden="true" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path data-draw pathLength="1" d="M77 0v29m-2-4 2 4 2-4" />
          <path data-draw pathLength="1" d="M77 13H23v16m-2-4 2 4 2-4" />
        </svg>
      </div>
      <div className="diagram-path"><p><span>CACHE HIT</span> → API returns the cached value</p><p><span>CACHE MISS</span> → API reads the database</p></div>
      <div className="diagram-detail" aria-live="polite">
        <span>{node.id} / {node.label}</span>
        <p>{node.detail}</p>
      </div>
    </div>
  );
}
