/* ============================================================
   Portfolio interactions
   ============================================================ */

/* ------------------------------------------------------------------
   PROJECTS  —  EDIT HERE to manage your portfolio.
   Each project shows only its name on the main page; clicking
   "View details" opens a popup with the full description + images.

   To add images for a project:
     1. Put image files in:  assets/projects/<anything>/
     2. List their paths in the `images: [...]` array below.
   Leave `images: []` for now — the popup shows a clean placeholder.
   ------------------------------------------------------------------ */
var PROJECTS = [
  {
    title: "claude-mouse-mcp",
    icon: "🖱️",
    tagline: "Agentic desktop automation",
    tags: ["Python", "MCP", "Agentic AI"],
    repo: "https://github.com/Namdevv/claude-mouse-mcp",
    demo: "",
    description:
      "An MCP server that lets Claude see the screen and control the mouse & keyboard on Windows.\n" +
      "It turns a language model into a hands-on desktop agent — useful for automation, testing, and accessibility.",
    images: [] // e.g. ["assets/projects/claude-mouse/demo.png"]
  },
  {
    title: "finos_hotel",
    icon: "🏨",
    tagline: "Handwritten ledgers → web system",
    tags: ["OCR", "LLM", "Web"],
    repo: "https://github.com/Namdevv/finos_hotel",
    demo: "",
    description:
      "Digitizes handwritten hotel ledgers into a clean, searchable web-based management system.\n" +
      "Combines OCR with an LLM to extract, structure, and validate data that used to live only on paper.",
    images: []
  },
  {
    title: "Hazard Detection",
    icon: "⚠️",
    tagline: "Real-time industrial safety CV",
    tags: ["YOLO", "OpenCV", "Real-time"],
    repo: "https://github.com/Namdevv",
    demo: "",
    description:
      "A real-time computer-vision system that spots dangerous items for safety monitoring at a maritime port.\n" +
      "Built and shipped end to end as AI team lead — from on-site data pipeline design to deployment and incident handling.",
    images: []
  },
  {
    title: "Traffic Sign Recognition",
    icon: "🚦",
    tagline: "LoRA fine-tuning · 2nd Prize 🏆",
    tags: ["LoRA", "Deep Learning", "Award"],
    repo: "https://github.com/Namdevv",
    demo: "",
    description:
      "Traffic-sign recognition fine-tuned with LoRA on large real-world datasets.\n" +
      "Won 2nd Prize at a university-level scientific research competition for its practicality and deployability.",
    images: []
  },
  {
    title: "FocusPals",
    icon: "🐾",
    tagline: "Pomodoro with an AI pet",
    tags: ["AI Agent", "App"],
    repo: "https://github.com/Namdevv/FocusPals",
    demo: "",
    description:
      "A Pomodoro timer with an AI agent pet that keeps you company and gently nudges you to stay on task.",
    images: []
  },
  {
    title: "Web Deploy Series",
    icon: "🚀",
    tagline: "VPS · Nginx · HTTPS guide",
    tags: ["Nginx", "DevOps", "VPS"],
    repo: "https://github.com/Namdevv/Web-deploy-series",
    demo: "",
    description:
      "A practical, hands-on guide to deploying web apps on a VPS — Nginx reverse proxy, HTTPS, and going from zero to production.",
    images: []
  }
];

(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---- Year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Render project cards (compact: name only) ---- */
  var grid = document.getElementById("projects-grid");
  if (grid) {
    grid.innerHTML = PROJECTS.map(function (p, i) {
      return (
        '<button class="project reveal" data-i="' + i + '" type="button">' +
          '<div class="project__top">' +
            '<span class="project__icon">' + p.icon + "</span>" +
            '<span class="project__more">View details <span aria-hidden="true">→</span></span>' +
          "</div>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<p class="project__tagline">' + esc(p.tagline) + "</p>" +
        "</button>"
      );
    }).join("");
  }

  /* ---- Modal ---- */
  var modal = document.getElementById("modal");
  var modalInner = document.getElementById("modal-inner");
  var lastFocused = null;

  function openModal(i) {
    var p = PROJECTS[i];
    if (!p) return;

    var tags = (p.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    var paras = String(p.description).split("\n").map(function (line) {
      return line.trim() ? "<p>" + esc(line) + "</p>" : "";
    }).join("");

    var gallery;
    if (p.images && p.images.length) {
      gallery = '<div class="modal__gallery">' + p.images.map(function (src) {
        return '<a class="modal__shot" href="' + esc(src) + '" target="_blank" rel="noopener">' +
               '<img src="' + esc(src) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy" ' +
               "onerror=\"this.closest('.modal__shot').style.display='none'\" /></a>";
      }).join("") + "</div>";
    } else {
      gallery = '<div class="modal__empty">🖼️ More visuals coming soon.</div>';
    }

    var links = "";
    if (p.repo) links += '<a class="btn btn--primary btn--sm" href="' + esc(p.repo) + '" target="_blank" rel="noopener">View code <span aria-hidden="true">↗</span></a>';
    if (p.demo) links += '<a class="btn btn--ghost btn--sm" href="' + esc(p.demo) + '" target="_blank" rel="noopener">Live demo <span aria-hidden="true">↗</span></a>';

    modalInner.innerHTML =
      '<div class="modal__head">' +
        '<span class="modal__icon">' + p.icon + "</span>" +
        "<div><h2 id=\"modal-title\">" + esc(p.title) + "</h2>" +
        '<div class="tags tags--sm">' + tags + "</div></div>" +
      "</div>" +
      '<div class="modal__desc">' + paras + "</div>" +
      gallery +
      (links ? '<div class="modal__links">' + links + "</div>" : "");

    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = document.getElementById("modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (grid) {
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".project");
      if (card) openModal(parseInt(card.getAttribute("data-i"), 10));
    });
  }
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---- Nav: shrink on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Typing effect ---- */
  var typedEl = document.getElementById("typed");
  if (typedEl) {
    var words = ["LLM systems.", "RAG pipelines.", "agentic AI.", "data into decisions.", "AI for real life."];
    var w = 0, c = 0, deleting = false;
    function tick() {
      var word = words[w];
      typedEl.textContent = word.slice(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(tick, 75); }
      else if (!deleting && c === word.length) { deleting = true; setTimeout(tick, 1600); }
      else if (deleting && c > 0) { c--; setTimeout(tick, 38); }
      else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 320); }
    }
    tick();
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.06 + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Stat counters ---- */
  var counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    document.querySelectorAll(".stat__num").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var heroStats = document.querySelector(".hero__stats");
  if (heroStats && "IntersectionObserver" in window) {
    var ho = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); ho.disconnect(); } });
    }, { threshold: 0.4 });
    ho.observe(heroStats);
  } else {
    runCounters();
  }

  /* ---- Project card spotlight ---- */
  document.querySelectorAll(".project").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
})();
