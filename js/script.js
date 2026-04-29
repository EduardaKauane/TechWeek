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