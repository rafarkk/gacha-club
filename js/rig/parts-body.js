/* ============ PEÇAS: CORPO E ROUPAS ============
   Tronco em espaço do personagem. Membros em espaço local: junta em (0,0), segmento apontando para +y.
   Cores: [principal, secundária, contorno]. */

const G = {
  HC: [150, 128], NECK: [150, 198],
  SH: [[126, 220], [174, 220]], HIP: [[137, 282], [163, 282]],
  AU: 37, AF: 33, LT: 56, LS: 54, AW: 10.5, TW: 15, SW: 12,
  FEET_Y: 408,
};
const TORSO = 'M124 212 Q150 204 176 212 L178 250 L181 284 Q150 292 119 284 L122 250Z';
const tube = (y0, y1, w0, w1) => `M${-w0 / 2} ${y0} L${w0 / 2} ${y0} L${w1 / 2} ${y1} L${-w1 / 2} ${y1}Z`;
const tubeR = (y0, y1, w0, w1) => `M${-w0 / 2} ${y0} A${w0 / 2} ${w0 / 2} 0 0 1 ${w0 / 2} ${y0} L${w1 / 2} ${y1} L${-w1 / 2} ${y1}Z`;
const P = (k, d, fill) => `<path d="${d}" fill="${fill || k.c[0]}" ${ol(k, 2.2)}/>`;
const stripes = (k, id, clipD, ys, w = 4) => `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})">${ys.map(y => `<rect x="-60" y="${y}" width="420" height="${w}" fill="${k.c[1]}"/>`).join('')}</g>`;
const range = (a, b, s) => { const r = []; for (let v = a; v <= b; v += s) r.push(v); return r; };
const mir = s => `<g transform="translate(300 0) scale(-1 1)">${s}</g>`;

