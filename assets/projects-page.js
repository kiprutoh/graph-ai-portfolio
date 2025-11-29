// assets/projects-page.js
(function () {
  const list = window.PROJECTS || [];
  const grid = document.getElementById('projectsGrid');
  const search = document.getElementById('searchInput');
  const chips = document.getElementById('chips');
  const count = document.getElementById('resultCount');

  if (!grid) return;

  const allTags = Array.from(new Set(list.flatMap(p => p.tags || []))).sort((a,b) => a.localeCompare(b));
  let activeTag = "All";

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === 'class') node.className = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== '') node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function makeBtn(label, url) {
    if (!url) return null;
    return el('a', { class: 'btn btn-sm', href: url, target: '_blank', rel: 'noopener' }, label);
  }

  function render(items) {
    grid.innerHTML = "";
    items.forEach(p => {
      const tagRow = el('div', { class: 'meta' }, (p.tags || []).map(t => el('span', { class:'tag' }, t)));

      const pic = el('img', { src: p.thumbnail || '', alt: p.title ? `${p.title} thumbnail` : 'Project thumbnail' });
      const thumb = el('div', { class:'thumb' }, pic);

      const actions = el('div', { class:'project-actions' }, [
        makeBtn('View', p.viewUrl),
        makeBtn('Read', p.readUrl),
        makeBtn('Demo', p.demoUrl),
      ].filter(Boolean));

      const body = el('div', { class:'project-body' }, [
        tagRow,
        el('h3', { class:'project-title' }, p.title || 'Untitled project'),
        el('p', { class:'project-desc' }, p.description || ''),
        actions
      ]);

      const card = el('article', { class:'card project-card' }, [thumb, body]);
      grid.appendChild(card);
    });

    if (count) count.textContent = `${items.length} project${items.length === 1 ? '' : 's'}`;
  }

  function filter() {
    const q = (search?.value || '').trim().toLowerCase();
    let items = list.slice();

    if (activeTag !== "All") {
      items = items.filter(p => (p.tags || []).includes(activeTag));
    }

    if (q) {
      items = items.filter(p => {
        const hay = [
          p.title || "",
          p.description || "",
          (p.tags || []).join(" ")
        ].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }

    render(items);
  }

  // Build chips
  if (chips) {
    chips.innerHTML = "";
    const tags = ["All", ...allTags];
    tags.forEach(t => {
      const chip = el('button', {
        type: 'button',
        class: 'chip',
        'data-active': String(t === activeTag),
        onclick: () => {
          activeTag = t;
          Array.from(chips.children).forEach(c => c.setAttribute('data-active', String(c.textContent === activeTag)));
          filter();
        }
      }, t);
      chips.appendChild(chip);
    });
  }

  if (search) search.addEventListener('input', filter);

  render(list);
})();
