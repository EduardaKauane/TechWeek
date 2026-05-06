const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
require('dotenv').config();

const app    = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// ── Uploads (fotos dos palestrantes) ──────────────────────────────────────────
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

// ── Mapeamento de tipo → tabela Supabase ──────────────────────────────────────
const tableMap = {
  participantes: 'participantes',
  palestrantes:  'palestrantes',
  coffeeBreak:   'coffee_break',
  projetos:      'projetos',
};

// ── GET /inscricoes ────────────────────────────────────────────────────────────
app.get('/inscricoes', async (req, res) => {
  try {
    const [p, pal, cb, proj] = await Promise.all([
      supabase.from('participantes').select('*').order('id', { ascending: false }),
      supabase.from('palestrantes').select('*').order('id',  { ascending: false }),
      supabase.from('coffee_break').select('*').order('id',  { ascending: false }),
      supabase.from('projetos').select('*').order('id',      { ascending: false }),
    ]);
    res.json({
      participantes: p.data   || [],
      palestrantes:  pal.data || [],
      coffeeBreak:   cb.data  || [],
      projetos:      proj.data|| [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /inscricao ────────────────────────────────────────────────────────────
app.post('/inscricao', async (req, res) => {
  const { tipo, ...dados } = req.body;
  const tabela = tableMap[tipo];
  if (!tabela) return res.status(400).json({ success: false, error: 'Tipo inválido' });

  const id   = Date.now();
  const item = { id, status: 'pendente', ...dados };

  const { error } = await supabase.from(tabela).insert(item);
  if (error) return res.status(500).json({ success: false, error: error.message });

  console.log(`✅ Nova inscrição [${tipo}] → ${item.nome}`);
  res.json({ success: true, id });
});

// ── PATCH /inscricao/:tipo/:id ─────────────────────────────────────────────────
app.patch('/inscricao/:tipo/:id', async (req, res) => {
  const tabela = tableMap[req.params.tipo];
  if (!tabela) return res.status(400).json({ success: false, error: 'Tipo inválido' });

  const { error } = await supabase
    .from(tabela)
    .update({ status: req.body.status })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// ── DELETE /inscricao/:tipo/:id ────────────────────────────────────────────────
app.delete('/inscricao/:tipo/:id', async (req, res) => {
  const tabela = tableMap[req.params.tipo];
  if (!tabela) return res.status(400).json({ success: false, error: 'Tipo inválido' });

  const { error } = await supabase.from(tabela).delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// ── GET /event-speakers ────────────────────────────────────────────────────────
app.get('/event-speakers', async (req, res) => {
  const { data, error } = await supabase.from('event_speakers').select('*').order('id');
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json(data || []);
});

// ── POST /event-speakers ───────────────────────────────────────────────────────
app.post('/event-speakers', upload.single('foto'), async (req, res) => {
  const { nome, cargo, empresa, bio, tema, linkedin } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;
  const item = { id: Date.now(), nome, cargo, empresa, bio, tema, linkedin, foto };

  const { error } = await supabase.from('event_speakers').insert(item);
  if (error) return res.status(500).json({ success: false, error: error.message });

  console.log(`✅ Palestrante do evento adicionado → ${nome}`);
  res.json({ success: true, item });
});

// ── PATCH /event-speakers/:id ──────────────────────────────────────────────────
app.patch('/event-speakers/:id', upload.single('foto'), async (req, res) => {
  const updates = {};
  ['nome','cargo','empresa','bio','tema','linkedin'].forEach(f => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  if (req.file) updates.foto = `/uploads/${req.file.filename}`;

  const { error } = await supabase.from('event_speakers').update(updates).eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// ── DELETE /event-speakers/:id ─────────────────────────────────────────────────
app.delete('/event-speakers/:id', async (req, res) => {
  const { data } = await supabase.from('event_speakers').select('foto').eq('id', req.params.id).single();
  if (data?.foto) {
    const filePath = path.join(__dirname, data.foto);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  const { error } = await supabase.from('event_speakers').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// ── GET /event-schedule ────────────────────────────────────────────────────────
app.get('/event-schedule', async (req, res) => {
  const { data, error } = await supabase.from('event_schedule').select('*').order('id');
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json(data || []);
});

// ── POST /event-schedule ───────────────────────────────────────────────────────
app.post('/event-schedule', async (req, res) => {
  const item = { id: Date.now(), ...req.body };
  const { error } = await supabase.from('event_schedule').insert(item);
  if (error) return res.status(500).json({ success: false, error: error.message });

  console.log(`✅ Programação adicionada → ${item.titulo}`);
  res.json({ success: true, item });
});

// ── PATCH /event-schedule/:id ──────────────────────────────────────────────────
app.patch('/event-schedule/:id', async (req, res) => {
  const { error } = await supabase.from('event_schedule').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// ── DELETE /event-schedule/:id ─────────────────────────────────────────────────
app.delete('/event-schedule/:id', async (req, res) => {
  const { error } = await supabase.from('event_schedule').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// ── POST /send-email ───────────────────────────────────────────────────────────
app.post('/send-email', async (req, res) => {
  const { nome, email, status, tipo } = req.body;
  if (!nome || !email || !status || !tipo)
    return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando' });

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
      <p style="color:#374151;font-size:15px">Infelizmente, após análise, sua inscrição <span style="color:#dc2626;font-weight:600">não foi selecionada</span> nesta edição.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="color:#9ca3af;font-size:13px">Tech Week — Equipe Organizadora</p>
    </div>`;

  try {
    const { data, error } = await resend.emails.send({
      from:    process.env.FROM_EMAIL || 'Tech Week <onboarding@resend.dev>',
      to:      [process.env.TEST_EMAIL || email],
      subject: isAprovado ? '🎉 Sua inscrição foi aprovada - Tech Week' : 'Resultado da sua inscrição - Tech Week',
      html:    isAprovado ? htmlAprovado : htmlReprovado,
    });
    if (error) return res.status(500).json({ success: false, error: error.message });
    console.log(`✅ Email enviado! ID: ${data.id}`);
    res.json({ success: true, id: data.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Tech Week API' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`));
