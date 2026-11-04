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

const parseListing = (r) => r && ({
  ...r,
  bills_included: !!r.bills_included,
  published: !!r.published,
  amenities: JSON.parse(r.amenities || '[]'),
  photos: JSON.parse(r.photos || '[]'),
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
      ${v.message ? `<tr><td style="padding:8px 0;color:#717171;vertical-align:top">Mensagem</td><td>${esc(v.message)}</td></tr>` : ''}
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

// --- Público ---
app.get('/api/config', (req, res) => res.json({ siteName: SITE_NAME }));
app.get('/api/listings', (req, res) => {
  res.json(db.prepare('SELECT * FROM listings WHERE published = 1 ORDER BY created_at DESC').all().map(parseListing));
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
  const v = {
    listing_id: listing.id, listing_title: listing.title,
    name: String(b.name).slice(0, 120), email: String(b.email).slice(0, 160), phone: String(b.phone).slice(0, 40),
    date: String(b.date).slice(0, 10), time: String(b.time).slice(0, 5),
    people: Math.max(1, Math.min(10, parseInt(b.people) || 1)), message: String(b.message || '').slice(0, 2000),
  };
  const info = db.prepare(`INSERT INTO visits (listing_id, listing_title, name, email, phone, date, time, people, message)
    VALUES (@listing_id, @listing_title, @name, @email, @phone, @date, @time, @people, @message)`).run(v);
  hits.push(now); visitHits.set(ip, hits);
  let sent = false;
  try { sent = await notifyVisit(v, listing); } catch (e) { console.error('Falha ao enviar e-mail:', e.message); }
  if (sent) db.prepare('UPDATE visits SET email_sent = 1 WHERE id = ?').run(info.lastInsertRowid);
  res.json({ ok: true });
});

// --- Admin: anúncios ---
const FIELDS = ['title', 'type', 'area', 'address', 'lat', 'lng', 'price', 'bills_included', 'available_from', 'min_months',
  'guests', 'bedrooms', 'bathrooms', 'description', 'amenities', 'house_rules', 'photos', 'published'];
function clean(b) {
  const o = {};
  for (const f of FIELDS) if (f in b) o[f] = b[f];
  if ('amenities' in o) o.amenities = JSON.stringify(Array.isArray(o.amenities) ? o.amenities : []);
  if ('photos' in o) o.photos = JSON.stringify(Array.isArray(o.photos) ? o.photos : []);
  if ('bills_included' in o) o.bills_included = o.bills_included ? 1 : 0;
  if ('published' in o) o.published = o.published ? 1 : 0;
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
  const cols = Object.keys(o);
  const info = db.prepare(`INSERT INTO listings (${cols.join(',')}) VALUES (${cols.map((c) => '@' + c).join(',')})`).run(o);
  res.json(parseListing(db.prepare('SELECT * FROM listings WHERE id = ?').get(info.lastInsertRowid)));
});
app.put('/api/admin/listings/:id', requireAdmin, (req, res) => {
  const o = clean(req.body || {});
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
  res.json(db.prepare('SELECT * FROM visits ORDER BY created_at DESC').all());
});
app.put('/api/admin/visits/:id', requireAdmin, (req, res) => {
  db.prepare('UPDATE visits SET status = ? WHERE id = ?').run(String(req.body.status || 'novo'), req.params.id);
  res.json({ ok: true });
});
app.delete('/api/admin/visits/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM visits WHERE id = ?').run(req.params.id);
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

app.listen(PORT, () => {
  console.log(`${SITE_NAME} rodando em http://localhost:${PORT}`);
  if (!mailer || !NOTIFY_EMAIL) console.log('Aviso: e-mail não configurado (SMTP_HOST / NOTIFY_EMAIL). Pedidos ficam salvos no admin.');
  if (ADMIN_PASSWORD === 'troque-esta-senha') console.log('Aviso: defina ADMIN_PASSWORD no arquivo .env');
});
