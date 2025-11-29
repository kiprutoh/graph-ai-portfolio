// assets/app.js
(function () {
  const btn = document.querySelector('[data-menu-btn]');
  const drawer = document.querySelector('[data-drawer]');
  if (btn && drawer) {
    btn.addEventListener('click', () => {
      const open = drawer.getAttribute('data-open') === 'true';
      drawer.setAttribute('data-open', String(!open));
      drawer.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!open));
    });
  }

  // Highlight current page link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
