/* ============================================================
   Portfolio interactions
   ============================================================ */

/* ------------------------------------------------------------------
   EXPERIENCE  —  EDIT HERE to manage your work history.
   Each entry shows only role + company + date on the page; clicking
   "View details" opens a popup with the full description + images.

   To add images / proof (certificates, screenshots) for a role:
     1. Put image files in:  assets/experience/<anything>/
     2. List their paths in the `images: [...]` array below.
   Leave `images: []` for now — the popup shows a clean placeholder.
   ------------------------------------------------------------------ */
var EXPERIENCE = [
  {
    role: "AI Architect",
    org: "DFM Engineering",
    date: "Jan 2026 — Present",
    product: "Agentic AI for 3D CAD Automation",
    tags: ["Agentic AI", "Architecture", "Business Analysis"],
    points: [
      "Gathered business requirements across departments and designed a comprehensive integration architecture unifying multi-platform data flows into a single admin console.",
      "Modeled end-to-end workflows and decomposed technical scope into concrete software requirements — cutting operational time by 40%.",
      "Partnered with PM and domain engineers on test scenarios, UAT, and hands-on technical support through delivery."
    ],
    images: [] // e.g. ["assets/experience/dfm/console.png"]
  },
  {
    role: "Project Manager / AI",
    org: "FPT University",
    date: "Sep 2025 — Dec 2025",
    product: "Agent Programmatic Integration Testing",
    tags: ["Project Management", "Tool-calling", "API"],
    points: [
      "Owned delivery progress and output quality; the single point of contact translating system requirements and status to stakeholders (PM, Dev, QC).",
      "Designed the tool-calling architecture and API integration flow, automating data aggregation and reducing manual-operation errors by 90%."
    ],
    images: []
  },
  {
    role: "AI Team Lead",
    org: "CEH — Vietnam Maritime Port Solutions",
    date: "Jan 2025 — Apr 2025",
    product: "Hazard Detection System",
    tags: ["Computer Vision", "Real-time", "Team Lead"],
    points: [
      "Designed a real-time image/video data-collection pipeline for safety monitoring in complex industrial environments.",
      "Surveyed the site, clarified real-world requirements, configured and trialed the system, and validated input/output accuracy before handover.",
      "Handled technical incidents to keep data collection running reliably under all conditions."
    ],
    images: []
  },
  {
    role: "AI Engineer",
    org: "University of Transport HCMC",
    date: "Apr 2024 — Apr 2025",
    product: "Traffic Sign Recognition with LoRA",
    tags: ["LoRA", "Deep Learning", "Award 🏆"],
    points: [
      "Collected, cleaned, and analyzed large datasets to optimize real-world recognition.",
      "Applied optimization techniques to push model accuracy well above baseline.",
      "🏆 2nd Prize, university-level Scientific Research competition."
    ],
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

  /* ---- Render experience timeline (compact: role + company only) ---- */
  var list = document.getElementById("experience-list");
  if (list) {
    list.innerHTML = EXPERIENCE.map(function (x, i) {
      return (
        '<article class="tl reveal">' +
          '<div class="tl__dot"></div>' +
          '<button class="tl__body tl__body--btn" data-i="' + i + '" type="button">' +
            '<div class="tl__head">' +
              "<h3>" + esc(x.role) + "</h3>" +
              '<span class="tl__date">' + esc(x.date) + "</span>" +
            "</div>" +
            '<p class="tl__org">' + esc(x.org) +
              (x.product ? " · <em>" + esc(x.product) + "</em>" : "") + "</p>" +
            '<span class="tl__more">View details <span aria-hidden="true">→</span></span>' +
          "</button>" +
        "</article>"
      );
    }).join("");
  }

  /* ---- Modal ---- */
  var modal = document.getElementById("modal");
  var modalInner = document.getElementById("modal-inner");
  var lastFocused = null;

  function openModal(i) {
    var x = EXPERIENCE[i];
    if (!x) return;

    var tags = (x.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    var points = (x.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");

    var gallery;
    if (x.images && x.images.length) {
      gallery = '<div class="modal__gallery">' + x.images.map(function (src) {
        return '<a class="modal__shot" href="' + esc(src) + '" target="_blank" rel="noopener">' +
               '<img src="' + esc(src) + '" alt="' + esc(x.role) + ' at ' + esc(x.org) + '" loading="lazy" ' +
               "onerror=\"this.closest('.modal__shot').style.display='none'\" /></a>";
      }).join("") + "</div>";
    } else {
      gallery = '<div class="modal__empty">🖼️ More visuals coming soon.</div>';
    }

    modalInner.innerHTML =
      '<div class="modal__head">' +
        "<div><h2 id=\"modal-title\">" + esc(x.role) + "</h2>" +
        '<p class="modal__org">' + esc(x.org) + ' · <span>' + esc(x.date) + "</span></p>" +
        (x.product ? '<p class="modal__product">' + esc(x.product) + "</p>" : "") +
        '<div class="tags tags--sm">' + tags + "</div></div>" +
      "</div>" +
      '<ul class="modal__points">' + points + "</ul>" +
      gallery;

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

  if (list) {
    list.addEventListener("click", function (e) {
      var card = e.target.closest(".tl__body--btn");
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
