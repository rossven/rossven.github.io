(function () {
  "use strict";

  var dict = window.I18N;
  var EMAIL = "atakandivan@gmail.com";
  var STORAGE_KEY = "lang";
  var currentLang = "tr";

  /* ---------- Language ---------- */
  function pickInitialLang() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl && dict[fromUrl]) return fromUrl;
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && dict[saved]) return saved;
    } catch (e) {}
    var nav = (navigator.language || "tr").toLowerCase();
    return nav.indexOf("tr") === 0 ? "tr" : "en";
  }

  function t(key) {
    var v = dict[currentLang][key];
    return v === undefined ? dict.en[key] : v;
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-ph"));
      if (v !== undefined) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-tip-key]").forEach(function (el) {
      var v = t(el.getAttribute("data-tip-key"));
      el.setAttribute("data-tip", v);
      el.setAttribute("aria-label", v);
    });

    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  applyLang(pickInitialLang());

  /* ---------- Year ---------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll(".year").forEach(function (el) { el.textContent = year; });

  /* ---------- Overlay menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var overlay = document.querySelector(".overlay-menu");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  overlay.addEventListener("click", function (e) {
    if (e.target.closest("a") || e.target === overlay) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Active section highlighting ---------- */
  var navLinks = document.querySelectorAll(".side-nav a, .overlay-menu li a");
  var sections = document.querySelectorAll("main .section");

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window) {
    var secObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { secObserver.observe(s); });

    /* ---------- Reveal on scroll ---------- */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

    /* ---------- Count-up stats ---------- */
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (reduce) { el.textContent = target; return; }
        var start = null;
        var dur = 1400;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        el.textContent = "0";
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { countObserver.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Contact form (mailto) ---------- */
  var form = document.getElementById("contactForm");
  var errorEl = form.querySelector(".form-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var name = f.namedItem("name").value.trim();
    var email = f.namedItem("email").value.trim();
    var subject = f.namedItem("subject").value.trim();
    var message = f.namedItem("message").value.trim();

    var ok = true;
    [["name", name], ["email", email], ["subject", subject]].forEach(function (pair) {
      var field = f.namedItem(pair[0]).closest(".field");
      var valid = pair[1].length > 0 && (pair[0] !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pair[1]));
      field.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });

    if (!ok) { errorEl.textContent = t("contact.error"); return; }
    errorEl.textContent = "";

    var body = message + "\n\n— " + name + " (" + email + ")";
    location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
})();
