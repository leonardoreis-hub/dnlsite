// DNL Stays — site de anúncios com agendamento de visitas
// Node + Express + SQLite. Um único login de admin definido por variáveis de ambiente.
try { process.loadEnvFile(require('path').join(__dirname, '.env')); } catch {}
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const sharp = require('sharp');
const heicConvert = require('heic-convert');
const Database = require('better-sqlite3');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'troque-esta-senha';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || '';
const SITE_NAME = process.env.SITE_NAME || 'DNL Management';

// ---------- Banco ----------
const db = new Database(path.join(DATA_DIR, 'dnl.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Quarto privativo',
  area TEXT,
  address TEXT,
  lat REAL, lng REAL,
  price INTEGER NOT NULL DEFAULT 0,
  bills_included INTEGER NOT NULL DEFAULT 0,
  available_from TEXT,
  min_months INTEGER DEFAULT 6,
  guests INTEGER DEFAULT 1,
  bedrooms INTEGER DEFAULT 1,
  bathrooms REAL DEFAULT 1,
  description TEXT,
  amenities TEXT DEFAULT '[]',
  house_rules TEXT,
  photos TEXT DEFAULT '[]',
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER,
  listing_title TEXT,
  name TEXT, email TEXT, phone TEXT,
  date TEXT, time TEXT, people INTEGER, message TEXT,
  status TEXT DEFAULT 'novo',
  email_sent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);`);

try { db.exec('ALTER TABLE listings ADD COLUMN schedule TEXT'); } catch {} // agenda própria do quarto (opcional)
try { db.exec('ALTER TABLE listings ADD COLUMN rented INTEGER NOT NULL DEFAULT 0'); } catch {} // quarto já alugado
try { db.exec('ALTER TABLE listings ADD COLUMN rented_at TEXT'); } catch {}
try { db.exec('ALTER TABLE listings ADD COLUMN i18n TEXT'); } catch {} // traduções EN/ES de título, descrição e regras
try { db.exec('ALTER TABLE visits ADD COLUMN lang TEXT'); } catch {}
try { db.exec('ALTER TABLE listings ADD COLUMN geo_checked TEXT'); } catch {} // auto-house | auto-street | manual | failed

// --- Afiliados ---
db.exec(`
CREATE TABLE IF NOT EXISTS affiliates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  email TEXT, phone TEXT,
  token TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS ref_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_id INTEGER NOT NULL,
  kind TEXT NOT NULL,            -- click | wa
  listing_id INTEGER,
  visitor TEXT,                  -- hash anônimo (ip + navegador), só para não contar o mesmo clique várias vezes
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS aff_sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_id INTEGER NOT NULL,
  visit_id INTEGER,
  listing_title TEXT,
  tenant_name TEXT,
  amount INTEGER NOT NULL DEFAULT 50,
  paid INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);`);
try { db.exec('ALTER TABLE visits ADD COLUMN ref_code TEXT'); } catch {}
const AFF_COMMISSION = parseInt(process.env.AFF_COMMISSION || '50') || 50; // € por quarto fechado

// Traduções iniciais dos anúncios já publicados (aplica só onde ainda não há tradução
// e só nos campos cujo texto em português continua igual ao original)
try {
  const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed', 'i18n-seed.json'), 'utf8'));
  const get = db.prepare('SELECT title, description, house_rules, i18n FROM listings WHERE id = ?');
  const put = db.prepare('UPDATE listings SET i18n = ? WHERE id = ?');
  let n = 0;
  for (const it of seed) {
    const l = get.get(it.id);
    if (!l || (l.i18n && l.i18n !== '{}') || l.title !== it.title_pt) continue;
    const out = {};
    for (const lg of ['en', 'es']) {
      const x = { title: it.i18n[lg].title };
      if (l.description === it.description_pt) x.description = it.i18n[lg].description;
      if (l.house_rules === it.house_rules_pt) x.house_rules = it.i18n[lg].house_rules;
      out[lg] = x;
    }
    put.run(JSON.stringify(out), it.id); n++;
  }
  if (n) console.log(`Traduções aplicadas em ${n} anúncio(s).`);
} catch (e) { if (e.code !== 'ENOENT') console.error('Seed de traduções:', e.message); }

const parseListing = (r) => r && ({
  ...r,
  bills_included: !!r.bills_included,
  published: !!r.published,
  rented: !!r.rented,
  amenities: JSON.parse(r.amenities || '[]'),
  photos: JSON.parse(r.photos || '[]'),
  schedule: r.schedule ? JSON.parse(r.schedule) : null,
  i18n: r.i18n ? JSON.parse(r.i18n) : {},
});

// ---------- E-mail ----------
let mailer = null;
if (process.env.SMTP_HOST) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT) === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function notifyVisit(v, listing) {
  if (!mailer || !NOTIFY_EMAIL) return false;
  const dateBr = v.date ? v.date.split('-').reverse().join('/') : '';
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;color:#222">
    <h2 style="margin:0 0 4px">Novo pedido de visita</h2>
    <p style="color:#717171;margin:0 0 20px">${esc(listing?.title || v.listing_title)}${listing?.area ? ' · ' + esc(listing.area) : ''}</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr><td style="padding:8px 0;color:#717171;width:140px">Data</td><td><b>${esc(dateBr)} às ${esc(v.time)}</b></td></tr>
      <tr><td style="padding:8px 0;color:#717171">Nome</td><td>${esc(v.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#717171">E-mail</td><td><a href="mailto:${esc(v.email)}">${esc(v.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#717171">Telefone</td><td><a href="https://wa.me/${esc(String(v.phone).replace(/\D/g, ''))}">${esc(v.phone)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#717171">Pessoas</td><td>${esc(v.people)}</td></tr>
      ${v.lang && v.lang !== 'pt' ? `<tr><td style="padding:8px 0;color:#717171">Idioma</td><td>${v.lang === 'en' ? 'Inglês — responda em inglês' : 'Espanhol — responda em espanhol'}</td></tr>` : ''}
      ${v.message ? `<tr><td style="padding:8px 0;color:#717171;vertical-align:top">Mensagem</td><td>${esc(v.message)}</td></tr>` : ''}
      ${v.ref_code ? `<tr><td style="padding:8px 0;color:#717171">Indicado por</td><td><b>${esc(affByCode(v.ref_code)?.name || v.ref_code)}</b> (afiliado)</td></tr>` : ''}
    </table>
    ${listing?.address ? `<p style="margin-top:20px;color:#717171">Endereço: ${esc(listing.address)}</p>` : ''}
  </div>`;
  await mailer.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: NOTIFY_EMAIL,
    replyTo: v.email,
    subject: `Visita: ${listing?.title || v.listing_title} — ${dateBr} ${v.time} (${v.name})`,
    html,
  });
  return true;
}

