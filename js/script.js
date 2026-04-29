document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
document.querySelectorAll(".faq-perguntas").forEach((btn) => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(btn.getAttribute("aria-controls"));

    btn.setAttribute("aria-expanded", !expanded);
    answer.hidden = expanded;
  });
});
function mostrarFormulario() {
    const form = document.getElementById("inscricao");

    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}
function mostrarPalestrante() {
    const palestrante = document.getElementById("palestrante");
    const inscricao = document.getElementById("inscricao");

    inscricao.style.display = "none";

    if (palestrante.style.display === "none") {
        palestrante.style.display = "block";
        palestrante.scrollIntoView({ behavior: "smooth" });
    } else {
        palestrante.style.display = "none";
    }
}
function toggleTema() {
    const body = document.body;
    body.classList.toggle("dark");

    const btn = document.querySelector("button[onclick='toggleTema()']");
    btn.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
}
