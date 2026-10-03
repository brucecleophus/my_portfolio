(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const projects = document.querySelector('.project-grid');
  const cards = [...document.querySelectorAll('.project-card')];
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  document.querySelector('#year').textContent = new Date().getFullYear();

  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !expanded);
  });

  navLinks.forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('open');
  }));

  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = `#${visible.target.id}`;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));

    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const number = entry.target;
        const finalCount = Number(number.dataset.count);
        const suffix = number.dataset.suffix || '';
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / 850, 1);
          number.textContent = `${Math.round(finalCount * (1 - (1 - progress) ** 3))}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(number);
      });
    }, { threshold: 0.65 });
    document.querySelectorAll('[data-count]').forEach((number) => countObserver.observe(number));
  } else {
    document.querySelectorAll('[data-count]').forEach((number) => {
      number.textContent = `${number.dataset.count}${number.dataset.suffix || ''}`;
    });
  }

  const updateProjects = () => {
    const current = cards.indexOf(projects.firstElementChild);
    cards.forEach((card) => card.classList.toggle('is-mobile-active', card === projects.firstElementChild));
    dots.forEach((dot, index) => {
      const active = index === current;
      dot.classList.toggle('selected', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };
  const moveProject = (offset) => {
    const current = cards.indexOf(projects.firstElementChild);
    const target = cards[(current + offset + cards.length) % cards.length];
    while (projects.firstElementChild !== target) projects.append(projects.firstElementChild);
    updateProjects();
  };
  document.querySelector('.project-next').addEventListener('click', () => moveProject(1));
  document.querySelector('.project-prev').addEventListener('click', () => moveProject(-1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    const target = cards[index];
    while (projects.firstElementChild !== target) projects.append(projects.firstElementChild);
    updateProjects();
  }));
  updateProjects();
})();
