import type { Metadata } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/bodoni-moda';
import '@fontsource-variable/bodoni-moda/wght-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Arghya Biswas — Human / System', template: '%s | Arghya Biswas' },
  description: 'Portfolio of Arghya Biswas, a full-stack MERN developer in Bangladesh. Explore personal projects, Makezaa collaborations, and his ongoing study of system design.',
  openGraph: {
    title: 'Arghya Biswas — Human / System',
    description: 'Full-stack developer, product-minded builder, and student of system design.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
