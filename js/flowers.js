/* Gift-page framing; the flower artwork itself is CSS, adapted from M1. */
(() => {
  const from = new URLSearchParams(location.search).get("from") || "";
  const validFrom = /^(index|journey|midnight|chai|choose|ending-garden|ending-stars|ending-letter|invitation|yes|later)\.html(?:\?via=(garden|stars|letter))?$/.test(from);
  const back = document.getElementById("backToStory");
  if (validFrom) {
    back.href = from;
    // Returning through browser history also restores the current story interaction.
    const source = new URL(from, location.href);
    const referredFromStory = document.referrer === source.href;
    if (history.length > 1 && (referredFromStory || location.protocol === "file:")) {
      back.addEventListener("click", event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        history.back();
      });
    }
  }

  const bed = document.getElementById("flowerBed");
  const bouquet = bed.firstElementChild.cloneNode(true);
  const replay = document.getElementById("replayBloom");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) replay.textContent = "Show the flowers again ↻";
  replay.addEventListener("click", () => {
    bed.replaceChildren(bouquet.cloneNode(true));
    document.getElementById("bloomStatus").textContent = reducedMotion ? "Your flowers are here again." : "Your flowers are blooming again.";
  });

  requestAnimationFrame(() => document.body.classList.remove("container"));
})();
