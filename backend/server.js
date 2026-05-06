const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const { Resend } = require('resend');
require('dotenv').config();

const app    = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// ── Banco de dados JSON ────────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const empty = { participantes: [], palestrantes: [], coffeeBreak: [], projetos: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
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
