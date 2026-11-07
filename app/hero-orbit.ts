import { gsap } from 'gsap';

const radians = Math.PI / 180;
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

function smoothStep(start: number, end: number, value: number) {
  const t = gsap.utils.clamp(0, 1, (value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function startHeroOrbit() {
  const hero = document.getElementById('home');
  const stage = hero?.querySelector<HTMLElement>('[data-deck-stage]');
  const heading = hero?.querySelector<HTMLElement>('.hero-heading');
  const cards = Array.from(hero?.querySelectorAll<HTMLElement>('[data-card]') ?? []);
  if (!hero || !stage || !heading || !cards.length) return;

  const mobile = window.matchMedia('(max-width: 740px)');

  function measure() {
    const openingOffset = mobile.matches && stage ? stage.clientHeight * .10 : 0;
    return cards.map((card, index) => {
      const style = getComputedStyle(card);
      const read = (name: string, fallback = 0) => parseFloat(style.getPropertyValue(name)) || fallback;
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      return {
        card, width, height,
        x: width * read('--x') / 100,
        y: height * read('--y') / 100 + openingOffset,
        z: (read('--layer', 1) - 4) * 5,
        yaw: read('--yaw'),
        roll: read('--roll'),
        scale: read('--scale', 1),
        angle: Number(card.dataset.angle),
        row: Number(card.dataset.row),
        stackOffset: index - (cards.length - 1) / 2,
      };
    });
  }

  hero.dataset.orbit = '';
  let layout = measure();
  const displayedYaw = layout.map(({ yaw }) => yaw);
  const wrapAngle = gsap.utils.wrap(-180, 180);
  let narrow = mobile.matches;
  const state = { progress: 0 };
  let seconds = 0;
  let turn = 0;
  let lastFade = -1;
  let lastProgress = -1;
  let playing = false;

  const render = (_time: number, delta: number) => {
    const p = state.progress;
    const fade = 1 - smoothStep(.57, 1, p);
    if (fade !== lastFade) {
      stage.style.opacity = String(fade);
      stage.style.visibility = fade > 0 ? 'visible' : 'hidden';
      lastFade = fade;
    }
    if (fade === 0) {
      setPlaying(false);
      return;
    }
    if (document.hidden) return;

    seconds += delta / 1000;
    const open = Math.max(smoothStep(.45, 2.5, seconds), smoothStep(0, .28, p));
    const gather = smoothStep(.23, .88, p);
    const radius = 1 - gather;
    turn += delta * .018 * smoothStep(.45, 1.8, seconds) * radius;
    if (p !== lastProgress) {
      stage.style.setProperty('--deck-mask-start', `${mix(78, 43, gather)}%`);
      stage.style.setProperty('--deck-mask-end', `${mix(100, 69, gather)}%`);
      lastProgress = p;
    }

    // Cards move around the camera as the orbit contracts into a short deck.
    for (const [index, entry] of layout.entries()) {
      const angle = (entry.angle - turn - 112 * p) * radians;
      const across = Math.sin(angle);
      const depth = Math.cos(angle);
      const x = entry.width * across * (narrow ? 2.34 : 2.25) * radius + entry.stackOffset * gather * 1.4;
      const y = (entry.height * entry.row * (narrow ? .85 : .73) - entry.width * across * .24) * radius
        - entry.height * gather * .09
        + entry.stackOffset * gather * .7;
      const z = entry.width * (depth * .75 - .28) * radius + (entry.z + entry.stackOffset * .12) * gather;
      const distance = mix(entry.z, z, open);
      const targetYaw = Math.atan2(across * radius, depth * radius + gather * 1.9) / radians;
      const openingYaw = entry.yaw + wrapAngle(targetYaw - entry.yaw) * open;
      const remainingTurn = wrapAngle(openingYaw - displayedYaw[index]);
      displayedYaw[index] += gsap.utils.clamp(-.55 * delta, .55 * delta, remainingTurn);
      const roll = mix(across * 6, entry.stackOffset * .55, gather);
      const orbitScale = entry.row === 0 ? (narrow ? 1.38 : .92) : (narrow ? .96 : .70);
      const scale = mix(orbitScale, narrow ? 1.14 : .89, gather);

      // Paint each card as a unit so overlapping corners do not cut through its neighbours.
      entry.card.style.zIndex = String(Math.round(distance * 10));
      entry.card.style.transform = [
        `translate3d(calc(-50% + ${mix(entry.x, x, open)}px), calc(-50% + ${mix(entry.y, y, open)}px), ${distance}px)`,
        `rotateY(${displayedYaw[index]}deg)`,
        `rotateZ(${mix(entry.roll, roll, open)}deg)`,
        `scale(${mix(entry.scale, scale, open)})`,
      ].join(' ');
    }
  };

  function setPlaying(next: boolean) {
    if (playing === next) return;
    playing = next;
    if (playing) gsap.ticker.add(render);
    else gsap.ticker.remove(render);
  }

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * .78)}`,
      scrub: .38,
      onRefresh: () => {
        layout = measure();
        narrow = mobile.matches;
      },
    },
  })
    .to(state, { progress: 1, duration: 1, onUpdate: () => setPlaying(true) }, 0)
    .to(heading, { y: -40, scale: .64, opacity: 0, duration: .32 }, 0);

  setPlaying(true);
  return () => {
    setPlaying(false);
    delete hero.dataset.orbit;
    stage.style.removeProperty('opacity');
    stage.style.removeProperty('visibility');
    stage.style.removeProperty('--deck-mask-start');
    stage.style.removeProperty('--deck-mask-end');
    cards.forEach((card) => {
      card.style.removeProperty('transform');
      card.style.removeProperty('z-index');
    });
  };
}
