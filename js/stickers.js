/* ============================================================
   L1 stickers — original chubby bear & panda couple, drawn in SVG
   Injected wherever an element has data-sticker="name"
   ============================================================ */
window.L1Stickers = (function () {
  const INK = "#4A2B3A";
  const BEAR = "#F6C777", BEAR_SOFT = "#FBE3B0";
  const PANDA = "#FFFDF7", PATCH = "#4A3550";
  const BLUSH = "#FF9FB6", BERRY = "#FF6B93", BERRY_D = "#E44A78";
  const SKYC = "#7FB8D6", GOLD = "#F2B23E", LEAF = "#3E8E63", HONEY = "#F6B756";

  // small reusable bits -------------------------------------------------
  const heart = (x, y, s, fill = BERRY, sw = 3) =>
    `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" stroke="${INK}" stroke-width="${sw / s}"
       d="M0 3 C0 -2 4.5 -3.5 7 -0.8 C9.5 -3.5 14 -2 14 3 C14 7.5 7 12.5 7 12.5 C7 12.5 0 7.5 0 3 Z"/>`;

  const spark = (x, y, s, fill = HONEY) =>
    `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" stroke="${INK}" stroke-width="${2.4 / s}"
       d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z"/>`;

  // bear face bits
  const bearEars = (bowSide) => `
    <circle cx="62" cy="54" r="21" fill="${BEAR}"/><circle cx="158" cy="54" r="21" fill="${BEAR}"/>
    <circle cx="62" cy="54" r="10" fill="${BEAR_SOFT}" stroke-width="3.5"/>
    <circle cx="158" cy="54" r="10" fill="${BEAR_SOFT}" stroke-width="3.5"/>
    ${bowSide ? `
    <ellipse cx="47" cy="35" rx="13" ry="9.5" fill="${BERRY}" transform="rotate(-22 47 35)"/>
    <ellipse cx="75" cy="33" rx="13" ry="9.5" fill="${BERRY}" transform="rotate(18 75 33)"/>
    <circle cx="61" cy="36" r="6.5" fill="${BERRY_D}"/>` : ""}`;

  const bearHead = `<circle cx="110" cy="108" r="64" fill="${BEAR}"/>`;
  const bearMuzzle = `<ellipse cx="110" cy="127" rx="24" ry="17" fill="${BEAR_SOFT}" stroke-width="4"/>
    <ellipse cx="110" cy="119" rx="7" ry="5.2" fill="${INK}" stroke="none"/>`;
  const blushes = (y = 122) => `
    <ellipse cx="70" cy="${y}" rx="11" ry="7" fill="${BLUSH}" stroke="none" opacity=".85"/>
    <ellipse cx="150" cy="${y}" rx="11" ry="7" fill="${BLUSH}" stroke="none" opacity=".85"/>`;

  // panda face bits
  const pandaEars = `
    <circle cx="62" cy="52" r="20" fill="${PATCH}"/><circle cx="158" cy="52" r="20" fill="${PATCH}"/>`;
  const pandaHead = `<circle cx="110" cy="108" r="64" fill="${PANDA}"/>`;
  const pandaPatches = `
    <ellipse cx="84" cy="100" rx="17" ry="21" fill="${PATCH}" stroke-width="3.5" transform="rotate(-14 84 100)"/>
    <ellipse cx="136" cy="100" rx="17" ry="21" fill="${PATCH}" stroke-width="3.5" transform="rotate(14 136 100)"/>`;
  const pandaEyes = `
    <circle cx="86" cy="99" r="7" fill="#fff" stroke="none"/><circle cx="134" cy="99" r="7" fill="#fff" stroke="none"/>
    <circle cx="87" cy="100" r="3.6" fill="${INK}" stroke="none"/><circle cx="133" cy="100" r="3.6" fill="${INK}" stroke="none"/>
    <circle cx="88.6" cy="98.2" r="1.4" fill="#fff" stroke="none"/><circle cx="134.6" cy="98.2" r="1.4" fill="#fff" stroke="none"/>`;
  const pandaSnout = `
    <ellipse cx="110" cy="121" rx="7" ry="5" fill="${INK}" stroke="none"/>
    <path d="M102 131 q8 8 16 0" fill="none" stroke-width="4.5"/>`;

  const dotEyes = (y = 100) => `
    <circle cx="86" cy="${y}" r="7" fill="${INK}" stroke="none"/><circle cx="134" cy="${y}" r="7" fill="${INK}" stroke="none"/>
    <circle cx="88.3" cy="${y - 2.3}" r="2" fill="#fff" stroke="none"/><circle cx="136.3" cy="${y - 2.3}" r="2" fill="#fff" stroke="none"/>`;
  const happyEyes = `
    <path d="M77 99 q9 -10 18 0" fill="none" stroke-width="5"/>
    <path d="M125 99 q9 -10 18 0" fill="none" stroke-width="5"/>`;
  const smile = `<path d="M100 131 q10 9 20 0" fill="none" stroke-width="4.5"/>`;
  const bigSmile = `<path d="M94 128 q16 16 32 0 q-16 7 -32 0 Z" fill="#8A4A5E" stroke-width="4"/>`;

  // ---------------------------------------------------------------------
  const LIB = {};
  const LABELS = {};

  LABELS["bear-wave"] = "Cute bear girl waving hello";
  LIB["bear-wave"] = `
    <rect x="20" y="88" width="27" height="56" rx="13.5" fill="${BEAR}" transform="rotate(-36 33 144)"/>
    <rect x="78" y="158" width="64" height="48" rx="20" fill="${BEAR}"/>
    <ellipse cx="90" cy="209" rx="15" ry="9" fill="${BEAR_SOFT}" stroke-width="4"/>
    <ellipse cx="130" cy="209" rx="15" ry="9" fill="${BEAR_SOFT}" stroke-width="4"/>
    ${bearEars(true)}${bearHead}
    ${dotEyes()}${bearMuzzle}${smile}${blushes()}
    ${heart(20, 52, 1.15)}${spark(190, 74, 1)}`;

  LABELS["bear-blush"] = "Bear girl blushing with paws on cheeks";
  LIB["bear-blush"] = `
    <rect x="80" y="158" width="60" height="48" rx="20" fill="${BEAR}"/>
    ${bearEars(true)}${bearHead}
    ${happyEyes}${bearMuzzle}
    <ellipse cx="110" cy="132" rx="6" ry="7" fill="#8A4A5E" stroke-width="3.4"/>
    <ellipse cx="68" cy="124" rx="12" ry="8" fill="${BLUSH}" stroke="none"/>
    <ellipse cx="152" cy="124" rx="12" ry="8" fill="${BLUSH}" stroke="none"/>
    <circle cx="64" cy="130" r="15" fill="${BEAR}"/>
    <circle cx="156" cy="130" r="15" fill="${BEAR}"/>
    ${spark(34, 74, .9)}${spark(188, 66, 1.1)}${heart(168, 160, .9)}`;

  LABELS["bear-hearteyes"] = "Bear girl with heart eyes";
  LIB["bear-hearteyes"] = `
    <rect x="78" y="158" width="64" height="48" rx="20" fill="${BEAR}"/>
    ${bearEars(true)}${bearHead}
    ${heart(75, 88, 1.5, BERRY_D, 3.4)}${heart(123, 88, 1.5, BERRY_D, 3.4)}
    ${bearMuzzle}${bigSmile}${blushes(128)}
    ${heart(18, 60, 1.05)}${heart(186, 96, .85)}${spark(178, 44, 1)}`;

  LABELS["bear-cry"] = "Bear girl with comic tears";
  LIB["bear-cry"] = `
    <rect x="78" y="158" width="64" height="48" rx="20" fill="${BEAR}"/>
    ${bearEars(true)}${bearHead}
    <path d="M74 88 q10 -7 20 -2" fill="none" stroke-width="4.5"/>
    <path d="M126 86 q10 -5 20 2" fill="none" stroke-width="4.5"/>
    <circle cx="86" cy="102" r="8.5" fill="#fff" stroke-width="4"/>
    <circle cx="134" cy="102" r="8.5" fill="#fff" stroke-width="4"/>
    <circle cx="86" cy="104" r="4" fill="${INK}" stroke="none"/>
    <circle cx="134" cy="104" r="4" fill="${INK}" stroke="none"/>
    <path d="M78 118 q4 8 0 14 q-6 8 -10 0 q-2 -8 10 -14Z" fill="${SKYC}" stroke-width="3.2"/>
    <path d="M142 118 q-4 8 0 14 q6 8 10 0 q2 -8 -10 -14Z" fill="${SKYC}" stroke-width="3.2"/>
    <ellipse cx="110" cy="121" rx="7" ry="5.2" fill="${INK}" stroke="none"/>
    <path d="M99 136 q11 -9 22 0" fill="none" stroke-width="4.5"/>
    ${blushes(114)}`;

  LABELS["panda-flower"] = "Panda boy offering a rose";
  LIB["panda-flower"] = `
    <rect x="78" y="158" width="64" height="48" rx="20" fill="${PANDA}"/>
    <ellipse cx="90" cy="209" rx="15" ry="9" fill="${PATCH}" stroke-width="4"/>
    <ellipse cx="130" cy="209" rx="15" ry="9" fill="${PATCH}" stroke-width="4"/>
    <g transform="translate(-10 0)">
      ${pandaEars}${pandaHead}${pandaPatches}${pandaEyes}${pandaSnout}${blushes(124)}
    </g>
    <rect x="130" y="122" width="24" height="56" rx="12" fill="${PATCH}" transform="rotate(-46 142 150)"/>
    <line x1="172" y1="126" x2="184" y2="100" stroke="${LEAF}" stroke-width="5.5"/>
    <ellipse cx="180" cy="120" rx="8" ry="4.5" fill="${LEAF}" stroke-width="3" transform="rotate(-30 180 120)"/>
    <circle cx="186" cy="92" r="15" fill="${BERRY}"/>
    <path d="M186 92 m-7.5 0 a7.5 7.5 0 1 1 7.5 7.5" fill="none" stroke="${BERRY_D}" stroke-width="3.4"/>
    ${heart(20, 64, 1)}`;

  LABELS["panda-kneel"] = "Panda boy on one knee offering a ring";
  LIB["panda-kneel"] = `
    <ellipse cx="80" cy="200" rx="18" ry="11" fill="${PATCH}" stroke-width="4"/>
    <rect x="118" y="176" width="21" height="28" rx="10" fill="${PATCH}" stroke-width="4"/>
    <ellipse cx="132" cy="205" rx="15" ry="9" fill="${PATCH}" stroke-width="4"/>
    <rect x="70" y="150" width="62" height="46" rx="18" fill="${PANDA}"/>
    <g transform="translate(-12 -6)">
      ${pandaEars}${pandaHead}${pandaPatches}${pandaEyes}${pandaSnout}${blushes(124)}
    </g>
    <rect x="130" y="112" width="22" height="54" rx="11" fill="${PATCH}" transform="rotate(-55 141 139)"/>
    <circle cx="184" cy="94" r="13" fill="${GOLD}" stroke-width="3.6"/>
    <circle cx="184" cy="94" r="5.5" fill="${PANDA}" stroke-width="3"/>
    <path d="M184 60 l8 9.5 -8 10 -8 -10 Z" fill="${SKYC}" stroke-width="3.2"/>
    <path d="M34 70 q3 7 0 12 q-5 7 -9 0 q-2 -7 9 -12Z" fill="${SKYC}" stroke-width="3"/>
    ${heart(18, 116, 1)}${spark(202, 40, 1)}`;

  LABELS["panda-letter"] = "Panda boy holding a love letter";
  LIB["panda-letter"] = `
    <rect x="80" y="156" width="60" height="48" rx="20" fill="${PANDA}"/>
    ${pandaEars}${pandaHead}${pandaPatches}${pandaEyes}${pandaSnout}${blushes(124)}
    <rect x="58" y="126" width="22" height="50" rx="11" fill="${PATCH}" transform="rotate(-32 69 151)"/>
    <rect x="140" y="126" width="22" height="50" rx="11" fill="${PATCH}" transform="rotate(32 151 151)"/>
    <rect x="74" y="150" width="72" height="50" rx="7" fill="#FFE4EC"/>
    <path d="M74 152 L110 182 L146 152" fill="none" stroke-width="4"/>
    ${heart(103, 178, 1, BERRY_D, 3)}
    ${heart(30, 60, .95)}${spark(190, 70, .95)}`;

  LABELS["pair-hug"] = "Bear girl and panda boy hugging";
  LIB["pair-hug"] = `
    <rect x="46" y="150" width="58" height="52" rx="20" fill="${PANDA}"/>
    <rect x="118" y="152" width="60" height="52" rx="20" fill="${BEAR}"/>
    <g transform="rotate(7 74 116)">
      <circle cx="45" cy="74" r="15" fill="${PATCH}"/><circle cx="103" cy="72" r="15" fill="${PATCH}"/>
      <circle cx="74" cy="112" r="47" fill="${PANDA}"/>
      <ellipse cx="56" cy="106" rx="12.5" ry="15.5" fill="${PATCH}" stroke-width="3" transform="rotate(-14 56 106)"/>
      <ellipse cx="93" cy="105" rx="12.5" ry="15.5" fill="${PATCH}" stroke-width="3" transform="rotate(14 93 105)"/>
      <path d="M50 104 q6 -7 12 0" fill="none" stroke="#fff" stroke-width="4"/>
      <path d="M87 103 q6 -7 12 0" fill="none" stroke="#fff" stroke-width="4"/>
      <ellipse cx="74" cy="121" rx="5.5" ry="4.2" fill="${INK}" stroke="none"/>
      <path d="M68 129 q6 6 12 0" fill="none" stroke-width="4"/>
      <ellipse cx="46" cy="124" rx="8" ry="5.5" fill="${BLUSH}" stroke="none"/>
    </g>
    <g transform="rotate(-7 150 118)">
      <circle cx="121" cy="80" r="15" fill="${BEAR}"/><circle cx="181" cy="82" r="15" fill="${BEAR}"/>
      <circle cx="121" cy="80" r="7" fill="${BEAR_SOFT}" stroke-width="3"/>
      <circle cx="181" cy="82" r="7" fill="${BEAR_SOFT}" stroke-width="3"/>
      <ellipse cx="171" cy="64" rx="10" ry="7.5" fill="${BERRY}" transform="rotate(-20 171 64)" stroke-width="3.4"/>
      <ellipse cx="192" cy="63" rx="10" ry="7.5" fill="${BERRY}" transform="rotate(22 192 63)" stroke-width="3.4"/>
      <circle cx="182" cy="65" r="5" fill="${BERRY_D}" stroke-width="3"/>
      <circle cx="150" cy="116" r="48" fill="${BEAR}"/>
      <path d="M128 108 q7 -8 14 0" fill="none" stroke-width="4.5"/>
      <path d="M160 108 q7 -8 14 0" fill="none" stroke-width="4.5"/>
      <ellipse cx="150" cy="130" rx="17" ry="12.5" fill="${BEAR_SOFT}" stroke-width="3.4"/>
      <ellipse cx="150" cy="125" rx="5.5" ry="4" fill="${INK}" stroke="none"/>
      <path d="M144 134 q6 6 12 0" fill="none" stroke-width="4"/>
      <ellipse cx="124" cy="128" rx="8" ry="5.5" fill="${BLUSH}" stroke="none"/>
      <ellipse cx="176" cy="130" rx="8" ry="5.5" fill="${BLUSH}" stroke="none"/>
    </g>
    <rect x="96" y="146" width="66" height="21" rx="10.5" fill="${BEAR}" transform="rotate(-8 129 156)"/>
    <rect x="60" y="160" width="64" height="19" rx="9.5" fill="${PATCH}" transform="rotate(6 92 169)"/>
    ${heart(100, 18, 1.7, BERRY_D, 3.4)}${heart(52, 40, .95)}${heart(166, 34, .95)}
    ${spark(24, 100, .95)}${spark(198, 108, .95)}`;

  LABELS["rose"] = "A rose";
  LIB["rose"] = `
    <line x1="110" y1="122" x2="110" y2="196" stroke="${LEAF}" stroke-width="7"/>
    <ellipse cx="92" cy="162" rx="14" ry="8" fill="${LEAF}" stroke-width="3.4" transform="rotate(-32 92 162)"/>
    <ellipse cx="128" cy="176" rx="14" ry="8" fill="${LEAF}" stroke-width="3.4" transform="rotate(28 128 176)"/>
    <circle cx="110" cy="96" r="30" fill="${BERRY}"/>
    <path d="M110 96 m-15 0 a15 15 0 1 1 15 15 a9 9 0 1 1 3 -17" fill="none" stroke="${BERRY_D}" stroke-width="4.5"/>`;

  LABELS["tulip"] = "A tulip";
  LIB["tulip"] = `
    <line x1="110" y1="120" x2="110" y2="196" stroke="${LEAF}" stroke-width="7"/>
    <ellipse cx="90" cy="168" rx="15" ry="8" fill="${LEAF}" stroke-width="3.4" transform="rotate(-30 90 168)"/>
    <path d="M84 78 q0 -20 12 -28 q6 12 14 12 q8 0 14 -12 q12 8 12 28 q0 26 -26 32 q-26 -6 -26 -32Z" fill="${HONEY}"/>
    <path d="M110 62 v40" stroke-width="3.5" opacity=".45"/>`;

  // ---------------------------------------------------------------------
  const DEFS = (id) => `
    <defs>
      <filter id="${id}" x="-22%" y="-22%" width="144%" height="144%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/>
        <feFlood flood-color="#FFFFFF" result="w"/>
        <feComposite in="w" in2="d" operator="in" result="edge"/>
        <feDropShadow in="edge" dx="0" dy="5" stdDeviation="0" flood-color="#4A2B3A" flood-opacity=".16" result="sh"/>
        <feMerge><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

  let uid = 0;
  function html(name) {
    const art = LIB[name];
    if (!art) return "";
    const id = "stkr" + (++uid);
    return `<svg viewBox="0 0 220 226" role="img" aria-label="${LABELS[name] || name}">
      ${DEFS(id)}
      <g filter="url(#${id})" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">${art}</g>
    </svg>`;
  }

  function mountAll(root = document) {
    root.querySelectorAll("[data-sticker]").forEach((el) => {
      el.innerHTML = html(el.dataset.sticker);
      el.classList.add("sticker");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountAll());
  } else {
    mountAll();
  }

  return { html, mountAll };
})();
