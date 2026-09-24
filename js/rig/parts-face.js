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
