/* ============ PEÇAS: ACESSÓRIOS, ITENS, ASAS, EFEITOS ============ */

/* Chapéus (espaço da cabeça) */
PARTS.hat = [null,
  { n: 'Boné', d: k => P(k, 'M72 84 Q70 34 150 32 Q230 34 228 84Z') + P(k, 'M72 82 Q40 84 34 96 Q90 104 150 86Z', Color.shade(k.c[0], -16)) + `<circle cx="150" cy="33" r="5" fill="${k.c[1]}"/><path d="${Shape.star(166, 62, 11, 5)}" fill="${k.c[1]}"/>` },
  { n: 'Gorro', d: k => P(k, 'M68 94 Q66 26 150 24 Q234 26 232 94Z') + P(k, 'M64 86 L236 86 L236 102 L64 102Z', k.c[1]) + `<circle cx="150" cy="22" r="13" fill="${k.c[1]}" ${ol(k)}/>` + range(80, 220, 12).map(x => `<path d="M${x} 88 L${x} 100" stroke="${k.c[2]}" stroke-width="1" opacity=".4"/>`).join('') },
  { n: 'Chapéu de bruxa', d: k => P(k, 'M40 70 Q150 50 260 70 Q256 84 150 84 Q44 84 40 70Z') + P(k, 'M96 70 Q116 34 132 8 Q156 -6 184 10 Q164 16 160 30 Q176 52 200 70Z') + P(k, 'M98 62 Q150 52 200 62 L200 70 Q150 62 98 70Z', k.c[1]) + `<path d="${Shape.star(178, 26, 6, 2.4)}" fill="#ffd166"/>` },
  { n: 'Cartola', d: k => P(k, 'M58 70 Q150 58 242 70 Q240 82 150 82 Q60 82 58 70Z') + P(k, 'M104 68 L108 0 L192 0 L196 68Z') + P(k, 'M105 52 L195 52 L196 64 L104 64Z', k.c[1]) },
  { n: 'Coroa', d: k => P(k, 'M100 58 L94 20 L118 38 L150 8 L182 38 L206 20 L200 58Z') + `<circle cx="150" cy="44" r="6" fill="${k.c[1]}" ${ol(k, 1.6)}/><circle cx="118" cy="48" r="4" fill="${k.c[1]}"/><circle cx="182" cy="48" r="4" fill="${k.c[1]}"/>` },
  { n: 'Orelhas de gato', d: k => P(k, 'M78 78 L82 24 L122 56Z') + P(k, 'M222 78 L218 24 L178 56Z') + `<path d="M86 66 L88 38 L110 56Z M214 66 L212 38 L190 56Z" fill="${k.c[1]}"/>` },
  { n: 'Orelhas de coelho', d: k => `<g transform="rotate(-12 116 60)">${P(k, 'M104 60 C92 10 108 -26 118 -26 C130 -26 138 10 126 60Z')}<path d="M110 50 C104 14 112 -12 117 -12 C123 -12 126 14 120 50Z" fill="${k.c[1]}"/></g><g transform="rotate(12 184 60)">${P(k, 'M174 60 C162 10 170 -26 182 -26 C192 -26 208 10 196 60Z')}<path d="M180 50 C174 14 177 -12 183 -12 C188 -12 196 14 190 50Z" fill="${k.c[1]}"/></g>` },
  { n: 'Laço grande', d: k => P(k, 'M150 44 L108 18 L104 72Z') + P(k, 'M150 44 L192 18 L196 72Z') + `<circle cx="150" cy="44" r="10" fill="${Color.shade(k.c[0], -16)}" ${ol(k)}/>` },
  { n: 'Tiara', d: k => `<path d="M82 88 Q150 30 218 88" stroke="${k.c[2]}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M82 88 Q150 30 218 88" stroke="${k.c[0]}" stroke-width="5" fill="none" stroke-linecap="round"/>` + P(k, 'M150 34 L158 50 L150 60 L142 50Z', k.c[1]) },
  { n: 'Fone de ouvido', d: k => `<path d="M72 130 Q66 36 150 32 Q234 36 228 130" stroke="${k.c[2]}" stroke-width="11" fill="none"/><path d="M72 130 Q66 36 150 32 Q234 36 228 130" stroke="${k.c[0]}" stroke-width="7" fill="none"/>` + `<rect x="58" y="112" width="24" height="38" rx="10" fill="${k.c[0]}" ${ol(k)}/><rect x="218" y="112" width="24" height="38" rx="10" fill="${k.c[0]}" ${ol(k)}/><circle cx="70" cy="131" r="6" fill="${k.c[1]}"/><circle cx="230" cy="131" r="6" fill="${k.c[1]}"/>` },
  { n: 'Chifres', d: k => `<defs><linearGradient id="${k.u}hn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${k.c[0]}"/><stop offset="1" stroke-width="0" stop-color="${k.c[1]}"/></linearGradient></defs>` + P(k, 'M96 70 Q66 40 80 4 Q88 34 116 56Z', `url(#${k.u}hn)`) + P(k, 'M204 70 Q234 40 220 4 Q212 34 184 56Z', `url(#${k.u}hn)`) },
  { n: 'Auréola', d: k => `<ellipse cx="150" cy="18" rx="44" ry="11" fill="none" stroke="${k.c[2]}" stroke-width="9"/><ellipse cx="150" cy="18" rx="44" ry="11" fill="none" stroke="${k.c[0]}" stroke-width="5" class="anim-bob"/>` },
  { n: 'Chapéu de palha', d: k => P(k, 'M30 80 Q150 56 270 80 Q262 96 150 96 Q38 96 30 80Z') + P(k, 'M94 78 Q98 30 150 28 Q202 30 206 78Z') + P(k, 'M96 66 Q150 58 204 66 L205 76 Q150 68 95 76Z', k.c[1]) },
  { n: 'Boina', d: k => P(k, 'M66 84 Q60 36 140 30 Q230 28 240 70 Q236 88 206 86 Q150 78 66 84Z') + `<path d="M148 30 L150 20" stroke="${k.c[2]}" stroke-width="4" stroke-linecap="round"/>` },
  { n: 'Capuz de urso', d: k => `<circle cx="84" cy="48" r="20" fill="${k.c[0]}" ${ol(k)}/><circle cx="216" cy="48" r="20" fill="${k.c[0]}" ${ol(k)}/><circle cx="84" cy="48" r="10" fill="${k.c[1]}"/><circle cx="216" cy="48" r="10" fill="${k.c[1]}"/>` + P(k, 'M64 110 Q60 34 150 32 Q240 34 236 110 L224 104 Q220 60 150 58 Q80 60 76 104Z') },
  { n: 'Viseira', d: k => P(k, 'M66 102 C66 74 108 60 150 60 C192 60 234 74 234 102 L234 110 C200 92 100 92 66 110Z') +
    P(k, 'M56 106 C96 84 204 84 246 106 C254 116 250 130 238 132 C200 114 100 114 62 132 C50 126 48 114 56 106Z') +
    `<path d="M170 64 C176 80 180 100 184 124" stroke="${k.c[1]}" stroke-width="9" fill="none"/><path d="M58 108 C98 88 202 88 244 108" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none"/>` },
];

