(() => {
  'use strict';
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const observed = document.querySelectorAll('.section, .principle-card, .expertise-card, .experience-item, .research-feature, .research-secondary, .education-card, .award-grid>div');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    observed.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

    const sectionIds = ['about', 'expertise', 'experience', 'research', 'education', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.querySelectorAll('a').forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) {
      if (formNote) formNote.textContent = 'Please complete all fields before preparing your email.';
      return;
    }
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply email: ${email}`);
    if (formNote) formNote.textContent = 'Your email application should open with the message prepared. Please review and send it there.';
    window.location.href = `mailto:lakshminath.p@northeastern.edu?subject=${subject}&body=${body}`;
  });
})();