document.addEventListener("DOMContentLoaded", () => {

    // SLIDER (só funciona se existir)
    const range = document.getElementById("tempoRange");
    const valor = document.getElementById("tempoValor");

    if (range && valor) {
        const atualizar = () => {
            valor.textContent = `${range.value} minutos`;
        };
        atualizar();
        range.addEventListener("input", atualizar);
    }

    // ===== RA (somente números + formato 12345678-9) =====
    const campoRA = document.querySelector(".campo-ra");

    if (campoRA) {

        campoRA.addEventListener("input", () => {
            let valor = campoRA.value.replace(/\D/g, "");

            if (valor.length > 9) valor = valor.slice(0, 9);

            if (valor.length > 8) {
                valor = valor.slice(0, 8) + "-" + valor.slice(8);
            }

            campoRA.value = valor;
        });

        campoRA.addEventListener("keypress", (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    // ===== TELEFONE (formato (43) 99999-9999) =====
    const campoTel = document.querySelector(".campo-telefone");

    if (campoTel) {

        campoTel.addEventListener("input", () => {
            let cursor = campoTel.selectionStart;
            let valor = campoTel.value.replace(/\D/g, "");

            if (valor.length === 0) {
                campoTel.value = "";
                return;
            }

            if (valor.length > 11) valor = valor.slice(0, 11);

            let formatado = "";

            if (valor.length >= 1) {
                formatado += "(" + valor.substring(0, 2);
            }

            if (valor.length >= 3) {
                formatado += ") " + valor.substring(2, 7);
            }

            if (valor.length >= 8) {
                formatado = "(" + valor.substring(0, 2) + ") " + valor.substring(2, 7) + "-" + valor.substring(7);
            }

            campoTel.value = formatado;
        });
    }

    // ===== MOSTRAR/ESCONDER CAMPOS DO PROJETO =====
    const checkProjeto = document.getElementById("checkProjeto");
    const camposProjeto = document.getElementById("camposProjeto");
    // ===== REMOVE VERMELHO AO DIGITAR (ADICIONAR) =====
const camposObrigatorios = document.querySelectorAll(".campo-obrigatorio");

camposObrigatorios.forEach(campo => {
    campo.addEventListener("input", () => {
        if (campo.value.trim() !== "") {
            campo.style.border = "";
        }
    });
});

    if (checkProjeto && camposProjeto) {
        checkProjeto.addEventListener("change", () => {
            camposProjeto.style.display = checkProjeto.checked ? "block" : "none";
        });
    }

    // ===== VALIDAÇÃO EM TEMPO REAL DO EMAIL (ADICIONADO) =====
    const campoEmailLive = document.querySelector(".campo-email");

    if (campoEmailLive) {

        campoEmailLive.addEventListener("input", () => {
            const email = campoEmailLive.value.toLowerCase();

            let msg = document.querySelector(".email-msg");

            if (!msg) {
                msg = document.createElement("div");
                msg.className = "email-msg";
                campoEmailLive.parentNode.appendChild(msg);
            }

            if (
                email.includes("@") &&
                (email.endsWith("@gmail.com") || email.endsWith("@hotmail.com"))
            ) {
                msg.textContent = "✔ Email válido";
                msg.style.color = "green";
            } else {
                msg.textContent = "❗ Use @gmail.com ou @hotmail.com";
                msg.style.color = "red";
            }
        });

    }

    // debug
    console.log("JS carregado nesta página:", window.location.pathname);

   // ===== MENU MOBILE =====
// ===== MENU MOBILE (CORRIGIDO) =====
const btnMenu = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const fechar = document.getElementById("fechar-menu");

if (btnMenu && menu) {

    btnMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.add("active");
    });

    if (fechar) {
        fechar.addEventListener("click", () => {
            menu.classList.remove("active");
        });
    }

    // fecha só quando clicar fora do MENU
    document.addEventListener("click", (e) => {
        const clicouFora = !menu.contains(e.target);
        const clicouBotao = e.target === btnMenu;

        if (clicouFora && !clicouBotao) {
            menu.classList.remove("active");
        }
    });

    // evita clique dentro do menu fechar ele
    menu.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

});

// ================= FUNÇÕES =================

function mostrarFormulario() {
    const form = document.getElementById("inscricao");
    if (!form) return;

    form.style.display = (form.style.display === "block") ? "none" : "block";
}

function mostrarPalestrante() {
    const palestrante = document.getElementById("palestrante");
    const inscricao = document.getElementById("inscricao");

    if (inscricao) inscricao.style.display = "none";
    if (!palestrante) return;

    palestrante.style.display = (palestrante.style.display === "block") ? "none" : "block";

    if (palestrante.style.display === "block") {
        palestrante.scrollIntoView({ behavior: "smooth" });
    }
}

function toggleTema() {
    const body = document.body;
    const btn = document.querySelector("button[aria-label='Alternar tema claro/escuro']");
    
    if (!btn) return;
    
    body.classList.toggle("dark");
    
    const isDark = body.classList.contains("dark");
    
    btn.innerHTML = isDark 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>`;
}

function finalizar() {
    const campos = document.querySelectorAll(".campo-obrigatorio");
    let vazio = false;

    campos.forEach(campo => {
        if (campo.value.trim() === "") {
            vazio = true;
            campo.style.border = "1px solid red";
        } else {
            campo.style.border = "";
        }
    });

    const campoRA = document.querySelector(".campo-ra");

    // ===== VALIDAÇÃO DO EMAIL =====
    const campoEmail = document.querySelector("input[type='email']");

    if (campoEmail) {
        const email = campoEmail.value.trim().toLowerCase();

        if (
            !email.includes("@") ||
            !(email.endsWith("@gmail.com") || email.endsWith("@hotmail.com"))
        ) {
            campoEmail.style.border = "1px solid red";
            vazio = true;

            let msgErro = document.querySelector(".erro-msg");

            if (!msgErro) {
                msgErro = document.createElement("div");
                msgErro.className = "erro-msg";
                msgErro.textContent = "❗ Email inválido";

                const form = document.querySelector(".form-container");
                if (form) form.prepend(msgErro);
            }
        }
    }

    if (campoRA) {
        const numeros = campoRA.value.replace(/\D/g, "");

        if (numeros.length !== 9) {
            campoRA.style.border = "1px solid red";
            vazio = true;
        }
    }

    if (vazio) {
        let msgErro = document.querySelector(".erro-msg");

        if (!msgErro) {
            msgErro = document.createElement("div");
            msgErro.className = "erro-msg";
            msgErro.textContent = "❗ Preenchimento obrigatório";

            const form = document.querySelector(".form-container");
            if (form) form.prepend(msgErro);
        }

        return;
    }

    const msg = document.createElement("div");
    msg.textContent = "✅ inscrição realizada com sucesso!";

    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.background = "#22c55e";
    msg.style.color = "white";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "10px";
    msg.style.zIndex = "9999";

    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
        window.location.href = "sucesso.html";
    }, 2000);
}

function voltarPagina() {
    window.history.back();
}