PARTS.glasses = [null,
  { n: 'Redondos', d: k => [120, 180].map(x => `<circle cx="${x}" cy="142" r="18" fill="#fff" fill-opacity=".15" ${ol(k, 3)}/>`).join('') + `<path d="M138 140 Q150 134 162 140 M102 138 L80 132 M198 138 L220 132" ${ol(k, 3)} fill="none"/>` },
  { n: 'Quadrados', d: k => [120, 180].map(x => `<rect x="${x - 19}" y="128" width="38" height="28" rx="5" fill="#fff" fill-opacity=".15" ${ol(k, 3)}/>`).join('') + `<path d="M139 138 L161 138 M101 136 L80 132 M199 136 L220 132" ${ol(k, 3)} fill="none"/>` },
  { n: 'Escuros', d: k => [120, 180].map(x => `<path d="M${x - 20} 130 L${x + 20} 130 L${x + 16} 152 Q${x} 160 ${x - 16} 152Z" fill="${k.c[0]}" ${ol(k, 2.5)}/><path d="M${x - 12} 136 L${x - 4} 136" stroke="#fff" stroke-opacity=".6" stroke-width="2.5"/>`).join('') + `<path d="M140 134 L160 134" ${ol(k, 3)}/>` },
  { n: 'Coração', d: k => [120, 180].map(x => `<path d="${Shape.heart(x, 142, 15)}" fill="${k.c[0]}" fill-opacity=".75" ${ol(k, 2.5)}/>`).join('') + `<path d="M140 138 L160 138" ${ol(k, 3)}/>` },
  { n: 'Monóculo', d: k => `<circle cx="180" cy="142" r="18" fill="#fff" fill-opacity=".15" ${ol(k, 3)}/><path d="M196 152 Q204 190 188 220" stroke="${k.c[1]}" stroke-width="1.6" fill="none"/>` },
  { n: 'Visor', d: k => `<rect x="94" y="128" width="112" height="28" rx="14" fill="${k.c[0]}" fill-opacity=".55" ${ol(k, 2.5)}/><rect x="102" y="140" width="96" height="3" fill="${k.c[1]}" class="anim-scan"/>` },
  { n: 'Estrela', d: k => [120, 180].map(x => `<path d="${Shape.star(x, 144, 20, 10)}" fill="${k.c[0]}" fill-opacity=".7" ${ol(k, 2.5)}/>`).join('') + `<path d="M138 140 L162 140" ${ol(k, 3)}/>` },
];

