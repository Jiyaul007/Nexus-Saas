/**
 * NexusAI — script.js
 * Futuristic SaaS Frontend · Production Grade
 * All vanilla JS — zero dependencies
 */

"use strict";

/* ============================================================
   0. UTILS
   ============================================================ */

/** Run fn when DOM ready */
const onReady = (fn) =>
  document.readyState !== "loading"
    ? fn()
    : document.addEventListener("DOMContentLoaded", fn);

/** Debounce helper */
const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

/** clamp(val, min, max) */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** lerp */
const lerp = (a, b, t) => a + (b - a) * t;

/* ============================================================
   1. LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  // Hide after 2.2s (bar animation = 2s + buffer)
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
      // Trigger hero reveal
      document
        .querySelectorAll("#hero .reveal")
        .forEach((el) => el.classList.add("visible"));
    }, 400);
  });

  // Prevent scroll while loading
  document.body.style.overflow = "hidden";
}

/* ============================================================
   2. LUCIDE ICONS
   ============================================================ */
function initIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ============================================================
   3. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  // Skip on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Dot follows cursor exactly (no lag)
  document.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  });

  // Ring lerps behind (smooth follow)
  function animateRing() {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    "a, button, [data-tilt], .faq-q, input, select, textarea, .slider-dot",
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

  document.addEventListener("mousedown", () =>
    document.body.classList.add("cursor-click"),
  );
  document.addEventListener("mouseup", () =>
    document.body.classList.remove("cursor-click"),
  );
}

/* ============================================================
   4. MOUSE GLOW
   ============================================================ */
