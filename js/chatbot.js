const FAQ = [
  {
    chip: true,
    keywords: ['onde', 'local', 'lugar', 'endereço', 'campus', 'av', 'santa', 'monica', 'londrina'],
    question: '📍 Onde será o evento?',
    answer: 'O evento acontece no <strong>Campus Unicesumar Londrina</strong> — Av. Santa Mônica. 🗺️'
  },
  {
    chip: true,
    keywords: ['quando', 'data', 'dia', 'periodo', 'período', 'junho', 'mes', 'mês'],
    question: '📅 Quando acontece?',
    answer: 'A Tech Week acontece de <strong>1 a 3 de Junho de 2026</strong>. Marque na agenda! 🎉'
  },
  {
    chip: true,
    keywords: ['pagar', 'gratuito', 'gratis', 'grátis', 'custo', 'valor', 'preco', 'preço', 'custa', 'ingresso'],
    question: '💸 É gratuito?',
    answer: '<strong>Sim, totalmente gratuito!</strong> ✅ O evento é aberto ao público, basta se inscrever.'
  },
  {
    chip: true,
    keywords: ['certificado', 'certificação', 'certifica', 'horas', 'hora', 'complementar'],
    question: '🎓 Terei certificado?',
    answer: '<strong>Sim!</strong> Você recebe o certificado mediante presença confirmada no evento. 🎓'
  },
  {
    chip: true,
    keywords: ['coffee', 'break', 'lanche', 'comida', 'alimentação', 'alimentacao', 'comer', 'café'],
    question: '☕ Haverá coffee break?',
    answer: 'Sim! O coffee break é disponível para participantes que marcaram essa opção na inscrição. ☕'
  },
  {
    chip: false,
    keywords: ['projeto', 'apresentar', 'apresentação', 'apresentacao', 'mostrar', 'expor', 'exposição'],
    question: '💡 Posso apresentar projeto?',
    answer: 'Sim! No formulário de inscrição, marque a opção <strong>"Desejo apresentar um projeto"</strong> e preencha os detalhes. 💡'
  },
  {
    chip: false,
    keywords: ['confirmação', 'confirmacao', 'presença', 'presenca', 'qr', 'qrcode', 'check', 'confirmar'],
    question: '📱 Como confirmar presença?',
    answer: 'A presença será confirmada via <strong>QR Code</strong> ao final do evento. Fique atento! 📱'
  },
  {
    chip: false,
    keywords: ['palestrante', 'palestra', 'falar', 'proposta', 'submeter', 'inscricao palestrante'],
    question: '🎤 Como ser palestrante?',
    answer: 'Acesse a página de <strong>Inscrição de Palestrante</strong> e envie sua proposta de palestra. Alunos e profissionais são bem-vindos! 🎤'
  },
  {
    chip: false,
    keywords: ['duração', 'duracao', 'tempo', 'minutos', 'quanto tempo', 'longa'],
    question: '⏱️ Duração das palestras?',
    answer: 'Cada palestra tem entre <strong>40 e 60 minutos</strong>. ⏱️'
  },
  {
    chip: false,
    keywords: ['contato', 'email', 'organização', 'organizacao', 'duvida', 'dúvida', 'ajuda'],
    question: '✉️ Como entrar em contato?',
    answer: 'Envie um email para <strong>techweek@unicesumar.edu.br</strong> e a equipe vai te responder! ✉️'
  },
  {
    chip: false,
    keywords: ['inscrever', 'inscricao', 'inscrição', 'cadastro', 'participar', 'como faco', 'como faço'],
    question: '📝 Como me inscrevo?',
    answer: 'Clique no botão <strong>"Quero Participar"</strong> na página inicial e preencha o formulário. É rápido! 📝'
  },
];

let chatOpen    = false;
let greeted     = false;
let awaitingName = false;
let userName    = '';

