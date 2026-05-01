const express = require('express');
const cors    = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app    = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

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

    console.log(`✅ Email enviado com sucesso! ID: ${data.id}`);
    res.json({ success: true, id: data.id });

  } catch (err) {
    console.error('❌ Erro interno:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Tech Week Email API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
});
