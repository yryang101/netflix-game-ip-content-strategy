document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sectionLinks = [...document.querySelectorAll('[data-section]')];
  const sections = sectionLinks
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);

  const setActiveSection = (id) => {
    sectionLinks.forEach((link) => {
      const active = link.dataset.section === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if (sections.length) {
    const initialId = window.location.hash.slice(1);
    if (sections.some((section) => section.id === initialId)) {
      setActiveSection(initialId);
      requestAnimationFrame(() => {
        document.getElementById(initialId).scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }

    sectionLinks.forEach((link) => {
      link.addEventListener('click', () => setActiveSection(link.dataset.section));
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.1, 0.4] });

    sections.forEach((section) => observer.observe(section));
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-print]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });
});