// ---------- App ----------
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
// Sessões guardadas no SQLite, para o login sobreviver a reinícios e atualizações
db.exec(`CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT NOT NULL, expires INTEGER NOT NULL)`);
class SqliteStore extends session.Store {
  get(sid, cb) {
    const r = db.prepare('SELECT data, expires FROM sessions WHERE sid = ?').get(sid);
    if (!r || r.expires < Date.now()) return cb(null, null);
    try { cb(null, JSON.parse(r.data)); } catch (e) { cb(e); }
  }
  set(sid, sess, cb) {
    const exp = sess.cookie?.expires ? new Date(sess.cookie.expires).getTime() : Date.now() + 864e5;
    db.prepare('INSERT INTO sessions (sid, data, expires) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires = excluded.expires').run(sid, JSON.stringify(sess), exp);
    cb && cb(null);
  }
  destroy(sid, cb) { db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid); cb && cb(null); }
  touch(sid, sess, cb) { this.set(sid, sess, cb); }
}
setInterval(() => db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now()), 3600e3).unref();
// Segredo estável: usa SESSION_SECRET ou deriva do login do admin (não muda entre reinícios)
const SESSION_SECRET = process.env.SESSION_SECRET ||
  crypto.createHash('sha256').update('dnl-session:' + ADMIN_USER + ':' + ADMIN_PASSWORD).digest('hex');
app.use(session({
  store: new SqliteStore(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === 'production' },
}));