function initMouseGlow() {
  const glow = document.getElementById("mouse-glow");
  if (!glow) return;
  if (window.matchMedia("(pointer: coarse)").matches) {
    glow.style.display = "none";
    return;
  }

  let gx = window.innerWidth / 2,
    gy = window.innerHeight / 2;
  let cx = gx,
    cy = gy;

  document.addEventListener("mousemove", (e) => {
    gx = e.clientX;
    gy = e.clientY;
  });

  function animateGlow() {
    cx = lerp(cx, gx, 0.07);
    cy = lerp(cy, gy, 0.07);
    glow.style.left = cx + "px";
    glow.style.top = cy + "px";
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ============================================================
   5. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  function update() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
    bar.style.width = clamp(pct, 0, 100) + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ============================================================
   6. NAVBAR
   ============================================================ */
function initNavbar() {
  const nav = document.getElementById("navbar");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!nav) return;

  // Scrolled state
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
    const btt = document.getElementById("back-to-top");
    if (btt) btt.classList.toggle("visible", window.scrollY > 400);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const link = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`,
          );
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // Mobile menu toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("active");
      mobileBtn.classList.toggle("open", open);
      mobileBtn.setAttribute("aria-expanded", open);
    });

    // Close on link click
    mobileMenu.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileBtn.classList.remove("open");
        mobileBtn.setAttribute("aria-expanded", false);
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) {
        mobileMenu.classList.remove("active");
        mobileBtn.classList.remove("open");
        mobileBtn.setAttribute("aria-expanded", false);
      }
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ============================================================
   7. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

/* ============================================================
   8. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal, .reveal-stagger");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================================
   9. ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");
  if (!counters.length) return;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const fmt = el.dataset.format;
    const dur = 2000;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / dur, 1);
      const eased = easeOut(progress);
      let val = target * eased;

      // Format billions
      if (fmt === "B" && val >= 1e9) {
        el.textContent = (val / 1e9).toFixed(1) + "B" + suffix;
      } else {
        el.textContent =
          Math.floor(val).toLocaleString() + (progress === 1 ? suffix : "");
      }

      if (progress < 1) requestAnimationFrame(step);
      else {
        // Final value
        if (fmt === "B" && target >= 1e9) {
          el.textContent = (target / 1e9).toFixed(1) + "B" + suffix;
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

/* ============================================================
   10. TYPING EFFECT (HERO)
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const words = ["light speed.", "scale.", "confidence.", "the future."];
  let wordIdx = 0,
    charIdx = 0,
    deleting = false;
  const DELAY_TYPE = 80,
    DELAY_DELETE = 40,
    DELAY_PAUSE = 2200,
    DELAY_NEXT = 500;

  function type() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, DELAY_PAUSE);
        return;
      }
    } else {
      el.textContent = word.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, DELAY_NEXT);
        return;
      }
    }
    setTimeout(type, deleting ? DELAY_DELETE : DELAY_TYPE);
  }

  // Start after loader
  setTimeout(type, 2600);
}

/* ============================================================
   11. PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [],
    mouse = { x: -9999, y: -9999 };

  const PARTICLE_COUNT = Math.min(window.innerWidth < 768 ? 40 : 90, 90);
  const ACCENT = "#00f5d4";
  const PURPLE = "#a855f7";

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomColor() {
    return Math.random() > 0.5 ? ACCENT : PURPLE;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 0.5;
    this.color = randomColor();
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 400 + 200;
  };
  Particle.prototype.update = function () {
    this.life++;
    // Mouse repulsion
    const dx = this.x - mouse.x,
      dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = ((120 - dist) / 120) * 0.6;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }
    // Damping
    this.vx *= 0.98;
    this.vy *= 0.98;
    // Max speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.2) {
      this.vx = (this.vx / speed) * 1.2;
      this.vy = (this.vy / speed) * 1.2;
    }
    this.x += this.vx;
    this.y += this.vy;
    // Wrap
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
    // Fade in/out
    const lifeRatio = this.life / this.maxLife;
    if (lifeRatio > 0.9) this.alpha *= 0.97;
    if (this.life >= this.maxLife) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawConnections() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  let animFrame;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animate);
  }
  animate();

  // Mouse interaction
  const heroEl = document.getElementById("hero");
  heroEl.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroEl.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      resize();
    }, 200),
  );

  // Pause when hero not visible (perf)
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animate();
      } else {
        cancelAnimationFrame(animFrame);
      }
    });
  });
  heroObserver.observe(heroEl);
}

/* ============================================================
   12. 3D TILT CARDS
   ============================================================ */
function initTiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");
  if (!cards.length) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const STRENGTH = 8; // degrees

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * STRENGTH;
      const rotY = dx * STRENGTH;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .5s cubic-bezier(.25,.8,.25,1)";
      card.style.transform =
        "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
      setTimeout(() => (card.style.transition = ""), 500);
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform .1s ease";
    });
  });
}

/* ============================================================
   13. TESTIMONIALS SLIDER
   ============================================================ */
function initSlider() {
  const track = document.getElementById("testimonial-track");
  const dotsEl = document.getElementById("slider-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  if (!track) return;

  const cards = track.querySelectorAll(".testimonial-card");
  const total = cards.length;
  let current = 0,
    autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0);
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function getVisible() {
    const w = window.innerWidth;
    return w < 768 ? 1 : w < 1024 ? 2 : 3;
  }

  function goTo(idx) {
    const visible = getVisible();
    const max = total - visible;
    current = clamp(idx, 0, max);
    const cardW = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardW}px)`;
    track.style.transition = "transform .5s cubic-bezier(.25,.8,.25,1)";

    dotsEl.querySelectorAll(".slider-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
      d.setAttribute("aria-selected", i === current);
    });
  }

  function next() {
    goTo(current + 1 >= total - getVisible() + 1 ? 0 : current + 1);
  }
  function prev() {
    const visible = getVisible();
    goTo(current <= 0 ? total - visible : current - 1);
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      clearInterval(autoTimer);
      prev();
      startAuto();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      clearInterval(autoTimer);
      next();
      startAuto();
    });

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }
  startAuto();

  // Touch / swipe
  let startX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      clearInterval(autoTimer);
      dx < 0 ? next() : prev();
      startAuto();
    }
  });

  window.addEventListener(
    "resize",
    debounce(() => goTo(current), 200),
  );

  // Pause on hover
  track.addEventListener("mouseenter", () => clearInterval(autoTimer));
  track.addEventListener("mouseleave", () => startAuto());
}

