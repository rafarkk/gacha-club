/* ============ PEÇAS: ROSTO ============
   Olhos em coordenadas locais (centro 0,0), desenhados para o olho esquerdo da tela;
   o direito é espelhado pelo rig. Olho: cores [branco, cílios, sombra].
   Um modelo de olho retorna { w: contorno do branco (clip da pupila), lash: svg, closed } */

const lashStroke = (k, w = 4) => `stroke="${k.c[1]}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
/* Cílio superior preenchido: fino no canto de dentro, grosso e com ponta no canto de fora */
const lashF = (k, d) => `<path d="${d}" fill="${k.c[1]}" stroke="${k.c[1]}" stroke-width="1.2" stroke-linejoin="round"/>`;

PARTS.eye = [null,
  { n: 'Normal', d: k => ({ w: 'M15 0 C15 -15 6 -19 -2 -19 C-11 -19 -16 -13 -16 -2 C-16 11 -9 18 -0 18 C9 18 15 11 15 0 Z', lash: lashF(k, 'M17 -2 C16 -18 5 -23 -3 -23 C-12 -23 -19 -17 -20 -7 L-24 -4 L-19 -2 C-17 -12 -11 -17 -3 -17 C5 -17 12 -13 15 0 Z') + `<path d="M-6 17 Q-12 15 -15 9" ${lashStroke(k, 1.6)}/>` }) },
  { n: 'Anime grande', d: k => ({ w: 'M17 0 C17 -17 7 -22 -2 -22 C-12 -22 -18 -15 -18 -2 C-18 13 -10 21 -0 21 C10 21 17 13 17 0 Z', lash: lashF(k, 'M19 -3 C18 -19 6 -24.5 -3 -24.5 C-13 -24.5 -21 -18 -22 -8 L-26 -5 L-20.5 -2.5 C-19 -15 -12 -21 -3 -21 C6 -21 14 -16 17 -1 Z') + `<path d="M-6 20 Q-13 18 -17 11" ${lashStroke(k, 1.8)}/>` }) },
  { n: 'Amendoado', d: k => ({ w: 'M19 2 C13 -14 -12 -18 -20 -4 C-13 11 9 15 19 2 Z', lash: lashF(k, 'M22 3 C14 -17 -12 -22 -23 -6 L-28 -7 L-23 0 C-13 -14 10 -13 18 3 Z') + `<path d="M8 12 Q-2 13 -12 7" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Sonolento', d: k => ({ w: 'M17 -1 C10 -4 -10 -4 -17 -2 C-14 15 13 16 17 -1 Z', lash: lashF(k, 'M20 0 C9 -6 -9 -6 -21 -4 L-25 -5 L-21 1 C-9 -2 9 -2 17 1 Z') + `<path d="M8 13 Q-0 15 -8 12" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Afiado', d: k => ({ w: 'M19 4 L12 -11 C-0 -16 -12 -12 -19 -2 C-10 11 8 13 19 4 Z', lash: lashF(k, 'M22 6 L14 -13 C-0 -20 -14 -15 -22 -4 L-27 -6 L-23 1 C-14 -10 -0 -13 12 -9 L18 4 Z') }) },
  { n: 'Redondo', d: k => ({ w: 'M-16 0 A16 17 0 1 1 16 0 A16 17 0 1 1 -16 0Z', lash: lashF(k, 'M18 -2 C15 -21 -15 -22 -18 -5 L-22 -6 L-19 0 C-15 -17 13 -17 16 -1 Z') + `<path d="M8 16 Q-0 18 -8 16" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Brilhante', d: k => ({ w: 'M17 0 C17 -17 7 -22 -2 -22 C-12 -22 -18 -15 -18 -2 C-18 13 -10 21 -0 21 C10 21 17 13 17 0 Z', lash: lashF(k, 'M19 -3 C18 -19 6 -24.5 -3 -24.5 C-13 -24.5 -21 -18 -22 -8 L-26 -5 L-20.5 -2.5 C-19 -15 -12 -21 -3 -21 C6 -21 14 -16 17 -1 Z') + `<path d="M-20 -12 L-26 -15 M-22 -7 L-28 -8" ${lashStroke(k, 2.2)}/><path d="M8 20 Q-4 24 -16 13" ${lashStroke(k, 1.8)}/>` }) },
  { n: 'De lado (tédio)', d: k => ({ w: 'M17 -3 C8 -5 -8 -5 -17 -3 C-15 16 15 16 17 -3 Z', lash: lashF(k, 'M20 -3 L-21 -6 L-21 -1 L19 1 Z') + `<path d="M10 12 Q-0 15 -10 12" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Fechado feliz', d: k => ({ closed: true, lash: lashF(k, 'M17 6 Q-0 -16 -17 6 L-15 7 Q-0 -10 15 7 Z') }) },
  { n: 'Fechado', d: k => ({ closed: true, lash: lashF(k, 'M17 0 Q-0 13 -17 0 L-20 -2 L-17 3 Q-0 16 16 3 Z') }) },
  { n: '> <', d: k => ({ closed: true, lash: `<path d="M12 -10 L-10 0 L12 10" ${lashStroke(k, 4.5)}/>` }) },
  { n: 'Chorando', d: k => ({ closed: true, lash: lashF(k, 'M17 0 Q-0 11 -17 0 L-17 3 Q-0 14 16 3 Z') + `<path d="M-6 10 C-3 20 -0 26 -4 32 C-8 36 -13 29 -10 22 C-9 18 -8 13 -6 10 Z" fill="#9fdcff" stroke="#4fa8ff" stroke-width="1.5"/><ellipse cx="6" cy="27" rx="1.5" ry="3" fill="#fff" opacity=".8"/>` }) },
  { n: 'Piscadinha', d: k => ({ closed: true, lash: `<path d="M15 -6 L-12 2 L12 10" ${lashStroke(k, 4)}/>` }) },
  { n: 'Arregalado', d: k => ({ w: 'M-17 0 A17 19 0 1 1 17 0 A17 19 0 1 1 -17 0Z', lash: lashF(k, 'M19 -6 C13 -23 -13 -23 -19 -6 L-19 -3 C-13 -19 13 -19 18 -3 Z') }) },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Olhão brilhante', d: k => ({ w: 'M17 0 C17 -18 8 -24 -1 -24 C-11 -24 -18 -17 -18 -2 C-18 14 -10 22 0 22 C10 22 17 14 17 0 Z', lash: lashF(k, 'M20 -4 C19 -22 6 -28 -2 -28 C-14 -28 -22 -20 -23 -8 L-28 -6 L-22 -2 C-20 -16 -12 -23 -2 -23 C8 -23 15 -17 18 -2 Z') + `<path d="M-22 -14 L-28 -18 M-19 -20 L-24 -26" ${lashStroke(k, 2.2)}/>` }) },
  { n: 'Cílios de baixo', d: k => ({ w: 'M15 0 C15 -15 6 -19 -2 -19 C-11 -19 -16 -13 -16 -2 C-16 11 -9 18 0 18 C9 18 15 11 15 0 Z', lash: lashF(k, 'M17 -2 C16 -18 5 -23 -3 -23 C-12 -23 -19 -17 -20 -7 L-24 -4 L-19 -2 C-17 -12 -11 -17 -3 -17 C5 -17 12 -13 15 0 Z') + `<path d="M-12 16 L-15 21 M-6 18 L-7 23 M0 19 L0 24" ${lashStroke(k, 1.6)}/>` }) },
  { n: 'Gatinho', d: k => ({ w: 'M18 4 C12 -12 -8 -16 -20 -6 C-12 10 10 14 18 4 Z', lash: lashF(k, 'M21 6 C13 -16 -10 -20 -24 -8 L-29 -10 L-24 -3 C-10 -14 12 -12 18 6 Z') }) },
  { n: 'Olhar fofo', d: k => ({ w: 'M16 2 C16 -14 7 -18 0 -18 C-8 -18 -16 -12 -16 2 C-16 14 -8 19 0 19 C8 19 16 14 16 2 Z', lash: lashF(k, 'M18 -1 C16 -17 6 -21 0 -21 C-9 -21 -18 -15 -19 -2 L-17 0 C-15 -13 -8 -17 0 -17 C7 -17 14 -13 16 1 Z') }) },
  { n: 'Meio fechado', d: k => ({ w: 'M17 -2 C8 -6 -8 -6 -17 -2 C-15 14 -8 19 0 19 C8 19 15 14 17 -2 Z', lash: lashF(k, 'M20 -4 C8 -9 -8 -9 -20 -4 L-24 -6 L-19 0 C-8 -4 8 -4 18 0 Z') + `<path d="M-6 16 Q0 18 6 16" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Estrelado', d: k => ({ w: 'M17 0 C17 -18 8 -23 -1 -23 C-11 -23 -18 -16 -18 -2 C-18 14 -10 21 0 21 C10 21 17 14 17 0 Z', lash: lashF(k, 'M20 -3 C19 -21 6 -27 -2 -27 C-14 -27 -22 -19 -23 -7 L-27 -4 L-21 -2 C-19 -15 -11 -21 -2 -21 C8 -21 15 -16 18 -1 Z') + `<path d="${Shape.star(-22, -18, 4, 1.4, 4)}" fill="#fff"/>` }) },
  { n: 'Assustado', d: k => ({ w: 'M15 0 A15 18 0 1 0 -15 0 A15 18 0 1 0 15 0 Z', lash: `<path d="M17 -6 C12 -22 -12 -22 -17 -6" ${lashStroke(k, 2.4)}/><path d="M-8 22 L-10 26 M0 23 L0 27 M8 22 L10 26" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Zangado', d: k => ({ w: 'M18 -6 C8 -12 -10 -6 -18 2 C-12 14 10 16 18 6 Z', lash: lashF(k, 'M22 -8 C10 -16 -12 -10 -22 2 L-26 0 L-20 6 C-10 -4 10 -10 20 -4 Z') }) },
  { n: 'Sorrindo com olhos', d: k => ({ closed: true, lash: lashF(k, 'M-17 4 Q0 -14 17 4 L15 6 Q0 -8 -15 6Z') + `<path d="M-15 6 Q0 -6 15 6" stroke="${k.c[1]}" stroke-width="1" fill="none"/>` }) },
  { n: 'Espiral tonto', d: k => ({ closed: true, lash: `<path d="M0 2 m-1 0 a1.5 1.5 0 1 1 3 0 a4 4 0 1 1 -7 -1 a7 7 0 1 1 12 2 a11 11 0 1 1 -19 -3" stroke="${k.c[1]}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` }) },
  /* ---- rodada 2 ---- */
  { n: 'Olho redondo grande', d: k => ({ w: 'M17 2 A17 20 0 1 0 -17 2 A17 20 0 1 0 17 2 Z', lash: lashF(k, 'M19 -4 C16 -24 -16 -24 -19 -4 L-22 -2 L-17 -2 C-14 -18 14 -18 17 -2 Z') }) },
  { n: 'Olhos de lado', d: k => ({ w: 'M16 0 C16 -15 7 -19 -1 -19 C-10 -19 -16 -13 -16 -2 C-16 11 -9 18 0 18 C9 18 16 11 16 0 Z', lash: lashF(k, 'M18 -2 C17 -18 6 -23 -2 -23 C-12 -23 -19 -17 -20 -7 L-24 -4 L-19 -2 C-17 -12 -11 -17 -2 -17 C5 -17 12 -13 16 0 Z') }) },
  { n: 'Olho de tsundere', d: k => ({ w: 'M18 -4 C10 -12 -10 -8 -18 0 C-14 14 10 16 18 4 Z', lash: lashF(k, 'M21 -6 C10 -16 -12 -12 -22 0 L-26 -2 L-20 4 C-10 -6 10 -10 19 -2 Z') + `<path d="M-6 16 Q2 18 10 14" ${lashStroke(k, 1.4)}/>` }) },
  { n: 'Olho com rímel', d: k => ({ w: 'M16 0 C16 -15 7 -19 -1 -19 C-10 -19 -16 -13 -16 -2 C-16 11 -9 18 0 18 C9 18 16 11 16 0 Z', lash: lashF(k, 'M19 -2 C17 -20 5 -25 -3 -25 C-14 -25 -21 -18 -22 -7 L-28 -8 L-22 -2 L-26 2 L-19 -1 C-17 -13 -11 -19 -3 -19 C5 -19 13 -14 17 0 Z') }) },
  { n: 'Sonolento triste', d: k => ({ w: 'M16 -2 C8 -8 -8 -4 -16 2 C-14 14 12 16 16 -2 Z', lash: lashF(k, 'M19 -4 C8 -10 -8 -6 -19 2 L-19 5 C-8 -1 8 -5 17 0 Z') }) },
  { n: 'Olho de brilho estrela', d: k => ({ w: 'M17 0 C17 -18 8 -23 -1 -23 C-11 -23 -18 -16 -18 -2 C-18 14 -10 21 0 21 C10 21 17 14 17 0 Z', lash: lashF(k, 'M20 -3 C19 -21 6 -27 -2 -27 C-14 -27 -22 -19 -23 -7 L-27 -4 L-21 -2 C-19 -15 -11 -21 -2 -21 C8 -21 15 -16 18 -1 Z') + `<path d="${Shape.star(10, 12, 3.4, 1.2, 4)}" fill="#fff"/>` }) },
  { n: 'Coraçãozinho fechado', d: k => ({ closed: true, lash: `<path d="${Shape.heart(0, 0, 10)}" fill="${k.c[1]}"/>` }) },
  { n: 'Linha reta', d: k => ({ closed: true, lash: lashF(k, 'M-17 0 L17 -1 L17 2 L-17 3Z') }) },
  { n: 'Chorando muito', d: k => ({ closed: true, lash: lashF(k, 'M-17 4 Q0 -8 17 4 L15 6 Q0 -4 -15 6Z') + `<path d="M-10 8 Q-12 26 -6 40 M8 8 Q10 26 4 40" stroke="#8fd3ff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>` }) },
  { n: 'X', d: k => ({ closed: true, lash: `<path d="M-10 -10 L10 10 M10 -10 L-10 10" ${lashStroke(k, 4)}/>` }) },
];

/* Pupila / íris — cores [íris, degradê da íris, pupila]. Desenhada dentro do branco do olho.
   Íris com anel escuro, sombra da pálpebra no topo, reflexo claro embaixo e brilhos brancos. */
const iris = (k, rx = 14.5, ry = 18, cy = 2) =>
  `<ellipse cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="${k.F}"/>` +
  `<path d="M${-rx + 3} ${cy + ry * .3} Q0 ${cy + ry + 1} ${rx - 3} ${cy + ry * .3} Q0 ${cy + ry * .75} ${-rx + 3} ${cy + ry * .3}Z" fill="${Color.mix(k.c[1], '#ffffff', .5)}" opacity=".85"/>` +
  `<path d="M-20 -30 H20 V${cy - ry * .45} Q0 ${cy - ry * .2} -20 ${cy - ry * .45}Z" fill="#12061f" opacity=".22"/>` +
  `<ellipse cx="0" cy="${cy}" rx="${rx - .7}" ry="${ry - .7}" fill="none" stroke="${Color.shade(k.c[0], -50)}" stroke-width="1.5"/>`;
const shine = (s = 1) => `<ellipse cx="-4.5" cy="-5" rx="${4.8 * s}" ry="${5.8 * s}" fill="#fff"/><circle cx="5" cy="9" r="${2.3 * s}" fill="#fff" opacity=".92"/>`;
const pupilDot = (k, rx = 6, ry = 8.5, cy = 3) => `<ellipse cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="${k.c[2]}"/>`;

PARTS.pupil = [null,
  { n: 'Normal', d: k => iris(k) + pupilDot(k) + shine() },
  { n: 'Brilho grande', d: k => iris(k, 13, 16.5) + pupilDot(k, 6, 8, 4) + shine(1.2) + `<path d="${Shape.star(6, -6, 3, 1, 4)}" fill="#fff"/>` },
  { n: 'Estrela', d: k => iris(k) + `<path d="${Shape.star(0, 3, 8, 3.4)}" fill="${k.c[2]}"/>` + shine(.8) },
  { n: 'Coração', d: k => iris(k) + `<path d="${Shape.heart(0, 3, 6.5)}" fill="${k.c[2]}"/>` + shine(.8) },
  { n: 'Fenda', d: k => iris(k) + `<ellipse cx="0" cy="2" rx="2.2" ry="12" fill="${k.c[2]}"/>` + shine(.7) },
  { n: 'Anel', d: k => iris(k) + `<circle cx="0" cy="3" r="6" fill="none" stroke="${k.c[2]}" stroke-width="2.5"/>` + shine(.8) },
  { n: 'Espiral', d: k => `<path d="M0 3 m-1 0 a1 1 0 1 1 2 0 a3 3 0 1 1 -5 -1 a5 5 0 1 1 9 2 a8 8 0 1 1 -14 -3 a11 11 0 1 1 20 3" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
  { n: 'Vazio', d: k => `<ellipse cx="0" cy="2" rx="12" ry="15" fill="${Color.mix(k.c[0], '#ffffff', .55)}"/><ellipse cx="0" cy="2" rx="11.3" ry="14.3" fill="none" stroke="${Color.shade(k.c[0], -20)}" stroke-width="1.2"/>` },
  { n: 'Cruz', d: k => iris(k) + `<path d="M-6 3 L6 3 M0 -3 L0 9" stroke="${k.c[2]}" stroke-width="3" stroke-linecap="round"/>` + shine(.7) },
  { n: 'Losango', d: k => iris(k) + `<path d="M0 -6 L6 3 L0 12 L-6 3Z" fill="${k.c[2]}"/>` + shine(.7) },
  { n: 'Pequena', d: k => `<circle cx="0" cy="3" r="6.5" fill="${k.F}"/><circle cx="0" cy="3" r="2.8" fill="${k.c[2]}"/><circle cx="-2" cy="1" r="1.6" fill="#fff"/>` },
  { n: 'Brilho duplo', d: k => iris(k) + pupilDot(k, 5.5, 7.5, 4) + `<path d="M-9 -8 Q-2 -12 4 -8 Q-2 -5 -9 -8Z" fill="#fff"/><path d="M-6 12 Q2 16 8 10 Q2 12 -6 12Z" fill="#fff"/>` + shine(.7) },
  { n: 'Olho de gato brilhante', d: k => iris(k) + `<ellipse cx="0" cy="2" rx="3.5" ry="11" fill="${k.c[2]}"/><path d="${Shape.star(-5, -5, 4.5, 1.2, 4)}" fill="#fff"/><circle cx="5" cy="9" r="2" fill="#fff"/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Lua', d: k => iris(k) + `<path d="M4 -4 A8 8 0 1 0 4 10 A6 6 0 1 1 4 -4Z" fill="${k.c[2]}"/>` + shine(.7) },
  { n: 'Olho de cobra', d: k => iris(k) + `<path d="M0 -12 Q4 3 0 17 Q-4 3 0 -12Z" fill="${k.c[2]}"/>` + shine(.6) },
  { n: 'Hexágono', d: k => iris(k) + `<path d="M0 -5 L7 -1 L7 7 L0 11 L-7 7 L-7 -1Z" fill="${k.c[2]}"/>` + shine(.7) },
  { n: 'Alvo', d: k => iris(k) + `<circle cx="0" cy="3" r="9" fill="none" stroke="${k.c[2]}" stroke-width="2"/><circle cx="0" cy="3" r="4" fill="${k.c[2]}"/>` + shine(.6) },
  { n: 'Coração pequeno brilhante', d: k => iris(k) + pupilDot(k, 4, 5.5, 4) + `<path d="${Shape.heart(-5, -6, 3.4)}" fill="#fff"/><circle cx="5" cy="9" r="2" fill="#fff"/>` },
  { n: 'Quatro brilhos', d: k => iris(k) + pupilDot(k) + [[-5, -6, 3.4], [5, -5, 2], [-6, 8, 1.6], [5, 9, 2.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') },
  { n: 'Olho vazio escuro', d: k => `<ellipse cx="0" cy="2" rx="13" ry="16" fill="${k.c[2]}"/><ellipse cx="0" cy="2" rx="13" ry="16" fill="${k.c[0]}" opacity=".35"/>` },
  { n: 'Diamante brilhante', d: k => iris(k) + `<path d="M0 -8 L7 3 L0 14 L-7 3Z" fill="${k.c[2]}"/><path d="M0 -8 L3 3 L0 14Z" fill="#fff" opacity=".35"/>` + shine(.6) },
  { n: 'Zigue-zague', d: k => iris(k) + `<path d="M-7 -2 L-3 4 L0 -2 L3 4 L7 -2" stroke="${k.c[2]}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + shine(.6) },
  { n: 'Flor', d: k => iris(k) + [0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 4).toFixed(1)}" cy="${(3 + Math.sin(a * Math.PI / 180) * 4).toFixed(1)}" r="3" fill="${k.c[2]}"/>`).join('') + `<circle cx="0" cy="3" r="2" fill="${k.c[1]}"/>` + shine(.6) },
  /* ---- rodada 2 ---- */
  { n: 'Grande sem brilho', d: k => iris(k) + pupilDot(k, 7, 9, 3) },
  { n: 'Anel duplo', d: k => iris(k) + [9, 5].map(r => `<circle cx="0" cy="3" r="${r}" fill="none" stroke="${k.c[2]}" stroke-width="1.6"/>`).join('') + shine(.6) },
  { n: 'Estrela de quatro pontas', d: k => iris(k) + `<path d="${Shape.star(0, 3, 9, 2.6, 4)}" fill="${k.c[2]}"/>` + shine(.6) },
  { n: 'Pupila de coelho', d: k => iris(k) + pupilDot(k, 5, 6, 5) + `<ellipse cx="-4" cy="-2" rx="2" ry="4" fill="#fff"/><ellipse cx="3" cy="-2" rx="2" ry="4" fill="#fff"/>` },
  { n: 'Chama', d: k => iris(k) + `<path d="M0 12 Q-8 4 -2 -4 Q-2 2 2 0 Q2 -8 6 -10 Q10 4 0 12Z" fill="${k.c[2]}"/>` + shine(.5) },
  { n: 'Espiral colorida', d: k => iris(k) + `<path d="M0 3 m-1 0 a1 1 0 1 1 2 0 a3 3 0 1 1 -5 -1 a5 5 0 1 1 9 2 a8 8 0 1 1 -14 -3" stroke="${k.c[2]}" stroke-width="1.8" fill="none"/>` },
  { n: 'Pupila fina', d: k => iris(k) + pupilDot(k, 2.4, 6, 3) + shine(.8) },
  { n: 'Brilho em arco', d: k => iris(k) + pupilDot(k) + `<path d="M-9 -6 Q0 -12 9 -6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="4" cy="10" r="1.8" fill="#fff"/>` },
  { n: 'Olho de robô', d: k => `<rect x="-11" y="-11" width="22" height="26" rx="4" fill="${k.F}"/><path d="M-6 3 L6 3" stroke="${k.c[2]}" stroke-width="3"/><circle cx="-5" cy="-5" r="2" fill="#fff"/>` },
  { n: 'Pétala', d: k => iris(k) + [0, 90, 180, 270].map(a => `<ellipse cx="${(Math.cos(a * Math.PI / 180) * 4).toFixed(1)}" cy="${(3 + Math.sin(a * Math.PI / 180) * 4).toFixed(1)}" rx="3.4" ry="2" fill="${k.c[2]}" transform="rotate(${a} ${(Math.cos(a * Math.PI / 180) * 4).toFixed(1)} ${(3 + Math.sin(a * Math.PI / 180) * 4).toFixed(1)})"/>`).join('') + shine(.6) },
];

/* Sobrancelhas (esquerda local, centro 0,0) — cores [cor]. Traço fino que afina nas pontas. */
const browF = (k, d) => `<path d="${d}" fill="${k.c[0]}" stroke="${k.c[0]}" stroke-width=".8" stroke-linejoin="round"/>`;
PARTS.brow = [null,
  { n: 'Normal', d: k => browF(k, 'M-14 3 Q-2 -7 14 -1 Q0 -3.5 -14 3Z') },
  { n: 'Fina', d: k => browF(k, 'M-14 2 Q-2 -5 14 -1 Q0 -3 -14 2Z') },
  { n: 'Grossa', d: k => browF(k, 'M-15 4 Q0 -9 15 -1 L14 4 Q0 -3 -15 8Z') },
  { n: 'Brava', d: k => browF(k, 'M-14 -7 L14 2 L13 6 Q0 1 -14 -5Z') },
  { n: 'Preocupada', d: k => browF(k, 'M-14 4 Q0 1 14 -8 Q2 -2 -14 1Z') },
  { n: 'Arqueada', d: k => browF(k, 'M-14 5 Q-2 -12 14 -2 Q-2 -8 -14 5Z') },
  { n: 'Curta', d: k => browF(k, 'M-6 1 Q0 -3 7 -1 Q0 1 -6 1Z') },
  { n: 'Pontinhos', d: k => `<circle cx="-4" cy="0" r="3" fill="${k.c[0]}"/><circle cx="5" cy="-1" r="3" fill="${k.c[0]}"/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Grossa arredondada', d: k => browF(k, 'M-15 5 Q-4 -9 15 -2 Q16 3 12 3 Q0 -2 -13 7Z') },
  { n: 'Grossa brava', d: k => browF(k, 'M-15 -8 L15 1 L14 7 L-15 -3Z') },
  { n: 'Fina alta', d: k => browF(k, 'M-14 -2 Q-2 -10 14 -5 Q0 -7 -14 -2Z') },
  { n: 'Desenhada', d: k => browF(k, 'M-15 2 Q-8 -8 6 -6 Q12 -5 15 -1 Q10 -3 4 -3 Q-6 -4 -15 2Z') },
  { n: 'Arqueada fina', d: k => browF(k, 'M-14 4 Q-4 -14 14 -2 Q-2 -10 -14 4Z') },
  { n: 'Reta', d: k => browF(k, 'M-14 -1 L14 -3 L14 0 L-14 2Z') },
  { n: 'Onda', d: k => `<path d="M-14 2 Q-7 -6 0 0 Q7 6 14 -4" stroke="${k.c[0]}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  { n: 'Triste grossa', d: k => browF(k, 'M-15 4 Q0 2 15 -9 L15 -5 Q0 6 -15 8Z') },
  { n: 'Com falha', d: k => browF(k, 'M-14 3 Q-6 -4 -1 -3 L-2 1 Q-8 0 -14 3Z') + browF(k, 'M3 -3 Q9 -4 14 -1 Q9 -1 3 1Z') },
  { n: 'Pontuda', d: k => browF(k, 'M-15 4 Q-6 -2 4 -4 L15 -10 L10 -1 Q-2 -1 -15 4Z') },
  /* ---- rodada 2 ---- */
  { n: 'Pontinho duplo', d: k => `<ellipse cx="-4" cy="0" rx="3.4" ry="2.4" fill="${k.c[0]}"/><ellipse cx="4" cy="-1" rx="3.4" ry="2.4" fill="${k.c[0]}"/>` },
  { n: 'Grossa reta', d: k => browF(k, 'M-15 -2 L15 -4 L15 2 L-15 4Z') },
  { n: 'Fina curvada para baixo', d: k => browF(k, 'M-14 -4 Q0 4 14 -4 Q0 2 -14 -4Z') },
  { n: 'Surpresa alta', d: k => browF(k, 'M-14 -2 Q0 -14 14 -4 Q0 -10 -14 -2Z') },
  { n: 'Grossa com ponta', d: k => browF(k, 'M-15 6 Q-4 -8 12 -4 L16 -8 L14 0 Q0 -2 -13 8Z') },
  { n: 'Tracinho', d: k => browF(k, 'M-6 0 L6 -1 L6 1.6 L-6 2.4Z') },
  { n: 'Levantada de um lado', d: k => browF(k, 'M-14 3 Q-2 -2 14 -10 Q0 -3 -14 5Z') },
  { n: 'Grossa desfiada', d: k => browF(k, 'M-15 4 Q-2 -8 15 -2 L14 2 Q0 -2 -14 8Z') + `<path d="M-8 2 L-6 -2 M0 0 L2 -4 M8 0 L10 -3" stroke="${k.c[0]}" stroke-width="1.4"/>` },
  { n: 'Arco suave', d: k => browF(k, 'M-14 3 Q0 -6 14 3 Q0 -3 -14 3Z') },
  { n: 'Brava fina', d: k => browF(k, 'M-14 -5 L14 3 L14 5 L-14 -3Z') },
];

/* Nariz (centro 150,168) — cores [cor] */
PARTS.nose = [null,
  { n: 'Ponto', d: k => `<circle cx="150" cy="168" r="1.8" fill="${k.c[0]}"/>` },
  { n: 'Traço', d: k => `<path d="M151 163 L148 171" stroke="${k.c[0]}" stroke-width="2" stroke-linecap="round"/>` },
  { n: 'Triângulo', d: k => `<path d="M150 164 L153 170 L147 170Z" fill="${k.c[0]}"/>` },
  { n: 'Anime', d: k => `<path d="M153 160 L148 171 L153 171" stroke="${k.c[0]}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  { n: 'Focinho', d: k => `<ellipse cx="150" cy="168" rx="4" ry="3" fill="${k.c[0]}"/>` },
  { n: 'Band-aid', d: k => `<g transform="rotate(-8 150 167)"><rect x="138" y="162.5" width="24" height="9" rx="4.5" fill="#f4cfa4" stroke="#b98a5c" stroke-width="1.4"/><rect x="146" y="163.5" width="8" height="7" rx="1.5" fill="#fbe6c8"/>${[[141.5, 165.5], [141.5, 168.5], [158.5, 165.5], [158.5, 168.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#b98a5c"/>`).join('')}</g>` },
  { n: 'Curativo cruzado', d: k => [-30, 30].map(a => `<rect x="141" y="164" width="18" height="7" rx="3" fill="#f4cfa4" stroke="#b98a5c" stroke-width="1.3" transform="rotate(${a} 150 167.5)"/>`).join('') },
  { n: 'Sombra fina', d: k => `<path d="M153.5 160 Q156 166 152 170.5" stroke="${k.c[0]}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>` },
  { n: 'Linha fina', d: k => `<path d="M152 161 L148.5 169.5 L152.5 169.5" stroke="${k.c[0]}" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  { n: 'Corado', d: k => `<ellipse cx="150" cy="167" rx="7" ry="3.2" fill="#ff8fa3" opacity=".45"/><circle cx="150" cy="167.5" r="1.6" fill="${k.c[0]}"/>` },
];

/* Boca (centro 150,184) — cores [interior, língua, contorno] */
PARTS.mouth = [null,
  { n: 'Sorriso', d: k => `<path d="M140 182 Q150 191 160 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
  { n: 'Aberta feliz', d: k => `<path d="M138 180 Q150 200 162 180Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><path d="M143 189 Q150 185 157 189 Q150 196 143 189Z" fill="${k.c[1]}"/>` },
  { n: ':3', d: k => `<path d="M138 181 Q144 188 150 181 Q156 188 162 181" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
  { n: 'Reta', d: k => `<path d="M143 185 L157 185" stroke="${k.c[2]}" stroke-width="2.6" stroke-linecap="round"/>` },
  { n: 'O', d: k => `<ellipse cx="150" cy="186" rx="5" ry="6.5" fill="${k.c[0]}" ${ol(k, 2.2)}/>` },
  { n: 'Triste', d: k => `<path d="M140 189 Q150 180 160 189" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
  { n: 'Língua', d: k => `<path d="M140 182 Q150 190 160 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M151 186 Q151 195 156 195 Q161 195 160 185Z" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Presinha', d: k => `<path d="M140 182 Q150 190 160 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M154 186 L156 192 L158 185Z" fill="#fff" ${ol(k, 1.2)}/>` },
  { n: 'Grito', d: k => `<ellipse cx="150" cy="188" rx="9" ry="11" fill="${k.c[0]}" ${ol(k, 2.4)}/><ellipse cx="150" cy="194" rx="5" ry="3.5" fill="${k.c[1]}"/>` },
  { n: 'Nervosa', d: k => `<path d="M138 186 q3 -5 6 0 t6 0 t6 0 t6 0" stroke="${k.c[2]}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  { n: 'Sorriso de lado', d: k => `<path d="M140 187 Q153 189 162 178" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
  { n: 'D', d: k => `<path d="M138 178 L162 178 Q162 198 150 198 Q138 198 138 178Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><path d="M139 179 L161 179 L160 184 L140 184Z" fill="#fff"/><path d="M143 192 Q150 188 157 192 Q150 197 143 192Z" fill="${k.c[1]}"/>` },
  { n: 'Beijinho', d: k => `<path d="M147 180 Q154 182 149 185 Q155 188 147 190" stroke="${k.c[2]}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  { n: 'Dentes', d: k => `<rect x="139" y="180" width="22" height="10" rx="4" fill="#fff" ${ol(k, 2.2)}/><path d="M139 185 L161 185 M146 180 L146 190 M154 180 L154 190" stroke="${k.c[2]}" stroke-width="1.2"/>` },
  { n: 'Gatinho aberto', d: k => `<path d="M138 181 Q144 188 150 181 Q156 188 162 181 Q156 196 150 194 Q144 196 138 181Z" fill="${k.c[0]}" ${ol(k, 2.2)}/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Sorriso aberto', d: k => `<path d="M138 180 L162 180 Q160 196 150 196 Q140 196 138 180Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><path d="M143 190 Q150 186 157 190 Q150 195 143 190Z" fill="${k.c[1]}"/>` },
  { n: 'Presas', d: k => `<path d="M140 182 Q150 190 160 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M142 184 L144 190 L146 185Z M154 185 L156 190 L158 184Z" fill="#fff" ${ol(k, 1.2)}/>` },
  { n: 'Onda nervosa', d: k => `<path d="M138 185 q3 -4 6 0 t6 0 t6 0 t6 0" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
  { n: 'Beicinho', d: k => `<path d="M144 186 Q150 182 156 186 Q150 190 144 186Z" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Surpresa pequena', d: k => `<ellipse cx="150" cy="186" rx="3.4" ry="4.4" fill="${k.c[0]}" ${ol(k, 2)}/>` },
  { n: 'Gritando', d: k => `<path d="M136 180 Q150 176 164 180 Q166 200 150 204 Q134 200 136 180Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><path d="M138 181 L162 181 L161 186 L139 186Z" fill="#fff"/><path d="M142 197 Q150 192 158 197 Q150 202 142 197Z" fill="${k.c[1]}"/>` },
  { n: 'Sorriso de gato fechado', d: k => `<path d="M138 182 Q144 188 150 182 Q156 188 162 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M146 186 L147 190 L149 186Z" fill="#fff" ${ol(k, 1)}/>` },
  { n: 'Sorrisinho de lado', d: k => `<path d="M142 186 Q152 188 160 180" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M160 180 L162 178" stroke="${k.c[2]}" stroke-width="2" stroke-linecap="round"/>` },
  { n: 'Batom', d: k => `<path d="M140 184 Q145 180 150 183 Q155 180 160 184 Q155 190 150 190 Q145 190 140 184Z" fill="${k.c[1]}" ${ol(k, 1.6)}/><path d="M142 184 Q150 186 158 184" stroke="${k.c[2]}" stroke-width="1" fill="none"/>` },
  { n: 'Dentes cerrados', d: k => `<path d="M138 181 L162 181 Q162 191 150 191 Q138 191 138 181Z" fill="#fff" ${ol(k, 2.2)}/><path d="M138 186 L162 186 M144 181 L144 190 M150 181 L150 191 M156 181 L156 190" stroke="${k.c[2]}" stroke-width="1.2"/>` },
  /* ---- rodada 2 ---- */
  { n: 'Sorriso largo', d: k => `<path d="M134 180 Q150 196 166 180" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
  { n: 'Boca de pato', d: k => `<path d="M140 184 Q150 176 160 184 Q150 192 140 184Z" fill="#ffb52e" ${ol(k, 2)}/>` },
  { n: 'Língua de lado', d: k => `<path d="M140 182 Q150 188 160 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M154 185 Q156 194 162 192 Q164 186 158 184Z" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Triângulo aberto', d: k => `<path d="M142 180 L158 180 L150 192Z" fill="${k.c[0]}" ${ol(k, 2.2)}/><path d="M146 186 L154 186 L150 191Z" fill="${k.c[1]}"/>` },
  { n: 'Assobiando', d: k => `<circle cx="150" cy="186" r="3.4" fill="${k.c[0]}" ${ol(k, 2)}/><path d="M162 176 q4 -4 8 0" stroke="${k.c[2]}" stroke-width="1.6" fill="none"/>` },
  { n: 'Sorriso com dente', d: k => `<path d="M140 182 Q150 190 160 182" stroke="${k.c[2]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="146" y="184" width="5" height="4" fill="#fff" ${ol(k, 1)}/>` },
  { n: 'Boca de W', d: k => `<path d="M138 182 L144 188 L150 182 L156 188 L162 182" stroke="${k.c[2]}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  { n: 'Choro aberto', d: k => `<path d="M138 190 Q150 174 162 190 Q150 196 138 190Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><path d="M144 190 Q150 186 156 190 Q150 194 144 190Z" fill="${k.c[1]}"/>` },
  { n: 'Grande risada', d: k => `<path d="M134 178 L166 178 Q166 202 150 202 Q134 202 134 178Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><path d="M135 179 L165 179 L164 185 L136 185Z" fill="#fff"/><path d="M140 196 Q150 190 160 196 Q150 202 140 196Z" fill="${k.c[1]}"/>` },
  { n: 'Boquinha pequena', d: k => `<path d="M146 184 Q150 187 154 184" stroke="${k.c[2]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` },
];

/* Blush (bochechas em 106,166 e 194,166) — cores [cor] */
PARTS.blush = [null,
  { n: 'Suave', d: k => `<defs><radialGradient id="${k.u}bg"><stop offset="0" stop-color="${k.c[0]}" stop-opacity=".8"/><stop offset=".6" stop-color="${k.c[0]}" stop-opacity=".45"/><stop offset="1" stop-color="${k.c[0]}" stop-opacity="0"/></radialGradient></defs><ellipse cx="104" cy="166" rx="19" ry="10" fill="url(#${k.u}bg)"/><ellipse cx="196" cy="166" rx="19" ry="10" fill="url(#${k.u}bg)"/>` },
  { n: 'Linhas', d: k => [96, 186].map(x => `<path d="M${x} 170 l5 -8 M${x + 7} 170 l5 -8 M${x + 14} 170 l5 -8" stroke="${k.c[0]}" stroke-width="2" stroke-linecap="round"/>`).join('') },
  { n: 'Forte', d: k => `<defs><radialGradient id="${k.u}bg"><stop offset="0" stop-color="${k.c[0]}" stop-opacity=".8"/><stop offset=".6" stop-color="${k.c[0]}" stop-opacity=".45"/><stop offset="1" stop-color="${k.c[0]}" stop-opacity="0"/></radialGradient></defs><ellipse cx="104" cy="166" rx="21" ry="11" fill="url(#${k.u}bg)"/><ellipse cx="196" cy="166" rx="21" ry="11" fill="url(#${k.u}bg)"/><ellipse cx="104" cy="166" rx="14" ry="7" fill="url(#${k.u}bg)"/><ellipse cx="196" cy="166" rx="14" ry="7" fill="url(#${k.u}bg)"/>` + [96, 186].map(x => `<path d="M${x} 170 l5 -8 M${x + 7} 170 l5 -8 M${x + 14} 170 l5 -8" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>`).join('') },
  { n: 'Corações', d: k => `<path d="${Shape.heart(104, 166, 5)}" fill="${k.c[0]}"/><path d="${Shape.heart(196, 166, 5)}" fill="${k.c[0]}"/>` },
  { n: 'Brilho', d: k => `<defs><radialGradient id="${k.u}bg"><stop offset="0" stop-color="${k.c[0]}" stop-opacity=".8"/><stop offset=".6" stop-color="${k.c[0]}" stop-opacity=".45"/><stop offset="1" stop-color="${k.c[0]}" stop-opacity="0"/></radialGradient></defs><ellipse cx="104" cy="166" rx="19" ry="10" fill="url(#${k.u}bg)"/><ellipse cx="196" cy="166" rx="19" ry="10" fill="url(#${k.u}bg)"/><path d="${Shape.star(112, 160, 4, 1, 4)}" fill="#fff"/><path d="${Shape.star(204, 160, 4, 1, 4)}" fill="#fff"/>` },
];

/* Marcas no rosto — cores [cor] */
PARTS.faceMark = [null,
  { n: 'Sardas', d: k => [[98, 160], [106, 164], [102, 170], [110, 158], [194, 164], [202, 160], [198, 170], [190, 158]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${k.c[0]}"/>`).join('') },
  { n: 'Estrela', d: k => `<path d="${Shape.star(196, 168, 7, 3)}" fill="${k.c[0]}"/>` },
  { n: 'Lágrima', d: k => `<path d="M104 160 C100 168 100 172 104 174 C108 172 108 168 104 160Z" fill="${k.c[0]}"/>` },
  { n: 'Cicatriz', d: k => `<path d="M182 154 L206 176" stroke="${k.c[0]}" stroke-width="2.4" stroke-linecap="round"/><path d="M188 156 L184 162 M194 162 L190 168 M200 168 L196 174" stroke="${k.c[0]}" stroke-width="1.6"/>` },
  { n: 'Pinta', d: k => `<circle cx="168" cy="190" r="2" fill="${k.c[0]}"/>` },
  { n: 'Listras', d: k => `<path d="M84 150 L100 152 M84 158 L100 158 M216 150 L200 152 M216 158 L200 158" stroke="${k.c[0]}" stroke-width="3" stroke-linecap="round"/>` },
  { n: 'Coração', d: k => `<path d="${Shape.heart(196, 166, 5)}" fill="${k.c[0]}"/>` },
  { n: 'Lua', d: k => `<path d="M156 70 A12 12 0 1 0 156 94 A9 9 0 1 1 156 70Z" fill="${k.c[0]}"/>` },
];
