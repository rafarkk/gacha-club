/* ============ PEÇAS: CORPO E ROUPAS ============
   Tronco em espaço do personagem. Membros em espaço local: junta em (0,0), segmento apontando para +y.
   Cores: [principal, secundária, contorno]. */

const G = {
  HC: [150, 128], NECK: [150, 198],
  /* ombro abaixo do topo do tronco: o alto da manga fica alinhado com a linha do ombro */
  SH: [[126, 222], [174, 222]], HIP: [[137, 282], [163, 282]],
  AU: 24, AF: 21, LT: 36, LS: 33, AW: 10.5, TW: 16.5, SW: 13.5,
  FEET_Y: 408,
  /* sf: escala do trecho que está sendo desenhado (o rig ajusta); os contornos dividem por ela para não engrossar */
  sf: 1,
};
/* Tronco: peito, cintura mais fina e quadril mais largo. TORSO muda conforme o corpo (o rig escolhe antes de desenhar
   as roupas): TORSO_M reto, TORSO_F com busto e cintura marcada. */
const TORSO_M = 'M123 212 Q150 204 177 212 C179 230 177 246 175 260 L180 286 Q150 294 120 286 L125 260 C123 246 121 230 123 212Z';
const TORSO_F = 'M125 212 Q150 205 175 212 C180 222 180 238 173 250 C170 256 169 260 170 263 C180 272 184 280 184 290 Q150 298 116 290 C116 280 120 272 130 263 C131 260 130 256 127 250 C120 238 120 222 125 212Z';
let TORSO = TORSO_M;
/* Jaquetas caem retas do ombro até a barra (não entram na cintura), cobrindo o quadril como no Gacha Club */
const JACKET_M = 'M123 212 Q150 204 177 212 C180 240 181 265 181 288 Q150 296 119 288 C119 265 120 240 123 212Z';
const JACKET_F = 'M125 212 Q150 205 175 212 C181 238 184 262 185 291 Q150 299 115 291 C116 262 119 238 125 212Z';
let JACKET = JACKET_M;
const tube = (y0, y1, w0, w1) => `M${-w0 / 2} ${y0} L${w0 / 2} ${y0} L${w1 / 2} ${y1} L${-w1 / 2} ${y1}Z`;
const tubeR = (y0, y1, w0, w1) => `M${-w0 / 2} ${y0} A${w0 / 2} ${w0 / 2} 0 0 1 ${w0 / 2} ${y0} L${w1 / 2} ${y1} L${-w1 / 2} ${y1}Z`;
const P = (k, d, fill) => `<path d="${d}" fill="${fill || k.c[0]}" ${ol(k, 3)}/>`;
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
  { n: 'Vestido', d: k => P(k, TORSO) + P(k, 'M127 254 L173 254 L206 334 Q150 346 94 334Z') + `<path d="M96 326 Q150 338 204 326" stroke="${k.c[1]}" stroke-width="6" fill="none"/>` + `<path d="M128 256 L172 256" stroke="${k.c[1]}" stroke-width="5"/>` },
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