/* ============================================================
   14. FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const ans = item.querySelector(".faq-a");
    if (!btn || !ans) return;

    btn.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      if (open) {
        ans.removeAttribute("hidden");
        // Force reflow, then animate
        ans.style.maxHeight = "0";
        requestAnimationFrame(() => {
          ans.style.maxHeight = ans.scrollHeight + "px";
          ans.style.paddingBottom = "20px";
        });
      } else {
        ans.style.maxHeight = "0";
        ans.style.paddingBottom = "0";
        setTimeout(() => ans.setAttribute("hidden", ""), 400);
      }
      // Close others
      items.forEach((other) => {
        if (other === item) return;
        other.classList.remove("open");
        const ob = other.querySelector(".faq-q");
        const oa = other.querySelector(".faq-a");
        if (ob) ob.setAttribute("aria-expanded", false);
        if (oa) {
          oa.style.maxHeight = "0";
          oa.style.paddingBottom = "0";
          setTimeout(() => oa.setAttribute("hidden", ""), 400);
        }
      });
    });
  });
}

/* ============================================================
   15. PRICING TOGGLE (annual/monthly)
   ============================================================ */
function initPricing() {
  const toggle = document.getElementById("billing-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isAnnual = toggle.getAttribute("aria-pressed") === "false";
    toggle.setAttribute("aria-pressed", isAnnual);

    document.querySelectorAll(".price-val").forEach((el) => {
      const monthly = el.dataset.monthly;
      const annual = el.dataset.annual;
      if (monthly === undefined) return;
      const val = isAnnual ? annual : monthly;
      el.textContent =
        val === "0"
          ? "$0"
          : val === "" || val === undefined
            ? "Custom"
            : `$${val}`;

      // Flash animation
      el.style.transform = "scale(1.1)";
      el.style.color = "var(--accent)";
      setTimeout(() => {
        el.style.transform = "";
        el.style.color = "";
      }, 300);
    });
  });
}

/* ============================================================
   16. THEME SWITCHER
   ============================================================ */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const key = "nexus-theme";

  // Restore saved preference
  const saved = localStorage.getItem(key) || "dark";
  html.setAttribute("data-theme", saved);

  if (btn) {
    btn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem(key, next);
    });
  }

  // Respect OS preference if no saved value
  if (!localStorage.getItem(key)) {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    if (mq.matches) html.setAttribute("data-theme", "light");
    mq.addEventListener("change", (e) => {
      if (!localStorage.getItem(key))
        html.setAttribute("data-theme", e.matches ? "light" : "dark");
    });
  }
}

/* ============================================================
   17. CONTACT FORM VALIDATION
   ============================================================ */
function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const successMsg = document.getElementById("form-success");

  function validateField(field) {
    const errEl = field.parentElement.querySelector(".form-error");
    let msg = "";
    if (field.required && !field.value.trim()) {
      msg = "This field is required.";
    } else if (
      field.type === "email" &&
      field.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)
    ) {
      msg = "Please enter a valid email address.";
    } else if (field.tagName === "SELECT" && !field.value) {
      msg = "Please select an option.";
    } else if (field.tagName === "TEXTAREA" && field.value.trim().length < 10) {
      msg = "Message must be at least 10 characters.";
    }

    if (errEl) errEl.textContent = msg;
    field.classList.toggle("error", !!msg);
    return !msg;
  }

  // Real-time validation
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) validateField(field);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    form
      .querySelectorAll("input[required], select[required], textarea[required]")
      .forEach((field) => {
        if (!validateField(field)) valid = false;
      });
    if (!valid) return;

    // Simulate async submit
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");
    const btnIcon = submitBtn.querySelector(".btn-icon");

    submitBtn.disabled = true;
    btnText.hidden = true;
    btnIcon.hidden = true;
    btnLoading.hidden = false;

    await new Promise((r) => setTimeout(r, 1800));

    btnLoading.hidden = true;
    successMsg.hidden = false;
    form.reset();
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnIcon.hidden = false;

    // Re-init icons after DOM change
    if (window.lucide) lucide.createIcons();
  });
}

/* ============================================================
   18. PARALLAX (subtle section backgrounds)
   ============================================================ */
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const hero = document.getElementById("hero");
  if (!hero) return;

  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
    },
    { passive: true },
  );
}

/* ============================================================
   19. LAZY LOADING IMAGES (IntersectionObserver polyfill-safe)
   ============================================================ */
function initLazyLoad() {
  if ("loading" in HTMLImageElement.prototype) return; // native support
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach((img) => io.observe(img));
}

/* ============================================================
   20. ANIMATED GRADIENT BACKGROUND (hero subtle shift)
   ============================================================ */
