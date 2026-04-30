// Mock data
const db = {
  participantes: [
    { id: 1, nome: 'Ana Clara Silva', email: 'ana.silva@email.com', telefone: '67999111111', status: 'pendente' },
    { id: 2, nome: 'Carlos Eduardo Santos', email: 'carlos.santos@email.com', telefone: '67999222222', status: 'aceito' },
    { id: 3, nome: 'Maria Fernanda Oliveira', email: 'maria.oliveira@email.com', telefone: '67999333333', status: 'negado' }
  ],
  palestrantes: [
    {
      id: 1,
      nome: 'DIOGO DE OLIVEIRA TEIXEIRA',
      email: 'diogoteixeira4000@gmail.com',
      telefone: '67984390638',
      tema: 'TI',
      duracao: '50 minutos',
      briefing: 'Muita coisa',
      status: 'pendente'
    }
  ],
  coffeeBreak: [
    { id: 1, nome: 'João Pedro Lima', email: 'joao.lima@email.com', telefone: '67988444444', restricoes: 'Sem glúten', status: 'pendente' }
  ],
  projetos: [
    {
      id: 1,
      nome: 'App de Gestão Escolar',
      equipe: 'Grupo Alpha',
      email: 'alpha@email.com',
      tecnologias: 'React, Node.js, PostgreSQL',
      descricao: 'Sistema web para gerenciar alunos, turmas e notas.',
      status: 'pendente'
    }
  ]
};

// Section configuration
const sections = [
  {
    key: 'participantes',
    label: 'Participante',
    listId: 'participantes-list',
    countId: 'count-participantes',
    statId: 'stat-participantes',
    emptyMsg: 'Nenhum participante inscrito ainda',
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
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
};

// State
let searchTerm = '';
let currentTab = 'dashboard';
let pendingAction = null;

// ── Tab switching ──────────────────────────────────────────────────────────────

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-dashboard').classList.toggle('hidden', tab !== 'dashboard');
  document.getElementById('tab-relatorios').classList.toggle('hidden', tab !== 'relatorios');
  document.getElementById('tab-btn-dashboard').classList.toggle('active', tab === 'dashboard');
  document.getElementById('tab-btn-relatorios').classList.toggle('active', tab === 'relatorios');
  if (tab === 'relatorios') renderRelatorios();
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
  const actionsHTML = item.status === 'pendente'
    ? `
      <button class="btn btn-accept" onclick="confirmAction('${section.key}', ${item.id}, 'aceito')">
        ${icons.check} Aceitar
      </button>
      <button class="btn btn-reject" onclick="confirmAction('${section.key}', ${item.id}, 'negado')">
        ${icons.x} Negar
      </button>
    `
    : `
      <button class="btn btn-change" onclick="openChangeStatus('${section.key}', ${item.id})">
        ${icons.refresh} Alterar status
      </button>
    `;

  return `
    <div class="inscricao-card ${item.status}">
      <div class="card-top-row">
        <span></span>
        ${getStatusBadge(item.status)}
      </div>
      <div class="card-fields">${buildFields(item, section)}</div>
      <div class="card-actions">${actionsHTML}</div>
    </div>
  `;
}

// ── Relatórios card ────────────────────────────────────────────────────────────

function renderRelatorioCard(item, section) {
  return `
    <div class="inscricao-card ${item.status}">
      <div class="card-top-row">
        <span class="category-tag">${section.label}</span>
        ${getStatusBadge(item.status)}
      </div>
      <div class="card-fields">${buildFields(item, section)}</div>
      <div class="card-actions">
        <button class="btn btn-change" onclick="openChangeStatus('${section.key}', ${item.id})">
          ${icons.refresh} Alterar status
        </button>
      </div>
    </div>
  `;
}

function renderRelatorios() {
  const container = document.getElementById('tab-relatorios');

  const aceitos = [];
  const negados = [];

  sections.forEach(section => {
    db[section.key].forEach(item => {
      if (item.status === 'aceito') aceitos.push({ item, section });
      if (item.status === 'negado') negados.push({ item, section });
    });
  });

  const buildGroup = (entries, status, iconHtml, iconClass, emptyMsg, sectionTitle) => `
    <div class="card section">
      <div class="section-header">
        <div class="section-title">
          <div class="section-icon ${iconClass}">${iconHtml}</div>
          <h2>${sectionTitle} (${entries.length})</h2>
        </div>
      </div>
      <div class="inscricoes-list">
        ${entries.length === 0
          ? `<p class="empty-state">${emptyMsg}</p>`
          : entries.map(({ item, section }) => renderRelatorioCard(item, section)).join('')
        }
      </div>
    </div>
  `;

  container.innerHTML =
    buildGroup(aceitos, 'aceito', icons.checkCircle, 'icon-green', 'Nenhuma inscrição aceita ainda', 'Aceitos') +
    buildGroup(negados, 'negado', icons.xCircle, 'icon-red', 'Nenhuma inscrição negada ainda', 'Negados');
}

// ── Dashboard render ───────────────────────────────────────────────────────────

function filterItems(items) {
  return items.filter(item => {
    if (item.status !== 'pendente') return false;
    const term = searchTerm.toLowerCase();
    return !term ||
      (item.nome && item.nome.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term));
  });
}

function render() {
  sections.forEach(section => {
    const filtered = filterItems(db[section.key]);
    const total = db[section.key].length;

    document.getElementById(section.statId).textContent = total;
    document.getElementById(section.countId).textContent = filtered.length;

    const listEl = document.getElementById(section.listId);
    listEl.innerHTML = filtered.length === 0
      ? `<p class="empty-state">${section.emptyMsg}</p>`
      : filtered.map(item => renderCard(item, section)).join('');
  });

  if (currentTab === 'relatorios') renderRelatorios();
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
  const item = findItem(sectionKey, id);
  const label = newStatus === 'aceito' ? 'aceitar' : 'negar';
  showModal(
    'Confirmar ação',
    `Tem certeza que deseja ${label} a inscrição de ${item.nome}?`,
    false,
    () => { item.status = newStatus; hideModal(); render(); }
  );
}

function openChangeStatus(sectionKey, id) {
  const item = findItem(sectionKey, id);
  document.getElementById('modal-select').value = item.status;
  showModal(
    'Alterar status',
    `Selecione o novo status para ${item.nome}:`,
    true,
    () => { item.status = document.getElementById('modal-select').value; hideModal(); render(); }
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

render();