const requireAdmin = (req, res, next) => (req.session.admin ? next() : res.status(401).json({ error: 'Não autorizado' }));
const safeEq = (a, b) => {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};

// --- Auth (um único usuário) ---
const attempts = new Map();
app.post('/api/login', (req, res) => {
  const ip = req.ip, now = Date.now();
  const a = attempts.get(ip) || { n: 0, t: now };
  if (now - a.t > 15 * 60 * 1000) { a.n = 0; a.t = now; }
  if (a.n >= 10) return res.status(429).json({ error: 'Muitas tentativas. Tente em 15 minutos.' });
  const { user, password } = req.body || {};
  if (safeEq(user, ADMIN_USER) && safeEq(password, ADMIN_PASSWORD)) {
    attempts.delete(ip);
    req.session.regenerate(() => { req.session.admin = true; res.json({ ok: true }); });
  } else {
    a.n++; attempts.set(ip, a);
    res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }
});
app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/me', (req, res) => res.json({ admin: !!req.session.admin }));

// --- Agenda de visitas (configurável no admin) ---
db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
const DEFAULT_SCHEDULE = {
  // 0 = domingo ... 6 = sábado
  days: {
    0: [], 1: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    2: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    3: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    4: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    5: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    6: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  daysAhead: 21,      // quantos dias à frente aparecem
  minNoticeHours: 12, // antecedência mínima
  blocked: [],        // datas bloqueadas (YYYY-MM-DD)
  onePerSlot: true,   // esconde horário já pedido para o mesmo quarto
};
function getSchedule() {
  const r = db.prepare("SELECT value FROM settings WHERE key = 'schedule'").get();
  if (!r) return structuredClone(DEFAULT_SCHEDULE);
  try { return { ...structuredClone(DEFAULT_SCHEDULE), ...JSON.parse(r.value) }; } catch { return structuredClone(DEFAULT_SCHEDULE); }
}
function cleanSchedule(b) {
  const t = (x) => /^([01]\d|2[0-3]):[0-5]\d$/.test(x);
  const days = {};
  for (let d = 0; d < 7; d++) days[d] = [...new Set(((b.days || {})[d] || []).filter(t))].sort();
  return {
    days,
    daysAhead: Math.max(1, Math.min(90, parseInt(b.daysAhead) || 21)),
    minNoticeHours: Math.max(0, Math.min(168, parseInt(b.minNoticeHours) || 0)),
    blocked: [...new Set((b.blocked || []).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)))].sort(),
    onePerSlot: !!b.onePerSlot,
  };
}
// Hora atual em Dublin (relógio de parede), como Date "ingênuo" para comparar com os horários
function dublinNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Dublin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return new Date(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`);
}
function availableSlots(listingId) {
  const rentedRow = db.prepare('SELECT rented FROM listings WHERE id = ?').get(listingId);
  if (rentedRow && rentedRow.rented) return [];
  const s = getSchedule();
  const own = db.prepare('SELECT schedule FROM listings WHERE id = ?').get(listingId);
  if (own && own.schedule) {
    try {
      const o = JSON.parse(own.schedule);
      s.days = o.days || s.days;
      s.blocked = [...new Set([...(s.blocked || []), ...(o.blocked || [])])]; // bloqueios gerais + do quarto
    } catch {}
  }
  const now = dublinNow();
  const earliest = new Date(now.getTime() + s.minNoticeHours * 3600e3);
  const today = now.toISOString().slice(0, 10);
  const taken = new Set(s.onePerSlot
    ? db.prepare("SELECT date, time FROM visits WHERE listing_id = ? AND status != 'cancelado' AND date >= ?").all(listingId, today).map((v) => v.date + ' ' + v.time)
    : []);
  const out = [];
  for (let i = 0; i <= s.daysAhead; i++) {
    const d = new Date(now.getTime()); d.setUTCDate(d.getUTCDate() + i);
    const date = d.toISOString().slice(0, 10);
    if (s.blocked.includes(date)) continue;
    const times = (s.days[d.getUTCDay()] || []).filter((t) => new Date(`${date}T${t}:00Z`) >= earliest && !taken.has(date + ' ' + t));
    if (times.length) out.push({ date, times });
  }
  return out;
}
app.get('/api/schedule/:listingId', (req, res) => res.json({ available: availableSlots(req.params.listingId) }));
app.get('/api/admin/schedule', requireAdmin, (req, res) => res.json(getSchedule()));
app.put('/api/admin/schedule', requireAdmin, (req, res) => {
  const s = cleanSchedule(req.body || {});
  db.prepare("INSERT INTO settings (key, value) VALUES ('schedule', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(JSON.stringify(s));
  res.json(s);
});

// --- Público ---
app.get('/api/config', (req, res) => res.json({ siteName: SITE_NAME }));
app.get('/api/listings', (req, res) => {
  res.json(db.prepare('SELECT * FROM listings WHERE published = 1 ORDER BY rented ASC, created_at DESC').all().map(parseListing));
});
app.get('/api/listings/:id', (req, res) => {
  const l = parseListing(db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id));
  if (!l || (!l.published && !req.session.admin)) return res.status(404).json({ error: 'Anúncio não encontrado' });
  res.json(l);
});

const visitHits = new Map();
app.post('/api/visits', async (req, res) => {
  const ip = req.ip, now = Date.now();
  const hits = (visitHits.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  if (hits.length >= 8) return res.status(429).json({ error: 'Muitos pedidos. Tente mais tarde.' });
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot anti-spam
  const listing = parseListing(db.prepare('SELECT * FROM listings WHERE id = ?').get(b.listing_id));
  if (!listing) return res.status(400).json({ error: 'Anúncio inválido' });
  const req_ = ['name', 'email', 'phone', 'date', 'time'];
  for (const k of req_) if (!String(b[k] || '').trim()) return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  if (!/^\S+@\S+\.\S+$/.test(b.email)) return res.status(400).json({ error: 'E-mail inválido' });
  const okSlot = availableSlots(listing.id).some((d) => d.date === String(b.date) && d.times.includes(String(b.time)));
  if (!okSlot) return res.status(409).json({ error: 'Esse horário não está mais disponível. Escolha outro, por favor.' });
  const v = {
    listing_id: listing.id, listing_title: listing.title,
    name: String(b.name).slice(0, 120), email: String(b.email).slice(0, 160), phone: String(b.phone).slice(0, 40),
    date: String(b.date).slice(0, 10), time: String(b.time).slice(0, 5),
    people: Math.max(1, Math.min(10, parseInt(b.people) || 1)), message: String(b.message || '').slice(0, 2000),
    lang: ['pt', 'en', 'es'].includes(b.lang) ? b.lang : 'pt',
    ref_code: affByCode(b.ref)?.code || null,
  };
  const info = db.prepare(`INSERT INTO visits (listing_id, listing_title, name, email, phone, date, time, people, message, lang, ref_code)
    VALUES (@listing_id, @listing_title, @name, @email, @phone, @date, @time, @people, @message, @lang, @ref_code)`).run(v);
  hits.push(now); visitHits.set(ip, hits);
  let sent = false;
  try { sent = await notifyVisit(v, listing); } catch (e) { console.error('Falha ao enviar e-mail:', e.message); }
  if (sent) db.prepare('UPDATE visits SET email_sent = 1 WHERE id = ?').run(info.lastInsertRowid);
  res.json({ ok: true });
});

// --- Admin: anúncios ---
const FIELDS = ['title', 'type', 'area', 'address', 'lat', 'lng', 'price', 'bills_included', 'available_from', 'min_months',
  'guests', 'bedrooms', 'bathrooms', 'description', 'amenities', 'house_rules', 'photos', 'published', 'schedule', 'rented', 'i18n'];
function clean(b) {
  const o = {};
  for (const f of FIELDS) if (f in b) o[f] = b[f];
  if ('amenities' in o) o.amenities = JSON.stringify(Array.isArray(o.amenities) ? o.amenities : []);
  if ('photos' in o) o.photos = JSON.stringify(Array.isArray(o.photos) ? o.photos : []);
  if ('schedule' in o) {
    if (o.schedule && typeof o.schedule === 'object') { const c = cleanSchedule(o.schedule); o.schedule = JSON.stringify({ days: c.days, blocked: c.blocked }); }
    else o.schedule = null;
  }
  if ('bills_included' in o) o.bills_included = o.bills_included ? 1 : 0;
  if ('published' in o) o.published = o.published ? 1 : 0;
  if ('i18n' in o) {
    const src = o.i18n && typeof o.i18n === 'object' ? o.i18n : {}, out = {};
    for (const lg of ['en', 'es']) {
      const x = src[lg] || {}, y = {};
      for (const f of ['title', 'description', 'house_rules']) if (String(x[f] || '').trim()) y[f] = String(x[f]).slice(0, 8000);
      if (Object.keys(y).length) out[lg] = y;
    }
    o.i18n = JSON.stringify(out);
  }
  if ('rented' in o) { o.rented = o.rented ? 1 : 0; o.rented_at = o.rented ? new Date().toISOString().slice(0, 10) : null; }
  for (const n of ['lat', 'lng', 'bathrooms']) if (n in o) o[n] = o[n] === '' || o[n] == null ? null : Number(o[n]);
  for (const n of ['price', 'min_months', 'guests', 'bedrooms']) if (n in o) o[n] = parseInt(o[n]) || 0;
  return o;
}
app.get('/api/admin/listings', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM listings ORDER BY created_at DESC').all().map(parseListing));
});
app.post('/api/admin/listings', requireAdmin, (req, res) => {
  const o = clean(req.body || {});
  if (!o.title) return res.status(400).json({ error: 'Título é obrigatório' });
  if (o.lat != null && o.lng != null) o.geo_checked = 'manual';
  const cols = Object.keys(o);
  const info = db.prepare(`INSERT INTO listings (${cols.join(',')}) VALUES (${cols.map((c) => '@' + c).join(',')})`).run(o);
  res.json(parseListing(db.prepare('SELECT * FROM listings WHERE id = ?').get(info.lastInsertRowid)));
});
app.put('/api/admin/listings/:id', requireAdmin, (req, res) => {
  const o = clean(req.body || {});
  const cur = db.prepare('SELECT lat, lng FROM listings WHERE id = ?').get(req.params.id);
  if (cur && ('lat' in o || 'lng' in o) && o.lat != null && o.lng != null &&
      (Math.abs((cur.lat ?? 0) - o.lat) > 1e-6 || Math.abs((cur.lng ?? 0) - o.lng) > 1e-6)) o.geo_checked = 'manual';
  const cols = Object.keys(o);
  if (cols.length) db.prepare(`UPDATE listings SET ${cols.map((c) => `${c}=@${c}`).join(',')}, updated_at = datetime('now') WHERE id = @id`).run({ ...o, id: req.params.id });
  res.json(parseListing(db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id)));
});
app.delete('/api/admin/listings/:id', requireAdmin, (req, res) => {
  const l = parseListing(db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id));
  if (l) for (const p of l.photos) { try { fs.unlinkSync(path.join(UPLOAD_DIR, path.basename(p))); } catch {} }
  db.prepare('DELETE FROM listings WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// --- Admin: upload de fotos (redimensiona para web) ---
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 30 } });
app.post('/api/admin/upload', requireAdmin, upload.array('photos', 30), async (req, res) => {
  const urls = [];
  for (const f of req.files || []) {
    const isHeic = /heic|heif/i.test(f.mimetype) || /\.(heic|heif)$/i.test(f.originalname || '');
    if (!/^image\//.test(f.mimetype) && !isHeic) continue;
    let buf = f.buffer;
    try {
      // Fotos de iPhone (HEIC): converte para JPEG antes de processar
      if (isHeic) buf = Buffer.from(await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.9 }));
      const name = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}.jpg`;
      await sharp(buf).rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(UPLOAD_DIR, name));
      urls.push('/uploads/' + name);
    } catch (e) { console.error('Falha ao processar foto:', f.originalname, e.message); }
  }
  res.json({ urls });
});