function initGradientShift() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hero = document.getElementById("hero");
  if (!hero) return;

  let hue = 160;
  function shift() {
    hue = (hue + 0.05) % 360;
    // Subtle tint over time
    hero.style.setProperty("--hero-hue", hue);
    requestAnimationFrame(shift);
  }
  shift();
}

/* ============================================================
   21. FLOATING BENTO TERMINAL (typewriter effect)
   ============================================================ */
function initTerminal() {
  // The terminal lines are static HTML; animate them on visible
  const terminal = document.querySelector(".bento-terminal");
  if (!terminal) return;

  const lines = terminal.querySelectorAll("p");
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        lines.forEach((line, i) => {
          line.style.opacity = "0";
          setTimeout(
            () => {
              line.style.transition = "opacity .4s";
              line.style.opacity = "1";
            },
            i * 400 + 300,
          );
        });
        io.unobserve(terminal);
      }
    },
    { threshold: 0.5 },
  );
  io.observe(terminal);
}

/* ============================================================
   22. WORKFLOW NODE ANIMATION
   ============================================================ */
function initWorkflow() {
  const wf = document.querySelector(".workflow-visual");
  if (!wf) return;

  const nodes = wf.querySelectorAll(".wf-node");
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        nodes.forEach((n, i) => {
          n.style.opacity = "0";
          n.style.transform = "translateY(8px)";
          setTimeout(() => {
            n.style.transition = "opacity .4s, transform .4s";
            n.style.opacity = "1";
            n.style.transform = "translateY(0)";
          }, i * 200);
        });
        io.unobserve(wf);
      }
    },
    { threshold: 0.5 },
  );
  io.observe(wf);
}

/* ============================================================
   23. MINI CHART BARS ANIMATE
   ============================================================ */
function initChart() {
  const chart = document.querySelector(".mini-chart");
  if (!chart) return;
  // CSS animation handles it, but trigger on scroll
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        chart.querySelectorAll(".bar").forEach((b) => {
          const h = b.style.height;
          b.style.height = "0";
          setTimeout(() => {
            b.style.transition = "height .8s cubic-bezier(.25,.8,.25,1)";
            b.style.height = h;
          }, 100);
        });
        io.unobserve(chart);
      }
    },
    { threshold: 0.5 },
  );
  io.observe(chart);
}

/* ============================================================
   24. KEYBOARD NAVIGATION & A11Y ENHANCEMENTS
   ============================================================ */
function initA11y() {
  // Skip to content link
  const skip = document.createElement("a");
  skip.href = "#hero";
  skip.className = "sr-only";
  skip.textContent = "Skip to main content";
  skip.style.cssText = `
    position:fixed;top:8px;left:8px;z-index:999999;
    background:var(--accent);color:var(--bg);
    padding:8px 16px;border-radius:8px;font-weight:700;
    opacity:0;pointer-events:none;
  `;
  skip.addEventListener("focus", () => {
    skip.style.opacity = "1";
    skip.style.pointerEvents = "auto";
  });
  skip.addEventListener("blur", () => {
    skip.style.opacity = "0";
    skip.style.pointerEvents = "none";
  });
  document.body.prepend(skip);
}

/* ============================================================
   25. BENTO CARD HOVER GLOW TRAIL
   ============================================================ */
function initCardGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".bento-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      card.style.background = `radial-gradient(300px at ${x}px ${y}px, #00f5d408, transparent), var(--surface)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "";
    });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
onReady(() => {
  initLoader();
  initTheme();
  initIcons();
  initCursor();
  initMouseGlow();
  initScrollProgress();
  initNavbar();
  initBackToTop();
  initScrollReveal();
  initCounters();
  initTypingEffect();
  initParticles();
  initTiltCards();
  initSlider();
  initFAQ();
  initPricing();
  initForm();
  initParallax();
  initLazyLoad();
  initGradientShift();
  initTerminal();
  initWorkflow();
  initChart();
  initA11y();
  initCardGlow();

  // Re-run lucide after all dynamic content rendered
  setTimeout(() => {
    if (window.lucide) lucide.createIcons();
  }, 100);

  console.log(
    "%cNexusAI — Build the Future 🚀",
    "font-family:Syne,sans-serif;font-size:18px;font-weight:800;color:#00f5d4;background:#080c14;padding:8px 16px;border-radius:8px;",
  );
});
