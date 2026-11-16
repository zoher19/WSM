// ===================================================================
// CONFIG — edit here
// ===================================================================
const CONFIG = {
  whatsappLink: "https://chat.whatsapp.com/JEVgCvnnrrI5zW23lyiKtR",
  eventStart: "2026-11-19T12:00:00+03:00",
  eventEnd: "2026-11-19T14:00:00+03:00",
  eventTitle: "اختار المسار الصح",
  eventLocation: "مدرج القدس",
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ===================================================================
// Wire up WhatsApp links
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  ["heroCta", "finalCta", "stickyCta"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.whatsappLink;
  });
});

// ===================================================================
// Terminal "decode" reveal animation
// ===================================================================
const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/\\-_=+";

function randomGlyph() {
  return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scrambleInto(text, onFrame) {
  return new Promise((resolve) => {
    let frame = 0;
    function tick() {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        out += text[i] === " " || i < frame ? text[i] : randomGlyph();
      }
      onFrame(out);
      frame++;
      if (frame <= text.length) {
        setTimeout(tick, 22);
      } else {
        resolve();
      }
    }
    tick();
  });
}

async function runTerminal() {
  const terminal = document.querySelector(".terminal");
  const body = document.getElementById("terminalBody");
  const headlineEl = document.getElementById("headline");
  const lines = [
    { text: "$ ./choose_your_path", cls: "line-prompt" },
    { text: "> Frontend? Backend? Full Stack? Cloud?", cls: "line-dim" },
    { text: "> شو بتختار؟ وليش؟", cls: "line-dim" },
    { text: "> Waiting for your answer... ", cls: "line-dim", cursor: true },
  ];

  if (prefersReducedMotion) {
    body.innerHTML = lines
      .map(
        (l) =>
          `<span class="${l.cls}">${l.text}${
            l.cursor ? '<span class="cursor">&nbsp;</span>' : ""
          }</span>`
      )
      .join("\n");
    headlineEl.classList.add("is-typed");
    return;
  }

  const renderedLines = lines.map(() => "");
  function render() {
    body.innerHTML = renderedLines
      .map((text, i) => `<span class="${lines[i].cls}">${text}</span>`)
      .join("\n");
  }

  terminal.classList.add("is-decoding");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    await scrambleInto(line.text, (partial) => {
      renderedLines[i] = partial;
      render();
    });
    renderedLines[i] = line.text + (line.cursor ? '<span class="cursor">&nbsp;</span>' : "");
    render();
    await delay(line.cursor ? 500 : 160);
  }

  terminal.classList.remove("is-decoding");
  headlineEl.classList.add("is-typed");
}

// ===================================================================
// Kick off the terminal reveal only once the hero scrolls into view
// ===================================================================
function runHeroReveal() {
  const hero = document.getElementById("hero");
  if (!hero || prefersReducedMotion || !("IntersectionObserver" in window)) {
    runTerminal();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runTerminal();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(hero);
}

// ===================================================================
// Countdown
// ===================================================================
function runCountdown() {
  const start = new Date(CONFIG.eventStart).getTime();
  const end = new Date(CONFIG.eventEnd).getTime();
  const countdownEl = document.getElementById("countdown");
  const statusEl = document.getElementById("countdownStatus");

  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();

    if (now < start) {
      const diff = start - now;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      els.days.textContent = pad(d);
      els.hours.textContent = pad(h);
      els.minutes.textContent = pad(m);
      els.seconds.textContent = pad(s);
      countdownEl.hidden = false;
      statusEl.hidden = true;

      if (!prefersReducedMotion) {
        els.seconds.classList.remove("tick");
        void els.seconds.offsetWidth;
        els.seconds.classList.add("tick");
      }
    } else if (now >= start && now < end) {
      countdownEl.hidden = true;
      statusEl.hidden = false;
      statusEl.textContent = "الورشة بلّشت هلأ! تعال على مدرج القدس";
    } else {
      countdownEl.hidden = true;
      statusEl.hidden = false;
      statusEl.textContent = "خلصت الورشة… شكرًا لكل اللي حضروا، وتابعونا للجاي";
      clearInterval(timer);
    }
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// ===================================================================
// Fade-up on scroll (IntersectionObserver)
// ===================================================================
function runFadeUp() {
  const targets = document.querySelectorAll(".fade-up");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}

// ===================================================================
// Sticky bottom bar — show after scrolling past hero
// ===================================================================
function runStickyBar() {
  const bar = document.getElementById("stickyBar");
  const hero = document.getElementById("hero");
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        bar.classList.toggle("is-visible", !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}

// ===================================================================
// Init
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  runHeroReveal();
  runCountdown();
  runFadeUp();
  runStickyBar();
});