// --- Admin: visitas ---
app.get('/api/admin/visits', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT v.*, s.id AS sale_id FROM visits v LEFT JOIN aff_sales s ON s.visit_id = v.id ORDER BY v.created_at DESC').all());
});
app.put('/api/admin/visits/:id', requireAdmin, (req, res) => {
  db.prepare('UPDATE visits SET status = ? WHERE id = ?').run(String(req.body.status || 'novo'), req.params.id);
  res.json({ ok: true });
});
app.delete('/api/admin/visits/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM visits WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});
// ---------- Afiliados ----------
const affByCode = (c) => { c = String(c || '').toLowerCase().trim(); return c ? db.prepare('SELECT * FROM affiliates WHERE code = ? AND active = 1').get(c) : null; };
const slug = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
function affStats(a) {
  const n = (sql, ...p) => db.prepare(sql).get(...p).n;
  const sales = db.prepare('SELECT * FROM aff_sales WHERE affiliate_id = ? ORDER BY created_at DESC').all(a.id);
  return {
    clicks: n("SELECT COUNT(*) n FROM ref_events WHERE affiliate_id = ? AND kind = 'click'", a.id),
    whatsapp: n("SELECT COUNT(*) n FROM ref_events WHERE affiliate_id = ? AND kind = 'wa'", a.id),
    visits: n('SELECT COUNT(*) n FROM visits WHERE ref_code = ?', a.code),
    closed: sales.length,
    earned: sales.reduce((t, x) => t + x.amount, 0),
    paid: sales.filter((x) => x.paid).reduce((t, x) => t + x.amount, 0),
    sales,
  };
}
// Público: registra clique no link / clique no WhatsApp (conta 1 por visitante por dia)
const refHits = new Map();
app.post('/api/ref/event', (req, res) => {
  const b = req.body || {}, a = affByCode(b.code), kind = b.kind === 'wa' ? 'wa' : 'click';
  if (!a) return res.json({ ok: false });
  const ip = req.ip, now = Date.now();
  const hits = (refHits.get(ip) || []).filter((t) => now - t < 3600e3);
  if (hits.length >= 60) return res.json({ ok: false });
  hits.push(now); refHits.set(ip, hits);
  const visitor = crypto.createHash('sha256').update(ip + '|' + (req.get('user-agent') || '')).digest('hex').slice(0, 16);
  const listingId = parseInt(b.listing_id) || null;
  const dup = db.prepare("SELECT 1 FROM ref_events WHERE affiliate_id = ? AND kind = ? AND visitor = ? AND IFNULL(listing_id,0) = ? AND created_at > datetime('now','-1 day')").get(a.id, kind, visitor, listingId || 0);
  if (!dup) db.prepare('INSERT INTO ref_events (affiliate_id, kind, listing_id, visitor) VALUES (?, ?, ?, ?)').run(a.id, kind, listingId, visitor);
  res.json({ ok: true });
});
// Público: painel do afiliado (link secreto)
app.get('/api/aff/:token', (req, res) => {
  const a = db.prepare('SELECT * FROM affiliates WHERE token = ?').get(String(req.params.token));
  if (!a) return res.status(404).json({ error: 'Link inválido' });
  const st = affStats(a);
  const visits = db.prepare('SELECT listing_title, name, date, status, created_at FROM visits WHERE ref_code = ? ORDER BY created_at DESC LIMIT 200').all(a.code)
    .map((v) => ({ ...v, name: String(v.name || '').trim().split(/\s+/)[0] })); // só o primeiro nome
  res.json({ name: a.name, code: a.code, active: !!a.active, commission: AFF_COMMISSION,
    stats: { clicks: st.clicks, whatsapp: st.whatsapp, visits: st.visits, closed: st.closed, earned: st.earned, paid: st.paid },
    sales: st.sales.map((x) => ({ listing_title: x.listing_title, tenant_name: String(x.tenant_name || '').trim().split(/\s+/)[0], amount: x.amount, paid: !!x.paid, created_at: x.created_at, paid_at: x.paid_at })),
    visits });
});
app.get('/parceiro/:token', (req, res) => res.sendFile(path.join(__dirname, 'public', 'affiliate.html')));
// Admin
app.get('/api/admin/affiliates', requireAdmin, (req, res) => {
  res.json({ commission: AFF_COMMISSION, affiliates: db.prepare('SELECT * FROM affiliates ORDER BY created_at DESC').all().map((a) => ({ ...a, active: !!a.active, ...affStats(a) })) });
});
app.post('/api/admin/affiliates', requireAdmin, (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim().slice(0, 120);
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
  let code = slug(b.code || name.split(/\s+/)[0]);
  if (!code) return res.status(400).json({ error: 'Código inválido' });
  const base = code; let i = 2;
  while (db.prepare('SELECT 1 FROM affiliates WHERE code = ?').get(code)) code = base + i++;
  const token = crypto.randomBytes(12).toString('hex');
  const info = db.prepare('INSERT INTO affiliates (name, code, email, phone, token, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, code, String(b.email || '').slice(0, 160), String(b.phone || '').slice(0, 40), token, String(b.notes || '').slice(0, 1000));
  res.json(db.prepare('SELECT * FROM affiliates WHERE id = ?').get(info.lastInsertRowid));
});
app.put('/api/admin/affiliates/:id', requireAdmin, (req, res) => {
  const b = req.body || {}, a = db.prepare('SELECT * FROM affiliates WHERE id = ?').get(req.params.id);
  if (!a) return res.status(404).json({ error: 'Afiliado não encontrado' });
  db.prepare('UPDATE affiliates SET name = ?, email = ?, phone = ?, notes = ?, active = ? WHERE id = ?').run(
    'name' in b ? String(b.name).slice(0, 120) : a.name, 'email' in b ? String(b.email).slice(0, 160) : a.email,
    'phone' in b ? String(b.phone).slice(0, 40) : a.phone, 'notes' in b ? String(b.notes).slice(0, 1000) : a.notes,
    'active' in b ? (b.active ? 1 : 0) : a.active, a.id);
  res.json({ ok: true });
});
app.delete('/api/admin/affiliates/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM ref_events WHERE affiliate_id = ?').run(req.params.id);
  db.prepare('DELETE FROM aff_sales WHERE affiliate_id = ?').run(req.params.id);
  db.prepare('DELETE FROM affiliates WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});
// Quarto fechado (comissão): a partir de uma visita indicada ou lançado à mão
app.post('/api/admin/affiliates/:id/sales', requireAdmin, (req, res) => {
  const b = req.body || {}, a = db.prepare('SELECT * FROM affiliates WHERE id = ?').get(req.params.id);
  if (!a) return res.status(404).json({ error: 'Afiliado não encontrado' });
  const visitId = parseInt(b.visit_id) || null;
  if (visitId && db.prepare('SELECT 1 FROM aff_sales WHERE visit_id = ?').get(visitId)) return res.status(409).json({ error: 'Essa visita já foi marcada como fechada' });
  const v = visitId ? db.prepare('SELECT * FROM visits WHERE id = ?').get(visitId) : null;
  db.prepare('INSERT INTO aff_sales (affiliate_id, visit_id, listing_title, tenant_name, amount) VALUES (?, ?, ?, ?, ?)').run(
    a.id, visitId, String(b.listing_title || v?.listing_title || '').slice(0, 200), String(b.tenant_name || v?.name || '').slice(0, 120),
    Math.max(0, parseInt(b.amount ?? AFF_COMMISSION) || 0));
  res.json({ ok: true });
});
app.put('/api/admin/sales/:id', requireAdmin, (req, res) => {
  const paid = req.body && req.body.paid ? 1 : 0;
  db.prepare('UPDATE aff_sales SET paid = ?, paid_at = ? WHERE id = ?').run(paid, paid ? new Date().toISOString().slice(0, 10) : null, req.params.id);
  res.json({ ok: true });
});
app.delete('/api/admin/sales/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM aff_sales WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/status', requireAdmin, (req, res) => res.json({ emailConfigured: !!(mailer && NOTIFY_EMAIL), notifyEmail: NOTIFY_EMAIL }));
app.post('/api/admin/test-email', requireAdmin, async (req, res) => {
  try {
    const ok = await notifyVisit({ listing_title: 'Teste', name: 'Teste do sistema', email: NOTIFY_EMAIL, phone: '+353 00 000 0000', date: new Date().toISOString().slice(0, 10), time: '10:00', people: 1, message: 'Se você recebeu este e-mail, os pedidos de visita vão chegar aqui.' }, null);
    res.json({ ok });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Arquivos ---
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.get('/anuncio/:id', (req, res) => res.sendFile(path.join(__dirname, 'public', 'listing.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Anúncios novos enviados junto com o código: cada um é criado uma única vez
// (se for apagado no admin, não volta)
try {
  const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed', 'listings-seed.json'), 'utf8'));
  const seen = db.prepare("SELECT 1 FROM settings WHERE key = ?");
  const mark = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, '1')");
  for (const it of items) {
    const key = 'seed:' + it.seed_key;
    if (seen.get(key)) continue;
    const { seed_key, ...data } = it;
    const o = clean(data);
    const cols = Object.keys(o);
    db.prepare(`INSERT INTO listings (${cols.join(',')}) VALUES (${cols.map((c) => '@' + c).join(',')})`).run(o);
    mark.run(key);
    console.log('Anúncio criado:', it.title);
  }
} catch (e) { if (e.code !== 'ENOENT') console.error('Seed de anúncios:', e.message); }


// Localização exata: busca o endereço de cada anúncio no OpenStreetMap uma vez
// (não mexe em pontos ajustados à mão no admin)
async function geocodeListings() {
  const rows = db.prepare("SELECT id, address FROM listings WHERE geo_checked IS NULL AND address IS NOT NULL AND address != ''").all();
  const upd = db.prepare('UPDATE listings SET lat = ?, lng = ?, geo_checked = ? WHERE id = ?');
  const fail = db.prepare("UPDATE listings SET geo_checked = 'failed' WHERE id = ?");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const r of rows) {
    const base = r.address
      .replace(/\b[ACDEFHKNPRTVWXY]\d{2}\s?[0-9ACDEFHKNPRTVWXY]{4}\b/gi, '') // tira o Eircode
      .replace(/^\s*apt\.?\s*\d+\s*,\s*/i, '')                              // tira "Apt 2,"
      .replace(/\s*,\s*,/g, ',').replace(/[,\s]+$/, '');
    const parts = base.split(',').map((x) => x.trim()).filter(Boolean);
    const town = [...parts].reverse().find((x) => !/^co\.?\s/i.test(x)) || parts[parts.length - 1];
    const short = parts.length > 2 ? `${parts[0]}, ${town}` : base; // rua + cidade
    const noNum = (x) => x.replace(/^\s*\d+[a-z]?\s+/i, '');
    const tries = [...new Set([base, short, noNum(base), noNum(short)])].map((x) => x + ', Ireland');
    let done = false;
    for (const q of tries) {
      try {
        const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ie&q=' + encodeURIComponent(q);
        const res = await fetch(url, { headers: { 'User-Agent': 'DNL-Management-rooms-site/1.0', 'Accept-Language': 'en' } });
        const j = res.ok ? await res.json() : [];
        await sleep(1200); // respeita o limite de 1 pedido por segundo
        if (j[0]) {
          const exact = ['house', 'building', 'residential', 'apartments', 'detached', 'semidetached_house', 'terrace'].includes(j[0].type) || j[0].addresstype === 'building';
          upd.run(+(+j[0].lat).toFixed(6), +(+j[0].lon).toFixed(6), exact && q === tries[0] ? 'auto-house' : 'auto-street', r.id);
          console.log(`Localização #${r.id}: ${exact && q === tries[0] ? 'casa' : 'rua'} — ${j[0].display_name}`);
          done = true; break;
        }
      } catch (e) { console.error('Geocode', r.id, e.message); await sleep(1200); }
    }
    if (!done) fail.run(r.id);
  }
}

app.listen(PORT, () => {
  if (!process.env.NO_GEOCODE) setTimeout(() => geocodeListings().catch((e) => console.error('Geocode:', e.message)), 4000);
  console.log(`${SITE_NAME} rodando em http://localhost:${PORT}`);
  if (!mailer || !NOTIFY_EMAIL) console.log('Aviso: e-mail não configurado (SMTP_HOST / NOTIFY_EMAIL). Pedidos ficam salvos no admin.');
  if (ADMIN_PASSWORD === 'troque-esta-senha') console.log('Aviso: defina ADMIN_PASSWORD no arquivo .env');
});