function toggleChat() {
  chatOpen = !chatOpen;
  const win        = document.getElementById('chatbot-window');
  const iconChat   = document.getElementById('chatbot-icon-chat');
  const iconClose  = document.getElementById('chatbot-icon-close');
  const notif      = document.getElementById('chatbot-notif');

  if (chatOpen) {
    win.classList.remove('chatbot-closed');
    win.classList.add('chatbot-open');
    iconChat.style.display  = 'none';
    iconClose.style.display = 'block';
    if (notif) notif.style.display = 'none';
    if (!greeted) { greet(); greeted = true; }
    setTimeout(() => {
      const input = document.getElementById('chatbot-input');
      if (input) input.focus();
    }, 350);
  } else {
    win.classList.remove('chatbot-open');
    win.classList.add('chatbot-closed');
    iconChat.style.display  = 'block';
    iconClose.style.display = 'none';
  }
}

function greet() {
  addBotMessage('Olá! 👋 Sou o <strong>TechBot</strong>, assistente virtual da Tech Week.', 300);
  addBotMessage('Antes de começar, qual é o seu nome? 😊', 1000);
  awaitingName = true;
}

function renderChips() {
  const container = document.getElementById('chatbot-chips');
  if (!container) return;
  const chips = FAQ.filter(f => f.chip);
  container.innerHTML = chips.map((f, i) =>
    `<button class="chatbot-chip" style="animation-delay:${i * 0.05}s" onclick="chipClick(${FAQ.indexOf(f)})">${f.question}</button>`
  ).join('');
}

function chipClick(index) {
  const faq = FAQ[index];
  addUserMessage(faq.question.replace(/^[^\s]+\s/, ''));
  clearChips();
  addTyping();
  setTimeout(() => {
    removeTyping();
    addBotMessage(faq.answer);
    setTimeout(renderChips, 300);
  }, 950);
}

function sendMessage() {
  const input = document.getElementById('chatbot-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';
  clearChips();

  if (awaitingName) {
    awaitingName = false;
    userName = text.split(' ')[0];
    addTyping();
    setTimeout(() => {
      removeTyping();
      addBotMessage(`Prazer, <strong>${escapeHtml(userName)}</strong>! 😄 Como posso te ajudar hoje?`);
      setTimeout(renderChips, 300);
    }, 800);
    return;
  }

  addTyping();
  setTimeout(() => {
    removeTyping();
    addBotMessage(findAnswer(text));
    setTimeout(renderChips, 300);
  }, 1050);
}

function findAnswer(text) {
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const lower = normalize(text);

  // Responde com o nome quando perguntado
  const namePatterns = ['seu nome', 'voce se chama', 'você se chama', 'qual seu nome', 'qual e seu nome', 'qual é seu nome', 'quem e voce', 'quem é você'];
  if (namePatterns.some(p => lower.includes(normalize(p)))) {
    return userName
      ? `Meu nome é <strong>TechBot</strong>! 🤖 E o seu é <strong>${escapeHtml(userName)}</strong>, certo? 😄`
      : 'Meu nome é <strong>TechBot</strong>! 🤖 Sou o assistente virtual da Tech Week.';
  }

  const match = FAQ.find(f => f.keywords.some(kw => lower.includes(normalize(kw))));
  const greeting = userName ? ` ${escapeHtml(userName)},` : '';
  return match
    ? match.answer
    : `🤔 Não encontrei uma resposta para isso,${greeting} tente uma das perguntas abaixo ou entre em contato pelo <strong>techweek@unicesumar.edu.br</strong>.`;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg msg-user';
  div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  msgs.appendChild(div);
  scrollBottom();
}

function addBotMessage(html, delay = 0) {
  setTimeout(() => {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'msg msg-bot';
    div.innerHTML = `
      <div class="msg-bot-avatar">T</div>
      <div class="msg-bubble">${html}</div>
    `;
    msgs.appendChild(div);
    scrollBottom();
  }, delay);
}

function addTyping() {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.id = 'chatbot-typing';
  div.className = 'msg msg-bot';
  div.innerHTML = `
    <div class="msg-bot-avatar">T</div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  msgs.appendChild(div);
  scrollBottom();
}

function removeTyping() {
  const el = document.getElementById('chatbot-typing');
  if (el) el.remove();
}

function clearChips() {
  const c = document.getElementById('chatbot-chips');
  if (c) c.innerHTML = '';
}

function scrollBottom() {
  const msgs = document.getElementById('chatbot-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatbot-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
});
