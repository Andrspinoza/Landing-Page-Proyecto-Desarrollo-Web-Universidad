/* ═══════════════════════════════════════════════════════════
   ¿Qué sale? — Landing page
   Interacciones mínimas: menú móvil, sombra del nav y aparición al hacer scroll.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Menú móvil ───────────────────────────────────────── */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var abierto = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(abierto));
      toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    // Al elegir una sección, cerrar el menú
    menu.addEventListener("click", function (evento) {
      if (evento.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      }
    });
  }

  /* ── Borde del nav al bajar ───────────────────────────── */
  var nav = document.getElementById("nav");

  if (nav) {
    var actualizarNav = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    actualizarNav();
    window.addEventListener("scroll", actualizarNav, { passive: true });
  }

  /* ── Aparición progresiva de las secciones ────────────── */
  var candidatos = document.querySelectorAll(
    ".tile, .purpose, .value, .step, .plan, .team li"
  );

  if (!("IntersectionObserver" in window)) {
    return; // Sin soporte: el contenido queda visible, que es el estado por defecto
  }

  var observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  candidatos.forEach(function (elemento, indice) {
    elemento.classList.add("reveal");
    elemento.style.transitionDelay = (indice % 4) * 60 + "ms";
    observador.observe(elemento);
  });
})();
