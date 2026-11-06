// Scroll scenes. Only loaded into action when the visitor has not asked for reduced motion.
// Only transform, opacity and clip-path are animated, plus one text gradient stop.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Where the front door sits in the facade photo, as a fraction of the image.
const DOOR = { x: 0.7, y: 0.76 };

// Screen position of the door, allowing for object-fit: cover cropping.
function doorPoint(frame: HTMLElement) {
  const image = frame.querySelector('img')!;
  const box = frame.getBoundingClientRect();
  const ratio = (image.naturalWidth || 3) / (image.naturalHeight || 4);
  const cover = Math.max(box.width / ratio, box.height);
  const drawnWidth = cover * ratio;
  const position = getComputedStyle(image).objectPosition.split(' ').map(parseFloat);
  const offsetX = (box.width - drawnWidth) * ((position[0] ?? 50) / 100);
  const offsetY = (box.height - cover) * ((position[1] ?? 50) / 100);
  return { x: offsetX + drawnWidth * DOOR.x, y: offsetY + cover * DOOR.y };
}

function openingScene() {
  const scene = document.querySelector<HTMLElement>('[data-scene="open"]')!;
  const frame = scene.querySelector<HTMLElement>('[data-facade]')!;
  const door = () => doorPoint(frame);

  gsap.set(frame, { transformOrigin: () => `${door().x}px ${door().y}px` });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
    })
    .to('[data-open-copy]', { opacity: 0, y: -50, duration: 0.14 }, 0)
    .to(scene.querySelector('.ghost'), { scale: 1.5, opacity: 0, duration: 0.3 }, 0)
    .to(
      frame,
      {
        scale: 13,
        x: () => innerWidth / 2 - (frame.getBoundingClientRect().left + door().x),
        y: () => innerHeight / 2 - (frame.getBoundingClientRect().top + door().y),
        ease: 'power2.in',
        duration: 0.5,
      },
      0.02,
    )
    .to('[data-lobby]', { opacity: 1, duration: 0.14 }, 0.4)
    .fromTo('[data-lobby-photo]', { scale: 1.28 }, { scale: 1, ease: 'power1.out', duration: 0.3 }, 0.4)
    .fromTo('[data-light]', { '--lit': '-10%' }, { '--lit': '110%', duration: 0.34 }, 0.6);
}

function roomsScene(media: gsap.MatchMedia) {
  media.add('(min-width: 1000px) and (pointer: fine)', () => {
    const scene = document.querySelector<HTMLElement>('[data-rooms]')!;
    const track = scene.querySelector<HTMLElement>('[data-track]')!;
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const size = () => {
      scene.style.height = `${innerHeight + distance()}px`;
    };

    document.documentElement.classList.add('sideways');
    size();
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true, onRefreshInit: size },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      document.documentElement.classList.remove('sideways');
      scene.style.removeProperty('height');
      gsap.set(track, { clearProps: 'transform' });
    };
  });
}

function eveningScene() {
  const scene = document.querySelector<HTMLElement>('[data-scene="evening"]')!;
  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
    .fromTo('[data-screen]', { clipPath: 'inset(49% 0% 49% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', duration: 0.5 }, 0)
    .fromTo('[data-screen] img', { scale: 1.3 }, { scale: 1, duration: 0.7 }, 0)
    .fromTo(scene.querySelector('.ghost'), { xPercent: 8 }, { xPercent: -8, duration: 1 }, 0)
    .fromTo('[data-evening-copy]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.42);
}

function morningScene() {
  const scene = document.querySelector<HTMLElement>('[data-scene="morning"]')!;
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });
  scene.querySelectorAll<HTMLElement>('[data-curtain]').forEach((curtain) => {
    timeline.fromTo(curtain, { xPercent: 0 }, { xPercent: Number(curtain.dataset.curtain) * 100, ease: 'power1.inOut', duration: 0.62 }, 0.04);
  });
  timeline
    .fromTo('[data-morning-photo]', { scale: 1.14 }, { scale: 1, duration: 0.7 }, 0)
    .fromTo('[data-morning-copy]', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.14 }, 0.5)
    .to({}, { duration: 0.3 }, 0.7);
}

function driftAndReveal() {
  gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((element) => {
    const amount = Number(element.dataset.drift);
    gsap.fromTo(
      element,
      { y: -amount },
      { y: amount, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 26,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 86%', once: true },
    });
  });
}

export function initScenes() {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  openingScene();
  roomsScene(media);
  eveningScene();
  morningScene();
  driftAndReveal();

  document.addEventListener('hotel:language', () => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
