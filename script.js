/* =========================================================
   Ярослав Шинкарёв — интерактив
   ========================================================= */
(function () {
  'use strict';

  const TELEGRAM = 'https://t.me/Qwerrbevvv';

  /* ---- Год в подвале ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Прогресс-бар + фон навигации ---- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', scrolled > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Мобильное меню ---- */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  function closeMenu() {
    if (burger) burger.classList.remove('open');
    if (links) links.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (burger && links) {
    burger.addEventListener('click', function () {
      const open = burger.classList.toggle('open');
      links.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---- Плавная прокрутка (с учётом фикс-шапки) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 76;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- Reveal по мере прокрутки ---- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { el.classList.add('in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Лёгкий параллакс фото в hero ---- */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto && window.matchMedia('(pointer:fine)').matches) {
    const wrap = heroPhoto.parentElement;
    wrap.addEventListener('mousemove', function (e) {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroPhoto.style.transform = 'rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg)';
    });
    wrap.addEventListener('mouseleave', function () { heroPhoto.style.transform = ''; });
  }

  /* ---- Предзаполнение «Чем занимаетесь» из карточек услуг ---- */
  const aboutInput = document.getElementById('fAbout');
  document.querySelectorAll('[data-prefill]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (aboutInput) aboutInput.value = 'Интересует: ' + btn.getAttribute('data-prefill');
    });
  });

  /* ---- Форма заявки ---- */
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (document.getElementById('fName') || {}).value || '';
      const tg = (document.getElementById('fTg') || {}).value || '';
      const about = (document.getElementById('fAbout') || {}).value || '';

      if (!name.trim() || !tg.trim() || !about.trim()) {
        form.querySelectorAll('input').forEach(function (i) {
          if (!i.value.trim()) {
            i.style.borderColor = '#ff6b6b';
            setTimeout(function () { i.style.borderColor = ''; }, 1500);
          }
        });
        return;
      }

      if (success) success.classList.add('show');

      // Готовим сообщение для Telegram
      const text = encodeURIComponent(
        'Здравствуйте, Ярослав! Хочу разбор.\n' +
        'Имя: ' + name + '\n' +
        'Telegram: ' + tg + '\n' +
        about
      );

      setTimeout(function () {
        window.open(TELEGRAM + '?text=' + text, '_blank');
      }, 1600);
    });
  }
})();
