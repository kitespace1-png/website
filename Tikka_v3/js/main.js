(function () {
  const cats = Object.keys(menuData);
  const total = cats.reduce((n, c) => n + menuData[c].length, 0);
  const el = id => document.getElementById(id);
  const mk = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };

  // hero stat + marquee
  el('statItems').innerHTML = total + '<em>+</em>';
  const names = cats.flatMap(c => menuData[c].slice(0, 2).map(i => i.name.replace(/\s*\((GF|DF|VG|V)\)/g, '')));
  const track = el('marquee');
  [...names, ...names].forEach(n => {
    const d = mk('div', 'mqitem'); d.innerHTML = '<i class="fas fa-circle"></i>'; d.append(n); track.appendChild(d);
  });

  // image helper with placeholder fallback
  function image(item) {
    const img = document.createElement('img');
    img.alt = item.name; img.loading = 'lazy'; img.src = item.image_url;
    img.addEventListener('error', () => { img.src = 'https://placehold.co/600x400?text=' + encodeURIComponent(item.name); }, { once: true });
    return img;
  }

  // categories + tabs
  let active = 'All';
  const catWrap = el('categories'), tabs = el('tabs'), grid = el('menu-grid');

  function setActive(cat, scroll) {
    active = cat;
    document.querySelectorAll('.catcard').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
    renderMenu();
    if (scroll) el('menu').scrollIntoView({ behavior: 'smooth' });
  }

  ['All', ...cats].forEach(c => {
    const first = c === 'All' ? menuData[cats[0]][0] : menuData[c][0];
    const card = mk('div', 'catcard'); card.dataset.cat = c;
    card.append(image(first), mk('div', 'catnm', c === 'All' ? 'All Items' : c), mk('div', 'catct', (c === 'All' ? total : menuData[c].length) + ' items'));
    card.addEventListener('click', () => setActive(c, true));
    catWrap.appendChild(card);

    const tab = mk('button', 'tab', c); tab.dataset.cat = c; tab.type = 'button';
    tab.addEventListener('click', () => setActive(c, false));
    tabs.appendChild(tab);
  });

  function renderMenu() {
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    (active === 'All' ? cats : [active]).forEach(cat => menuData[cat].forEach(item => {
      const card = mk('div', 'mcard');
      const imgWrap = mk('div', 'mimg');
      imgWrap.append(image(item), mk('span', 'mprice', '$' + item.price.toFixed(2)));
      if (item.tags && item.tags[0]) imgWrap.appendChild(mk('span', 'mtag', item.tags[0]));
      const body = mk('div', 'mbody');
      body.append(mk('div', 'mcat', cat), mk('h4', 'mname', item.name), mk('p', 'mdesc', item.description || 'A delicious selection of Indian cuisine.'));
      if (item.rating) body.appendChild(mk('span', 'mrate', '👍 ' + item.rating));
      card.append(imgWrap, body);
      frag.appendChild(card);
    }));
    grid.appendChild(frag);
  }
  setActive('All', false);

  // nav toggle
  const links = el('links');
  el('toggler').addEventListener('click', () => links.classList.toggle('open'));
  links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });

  // reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    items.forEach(i => io.observe(i));
  } else items.forEach(i => i.classList.add('in'));

  // contact form -> opens the visitor's email app (no backend needed)
  el('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const body = 'Name: ' + el('cn').value + '\nEmail: ' + el('ce').value + '\n\n' + el('cm').value;
    location.href = 'mailto:hello@tikkaofindia.com.au?subject=' + encodeURIComponent('Website enquiry from ' + el('cn').value) + '&body=' + encodeURIComponent(body);
  });

  el('year').textContent = new Date().getFullYear();
})();
