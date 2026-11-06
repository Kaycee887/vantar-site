/* ============================================================
   Vantar — interactions
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header state on scroll ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  const closeMenu = () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  /* ---------- Scroll reveals (with stagger per group) ---------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  // Stagger children of groups that share a parent
  const groups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, 0);
    const i = groups.get(parent);
    el.style.setProperty("--d", Math.min(i * 70, 420) + "ms");
    groups.set(parent, i + 1);
  });

  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !prefersReduced) {
    // Start at zero only once JS is ready, so the real values remain
    // visible if scripts fail to load.
    counters.forEach((el) => {
      el.textContent = "0" + (el.dataset.suffix || "");
    });
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent = (el.dataset.count || 0) + (el.dataset.suffix || "");
    });
  }

  /* ---------- Active nav link (in-page sections) ---------- */
  const navLinks = Array.from(nav.querySelectorAll('a[href*="#"]:not(.nav-cta)')).filter(
    (link) => (link.getAttribute("href") || "").includes("#")
  );
  const sections = navLinks
    .map((link) => {
      const hash = link.getAttribute("href").split("#")[1];
      return hash ? document.getElementById(hash) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href").endsWith("#" + entry.target.id))
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => so.observe(s));
  }

  /* ---------- Card spotlight follow ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - rect.left + "px");
        card.style.setProperty("--my", e.clientY - rect.top + "px");
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  const validators = {
    name: (v) => (v.trim().length < 2 ? "Please tell us your name." : ""),
    email: (v) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Please enter a valid email address." : "",
    message: (v) => (v.trim().length < 12 ? "A sentence or two about the project helps." : ""),
  };

  const setError = (field, message) => {
    field.classList.toggle("invalid", Boolean(message));
    const errorEl = field.querySelector("[data-error-for]");
    if (errorEl) errorEl.textContent = message;
  };

  const validateField = (input) => {
    const field = input.closest(".field");
    const validate = validators[input.name];
    if (!validate) return true;
    const message = validate(input.value);
    setError(field, message);
    return !message;
  };

  if (form) {
    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        if (field.classList.contains("invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
      const allValid = fields.map(validateField).every(Boolean);

      if (!allValid) {
        const firstInvalid = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Sending…";

      // Simulated submission — wire this to your endpoint.
      setTimeout(() => {
        success.hidden = false;
        form.reset();
        btn.disabled = false;
        btn.innerHTML = 'Send enquiry <span class="arrow">→</span>';
        success.scrollIntoView({ block: "nearest", behavior: prefersReduced ? "auto" : "smooth" });
      }, 750);
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
