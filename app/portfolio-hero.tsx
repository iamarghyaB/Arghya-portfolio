import Image from 'next/image';
import { OrbitMark } from './ui';

const deckCards = [
  {
    style: 'deck-builder',
    angle: -57,
    row: 0,
    number: '01',
    label: 'THE BUILDER',
    caption: 'In the lab',
    image: 'deck-workspace.webp',
    alt: 'Arghya developing software in the computer lab',
  },
  {
    style: 'deck-portrait',
    angle: 0,
    row: 0,
    number: '02',
    featured: true,
    label: 'THE DEVELOPER',
    caption: 'Arghya Biswas',
    image: 'deck-portrait.webp',
    alt: 'Portrait of Arghya Biswas',
  },
  {
    style: 'deck-human',
    angle: 57,
    row: 0,
    number: '03',
    label: 'THE HUMAN',
    caption: 'Beyond code',
    image: 'deck-coast.webp',
    alt: 'Arghya on Saint Martin’s Island',
  },
  {
    style: 'deck-lab',
    angle: -77,
    row: -1,
    number: '04',
    label: 'THE LAB',
    caption: 'At the desk',
    image: 'deck-university-workbench.webp',
    alt: 'Arghya at a desktop computer in the university lab',
  },
  {
    style: 'deck-campus',
    angle: 69,
    row: -1,
    number: '05',
    label: 'CAMPUS LIFE',
    caption: 'On campus',
    image: 'deck-university-campus.webp',
    alt: 'Arghya in a red shirt at a university computer station',
  },
  {
    style: 'deck-coding',
    angle: -53,
    row: 1,
    number: '06',
    label: 'PRACTICE',
    caption: 'Writing code',
    image: 'deck-university-coding.webp',
    alt: 'Arghya writing code at a laptop',
  },
  {
    style: 'deck-study',
    angle: 65,
    row: 1,
    number: '07',
    label: 'THE STUDENT',
    caption: 'Study time',
    image: 'deck-university-study.webp',
    alt: 'Arghya studying with a book and notebook in the lab',
  },
];

const backgroundCards = [
  { style: 'deck-ocean', angle: -132, row: 0, image: 'deck-university-desk.webp', alt: 'Arghya’s reflection in a laptop beside a monitor showing code' },
  { style: 'deck-gold', angle: 178, row: -1, image: 'deck-university-classmates.webp', alt: 'Arghya and classmates working on laptops in the university lab' },
  { style: 'deck-rose', angle: 178, row: 1, image: 'deck-university-lab.webp', alt: 'Arghya in a plaid shirt working at a university desktop' },
  { style: 'deck-ember', angle: 132, row: 0, image: 'deck-university-events.webp', alt: 'A collage of Arghya and classmates at university events' },
];

function CardBack({ image }: { image: string }) {
  return (
    <div className="deck-back" aria-hidden="true">
      <Image src={`/images/${image}`} alt="" fill sizes="(max-width: 740px) 44vw, 220px" />
    </div>
  );
}

// Start the decorative opening before hydration on the first visit in a tab.
const playOpening = `(() => {
  const opening = document.currentScript?.previousElementSibling;
  if (!opening || location.hash || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    if (sessionStorage.getItem('portfolio-opening-v2')) return;
    sessionStorage.setItem('portfolio-opening-v2', '1');
  } catch {}
  const finish = () => {
    opening.removeAttribute('data-play');
    document.removeEventListener('focusin', finish);
  };
  opening.setAttribute('data-play', '');
  document.addEventListener('focusin', finish, { once: true });
  setTimeout(finish, 1000);
})();`;

export function Opening() {
  return (
    <>
      <div className="portfolio-opening" data-opening aria-hidden="true" suppressHydrationWarning>
        <div className="opening-top"><span>ARGHYA BISWAS</span><span>PERSONAL PORTFOLIO</span></div>
        <div className="opening-disc">
          <svg className="opening-orbit" viewBox="0 0 224 224" fill="none" aria-hidden="true">
            <circle cx="112" cy="112" r="109" />
            <circle cx="112" cy="112" r="102" />
            <circle className="opening-track" cx="112" cy="112" r="109" pathLength="1" />
          </svg>
          <OrbitMark size={30} />
          <span>Opening</span>
        </div>
        <div className="opening-bottom"><span>01 / PROFILE</span><span>02 / WORK</span><span>03 / PRACTICE</span></div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: playOpening }} />
    </>
  );
}

export function PortfolioHero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-heading">
          <h1 id="hero-title" aria-label="Arghya Biswas"><span data-title>Arghya</span>{' '}<span data-title>Biswas</span></h1>
        </div>

        <div className="deck-stage" data-deck-stage>
          <div className="deck-field" data-deck-field>
            {backgroundCards.map(({ style, angle, row, image, alt }) => (
              <figure className={`deck-slot deck-background ${style}`} key={style} data-card data-angle={angle} data-row={row}>
                <div className="deck-face">
                  <div className="deck-photo">
                    <Image src={`/images/${image}`} alt={alt} fill sizes="(max-width: 740px) 120px, 150px" />
                  </div>
                </div>
                <CardBack image={image} />
              </figure>
            ))}
            {deckCards.map((card) => (
              <figure className={`deck-slot ${card.style}`} key={card.number} data-card data-angle={card.angle} data-row={card.row}>
                <div className="deck-face">
                  <div className="deck-card-meta"><span>{card.label}</span><span>{card.number}</span></div>
                  <div className="deck-photo">
                    <Image src={`/images/${card.image}`} alt={card.alt} fill
                      sizes="(max-width: 640px) 42vw, 230px" loading={card.featured ? 'eager' : 'lazy'}
                      fetchPriority={card.featured ? 'high' : 'auto'} />
                  </div>
                  <figcaption><OrbitMark size={20} /> <span>{card.caption}</span></figcaption>
                </div>
                <CardBack image={card.image} />
              </figure>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
