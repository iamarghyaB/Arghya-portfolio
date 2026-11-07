'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { startHeroOrbit } from './hero-orbit';
import { Icon, OrbitMark } from './ui';

const navigation = [
  ['home', 'Home'],
  ['about', 'About'],
  ['work', 'Featured Work'],
  ['archive', 'Client Work'],
  ['my-projects', 'My Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
];

export function Navigation() {
  const [active, setActive] = useState('home');
  const dock = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sections = navigation.map(([id]) => document.getElementById(id));
    let frame = 0;

    function updateActive() {
      frame = 0;
      const threshold = window.innerHeight * 0.32;
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
      dock.current?.style.setProperty('--dock-progress', String(progress));
      dock.current?.toggleAttribute('data-visible', window.scrollY > window.innerHeight * 0.15);
      let current = 'home';
      let closestTop = -Infinity;
      for (const section of sections) {
        if (!section) continue;
        const top = section.getBoundingClientRect().top;
        if (top <= threshold && top > closestTop) {
          current = section.id;
          closestTop = top;
        }
      }
      setActive(current);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="chapter-dock" ref={dock}>
      <details ref={menu} onKeyDown={(event) => {
        if (event.key === 'Escape' && menu.current?.open) {
          menu.current.open = false;
          menu.current.querySelector('summary')?.focus();
        }
      }}>
        <summary aria-label="Chapter menu"><OrbitMark size={23} /></summary>
        <nav aria-label="Portfolio chapters" onClick={(event) => {
          if ((event.target as HTMLElement).closest('a') && menu.current) menu.current.open = false;
        }}>
          {navigation.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
          <a href="/resume/">Résumé <Icon name="external" size={14} /></a>
        </nav>
      </details>
      <a className="dock-action" href="#work">View work</a>
    </div>
  );
}

export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({
      animate: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 850px) and (min-height: 620px)',
    }, ({ conditions }) => {
      if (!conditions?.animate) return;

      if (window.scrollY < 80 && !window.location.hash) {
        const opening = document.querySelector<HTMLElement>('[data-opening]');
        const openingVisible = opening && getComputedStyle(opening).visibility === 'visible';
        gsap.from('[data-title]', {
          yPercent: 21, opacity: 0.28, stagger: 0.07, duration: 0.95,
          delay: openingVisible ? 0.23 : 0, ease: 'power3.out',
        });
      }

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        gsap.from(element, {
          y: 24,
          opacity: 0.66,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 91%', once: true },
        });
      });

      gsap.from('[data-draw]', {
        strokeDashoffset: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.system-diagram', start: 'top 84%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((line, index) => {
        if (line.getBoundingClientRect().top < window.innerHeight * 0.8) return;
        gsap.from(line, {
          x: (index % 2 === 0 ? 1 : -1) * (conditions.desktop ? 55 : 19),
          y: 14,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: { trigger: line.parentElement, start: 'top 90%', end: 'bottom 50%', scrub: 0.55 },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-sheet]').forEach((sheet) => {
        gsap.from(sheet, {
          y: conditions.desktop ? 80 : 30,
          scale: 0.96,
          rotation: conditions.desktop ? 2.2 : 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top 23%', scrub: 0.65 },
        });
      });

      gsap.from('[data-device]', {
        y: conditions.desktop ? 145 : 50,
        scale: 0.58,
        rotationY: -23,
        transformPerspective: 760,
        opacity: 0.5,
        ease: 'power1.out',
        scrollTrigger: { trigger: '.feature-chapter', start: 'top 88%', end: 'top 5%', scrub: 0.65 },
      });

      gsap.to('[data-device-ghost]', {
        y: -45,
        ease: 'none',
        scrollTrigger: { trigger: '.feature-chapter', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });

      return startHeroOrbit();
    });
    return () => media.revert();
  }, []);

  return null;
}