/* ---------- Tronco ---------- */
PARTS.shirt = [null,
  { n: 'Camiseta', d: k => P(k, TORSO) + `<path d="M140 208 Q150 219 160 208" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
  { n: 'Regata', d: k => P(k, 'M132 210 Q150 228 168 210 L177 213 L178 250 L181 284 Q150 292 119 284 L122 250 L123 213Z') },
  { n: 'Gola alta', d: k => P(k, TORSO) + P(k, 'M138 190 L162 190 L163 214 Q150 218 137 214Z') + `<path d="M138 197 L162 197 M138 204 L162 204" stroke="${k.c[2]}" stroke-width="1.2" opacity=".5"/>` },
  { n: 'Social com gravata', d: k => P(k, TORSO) + P(k, 'M137 206 L150 222 L163 206 L166 214 L150 226 L134 214Z', Color.shade(k.c[0], 12)) + P(k, 'M147 222 L153 222 L157 256 L150 264 L143 256Z', k.c[1]) },
  { n: 'Moletom', d: k => P(k, 'M122 211 Q150 202 178 211 L182 252 L186 290 Q150 298 114 290 L118 252Z') + P(k, 'M130 212 Q150 234 170 212 Q162 200 150 202 Q138 200 130 212Z', Color.shade(k.c[0], -14)) + P(k, 'M132 262 L168 262 L164 282 L136 282Z', Color.shade(k.c[0], -8)) + `<path d="M144 222 L143 240 M156 222 L157 240" stroke="${k.c[1]}" stroke-width="2.4" stroke-linecap="round"/>` },
  { n: 'Vestido', d: k => P(k, 'M121 256 L179 256 L206 334 Q150 346 94 334Z') + `<path d="M96 326 Q150 338 204 326" stroke="${k.c[1]}" stroke-width="6" fill="none"/>` + P(k, TORSO) + `<path d="M122 256 L178 256" stroke="${k.c[1]}" stroke-width="5"/>` },
  { n: 'Marinheiro', d: k => P(k, TORSO) + P(k, 'M124 212 L150 244 L176 212 L186 220 L176 234 L150 262 L124 234 L114 220Z', k.c[1]) + `<path d="M120 222 L150 256 L180 222" stroke="#fff" stroke-width="2" fill="none"/>` + P(k, 'M150 248 L136 240 L136 258Z M150 248 L164 240 L164 258Z', '#e84a5f') + `<circle cx="150" cy="248" r="4" fill="#c0304a"/>` },
  { n: 'Cropped', d: k => P(k, 'M124 212 Q150 204 176 212 L178 250 Q150 257 122 250Z') + `<path d="M140 208 Q150 218 160 208" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
  { n: 'Kimono', d: k => P(k, TORSO) + `<path d="M136 206 L160 250 M164 206 L150 230" stroke="${k.c[1]}" stroke-width="6" stroke-linecap="round"/>` + P(k, 'M121 246 L179 246 L180 266 L120 266Z', k.c[1]) + `<path d="M121 256 L179 256" stroke="${k.c[2]}" stroke-width="1.5" opacity=".6"/>` },
  { n: 'Armadura', d: k => P(k, TORSO, Color.shade(k.c[0], -10)) + P(k, 'M128 214 Q150 208 172 214 L170 250 Q150 262 130 250Z') + `<path d="M150 214 L150 256" stroke="${k.c[1]}" stroke-width="2"/><path d="${Shape.star(150, 232, 7, 3, 4)}" fill="${k.c[1]}"/>` },
  { n: 'Suéter listrado', d: k => P(k, TORSO) + stripes(k, k.u + 'sw', TORSO, range(218, 286, 12), 5) + `<path d="${TORSO}" fill="none" ${ol(k, 2.2)}/>` },
  { n: 'Colete', d: k => P(k, TORSO, k.c[1]) + P(k, 'M124 212 L144 212 L148 284 L119 284 L122 250Z') + P(k, 'M176 212 L156 212 L152 284 L181 284 L178 250Z') + `<circle cx="148" cy="250" r="2" fill="${k.c[2]}"/><circle cx="148" cy="266" r="2" fill="${k.c[2]}"/>` },
  { n: 'Avental', d: k => P(k, TORSO) + P(k, 'M136 224 L164 224 L166 244 L134 244Z', k.c[1]) + P(k, 'M130 244 L170 244 L176 292 Q150 300 124 292Z', k.c[1]) + `<path d="M124 292 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0" stroke="${k.c[2]}" stroke-width="1.5" fill="${k.c[1]}"/>` },
  { n: 'Xadrez', d: k => P(k, TORSO) + `<clipPath id="${k.u}xd"><path d="${TORSO}"/></clipPath><g clip-path="url(#${k.u}xd)" opacity=".55">${range(110, 190, 12).map(x => `<rect x="${x}" y="200" width="4" height="100" fill="${k.c[1]}"/>`).join('')}${range(212, 290, 12).map(y => `<rect x="110" y="${y}" width="80" height="4" fill="${k.c[1]}"/>`).join('')}</g><path d="${TORSO}" fill="none" ${ol(k, 2.2)}/>` },
  { n: 'Esportiva', d: k => P(k, TORSO) + `<path d="M150 208 L150 286" stroke="${k.c[1]}" stroke-width="3"/><path d="M122 250 L136 250 M164 250 L178 250" stroke="${k.c[1]}" stroke-width="4"/>` + P(k, 'M138 200 L162 200 L164 212 Q150 218 136 212Z', k.c[1]) },
];

PARTS.jacket = [null,
  { n: 'Jaqueta aberta', d: k => P(k, 'M124 212 L143 213 L140 288 L118 286 L122 250Z') + P(k, 'M176 212 L157 213 L160 288 L182 286 L178 250Z') + `<path d="M143 213 L134 236 M157 213 L166 236" stroke="${k.c[2]}" stroke-width="2"/>` },
  { n: 'Blazer', d: k => P(k, 'M124 212 L144 213 L146 290 L118 287 L122 250Z') + P(k, 'M176 212 L156 213 L154 290 L182 287 L178 250Z') + P(k, 'M144 213 L132 240 L144 246Z', Color.shade(k.c[0], -18)) + P(k, 'M156 213 L168 240 L156 246Z', Color.shade(k.c[0], -18)) + `<circle cx="146" cy="262" r="2.6" fill="${k.c[1]}"/><circle cx="146" cy="276" r="2.6" fill="${k.c[1]}"/>` },
  { n: 'Casaco longo', d: k => P(k, 'M123 212 L143 213 L139 348 L98 340 L117 252Z') + P(k, 'M177 212 L157 213 L161 348 L202 340 L183 252Z') + `<path d="M143 213 L132 238 M157 213 L168 238" stroke="${k.c[2]}" stroke-width="2"/><path d="M118 280 L142 282 M182 280 L158 282" stroke="${k.c[1]}" stroke-width="4"/>` },
  { n: 'Cardigã', d: k => P(k, 'M124 212 L146 216 L146 292 L118 288 L122 250Z') + P(k, 'M176 212 L154 216 L154 292 L182 288 L178 250Z') + range(230, 282, 16).map(y => `<circle cx="143" cy="${y}" r="2.2" fill="${k.c[1]}"/>`).join('') },
  { n: 'Bomber', d: k => P(k, 'M123 212 L143 213 L141 276 L120 274 L122 250Z') + P(k, 'M177 212 L157 213 L159 276 L180 274 L178 250Z') + P(k, 'M120 268 L141 270 L141 280 L119 278Z', k.c[1]) + P(k, 'M180 268 L159 270 L159 280 L181 278Z', k.c[1]) + P(k, 'M132 210 Q150 222 168 210 L166 204 Q150 214 134 204Z', k.c[1]) },
  { n: 'Gola alta', d: k => P(k, 'M124 212 L144 213 L141 290 L118 287 L122 250Z') + P(k, 'M176 212 L156 213 L159 290 L182 287 L178 250Z') + P(k, 'M122 214 L118 186 L140 196 L144 214Z') + P(k, 'M178 214 L182 186 L160 196 L156 214Z') },
  { n: 'Capa de chuva', d: k => P(k, 'M122 211 Q150 204 178 211 L186 300 L194 344 Q150 354 106 344 L114 300Z') + `<path d="M150 212 L150 348" stroke="${k.c[2]}" stroke-width="1.5"/>` + range(226, 330, 20).map(y => `<circle cx="156" cy="${y}" r="2.6" fill="${k.c[1]}"/>`).join('') },
];

PARTS.skirt = [null,
  { n: 'Cinto', d: k => P(k, 'M119 272 L181 272 L182 281 L118 281Z') + P(k, 'M145 270 L155 270 L155 283 L145 283Z', k.c[1]) },
  { n: 'Saia curta', d: k => P(k, 'M121 266 L179 266 L191 308 Q150 316 109 308Z') },
  { n: 'Saia rodada', d: k => P(k, 'M123 262 L177 262 Q204 296 214 318 Q150 334 86 318 Q96 296 123 262Z') + `<path d="M90 312 Q150 326 210 312" stroke="${k.c[1]}" stroke-width="5" fill="none"/>` },
  { n: 'Saia longa', d: k => P(k, 'M123 264 L177 264 L198 366 Q150 376 102 366Z') + `<path d="M140 270 L128 368 M160 270 L172 368" stroke="${k.c[2]}" stroke-width="1.2" opacity=".5"/>` },
  { n: 'Tutu', d: k => blob({ c: k.c, F: k.c[1] }, [[110, 300, 12], [128, 306, 12], [150, 308, 12], [172, 306, 12], [190, 300, 12]]) + blob({ c: k.c, F: k.c[0] }, [[116, 288, 13], [134, 294, 13], [150, 296, 13], [166, 294, 13], [184, 288, 13], [150, 276, 22]]) },
  { n: 'Pregueada', d: k => P(k, 'M121 266 L179 266 L192 310 Q150 318 108 310Z') + range(126, 176, 10).map(x => `<path d="M${x + 2} 268 L${x - 4 + (x - 150) * .2} 312" stroke="${k.c[2]}" stroke-width="1.4" opacity=".6"/>`).join('') + `<path d="M121 270 L179 270" stroke="${k.c[1]}" stroke-width="4"/>` },
  { n: 'Assimétrica', d: k => P(k, 'M121 266 L179 266 L202 332 L152 302 L102 318Z') },
  { n: 'Corrente', d: k => P(k, 'M119 272 L181 272 L182 280 L118 280Z') + range(124, 176, 8).map((x, i) => `<ellipse cx="${x}" cy="${290 + Math.sin(i / 1.3) * 6}" rx="4" ry="2.6" fill="none" stroke="${k.c[1]}" stroke-width="2"/>`).join('') },
];

PARTS.neck = [null,
  { n: 'Cachecol', d: k => P(k, 'M128 202 Q150 220 172 202 L174 214 Q150 232 126 214Z') + P(k, 'M134 214 L148 220 L144 262 L130 258Z') + `<path d="M132 250 L146 254 M131 256 L145 260" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Gravata borboleta', d: k => P(k, 'M150 214 L136 206 L136 222Z M150 214 L164 206 L164 222Z') + `<circle cx="150" cy="214" r="4" fill="${Color.shade(k.c[0], -20)}" ${ol(k, 1.6)}/>` },
  { n: 'Colar com pingente', d: k => `<path d="M136 206 Q150 238 164 206" stroke="${k.c[0]}" stroke-width="2" fill="none"/><path d="M150 226 L156 234 L150 244 L144 234Z" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Gargantilha', d: k => P(k, 'M141 196 L159 196 L159 203 L141 203Z') + `<circle cx="150" cy="207" r="3.5" fill="none" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Bandana', d: k => P(k, 'M128 206 L172 206 L150 246Z') + `<circle cx="146" cy="220" r="2" fill="${k.c[1]}"/><circle cx="156" cy="226" r="2" fill="${k.c[1]}"/>` },
  { n: 'Sininho', d: k => P(k, 'M139 199 L161 199 L161 206 L139 206Z') + `<circle cx="150" cy="213" r="6" fill="${k.c[1]}" ${ol(k, 1.6)}/><path d="M146 214 L154 214" stroke="${k.c[2]}" stroke-width="1.4"/>` },
  { n: 'Gravata', d: k => P(k, 'M146 208 L154 208 L152 216 L158 262 L150 272 L142 262 L148 216Z') + `<path d="M144 240 L156 234 M143 252 L157 246" stroke="${k.c[1]}" stroke-width="2"/>` },
];

PARTS.logo = [null,
  { n: 'Estrela', d: k => `<path d="${Shape.star(160, 240, 9, 4)}" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Coração', d: k => `<path d="${Shape.heart(160, 241, 7)}" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Raio', d: k => `<path d="M162 228 L152 243 L159 243 L155 254 L167 238 L160 238Z" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Lua', d: k => `<path d="M162 230 A11 11 0 1 0 162 252 A8 8 0 1 1 162 230Z" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Caveira', d: k => `<path d="M151 238 C151 228 169 228 169 238 C169 244 165 246 165 250 L155 250 C155 246 151 244 151 238Z" fill="${k.c[0]}" ${ol(k, 1.6)}/><circle cx="156" cy="239" r="2.2" fill="${k.c[2]}"/><circle cx="164" cy="239" r="2.2" fill="${k.c[2]}"/>` },
  { n: 'Nota musical', d: k => `<path d="M163 228 L163 248" stroke="${k.c[0]}" stroke-width="3"/><path d="M163 228 L171 232" stroke="${k.c[0]}" stroke-width="3"/><ellipse cx="159" cy="249" rx="5" ry="4" fill="${k.c[0]}"/>` },
  { n: 'Planeta', d: k => `<circle cx="160" cy="241" r="7" fill="${k.c[0]}" ${ol(k, 1.4)}/><ellipse cx="160" cy="241" rx="13" ry="4" fill="none" stroke="${k.c[1]}" stroke-width="2" transform="rotate(-20 160 241)"/>` },
];

/* ---------- Membros (seg: 'u' braço, 'f' antebraço, 't' coxa, 's' canela) ---------- */
const AU = G.AU, AF = G.AF, LT = G.LT, LS = G.LS;

PARTS.sleeve = [null,
  { n: 'Curta', d: (k, s) => s === 'u' ? P(k, tubeR(-3, 15, 20, 18)) : '' },
  { n: 'Meia', d: (k, s) => s === 'u' ? P(k, tubeR(-3, AU + 1, 20, 16)) : '' },
  { n: 'Longa', d: (k, s) => s === 'u' ? P(k, tubeR(-3, AU + 2, 19, 16)) : P(k, tube(-2, AF, 16, 14)) },
  { n: 'Bufante', d: (k, s) => s === 'u' ? `<circle cx="0" cy="6" r="12.5" fill="${k.c[0]}" ${ol(k, 2.2)}/><path d="M-10 14 L10 14" stroke="${k.c[1]}" stroke-width="3"/>` : '' },
  { n: 'Sino', d: (k, s) => s === 'u' ? P(k, tubeR(-3, AU + 2, 18, 16)) : P(k, tube(-2, AF + 3, 16, 28)) + `<path d="M-12 ${AF + 2} L12 ${AF + 2}" stroke="${k.c[1]}" stroke-width="3"/>` },
  { n: 'Com punho', d: (k, s) => s === 'u' ? P(k, tubeR(-3, AU + 2, 19, 16)) : P(k, tube(-2, AF - 6, 16, 15)) + P(k, tube(AF - 8, AF + 1, 17, 17), k.c[1]) },
  { n: 'Listrada', d: (k, s) => { const d = s === 'u' ? tubeR(-3, AU + 2, 19, 16) : tube(-2, AF, 16, 14); return P(k, d) + stripes(k, k.u + 'sl' + s, d, range(2, 40, 8), 3.5) + `<path d="${d}" fill="none" ${ol(k, 2.2)}/>`; } },
  { n: 'Rasgada', d: (k, s) => s === 'u' ? P(k, tubeR(-3, AU + 2, 19, 16)) : P(k, `M-8 -2 L8 -2 L7 ${AF - 10} L4 ${AF - 4} L1 ${AF - 11} L-3 ${AF - 3} L-7 ${AF - 9}Z`) },
  { n: 'Princesa', d: (k, s) => s === 'u' ? P(k, tubeR(-3, AU + 2, 17, 15)) + `<circle cx="0" cy="5" r="12.5" fill="${k.c[0]}" ${ol(k, 2.2)}/>` : P(k, tube(-2, AF, 15, 14)) + P(k, tube(AF - 5, AF + 1, 17, 18), k.c[1]) },
];

PARTS.pants = [null,
  { n: 'Short', d: (k, s) => s === 't' ? P(k, tubeR(-5, 18, 22, 20)) : '' },
  { n: 'Bermuda', d: (k, s) => s === 't' ? P(k, tubeR(-5, LT + 2, 22, 18)) : '' },
  { n: 'Calça', d: (k, s) => s === 't' ? P(k, tubeR(-5, LT + 2, 21, 18)) : P(k, tube(-2, LS - 3, 18, 16)) },
  { n: 'Calça larga', d: (k, s) => s === 't' ? P(k, tubeR(-5, LT + 2, 23, 21)) : P(k, tube(-2, LS, 21, 28)) },
  { n: 'Legging listrada', d: (k, s) => { const d = s === 't' ? tubeR(-4, LT + 1, 18, 16) : tube(-1, LS - 2, 15, 13); return P(k, d) + stripes(k, k.u + 'lg' + s, d, range(0, 48, 9), 4) + `<path d="${d}" fill="none" ${ol(k, 2.2)}/>`; } },
  { n: 'Calça com barra', d: (k, s) => s === 't' ? P(k, tubeR(-5, LT + 2, 21, 18)) : P(k, tube(-2, LS - 3, 18, 17)) + P(k, tube(LS - 11, LS - 3, 20, 20), k.c[1]) },
  { n: 'Short com babado', d: (k, s) => s === 't' ? P(k, tubeR(-5, 16, 22, 21)) + `<path d="M-12 18 q3 5 6 0 q3 5 6 0 q3 5 6 0 q3 5 6 0" fill="${k.c[1]}" ${ol(k, 1.6)}/>` : '' },
  { n: 'Calça rasgada', d: (k, s) => s === 't' ? P(k, tubeR(-5, LT + 2, 21, 18)) + `<path d="M-5 ${LT - 10} l4 -3 l3 4 l3 -3" stroke="${k.c[2]}" stroke-width="1.5" fill="none"/>` : P(k, tube(-2, LS - 3, 18, 16)) + `<ellipse cx="0" cy="4" rx="5" ry="3" fill="${k.S}"/>` },
];

PARTS.sock = [null,
  { n: 'Curta', d: (k, s) => s === 's' ? P(k, tube(LS - 12, LS + 1, 15, 14)) : '' },
  { n: '3/4', d: (k, s) => s === 's' ? P(k, tube(6, LS + 1, 15, 14)) + `<path d="M-7 10 L7 10" stroke="${k.c[1]}" stroke-width="3"/>` : '' },
  { n: 'Alta', d: (k, s) => s === 't' ? P(k, tube(22, LT + 2, 17, 16)) + `<path d="M-8 26 L8 26" stroke="${k.c[1]}" stroke-width="3"/>` : P(k, tube(-2, LS + 1, 15, 14)) },
  { n: 'Listrada alta', d: (k, s) => { const d = s === 't' ? tube(20, LT + 2, 17, 16) : tube(-2, LS + 1, 15, 14); return P(k, d) + stripes(k, k.u + 'sk' + s, d, range(-2, 48, 8), 4) + `<path d="${d}" fill="none" ${ol(k, 2.2)}/>`; } },
  { n: 'Meia-calça', d: (k, s) => s === 't' ? P(k, tubeR(-4, LT + 2, 17, 15)) : P(k, tube(-2, LS + 1, 14, 13)) },
  { n: 'Polaina', d: (k, s) => s === 's' ? P(k, `M-9 14 Q-12 ${LS / 2 + 7} -10 ${LS} L10 ${LS} Q12 ${LS / 2 + 7} 9 14Z`) + range(20, LS - 4, 7).map(y => `<path d="M-8 ${y} L8 ${y}" stroke="${k.c[1]}" stroke-width="1.6"/>`).join('') : '' },
  { n: 'Soquete babado', d: (k, s) => s === 's' ? P(k, tube(LS - 10, LS + 1, 15, 14)) + `<path d="M-10 ${LS - 10} q2.5 -4 5 0 q2.5 -4 5 0 q2.5 -4 5 0 q2.5 -4 5 0" fill="${k.c[1]}" ${ol(k, 1.4)}/>` : '' },
];

const shoeBase = (k, fill) => P(k, `M-9 ${LS - 5} L9 ${LS - 5} Q14 ${LS + 5} 11 ${LS + 10} L-11 ${LS + 10} Q-14 ${LS + 5} -9 ${LS - 5}Z`, fill);
PARTS.shoe = [null,
  { n: 'Tênis', d: k => shoeBase(k) + P(k, `M-12 ${LS + 6} L12 ${LS + 6} L12 ${LS + 11} L-12 ${LS + 11}Z`, k.c[1]) + `<path d="M-4 ${LS - 2} L4 ${LS - 2} M-4 ${LS + 2} L4 ${LS + 2}" stroke="${k.c[1]}" stroke-width="1.6"/>` },
  { n: 'Bota curta', d: k => P(k, tube(LS - 18, LS - 2, 18, 18)) + shoeBase(k) + `<path d="M-9 ${LS - 16} L9 ${LS - 16}" stroke="${k.c[1]}" stroke-width="3"/>` },
  { n: 'Bota longa', d: k => P(k, tube(4, LS - 2, 19, 17)) + shoeBase(k) + P(k, tube(2, 9, 21, 20), k.c[1]) },
  { n: 'Boneca', d: k => shoeBase(k) + `<path d="M-9 ${LS - 1} L9 ${LS - 1}" stroke="${k.c[1]}" stroke-width="3"/><circle cx="6" cy="${LS - 1}" r="2" fill="${k.c[1]}"/>` },
  { n: 'Sandália', d: k => `<ellipse cx="0" cy="${LS + 4}" rx="8" ry="6" fill="${k.S}" stroke="${k.SO}" stroke-width="2"/>` + P(k, `M-11 ${LS + 7} L11 ${LS + 7} L11 ${LS + 11} L-11 ${LS + 11}Z`) + `<path d="M-7 ${LS - 1} L7 ${LS + 5} M7 ${LS - 1} L-7 ${LS + 5}" stroke="${k.c[0]}" stroke-width="2.6"/>` },
  { n: 'Salto', d: k => P(k, `M-8 ${LS - 5} L8 ${LS - 5} Q10 ${LS + 3} 3 ${LS + 12} L-3 ${LS + 12} Q-10 ${LS + 3} -8 ${LS - 5}Z`) + P(k, `M-2 ${LS + 10} L2 ${LS + 10} L1 ${LS + 16} L-1 ${LS + 16}Z`, k.c[1]) },
  { n: 'Pantufa', d: k => `<ellipse cx="0" cy="${LS + 3}" rx="13" ry="10" fill="${k.c[0]}" ${ol(k, 2.2)}/><ellipse cx="-6" cy="${LS - 6}" rx="3" ry="6" fill="${k.c[0]}" ${ol(k, 1.8)}/><ellipse cx="6" cy="${LS - 6}" rx="3" ry="6" fill="${k.c[0]}" ${ol(k, 1.8)}/><circle cx="-4" cy="${LS + 1}" r="1.6" fill="${k.c[2]}"/><circle cx="4" cy="${LS + 1}" r="1.6" fill="${k.c[2]}"/><circle cx="0" cy="${LS + 5}" r="2" fill="${k.c[1]}"/>` },
  { n: 'Galocha', d: k => P(k, tube(16, LS - 2, 19, 18)) + shoeBase(k) + `<path d="M-5 20 L-5 ${LS - 6}" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>` },
];

PARTS.glove = [null,
  { n: 'Curta', d: k => ({ f: P(k, tube(AF - 7, AF + 1, 15, 15)), hand: k.c[0] }) },
  { n: 'Longa', d: k => ({ f: P(k, tube(-2, AF + 1, 15, 14)) + `<path d="M-7 2 L7 2" stroke="${k.c[1]}" stroke-width="3"/>`, hand: k.c[0] }) },
  { n: 'Sem dedos', d: k => ({ f: P(k, tube(AF - 7, AF + 1, 15, 15)), hand: k.c[0], after: `<circle cx="0" cy="${AF + 10}" r="3.6" fill="${k.S}"/>` }) },
  { n: 'Garras', d: k => ({ f: P(k, tube(AF - 9, AF + 1, 15, 15)), hand: k.c[0], after: `<path d="M-5 ${AF + 10} l-2 7 M0 ${AF + 12} l0 7 M5 ${AF + 10} l2 7" stroke="${k.c[1]}" stroke-width="2.4" stroke-linecap="round"/>` }) },
  { n: 'Boxe', d: k => ({ f: P(k, tube(AF - 6, AF + 1, 16, 16), k.c[1]), hand: k.c[0], big: true }) },
];

/* Mãos (formato escolhido em Corpo) — desenhadas na ponta do antebraço */
const HANDS = ['Aberta', 'Punho', 'Apontando', 'Paz', 'Aceno'];
function drawHand(type, fill, stroke, big) {
  const y = AF + 6, r = big ? 9.5 : 6.8, s = `stroke="${stroke}" stroke-width="2.2"`;
  switch (type) {
    case 1: return `<circle cx="0" cy="${y}" r="${r - .8}" fill="${fill}" ${s}/>`;
    case 2: return `<ellipse cx="0" cy="${y + 9}" rx="2.6" ry="6" fill="${fill}" ${s}/><circle cx="0" cy="${y}" r="${r - .8}" fill="${fill}" ${s}/>`;
    case 3: return `<ellipse cx="-3" cy="${y + 9}" rx="2.4" ry="6" fill="${fill}" ${s} transform="rotate(12 -3 ${y + 9})"/><ellipse cx="3" cy="${y + 9}" rx="2.4" ry="6" fill="${fill}" ${s} transform="rotate(-12 3 ${y + 9})"/><circle cx="0" cy="${y}" r="${r - .8}" fill="${fill}" ${s}/>`;
    case 4: return `<path d="M-7 ${y - 4} Q-9 ${y + 12} 0 ${y + 13} Q9 ${y + 12} 7 ${y - 4} Z" fill="${fill}" ${s}/><path d="M-3 ${y + 5} L-3 ${y + 11} M1 ${y + 5} L1 ${y + 12} M5 ${y + 4} L5 ${y + 10}" stroke="${stroke}" stroke-width="1.2"/>`;
    default: return `<ellipse cx="0" cy="${y + 1}" rx="${r}" ry="${r + 1.2}" fill="${fill}" ${s}/><ellipse cx="${-r + 1}" cy="${y - 1}" rx="2.6" ry="3.6" fill="${fill}" ${s}/>`;
  }
}
