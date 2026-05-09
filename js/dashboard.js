// ── API ────────────────────────────────────────────────────────────────────────
const API = 'https://techweek-production-fedb.up.railway.app';

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
  loadEventData();
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
      { key: 'duracao',    label: 'Duração',           fullWidth: false },
      { key: 'briefing',   label: 'Briefing',           fullWidth: true  },
      { key: 'biografia',  label: 'Biografia',          fullWidth: true  },
      { key: 'experiencia',label: 'Experiência Prévia', fullWidth: true  },
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
let searchTerm    = '';
let currentTab    = 'dashboard';
let pendingAction = null;
let editingId     = null;

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

// ── Curriculo link helper ──────────────────────────────────────────────────────
function renderCurriculoField(item) {
  if (!item.curriculo) return '';
  return `
    <div class="field-group full-width">
      <span class="field-label">Currículo</span>
      <a href="${item.curriculo.startsWith('http') ? item.curriculo : API + item.curriculo}" target="_blank" class="field-value" style="color:var(--blue);text-decoration:underline">📄 Visualizar currículo</a>
    </div>`;
}

// ── Edit speaker modal ─────────────────────────────────────────────────────────
function openEditSpeaker(id) {
  const item = findItem('palestrantes', id);
  if (!item) return;
  editingId = id;
  document.getElementById('edit-nome').value     = item.nome      || '';
  document.getElementById('edit-email').value    = item.email     || '';
  document.getElementById('edit-telefone').value = item.telefone  || '';
  document.getElementById('edit-tema').value     = item.tema      || '';
  document.getElementById('edit-duracao').value  = item.duracao   || '';
  document.getElementById('edit-briefing').value = item.briefing  || '';
  document.getElementById('edit-bio').value      = item.biografia || '';
  document.getElementById('edit-exp').value      = item.experiencia || '';
  document.getElementById('edit-modal-overlay').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('edit-modal-overlay').classList.add('hidden');
  editingId = null;
}