/* Detalhes de camisa aplicados por cima (hem: barra mais escura; fold: dobras na cintura; rib: barra canelada) */
function shirtDeco(k, flags) {
  const id = k.u + 'sd', dk = Color.shade(k.c[0], -16), ln = (d, op = .45, w = 1.4) => `<path d="${d}" stroke="${k.c[2]}" stroke-opacity="${op}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  let s = `<clipPath id="${id}"><path d="${TORSO}"/></clipPath><g clip-path="url(#${id})">`;
  if (flags.includes('hem') || flags.includes('rib')) {
    s += `<rect x="100" y="279" width="100" height="24" fill="${dk}"/>` + ln('M100 279 L200 279', .55);
    if (flags.includes('rib')) for (let x = 118; x < 186; x += 5) s += ln(`M${x} 281 L${x} 300`, .3, 1);
  }
  if (flags.includes('fold')) s += ln('M131 256 Q135 265 133 275') + ln('M169 248 Q166 261 169 273') + ln('M146 262 Q150 268 155 266', .3);
  return s + `</g><path d="${TORSO}" fill="none" ${ol(k, 3)}/>`;
}
/* Casaco comprido (desce até o meio da coxa, abrindo um pouco na barra) */
const JLONG = 'M123 212 Q150 204 177 212 C181 250 188 300 204 346 Q150 356 96 346 C112 300 119 250 123 212Z';

/* Jaqueta aberta: o próprio contorno do tronco, um pouco mais largo, cortado no meio (abertura 'gap') e na barra
   (y0..y1). Assim acompanha cintura e quadril de qualquer corpo e nunca deixa o quadril aparecendo pelo lado. */
const jk = (k, gap, y1, fill, y0 = 190, path) => {
  const id = k.u + 'jk' + gap + y0, X = `translate(150 0) scale(1.04 1) translate(-150 0)`, TORSO = path || JACKET;
  return `<clipPath id="${id}h"><rect x="0" y="${y0}" width="${150 - gap}" height="${y1 - y0}"/><rect x="${150 + gap}" y="${y0}" width="150" height="${y1 - y0}"/></clipPath>` +
    `<clipPath id="${id}t"><path d="${TORSO}" transform="${X}"/></clipPath>` +
    `<g clip-path="url(#${id}h)"><path d="${TORSO}" transform="${X}" fill="${fill || k.c[0]}" ${ol(k, 3)}/></g>` +
    `<g clip-path="url(#${id}t)"><path d="M${150 - gap} ${y0} L${150 - gap} ${y1} L0 ${y1} M${150 + gap} ${y0} L${150 + gap} ${y1} L300 ${y1}${y0 > 200 ? ` M0 ${y0} L${150 - gap} ${y0} M${150 + gap} ${y0} L300 ${y0}` : ''}" fill="none" ${ol(k, 3)}/></g>`;
};
const SHIRT_DECO = { 1: 'hem fold', 2: 'hem fold', 3: 'hem fold', 4: 'hem fold', 7: 'fold', 11: 'rib', 12: 'fold', 14: 'hem', 15: 'hem' };
PARTS.shirt.forEach((p, i) => { if (!p || !SHIRT_DECO[i]) return; const d0 = p.d; p.d = k => d0(k) + shirtDeco(k, SHIRT_DECO[i]); });

PARTS.jacket = [null,
  { n: 'Jaqueta aberta', d: k => jk(k, 7, 289) + `<path d="M143 213 L134 236 M157 213 L166 236" stroke="${k.c[2]}" stroke-width="2"/>` },
  { n: 'Blazer', d: k => jk(k, 5, 291) + P(k, 'M144 213 L132 240 L144 246Z', Color.shade(k.c[0], -18)) + P(k, 'M156 213 L168 240 L156 246Z', Color.shade(k.c[0], -18)) + `<circle cx="146" cy="262" r="2.6" fill="${k.c[1]}"/><circle cx="146" cy="276" r="2.6" fill="${k.c[1]}"/>` },
  { n: 'Casaco longo', d: k => jk(k, 8, 352, null, 190, JLONG) + P(k, 'M142 212 L128 244 L140 250Z', Color.shade(k.c[0], -18)) + P(k, 'M158 212 L172 244 L160 250Z', Color.shade(k.c[0], -18)) +
    `<path d="M116 280 L141 282 M184 280 L159 282" stroke="${k.c[1]}" stroke-width="4"/><path d="M126 300 Q132 322 128 344 M174 300 Q168 322 172 344" stroke="${k.c[2]}" stroke-opacity=".35" stroke-width="1.4" fill="none"/>` },
  { n: 'Cardigã', d: k => jk(k, 4, 292) + range(230, 282, 16).map(y => `<circle cx="143" cy="${y}" r="2.2" fill="${k.c[1]}"/>`).join('') },
  { n: 'Bomber', d: k => jk(k, 7, 280) + jk(k, 7, 280, k.c[1], 269) + P(k, 'M132 210 Q150 222 168 210 L166 204 Q150 214 134 204Z', k.c[1]) },
  { n: 'Gola alta', d: k => jk(k, 6, 290) + P(k, 'M122 214 L118 186 L140 196 L144 214Z') + P(k, 'M178 214 L182 186 L160 196 L156 214Z') },
  { n: 'Capa de chuva', d: k => jk(k, .6, 352, null, 190, JLONG) + P(k, 'M132 206 Q150 222 168 206 L170 216 Q150 232 130 216Z') + range(232, 336, 20).map(y => `<circle cx="157" cy="${y}" r="2.6" fill="${k.c[1]}" ${ol(k, 1.2)}/>`).join('') +
    `<path d="M130 290 Q134 318 124 344 M170 290 Q166 318 176 344" stroke="${k.c[2]}" stroke-opacity=".35" stroke-width="1.4" fill="none"/>` },
];

PARTS.skirt = [null,
  { n: 'Cinto', d: k => P(k, 'M119 272 L181 272 L182 281 L118 281Z') + P(k, 'M145 270 L155 270 L155 283 L145 283Z', k.c[1]) },
  { n: 'Saia curta', d: k => P(k, 'M121 266 L179 266 L191 308 Q150 316 109 308Z') },
  { n: 'Saia rodada', d: k => P(k, 'M123 262 L177 262 Q204 296 214 318 Q150 334 86 318 Q96 296 123 262Z') + `<path d="M90 312 Q150 326 210 312" stroke="${k.c[1]}" stroke-width="5" fill="none"/>` },
  { n: 'Saia longa', d: k => P(k, 'M123 264 L177 264 L198 366 Q150 376 102 366Z') + `<path d="M140 270 L128 368 M160 270 L172 368" stroke="${k.c[2]}" stroke-width="1.2" opacity=".5"/>` },
  { n: 'Tutu', d: k => { const ruf = (y0, y1, x0, x1, n, fill) => { let d = `M${x0 + 12} ${y0} L${x1 - 12} ${y0} L${x1} ${y1 - 4}`; const w = (x1 - x0) / n;
      for (let i = n - 1; i >= 0; i--) d += ` Q${(x0 + w * (i + .5)).toFixed(1)} ${y1 + 7} ${(x0 + w * i).toFixed(1)} ${i ? y1 : y1 - 4}`; return P(k, d + 'Z', fill); };
    return ruf(268, 304, 98, 202, 7, k.c[1]) + ruf(264, 292, 106, 194, 6) + `<path d="M121 266 L179 266" stroke="${k.c[1]}" stroke-width="4"/>`; } },
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

/* Mangas: faixas do braço contínuo (L: t = 0 ombro, L.knee = cotovelo, 1 = pulso). Começam um pouco acima do
   ombro (t < 0) para cobrir a junta com o tronco. */
const puff = (k, L, r, fill) => { const p = L.pt(.08); return `<circle cx="${p.x.toFixed(2)}" cy="${(p.y + 1).toFixed(2)}" r="${r}" fill="${fill || k.c[0]}" ${ol(k)}/>`; };
PARTS.sleeve = [null,
  { n: 'Curta', d: (k, L) => L.band(k, -.2, .3, 1.8, 1.6) },
  { n: 'Meia', d: (k, L) => L.band(k, -.2, .5, 1.8, 1.5) },
  { n: 'Longa', d: (k, L) => L.band(k, -.2, .97, 1.6, 1.3) },
  { n: 'Bufante', d: (k, L) => puff(k, L, 8.5) + L.line(k, .26, 1.4, k.c[1], 1.2) },
  { n: 'Sino', d: (k, L) => L.band(k, -.2, .6, 1.6, 1.5) + L.band(k, .56, 1.03, 1.5, 6) + L.line(k, 1, 5.6, k.c[1], 1.2) },
  { n: 'Com punho', d: (k, L) => L.band(k, -.2, .86, 1.6, 1.4) + L.band(k, .84, .99, 2.2, 2.2, k.c[1]) },
  { n: 'Listrada', d: (k, L) => L.stripes(k, -.2, .97, 1.6, 1.3, .1, .05) },
  { n: 'Rasgada', d: (k, L) => L.band(k, -.2, .78, 1.6, 1.4) },
  { n: 'Princesa', d: (k, L) => L.band(k, -.2, .97, 1.2, 1.1) + puff(k, L, 8) + L.band(k, .88, 1, 2.4, 2.6, k.c[1]) },
];

/* ---------- Pernas: calças e meias são faixas da perna contínua ----------
   d: (k, L) — L é a perna montada pelo rig: L.band(k, t0, t1, folga0, folga1, cor) desenha a faixa entre t0 e t1
   (0 = quadril, 1 = tornozelo, L.knee = joelho); L.stripes(...) listras; L.line(...) risco transversal; L.pt(t) ponto e ângulo. */
PARTS.pants = [null,
  { n: 'Short', d: (k, L) => L.band(k, 0, .24, 2.2, 2.6) + L.line(k, .2, 2.4, k.c[1], 1.2) },
  { n: 'Bermuda', d: (k, L) => L.band(k, 0, .5, 2, 2.4) },
  { n: 'Calça', d: (k, L) => L.band(k, 0, .97, 1.6, 3.2) },
  { n: 'Calça larga', d: (k, L) => L.band(k, 0, .99, 2.4, 7) },
  { n: 'Legging listrada', d: (k, L) => L.stripes(k, 0, .96, .6, .6, .07, .035) },
  { n: 'Calça com barra', d: (k, L) => L.band(k, 0, .97, 1.6, 3.2) + L.band(k, .86, .97, 3.4, 3.6, k.c[1]) },
  { n: 'Short com babado', d: (k, L) => L.band(k, .16, .27, 3.6, 4.4, k.c[1]) + L.band(k, 0, .2, 2.2, 2.6) },
  { n: 'Calça rasgada', d: (k, L) => L.band(k, 0, .97, 1.6, 3.2) + L.patch(k, L.knee, 4.2, 2.6, k.S) + L.patch(k, .78, 2.4, 1.4, k.S) },
];

PARTS.sock = [null,
  { n: 'Curta', d: (k, L) => L.band(k, .86, 1, .7, .8) },
  { n: '3/4', d: (k, L) => L.band(k, .6, 1, .8, .8) + L.band(k, .6, .66, 1.3, 1.3, k.c[1]) },
  { n: 'Alta', d: (k, L) => L.band(k, .36, 1, .8, .8) + L.band(k, .36, .42, 1.3, 1.3, k.c[1]) },
  { n: 'Listrada alta', d: (k, L) => L.stripes(k, .36, 1, .8, .8, .08, .04) },
  { n: 'Meia-calça', d: (k, L) => L.band(k, 0, 1, .4, .5) },
  { n: 'Polaina', d: (k, L) => L.band(k, .6, .94, 2.6, 3.2) + [.68, .76, .84].map(t => L.line(k, t, 2.8, k.c[1], .9)).join('') },
  { n: 'Soquete babado', d: (k, L) => L.band(k, .84, .9, 2.2, 2.4, k.c[1]) + L.band(k, .88, 1, .7, .8) },
];

const shoeBase = (k, fill) => { const t = G.toe || 0, x = v => (-t * v).toFixed(1);
  return t ? P(k, `M${x(9)} ${LS - 5} L${x(-8)} ${LS - 5} Q${x(-14)} ${LS + 3} ${x(-13)} ${LS + 7} Q${x(-12)} ${LS + 10} ${x(-9)} ${LS + 10} L${x(10)} ${LS + 10} Q${x(13)} ${LS + 5} ${x(9)} ${LS - 5}Z`, fill)
    : P(k, `M-9 ${LS - 5} L9 ${LS - 5} Q14 ${LS + 5} 11 ${LS + 10} L-11 ${LS + 10} Q-14 ${LS + 5} -9 ${LS - 5}Z`, fill); };
PARTS.shoe = [null,
  { n: 'Tênis', d: k => { const t = G.toe || 0, a = t ? (t < 0 ? -14 : -11) : -12, b = t ? (t < 0 ? 11 : 14) : 12, c = t;
    return shoeBase(k) + P(k, `M${a} ${LS + 6} L${b} ${LS + 6} Q${b + 1} ${LS + 11} ${b - 2} ${LS + 11} L${a + 2} ${LS + 11} Q${a - 1} ${LS + 11} ${a} ${LS + 6}Z`, k.c[1]) + `<path d="M${c - 4} ${LS - 2} L${c + 4} ${LS - 2} M${c - 4} ${LS + 2} L${c + 4} ${LS + 2}" stroke="${k.c[1]}" stroke-width="1.6"/>`; } },
  { n: 'Bota curta', d: k => P(k, tube(LS - 18, LS - 2, 18, 18)) + shoeBase(k) + `<path d="M-9 ${LS - 16} L9 ${LS - 16}" stroke="${k.c[1]}" stroke-width="3"/>` },
  { n: 'Bota longa', d: k => P(k, tube(4, LS - 2, 19, 17)) + shoeBase(k) + P(k, tube(2, 9, 21, 20), k.c[1]) },
  { n: 'Boneca', d: k => shoeBase(k) + `<path d="M-9 ${LS - 1} L9 ${LS - 1}" stroke="${k.c[1]}" stroke-width="3"/><circle cx="6" cy="${LS - 1}" r="2" fill="${k.c[1]}"/>` },
  { n: 'Sandália', d: k => { const t = G.toe || 0, o = -t * 2.5;
    return `<ellipse cx="${o}" cy="${LS + 4}" rx="${t ? 9.5 : 8}" ry="6" fill="${k.S}" stroke="${k.SO}" stroke-width="2"/>` + P(k, `M${-11 + o * 1.4} ${LS + 7} L${11 + o * .6} ${LS + 7} L${11 + o * .6} ${LS + 11} L${-11 + o * 1.4} ${LS + 11}Z`) + `<path d="M${-7 + o} ${LS - 1} L${7 + o} ${LS + 5} M${7 + o} ${LS - 1} L${-7 + o} ${LS + 5}" stroke="${k.c[0]}" stroke-width="2.6"/>`; } },
  { n: 'Salto', d: k => { const t = G.toe || 0, x = v => (-t * v).toFixed(1);
    return t ? P(k, `M${x(4.5)} ${LS + 5} L${x(8.5)} ${LS + 5} L${x(8)} ${LS + 13} L${x(5)} ${LS + 13}Z`, k.c[1]) + P(k, `M${x(8)} ${LS - 5} L${x(-4)} ${LS - 5} Q${x(-12)} ${LS + 5} ${x(-15)} ${LS + 13} L${x(-3)} ${LS + 12} Q${x(3)} ${LS + 6} ${x(9)} ${LS + 5}Z`)
      : P(k, `M-8 ${LS - 5} L8 ${LS - 5} Q10 ${LS + 3} 3 ${LS + 12} L-3 ${LS + 12} Q-10 ${LS + 3} -8 ${LS - 5}Z`) + P(k, `M-2 ${LS + 10} L2 ${LS + 10} L1 ${LS + 16} L-1 ${LS + 16}Z`, k.c[1]); } },
  { n: 'Pantufa', d: k => { const o = -(G.toe || 0) * 3; return `<g transform="translate(${o} 0)"><ellipse cx="0" cy="${LS + 3}" rx="13" ry="10" fill="${k.c[0]}" ${ol(k, 2.2)}/><ellipse cx="-6" cy="${LS - 6}" rx="3" ry="6" fill="${k.c[0]}" ${ol(k, 1.8)}/><ellipse cx="6" cy="${LS - 6}" rx="3" ry="6" fill="${k.c[0]}" ${ol(k, 1.8)}/><circle cx="-4" cy="${LS + 1}" r="1.6" fill="${k.c[2]}"/><circle cx="4" cy="${LS + 1}" r="1.6" fill="${k.c[2]}"/><circle cx="0" cy="${LS + 5}" r="2" fill="${k.c[1]}"/></g>`; } },
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
/* Mãos no estilo do Gacha Club: maiores que o pulso, arredondadas, com o polegar para a frente e vincos dos dedos */
function drawHand(type, fill, stroke, big) {
  const k = big ? 1.3 : 1.2, y0 = AF, y = AF + 5.5, sw = (3 / G.sf / k).toFixed(2), s = `stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
  const crease = d => `<path d="${d}" stroke="${stroke}" stroke-width="${(1.5 / G.sf / k).toFixed(2)}" fill="none" stroke-linecap="round" opacity=".75"/>`;
  const thumb = `<path d="M3.5 ${y - 3.5} Q8.5 ${y - 2.5} 8 ${y + 2.5} Q7.3 ${y + 5.5} 4.5 ${y + 4.5}Z" fill="${fill}" ${s}/>`;
  let h;
  switch (type) {
    case 1: /* punho */ h = `<path d="M-5.5 ${y - 5} Q0 ${y - 7.5} 5.5 ${y - 5} Q7.5 ${y + 1} 5.5 ${y + 6} Q0 ${y + 8.5} -5.5 ${y + 6} Q-7.5 ${y + 1} -5.5 ${y - 5}Z" fill="${fill}" ${s}/>` + thumb + crease(`M-4 ${y + 1} Q-1 ${y + 2.5} 2 ${y + 1}`); break;
    case 2: /* apontando */ h = `<path d="M-1.8 ${y + 3} L-2 ${y + 13} Q0 ${y + 15.5} 2 ${y + 13} L1.8 ${y + 3}Z" fill="${fill}" ${s}/><path d="M-5.5 ${y - 5} Q0 ${y - 7.5} 5.5 ${y - 5} Q7.5 ${y + 1} 5.5 ${y + 6} Q0 ${y + 8} -5.5 ${y + 6} Q-7.5 ${y + 1} -5.5 ${y - 5}Z" fill="${fill}" ${s}/>` + thumb; break;
    case 3: /* paz */ h = [-2.6, 2.6].map(x => `<path d="M${x - 1.8} ${y + 3} L${x * 1.6 - 1.9} ${y + 13} Q${x * 1.6} ${y + 15.5} ${x * 1.6 + 1.9} ${y + 13} L${x + 1.8} ${y + 3}Z" fill="${fill}" ${s}/>`).join('') + `<path d="M-5.5 ${y - 5} Q0 ${y - 7.5} 5.5 ${y - 5} Q7.5 ${y + 1} 5.5 ${y + 6} Q0 ${y + 8} -5.5 ${y + 6} Q-7.5 ${y + 1} -5.5 ${y - 5}Z" fill="${fill}" ${s}/>` + thumb; break;
    case 4: /* aceno: mão aberta com dedos */ h = `<path d="M-6.5 ${y - 4} Q-8.5 ${y + 8} -5.5 ${y + 12} Q0 ${y + 15} 5.5 ${y + 12} Q8.5 ${y + 8} 6.5 ${y - 4} Q0 ${y - 7} -6.5 ${y - 4}Z" fill="${fill}" ${s}/>` + crease(`M-2.5 ${y + 6} L-2.8 ${y + 12} M1 ${y + 6} L1 ${y + 13} M4.2 ${y + 5} L4.5 ${y + 11}`); break;
    default: /* aberta (repouso) */ h = `<path d="M-6 ${y - 4.5} Q0 ${y - 7} 6 ${y - 4.5} Q8 ${y + 3} 6 ${y + 8.5} Q0 ${y + 11.5} -6 ${y + 8.5} Q-8 ${y + 3} -6 ${y - 4.5}Z" fill="${fill}" ${s}/>` + thumb + crease(`M-4.5 ${y + 5} Q-1 ${y + 6.5} 3 ${y + 5}`);
  }
  return `<g transform="translate(0 ${y0}) scale(${k}) translate(0 ${-y0})">${h}</g>`;
}
