import type { ReactNode } from 'react';

export function OrbitMark({ size = 24 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="32" cy="32" r="27" />
    <ellipse cx="32" cy="32" rx="13" ry="27" transform="rotate(45 32 32)" />
    <ellipse cx="32" cy="32" rx="13" ry="27" transform="rotate(-45 32 32)" />
    <path d="M32 22v20m-10-10h20" />
    <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
  </svg>;
}

export function Icon({ name, size = 18 }: { name: 'arrow-up' | 'arrow-right' | 'arrow-down' | 'external' | 'file' | 'pin' | 'plus'; size?: number }) {
  const paths = {
    'arrow-up': 'M12 19V5m-6 6 6-6 6 6',
    'arrow-right': 'M5 12h14m-6-6 6 6-6 6',
    'arrow-down': 'M12 5v14m-6-6 6 6 6-6',
    external: 'M6 18 18 6M8 6h10v10',
    file: 'M14 3H6v18h12V7Zm0 0v5h4M9 12h6m-6 4h6',
    pin: 'M19 10c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Zm-7 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    plus: 'M12 5v14M5 12h14',
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}

export function Brand({ href = '#home' }: { href?: string }) {
  return (
    <a className="brand" href={href} aria-label="Human / System home">
      <svg aria-hidden="true" width="29" height="28" viewBox="0 0 32 28"><path d="M0 25 12 3h6L6 25zm13 0L25 3h6L19 25z" fill="currentColor" /></svg>
      <span>HUMAN<span className="brand-slash">/</span>SYSTEM</span>
    </a>
  );
}

export function Chapter({ number, title }: { number: string; title: string }) {
  return <p className="chapter"><span>{number}</span><span className="chapter-rule" aria-hidden="true" />{title}</p>;
}

export function External({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return <a className="text-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}<Icon name="external" size={16} /></a>;
}

export function Tags({ items, label = 'Technologies' }: { items: string[]; label?: string }) {
  return <ul className="tags" aria-label={label}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
