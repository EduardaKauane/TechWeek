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

  // IDs dos templates criados no painel do Resend
  const templateId = isAprovado
    ? process.env.RESEND_TEMPLATE_APROVADO
    : process.env.RESEND_TEMPLATE_REPROVADO;

  console.log(`\n📧 Enviando email`);
  console.log(`   Para:   ${email}`);
  console.log(`   Nome:   ${nome}`);
  console.log(`   Tipo:   ${tipo}`);
  console.log(`   Status: ${status}`);
  console.log(`   Template: ${templateId}`);

  try {
    const { data, error } = await resend.emails.send({
      from:        process.env.FROM_EMAIL || 'Tech Week <onboarding@resend.dev>',
      to:          [email],
      subject:     isAprovado
        ? '🎉 Parabéns! Sua inscrição foi aprovada - Tech Week'
        : 'Resultado da sua inscrição - Tech Week',
      template_id: templateId,
      variables: {
        nome,
        tipo,
      },
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
  console.log(`   Template aprovado:  ${process.env.RESEND_TEMPLATE_APROVADO || '⚠️  não definido'}`);
  console.log(`   Template reprovado: ${process.env.RESEND_TEMPLATE_REPROVADO || '⚠️  não definido'}`);
});
