/* ============ PEÇAS: ROSTO ============
   Olhos em coordenadas locais (centro 0,0), desenhados para o olho esquerdo da tela;
   o direito é espelhado pelo rig. Olho: cores [branco, cílios, sombra].
   Um modelo de olho retorna { w: contorno do branco (clip da pupila), lash: svg, closed } */

const lashStroke = (k, w = 4) => `stroke="${k.c[1]}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;

PARTS.eye = [null,
  { n: 'Normal', d: k => ({ w: 'M-15 -2 C-15 -20 15 -21 15 -2 C15 14 8 19 0 19 C-8 19 -15 14 -15 -2Z', lash: `<path d="M-17 -6 C-13 -22 13 -23 17 -8" ${lashStroke(k, 4.5)}/><path d="M-17 -6 L-23 -11" ${lashStroke(k, 3)}/>` }) },
  { n: 'Anime grande', d: k => ({ w: 'M-18 -4 C-18 -23 18 -25 18 -4 C18 14 10 22 0 22 C-10 22 -18 14 -18 -4Z', lash: `<path d="M-21 -6 C-17 -28 17 -30 21 -9" ${lashStroke(k, 5.5)}/><path d="M-20 -8 L-27 -13 M-19 -2 L-26 -3" ${lashStroke(k, 3)}/><path d="M-8 22 Q0 24 8 22" ${lashStroke(k, 2)}/>` }) },
  { n: 'Amendoado', d: k => ({ w: 'M-19 2 C-12 -16 12 -18 19 -4 C12 12 -10 16 -19 2Z', lash: `<path d="M-21 3 C-13 -19 13 -21 21 -5" ${lashStroke(k, 4.5)}/><path d="M-21 3 L-26 0" ${lashStroke(k, 3)}/>` }) },
  { n: 'Sonolento', d: k => ({ w: 'M-17 -1 C-10 -3 10 -3 17 -1 C13 16 -13 16 -17 -1Z', lash: `<path d="M-19 -1 C-8 -4 8 -4 19 -2" ${lashStroke(k, 5)}/>` }) },
  { n: 'Afiado', d: k => ({ w: 'M-19 5 L-12 -12 C0 -17 12 -12 19 -2 C10 12 -8 14 -19 5Z', lash: `<path d="M-21 6 L-13 -14 C0 -19 13 -14 21 -3" ${lashStroke(k, 4.5)}/>` }) },
  { n: 'Redondo', d: k => ({ w: 'M-16 0 A16 17 0 1 1 16 0 A16 17 0 1 1 -16 0Z', lash: `<path d="M-17 -4 C-14 -20 14 -21 17 -6" ${lashStroke(k, 3.5)}/>` }) },
  { n: 'Brilhante', d: k => ({ w: 'M-17 -2 C-17 -22 17 -23 17 -2 C17 16 9 21 0 21 C-9 21 -17 16 -17 -2Z', lash: `<path d="M-20 -5 C-16 -26 16 -27 20 -7" ${lashStroke(k, 5)}/><path d="M-19 -6 L-25 -14 M-12 -18 L-15 -25" ${lashStroke(k, 2.6)}/><path d="M-14 16 Q0 26 14 16" ${lashStroke(k, 2.2)}/>` }) },
  { n: 'De lado (tédio)', d: k => ({ w: 'M-17 -3 C-8 -5 8 -5 17 -3 C15 16 -15 16 -17 -3Z', lash: `<path d="M-19 -3 L19 -4" ${lashStroke(k, 5)}/><path d="M-12 10 Q0 14 12 10" ${lashStroke(k, 1.6)}/>` }) },
  { n: 'Fechado feliz', d: k => ({ closed: true, lash: `<path d="M-15 6 Q0 -14 15 6" ${lashStroke(k, 4.5)}/>` }) },
  { n: 'Fechado', d: k => ({ closed: true, lash: `<path d="M-15 1 Q0 10 15 1" ${lashStroke(k, 4.5)}/><path d="M-15 1 L-20 -2" ${lashStroke(k, 3)}/>` }) },
  { n: '> <', d: k => ({ closed: true, lash: `<path d="M-12 -10 L10 0 L-12 10" ${lashStroke(k, 4.5)}/>` }) },
  { n: 'Chorando', d: k => ({ closed: true, lash: `<path d="M-15 0 Q0 8 15 0" ${lashStroke(k, 4.5)}/><path d="M6 8 C4 18 0 24 4 30 C8 34 12 28 10 22 C9 18 8 12 6 8Z" fill="#8fd3ff" stroke="#4fa8ff" stroke-width="1.5"/>` }) },
  { n: 'Piscadinha', d: k => ({ closed: true, lash: `<path d="M-15 -6 L12 2 L-12 10" ${lashStroke(k, 4)}/>` }) },
  { n: 'Arregalado', d: k => ({ w: 'M-17 0 A17 19 0 1 1 17 0 A17 19 0 1 1 -17 0Z', lash: `<path d="M-18 -8 C-12 -22 12 -22 18 -8" ${lashStroke(k, 2.5)}/>` }) },
];

/* Pupila / íris — cores [íris, degradê da íris, pupila]. Desenhada dentro do branco do olho. */
PARTS.pupil = [null,
  { n: 'Normal', d: k => `<ellipse cx="0" cy="2" rx="11" ry="14" fill="${k.F}"/><ellipse cx="0" cy="3" rx="5" ry="7" fill="${k.c[2]}"/><circle cx="-4" cy="-4" r="4" fill="#fff"/><circle cx="4" cy="9" r="2" fill="#fff" opacity=".8"/>` },
  { n: 'Brilho grande', d: k => `<ellipse cx="0" cy="2" rx="12.5" ry="16" fill="${k.F}"/><ellipse cx="0" cy="4" rx="6" ry="8" fill="${k.c[2]}"/><ellipse cx="-5" cy="-5" rx="5" ry="6" fill="#fff"/><circle cx="5" cy="10" r="2.5" fill="#fff"/><path d="${Shape.star(6, -6, 3, 1, 4)}" fill="#fff"/>` },
  { n: 'Estrela', d: k => `<ellipse cx="0" cy="2" rx="11.5" ry="14.5" fill="${k.F}"/><path d="${Shape.star(0, 3, 8, 3.4)}" fill="${k.c[2]}"/><circle cx="-5" cy="-5" r="3" fill="#fff"/>` },
  { n: 'Coração', d: k => `<ellipse cx="0" cy="2" rx="11.5" ry="14.5" fill="${k.F}"/><path d="${Shape.heart(0, 3, 6.5)}" fill="${k.c[2]}"/><circle cx="-5" cy="-5" r="3" fill="#fff"/>` },
  { n: 'Fenda', d: k => `<ellipse cx="0" cy="2" rx="12" ry="15" fill="${k.F}"/><ellipse cx="0" cy="2" rx="2.2" ry="12" fill="${k.c[2]}"/><circle cx="-5" cy="-5" r="2.6" fill="#fff"/>` },
  { n: 'Anel', d: k => `<ellipse cx="0" cy="2" rx="11" ry="14" fill="${k.F}"/><circle cx="0" cy="3" r="6" fill="none" stroke="${k.c[2]}" stroke-width="2.5"/><circle cx="-5" cy="-5" r="3" fill="#fff"/>` },
  { n: 'Espiral', d: k => `<path d="M0 3 m-1 0 a1 1 0 1 1 2 0 a3 3 0 1 1 -5 -1 a5 5 0 1 1 9 2 a8 8 0 1 1 -14 -3 a11 11 0 1 1 20 3" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
  { n: 'Vazio', d: k => `<ellipse cx="0" cy="2" rx="11" ry="14" fill="${Color.mix(k.c[0], '#ffffff', .55)}"/>` },
  { n: 'Cruz', d: k => `<ellipse cx="0" cy="2" rx="11" ry="14" fill="${k.F}"/><path d="M-6 3 L6 3 M0 -3 L0 9" stroke="${k.c[2]}" stroke-width="3" stroke-linecap="round"/><circle cx="-5" cy="-6" r="2.4" fill="#fff"/>` },
  { n: 'Losango', d: k => `<ellipse cx="0" cy="2" rx="11" ry="14" fill="${k.F}"/><path d="M0 -6 L6 3 L0 12 L-6 3Z" fill="${k.c[2]}"/><circle cx="-5" cy="-5" r="2.6" fill="#fff"/>` },
  { n: 'Pequena', d: k => `<circle cx="0" cy="3" r="6" fill="${k.F}"/><circle cx="0" cy="3" r="2.6" fill="${k.c[2]}"/>` },
  { n: 'Brilho duplo', d: k => `<ellipse cx="0" cy="2" rx="12" ry="15" fill="${k.F}"/><ellipse cx="0" cy="4" rx="5.5" ry="7.5" fill="${k.c[2]}"/><path d="M-9 -8 Q-2 -12 4 -8 Q-2 -6 -9 -8Z" fill="#fff"/><path d="M-6 12 Q2 16 8 10 Q2 12 -6 12Z" fill="#fff"/>` },
  { n: 'Olho de gato brilhante', d: k => `<ellipse cx="0" cy="2" rx="12" ry="15" fill="${k.F}"/><ellipse cx="0" cy="2" rx="3.5" ry="11" fill="${k.c[2]}"/><path d="${Shape.star(-5, -5, 4, 1.2, 4)}" fill="#fff"/>` },
];

