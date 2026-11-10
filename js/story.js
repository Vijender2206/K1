/* Little story interactions. Every reply is welcome; the reader sets the pace. */
(() => {
  const saved = {
    get(key, fallback) {
      try { return sessionStorage.getItem("l1-" + key) || fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { sessionStorage.setItem("l1-" + key, value); } catch { /* Private browsing is fine. */ }
    },
  };
  // A gift is a detour: keep the current beat even when the browser reloads on Back.
  const pagePath = location.pathname + location.search;
  let giftReturn = null;
  try {
    const snapshot = JSON.parse(saved.get("gift-return", "null"));
    if (snapshot && snapshot.page === pagePath) {
      giftReturn = snapshot;
      saved.set("gift-return", "");
    }
  } catch { /* An unavailable or old snapshot simply starts the page normally. */ }
  let banterSnapshot = () => null, lineSnapshot = () => null;
  window.addEventListener("pageshow", event => {
    if (event.persisted) saved.set("gift-return", "");
  });
  const drinks = { chai: "Chai", coffee: "Coffee", cocoa: "Hot chocolate" };
  const plans = {
    garden: "A garden walk & a snack stop",
    stars: "A rooftop evening & a shared playlist",
    letter: "A bookshop wander & a café corner",
  };
  const params = new URLSearchParams(location.search);
  const via = Object.hasOwn(plans, params.get("via")) ? params.get("via") : "garden";
  document.querySelectorAll("[data-via-link]").forEach(a => {
    a.href = a.getAttribute("href") + "?via=" + via;
  });
  document.querySelectorAll("[data-plan]").forEach(el => el.textContent = plans[via]);
  document.querySelectorAll("[data-drink]").forEach(el => el.textContent = drinks[saved.get("drink", "chai")] || drinks.chai);

  // Small choices change the reply, never the reader's answer.
  document.querySelectorAll("[data-choices]").forEach((group, index) => {
    const output = document.getElementById(group.dataset.output);
    const buttons = [...group.querySelectorAll("button[data-reply]")];
    const select = button => {
      buttons.forEach(b => b.setAttribute("aria-pressed", String(b === button)));
      output.textContent = button.dataset.reply;
      if (group.dataset.save) {
        saved.set(group.dataset.save, button.dataset.value);
        document.querySelectorAll("[data-drink]").forEach(el => el.textContent = drinks[button.dataset.value]);
      }
    };
    buttons.forEach(button => button.addEventListener("click", () => select(button)));
    if (group.dataset.save) {
      const initial = buttons.find(b => b.dataset.value === saved.get(group.dataset.save, "chai")) || buttons[0];
      select(initial);
    }
    const restored = giftReturn?.choices?.[index];
    if (Number.isInteger(restored) && buttons[restored]) select(buttons[restored]);
  });

  document.querySelectorAll("[data-reveal]").forEach((button, index) => {
    const target = document.getElementById(button.dataset.reveal);
    const reveal = () => {
      target.hidden = false;
      button.setAttribute("aria-expanded", "true");
      button.disabled = true;
      button.textContent = button.dataset.after || "There it is ♡";
    };
    button.addEventListener("click", () => { reveal(); L1.chime(); });
    if (giftReturn?.reveals?.includes(index)) reveal();
  });

  // Banter is a conversation with different beats, rather than an interview.
  const banter = document.getElementById("banter");
  if (banter) {
    const scenes = [
      { line: "I was going to play it cool. Very mysterious. Very composed.",
        aside: "This plan lasted approximately four seconds.",
        options: [
          ["And then I showed up? 😏", "Exactly. Ab dekho, a whole website. Very composed behaviour."],
          ["You? Mysterious? Please 😂", "Fair. My face gives away the plot before the opening credits."],
        ] },
      { line: "Then I tried writing a normal ‘hey’. Somehow it grew a plot, a soundtrack, and a chai break.",
        aside: "The ‘hey’ is still in there somewhere.",
        options: [
          ["Subtle. Extremely subtle.", "Thank you. I nearly added an interval. Showed real restraint."],
          ["At least there’s chai ☕", "Finally, someone appreciates the production budget."],
        ] },
      { line: "So here’s the deal: I bring the questionable lines. You bring that very unimpressed face.",
        aside: "If a smile slips out, I promise to be only slightly smug.",
        options: [
          ["Fine. Impress me 😌", "Bold request. Let me lower the lights and raise absolutely no expectations."],
          ["I’m already judging you 😂", "Excellent. A discerning audience. This can only go beautifully."],
        ] },
    ];
    let step = 0, selected = -1;
    if (Number.isInteger(giftReturn?.banter?.step)) step = Math.max(0, Math.min(scenes.length - 1, giftReturn.banter.step));
    const line = document.getElementById("banterLine");
    const aside = document.getElementById("banterAside");
    const options = document.getElementById("banterOptions");
    const reply = document.getElementById("banterReply");
    const next = document.getElementById("banterNext");
    const finish = document.getElementById("banterFinish");
    const render = () => {
      const scene = scenes[step];
      line.textContent = scene.line;
      aside.textContent = scene.aside;
      reply.textContent = "";
      next.hidden = true;
      finish.hidden = true;
      options.replaceChildren();
      selected = -1;
      document.getElementById("banterCount").textContent = `A little banter · ${step + 1} of ${scenes.length}`;
      scene.options.forEach(([label, answer], index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-honey";
        button.textContent = label;
        button.setAttribute("aria-pressed", "false");
        const select = () => {
          selected = index;
          options.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
          reply.textContent = answer;
          if (step < scenes.length - 1) next.hidden = false;
          else finish.hidden = false;
        };
        button.addEventListener("click", select);
        options.appendChild(button);
        if (giftReturn?.banter?.step === step && giftReturn.banter.selected === index) select();
      });
    };
    next.addEventListener("click", () => {
      if (step >= scenes.length - 1) return;
      step++;
      render();
      line.focus({ preventScroll: true });
    });
    render();
    banterSnapshot = () => ({ step, selected });
    // The one-time snapshot must not preselect answers on later steps.
    if (giftReturn) giftReturn.banter = null;
  }

  const deck = document.getElementById("lineDeck");
  if (deck) {
    const lines = [
      ["Are you a plot twist?", "Because I was going to sleep early. Now I’m imagining our next conversation instead.", "Bedtime has filed a very polite complaint."],
      ["Are you the ‘just one more’ at the end of a good book?", "Because ‘goodnight’ was supposed to be the ending. With you, I keep wanting another chapter.", "For the record, I blame the excellent writing."],
      ["Are you the extra five minutes after goodbye?", "Because that might be my favourite part of the whole evening.", "The walk to the door is suddenly a very long route."],
      ["Are you a voice note I haven’t opened yet?", "Because I’m already smiling, and you haven’t even said anything.", "Terrible news for my mysterious reputation."],
      ["Are you the seat beside me on a long train ride?", "Because suddenly I’m less interested in getting there than in making the journey longer.", "Window seat is yours. I’m generous like that."],
    ];
    let current = 0;
    if (Number.isInteger(giftReturn?.lines?.current)) current = Math.max(0, Math.min(lines.length - 1, giftReturn.lines.current));
    const setup = document.getElementById("lineSetup");
    const answer = document.getElementById("lineAnswer");
    const foot = document.getElementById("lineFoot");
    const reveal = document.getElementById("lineReveal");
    const next = document.getElementById("lineNext");
    const render = () => {
      setup.textContent = lines[current][0];
      answer.textContent = lines[current][1];
      foot.textContent = lines[current][2];
      answer.hidden = foot.hidden = true;
      reveal.hidden = false;
      reveal.setAttribute("aria-expanded", "false");
      next.hidden = true;
      document.getElementById("lineCount").textContent = `After-hours thoughts · ${current + 1} of ${lines.length}`;
    };
    reveal.addEventListener("click", () => {
      answer.hidden = foot.hidden = false;
      reveal.setAttribute("aria-expanded", "true");
      reveal.hidden = true;
      next.hidden = current === lines.length - 1;
      if (!next.hidden) next.focus({ preventScroll: true });
      else document.getElementById("midnightContinue").focus({ preventScroll: true });
      L1.chime();
    });
    next.addEventListener("click", () => {
      if (current >= lines.length - 1) return;
      current++;
      render();
      reveal.focus({ preventScroll: true });
    });
    render();
    if (giftReturn?.lines?.revealed) {
      answer.hidden = foot.hidden = false;
      reveal.hidden = true;
      reveal.setAttribute("aria-expanded", "true");
      next.hidden = current === lines.length - 1;
    }
    lineSnapshot = () => ({ current, revealed: !answer.hidden });
  }

  const envelope = document.getElementById("env");
  if (envelope) {
    const open = (sound = true) => {
      if (envelope.classList.contains("open")) return;
      envelope.classList.add("open");
      envelope.setAttribute("aria-expanded", "true");
      document.body.classList.add("opened");
      envelope.querySelector(".env-hint").hidden = true;
      if (sound) L1.chime();
    };
    envelope.addEventListener("click", open);
    envelope.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    if (giftReturn?.envelopeOpen) open(false);
  }

  document.querySelectorAll("[data-flower-row]").forEach(row => {
    for (let i = 0; i < 7; i++) {
      const flower = document.createElement("div");
      flower.innerHTML = L1Stickers.html(i % 2 ? "tulip" : "rose");
      row.appendChild(flower);
    }
  });

  const yesPage = document.getElementById("issueDate");
  if (yesPage) {
    yesPage.textContent = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    L1.confetti(document.getElementById("confettiCanvas"));
    L1.startMelody();
  }

  document.getElementById("giftBtn")?.addEventListener("click", event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    saved.set("gift-return", JSON.stringify({
      page: pagePath, scroll: scrollY,
      banter: banterSnapshot(), lines: lineSnapshot(),
      envelopeOpen: !!envelope?.classList.contains("open"),
      choices: [...document.querySelectorAll("[data-choices]")].map(group => [...group.querySelectorAll("button[data-reply]")].findIndex(b => b.getAttribute("aria-pressed") === "true")),
      reveals: [...document.querySelectorAll("[data-reveal]")].flatMap((button, index) => button.getAttribute("aria-expanded") === "true" ? [index] : []),
    }));
  });
  if (giftReturn) requestAnimationFrame(() => scrollTo(0, giftReturn.scroll || 0));
})();
