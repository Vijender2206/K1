/* ============================================================
   L1 shared engine — sounds, 3D ring builder, floating hearts,
   page transitions, confetti, parallax
   ============================================================ */
window.L1 = (function () {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(pointer: fine)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------------- audio (all synthesized, no files) ---------------- */
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem("l1-mute") === "1"; } catch { /* Sound still works without storage. */ }
  let melodyOn = false, melodyT = null;

  function ac() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, at, dur, type, vol) {
    if (muted) return;
    const c = ac();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    const t = c.currentTime + (at || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol || 0.15, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.18));
    o.start(t); o.stop(t + (dur || 0.18) + 0.06);
  }
  const pop = () => { tone(440, 0, 0.09, "triangle", 0.18); tone(700, 0.05, 0.1, "sine", 0.12); };
  const chime = () => { [784, 988, 1319].forEach((f, i) => tone(f, i * 0.09, 0.34, "sine", 0.13)); };
  const sad = () => { tone(360, 0, 0.16, "triangle", 0.14); tone(280, 0.12, 0.22, "triangle", 0.12); };
  const tada = () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.3, "triangle", 0.16));
    [1319, 1568].forEach((f, i) => tone(f, 0.36 + i * 0.1, 0.5, "sine", 0.12));
  };
  // gentle music-box loop (original little melody)
  const MELODY = [523, 659, 784, 659, 880, 784, 659, 587, 523, 659, 784, 1047, 880, 784, 659, 523];
  function melodyLoop(i = 0) {
    if (!melodyOn) return;
    if (!muted) tone(MELODY[i % MELODY.length], 0, 0.55, "triangle", 0.07);
    if (!muted && i % 2 === 0) tone(MELODY[i % MELODY.length] / 2, 0, 0.6, "sine", 0.035);
    melodyT = setTimeout(() => melodyLoop(i + 1), 380);
  }
  function startMelody() {
    if (melodyOn) return;
    melodyOn = true;
    const kick = () => { ac(); melodyLoop(0); };
    if (ctx && ctx.state === "running") kick();
    else {
      const once = () => { document.removeEventListener("pointerdown", once); kick(); };
      document.addEventListener("pointerdown", once);
      ac(); // try immediately too — works if a gesture already happened
      if (ctx && ctx.state === "running") { document.removeEventListener("pointerdown", once); kick(); }
    }
  }
  function stopMelody() { melodyOn = false; clearTimeout(melodyT); }

  /* ---------------- chrome: mute button + heart-wipe ---------------- */
  function injectChrome() {
    const mute = document.createElement("button");
    mute.id = "muteBtn";
    mute.type = "button";
    mute.setAttribute("aria-label", "Toggle sound");
    mute.setAttribute("aria-pressed", String(!muted));
    mute.textContent = muted ? "🔇" : "🔊";
    mute.addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem("l1-mute", muted ? "1" : "0"); } catch { /* Keep the current preference in memory. */ }
      mute.textContent = muted ? "🔇" : "🔊";
      mute.setAttribute("aria-pressed", String(!muted));
      if (!muted) pop();
    });
    document.body.appendChild(mute);

    const wipe = document.createElement("div");
    wipe.id = "wipe";
    wipe.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C7 16.5 2 12.5 2 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-5 8.5-10 13Z" fill="#fff"/></svg>`;
    document.body.appendChild(wipe);
    window.addEventListener("pageshow", () => wipe.classList.remove("in"));
  }

  function go(href) {
    const wipe = document.getElementById("wipe");
    if (RM || !wipe) { location.href = href; return; }
    wipe.classList.add("in");
    setTimeout(() => (location.href = href), 400);
  }

  /* ---------------- ambient floating hearts ---------------- */
  const HEART_PATH = "M12 21C7 16.5 2 12.5 2 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-5 8.5-10 13Z";
  function heartSVG(color, size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">
      <path d="${HEART_PATH}" fill="${color}" stroke="#4A2B3A" stroke-width="1.4" opacity=".9"/></svg>`;
  }
  function startHearts(palette) {
    if (RM) return;
    const colors = palette || ["#FF6B93", "#FFB7CB", "#F6B756", "#FF8AA9"];
    setInterval(() => {
      if (document.hidden || document.querySelectorAll(".heart-float").length > 14) return;
      const h = document.createElement("div");
      h.className = "heart-float";
      h.style.left = rand(2, 96) + "vw";
      h.style.animationDuration = rand(7, 12) + "s";
      h.innerHTML = heartSVG(colors[(Math.random() * colors.length) | 0], rand(14, 30));
      h.addEventListener("animationend", () => h.remove());
      document.body.appendChild(h);
    }, 1200);
  }

  /* ---------------- 3D promise ring ----------------
     A face-on gold donut (two segment layers for depth) that
     spins on the Y axis, diamond riding at 12 o'clock. */
  function buildRing(stage) {
    const N = 36, R = 62;
    let segs = "";
    for (let i = 0; i < N; i++) {
      const a = (i * 360) / N;
      const rad = (a * Math.PI) / 180;
      const bright = 0.86 + 0.22 * Math.cos(rad + 0.7);
      segs +=
        `<div class="ring-seg" style="transform:rotate(${a}deg) translateY(-${R}px) translateZ(7px);filter:brightness(${bright.toFixed(2)})"></div>` +
        `<div class="ring-seg" style="transform:rotate(${a}deg) translateY(-${R}px) translateZ(-7px);filter:brightness(${(bright * 0.78).toFixed(2)})"></div>`;
    }
    stage.innerHTML = `
      <div class="ring-tilt">
        <div class="ring3d">
          ${segs}
          <div class="gem-mount" style="transform:translateY(-${R + 29}px)">
            <div class="gem"><div class="gem-face f1"></div><div class="gem-face f2"></div></div>
          </div>
        </div>
        <div class="gem-glow"></div>
        <div class="ring-shadow"></div>
      </div>
      <span class="sparkle" style="left:8%;top:18%">✦</span>
      <span class="sparkle" style="right:6%;top:34%;animation-delay:.5s">✦</span>
      <span class="sparkle" style="left:16%;bottom:12%;animation-delay:1s">✧</span>
      <span class="sparkle" style="right:14%;bottom:26%;animation-delay:1.4s">✧</span>`;
  }

  /* ---------------- starfield ---------------- */
  function starfield(el, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = rand(0, 100) + "%";
      s.style.top = rand(0, 100) + "%";
      const sz = rand(2, 4.6);
      s.style.width = sz + "px";
      s.style.height = sz + "px";
      s.style.animationDuration = rand(1.6, 3.6) + "s";
      s.style.animationDelay = rand(0, 3) + "s";
      el.appendChild(s);
    }
  }

  /* ---------------- burst of hearts (on YES) ---------------- */
  function burstHearts(x, y) {
    const colors = ["#FF6B93", "#F6B756", "#E44A78", "#FF8AA9", "#fff"];
    for (let i = 0; i < 14; i++) {
      const b = document.createElement("div");
      b.className = "burst-heart";
      b.style.left = x + "px";
      b.style.top = y + "px";
      b.style.setProperty("--bx", rand(-140, 140) + "px");
      b.style.setProperty("--by", rand(-170, -30) + "px");
      b.style.setProperty("--br", rand(-120, 120) + "deg");
      b.innerHTML = heartSVG(colors[(Math.random() * colors.length) | 0], rand(16, 30));
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 950);
    }
  }

  /* ---------------- playful runaway NO button ---------------- */
  const NO_LABELS = ["Arre, missed me 😏", "Catch me first 🙈", "Itni jaldi? 😌", "Nice try 😏"];
  function makeDodger(btn) {
    let n = 0;
    const surrender = () => {
      btn.classList.add("gave-up");
      btn.textContent = "Theek hai… YES hi sahi 🙈";
      btn.style.transform = "none";
    };
    const dodge = () => {
      if (btn.classList.contains("gave-up")) return;
      n++;
      if (n > 4) { surrender(); return; }
      const zone = btn.closest(".answer-row") || btn.parentElement;
      const zr = zone.getBoundingClientRect(), br = btn.getBoundingClientRect();
      const mx = Math.max(30, (zr.width - br.width) / 2 - 8);
      btn.style.transform = `translate(${rand(-mx, mx)}px, ${rand(-46, 46)}px) rotate(${rand(-8, 8)}deg)`;
      btn.textContent = NO_LABELS[n - 1];
      const yes = document.getElementById("yesBtn");
      if (yes) {
        const availableScale = Math.max(1, (innerWidth - 40) / yes.offsetWidth);
        yes.style.transform = `scale(${Math.min(1 + n * 0.08, availableScale)})`;
      }
      pop();
    };
    btn.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") dodge(); });
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (btn.classList.contains("gave-up")) {
        const yes = document.getElementById("yesBtn");
        celebrate(btn, btn.dataset.yesUrl || (yes && yes.getAttribute("href")) || "yes.html");
      } else dodge();
    });
  }

  function celebrate(el, href) {
    const r = el.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2);
    tada();
    setTimeout(() => go(href), 620);
  }

  /* ---------------- confetti (yes page) ---------------- */
  function confetti(canvas) {
    const c2 = canvas.getContext("2d");
    const colors = ["#FF6B93", "#F6B756", "#69B884", "#7FB8D6", "#E44A78", "#FFD9E3", "#FFE9A8"];
    let W, H, parts = [], running = true;
    const fit = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
    fit(); addEventListener("resize", fit);
    const spawn = (n, burst) => {
      for (let i = 0; i < n; i++) {
        parts.push({
          x: rand(0, W), y: burst ? rand(-40, H * 0.4) : -20,
          vx: rand(-1.4, 1.4), vy: rand(1, 3.2),
          s: rand(6, 13), r: rand(0, Math.PI * 2), vr: rand(-0.12, 0.12),
          c: colors[(Math.random() * colors.length) | 0],
          heart: Math.random() < 0.42,
        });
      }
    };
    function drawHeart(p) {
      c2.beginPath();
      const s = p.s / 14;
      c2.moveTo(0, 4 * s);
      c2.bezierCurveTo(0, -3 * s, 8 * s, -3 * s, 8 * s, 3 * s);
      c2.bezierCurveTo(8 * s, -3 * s, 16 * s, -3 * s, 16 * s, 4 * s);
      c2.bezierCurveTo(16 * s, 9 * s, 8 * s, 14 * s, 8 * s, 14 * s);
      c2.bezierCurveTo(8 * s, 14 * s, 0, 9 * s, 0, 4 * s);
      c2.fill();
    }
    function frame() {
      c2.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += 0.012;
        c2.save(); c2.translate(p.x, p.y); c2.rotate(p.r); c2.fillStyle = p.c;
        if (p.heart) drawHeart(p);
        else c2.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66);
        c2.restore();
      });
      parts = parts.filter((p) => p.y < H + 30);
      if (running || parts.length) requestAnimationFrame(frame);
    }
    if (RM) { spawn(40, true); frame(); running = false; return; }
    spawn(150, true);
    frame();
    const trickle = setInterval(() => spawn(6), 400);
    setTimeout(() => { clearInterval(trickle); running = false; }, 12000);
  }

  /* ---------------- parallax ---------------- */
  function parallax(scene) {
    if (!FINE || RM) return;
    const layers = scene.querySelectorAll("[data-depth]");
    scene.addEventListener("pointermove", (e) => {
      const dx = (e.clientX / innerWidth - 0.5), dy = (e.clientY / innerHeight - 0.5);
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth) || 0;
        l.style.translate = `${(-dx * 30 * d).toFixed(1)}px ${(-dy * 18 * d).toFixed(1)}px`;
      });
    });
  }

  /* ---------------- auto-init ---------------- */
  function init() {
    injectChrome();

    if (document.body.hasAttribute("data-hearts")) {
      const pal = document.body.dataset.hearts === "night"
        ? ["#FFE9A8", "#CBBBE8", "#FF8AA9", "#fff"] : undefined;
      startHearts(pal);
    }

    document.querySelectorAll("[data-ring]").forEach(buildRing);
    document.querySelectorAll("[data-starfield]").forEach((el) => starfield(el, parseInt(el.dataset.starfield) || 80));
    document.querySelectorAll("[data-dodge]").forEach(makeDodger);
    document.querySelectorAll("[data-parallax]").forEach(parallax);

    // soft pop on every button press
    document.addEventListener("click", (e) => {
      const t = e.target.closest(".btn, .chip, .door");
      if (t && !t.hasAttribute("data-celebrate") && !t.hasAttribute("data-dodge")) pop();
    });

    // page links with heart-wipe
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-nav]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      go(a.getAttribute("href"));
    });

    // YES buttons
    document.querySelectorAll("[data-celebrate]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        celebrate(btn, btn.getAttribute("href"));
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return { pop, chime, tada, sad, startMelody, stopMelody, burstHearts, confetti, go, rand, RM };
})();
