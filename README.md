<div align="center">

<img src="css/imgs/uni.png.png" alt="Unicesumar" width="120"/>

# II Tech Week — Unicesumar Londrina

**Inteligência Artificial em Ação**

*1 a 3 de Junho de 2026 · Campus Unicesumar Londrina*

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## Sobre o Projeto

O **II Tech Week** é o site oficial do evento de tecnologia da **Unicesumar Londrina**, desenvolvido para gerenciar inscrições de participantes e palestrantes, exibir a programação do evento e oferecer uma experiência moderna e acessível ao público.

O sistema conta com um **painel administrativo completo**, um **chatbot de atendimento** e suporte a **temas claro e escuro**.

---

## Funcionalidades

### Público
- 🎯 **Landing page** com hero animado, logos flutuantes e seções de programação e palestrantes carregadas dinamicamente
- 📝 **Inscrição de participantes** com opções de coffee break e apresentação de projetos
- 🎤 **Inscrição de palestrantes** com briefing e duração da palestra
- 🤖 **TechBot** — chatbot flutuante com respostas inteligentes sobre o evento, personalizável com o nome do usuário
- ♿ **VLibras** integrado para acessibilidade em Libras
- 🌙 **Tema claro/escuro** com persistência via localStorage

### Administrativo
- 🔐 **Login seguro** com credenciais de administrador
- 📊 **Dashboard** com estatísticas de inscrições em tempo real
- ✅ **Gestão de inscrições** — aprovar, negar e excluir participantes e palestrantes
- 📧 **Envio de emails** automáticos de aprovação/reprovação via Resend
- 🗓️ **Gerenciamento de datas** do evento (reflete dinamicamente no site)
- 🧑‍💼 **Palestrantes do evento** com foto, bio, cargo e LinkedIn
- 📋 **Programação do evento** com data, horário, local e descrição

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Backend | Node.js + Express.js |
| Banco de dados | Supabase (PostgreSQL) |
| Upload de arquivos | Multer |
| Envio de emails | Resend |
| Acessibilidade | VLibras |
| Fontes | Inter — Google Fonts |

---

## Estrutura do Projeto

```
weektech/
├── index.html              # Landing page principal
├── login.html              # Tela de login administrativo
├── dashboard.html          # Painel administrativo
├── participante.html       # Formulário de inscrição de participante
├── palestrante.html        # Formulário de inscrição de palestrante
│
├── css/
│   ├── style.css           # Design system e estilos globais
│   ├── dashboard.css       # Estilos do painel administrativo
│   ├── login.css           # Estilos da tela de login
│   └── chatbot.css         # Estilos do TechBot
│
├── js/
│   ├── script.js           # Scripts globais e toast notifications
│   ├── dashboard.js        # Lógica do painel administrativo
│   ├── chatbot.js          # Lógica do chatbot TechBot
│   └── FAQ.js              # Scripts do FAQ
│
├── css/imgs/               # Imagens e logos
│
└── backend/
    ├── server.js           # API Express com todas as rotas
    ├── .env                # Variáveis de ambiente (não versionado)
    ├── package.json
    └── uploads/            # Fotos dos palestrantes (gerado automaticamente)
```

---

## Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+
- Conta no [Supabase](https://supabase.com/)
- Conta no [Resend](https://resend.com/) *(opcional, para envio de emails)*

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/weektech.git
cd weektech
```

### 2. Configure o backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` dentro de `backend/`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_service_role_key
RESEND_API_KEY=re_sua_chave        # opcional
PORT=3000
```

### 3. Configure o banco de dados

No **SQL Editor** do Supabase, execute:

```sql
create table participantes (
  id bigint primary key, nome text, ra text, curso text,
  semestre text, email text, status text default 'pendente'
);

create table palestrantes (
  id bigint primary key, nome text, telefone text, email text,
  tema text, briefing text, duracao text, status text default 'pendente'
);

create table coffee_break (
  id bigint primary key, nome text, email text, status text default 'pendente'
);

create table projetos (
  id bigint primary key, nome text, equipe text, email text,
  descricao text, status text default 'pendente'
);

create table event_speakers (
  id bigint primary key, nome text, cargo text, empresa text,
  bio text, tema text, linkedin text, foto text
);

create table event_schedule (
  id bigint primary key, titulo text, data date, horario time,
  palestrante text, local text, duracao text, descricao text
);

create table event_config (
  id integer primary key,
  data_inicio date,
  data_fim date
);

insert into event_config (id, data_inicio, data_fim)
values (1, '2026-06-01', '2026-06-03');
```

### 4. Inicie o servidor

```bash
cd backend
npm start
```

O servidor sobe em `http://localhost:3000`.

### 5. Abra o site

Abra `index.html` no navegador ou use uma extensão como **Live Server** no VS Code.

---

## Acesso Administrativo

| Campo | Valor |
|---|---|
| URL | `login.html` → clique em **Entrar** |
| Email | `cristiane.mashuda@unicesumar.edu.br` |
| Senha | *(fornecida internamente)* |

---

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/inscricoes` | Retorna todas as inscrições |
| `POST` | `/inscricao` | Cria nova inscrição |
| `PATCH` | `/inscricao/:tipo/:id` | Atualiza status de uma inscrição |
| `DELETE` | `/inscricao/:tipo/:id` | Remove uma inscrição |
| `GET` | `/event-speakers` | Lista palestrantes do evento |
| `POST` | `/event-speakers` | Adiciona palestrante (com foto) |
| `PATCH` | `/event-speakers/:id` | Edita palestrante |
| `DELETE` | `/event-speakers/:id` | Remove palestrante |
| `GET` | `/event-schedule` | Lista programação |
| `POST` | `/event-schedule` | Adiciona item à programação |
| `PATCH` | `/event-schedule/:id` | Edita item da programação |
| `DELETE` | `/event-schedule/:id` | Remove item da programação |
| `GET` | `/event-config` | Retorna datas do evento |
| `PATCH` | `/event-config` | Atualiza datas do evento |
| `POST` | `/send-email` | Envia email de resultado ao inscrito |

---

## TechBot — Chatbot de Atendimento

O TechBot é um assistente virtual flutuante disponível na landing page. Ele:

- Pergunta o **nome do usuário** ao iniciar a conversa
- Responde perguntas frequentes sobre o evento por **palavras-chave**
- Oferece **chips** de perguntas rápidas para facilitar a interação
- Exibe **animação de digitação** antes de responder
- Suporta tema claro e escuro

Para adicionar ou editar perguntas, edite o array `FAQ` em `js/chatbot.js`.

---

## Desenvolvido por

Projeto desenvolvido por alunos do curso de **Engenharia de Software** da **Unicesumar Londrina** como projeto acadêmico para o **II Tech Week 2026**.

---

<div align="center">
  <sub>Unicesumar Londrina · 2026</sub>
</div>
