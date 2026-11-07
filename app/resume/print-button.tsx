'use client';

import { Icon } from '../ui';

export function PrintButton() {
  return <button type="button" className="button primary" onClick={() => window.print()}>Print or save as PDF <Icon name="file" /></button>;
}
