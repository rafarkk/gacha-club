/* ============ MASCOTES ============ caixa local ~0..54 (x) × 0..56 (y); cores [principal, secundária, contorno]
   Estilo: contorno grosso, olhos grandes com brilho, bochechas, barriga/patinhas em tom claro e sombra de dois tons
   (o rig aplica o filtro de volume por cima). Índices não mudam: saves guardam o número do mascote. */

const po = (k, w = 2.4) => ol(k, w);
/* olhos de anime: íris escura, brilho grande e pequeno */
const petEyes = (k, x1, x2, y, r = 3.2) => [x1, x2].map(x =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${k.c[2]}"/><circle cx="${x - r * .35}" cy="${y - r * .45}" r="${r * .45}" fill="#fff"/><circle cx="${x + r * .4}" cy="${y + r * .45}" r="${r * .2}" fill="#fff" opacity=".9"/>`).join('');
const petCheeks = (x1, x2, y, r = 3.4) => `<ellipse cx="${x1}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#ff8fa3" opacity=".55"/><ellipse cx="${x2}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#ff8fa3" opacity=".55"/>`;
const petMouth = (k, x, y, w = 3) => `<path d="M${x - w} ${y} Q${x - w / 2} ${y + w * .8} ${x} ${y} Q${x + w / 2} ${y + w * .8} ${x + w} ${y}" stroke="${k.c[2]}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
const light = (k, t = .55) => Color.mix(k.c[0], '#ffffff', t);
const dark = (k, t = -18) => Color.shade(k.c[0], t);
/* patinhas dianteiras */
const paws = (k, xs, y, fill) => xs.map(x => `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.6" fill="${fill || k.c[0]}" ${po(k, 2)}/><path d="M${x - 1.6} ${y - .5} L${x - 1.6} ${y + 1.8} M${x + 1.6} ${y - .5} L${x + 1.6} ${y + 1.8}" stroke="${k.c[2]}" stroke-width="1" opacity=".6"/>`).join('');

/* Profundidade própria do mascote (vale no editor, no Estúdio e nas miniaturas):
   sombra de dois tons com borda nítida embaixo/direita, luz de borda em cima/esquerda, brilho suave no alto,
   oclusão perto do chão e sombra de contato. Tudo calculado da forma, então respeita qualquer cor. */
function petDepth(k, svg) {
  const id = k.u + 'pd', sh = Color.shade(Color.mix(k.c[0], '#3a1a6a', .35), -35);
  return `<defs><filter id="${id}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="erode" radius="2.1" result="in"/>
    <feOffset in="in" dx="-3.6" dy="-4.6" result="o1"/><feComposite in="in" in2="o1" operator="out" result="s1"/>
    <feFlood flood-color="${sh}" flood-opacity=".42"/><feComposite in2="s1" operator="in" result="shade"/>
    <feOffset in="in" dx="1.3" dy="1.7" result="o2"/><feComposite in="in" in2="o2" operator="out" result="s2"/>
    <feFlood flood-color="#fff" flood-opacity=".35"/><feComposite in2="s2" operator="in" result="rim"/>
    <feGaussianBlur in="in" stdDeviation="5" result="bl"/><feOffset in="bl" dx="-4" dy="-6" result="bo"/>
    <feComposite in="in" in2="bo" operator="arithmetic" k2="1" k3="-1" result="hl0"/>
    <feFlood flood-color="#fff" flood-opacity=".22"/><feComposite in2="hl0" operator="in" result="glow"/>
    <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/><feMergeNode in="glow"/><feMergeNode in="rim"/></feMerge></filter>
    <radialGradient id="${id}g"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".65" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>` +
    `<ellipse cx="26" cy="54" rx="18" ry="4" fill="#0a0620" opacity=".6"/><g class="fx" filter="url(#${id})">${svg}</g>`;
}

PARTS.pet = [null,
  { n: 'Gatinho', d: k => `<path d="M38 44 Q54 44 52 30 Q51 22 45 24 Q49 28 47 34 Q45 40 36 40Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="46" rx="8" ry="5" fill="${light(k)}"/>` +
    `<path d="M9 22 L8 4 Q14 6 21 12Z M43 22 L44 4 Q38 6 31 12Z" fill="${k.c[0]}" ${po(k)}/><path d="M11 17 L11 8 L17 12Z M41 17 L41 8 L35 12Z" fill="${k.c[1]}"/>` +
    `<path d="M26 10 C42 10 46 20 45 27 C44 36 36 40 26 40 C16 40 8 36 7 27 C6 20 10 10 26 10Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M18 11 L20 15 L23 11 M30 11 L32 15 L34 11" stroke="${k.c[2]}" stroke-width="1.2" fill="none" opacity=".45"/>` +
    petEyes(k, 19, 33, 25) + petCheeks(13, 39, 31) + `<path d="M24.8 29.5 L27.2 29.5 L26 31Z" fill="#ff8fa3"/>` + petMouth(k, 26, 31.5, 2.6) +
    `<path d="M3 27 L10 28 M3 31 L10 30 M49 27 L42 28 M49 31 L42 30" stroke="${k.c[2]}" stroke-width="1" opacity=".5"/>` + paws(k, [19, 33], 51) },

  { n: 'Raposa', d: k => `<path d="M38 46 Q62 38 56 12 Q50 26 40 30 Q34 36 34 42Z" fill="${k.c[0]}" ${po(k)}/><path d="M56 12 Q55 22 50 26 L55 26 Q58 20 56 12Z" fill="#fff" ${po(k, 1.6)}/>` +
    `<path d="M12 50 Q9 34 26 32 Q43 34 40 50 Q26 54 12 50Z" fill="${k.c[0]}" ${po(k)}/><path d="M20 36 Q26 46 32 36 Q30 50 26 51 Q22 50 20 36Z" fill="#fff"/>` +
    `<path d="M9 20 L10 2 Q17 5 22 13Z M43 20 L42 2 Q35 5 30 13Z" fill="${k.c[0]}" ${po(k)}/><path d="M12 15 L12 7 L18 12Z M40 15 L40 7 L34 12Z" fill="${k.c[2]}" opacity=".7"/>` +
    `<path d="M26 11 C40 11 46 19 46 26 C46 32 38 38 26 40 C14 38 6 32 6 26 C6 19 12 11 26 11Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M26 40 C18 39 11 34 10 29 Q18 30 22 34 L26 28 L30 34 Q34 30 42 29 C41 34 34 39 26 40Z" fill="#fff"/>` +
    petEyes(k, 18, 34, 24, 3) + `<ellipse cx="26" cy="32" rx="2.4" ry="1.8" fill="${k.c[2]}"/>` + petMouth(k, 26, 34, 2.4) + paws(k, [19, 33], 51, dark(k, -30)) },

  { n: 'Peixinho', d: k => `<path d="M9 30 Q-1 18 -4 20 Q0 30 -4 40 Q-1 42 9 30Z" fill="${k.c[1]}" ${po(k)}/>` +
    `<path d="M8 30 C8 18 18 16 26 16 C38 16 44 24 44 30 C44 36 38 44 26 44 C18 44 8 42 8 30Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M20 17 Q26 6 34 17Z" fill="${k.c[1]}" ${po(k, 2)}/><path d="M22 43 Q26 50 30 43Z" fill="${k.c[1]}" ${po(k, 2)}/>` +
    `<path d="M18 22 Q16 30 18 38" stroke="${k.c[2]}" stroke-width="1.3" fill="none" opacity=".45"/><path d="M12 36 Q26 44 40 36 Q30 42 12 36Z" fill="${light(k)}"/>` +
    `<ellipse cx="33" cy="27" rx="4.4" ry="5" fill="#fff" ${po(k, 1.6)}/><ellipse cx="34" cy="28" rx="2.6" ry="3.2" fill="${k.c[2]}"/><circle cx="33" cy="26.4" r="1.1" fill="#fff"/>` +
    `<path d="M38 34 Q41 36 43 34" stroke="${k.c[2]}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + petCheeks(38, 38, 38, 2.6) +
    `<circle cx="50" cy="16" r="3" fill="none" stroke="#bfe9ff" stroke-width="1.4" class="anim-bob"/><circle cx="54" cy="8" r="2" fill="none" stroke="#bfe9ff" stroke-width="1.2"/>` },

  { n: 'Slime', d: k => `<path d="M4 48 C2 30 12 12 26 12 C40 12 50 30 48 48 C40 52 12 52 4 48Z" fill="${k.c[0]}" fill-opacity=".92" ${po(k)}/>` +
    `<path d="M9 44 C8 34 12 26 18 22" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/><ellipse cx="17" cy="21" rx="4.4" ry="2.6" fill="#fff" opacity=".75" transform="rotate(-30 17 21)"/>` +
    `<path d="M6 48 Q26 44 46 48 Q26 52 6 48Z" fill="${dark(k)}" opacity=".6"/><path d="${Shape.star(36, 20, 3.6, 1.4, 4)}" fill="#fff" opacity=".85"/>` +
    petEyes(k, 18, 34, 33, 3.4) + petCheeks(12, 40, 39) + petMouth(k, 26, 40, 3) },

  { n: 'Coelhinho', d: k => `<path d="M16 26 C10 16 10 2 16 0 C22 2 22 16 20 26Z" fill="${k.c[0]}" ${po(k)}/><path d="M36 26 C42 16 42 2 36 0 C30 2 30 16 32 26Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M16 22 C13 14 14 6 16 4 C18 6 19 14 18 22Z M36 22 C39 14 38 6 36 4 C34 6 33 14 34 22Z" fill="${k.c[1]}"/>` +
    `<path d="M11 50 Q8 36 26 34 Q44 36 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/><circle cx="44" cy="46" r="4.6" fill="#fff" ${po(k, 2)}/>` +
    `<path d="M26 18 C40 18 45 26 44 32 C43 40 36 43 26 43 C16 43 9 40 8 32 C7 26 12 18 26 18Z" fill="${k.c[0]}" ${po(k)}/>` +
    petEyes(k, 19, 33, 30) + petCheeks(13, 39, 36) + `<path d="M24.6 34 L27.4 34 L26 35.6Z" fill="#ff8fa3"/>` + petMouth(k, 26, 36, 2.4) + paws(k, [19, 33], 51) },

  { n: 'Fantasminha', d: k => `<path d="M8 48 L8 24 C8 10 16 4 26 4 C36 4 44 10 44 24 L44 48 Q41 44 38 48 Q35 52 32 47 Q29 43 26 48 Q23 52 20 47 Q17 43 14 48 Q11 52 8 48Z" fill="${k.c[0]}" fill-opacity=".95" ${po(k)}/>` +
    `<path d="M13 22 C13 14 18 9 24 8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/><path d="M4 30 Q0 26 2 22 Q6 26 8 26Z M48 30 Q52 26 50 22 Q46 26 44 26Z" fill="${k.c[0]}" ${po(k, 2)}/>` +
    `<ellipse cx="19" cy="24" rx="3.4" ry="4.4" fill="${k.c[2]}"/><ellipse cx="33" cy="24" rx="3.4" ry="4.4" fill="${k.c[2]}"/><circle cx="18" cy="22.4" r="1.4" fill="#fff"/><circle cx="32" cy="22.4" r="1.4" fill="#fff"/>` +
    `<ellipse cx="26" cy="33" rx="3" ry="3.6" fill="${k.c[2]}"/><ellipse cx="26" cy="34.4" rx="1.8" ry="1.4" fill="#ff8fa3"/>` + petCheeks(13, 39, 30, 3.6) },

  { n: 'Robozinho', d: k => `<path d="M26 11 L26 3" stroke="${k.c[2]}" stroke-width="2.4"/><circle cx="26" cy="3" r="3.4" fill="${k.c[1]}" ${po(k, 1.6)} class="anim-tw"/>` +
    `<rect x="8" y="10" width="36" height="26" rx="9" fill="${k.c[0]}" ${po(k)}/><rect x="4" y="17" width="4" height="10" rx="2" fill="${dark(k)}" ${po(k, 1.6)}/><rect x="44" y="17" width="4" height="10" rx="2" fill="${dark(k)}" ${po(k, 1.6)}/>` +
    `<rect x="12" y="14" width="28" height="17" rx="6" fill="#1b1838"/><ellipse cx="20" cy="22" rx="3.4" ry="4" fill="${k.c[1]}"/><ellipse cx="32" cy="22" rx="3.4" ry="4" fill="${k.c[1]}"/>` +
    `<circle cx="19" cy="20.6" r="1.2" fill="#fff"/><circle cx="31" cy="20.6" r="1.2" fill="#fff"/><path d="M23 27 Q26 29 29 27" stroke="${k.c[1]}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
    `<path d="M11 13 Q24 9 40 13" stroke="#fff" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>` +
    `<rect x="14" y="36" width="24" height="12" rx="4" fill="${dark(k, -8)}" ${po(k)}/><circle cx="26" cy="42" r="2.4" fill="${k.c[1]}"/>` +
    `<circle cx="16" cy="50" r="4.6" fill="#3a3558" ${po(k, 2)}/><circle cx="36" cy="50" r="4.6" fill="#3a3558" ${po(k, 2)}/><circle cx="16" cy="50" r="1.6" fill="#8a84c8"/><circle cx="36" cy="50" r="1.6" fill="#8a84c8"/>` },

  { n: 'Dragãozinho', d: k => `<path class="anim-flap" d="M34 28 Q46 10 56 16 Q52 22 54 28 Q48 26 46 32 Q42 28 38 34Z" fill="${k.c[1]}" ${po(k)}/>` +
    `<path d="M10 44 Q-4 48 0 56 Q4 52 8 54 Q8 50 14 48Z" fill="${k.c[0]}" ${po(k)}/><path d="M0 56 L-3 51 L3 53Z" fill="${k.c[1]}"/>` +
    `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/><path d="M18 36 Q26 34 34 36 Q34 48 26 50 Q18 48 18 36Z" fill="${light(k, .45)}"/>` +
    `<path d="M20 40 L32 40 M19 44 L33 44" stroke="${k.c[2]}" stroke-width="1" opacity=".4"/>` +
    `<path d="M14 12 L10 2 L19 8Z M38 12 L42 2 L33 8Z" fill="${k.c[1]}" ${po(k, 2)}/>` +
    `<path d="M26 8 C40 8 46 16 46 25 C46 34 38 38 26 38 C14 38 6 34 6 25 C6 16 12 8 26 8Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M22 8 L24 4 L26 8 L28 4 L30 8" fill="${k.c[1]}" ${po(k, 1.4)}/>` + petEyes(k, 18, 34, 22) + petCheeks(12, 40, 29) +
    `<circle cx="23" cy="29" r=".9" fill="${k.c[2]}"/><circle cx="29" cy="29" r=".9" fill="${k.c[2]}"/>` + petMouth(k, 26, 32, 3) + `<path d="M28 32 L29 35 L30 32" fill="#fff" ${po(k, 1)}/>` + paws(k, [19, 33], 51) },

  { n: 'Fênix', d: k => `<path class="anim-flicker" d="M20 40 Q4 60 -4 52 Q4 48 2 42 Q-6 46 -8 36 Q4 38 14 32Z" fill="${k.c[1]}" ${po(k, 2)}/>` +
    `<path class="anim-flap" d="M18 30 Q-2 14 2 2 Q10 10 14 8 Q14 16 26 22Z" fill="${k.c[0]}" ${po(k)}/><path class="anim-flap" d="M34 30 Q54 14 50 2 Q42 10 38 8 Q38 16 26 22Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M6 8 Q10 14 16 16 M46 8 Q42 14 36 16" stroke="${k.c[1]}" stroke-width="2" fill="none"/>` +
    `<path d="M26 16 C36 16 40 24 40 32 C40 42 34 48 26 48 C18 48 12 42 12 32 C12 24 16 16 26 16Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="38" rx="7" ry="8" fill="${k.c[1]}" opacity=".85"/>` +
    `<path d="M26 16 Q22 6 26 2 Q30 6 26 16 Q32 8 36 10 Q32 14 28 17Z" fill="${k.c[1]}" ${po(k, 1.6)}/>` + petEyes(k, 21, 31, 26, 2.8) +
    `<path d="M24 30 L28 30 L26 34Z" fill="#ffd23f" ${po(k, 1.2)}/>` + petCheeks(17, 35, 31, 2.8) },

  { n: 'Cachorrinho', d: k => `<path d="M40 44 Q50 38 48 30 Q46 36 38 40Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="46" rx="8" ry="5" fill="${light(k)}"/>` +
    `<path d="M26 10 C40 10 45 19 44 27 C43 36 36 40 26 40 C16 40 9 36 8 27 C7 19 12 10 26 10Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M10 16 C2 18 2 32 8 36 C12 34 13 26 13 18Z" fill="${k.c[1]}" ${po(k)}/><path d="M42 16 C50 18 50 32 44 36 C40 34 39 26 39 18Z" fill="${k.c[1]}" ${po(k)}/>` +
    `<ellipse cx="33" cy="20" rx="6" ry="5" fill="${k.c[1]}" opacity=".85"/><ellipse cx="26" cy="32" rx="8" ry="6" fill="${light(k)}"/>` +
    petEyes(k, 19, 33, 24) + `<ellipse cx="26" cy="29.5" rx="3" ry="2.2" fill="${k.c[2]}"/><circle cx="25" cy="28.8" r=".8" fill="#fff"/>` + petMouth(k, 26, 32.5, 2.6) +
    `<path d="M26 34 Q27 38 29 37 Q30 35 28 34Z" fill="#ff8fa3"/>` + petCheeks(13, 39, 31) + paws(k, [19, 33], 51) },

  { n: 'Ursinho', d: k => `<circle cx="11" cy="13" r="6.6" fill="${k.c[0]}" ${po(k)}/><circle cx="41" cy="13" r="6.6" fill="${k.c[0]}" ${po(k)}/><circle cx="11" cy="13" r="3.4" fill="${k.c[1]}"/><circle cx="41" cy="13" r="3.4" fill="${k.c[1]}"/>` +
    `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="45" rx="9" ry="6" fill="${k.c[1]}"/>` +
    `<path d="M26 11 C40 11 45 19 44 27 C43 36 36 40 26 40 C16 40 9 36 8 27 C7 19 12 11 26 11Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<ellipse cx="26" cy="31" rx="7.4" ry="5.6" fill="${k.c[1]}"/>` + petEyes(k, 19, 33, 24, 2.8) +
    `<ellipse cx="26" cy="28.8" rx="2.8" ry="2" fill="${k.c[2]}"/>` + petMouth(k, 26, 31.4, 2.4) + petCheeks(13, 39, 30) + paws(k, [19, 33], 51) },

  { n: 'Sapinho', d: k => `<path d="M4 46 C2 32 12 24 26 24 C40 24 50 32 48 46 C40 52 12 52 4 46Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="44" rx="13" ry="6" fill="${light(k)}"/>` +
    `<circle cx="15" cy="21" r="9" fill="${k.c[0]}" ${po(k)}/><circle cx="37" cy="21" r="9" fill="${k.c[0]}" ${po(k)}/>` +
    `<circle cx="15" cy="21" r="6" fill="#fff"/><circle cx="37" cy="21" r="6" fill="#fff"/>` + petEyes(k, 15, 37, 21.5, 3.2) +
    `<path d="M14 36 Q26 44 38 36" stroke="${k.c[2]}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` + petCheeks(9, 43, 34, 3.8) +
    `<circle cx="16" cy="30" r="1.4" fill="${dark(k, -25)}" opacity=".5"/><circle cx="40" cy="31" r="1.8" fill="${dark(k, -25)}" opacity=".5"/>` + paws(k, [14, 38], 50) },

  { n: 'Pinguim', d: k => `<path d="M8 32 Q2 38 4 44 Q8 40 10 40Z M44 32 Q50 38 48 44 Q44 40 42 40Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M26 6 C40 6 46 18 46 32 C46 46 38 54 26 54 C14 54 6 46 6 32 C6 18 12 6 26 6Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M26 18 C36 18 40 28 40 36 C40 46 34 51 26 51 C18 51 12 46 12 36 C12 28 16 18 26 18Z" fill="#fff"/>` +
    `<path d="M14 12 Q22 8 30 10" stroke="#fff" stroke-width="2.4" fill="none" opacity=".35" stroke-linecap="round"/>` +
    petEyes(k, 20, 32, 24, 2.6) + `<path d="M22 29 L30 29 Q26 34 22 29Z" fill="#ffb52e" ${po(k, 1.4)}/>` + petCheeks(15, 37, 31, 3) +
    `<ellipse cx="19" cy="54" rx="5.6" ry="2.8" fill="#ffb52e" ${po(k, 1.8)}/><ellipse cx="33" cy="54" rx="5.6" ry="2.8" fill="#ffb52e" ${po(k, 1.8)}/>` },

  { n: 'Morceguinho', d: k => `<path class="anim-flap" d="M16 26 C4 12 -8 18 -6 30 C0 27 3 31 4 35 C8 31 12 33 14 36 Q16 32 18 32Z" fill="${k.c[1]}" ${po(k)}/>` +
    `<path class="anim-flap" d="M36 26 C48 12 60 18 58 30 C52 27 49 31 48 35 C44 31 40 33 38 36 Q36 32 34 32Z" fill="${k.c[1]}" ${po(k)}/>` +
    `<path d="M-2 26 Q4 28 6 32 M54 26 Q48 28 46 32" stroke="${k.c[2]}" stroke-width="1.2" fill="none" opacity=".5"/>` +
    `<path d="M14 18 L12 4 L22 12Z M38 18 L40 4 L30 12Z" fill="${k.c[0]}" ${po(k)}/><path d="M15 13 L14 7 L19 11Z M37 13 L38 7 L33 11Z" fill="${k.c[1]}"/>` +
    `<path d="M26 12 C38 12 42 20 42 28 C42 38 36 44 26 44 C16 44 10 38 10 28 C10 20 14 12 26 12Z" fill="${k.c[0]}" ${po(k)}/>` +
    petEyes(k, 20, 32, 26, 3) + petCheeks(15, 37, 32, 3) + petMouth(k, 26, 34, 2.6) +
    `<path d="M23 34 L24 37.5 L25 34 M27 34 L28 37.5 L29 34" fill="#fff" ${po(k, .9)}/>` },

  { n: 'Estrelinha', d: k => `<path d="${Shape.star(26, 30, 25, 12)}" fill="${k.c[0]}" ${po(k, 2.6)}/>` +
    `<path d="${Shape.star(26, 30, 17, 8)}" fill="${light(k, .45)}" opacity=".7"/><path d="M18 18 Q22 14 26 12" stroke="#fff" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/>` +
    petEyes(k, 20, 32, 30, 2.8) + petCheeks(15, 37, 36, 3.2) + petMouth(k, 26, 37, 2.6) +
    `<path d="${Shape.star(46, 8, 3.6, 1.2, 4)}" fill="#fff" class="anim-tw"/><path d="${Shape.star(6, 12, 2.6, .9, 4)}" fill="#fff" class="anim-tw"/>` },
  /* ---- novos (no fim da lista) ---- */
  { n: 'Unicórnio', d: k => `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M26 10 C40 10 45 19 44 27 C43 36 36 40 26 40 C16 40 9 36 8 27 C7 19 12 10 26 10Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M12 16 L10 6 L18 12Z M40 16 L42 6 L34 12Z" fill="${k.c[0]}" ${po(k, 2)}/><path d="M24 12 L26 -4 L28 12Z" fill="#ffe066" ${po(k, 2)}/><path d="M24.6 8 L27.4 6 M24.8 3 L27 1.6" stroke="${k.c[2]}" stroke-width="1" opacity=".6"/>` +
    `<path d="M30 10 Q44 6 46 20 Q42 16 38 18 Q42 26 36 32 Q36 22 30 16Z" fill="${k.c[1]}" ${po(k, 2)}/><path d="M36 14 Q40 20 38 26" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/>` +
    petEyes(k, 19, 31, 24) + petCheeks(13, 37, 30) + petMouth(k, 25, 31, 2.4) + paws(k, [19, 33], 51, light(k, .3)) },
  { n: 'Ovelhinha', d: k => curls(k, [[14, 42, 8], [22, 46, 8], [30, 46, 8], [38, 42, 8], [12, 32, 8], [40, 32, 8], [16, 22, 8], [26, 18, 9], [36, 22, 8], [26, 34, 14]]) +
        `<ellipse cx="13" cy="27" rx="5" ry="3" fill="${k.c[1]}" ${po(k, 2)} transform="rotate(-25 13 27)"/><ellipse cx="39" cy="27" rx="5" ry="3" fill="${k.c[1]}" ${po(k, 2)} transform="rotate(25 39 27)"/>` +
    `<path d="M26 20 C34 20 37 26 36 31 C35 37 31 40 26 40 C21 40 17 37 16 31 C15 26 18 20 26 20Z" fill="${k.c[1]}" ${po(k)}/>` +
    petEyes(k, 21.5, 30.5, 29, 2.4) + petCheeks(18, 34, 34, 2.6) + petMouth(k, 26, 35, 2) +
    `<rect x="17" y="49" width="5" height="6" rx="2" fill="${k.c[1]}" ${po(k, 1.8)}/><rect x="30" y="49" width="5" height="6" rx="2" fill="${k.c[1]}" ${po(k, 1.8)}/>` },
  { n: 'Nuvenzinha', d: k => blob(k, [[12, 34, 10], [22, 26, 12], [34, 26, 12], [42, 34, 10], [27, 36, 14]]) +
    `<path d="M10 30 Q14 22 22 20" stroke="#fff" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/>` +
    petEyes(k, 21, 33, 32, 2.6) + petCheeks(16, 38, 37, 3) + petMouth(k, 27, 38, 2.4) +
    [[16, 52], [26, 56], [36, 52]].map(([x, y]) => `<path d="M${x} ${y - 5} Q${x - 2.4} ${y - 1} ${x} ${y} Q${x + 2.4} ${y - 1} ${x} ${y - 5}Z" fill="#8fd3ff" stroke="#4fa8ff" stroke-width="1.2" class="anim-bob"/>`).join('') },
  { n: 'Aboborinha', d: k => `<path d="M26 12 Q24 6 28 2" stroke="#3a6b2a" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M28 6 Q36 2 40 8 Q34 10 28 8Z" fill="#6bb04a" ${po(k, 1.6)}/>` +
    `<path d="M26 12 C12 10 2 20 3 32 C4 46 14 52 26 52 C38 52 48 46 49 32 C50 20 40 10 26 12Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M26 13 C18 18 17 44 26 51 M26 13 C34 18 35 44 26 51 M14 16 C7 24 8 42 16 48 M38 16 C45 24 44 42 36 48" stroke="${dark(k, -28)}" stroke-width="1.5" fill="none" opacity=".6"/>` +
    `<path d="M15 26 L21 24 L19 31Z M37 26 L31 24 L33 31Z" fill="${k.c[2]}"/><path d="M15 36 Q20 42 26 38 Q32 42 37 36 Q32 46 26 44 Q20 46 15 36Z" fill="${k.c[2]}"/>` +
    `<path d="M22 40 L24 43 L26 40 L28 43 L30 40" fill="${k.c[1]}"/>` },
  { n: 'Dino', d: k => `<path d="M34 42 Q52 42 56 30 Q50 34 42 34Z" fill="${k.c[0]}" ${po(k)}/>` +
    `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="${k.c[0]}" ${po(k)}/><path d="M18 38 Q26 34 34 38 Q34 50 26 51 Q18 50 18 38Z" fill="${k.c[1]}"/>` +
    `<path d="M30 8 L34 2 L36 9 L41 5 L41 13 L46 12 L43 19" fill="${k.c[1]}" ${po(k, 1.6)}/>` +
    `<path d="M24 8 C40 6 48 16 47 25 C46 34 38 38 26 38 C14 38 7 33 7 25 C7 16 12 9 24 8Z" fill="${k.c[0]}" ${po(k)}/>` +
    petEyes(k, 19, 33, 22) + petCheeks(13, 39, 29) + `<path d="M17 31 Q26 36 35 31" stroke="${k.c[2]}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<circle cx="11" cy="26" r="1" fill="${k.c[2]}"/><circle cx="14" cy="26" r="1" fill="${k.c[2]}"/>` + paws(k, [19, 33], 51) },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Hamster', d: k => `<path d="M10 52 Q4 30 26 26 Q48 30 42 52 Q26 56 10 52Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="46" rx="10" ry="7" fill="${light(k)}"/>` +
    `<circle cx="12" cy="16" r="6" fill="${k.c[0]}" ${po(k)}/><circle cx="40" cy="16" r="6" fill="${k.c[0]}" ${po(k)}/><circle cx="12" cy="16" r="3" fill="${k.c[1]}"/><circle cx="40" cy="16" r="3" fill="${k.c[1]}"/>` +
    `<path d="M26 12 C40 12 46 22 45 30 C44 38 36 42 26 42 C16 42 8 38 7 30 C6 22 12 12 26 12Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="14" cy="34" rx="7" ry="5" fill="${light(k)}"/><ellipse cx="38" cy="34" rx="7" ry="5" fill="${light(k)}"/>` +
    petEyes(k, 19, 33, 26, 2.8) + petCheeks(12, 40, 33) + `<path d="M24.8 31.4 L27.2 31.4 L26 33Z" fill="#ff8fa3"/>` + petMouth(k, 26, 34, 2.2) + paws(k, [20, 32], 44) },
  { n: 'Caracol', d: k => `<path d="M4 50 Q4 42 16 42 L44 42 Q52 42 50 50Z" fill="${k.c[1]}" ${po(k)}/><path d="M40 42 Q40 24 44 16 M46 42 Q48 26 52 18" stroke="${k.c[2]}" stroke-width="2.4" fill="none"/><circle cx="44" cy="15" r="2.6" fill="${k.c[2]}"/><circle cx="52" cy="17" r="2.6" fill="${k.c[2]}"/>` +
    `<circle cx="22" cy="28" r="18" fill="${k.c[0]}" ${po(k)}/><path d="M22 28 m-2 0 a2 2 0 1 1 4 0 a6 6 0 1 1 -10 -2 a10 10 0 1 1 18 4 a15 15 0 1 1 -24 -8" stroke="${dark(k, -30)}" stroke-width="2" fill="none"/>` +
    petEyes(k, 42, 48, 34, 2) + petMouth(k, 45, 39, 1.6) },
  { n: 'Panda', d: k => `<path d="M11 50 Q8 34 26 32 Q44 34 41 50 Q26 54 11 50Z" fill="#fff" ${po(k)}/><path d="M11 42 Q8 50 16 52 L20 40Z M41 42 Q44 50 36 52 L32 40Z" fill="${k.c[2]}"/>` +
    `<circle cx="11" cy="13" r="6.6" fill="${k.c[2]}"/><circle cx="41" cy="13" r="6.6" fill="${k.c[2]}"/>` +
    `<path d="M26 11 C40 11 45 19 44 27 C43 36 36 40 26 40 C16 40 9 36 8 27 C7 19 12 11 26 11Z" fill="#fff" ${po(k)}/>` +
    `<ellipse cx="18" cy="25" rx="6" ry="7" fill="${k.c[2]}" transform="rotate(-20 18 25)"/><ellipse cx="34" cy="25" rx="6" ry="7" fill="${k.c[2]}" transform="rotate(20 34 25)"/><circle cx="18" cy="25" r="2.4" fill="#fff"/><circle cx="34" cy="25" r="2.4" fill="#fff"/>` +
    `<ellipse cx="26" cy="31" rx="2.6" ry="1.8" fill="${k.c[2]}"/>` + petMouth(k, 26, 33.4, 2) + petCheeks(12, 40, 32) },
  { n: 'Pônei', d: k => `<path d="M10 52 Q10 34 26 32 Q42 32 44 44 L44 52 Q26 56 10 52Z" fill="${k.c[0]}" ${po(k)}/><path d="M14 48 L14 56 M22 50 L22 56 M34 50 L34 56 M40 48 L40 56" stroke="${k.c[2]}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M4 40 Q-4 50 4 56 Q6 48 12 44Z" fill="${k.c[1]}" ${po(k, 2)}/>` +
    `<path d="M30 36 Q28 10 40 8 Q54 10 52 26 Q50 34 42 34 Q36 40 30 36Z" fill="${k.c[0]}" ${po(k)}/><path d="M36 8 L34 0 L42 6Z" fill="${k.c[0]}" ${po(k, 2)}/>` +
    `<path d="M32 10 Q20 14 24 30 Q28 20 34 18 Q26 26 30 34 Q34 22 38 18Z" fill="${k.c[1]}" ${po(k, 2)}/>` + petEyes(k, 44, 44, 20, 2.6) + `<circle cx="50" cy="28" r="1.2" fill="${k.c[2]}"/>` },
  { n: 'Peixe no aquário', d: k => `<path d="M8 20 Q8 54 26 54 Q44 54 44 20Z" fill="#bff4ff" fill-opacity=".45" ${po(k)}/><path d="M6 18 L46 18" stroke="${k.c[2]}" stroke-width="2.4"/><path d="M10 40 Q26 36 42 40 Q42 54 26 54 Q10 54 10 40Z" fill="#8ad8ff" opacity=".5"/>` +
    `<g class="anim-bob"><ellipse cx="26" cy="36" rx="9" ry="6" fill="${k.c[0]}" ${po(k, 1.8)}/><path d="M17 36 L11 31 L11 41Z" fill="${k.c[1]}" ${po(k, 1.6)}/><circle cx="30" cy="35" r="1.8" fill="${k.c[2]}"/></g><path d="M16 50 Q14 44 18 40 M36 50 Q38 44 34 40" stroke="#3a9a48" stroke-width="2.4" fill="none"/><circle cx="30" cy="26" r="2" fill="none" stroke="#fff" stroke-width="1"/>` },
  { n: 'Fada', d: k => `<g class="anim-flap"><ellipse cx="12" cy="26" rx="10" ry="6" fill="${k.c[1]}" fill-opacity=".7" ${po(k, 1.6)} transform="rotate(-30 12 26)"/><ellipse cx="40" cy="26" rx="10" ry="6" fill="${k.c[1]}" fill-opacity=".7" ${po(k, 1.6)} transform="rotate(30 40 26)"/></g>` +
    `<path d="M18 50 L26 34 L34 50Z" fill="${k.c[0]}" ${po(k)}/><circle cx="26" cy="24" r="11" fill="#ffe8d8" ${po(k)}/><path d="M15 22 Q14 10 26 10 Q38 10 37 22 Q32 16 26 17 Q20 16 15 22Z" fill="${k.c[0]}" ${po(k, 2)}/>` +
    petEyes(k, 22, 30, 25, 2) + petCheeks(18, 34, 29, 2.4) + `<path d="${Shape.star(42, 12, 4, 1.4, 4)}" fill="#fff" class="anim-tw"/>` },
  { n: 'Cogumelo', d: k => `<path d="M16 54 L18 34 L34 34 L36 54 Q26 56 16 54Z" fill="#fff8e8" ${po(k)}/>` + petEyes(k, 21, 31, 44, 2.4) + petCheeks(17, 35, 49, 2.4) + petMouth(k, 26, 49, 1.6) +
    `<path d="M4 34 Q2 8 26 6 Q50 8 48 34 Q26 40 4 34Z" fill="${k.c[0]}" ${po(k)}/><circle cx="16" cy="20" r="5" fill="#fff"/><circle cx="32" cy="14" r="4" fill="#fff"/><circle cx="38" cy="26" r="3.4" fill="#fff"/><circle cx="22" cy="30" r="2.4" fill="#fff"/>` },
  { n: 'Polvo', d: k => [8, 16, 24, 32, 40].map(x => `<path d="M${x + 2} 34 Q${x - 4} 46 ${x + 2} 54" stroke="${k.c[2]}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x + 2} 34 Q${x - 4} 46 ${x + 2} 54" stroke="${k.c[0]}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('') +
    `<path d="M6 36 Q4 8 26 6 Q48 8 46 36 Q26 42 6 36Z" fill="${k.c[0]}" ${po(k)}/><circle cx="16" cy="14" r="3" fill="#fff" opacity=".6"/>` + petEyes(k, 19, 33, 26, 3) + petCheeks(13, 39, 32) + `<circle cx="26" cy="33" r="2" fill="${k.c[2]}"/>` },
  { n: 'Coruja', d: k => `<path d="M8 50 Q2 30 12 16 L8 4 L20 12 Q26 10 32 12 L44 4 L40 16 Q50 30 44 50 Q26 56 8 50Z" fill="${k.c[0]}" ${po(k)}/><ellipse cx="26" cy="40" rx="12" ry="11" fill="${light(k)}"/>` +
    [36, 42].map(y => `<path d="M18 ${y} q4 3 8 0 q4 3 8 0" stroke="${k.c[2]}" stroke-width="1.2" fill="none" opacity=".5"/>`).join('') +
    `<circle cx="18" cy="24" r="8" fill="#fff" ${po(k, 2)}/><circle cx="34" cy="24" r="8" fill="#fff" ${po(k, 2)}/>` + petEyes(k, 18, 34, 24, 3.4) + `<path d="M23 30 L29 30 L26 35Z" fill="#ffb52e" ${po(k, 1.4)}/>` },
  { n: 'Tartaruga', d: k => `<ellipse cx="26" cy="50" rx="22" ry="5" fill="${k.c[1]}" ${po(k, 2)}/>` + [[10, 50], [40, 50]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="4" fill="${k.c[1]}" ${po(k, 2)}/>`).join('') +
    `<path d="M40 40 Q52 34 50 26 Q44 22 40 30Z" fill="${k.c[1]}" ${po(k)}/>` + petEyes(k, 46, 46, 29, 1.8) +
    `<path d="M6 48 Q6 22 26 20 Q46 22 46 48Z" fill="${k.c[0]}" ${po(k)}/>` + [[26, 30], [16, 40], [36, 40]].map(([x, y]) => `<path d="M${x - 6} ${y} L${x - 3} ${y - 5} L${x + 3} ${y - 5} L${x + 6} ${y} L${x + 3} ${y + 5} L${x - 3} ${y + 5}Z" fill="${dark(k)}" ${po(k, 1.4)}/>`).join('') },
];
/* aplica a profundidade em todos os mascotes */
PARTS.pet.forEach(p => { if (!p) return; const d0 = p.d; p.d = k => petDepth(k, d0(k)); });
