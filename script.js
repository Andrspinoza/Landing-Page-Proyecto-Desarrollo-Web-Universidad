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

/* ═══════════════════════════════════════════════════════════
   Ruleta del perfil de ejemplo del hero
   Rota perfiles, afinidad y frase. Es decorativa: el bloque
   completo va con aria-hidden, así que no interrumpe a nadie
   que use lector de pantalla.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var tarjeta = document.querySelector("[data-perfil]");
  var nota = document.querySelector("[data-nota]");
  if (!tarjeta) return;

  var perfiles = [
    {
      foto: "assets/perfiles/camila.jpg",
      nombre: "Camila R.",
      meta: "Ing. de Sistemas · Ciclo 7 · Lima Centro",
      afinidad: 82,
      coinciden: "Base de datos · Ciclo 7 · Sede Lima Centro",
      chips: ["Base de datos", "Backend", "Vóley"]
    },
    {
      foto: "assets/perfiles/diego.jpg",
      nombre: "Diego M.",
      meta: "Ing. Industrial · Ciclo 5 · Ate",
      afinidad: 74,
      coinciden: "Fútbol · Turno noche · Sede Ate",
      chips: ["Fútbol", "Cine", "Excel"]
    },
    {
      foto: "assets/perfiles/valeria.jpg",
      nombre: "Valeria S.",
      meta: "Administración · Ciclo 6 · Lima Norte",
      afinidad: 91,
      coinciden: "Música en vivo · Café · Sede Lima Norte",
      chips: ["Música en vivo", "Café", "Fotografía"]
    },
    {
      foto: "assets/perfiles/renzo.jpg",
      nombre: "Renzo T.",
      meta: "Ing. de Software · Ciclo 8 · Lima Centro",
      afinidad: 68,
      coinciden: "Videojuegos · Ciclo 8 · Turno noche",
      chips: ["Videojuegos", "Frontend", "Básquet"]
    },
    {
      foto: "assets/perfiles/alessia.jpg",
      nombre: "Alessia P.",
      meta: "Psicología · Ciclo 4 · Lima Sur",
      afinidad: 86,
      coinciden: "Voluntariado · Café · Turno mañana",
      chips: ["Voluntariado", "Café", "Lectura"]
    }
  ];

  // Precargar para que el cambio de perfil no parpadee
  perfiles.forEach(function (perfil) {
    var previa = new Image();
    previa.src = perfil.foto;
  });

  var frases = [
    "¿Y si hoy sí se arma?",
    "¡Tú mismo eres!",
    "Ya pues, escríbele.",
    "Un café y vemos qué sale.",
    "Coincidieron. ¿Ahora qué?"
  ];

  var campos = {
    foto: tarjeta.querySelector("[data-foto]"),
    nombre: tarjeta.querySelector("[data-nombre]"),
    meta: tarjeta.querySelector("[data-meta]"),
    valor: tarjeta.querySelector("[data-valor]"),
    barra: tarjeta.querySelector("[data-barra]"),
    coinciden: tarjeta.querySelector("[data-coinciden]"),
    chips: tarjeta.querySelector("[data-chips]")
  };

  var contenedorPuntos = document.querySelector("[data-puntos]");
  var botonAnterior = document.querySelector("[data-anterior]");
  var botonSiguiente = document.querySelector("[data-siguiente]");

  var puntos = perfiles.map(function () {
    var punto = document.createElement("i");
    if (contenedorPuntos) contenedorPuntos.appendChild(punto);
    return punto;
  });

  var pintar = function (perfil, frase) {
    campos.foto.src = perfil.foto;
    campos.nombre.textContent = perfil.nombre;
    campos.meta.textContent = perfil.meta;
    campos.valor.textContent = perfil.afinidad + "%";
    campos.barra.style.width = perfil.afinidad + "%";
    campos.coinciden.textContent = "Coinciden: " + perfil.coinciden;
    campos.chips.innerHTML = "";
    perfil.chips.forEach(function (texto) {
      var chip = document.createElement("span");
      chip.textContent = texto;
      campos.chips.appendChild(chip);
    });
    if (nota) nota.textContent = frase;
  };

  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var indice = 0;
  var temporizador = null;

  var marcarPunto = function () {
    puntos.forEach(function (punto, i) {
      punto.classList.toggle("is-activo", i === indice);
    });
  };

  var mostrar = function (nuevoIndice) {
    indice = (nuevoIndice + perfiles.length) % perfiles.length;
    var perfil = perfiles[indice];
    var frase = frases[indice % frases.length];
    marcarPunto();

    if (sinMovimiento) {
      pintar(perfil, frase);
      return;
    }

    tarjeta.classList.add("is-cambiando");
    if (nota) nota.classList.add("is-cambiando");

    window.setTimeout(function () {
      pintar(perfil, frase);
      tarjeta.classList.remove("is-cambiando");
      if (nota) nota.classList.remove("is-cambiando");
    }, 280);
  };

  var arrancar = function () {
    if (temporizador) return;
    temporizador = window.setInterval(function () { mostrar(indice + 1); }, 4200);
  };
  var detener = function () {
    window.clearInterval(temporizador);
    temporizador = null;
  };

  // Al tomar el control manual, la rotación automática se detiene
  var manual = function (destino) {
    detener();
    mostrar(destino);
  };

  if (botonSiguiente) {
    botonSiguiente.addEventListener("click", function () { manual(indice + 1); });
  }
  if (botonAnterior) {
    botonAnterior.addEventListener("click", function () { manual(indice - 1); });
  }

  // La tarjeta también avanza al hacer clic
  tarjeta.addEventListener("click", function () { manual(indice + 1); });
  tarjeta.style.cursor = "pointer";

  // Pausar mientras el cursor está encima, reanudar al salir
  var arte = document.querySelector(".hero__art");
  if (arte) {
    arte.addEventListener("mouseenter", detener);
    arte.addEventListener("mouseleave", function () {
      if (!document.hidden) arrancar();
    });
  }

  // No gastar ciclos si la pestaña está oculta
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) detener();
    else arrancar();
  });

  marcarPunto();
  arrancar();
})();
