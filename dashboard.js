// ── API ────────────────────────────────────────────────────────────────────────
const API = 'http://localhost:3000';

const db = { participantes: [], palestrantes: [], coffeeBreak: [], projetos: [] };

async function loadData() {
  try {
    const res  = await fetch(`${API}/inscricoes`);
    const data = await res.json();
    Object.assign(db, data);
  } catch {
    showToast('error', 'Servidor offline. Verifique se o backend está rodando.');
  }
  render();
}

async function apiPatch(tipo, id, status) {
  await fetch(`${API}/inscricao/${tipo}/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status }),
  });
}

async function apiDelete(tipo, id) {
  await fetch(`${API}/inscricao/${tipo}/${id}`, { method: 'DELETE' });
}

// ── Section config ─────────────────────────────────────────────────────────────
const sections = [
  {
    key: 'participantes',
    label: 'Participante',
    listId: 'participantes-list',
    countId: 'count-participantes',
    statId: 'stat-participantes',
    emptyMsg: 'Nenhum participante inscrito ainda',
    emptyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
    fields: [
      { key: 'nome', label: 'Nome', fullWidth: false },
      { key: 'email', label: 'Email', fullWidth: false },
      { key: 'telefone', label: 'Telefone', fullWidth: false }
    ]
  },
  {
    key: 'palestrantes',
    label: 'Palestrante',
    listId: 'palestrantes-list',
    countId: 'count-palestrantes',
    statId: 'stat-palestrantes',
    emptyMsg: 'Nenhum palestrante cadastrado',
    emptyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>`,
    fields: [
      { key: 'nome', label: 'Nome', fullWidth: false },
      { key: 'tema', label: 'Tema', fullWidth: false },
      { key: 'email', label: 'Email', fullWidth: false },
      { key: 'telefone', label: 'Telefone', fullWidth: false },
      { key: 'duracao', label: 'Duração', fullWidth: false },
      { key: 'briefing', label: 'Briefing', fullWidth: true }
    ]
  },
  {
    key: 'coffeeBreak',
    label: 'Coffee Break',
    listId: 'coffee-list',
    countId: 'count-coffee',
    statId: 'stat-coffee',
    emptyMsg: 'Nenhum participante confirmado para o coffee break',
    emptyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></svg>`,
    fields: [
      { key: 'nome', label: 'Nome', fullWidth: false },
      { key: 'email', label: 'Email', fullWidth: false },
      { key: 'telefone', label: 'Telefone', fullWidth: false },
      { key: 'restricoes', label: 'Restrições Alimentares', fullWidth: true }
    ]
  },
  {
    key: 'projetos',
    label: 'Projeto',
    listId: 'projetos-list',
    countId: 'count-projetos',
    statId: 'stat-projetos',
    emptyMsg: 'Nenhum projeto cadastrado ainda',
    emptyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
    fields: [
      { key: 'nome', label: 'Nome do Projeto', fullWidth: false },
      { key: 'equipe', label: 'Equipe', fullWidth: false },
      { key: 'email', label: 'Email', fullWidth: false },
      { key: 'tecnologias', label: 'Tecnologias', fullWidth: false },
      { key: 'descricao', label: 'Descrição', fullWidth: true }
    ]
  }
];

const statusLabels = { pendente: 'Pendente', aceito: 'Aceito', negado: 'Negado' };

const icons = {
  check:       `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:           `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  refresh:     `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  xCircle:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
};

// ── State ──────────────────────────────────────────────────────────────────────
let searchTerm  = '';
let currentTab  = 'dashboard';
let pendingAction = null;

// ── Theme ──────────────────────────────────────────────────────────────────────
(function applyTheme() {
  const saved = localStorage.getItem('theme') || '';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// ── Animated counter ───────────────────────────────────────────────────────────
function animateCounter(el, target) {
  const start = parseInt(el.textContent) || 0;
  if (start === target) return;
  const duration = 550;
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Toast ──────────────────────────────────────────────────────────────────────
const toastSVGs = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  info:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`
};

function showToast(type, message) {
  const id = `toast-${Date.now()}`;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.id = id;
  el.innerHTML = `
    <div class="toast-icon">${toastSVGs[type]}</div>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="dismissToast('${id}')">×</button>
  `;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => dismissToast(id), 3600);
}

function dismissToast(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('toast-leaving');
  setTimeout(() => el?.remove(), 280);
}

// ── Card exit animation ────────────────────────────────────────────────────────
function animateCardOut(sectionKey, id, callback) {
  const section = sections.find(s => s.key === sectionKey);
  const listEl  = section ? document.getElementById(section.listId) : null;
  const card    = listEl?.querySelector(`[data-id="${id}"]`);
  if (!card) { callback(); return; }
  card.classList.add('card-leaving');
  setTimeout(callback, 340);
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getStatusBadge(status) {
  return `<span class="status-badge ${status}">● ${statusLabels[status]}</span>`;
}

function buildFields(item, section) {
  return section.fields
    .filter(f => item[f.key] !== undefined && item[f.key] !== null && item[f.key] !== '')
    .map(f => `
      <div class="field-group${f.fullWidth ? ' full-width' : ''}">
        <span class="field-label">${f.label}</span>
        <span class="field-value">${item[f.key]}</span>
      </div>
    `).join('');
}

// ── Dashboard card ─────────────────────────────────────────────────────────────
function renderCard(item, section) {
  const actions = item.status === 'pendente'
    ? `
      <button class="btn btn-accept" onclick="confirmAction('${section.key}', ${item.id}, 'aceito')">
        ${icons.check} Aceitar
      </button>
      <button class="btn btn-reject" onclick="confirmAction('${section.key}', ${item.id}, 'negado')">
        ${icons.x} Negar
      </button>`
    : `
      <button class="btn btn-change" onclick="openChangeStatus('${section.key}', ${item.id})">
        ${icons.refresh} Alterar status
      </button>`;

  return `
    <div class="inscricao-card ${item.status}" data-id="${item.id}">
      <div class="card-top-row"><span></span>${getStatusBadge(item.status)}</div>
      <div class="card-fields">${buildFields(item, section)}</div>
      <div class="card-actions">${actions}</div>
    </div>`;
}

// ── Email sending ──────────────────────────────────────────────────────────────
const emailSentItems = new Set(); // 'sectionKey-id' → já enviados
const emailSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const spinSVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

async function sendEmail(sectionKey, id, btnEl) {
  const item    = findItem(sectionKey, id);
  const section = sections.find(s => s.key === sectionKey);

  btnEl.disabled = true;
  btnEl.innerHTML = `${spinSVG} Enviando...`;

  try {
    const res = await fetch('http://localhost:3000/send-email', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome:   item.nome,
        email:  item.email,
        status: 'aprovado',
        tipo:   section.label.toLowerCase()
      })
    });

    const json = await res.json();

    if (json.success) {
      emailSentItems.add(`${sectionKey}-${id}`);
      showToast('success', `Email enviado para ${item.nome}!`);
      btnEl.innerHTML = `${icons.check} Enviado`;
      btnEl.classList.add('btn-email-sent');
    } else {
      throw new Error(json.error || 'Erro desconhecido');
    }
  } catch (err) {
    console.error('sendEmail error:', err);
    showToast('error', `Erro ao enviar email: ${err.message}`);
    btnEl.disabled = false;
    btnEl.innerHTML = `${emailSVG} Enviar email`;
  }
}

// ── Relatórios State ───────────────────────────────────────────────────────────
const relState = {
  expandedSections: new Set(),
  expandedCards:    new Set(),
  search:           ''
};

const sectionTitles = {
  participantes: 'Participantes',
  palestrantes:  'Palestrantes',
  coffeeBreak:   'Coffee Break',
  projetos:      'Projetos'
};

const chevronSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
const trashSVG   = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

function toggleRelSection(key) {
  relState.expandedSections.has(key)
    ? relState.expandedSections.delete(key)
    : relState.expandedSections.add(key);
  renderRelatorios();
}

function toggleRelCard(sectionKey, id) {
  const k = `${sectionKey}-${id}`;
  relState.expandedCards.has(k)
    ? relState.expandedCards.delete(k)
    : relState.expandedCards.add(k);
  renderRelatorios();
}

function filterRel(items) {
  const term = relState.search.toLowerCase();
  if (!term) return items;
  return items.filter(i =>
    (i.nome  && i.nome.toLowerCase().includes(term)) ||
    (i.email && i.email.toLowerCase().includes(term))
  );
}

async function deleteRelItem(sectionKey, id) {
  await apiDelete(sectionKey, id);
  db[sectionKey] = db[sectionKey].filter(i => i.id !== id);
  emailSentItems.delete(`${sectionKey}-${id}`);
  relState.expandedCards.delete(`${sectionKey}-${id}`);
  renderRelatorios();
  render();
  showToast('success', 'Registro excluído com sucesso');
}

function renderMiniCard(item, section) {
  const k        = `${section.key}-${item.id}`;
  const isOpen   = relState.expandedCards.has(k);
  const wasSent  = emailSentItems.has(k);

  const emailBtn = item.status === 'aceito' ? `
    <button
      class="btn btn-email-mini ${wasSent ? 'btn-email-sent' : ''}"
      onclick="event.stopPropagation(); ${wasSent ? '' : `sendEmail('${section.key}', ${item.id}, this)`}"
      ${wasSent ? 'disabled' : ''}
      title="${wasSent ? 'Email já enviado' : 'Enviar email de aprovação'}"
    >
      ${wasSent ? `${icons.check} Enviado` : `${emailSVG} Enviar email`}
    </button>` : '';

  const deleteBtn = `
    <button
      class="btn btn-delete-mini"
      onclick="event.stopPropagation(); deleteRelItem('${section.key}', ${item.id})"
      title="Excluir registro"
    >${trashSVG}</button>`;

  const details = isOpen ? `
    <div class="rel-details">
      <div class="card-fields">${buildFields(item, section)}</div>
      <div class="card-actions">
        <button class="btn btn-change" onclick="event.stopPropagation(); openChangeStatus('${section.key}', ${item.id})">
          ${icons.refresh} Alterar status
        </button>
      </div>
    </div>` : '';

  return `
    <div class="rel-mini-card ${item.status}" onclick="toggleRelCard('${section.key}', ${item.id})">
      <div class="rel-mini-top">
        <div class="rel-mini-info">
          <span class="rel-mini-name">${item.nome}</span>
          <span class="rel-mini-email">${item.email || ''}</span>
        </div>
        ${emailBtn}
        ${deleteBtn}
        <div class="mini-chevron ${isOpen ? 'open' : ''}">${chevronSVG}</div>
      </div>
      ${details}
    </div>`;
}

function renderSubgroup(items, section, statusVal, label) {
  const filtered = filterRel(items.filter(i => i.status === statusVal));
  const body = filtered.length === 0
    ? `<p class="rel-empty">Nenhum registro ${statusVal === 'aceito' ? 'aceito' : 'negado'} nesta categoria</p>`
    : filtered.map(item => renderMiniCard(item, section)).join('');

  return `
    <div class="rel-subgroup">
      <div class="rel-subgroup-header ${statusVal}">
        <span class="rel-sub-label">● ${label} (${filtered.length})</span>
      </div>
      ${body}
    </div>`;
}

// ── Render Relatórios ──────────────────────────────────────────────────────────
function renderRelatorios() {
  const content = document.getElementById('relatorios-content');
  if (!content) return;

  content.innerHTML = sections.map(section => {
    const items        = db[section.key];
    const totalAceitos = items.filter(i => i.status === 'aceito').length;
    const totalNegados = items.filter(i => i.status === 'negado').length;

    // Hide section when searching and no matches
    const hasMatch = filterRel(items.filter(i => i.status === 'aceito' || i.status === 'negado')).length > 0;
    if (relState.search && !hasMatch) return '';

    const isOpen = relState.expandedSections.has(section.key);
    const title  = sectionTitles[section.key];

    return `
      <div class="card section">
        <div class="rel-section-header" onclick="toggleRelSection('${section.key}')">
          <div class="section-title">
            <div class="section-icon">${section.emptyIcon}</div>
            <h2>${title}</h2>
            <div class="rel-count-badges">
              <span class="rel-count-badge aceito-count">${totalAceitos} aceito${totalAceitos !== 1 ? 's' : ''}</span>
              <span class="rel-count-badge negado-count">${totalNegados} negado${totalNegados !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div class="expand-chevron ${isOpen ? 'open' : ''}">${chevronSVG}</div>
        </div>
        ${isOpen ? `
          <div class="rel-body">
            ${renderSubgroup(items, section, 'aceito', 'Aceitos')}
            ${renderSubgroup(items, section, 'negado', 'Negados')}
          </div>` : ''}
      </div>`;
  }).join('');
}

// ── Render Dashboard ───────────────────────────────────────────────────────────
function filterItems(items) {
  return items.filter(item => {
    if (item.status !== 'pendente') return false;
    const term = searchTerm.toLowerCase();
    return !term ||
      (item.nome  && item.nome.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term));
  });
}

function render() {
  sections.forEach(section => {
    const filtered = filterItems(db[section.key]);
    const total    = db[section.key].length;
    const pending  = db[section.key].filter(i => i.status === 'pendente').length;

    animateCounter(document.getElementById(section.statId), total);
    document.getElementById(section.countId).textContent = filtered.length;

    const sub = document.getElementById(`stat-pending-${section.key}`);
    if (sub) sub.textContent = `${pending} pendente${pending !== 1 ? 's' : ''}`;

    const listEl = document.getElementById(section.listId);
    listEl.innerHTML = filtered.length === 0
      ? `<div class="empty-state"><div class="empty-icon">${section.emptyIcon}</div><p>${section.emptyMsg}</p></div>`
      : filtered.map(item => renderCard(item, section)).join('');
  });

  if (currentTab === 'relatorios') renderRelatorios();
}

// ── Tab switching ──────────────────────────────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-dashboard').classList.toggle('hidden', tab !== 'dashboard');
  document.getElementById('tab-relatorios').classList.toggle('hidden', tab !== 'relatorios');
  document.getElementById('tab-btn-dashboard').classList.toggle('active', tab === 'dashboard');
  document.getElementById('tab-btn-relatorios').classList.toggle('active', tab === 'relatorios');
  if (tab === 'relatorios') renderRelatorios();
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function showModal(title, message, showSelect, onConfirm) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal-select-wrap').classList.toggle('hidden', !showSelect);
  document.getElementById('modal-overlay').classList.remove('hidden');
  pendingAction = onConfirm;
}

function hideModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  pendingAction = null;
}

function findItem(sectionKey, id) {
  return db[sectionKey].find(i => i.id === id);
}

function confirmAction(sectionKey, id, newStatus) {
  const item  = findItem(sectionKey, id);
  const verb  = newStatus === 'aceito' ? 'aceitar' : 'negar';
  showModal(
    'Confirmar ação',
    `Tem certeza que deseja ${verb} a inscrição de ${item.nome}?`,
    false,
    async () => {
      await apiPatch(sectionKey, id, newStatus);
      item.status = newStatus;
      hideModal();
      const msg = newStatus === 'aceito'
        ? `${item.nome} foi aceito(a) com sucesso!`
        : `Inscrição de ${item.nome} foi negada.`;
      animateCardOut(sectionKey, id, () => {
        render();
        showToast(newStatus === 'aceito' ? 'success' : 'error', msg);
      });
    }
  );
}

function openChangeStatus(sectionKey, id) {
  const item = findItem(sectionKey, id);
  document.getElementById('modal-select').value = item.status;
  showModal(
    'Alterar status',
    `Selecione o novo status para ${item.nome}:`,
    true,
    async () => {
      const prev = item.status;
      const next = document.getElementById('modal-select').value;
      await apiPatch(sectionKey, id, next);
      item.status = next;
      hideModal();
      render();
      if (next !== prev)
        showToast('info', `Status de ${item.nome} alterado para ${statusLabels[item.status]}.`);
    }
  );
}

// ── Event listeners ────────────────────────────────────────────────────────────
document.getElementById('btn-modal-confirm').addEventListener('click', () => {
  if (pendingAction) pendingAction();
});

document.getElementById('btn-modal-cancel').addEventListener('click', hideModal);

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-overlay') hideModal();
});

document.getElementById('search-input').addEventListener('input', e => {
  searchTerm = e.target.value;
  render();
});

document.getElementById('search-relatorios').addEventListener('input', e => {
  relState.search = e.target.value;
  renderRelatorios();
});

loadData();