PARTS.headAcc = [null,
  { n: 'Presilha estrela', d: k => `<path d="${Shape.star(198, 84, 11, 5)}" fill="${k.c[0]}" ${ol(k, 2)}/>` },
  { n: 'Flor', d: k => [0, 72, 144, 216, 288].map(a => `<circle cx="${(90 + 8 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(78 + 8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="7" fill="${k.c[0]}" ${ol(k, 1.8)}/>`).join('') + `<circle cx="90" cy="78" r="5" fill="${k.c[1]}"/>` },
  { n: 'Laço pequeno', d: k => P(k, 'M200 78 L184 68 L184 90Z M200 78 L216 68 L216 90Z') + `<circle cx="200" cy="79" r="4.5" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Grampos', d: k => `<path d="M188 86 L210 80 M190 96 L212 90" stroke="${k.c[2]}" stroke-width="6" stroke-linecap="round"/><path d="M188 86 L210 80 M190 96 L212 90" stroke="${k.c[0]}" stroke-width="3.4" stroke-linecap="round"/>` },
  { n: 'Faixa', d: k => `<path d="M76 92 Q150 50 224 92" stroke="${k.c[2]}" stroke-width="12" fill="none"/><path d="M76 92 Q150 50 224 92" stroke="${k.c[0]}" stroke-width="8" fill="none"/>` },
  { n: 'Pena', d: k => P(k, 'M206 88 C216 60 236 44 250 40 C244 58 230 78 210 92Z') + `<path d="M208 90 L246 44" stroke="${k.c[1]}" stroke-width="1.6"/>` },
  { n: 'Chifre de unicórnio', d: k => P(k, 'M140 60 L150 8 L160 60Z') + `<path d="M143 48 L157 44 M145 36 L155 32 M147 24 L153 21" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Coroa de flores', d: k => `<path d="M80 96 Q150 44 220 96" stroke="#5aa24c" stroke-width="4" fill="none"/>` + [[84, 90], [104, 72], [126, 62], [150, 58], [174, 62], [196, 72], [216, 90]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${i % 2 ? k.c[1] : k.c[0]}" ${ol(k, 1.6)}/><circle cx="${x}" cy="${y}" r="2.4" fill="#ffd166"/>`).join('') },
];

PARTS.faceAcc = [null,
  { n: 'Curativo', d: k => `<g transform="rotate(-20 196 166)"><rect x="184" y="160" width="26" height="11" rx="5" fill="${k.c[0]}" ${ol(k, 1.6)}/><rect x="193" y="160" width="8" height="11" fill="${k.c[1]}"/></g>` },
  { n: 'Máscara', d: k => P(k, 'M110 166 Q150 158 190 166 Q190 200 150 206 Q110 200 110 166Z') + `<path d="M110 168 L80 150 M190 168 L220 150" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Tapa-olho', d: k => `<path d="M84 110 L162 142 M200 134 L222 126" stroke="${k.c[2]}" stroke-width="3"/>` + P(k, 'M162 128 Q180 120 198 128 L196 156 Q180 164 164 156Z') },
  { n: 'Adesivo coração', d: k => `<path d="${Shape.heart(106, 170, 7)}" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Curativo no nariz', d: k => `<rect x="136" y="160" width="28" height="9" rx="4" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Meia máscara', d: k => P(k, 'M92 126 Q150 104 208 126 L204 156 Q180 150 166 160 Q150 152 134 160 Q120 150 96 156Z') + `<ellipse cx="120" cy="142" rx="14" ry="10" fill="${k.c[1]}" opacity=".4"/><ellipse cx="180" cy="142" rx="14" ry="10" fill="${k.c[1]}" opacity=".4"/>` },
];

/* Itens de mão — espaço local da mão (mão em 0, AF+6). Espada etc. apontam para cima/fora */
const HAND_Y = G.AF + 6;
const held = (inner, rot = 30) => `<g transform="translate(0 ${HAND_Y}) rotate(${rot})">${inner}</g>`;
PARTS.prop = [null,
  { n: 'Espada', d: k => held(P(k, 'M-4 -12 L-4 -86 L0 -98 L4 -86 L4 -12Z', k.c[0]) + `<path d="M0 -20 L0 -86" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>` + P(k, 'M-14 -14 L14 -14 L14 -8 L-14 -8Z', k.c[1]) + P(k, 'M-3 -8 L3 -8 L3 10 L-3 10Z', k.c[1]) + `<circle cx="0" cy="13" r="4" fill="${k.c[1]}" ${ol(k, 1.6)}/>`) },
  { n: 'Microfone', d: k => held(P(k, 'M-3 -6 L3 -6 L2 16 L-2 16Z', k.c[1]) + `<circle cx="0" cy="-14" r="9" fill="${k.c[0]}" ${ol(k, 2)}/><path d="M-6 -18 L6 -10 M-6 -10 L6 -18" stroke="${k.c[2]}" stroke-width="1" opacity=".5"/>`, 10) },
  { n: 'Livro', d: k => held(P(k, 'M-16 -14 L16 -14 L16 10 L-16 10Z') + `<path d="M0 -14 L0 10" stroke="${k.c[2]}" stroke-width="1.6"/><path d="M-12 -8 L-4 -8 M-12 -3 L-4 -3 M4 -8 L12 -8" stroke="${k.c[1]}" stroke-width="1.6"/>`, 0) },
  { n: 'Varinha', d: k => held(`<path d="M0 10 L0 -50" stroke="${k.c[2]}" stroke-width="5" stroke-linecap="round"/><path d="M0 10 L0 -50" stroke="${k.c[1]}" stroke-width="2.6" stroke-linecap="round"/><path d="${Shape.star(0, -58, 11, 5)}" fill="${k.c[0]}" ${ol(k, 2)}/>`, 24) },
  { n: 'CD', d: k => held(`<circle cx="0" cy="-6" r="20" fill="${k.c[0]}" ${ol(k, 2)}/><circle cx="0" cy="-6" r="12" fill="${k.c[1]}" opacity=".6"/><circle cx="0" cy="-6" r="4" fill="#fff" ${ol(k, 1.4)}/>`, 0) },
  { n: 'Flor', d: k => held(`<path d="M0 10 Q4 -20 0 -40" stroke="#3fa34d" stroke-width="3" fill="none"/>` + [0, 72, 144, 216, 288].map(a => `<circle cx="${(8 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(-44 + 8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="7" fill="${k.c[0]}" ${ol(k, 1.6)}/>`).join('') + `<circle cx="0" cy="-44" r="5" fill="${k.c[1]}"/>`, 20) },
  { n: 'Celular', d: k => held(P(k, 'M-9 -18 L9 -18 L9 12 L-9 12Z') + `<rect x="-6" y="-14" width="12" height="20" fill="${k.c[1]}"/>`, -10) },
  { n: 'Guarda-chuva', d: k => held(`<path d="M0 12 L0 -80" stroke="${k.c[2]}" stroke-width="3"/>` + P(k, 'M-46 -76 Q0 -130 46 -76 Q34 -82 23 -76 Q12 -82 0 -76 Q-12 -82 -23 -76 Q-34 -82 -46 -76Z') + `<path d="M0 12 Q0 20 -6 20" stroke="${k.c[2]}" stroke-width="3" fill="none"/>`, 12) },
  { n: 'Cajado', d: k => held(`<path d="M0 30 L0 -90" stroke="${k.c[2]}" stroke-width="7" stroke-linecap="round"/><path d="M0 30 L0 -90" stroke="${k.c[1]}" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-100" r="13" fill="${k.c[0]}" ${ol(k, 2)} class="anim-glow"/><circle cx="-4" cy="-104" r="4" fill="#fff" opacity=".7"/>`, 8) },
  { n: 'Pirulito', d: k => held(`<path d="M0 10 L0 -30" stroke="#fff" stroke-width="4"/><circle cx="0" cy="-44" r="16" fill="${k.c[0]}" ${ol(k, 2)}/><path d="M0 -44 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6" stroke="${k.c[1]}" stroke-width="3" fill="none"/>`, 16) },
  { n: 'Chá de bolhas', d: k => held(P(k, 'M-11 -24 L11 -24 L8 12 L-8 12Z') + `<path d="M-11 -18 L11 -18" stroke="${k.c[2]}" stroke-width="1.6"/><path d="M4 -24 L10 -42" stroke="${k.c[1]}" stroke-width="3"/>` + [[-4, 6], [2, 4], [5, 8], [-2, 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#3a2415"/>`).join(''), 0) },
  { n: 'Leque', d: k => held(P(k, 'M0 6 L-34 -30 Q0 -52 34 -30Z') + range(-26, 26, 13).map(x => `<path d="M0 6 L${x} ${-40 + Math.abs(x) * .3}" stroke="${k.c[1]}" stroke-width="1.4"/>`).join(''), -10) },
  { n: 'Balão', d: k => held(`<path d="M0 8 Q-6 -30 0 -70" stroke="${k.c[2]}" stroke-width="1.4" fill="none"/><ellipse cx="0" cy="-90" rx="18" ry="22" fill="${k.c[0]}" ${ol(k, 2)} class="anim-bob"/><ellipse cx="-6" cy="-98" rx="4" ry="6" fill="#fff" opacity=".5"/>`, 10) },
  { n: 'Ursinho', d: k => held(`<circle cx="-9" cy="-30" r="6" fill="${k.c[0]}" ${ol(k, 1.8)}/><circle cx="9" cy="-30" r="6" fill="${k.c[0]}" ${ol(k, 1.8)}/><ellipse cx="0" cy="-4" rx="13" ry="15" fill="${k.c[0]}" ${ol(k, 2)}/><circle cx="0" cy="-22" r="12" fill="${k.c[0]}" ${ol(k, 2)}/><circle cx="-4" cy="-24" r="1.6" fill="${k.c[2]}"/><circle cx="4" cy="-24" r="1.6" fill="${k.c[2]}"/><ellipse cx="0" cy="-18" rx="4" ry="3" fill="${k.c[1]}"/>`, 0) },
  { n: 'Batata', d: k => held(`<path d="M-11 -16 C-2 -22 12 -18 14 -6 C16 6 14 18 4 22 C-6 26 -16 18 -15 6 C-14 -2 -18 -10 -11 -16Z" fill="${k.c[0]}" ${ol(k, 2.6)}/>` + [[-5, -8], [6, -4], [-3, 6], [7, 10], [-8, 14]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${k.c[1]}"/>`).join(''), 0) },
];

PARTS.shield = [null,
  { n: 'Redondo', d: k => `<g transform="translate(0 ${G.AF / 2})"><circle r="24" fill="${k.c[0]}" ${ol(k)}/><circle r="15" fill="none" stroke="${k.c[1]}" stroke-width="4"/><circle r="4" fill="${k.c[1]}"/></g>` },
  { n: 'Heráldico', d: k => `<g transform="translate(0 ${G.AF / 2})">${P(k, 'M-22 -24 L22 -24 L22 0 Q22 20 0 30 Q-22 20 -22 0Z')}<path d="M0 -24 L0 30 M-22 -4 L22 -4" stroke="${k.c[1]}" stroke-width="4"/></g>` },
  { n: 'Estrela', d: k => `<g transform="translate(0 ${G.AF / 2})"><path d="${Shape.star(0, 0, 28, 14)}" fill="${k.c[0]}" ${ol(k)}/><circle r="7" fill="${k.c[1]}"/></g>` },
];

/* Capa — { back, front } em espaço do personagem */
PARTS.cape = [null,
  { n: 'Curta', d: k => ({ back: P(k, 'M120 210 L180 210 L204 300 Q150 316 96 300Z'), front: P(k, 'M122 206 L140 212 L132 226Z M178 206 L160 212 L168 226Z') }) },
  { n: 'Longa', d: k => ({ back: P(k, 'M120 210 L180 210 L222 376 Q150 392 78 376Z') + `<path d="M130 230 L108 370 M170 230 L192 370" stroke="${k.c[2]}" stroke-width="1.4" opacity=".4"/>`, front: `<circle cx="150" cy="212" r="6" fill="${k.c[1]}" ${ol(k, 2)}/>` }) },
  { n: 'Rasgada', d: k => ({ back: P(k, 'M120 210 L180 210 L216 350 L200 336 L192 366 L176 344 L166 372 L150 348 L134 372 L124 344 L108 366 L100 336 L84 350Z'), front: '' }) },
  { n: 'Manto real', d: k => ({ back: P(k, 'M118 208 L182 208 L230 384 Q150 400 70 384Z') + `<path d="M72 380 Q150 396 228 380" stroke="#fff" stroke-width="8" fill="none"/>`, front: P(k, 'M118 206 Q150 224 182 206 L186 222 Q150 240 114 222Z', '#fff') + range(122, 180, 12).map(x => `<circle cx="${x}" cy="${222 + Math.abs(x - 150) * -.1}" r="1.8" fill="#222"/>`).join('') }) },
  { n: 'Capa com capuz', d: k => ({ back: P(k, 'M58 150 Q60 40 150 38 Q240 40 242 150 L250 360 Q150 380 50 360Z'), front: '' }) },
];

/* Cauda (atrás das pernas, presa no quadril) */
PARTS.tail = [null,
  { n: 'Gato', d: k => `<path d="M168 282 C220 300 236 250 226 216 C222 204 214 206 216 218 C224 250 206 280 170 270" fill="${k.c[0]}" ${ol(k)}/>` },
  { n: 'Raposa', d: k => P(k, 'M166 276 C230 300 262 240 236 196 C226 230 206 250 170 262Z') + `<path d="M236 196 C246 212 246 226 240 236 C234 222 232 210 236 196Z" fill="${k.c[1]}"/>` },
  { n: 'Diabinho', d: k => `<path d="M166 280 C210 300 230 262 222 232" stroke="${k.c[2]}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M166 280 C210 300 230 262 222 232" stroke="${k.c[0]}" stroke-width="4" fill="none" stroke-linecap="round"/>` + P(k, 'M222 218 L232 238 L212 236Z') },
  { n: 'Dragão', d: k => P(k, 'M162 276 C220 310 262 290 270 250 C250 270 222 276 166 262Z') + range(180, 250, 16).map((x, i) => `<path d="M${x} ${278 - i * 2} l6 -10 l6 10" fill="${k.c[1]}" ${ol(k, 1.4)}/>`).join('') },
  { n: 'Coelho', d: k => `<circle cx="166" cy="280" r="13" fill="${k.c[0]}" ${ol(k)}/>` },
  { n: 'Sereia', d: k => P(k, 'M160 280 C200 300 220 330 214 360 L236 376 L200 380 Q196 360 186 346 C176 320 166 300 156 290Z') },
];

/* Asas (asa esquerda desenhada; direita espelhada) */
const wingPair = (w, cls = 'anim-wing') => `<g class="${cls}-l">${w}</g><g class="${cls}-r">${mir(w)}</g>`;
PARTS.wings = [null,
  { n: 'Anjo', d: k => wingPair(range(0, 4, 1).map(i => `<ellipse cx="${104 - i * 14}" cy="${214 - i * 10 + i * i * 2}" rx="${30 - i * 2}" ry="9" fill="${k.c[0]}" ${ol(k, 2)} transform="rotate(${-22 + i * 12} ${104 - i * 14} ${214 - i * 10})"/>`).join('') + P(k, 'M124 222 C90 190 60 190 40 206 C60 214 90 226 122 240Z')) },
  { n: 'Morcego', d: k => wingPair(P(k, 'M128 228 C96 170 56 160 20 176 C32 188 30 200 26 214 C40 208 50 214 54 228 C64 220 78 224 84 240 C98 230 112 234 126 250Z') + `<path d="M126 234 L30 184 M124 240 L54 222 M122 246 L84 238" stroke="${k.c[1]}" stroke-width="1.6" opacity=".7"/>`) },
  { n: 'Fada', d: k => wingPair(`<path d="M130 226 C100 170 60 158 46 184 C36 210 90 224 128 232Z" fill="${k.c[0]}" fill-opacity=".7" ${ol(k, 2)}/><path d="M130 236 C100 256 70 286 80 300 C96 312 120 272 132 242Z" fill="${k.c[1]}" fill-opacity=".7" ${ol(k, 2)}/>`) },
  { n: 'Dragão', d: k => wingPair(P(k, 'M130 226 L70 150 L60 174 L36 170 L46 196 L22 204 L46 220 L40 240 L80 232 L100 250Z') + `<path d="M130 226 L60 174 M126 232 L46 196 M120 238 L46 220" stroke="${k.c[1]}" stroke-width="2"/>`) },
  { n: 'Borboleta', d: k => wingPair(`<path d="M132 230 C120 180 70 150 44 170 C24 190 60 226 130 236Z" fill="${k.c[0]}" ${ol(k, 2)}/><path d="M130 240 C90 250 60 280 72 300 C90 318 124 280 132 246Z" fill="${k.c[1]}" ${ol(k, 2)}/><circle cx="72" cy="182" r="8" fill="#fff" opacity=".5"/>`) },
  { n: 'Cristal', d: k => wingPair(P(k, 'M130 226 L96 150 L110 214Z', k.c[0]) + P(k, 'M128 232 L50 170 L100 226Z', Color.shade(k.c[0], 18)) + P(k, 'M128 238 L40 236 L100 246Z', k.c[1]) + P(k, 'M130 244 L70 290 L112 254Z', Color.shade(k.c[1], 18))) },
];

/* Efeitos atrás/à frente do personagem */
function effPts(seed, n, box = [40, 20, 260, 390]) { const r = rng(seed); return Array.from({ length: n }, () => [box[0] + r() * (box[2] - box[0]), box[1] + r() * (box[3] - box[1]), r()]); }
PARTS.effect = [null,
  { n: 'Brilhos', d: k => effPts('fx1', 14).map(([x, y, r]) => `<path d="${Shape.star(x, y, 6 + r * 6, 1.6, 4)}" fill="${r > .5 ? k.c[0] : k.c[1]}" class="anim-tw" style="animation-delay:${(r * 2).toFixed(2)}s"/>`).join('') },
  { n: 'Chamas', d: k => `<defs><linearGradient id="${k.u}fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${k.c[1]}"/><stop offset="1" stop-color="${k.c[0]}" stop-opacity=".1"/></linearGradient></defs>` + [[70, 390, 1.6], [230, 390, 1.7], [100, 330, 1.2], [200, 330, 1.3], [150, 200, 2.2], [50, 300, 1], [250, 300, 1]].map(([x, y, s], i) => `<path class="anim-flicker" style="animation-delay:${i * .17}s" d="M${x} ${y} Q${x - 18 * s} ${y - 26 * s} ${x - 5 * s} ${y - 56 * s} Q${x} ${y - 38 * s} ${x + 8 * s} ${y - 70 * s} Q${x + 24 * s} ${y - 34 * s} ${x + 16 * s} ${y}Z" fill="url(#${k.u}fl)"/>`).join('') },
  { n: 'Corações', d: k => effPts('fx3', 10).map(([x, y, r]) => `<path d="${Shape.heart(x, y, 5 + r * 7)}" fill="${r > .5 ? k.c[0] : k.c[1]}" opacity=".85" class="anim-float" style="animation-delay:${(r * 3).toFixed(2)}s"/>`).join('') },
  { n: 'Bolhas', d: k => effPts('fx4', 12).map(([x, y, r]) => `<g class="anim-float" style="animation-delay:${(r * 3).toFixed(2)}s"><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(5 + r * 9).toFixed(1)}" fill="${k.c[1]}" fill-opacity=".15" stroke="${k.c[0]}" stroke-width="2"/><circle cx="${(x - 3).toFixed(0)}" cy="${(y - 3).toFixed(0)}" r="2" fill="#fff"/></g>`).join('') },
  { n: 'Aura', d: k => `<defs><radialGradient id="${k.u}au"><stop offset="0" stop-color="${k.c[0]}" stop-opacity=".7"/><stop offset=".6" stop-color="${k.c[1]}" stop-opacity=".3"/><stop offset="1" stop-color="${k.c[1]}" stop-opacity="0"/></radialGradient></defs><ellipse cx="150" cy="220" rx="150" ry="200" fill="url(#${k.u}au)" class="anim-pulse"/>` },
  { n: 'Equalizador', d: k => range(30, 270, 20).map((x, i) => { const h = 40 + (Math.sin(i * 1.7) + 1) * 60; return `<rect x="${x}" y="${390 - h}" width="14" height="${h.toFixed(0)}" rx="3" fill="${i % 2 ? k.c[0] : k.c[1]}" opacity=".8" class="anim-eq" style="animation-delay:${(i * .13).toFixed(2)}s"/>`; }).join('') },
  { n: 'Pétalas', d: k => effPts('fx7', 18).map(([x, y, r]) => `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="6" ry="3.5" fill="${r > .4 ? k.c[0] : k.c[1]}" transform="rotate(${(r * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" class="anim-sway" style="animation-delay:${(r * 3).toFixed(2)}s"/>`).join('') },
  { n: 'Raios', d: k => [[60, 60], [240, 90], [40, 260], [256, 250]].map(([x, y], i) => `<path d="M${x} ${y} l-10 22 l10 0 l-8 22 l20 -28 l-10 0 l8 -16Z" fill="${i % 2 ? k.c[0] : k.c[1]}" ${ol(k, 1.6)} class="anim-tw" style="animation-delay:${i * .3}s"/>`).join('') },
  { n: 'Estrelas girando', d: k => `<g class="anim-spin" style="transform-origin:150px 128px">${range(0, 330, 45).map(a => { const x = 150 + 110 * Math.cos(a * Math.PI / 180), y = 128 + 40 * Math.sin(a * Math.PI / 180); return `<path d="${Shape.star(x, y, 9, 4)}" fill="${a % 90 ? k.c[0] : k.c[1]}" ${ol(k, 1.4)}/>`; }).join('')}</g>` },
  { n: 'Fumaça', d: k => `<defs><filter id="${k.u}sm" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs><g filter="url(#${k.u}sm)" opacity=".6">${effPts('fx10', 9, [40, 240, 260, 400]).map(([x, y, r]) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(24 + r * 20).toFixed(0)}" fill="${r > .5 ? k.c[0] : k.c[1]}" class="anim-float" style="animation-delay:${(r * 3).toFixed(1)}s"/>`).join('')}</g>` },
  { n: 'Círculo mágico', d: k => `<g class="anim-spin" style="transform-origin:150px 384px"><ellipse cx="150" cy="384" rx="110" ry="28" fill="none" stroke="${k.c[0]}" stroke-width="3"/><ellipse cx="150" cy="384" rx="86" ry="21" fill="none" stroke="${k.c[1]}" stroke-width="2" stroke-dasharray="8 6"/></g>` + range(0, 300, 60).map(a => `<path d="${Shape.star(150 + 98 * Math.cos(a * Math.PI / 180), 384 + 25 * Math.sin(a * Math.PI / 180), 6, 2.4)}" fill="${k.c[0]}"/>`).join('') },
];
