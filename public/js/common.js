// Utilidades compartilhadas
const I = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  heart: '<svg viewBox="0 0 32 32"><path d="M16 28c7-4.7 14-10 14-17 0-3.9-3-7-6.7-7-2.6 0-4.9 1.5-6.1 3.7L16 9.3l-1.2-1.6C13.6 5.5 11.3 4 8.7 4 5 4 2 7.1 2 11c0 7 7 12.3 14 17z"/></svg>',
  left: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"/></svg>',
  right: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="4"><path d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"/></svg>',
  user: '<svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 .7a15.3 15.3 0 1 1 0 30.6A15.3 15.3 0 0 1 16 .7zm0 20c-3.4 0-6.5 1.3-8.8 3.6a12.3 12.3 0 0 0 17.6 0A12.3 12.3 0 0 0 16 20.7zm0-15a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>',
  menu: '<svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M2 16h28M2 24h28M2 8h28"/></svg>',
  grid: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><rect x="1" y="1" width="4" height="4" rx="1"/><rect x="6" y="1" width="4" height="4" rx="1"/><rect x="11" y="1" width="4" height="4" rx="1"/><rect x="1" y="6" width="4" height="4" rx="1"/><rect x="6" y="6" width="4" height="4" rx="1"/><rect x="11" y="6" width="4" height="4" rx="1"/><rect x="1" y="11" width="4" height="4" rx="1"/><rect x="6" y="11" width="4" height="4" rx="1"/><rect x="11" y="11" width="4" height="4" rx="1"/></svg>',
  share: '<svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M27 18v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9M16 3v19M9 10l7-7 7 7"/></svg>',
  x: '<svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 6 20 20M26 6 6 26"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>',
  // categorias
  all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/></svg>',
  beds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M2 19v-6h9v6M2 16h9M13 19v-6h9v6M13 16h9M4 13v-2.5h5V13M15 13v-2.5h5V13"/></svg>',
  apt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 21V3h10v18M15 9h4v12M3 21h18M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1"/></svg>',
  house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 11 12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6"/></svg>',
  studio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 13h8V8M15 9h3"/></svg>',
  // destaques
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
};

const AMENITIES = {
  'Wi-Fi': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/></svg>',
  'Cozinha': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M8 6h.01M12 6h.01"/><circle cx="12" cy="15" r="3"/></svg>',
  'Máquina de lavar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M8 5.5h.01M11 5.5h3"/></svg>',
  'Secadora': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M10 13a2 2 0 0 1 4 0"/></svg>',
  'Aquecimento': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M12 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M16 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M4 21h16"/></svg>',
  'Escrivaninha': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9h18M5 9v11M19 9v11M14 9v6h5"/><path d="M8 9V5h5v4"/></svg>',
  'Guarda-roupa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2" width="16" height="19" rx="1.5"/><path d="M12 2v19M10 11h.01M14 11h.01M6 21v1.5M18 21v1.5"/></svg>',
  'Banheiro privativo': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6zM6 12V5a2 2 0 0 1 4 0M8 20l-1 2M16 20l1 2"/></svg>',
  'Estacionamento': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/></svg>',
  'Jardim': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 22v-8M12 14c-4 0-6-3-6-7 4 0 6 3 6 7zM12 14c4 0 6-3 6-7-4 0-6 3-6 7zM5 22h14"/></svg>',
  'Ônibus perto': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v2.5M16 18v2.5M8 14.5h.01M16 14.5h.01"/></svg>',
  'Contas incluídas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4"/></svg>',
  'Mobiliado': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2"/></svg>',
  'Limpeza das áreas comuns': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M14 3 10 13M7 13h7l2 8H5zM9 17v4M12 17v4"/></svg>',
  'Smart TV': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  'Micro-ondas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9h.01M18 12h.01"/></svg>',
};
const TYPES = [
  { k: 'Todos', icon: 'all' },
  { k: 'Quarto privativo', icon: 'bed' },
  { k: 'Quarto compartilhado', icon: 'beds' },
  { k: 'Estúdio', icon: 'studio' },
  { k: 'Apartamento', icon: 'apt' },
  { k: 'Casa', icon: 'house' },
];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => '€' + Number(n || 0).toLocaleString('pt-BR');
const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace(' de ', ' ').replace('.', '');
};
const availText = (iso) => {
  if (!iso) return 'Disponível agora';
  const d = new Date(iso + 'T12:00:00');
  return d <= new Date() ? 'Disponível agora' : 'Disponível a partir de ' + d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace(' de ', ' ').replace('.', '');
};
const plural = (n, a, b) => `${n} ${n == 1 ? a : b}`;

const LOGO = `<img src="/img/dnl-icon.svg" alt="" width="40" height="40">`;

async function api(url, opts = {}) {
  const r = await fetch(url, { headers: opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}, ...opts,
    body: opts.body && !(opts.body instanceof FormData) ? JSON.stringify(opts.body) : opts.body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Erro'), { status: r.status });
  return j;
}

function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

// Favoritos no navegador
const favs = {
  get() { try { return JSON.parse(localStorage.getItem('dnl-favs') || '[]'); } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const f = this.get(); const i = f.indexOf(id);
    i >= 0 ? f.splice(i, 1) : f.push(id);
    try { localStorage.setItem('dnl-favs', JSON.stringify(f)); } catch {}
    return i < 0;
  },
};

function headerHTML({ search = false } = {}) {
  return `
  <header class="header"><div class="wrap">
    <a class="logo" href="/" aria-label="DNL Management">${LOGO}<span>DNL Management</span></a>
    ${search ? `
    <form class="search" id="search" onsubmit="return false">
      <div class="seg" style="flex:1.4"><label for="q">Onde</label><input id="q" placeholder="Buscar bairro ou endereço" autocomplete="off"></div>
      <div class="seg" style="flex:1"><label for="qmax">Preço máximo</label><select id="qmax"><option value="">Qualquer valor</option><option>600</option><option>800</option><option>1000</option><option>1500</option><option>2000</option></select></div>
      <div class="seg" style="flex:1"><label for="qwhen">Mudança</label><select id="qwhen"><option value="">Qualquer data</option><option value="0">Agora</option><option value="30">Próximos 30 dias</option><option value="90">Próximos 3 meses</option></select></div>
      <button class="go" aria-label="Buscar">${I.search.replace('<svg', '<svg width="16" height="16"')}</button>
    </form>` : ''}
    <div class="header-right">
      <a class="pill-link" href="/#anuncios">Ver espaços</a>
    </div>
  </div></header>`;
}
function footerHTML() {
  return `<footer class="footer"><div class="wrap">
    <div>© ${new Date().getFullYear()} DNL Management · Cork, Irlanda</div>
    <div><a href="/">Ver todos os espaços</a></div>
  </div></footer>`;
}
