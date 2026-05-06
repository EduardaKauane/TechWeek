const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const multer  = require('multer');
const { Resend } = require('resend');
require('dotenv').config();

const app    = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// ── Uploads ────────────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Banco de dados JSON ────────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const empty = { participantes: [], palestrantes: [], coffeeBreak: [], projetos: [], eventSpeakers: [], eventSchedule: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  if (!db.eventSpeakers) db.eventSpeakers = [];
  if (!db.eventSchedule) db.eventSchedule = [];
  return db;
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── GET /inscricoes ────────────────────────────────────────────────────────────
app.get('/inscricoes', (req, res) => {
  res.json(readDB());
});

// ── POST /inscricao ────────────────────────────────────────────────────────────
app.post('/inscricao', (req, res) => {
  const { tipo, ...dados } = req.body;
  const db = readDB();

  if (!db[tipo]) {
    return res.status(400).json({ success: false, error: 'Tipo inválido' });
  }

  const id   = Date.now();
  const item = { id, status: 'pendente', ...dados };
  db[tipo].push(item);
  writeDB(db);

  console.log(`✅ Nova inscrição [${tipo}] → ${item.nome}`);
  res.json({ success: true, id });
});

// ── PATCH /inscricao/:tipo/:id ─────────────────────────────────────────────────
app.patch('/inscricao/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;
  const { status }   = req.body;
  const db = readDB();

  if (!db[tipo]) return res.status(400).json({ success: false, error: 'Tipo inválido' });

  const item = db[tipo].find(i => i.id == id);
  if (!item) return res.status(404).json({ success: false, error: 'Não encontrado' });

  item.status = status;
  writeDB(db);
  res.json({ success: true });
});

// ── DELETE /inscricao/:tipo/:id ────────────────────────────────────────────────
app.delete('/inscricao/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;
  const db = readDB();

  if (!db[tipo]) return res.status(400).json({ success: false, error: 'Tipo inválido' });

  db[tipo] = db[tipo].filter(i => i.id != id);
  writeDB(db);
  res.json({ success: true });
});

// ── GET /event-speakers ────────────────────────────────────────────────────────
app.get('/event-speakers', (req, res) => {
  res.json(readDB().eventSpeakers);
});

// ── POST /event-speakers ───────────────────────────────────────────────────────
app.post('/event-speakers', upload.single('foto'), (req, res) => {
  const db = readDB();
  const { nome, cargo, empresa, bio, tema, linkedin } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;
  const item = { id: Date.now(), nome, cargo, empresa, bio, tema, linkedin, foto };
  db.eventSpeakers.push(item);
  writeDB(db);
  console.log(`✅ Palestrante do evento adicionado → ${nome}`);
  res.json({ success: true, item });
});

// ── PATCH /event-speakers/:id ──────────────────────────────────────────────────
app.patch('/event-speakers/:id', upload.single('foto'), (req, res) => {
  const db   = readDB();
  const item = db.eventSpeakers.find(s => s.id == req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Não encontrado' });

  const fields = ['nome', 'cargo', 'empresa', 'bio', 'tema', 'linkedin'];
  fields.forEach(f => { if (req.body[f] !== undefined) item[f] = req.body[f]; });
  if (req.file) item.foto = `/uploads/${req.file.filename}`;
  writeDB(db);
  res.json({ success: true, item });
});

// ── DELETE /event-speakers/:id ─────────────────────────────────────────────────
app.delete('/event-speakers/:id', (req, res) => {
  const db   = readDB();
  const item = db.eventSpeakers.find(s => s.id == req.params.id);
  if (item?.foto) {
    const filePath = path.join(__dirname, item.foto);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.eventSpeakers = db.eventSpeakers.filter(s => s.id != req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ── GET /event-schedule ────────────────────────────────────────────────────────
app.get('/event-schedule', (req, res) => {
  res.json(readDB().eventSchedule);
});

// ── POST /event-schedule ───────────────────────────────────────────────────────
app.post('/event-schedule', (req, res) => {
  const db   = readDB();
  const item = { id: Date.now(), ...req.body };
  db.eventSchedule.push(item);
  writeDB(db);
  console.log(`✅ Programação adicionada → ${item.titulo}`);
  res.json({ success: true, item });
});

// ── PATCH /event-schedule/:id ──────────────────────────────────────────────────
app.patch('/event-schedule/:id', (req, res) => {
  const db   = readDB();
  const item = db.eventSchedule.find(s => s.id == req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Não encontrado' });
  Object.assign(item, req.body);
  writeDB(db);
  res.json({ success: true, item });
});

// ── DELETE /event-schedule/:id ─────────────────────────────────────────────────
app.delete('/event-schedule/:id', (req, res) => {
  const db = readDB();
  db.eventSchedule = db.eventSchedule.filter(s => s.id != req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ── POST /send-email ───────────────────────────────────────────────────────────
app.post('/send-email', async (req, res) => {
  const { nome, email, status, tipo } = req.body;

  if (!nome || !email || !status || !tipo) {
    return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando' });
  }

  const isAprovado = status === 'aprovado';
  console.log(`\n📧 Enviando email → ${email} (${nome}, ${tipo}, ${status})`);

  const htmlAprovado = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px">
      <h2 style="color:#1e3a5f;margin-bottom:8px">🎉 Parabéns, ${nome}!</h2>
      <p style="color:#374151;font-size:15px">Sua inscrição como <strong>${tipo}</strong> na <strong>Tech Week</strong> foi <span style="color:#16a34a;font-weight:600">aprovada</span>.</p>
      <p style="color:#374151;font-size:15px">Estamos felizes em tê-lo(a) com a gente. Fique atento(a) às próximas comunicações com mais detalhes do evento.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="color:#9ca3af;font-size:13px">Tech Week — Equipe Organizadora</p>
    </div>`;

  const htmlReprovado = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px">
      <h2 style="color:#1e3a5f;margin-bottom:8px">Olá, ${nome}</h2>
      <p style="color:#374151;font-size:15px">Agradecemos o seu interesse em participar da <strong>Tech Week</strong> como <strong>${tipo}</strong>.</p>
      <p style="color:#374151;font-size:15px">Infelizmente, após análise, sua inscrição <span style="color:#dc2626;font-weight:600">não foi selecionada</span> nesta edição. Esperamos contar com você em futuras oportunidades.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="color:#9ca3af;font-size:13px">Tech Week — Equipe Organizadora</p>
    </div>`;

  try {
    const { data, error } = await resend.emails.send({
      from:    process.env.FROM_EMAIL || 'Tech Week <onboarding@resend.dev>',
      to:      [process.env.TEST_EMAIL || email],
      subject: isAprovado
        ? '🎉 Parabéns! Sua inscrição foi aprovada - Tech Week'
        : 'Resultado da sua inscrição - Tech Week',
      html: isAprovado ? htmlAprovado : htmlReprovado,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log(`✅ Email enviado! ID: ${data.id}`);
    res.json({ success: true, id: data.id });

  } catch (err) {
    console.error('❌ Erro interno:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Tech Week API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
});
