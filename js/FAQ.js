document.querySelectorAll(".faq-perguntas").forEach((btn) => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(btn.getAttribute("aria-controls"));

    btn.setAttribute("aria-expanded", !expanded);
    answer.hidden = expanded;
  });
});
