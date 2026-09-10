(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var setMenu = function (open) {
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", function () {
    setMenu(!menu.classList.contains("is-open"));
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var group = Array.prototype.slice.call(
            el.parentElement.querySelectorAll(":scope > .reveal")
          );
          var idx = group.indexOf(el);
          el.style.transitionDelay = (idx > 0 ? Math.min(idx * 80, 320) : 0) + "ms";
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var navLinks = document.querySelectorAll(".nav__link");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            var href = l.getAttribute("href");
            l.classList.toggle("is-active", href === "#" + id || (id === "top" && href === "#top"));
          });
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("section[id]").forEach(function (s) { spy.observe(s); });
  }

  var counters = document.querySelectorAll(".stat__num");
  if (counters.length && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          countIO.unobserve(el);
          if (reduceMotion) { el.textContent = target; return; }
          var start = null;
          var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 1400, 1);
            el.textContent = Math.round(p * target);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countIO.observe(el); });
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var openLightbox = function (src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  var closeLightbox = function () {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  var strip = document.getElementById("galleryStrip");
  if (strip) {
    var stripTrack = document.getElementById("stripTrack");
    var SPEED = 55;
    var baseItems = Array.prototype.slice.call(stripTrack.children);

    var setupStrip = function () {
      Array.prototype.slice.call(stripTrack.querySelectorAll(".is-clone")).forEach(function (c) { c.remove(); });

      var gap = parseFloat(getComputedStyle(stripTrack).columnGap || getComputedStyle(stripTrack).gap) || 18;
      var baseWidth = 0;
      baseItems.forEach(function (el) { baseWidth += el.getBoundingClientRect().width + gap; });
      if (!baseWidth) return;

      var need = Math.max(2, Math.ceil((strip.clientWidth / baseWidth)) + 2);
      for (var c = 1; c < need; c++) {
        baseItems.forEach(function (el) {
          var clone = el.cloneNode(true);
          clone.classList.add("is-clone");
          clone.setAttribute("aria-hidden", "true");
          stripTrack.appendChild(clone);
        });
      }

      stripTrack.style.setProperty("--strip-shift", baseWidth + "px");
      stripTrack.style.animationDuration = (baseWidth / SPEED) + "s";
      stripTrack.classList.add("is-running");
    };

    setupStrip();

    var stripResize;
    window.addEventListener("resize", function () {
      clearTimeout(stripResize);
      stripResize = setTimeout(setupStrip, 220);
    });

    stripTrack.addEventListener("click", function (e) {
      var card = e.target.closest ? e.target.closest(".gallery-strip__card") : null;
      if (!card || card.classList.contains("gallery-strip__card--video")) return;
      var img = card.querySelector("img");
      if (img) openLightbox(img.src, img.alt);
    });
  }

  var makeRipple = function (e) {
    var btn = e.currentTarget;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - rect.left - size / 2) + "px";
    span.style.top = (e.clientY - rect.top - size / 2) + "px";
    btn.appendChild(span);
    setTimeout(function () { span.remove(); }, 620);
  };
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("pointerdown", makeRipple);
  });

  var pressEls = document.querySelectorAll(".card, .activity-card, .feature, .stat, .quote-card");
  pressEls.forEach(function (el) {
    el.addEventListener("pointerdown", function () {
      el.classList.remove("is-pressed");
      void el.offsetWidth;
      el.classList.add("is-pressed");
    });
    el.addEventListener("animationend", function () { el.classList.remove("is-pressed"); });
  });

  document.querySelectorAll(".deco").forEach(function (d) {
    d.style.pointerEvents = "auto";
    d.addEventListener("click", function () {
      d.classList.remove("is-boing");
      void d.offsetWidth;
      d.classList.add("is-boing");
    });
    d.addEventListener("animationend", function () { d.classList.remove("is-boing"); });
  });

  var confettiColors = ["#C38EB4", "#E1CBD7", "#86A8CF", "#26425A", "#f4a583"];
  var burstConfetti = function (x, y) {
    if (reduceMotion) return;
    for (var i = 0; i < 26; i++) {
      var p = document.createElement("span");
      p.className = "confetti-piece";
      p.style.background = confettiColors[i % confettiColors.length];
      if (i % 3 === 0) p.style.borderRadius = "50%";
      var angle = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 140;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 60;
      p.style.transform = "translate(" + x + "px," + y + "px)";
      p.animate(
        [
          { transform: "translate(" + x + "px," + y + "px) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + (x + dx) + "px," + (y + dy) + "px) rotate(" + (Math.random() * 720 - 360) + "deg)", opacity: 1, offset: 0.7 },
          { transform: "translate(" + (x + dx * 1.1) + "px," + (y + dy + 260) + "px) rotate(" + (Math.random() * 900) + "deg)", opacity: 0 }
        ],
        { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(0.2,0.6,0.3,1)" }
      );
      document.body.appendChild(p);
      setTimeout((function (el) { return function () { el.remove(); }; })(p), 1700);
    }
  };
  document.querySelectorAll(".btn--enroll, .btn--lg, #cta .btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      burstConfetti(e.clientX, e.clientY);
    });
  });

  var form = document.getElementById("visitForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form__status";
      status.textContent = "";

      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        status.classList.add("is-err");
        status.textContent = "Form not connected yet — add your Formspree ID to the form action.";
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.classList.add("is-ok");
            status.textContent = "Thank you — we'll be in touch within two working days.";
          } else {
            return res.json().then(function (data) {
              throw new Error(
                data && data.errors
                  ? data.errors.map(function (x) { return x.message; }).join(", ")
                  : "Something went wrong."
              );
            });
          }
        })
        .catch(function (err) {
          status.classList.add("is-err");
          status.textContent = err.message || "Could not send just now. Please try again or email us directly.";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }
})();