/* Sobrancelhas (esquerda local, centro 0,0) — cores [cor] */
PARTS.brow = [null,
  { n: 'Normal', d: k => `<path d="M-14 2 Q0 -6 14 0" stroke="${k.c[0]}" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { n: 'Fina', d: k => `<path d="M-14 2 Q0 -6 14 0" stroke="${k.c[0]}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  { n: 'Grossa', d: k => `<path d="M-15 4 Q0 -9 15 -1 L14 4 Q0 -3 -15 8Z" fill="${k.c[0]}"/>` },
  { n: 'Brava', d: k => `<path d="M-14 -6 L14 4" stroke="${k.c[0]}" stroke-width="4.5" fill="none" stroke-linecap="round"/>` },
  { n: 'Preocupada', d: k => `<path d="M-14 4 Q0 1 14 -7" stroke="${k.c[0]}" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { n: 'Arqueada', d: k => `<path d="M-14 5 Q-2 -12 14 -2" stroke="${k.c[0]}" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { n: 'Curta', d: k => `<path d="M-5 0 L6 -1" stroke="${k.c[0]}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
  { n: 'Pontinhos', d: k => `<circle cx="-4" cy="0" r="3" fill="${k.c[0]}"/><circle cx="5" cy="-1" r="3" fill="${k.c[0]}"/>` },
];

/* Nariz (centro 150,168) — cores [cor] */
PARTS.nose = [null,
  { n: 'Ponto', d: k => `<circle cx="150" cy="168" r="1.8" fill="${k.c[0]}"/>` },
  { n: 'Traço', d: k => `<path d="M151 163 L148 171" stroke="${k.c[0]}" stroke-width="2" stroke-linecap="round"/>` },
  { n: 'Triângulo', d: k => `<path d="M150 164 L153 170 L147 170Z" fill="${k.c[0]}"/>` },
  { n: 'Anime', d: k => `<path d="M153 160 L148 171 L153 171" stroke="${k.c[0]}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  { n: 'Focinho', d: k => `<ellipse cx="150" cy="168" rx="4" ry="3" fill="${k.c[0]}"/>` },
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
  { n: 'Suave', d: k => `<ellipse cx="104" cy="166" rx="13" ry="7" fill="${k.c[0]}" opacity=".45"/><ellipse cx="196" cy="166" rx="13" ry="7" fill="${k.c[0]}" opacity=".45"/>` },
  { n: 'Linhas', d: k => [96, 186].map(x => `<path d="M${x} 170 l5 -8 M${x + 7} 170 l5 -8 M${x + 14} 170 l5 -8" stroke="${k.c[0]}" stroke-width="2" stroke-linecap="round"/>`).join('') },
  { n: 'Forte', d: k => `<ellipse cx="104" cy="166" rx="15" ry="8" fill="${k.c[0]}" opacity=".7"/><ellipse cx="196" cy="166" rx="15" ry="8" fill="${k.c[0]}" opacity=".7"/>` + [96, 186].map(x => `<path d="M${x} 170 l5 -8 M${x + 7} 170 l5 -8 M${x + 14} 170 l5 -8" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>`).join('') },
  { n: 'Corações', d: k => `<path d="${Shape.heart(104, 166, 5)}" fill="${k.c[0]}"/><path d="${Shape.heart(196, 166, 5)}" fill="${k.c[0]}"/>` },
  { n: 'Brilho', d: k => `<ellipse cx="104" cy="166" rx="13" ry="7" fill="${k.c[0]}" opacity=".5"/><ellipse cx="196" cy="166" rx="13" ry="7" fill="${k.c[0]}" opacity=".5"/><path d="${Shape.star(112, 160, 4, 1, 4)}" fill="#fff"/><path d="${Shape.star(204, 160, 4, 1, 4)}" fill="#fff"/>` },
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