async function saveEditSpeaker() {
  if (!editingId) return;
  const updates = {
    nome:        document.getElementById('edit-nome').value.trim(),
    email:       document.getElementById('edit-email').value.trim(),
    telefone:    document.getElementById('edit-telefone').value.trim(),
    tema:        document.getElementById('edit-tema').value.trim(),
    duracao:     document.getElementById('edit-duracao').value.trim(),
    briefing:    document.getElementById('edit-briefing').value.trim(),
    biografia:   document.getElementById('edit-bio').value.trim(),
    experiencia: document.getElementById('edit-exp').value.trim(),
  };
  try {
    await fetch(`${API}/inscricao/palestrantes/${editingId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(updates),
    });
    Object.assign(findItem('palestrantes', editingId), updates);
    closeEditModal();
    render();
    renderRelatorios();
    showToast('success', 'Inscrição atualizada!');
  } catch {
    showToast('error', 'Erro ao salvar alterações');
  }
}

// ── Publicar palestrante no evento ─────────────────────────────────────────────
function publicarNoEvento(id) {
  const item = findItem('palestrantes', id);
  if (!item) return;
  switchTab('evento');
  document.getElementById('speaker-form').classList.remove('hidden');
  document.getElementById('sp-nome').value  = item.nome      || '';
  document.getElementById('sp-bio').value   = item.biografia || '';
  document.getElementById('sp-tema').value  = item.tema      || '';
  showToast('info', 'Dados pré-preenchidos. Revise e salve.');
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

  const curriculoHTML = section.key === 'palestrantes' ? renderCurriculoField(item) : '';
  return `
    <div class="inscricao-card ${item.status}" data-id="${item.id}">
      <div class="card-top-row"><span></span>${getStatusBadge(item.status)}</div>
      <div class="card-fields">${buildFields(item, section)}${curriculoHTML}</div>
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
    const res = await fetch(`${API}/send-email`, {
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

  const isPalestrante = section.key === 'palestrantes';
  const editBtn = isPalestrante ? `
    <button class="btn btn-change" onclick="event.stopPropagation(); openEditSpeaker(${item.id})" title="Editar dados">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
      Editar
    </button>` : '';

  const publishBtn = (isPalestrante && item.status === 'aceito') ? `
    <button class="btn btn-primary" onclick="event.stopPropagation(); publicarNoEvento(${item.id})" title="Publicar no evento">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Publicar no Evento
    </button>` : '';

  const details = isOpen ? `
    <div class="rel-details">
      <div class="card-fields">${buildFields(item, section)}${isPalestrante ? renderCurriculoField(item) : ''}</div>
      <div class="card-actions">
        <button class="btn btn-change" onclick="event.stopPropagation(); openChangeStatus('${section.key}', ${item.id})">
          ${icons.refresh} Alterar status
        </button>
        ${editBtn}
        ${publishBtn}
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
  ['dashboard', 'relatorios', 'evento'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('hidden', tab !== t);
    document.getElementById(`tab-btn-${t}`).classList.toggle('active', tab === t);
  });
  if (tab === 'relatorios') renderRelatorios();
  if (tab === 'evento') renderEventTab();
}

// ── Event Management ───────────────────────────────────────────────────────────
let eventSpeakers = [];
let eventSchedule = [];

async function loadEventData() {
  try {
    const [sRes, schRes] = await Promise.all([
      fetch(`${API}/event-speakers`),
      fetch(`${API}/event-schedule`)
    ]);
    eventSpeakers = await sRes.json();
    eventSchedule = await schRes.json();
    renderEventTab();
  } catch { /* silently fail */ }
  loadEventConfig();
}

async function loadEventConfig() {
  try {
    const res = await fetch(`${API}/event-config`);
    const cfg = await res.json();
    if (cfg.data_inicio) document.getElementById('cfg-inicio').value = cfg.data_inicio;
    if (cfg.data_fim)    document.getElementById('cfg-fim').value    = cfg.data_fim;
  } catch { /* silently fail */ }
}

async function saveEventConfig() {
  const inicio = document.getElementById('cfg-inicio').value;
  const fim    = document.getElementById('cfg-fim').value;
  if (!inicio || !fim) { showToast('error', 'Selecione as duas datas'); return; }

  try {
    const res  = await fetch(`${API}/event-config`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ data_inicio: inicio, data_fim: fim }),
    });
    const json = await res.json();
    if (json.success) showToast('success', 'Datas do evento atualizadas!');
    else showToast('error', 'Erro ao salvar as datas');
  } catch {
    showToast('error', 'Erro ao conectar com o servidor');
  }
}

function renderEventTab() {
  renderEventSpeakers();
  renderEventSchedule();
}

function toggleEventForm(formId) {
  document.getElementById(formId).classList.toggle('hidden');
}

function previewFoto(input) {
  const circle = document.getElementById('sp-foto-circle');
  const hint   = document.getElementById('sp-foto-nome');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      circle.innerHTML = `<img src="${e.target.result}" alt="preview">`;
      circle.classList.add('has-photo');
    };
    reader.readAsDataURL(input.files[0]);
    hint.textContent = input.files[0].name;
  }
}

// ── Speakers ───────────────────────────────────────────────────────────────────
function renderEventSpeakers() {
  const list    = document.getElementById('event-speakers-list');
  const counter = document.getElementById('count-event-speakers');
  if (!list) return;
  if (counter) counter.textContent = eventSpeakers.length;

  if (eventSpeakers.length === 0) {
    list.innerHTML = `<div class="empty-state"><p>Nenhum palestrante cadastrado ainda</p></div>`;
    return;
  }

  list.innerHTML = eventSpeakers.map(s => `
    <div class="event-item-card" data-id="${s.id}">
      <div class="event-item-photo">
        ${s.foto
          ? `<img src="${API}${s.foto}" alt="${s.nome}">`
          : `<div class="photo-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg></div>`}
      </div>
      <div class="event-item-info">
        <strong class="event-item-name">${s.nome}</strong>
        ${s.cargo || s.empresa ? `<span class="event-item-sub">${[s.cargo, s.empresa].filter(Boolean).join(' · ')}</span>` : ''}
        ${s.tema ? `<span class="event-item-tag">${s.tema}</span>` : ''}
        ${s.bio  ? `<p class="event-item-bio">${s.bio}</p>` : ''}
        ${s.linkedin ? `<a href="${s.linkedin}" target="_blank" class="event-item-link">LinkedIn ↗</a>` : ''}
      </div>
      <button class="btn btn-delete-mini" onclick="deleteEventSpeaker(${s.id})" title="Excluir palestrante">${trashSVG}</button>
    </div>`).join('');
}

async function addEventSpeaker() {
  const nome = document.getElementById('sp-nome').value.trim();
  if (!nome) { showToast('error', 'Nome é obrigatório'); return; }

  const formData = new FormData();
  formData.append('nome',     nome);
  formData.append('cargo',    document.getElementById('sp-cargo').value.trim());
  formData.append('empresa',  document.getElementById('sp-empresa').value.trim());
  formData.append('tema',     document.getElementById('sp-tema').value.trim());
  formData.append('bio',      document.getElementById('sp-bio').value.trim());
  formData.append('linkedin', document.getElementById('sp-linkedin').value.trim());

  const fotoFile = document.getElementById('sp-foto').files[0];
  if (fotoFile) formData.append('foto', fotoFile);

  const btn = document.querySelector('#speaker-form .btn-accept');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    const res  = await fetch(`${API}/event-speakers`, { method: 'POST', body: formData });
    const json = await res.json();
    if (json.success) {
      eventSpeakers.push(json.item);
      renderEventSpeakers();
      ['sp-nome','sp-cargo','sp-empresa','sp-tema','sp-bio','sp-linkedin'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('sp-foto').value = '';
      const circle = document.getElementById('sp-foto-circle');
      circle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>`;
      circle.classList.remove('has-photo');
      document.getElementById('sp-foto-nome').textContent = 'Nenhum arquivo';
      toggleEventForm('speaker-form');
      showToast('success', `Palestrante ${nome} adicionado!`);
    }
  } catch {
    showToast('error', 'Erro ao salvar palestrante');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Salvar Palestrante`;
  }
}

async function deleteEventSpeaker(id) {
  showModal('Remover palestrante', 'Tem certeza que deseja remover este palestrante do evento?', false, async () => {
    await fetch(`${API}/event-speakers/${id}`, { method: 'DELETE' });
    eventSpeakers = eventSpeakers.filter(s => s.id !== id);
    hideModal();
    renderEventSpeakers();
    showToast('success', 'Palestrante removido');
  });
}

// ── Schedule ───────────────────────────────────────────────────────────────────
function renderEventSchedule() {
  const list    = document.getElementById('event-schedule-list');
  const counter = document.getElementById('count-event-schedule');
  if (!list) return;
  if (counter) counter.textContent = eventSchedule.length;

  if (eventSchedule.length === 0) {
    list.innerHTML = `<div class="empty-state"><p>Nenhum item na programação ainda</p></div>`;
    return;
  }

  list.innerHTML = eventSchedule.map(s => `
    <div class="event-item-card" data-id="${s.id}">
      <div class="event-schedule-badge">
        ${s.data    ? `<span class="sched-date">${s.data}</span>` : ''}
        ${s.horario ? `<span class="sched-time">${s.horario}</span>` : ''}
        ${s.local   ? `<span class="sched-local">${s.local}</span>` : ''}
      </div>
      <div class="event-item-info">
        <strong class="event-item-name">${s.titulo}</strong>
        ${s.palestrante ? `<span class="event-item-sub">${s.palestrante}</span>` : ''}
        ${s.duracao     ? `<span class="event-item-tag">${s.duracao}</span>` : ''}
        ${s.descricao   ? `<p class="event-item-bio">${s.descricao}</p>` : ''}
      </div>
      <button class="btn btn-delete-mini" onclick="deleteEventSchedule(${s.id})" title="Excluir item">${trashSVG}</button>
    </div>`).join('');
}

async function addEventSchedule() {
  const titulo = document.getElementById('sc-titulo').value.trim();
  if (!titulo) { showToast('error', 'Título é obrigatório'); return; }

  const dataRaw   = document.getElementById('sc-data').value;
  const horarioRaw = document.getElementById('sc-horario').value;
  const dataFmt = dataRaw ? new Date(dataRaw + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';

  const item = {
    data:        dataFmt,
    horario:     horarioRaw,
    titulo,
    palestrante: document.getElementById('sc-palestrante').value.trim(),
    local:       document.getElementById('sc-local').value.trim(),
    duracao:     document.getElementById('sc-duracao').value.trim(),
    descricao:   document.getElementById('sc-descricao').value.trim(),
  };

  const btn = document.querySelector('#schedule-form .btn-accept');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    const res  = await fetch(`${API}/event-schedule`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(item)
    });
    const json = await res.json();
    if (json.success) {
      eventSchedule.push(json.item);
      renderEventSchedule();
      ['sc-data','sc-horario','sc-titulo','sc-palestrante','sc-local','sc-duracao','sc-descricao'].forEach(id => {
        document.getElementById(id).value = '';
      });
      toggleEventForm('schedule-form');
      showToast('success', `"${titulo}" adicionado à programação!`);
    }
  } catch {
    showToast('error', 'Erro ao salvar item da programação');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Salvar na Programação`;
  }
}

async function deleteEventSchedule(id) {
  showModal('Remover item', 'Tem certeza que deseja remover este item da programação?', false, async () => {
    await fetch(`${API}/event-schedule/${id}`, { method: 'DELETE' });
    eventSchedule = eventSchedule.filter(s => s.id !== id);
    hideModal();
    renderEventSchedule();
    showToast('success', 'Item removido da programação');
  });
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

document.getElementById('edit-modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'edit-modal-overlay') closeEditModal();
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
