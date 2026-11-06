// Everything here works without the scroll scenes: form, menu, clock and language switch.

const iso = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-book]');
  if (!form) return;
  const today = new Date();
  const checkin = form.elements.namedItem('checkin') as HTMLInputElement;
  const checkout = form.elements.namedItem('checkout') as HTMLInputElement;
  checkin.min = iso(today);
  checkin.value = iso(addDays(today, 1));
  checkout.min = iso(addDays(today, 2));
  checkout.value = iso(addDays(today, 2));
  checkin.addEventListener('change', () => {
    if (!checkin.value) return;
    const earliest = iso(addDays(new Date(`${checkin.value}T12:00:00`), 1));
    checkout.min = earliest;
    if (!checkout.value || checkout.value <= checkin.value) checkout.value = earliest;
  });
}

function initMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('.menu');
  menu?.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => menu.removeAttribute('open')),
  );
}

// The clock shows the moment of the stay for whichever scene crosses mid-screen.
function initClock() {
  const clock = document.querySelector<HTMLElement>('[data-clock]');
  const scenes = [...document.querySelectorAll<HTMLElement>('main [data-scene], main .morning-extra')];
  if (!clock || !scenes.length) return () => {};
  const update = () => {
    const line = innerHeight * 0.5;
    let current = scenes[0];
    for (const scene of scenes) {
      if (scene.getBoundingClientRect().top <= line) current = scene;
    }
    const time = current.dataset.time;
    if (time && clock.textContent !== time) clock.textContent = time;
  };
  let queued = false;
  addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    },
    { passive: true },
  );
  update();
  return update;
}

// Both builds share one DOM shape, so the page swaps text and attributes in place.
function initLanguage(onSwap: () => void) {
  const options = [...document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch] a')];
  const pages = new Map<string, Promise<Document>>();

  const load = (link: HTMLAnchorElement) => {
    if (!pages.has(link.href)) {
      const page = fetch(link.href)
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.text();
        })
        .then((html) => new DOMParser().parseFromString(html, 'text/html'));
      page.catch(() => pages.delete(link.href));
      pages.set(link.href, page);
    }
    return pages.get(link.href)!;
  };

  const textNodes = (root: HTMLElement) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest('script, style, [data-live]')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    const nodes: Node[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };

  const swap = (next: Document) => {
    const currentText = textNodes(document.body);
    const nextText = textNodes(next.body);
    const current = [...document.body.querySelectorAll('*')];
    const incoming = [...next.body.querySelectorAll('*')];
    if (currentText.length !== nextText.length || current.length !== incoming.length) return false;
    currentText.forEach((node, index) => {
      node.nodeValue = nextText[index].nodeValue;
    });
    current.forEach((element, index) => {
      if (element.closest('[data-lang]')) return;
      for (const name of ['alt', 'aria-label', 'href', 'action', 'data-time']) {
        const value = incoming[index].getAttribute(name);
        if (value !== null) element.setAttribute(name, value);
      }
    });
    document.documentElement.lang = next.documentElement.lang;
    document.title = next.title;
    const description = next.querySelector('meta[name="description"]')?.getAttribute('content');
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    onSwap();
    document.dispatchEvent(new CustomEvent('hotel:language'));
    return true;
  };

  options.forEach((link) => {
    link.addEventListener('pointerenter', () => load(link).catch(() => {}));
    link.addEventListener('focus', () => load(link).catch(() => {}));
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      if (link.hasAttribute('aria-current')) return;
      try {
        if (!swap(await load(link))) throw new Error('layout mismatch');
        options.forEach((option) => option.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
      } catch {
        location.href = link.href;
      }
    });
  });
}

export function initPage() {
  initForm();
  initMenu();
  const updateClock = initClock();
  initLanguage(updateClock);
}
