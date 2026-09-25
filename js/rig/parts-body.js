/* ============ PEÇAS: CORPO E ROUPAS ============
   Tronco em espaço do personagem. Membros em espaço local: junta em (0,0), segmento apontando para +y.
   Cores: [principal, secundária, contorno]. */

const G = {
  HC: [150, 128], NECK: [150, 198],
  /* ombro abaixo do topo do tronco: o alto da manga fica alinhado com a linha do ombro */
  SH: [[126, 222], [174, 222]], HIP: [[137, 282], [163, 282]],
  AU: 24, AF: 21, LT: 33, LS: 31, AW: 11.5, TW: 19, SW: 15,
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
/* recorta pelo tronco (tclip) e contorna só a parte do tronco abaixo de y0, com a borda de cima reta (tline) */
const tclip = (k, id, body) => `<clipPath id="${k.u}${id}"><path d="${TORSO}"/></clipPath><g clip-path="url(#${k.u}${id})">${body}</g>`;
const tline = (k, y0) => `<clipPath id="${k.u}tl${y0}"><rect x="0" y="${y0}" width="300" height="200"/></clipPath><path d="${TORSO}" fill="none" ${ol(k, 3)} clip-path="url(#${k.u}tl${y0})"/>` + tclip(k, 'tb' + y0, `<path d="M90 ${y0} L210 ${y0}" ${ol(k, 3)}/>`);
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
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Regata de alcinha', d: k => tclip(k, 'ra', `<rect x="100" y="226" width="100" height="80" fill="${k.c[0]}"/><path d="M118 228 Q150 222 182 228" stroke="${k.c[1]}" stroke-width="3" fill="none"/>`) + `<path d="M130 228 L134 208 M170 228 L166 208" stroke="${k.c[0]}" stroke-width="3.4" stroke-linecap="round"/>` + tline(k, 226) },
  { n: 'Frente única de coração', d: k => P(k, TORSO) + `<path d="M138 206 L150 214 L162 206" stroke="${k.c[0]}" stroke-width="5" fill="none"/><path d="${Shape.heart(150, 232, 9)}" fill="${k.S}" ${ol(k, 2)}/>` },
  { n: 'Tomara que caia de babado', d: k => tclip(k, 'tq', `<rect x="100" y="232" width="100" height="80" fill="${k.c[0]}"/>`) + Array.from({ length: 8 }, (_, i) => `<circle cx="${124 + i * 7.4}" cy="${232}" r="5" fill="${k.c[1]}" ${ol(k, 1.6)}/>`).join('') + tline(k, 236) },
  { n: 'Jardineira', d: k => P(k, TORSO, k.c[1]) + tclip(k, 'jd', `<path d="M132 236 L168 236 L170 262 L180 262 L182 300 L118 300 L120 262 L130 262Z" fill="${k.c[0]}" ${ol(k, 2.4)}/><rect x="140" y="244" width="20" height="12" rx="2" fill="none" ${ol(k, 1.8)}/>`) + `<path d="M132 238 L128 212 M168 238 L172 212" stroke="${k.c[0]}" stroke-width="5"/><circle cx="132" cy="238" r="3.4" fill="${k.c[1]}" ${ol(k, 1.4)}/><circle cx="168" cy="238" r="3.4" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Dólmã', d: k => P(k, TORSO) + P(k, 'M136 202 L164 202 L165 214 Q150 218 135 214Z') + [[140, 232], [160, 232], [140, 250], [160, 250], [140, 268], [160, 268]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${k.c[1]}" ${ol(k, 1.4)}/>`).join('') + `<path d="M154 214 L152 290" stroke="${k.c[2]}" stroke-width="1.6" opacity=".5"/>` },
  { n: 'Suéter com zigue-zague', d: k => P(k, TORSO) + tclip(k, 'zz', `<rect x="100" y="256" width="100" height="16" fill="${k.c[1]}"/><path d="M100 272 ${Array.from({ length: 12 }, (_, i) => `L${106 + i * 8} ${i % 2 ? 272 : 258}`).join(' ')}" stroke="${k.c[0]}" stroke-width="3" fill="none"/>`) + `<path d="M140 208 Q150 216 160 208" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
  { n: 'Colete com capuz', d: k => P(k, TORSO) + P(k, 'M122 214 Q150 236 178 214 L176 206 Q150 222 124 206Z', Color.shade(k.c[0], -14)) + `<path d="M150 224 L150 290" stroke="${k.c[1]}" stroke-width="3"/><rect x="146" y="226" width="8" height="10" rx="2" fill="${k.c[1]}" ${ol(k, 1.2)}/>` },
  { n: 'Blusa de babado', d: k => P(k, TORSO) + `<path d="M150 214 L150 262" stroke="${k.c[1]}" stroke-width="12"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M144 ${218 + i * 8} q6 4 12 0" stroke="${k.c[2]}" stroke-width="1.4" fill="none" opacity=".6"/>`).join('') + [228, 242, 256].map(y => `<circle cx="150" cy="${y}" r="2.4" fill="${k.c[2]}"/>`).join('') },
  { n: 'Blusa bicolor', d: k => P(k, TORSO, k.c[1]) + tclip(k, 'bc', `<rect x="100" y="198" width="100" height="44" fill="${k.c[0]}"/><rect x="100" y="240" width="100" height="6" fill="${Color.shade(k.c[0], -20)}"/>`) + tline(k, 240) },
  { n: 'Camisola rendada', d: k => tclip(k, 'cr', `<rect x="100" y="224" width="100" height="80" fill="${k.c[0]}"/>`) + `<path d="M128 226 Q150 236 172 226" stroke="${k.c[1]}" stroke-width="4" fill="none"/><path d="M132 226 L136 208 M168 226 L164 208" stroke="${k.c[0]}" stroke-width="2.6"/>` + Array.from({ length: 9 }, (_, i) => `<circle cx="${122 + i * 7}" cy="${286 + Math.sin(i / 8 * Math.PI) * 5}" r="3.4" fill="${k.c[1]}"/>`).join('') + tline(k, 224) },
  /* ---- rodada 2 ---- */
  { n: 'Camiseta com faixa', d: k => P(k, TORSO) + tclip(k, 'cf', `<rect x="100" y="236" width="100" height="14" fill="${k.c[1]}"/>`) + `<path d="${TORSO}" fill="none" ${ol(k, 3)}/>` },
  { n: 'Regata esportiva', d: k => tclip(k, 're', `<rect x="100" y="214" width="100" height="90" fill="${k.c[0]}"/><path d="M150 214 L150 300" stroke="${k.c[1]}" stroke-width="2"/>`) + `<path d="M130 212 Q150 228 170 212" stroke="${k.c[1]}" stroke-width="4" fill="none"/>` + tline(k, 214) },
  { n: 'Blusa de coração', d: k => P(k, TORSO) + `<path d="${Shape.heart(150, 246, 16)}" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Uniforme escolar', d: k => P(k, TORSO) + P(k, 'M128 208 L150 236 L172 208 L178 216 L150 246 L122 216Z', k.c[1]) + P(k, 'M144 232 L156 232 L158 242 L150 250 L142 242Z', '#e84a5f') },
  { n: 'Colete de tricô', d: k => P(k, TORSO, '#fff') + tclip(k, 'ct', `<path d="M122 212 L150 250 L178 212 L182 300 L118 300Z" fill="${k.c[0]}"/>` + [230, 246, 262, 278].map(y => `<path d="M118 ${y} L182 ${y}" stroke="${k.c[1]}" stroke-width="2" stroke-dasharray="4 3"/>`).join('')) + `<path d="${TORSO}" fill="none" ${ol(k, 3)}/>` },
  { n: 'Top de estrela', d: k => tclip(k, 'te', `<rect x="100" y="226" width="100" height="36" fill="${k.c[0]}"/>`) + `<path d="${Shape.star(150, 242, 9, 4)}" fill="${k.c[1]}"/><path d="M132 228 L134 208 M168 228 L166 208" stroke="${k.c[0]}" stroke-width="3"/>` + `<clipPath id="${k.u}tt"><rect x="0" y="226" width="300" height="36"/></clipPath><path d="${TORSO}" fill="none" ${ol(k, 3)} clip-path="url(#${k.u}tt)"/>` + tclip(k, 'ttb', `<path d="M90 226 L210 226 M90 262 L210 262" ${ol(k, 3)}/>`) },
  { n: 'Camisa havaiana', d: k => P(k, TORSO) + [[128, 230], [164, 222], [140, 262], [170, 268], [128, 282]].map(([x, y]) => [0, 90, 180, 270].map(a => `<circle cx="${(x + Math.cos(a * Math.PI / 180) * 4).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * 4).toFixed(1)}" r="3.4" fill="${k.c[1]}"/>`).join('')).join('') + `<path d="M150 210 L150 290" stroke="${k.c[2]}" stroke-width="1.6"/>` },
  { n: 'Moletom com orelhas', d: k => P(k, TORSO) + P(k, 'M122 214 Q150 236 178 214 L176 206 Q150 222 124 206Z', Color.shade(k.c[0], -12)) + [[124, 204], [176, 204]].map(([x, y]) => `<path d="M${x - 8} ${y} L${x} ${y - 14} L${x + 8} ${y}Z" fill="${k.c[0]}" ${ol(k, 2)}/>`).join('') },
  { n: 'Túnica com cinto', d: k => P(k, TORSO) + tclip(k, 'tc', `<rect x="100" y="258" width="100" height="10" fill="${k.c[1]}"/>`) + `<rect x="145" y="256" width="10" height="14" rx="2" fill="none" stroke="#ffd23f" stroke-width="2"/><path d="M140 210 L150 226 L160 210" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
  { n: 'Blusa ombro a ombro', d: k => tclip(k, 'oo', `<rect x="100" y="222" width="100" height="90" fill="${k.c[0]}"/>`) + Array.from({ length: 9 }, (_, i) => `<circle cx="${120 + i * 7.6}" cy="222" r="5" fill="${k.c[0]}" ${ol(k, 1.6)}/>`).join('') + tline(k, 226) },
  /* ---- padrões do Gacha Club ---- */
  { n: 'Camiseta com barra', d: k => P(k, TORSO) + tclip(k, 'cb', `<rect x="100" y="${TORSO === TORSO_F ? 285 : 281}" width="100" height="20" fill="${k.c[1]}"/>`) + `<path d="${TORSO}" fill="none" ${ol(k, 3)}/><path d="M140 208 Q150 219 160 208" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` },
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
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Colete', d: k => jk(k, 9, 280) + [236, 252, 268].map(y => `<circle cx="140" cy="${y}" r="2.4" fill="${k.c[1]}"/>`).join('') + `<path d="M126 262 L138 262" stroke="${k.c[2]}" stroke-width="1.6" opacity=".6"/>` },
  { n: 'Bolero', d: k => jk(k, 12, 246) + `<path d="M138 246 Q150 240 162 246" stroke="${k.c[1]}" stroke-width="2" fill="none" opacity="0"/>` },
  { n: 'Cardigã de babado', d: k => jk(k, 6, 286) + Array.from({ length: 11 }, (_, i) => `<circle cx="${144 - (i % 1) * 0}" cy="${214 + i * 7}" r="3.4" fill="${k.c[1]}" ${ol(k, 1.2)}/><circle cx="156" cy="${214 + i * 7}" r="3.4" fill="${k.c[1]}" ${ol(k, 1.2)}/>`).join('') },
  { n: 'Jaqueta jeans', d: k => jk(k, 7, 280) + P(k, 'M126 208 L143 214 L136 228 L122 222Z', Color.shade(k.c[0], -12)) + P(k, 'M174 208 L157 214 L164 228 L178 222Z', Color.shade(k.c[0], -12)) + [[122, 240], [158, 240]].map(([x, y]) => `<rect x="${x}" y="${y}" width="18" height="12" rx="2" fill="none" stroke="${k.c[1]}" stroke-width="1.6" stroke-dasharray="3 2"/>`).join('') + `<path d="M120 270 L143 270 M157 270 L180 270" stroke="${k.c[1]}" stroke-width="1.6" stroke-dasharray="3 2"/>` },
  { n: 'Jaqueta de couro', d: k => jk(k, 3, 280) + P(k, 'M126 206 L148 222 L140 236 L122 222Z', Color.shade(k.c[0], 14)) + P(k, 'M174 206 L152 222 L160 236 L178 222Z', Color.shade(k.c[0], 14)) + `<path d="M150 222 L162 280" stroke="${k.c[1]}" stroke-width="2.4"/><rect x="159" y="246" width="4" height="8" rx="1" fill="${k.c[1]}"/>` },
  { n: 'Moletom aberto', d: k => jk(k, 8, 286) + P(k, 'M122 214 Q150 244 178 214 Q176 200 164 198 Q150 222 136 198 Q124 200 122 214Z', Color.shade(k.c[0], -16)) + `<path d="M140 222 L138 250 M160 222 L162 250" stroke="${k.c[1]}" stroke-width="2.4" stroke-linecap="round"/><path d="M122 262 L140 262 M160 262 L178 262" stroke="${k.c[2]}" stroke-width="1.6" opacity=".5"/>` },
  { n: 'Jaleco', d: k => jk(k, 5, 352, null, 190, JLONG) + P(k, 'M144 212 L132 242 L144 248Z', Color.shade(k.c[0], -10)) + P(k, 'M156 212 L168 242 L156 248Z', Color.shade(k.c[0], -10)) + `<rect x="124" y="286" width="18" height="16" rx="2" fill="none" ${ol(k, 1.8)}/><rect x="158" y="286" width="18" height="16" rx="2" fill="none" ${ol(k, 1.8)}/><rect x="162" y="230" width="12" height="10" rx="2" fill="none" ${ol(k, 1.6)}/><path d="M166 230 L166 226" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Sobretudo trespassado', d: k => jk(k, 1, 330, null, 190, JLONG) + P(k, 'M130 212 L150 250 L170 212 L178 226 L150 262 L122 226Z', Color.shade(k.c[0], -14)) + [[140, 270], [160, 270], [140, 290], [160, 290]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${k.c[1]}" ${ol(k, 1.4)}/>`).join('') + `<path d="M118 300 L182 300" stroke="${k.c[1]}" stroke-width="4"/>` },
  { n: 'Casaco com pelo', d: k => jk(k, 7, 290) + [[143, -1], [157, 1]].map(([x, m]) => Array.from({ length: 10 }, (_, i) => `<circle cx="${x + m * (i % 2 ? 2 : -1)}" cy="${208 + i * 8.4}" r="5.4" fill="${k.c[1]}"/>`).join('')).join('') + Array.from({ length: 10 }, (_, i) => `<circle cx="${126 + i * 5.4}" cy="${212 + Math.sin(i / 9 * Math.PI) * 5}" r="4.6" fill="${k.c[1]}"/>`).join('') },
  { n: 'Jaqueta colegial', d: k => jk(k, 5, 282) + jk(k, 5, 282, k.c[1], 270) + P(k, 'M132 206 Q150 218 168 206 L166 200 Q150 212 134 200Z', k.c[1]) + `<text x="130" y="248" font-size="18" font-weight="700" font-family="sans-serif" fill="${k.c[1]}" stroke="${k.c[2]}" stroke-width="1">A</text><path d="M120 276 L141 276" stroke="${k.c[0]}" stroke-width="2" opacity=".5"/>` },
  /* ---- rodada 2 ---- */
  { n: 'Jaqueta de chuva curta', d: k => jk(k, 1, 288) + P(k, 'M132 206 Q150 218 168 206 L170 216 Q150 230 130 216Z') + range(228, 282, 14).map(y => `<circle cx="156" cy="${y}" r="2.4" fill="${k.c[1]}"/>`).join('') },
  { n: 'Kimono aberto', d: k => jk(k, 10, 330, null, 190, JLONG) + `<path d="M140 212 L136 330 M160 212 L164 330" stroke="${k.c[1]}" stroke-width="6"/>` + [[120, 270], [180, 290], [130, 310]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${k.c[1]}"/>`).join('') },
  { n: 'Jaqueta esportiva', d: k => jk(k, 1, 286) + `<path d="M124 218 L118 286 M176 218 L182 286" stroke="${k.c[1]}" stroke-width="5"/><path d="M150 214 L150 286" stroke="#c8ccd8" stroke-width="2"/>` },
  { n: 'Capa curta de ombro', d: k => P(k, 'M118 206 Q150 196 182 206 L194 250 Q150 260 106 250Z') },
  { n: 'Jaqueta de pelúcia', d: k => jk(k, 6, 290) + Array.from({ length: 20 }, (_, i) => `<circle cx="${122 + (i % 5) * 14 + (i % 2) * 4}" cy="${220 + Math.floor(i / 5) * 18}" r="2" fill="${k.c[1]}" opacity=".6"/>`).join('') },
  { n: 'Colete de pelos', d: k => jk(k, 10, 282) + [[140, -1], [160, 1]].map(([x, m]) => Array.from({ length: 9 }, (_, i) => `<circle cx="${x + m * (i % 2 ? 2 : -1)}" cy="${210 + i * 8.4}" r="4.6" fill="${k.c[1]}"/>`).join('')).join('') },
  { n: 'Sobretudo xadrez', d: k => jk(k, 6, 346, null, 190, JLONG) + `<clipPath id="${k.u}sx2"><path d="${JLONG}"/></clipPath><g clip-path="url(#${k.u}sx2)" opacity=".35">${[104, 128, 172, 196].map(x => `<rect x="${x}" y="200" width="6" height="160" fill="${k.c[1]}"/>`).join('')}${[240, 280, 320].map(y => `<rect x="90" y="${y}" width="120" height="6" fill="${k.c[1]}"/>`).join('')}</g>` },
  { n: 'Jaqueta com patches', d: k => jk(k, 7, 284) + `<path d="${Shape.star(130, 236, 7, 3)}" fill="${k.c[1]}"/><path d="${Shape.heart(170, 262, 5)}" fill="#e84a5f"/><circle cx="128" cy="266" r="5" fill="#ffd23f" ${ol(k, 1.4)}/>` },
  { n: 'Poncho curto', d: k => P(k, 'M122 206 L178 206 L204 268 Q150 280 96 268Z') + `<path d="M104 256 Q150 266 196 256" stroke="${k.c[1]}" stroke-width="5" fill="none"/>` },
  { n: 'Jaqueta de gala', d: k => jk(k, 4, 294) + P(k, 'M144 212 L130 246 L144 252Z', k.c[1]) + P(k, 'M156 212 L170 246 L156 252Z', k.c[1]) + `<path d="M170 232 L176 226" stroke="#e84a5f" stroke-width="4" stroke-linecap="round"/>` },
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
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Saia de babados', d: k => P(k, 'M121 266 L179 266 L186 292 Q150 298 114 292Z') + P(k, 'M113 290 Q150 298 187 290 L196 314 Q180 322 168 314 Q158 324 150 316 Q142 324 132 314 Q120 322 104 314Z', k.c[1]) + `<path d="M121 270 L179 270" stroke="${k.c[1]}" stroke-width="4"/>` },
  { n: 'Saia lápis', d: k => P(k, 'M121 264 L179 264 L182 330 Q150 336 118 330Z') + `<path d="M121 270 L179 270" stroke="${k.c[1]}" stroke-width="5"/><path d="M160 300 L160 332" stroke="${k.c[2]}" stroke-width="1.6"/>` },
  { n: 'Avental de maid', d: k => P(k, 'M121 266 L179 266 L190 306 Q150 314 110 306Z', k.c[1]) + P(k, 'M128 268 L172 268 L178 300 Q150 306 122 300Z', k.c[0]) + Array.from({ length: 8 }, (_, i) => `<circle cx="${124 + i * 7.4}" cy="${303 + Math.sin(i / 7 * Math.PI) * 2}" r="4.4" fill="${k.c[0]}" ${ol(k, 1.4)}/>`).join('') + P(k, 'M150 268 L136 258 L136 276Z M150 268 L164 258 L164 276Z', k.c[0]) },
  { n: 'Cinto com bolsinhas', d: k => P(k, 'M119 272 L181 272 L182 282 L118 282Z') + P(k, 'M118 280 L132 280 L132 298 Q125 302 118 298Z', k.c[1]) + P(k, 'M168 280 L182 280 L182 298 Q175 302 168 298Z', k.c[1]) + `<rect x="145" y="270" width="10" height="14" rx="2" fill="none" stroke="${k.c[1]}" stroke-width="2.4"/>` },
  { n: 'Saia envelope com laço', d: k => P(k, 'M121 264 L179 264 L194 322 Q150 330 106 322Z') + `<path d="M170 266 L144 326" stroke="${k.c[2]}" stroke-width="2" fill="none"/>` + P(k, 'M170 268 L160 258 L158 272Z M170 268 L182 260 L182 274Z', k.c[1]) + `<path d="M170 270 L166 292 M171 270 L178 290" stroke="${k.c[1]}" stroke-width="3" stroke-linecap="round"/>` },
  { n: 'Saia godê', d: k => P(k, 'M123 262 L177 262 Q208 300 212 328 Q150 344 88 328 Q92 300 123 262Z') + [100, 125, 150, 175, 200].map(x => `<path d="M${150 + (x - 150) * .3} 266 Q${x} 300 ${x} 334" stroke="${k.c[2]}" stroke-width="1.4" fill="none" opacity=".45"/>`).join('') + `<path d="M123 266 L177 266" stroke="${k.c[1]}" stroke-width="4"/>` },
  { n: 'Faixa amarrada', d: k => P(k, 'M119 266 L181 266 L182 282 L118 282Z') + P(k, 'M158 276 L150 318 L160 316 L164 280Z M162 276 L176 314 L184 310 L168 278Z') + `<ellipse cx="162" cy="276" rx="7" ry="6" fill="${k.c[0]}" ${ol(k, 2)}/>` },
  { n: 'Saia de camadas', d: k => P(k, 'M121 266 L179 266 L200 330 Q150 340 100 330Z', k.c[1]) + P(k, 'M121 266 L179 266 L192 310 Q150 318 108 310Z') + P(k, 'M121 266 L179 266 L186 290 Q150 296 114 290Z', k.c[1]) },
  { n: 'Saia balonê', d: k => P(k, 'M121 264 L179 264 Q204 288 190 312 Q150 326 110 312 Q96 288 121 264Z') + P(k, 'M110 312 Q150 326 190 312 Q186 318 150 322 Q114 318 110 312Z', k.c[1]) + [132, 150, 168].map(x => `<path d="M${x} 268 Q${x + (x - 150) * .2} 296 ${x + (x - 150) * .3} 316" stroke="${k.c[2]}" stroke-width="1.4" fill="none" opacity=".4"/>`).join('') },
  { n: 'Saia xadrez', d: k => P(k, 'M121 266 L179 266 L192 312 Q150 320 108 312Z') + `<clipPath id="${k.u}sx"><path d="M121 266 L179 266 L192 312 Q150 320 108 312Z"/></clipPath><g clip-path="url(#${k.u}sx)" opacity=".55">${[110, 124, 138, 152, 166, 180].map(x => `<rect x="${x}" y="260" width="5" height="70" fill="${k.c[1]}"/>`).join('')}${[276, 292, 308].map(y => `<rect x="100" y="${y}" width="100" height="5" fill="${k.c[1]}"/>`).join('')}</g><path d="M121 266 L179 266 L192 312 Q150 320 108 312Z" fill="none" ${ol(k, 2.4)}/>` },
  /* ---- rodada 2 ---- */
  { n: 'Saia de tule', d: k => `<path d="M121 266 L179 266 L202 320 Q150 330 98 320Z" fill="${k.c[0]}" fill-opacity=".6" ${ol(k, 2)}/>` + P(k, 'M123 266 L177 266 L190 300 Q150 306 110 300Z') },
  { n: 'Saia de sereia', d: k => P(k, 'M121 264 L179 264 L182 320 L204 350 Q150 360 96 350 L118 320Z') + `<path d="M118 320 L182 320" stroke="${k.c[1]}" stroke-width="3"/>` },
  { n: 'Saia jeans com botões', d: k => P(k, 'M121 266 L179 266 L188 310 Q150 316 112 310Z') + `<path d="M150 266 L150 312" stroke="${k.c[1]}" stroke-width="1.6" stroke-dasharray="4 3"/>` + [276, 290, 304].map(y => `<circle cx="154" cy="${y}" r="2" fill="${k.c[1]}"/>`).join('') },
  { n: 'Saia de pétalas', d: k => [[-1, 0], [0, 1], [1, 0]].map(([m], i) => `<path d="M${150 + m * 18} 266 Q${150 + m * 40} 296 ${150 + m * 26} 316 Q${150 + m * 8} 300 ${150 + m * 6} 266Z" fill="${i % 2 ? k.c[1] : k.c[0]}" ${ol(k, 2)}/>`).join('') + P(k, 'M121 264 L179 264 L180 274 L120 274Z') },
  { n: 'Saia com suspensórios', d: k => P(k, 'M121 266 L179 266 L190 310 Q150 318 110 310Z') + `<path d="M130 266 L128 212 M170 266 L172 212" stroke="${k.c[0]}" stroke-width="5"/>` },
  { n: 'Saia de hula', d: k => Array.from({ length: 16 }, (_, i) => `<path d="M${122 + i * 3.8} 270 L${116 + i * 4.6} 318" stroke="${i % 2 ? k.c[0] : k.c[1]}" stroke-width="4"/>`).join('') + P(k, 'M121 264 L179 264 L180 274 L120 274Z', '#ff8ab8') },
  { n: 'Saia assimétrica com babado', d: k => P(k, 'M121 266 L179 266 L200 330 L150 300 L100 312Z') + `<path d="M100 312 L150 300 L200 330" stroke="${k.c[1]}" stroke-width="5" fill="none"/>` },
  { n: 'Cinto de corrente', d: k => P(k, 'M119 270 L181 270 L182 280 L118 280Z') + Array.from({ length: 7 }, (_, i) => `<ellipse cx="${128 + i * 8}" cy="${288 + Math.sin(i / 6 * Math.PI) * 8}" rx="4" ry="2.6" fill="none" stroke="#c8ccd8" stroke-width="1.8"/>`).join('') },
  { n: 'Saia de bolinhas', d: k => P(k, 'M123 262 L177 262 Q204 296 208 316 Q150 330 92 316 Q96 296 123 262Z') + [[130, 280], [150, 292], [170, 280], [120, 304], [160, 312], [184, 302]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${k.c[1]}"/>`).join('') },
  { n: 'Saia longa rodada', d: k => P(k, 'M123 262 L177 262 Q214 330 220 376 Q150 390 80 376 Q86 330 123 262Z') + [110, 130, 150, 170, 190].map(x => `<path d="M${150 + (x - 150) * .3} 266 Q${x} 330 ${x + (x - 150) * .3} 382" stroke="${k.c[2]}" stroke-width="1.4" fill="none" opacity=".35"/>`).join('') },
];

PARTS.neck = [null,
  { n: 'Cachecol', d: k => P(k, 'M128 202 Q150 220 172 202 L174 214 Q150 232 126 214Z') + P(k, 'M134 214 L148 220 L144 262 L130 258Z') + `<path d="M132 250 L146 254 M131 256 L145 260" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Gravata borboleta', d: k => P(k, 'M150 214 L136 206 L136 222Z M150 214 L164 206 L164 222Z') + `<circle cx="150" cy="214" r="4" fill="${Color.shade(k.c[0], -20)}" ${ol(k, 1.6)}/>` },
  { n: 'Colar com pingente', d: k => `<path d="M136 206 Q150 238 164 206" stroke="${k.c[0]}" stroke-width="2" fill="none"/><path d="M150 226 L156 234 L150 244 L144 234Z" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Gargantilha', d: k => P(k, 'M141 196 L159 196 L159 203 L141 203Z') + `<circle cx="150" cy="207" r="3.5" fill="none" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Bandana', d: k => P(k, 'M128 206 L172 206 L150 246Z') + `<circle cx="146" cy="220" r="2" fill="${k.c[1]}"/><circle cx="156" cy="226" r="2" fill="${k.c[1]}"/>` },
  { n: 'Sininho', d: k => P(k, 'M139 199 L161 199 L161 206 L139 206Z') + `<circle cx="150" cy="213" r="6" fill="${k.c[1]}" ${ol(k, 1.6)}/><path d="M146 214 L154 214" stroke="${k.c[2]}" stroke-width="1.4"/>` },
  { n: 'Gravata', d: k => P(k, 'M146 208 L154 208 L152 216 L158 262 L150 272 L142 262 L148 216Z') + `<path d="M144 240 L156 234 M143 252 L157 246" stroke="${k.c[1]}" stroke-width="2"/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Gola de babados', d: k => Array.from({ length: 9 }, (_, i) => { const t = i / 8, x = 124 + t * 52, y = 212 + Math.sin(t * Math.PI) * 8; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${k.c[0]}" ${ol(k, 2)}/>`; }).join('') + P(k, 'M128 204 Q150 214 172 204 L172 212 Q150 222 128 212Z', k.c[0]) },
  { n: 'Gargantilha de coração', d: k => P(k, 'M140 196 Q150 200 160 196 L160 203 Q150 207 140 203Z') + `<path d="${Shape.heart(150, 210, 6)}" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Laço de fita', d: k => P(k, 'M150 212 L132 202 Q126 212 132 222Z M150 212 L168 202 Q174 212 168 222Z') + P(k, 'M147 214 L140 238 L146 236 L150 216Z M153 214 L160 238 L154 236 L150 216Z', k.c[0]) + `<circle cx="150" cy="212" r="4.5" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Gola social', d: k => P(k, 'M130 206 L150 214 L146 230 Q134 224 126 214Z') + P(k, 'M170 206 L150 214 L154 230 Q166 224 174 214Z') },
  { n: 'Cachecol longo', d: k => P(k, 'M126 204 Q150 222 174 204 L176 218 Q150 236 124 218Z') + P(k, 'M160 220 L172 222 L176 292 L162 292Z') + `<path d="M162 250 L175 250 M163 270 L176 270" stroke="${k.c[1]}" stroke-width="4"/><path d="M162 292 L164 300 M167 292 L169 300 M172 292 L174 300" stroke="${k.c[0]}" stroke-width="2.4"/>` },
  { n: 'Gola de penas', d: k => [[-1, 0], [1, 0]].map(([m]) => Array.from({ length: 5 }, (_, i) => `<path d="M${150 + m * (6 + i * 7)} 206 q${m * 6} 10 ${m * 2} 22 q${-m * 6} -8 ${-m * 4} -20Z" fill="${i % 2 ? k.c[1] : k.c[0]}" ${ol(k, 1.6)}/>`).join('')).join('') },
  { n: 'Colar de cruz', d: k => `<path d="M136 204 Q150 236 164 204" stroke="${k.c[0]}" stroke-width="1.8" fill="none"/><path d="M147 226 L153 226 L153 232 L159 232 L159 238 L153 238 L153 250 L147 250 L147 238 L141 238 L141 232 L147 232Z" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Laço grande com caudas', d: k => P(k, 'M150 214 Q124 196 118 212 Q122 230 150 218Z M150 214 Q176 196 182 212 Q178 230 150 218Z') + P(k, 'M146 218 Q138 244 130 262 L138 262 L148 226Z M154 218 Q162 244 170 262 L162 262 L152 226Z') + `<rect x="144" y="208" width="12" height="12" rx="4" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Estola', d: k => P(k, 'M124 206 Q150 196 176 206 Q186 230 180 262 L168 262 Q168 232 150 222 Q132 232 132 262 L120 262 Q114 230 124 206Z') + `<path d="M126 216 Q124 238 126 258 M174 216 Q176 238 174 258" stroke="${k.c[2]}" stroke-width="1.4" fill="none" opacity=".4"/>` },
  { n: 'Colar de pérolas', d: k => Array.from({ length: 13 }, (_, i) => { const t = i / 12, x = 134 + t * 32, y = 204 + Math.sin(t * Math.PI) * 18; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${k.c[0]}" ${ol(k, 1.2)}/><circle cx="${(x - 1).toFixed(1)}" cy="${(y - 1).toFixed(1)}" r="1" fill="#fff" opacity=".8"/>`; }).join('') },
  /* ---- rodada 2 ---- */
  { n: 'Colar de estrela', d: k => `<path d="M136 204 Q150 234 164 204" stroke="${k.c[0]}" stroke-width="1.8" fill="none"/><path d="${Shape.star(150, 234, 7, 3)}" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Coleira com plaquinha', d: k => P(k, 'M140 196 Q150 200 160 196 L160 204 Q150 208 140 204Z') + `<circle cx="150" cy="212" r="5" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Gravata listrada', d: k => P(k, 'M146 208 L154 208 L152 216 L158 262 L150 272 L142 262 L148 216Z') + [228, 240, 252].map(y => `<path d="M144 ${y + 4} L156 ${y - 2}" stroke="${k.c[1]}" stroke-width="3"/>`).join('') },
  { n: 'Fones no pescoço', d: k => `<path d="M126 214 Q150 232 174 214" stroke="${k.c[2]}" stroke-width="7" fill="none"/><path d="M126 214 Q150 232 174 214" stroke="${k.c[0]}" stroke-width="4" fill="none"/>` + [122, 178].map(x => `<rect x="${x - 8}" y="206" width="16" height="20" rx="6" fill="${k.c[0]}" ${ol(k, 2)}/>`).join('') },
  { n: 'Gola marinheiro', d: k => P(k, 'M126 206 L150 236 L174 206 L184 216 L150 250 L116 216Z', k.c[0]) + `<path d="M122 214 L150 244 L178 214" stroke="${k.c[1]}" stroke-width="2" fill="none"/>` },
  { n: 'Cachecol de lã', d: k => P(k, 'M124 204 Q150 224 176 204 L178 220 Q150 240 122 220Z') + P(k, 'M134 222 L146 226 L142 270 L128 266Z') + [212, 218].map(y => `<path d="M126 ${y} Q150 ${y + 18} 174 ${y}" stroke="${k.c[1]}" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`).join('') },
  { n: 'Colar de dente', d: k => `<path d="M136 204 Q150 230 164 204" stroke="${k.c[2]}" stroke-width="1.8" fill="none"/><path d="M146 226 L150 242 L154 226Z" fill="#fff8e8" ${ol(k, 1.4)}/>` },
  { n: 'Lenço no pescoço', d: k => P(k, 'M128 204 L172 204 L164 216 L150 212 L136 216Z') + P(k, 'M150 212 L142 234 L150 228 L158 234Z', k.c[1]) },
  { n: 'Choker de spikes', d: k => P(k, 'M140 196 Q150 200 160 196 L160 204 Q150 208 140 204Z') + [142, 147, 152, 157].map(x => `<path d="M${x} 204 L${x + 1.5} 210 L${x + 3} 204Z" fill="#c8ccd8" ${ol(k, 1)}/>`).join('') },
  { n: 'Medalha', d: k => `<path d="M140 200 L146 228 M160 200 L154 228" stroke="${k.c[0]}" stroke-width="4"/><circle cx="150" cy="236" r="9" fill="${k.c[1]}" ${ol(k, 1.8)}/><path d="${Shape.star(150, 236, 4.4, 2)}" fill="${k.c[0]}"/>` },
  /* ---- rodada 3 (fase 5) ---- */
  { n: 'Cachecol listrado', d: k => P(k, 'M126 202 Q150 222 174 202 L176 216 Q150 236 124 216Z') + P(k, 'M160 214 L172 218 L176 262 L162 262Z') + [226, 238, 250].map(y => `<path d="M161 ${y} L175 ${y}" stroke="${k.c[1]}" stroke-width="4"/>`).join('') + `<path d="M130 208 Q150 222 170 208" stroke="${k.c[1]}" stroke-width="4" fill="none"/>` },
  { n: 'Gola de pelo', d: k => Array.from({ length: 8 }, (_, i) => `<circle cx="${122 + i * 8}" cy="${210 + Math.sin(i * Math.PI / 7) * 8}" r="7" fill="${k.c[0]}" ${ol(k, 1.6)}/>`).join('') },
  { n: 'Lenço de caubói', d: k => P(k, 'M126 204 Q150 214 174 204 L150 240Z') + [[140, 214], [158, 216], [150, 228]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${k.c[1]}"/>`).join('') },
  { n: 'Colar de pérolas curto', d: k => Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = 134 + 32 * t, y = 206 + Math.sin(t * Math.PI) * 18; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${k.c[0]}" ${ol(k, 1)}/>`; }).join('') },
  { n: 'Coleira com sino', d: k => P(k, 'M140 197 L160 197 L160 205 L140 205Z') + `<circle cx="150" cy="211" r="5.5" fill="#ffd23f" ${ol(k, 1.6)}/><path d="M146 212 L154 212" stroke="${k.c[2]}" stroke-width="1.2"/>` },
  { n: 'Gravata comprida', d: k => P(k, 'M145 206 L155 206 L153 214 L147 214Z') + P(k, 'M147 214 L153 214 L158 258 L150 266 L142 258Z') + `<path d="M144 230 L156 226 M144 244 L157 240" stroke="${k.c[1]}" stroke-width="3"/>` },
  { n: 'Cachecol grande', d: k => P(k, 'M120 200 Q150 230 180 200 L184 222 Q150 250 116 222Z') + P(k, 'M126 222 L144 230 L140 272 L122 268Z') + `<path d="M124 262 L142 266" stroke="${k.c[1]}" stroke-width="3"/>` },
  { n: 'Colar de coração', d: k => `<path d="M136 206 Q150 234 164 206" stroke="${k.c[1]}" stroke-width="1.8" fill="none"/><path d="${Shape.heart(150, 232, 5.5)}" fill="${k.c[0]}" ${ol(k, 1.4)}/>` },
  { n: 'Laço no pescoço', d: k => P(k, 'M150 212 L134 202 L132 222Z M150 212 L166 202 L168 222Z') + P(k, 'M147 214 L140 236 L146 234 L150 214Z M153 214 L160 236 L154 234 L150 214Z') + `<circle cx="150" cy="212" r="4" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Gola de marinheiro listrada', d: k => P(k, 'M122 206 L178 206 L172 226 L150 244 L128 226Z', k.c[0]) + `<path d="M128 214 L150 236 L172 214" stroke="${k.c[1]}" stroke-width="2.4" fill="none"/>` },
];

PARTS.logo = [null,
  { n: 'Estrela', d: k => `<path d="${Shape.star(160, 240, 9, 4)}" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Coração', d: k => `<path d="${Shape.heart(160, 241, 7)}" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Raio', d: k => `<path d="M162 228 L152 243 L159 243 L155 254 L167 238 L160 238Z" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Lua', d: k => `<path d="M162 230 A11 11 0 1 0 162 252 A8 8 0 1 1 162 230Z" fill="${k.c[0]}" ${ol(k, 1.6)}/>` },
  { n: 'Caveira', d: k => `<path d="M151 238 C151 228 169 228 169 238 C169 244 165 246 165 250 L155 250 C155 246 151 244 151 238Z" fill="${k.c[0]}" ${ol(k, 1.6)}/><circle cx="156" cy="239" r="2.2" fill="${k.c[2]}"/><circle cx="164" cy="239" r="2.2" fill="${k.c[2]}"/>` },
  { n: 'Nota musical', d: k => `<path d="M163 228 L163 248" stroke="${k.c[0]}" stroke-width="3"/><path d="M163 228 L171 232" stroke="${k.c[0]}" stroke-width="3"/><ellipse cx="159" cy="249" rx="5" ry="4" fill="${k.c[0]}"/>` },
  { n: 'Planeta', d: k => `<circle cx="160" cy="241" r="7" fill="${k.c[0]}" ${ol(k, 1.4)}/><ellipse cx="160" cy="241" rx="13" ry="4" fill="none" stroke="${k.c[1]}" stroke-width="2" transform="rotate(-20 160 241)"/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Árvore', d: k => `<rect x="158" y="244" width="4" height="10" fill="${k.c[0]}"/><circle cx="160" cy="238" r="8" fill="${k.c[0]}"/><circle cx="154" cy="242" r="5" fill="${k.c[0]}"/><circle cx="166" cy="242" r="5" fill="${k.c[0]}"/>` },
  { n: 'Câmera', d: k => `<rect x="149" y="235" width="22" height="15" rx="3" fill="${k.c[0]}"/><rect x="154" y="232" width="7" height="4" rx="1" fill="${k.c[0]}"/><circle cx="160" cy="242.5" r="4.4" fill="${k.c[1]}"/><circle cx="160" cy="242.5" r="2.2" fill="${k.c[0]}"/>` },
  { n: 'Engrenagem', d: k => `<g transform="translate(160 242)">${Array.from({ length: 8 }, (_, i) => `<rect x="-2" y="-11" width="4" height="5" fill="${k.c[0]}" transform="rotate(${i * 45})"/>`).join('')}<circle r="7.4" fill="${k.c[0]}"/><circle r="3" fill="${k.c[1]}"/></g>` },
  { n: 'Controle', d: k => `<rect x="147" y="236" width="26" height="13" rx="6.5" fill="${k.c[0]}"/><path d="M152 242.5 L158 242.5 M155 239.5 L155 245.5" stroke="${k.c[1]}" stroke-width="1.8"/><circle cx="165" cy="241" r="1.6" fill="${k.c[1]}"/><circle cx="168" cy="244" r="1.6" fill="${k.c[1]}"/>` },
  { n: 'Casinha', d: k => `<path d="M160 230 L172 241 L168 241 L168 252 L152 252 L152 241 L148 241Z" fill="${k.c[0]}"/><rect x="157" y="245" width="6" height="7" fill="${k.c[1]}"/>` },
  { n: 'Espada', d: k => `<g transform="rotate(40 160 242)"><rect x="158.5" y="228" width="3" height="18" fill="${k.c[0]}"/><path d="M158.5 228 L160 224 L161.5 228Z" fill="${k.c[0]}"/><rect x="154" y="246" width="12" height="3" fill="${k.c[0]}"/><rect x="158.5" y="249" width="3" height="6" fill="${k.c[0]}"/></g>` },
  { n: 'Olho', d: k => `<path d="M148 242 Q160 232 172 242 Q160 252 148 242Z" fill="none" stroke="${k.c[0]}" stroke-width="2.4"/><circle cx="160" cy="242" r="3.4" fill="${k.c[0]}"/>` },
  { n: 'Troféu', d: k => `<path d="M152 232 L168 232 L166 242 Q160 248 154 242Z" fill="${k.c[0]}"/><path d="M152 234 Q146 234 148 240 Q150 242 153 241 M168 234 Q174 234 172 240 Q170 242 167 241" stroke="${k.c[0]}" stroke-width="1.8" fill="none"/><rect x="158.5" y="246" width="3" height="4" fill="${k.c[0]}"/><rect x="154" y="250" width="12" height="3" fill="${k.c[0]}"/>` },
  { n: 'Gota', d: k => `<path d="M160 230 Q170 242 168 248 Q166 254 160 254 Q154 254 152 248 Q150 242 160 230Z" fill="${k.c[0]}"/><path d="M156 246 Q156 250 159 251" stroke="${k.c[1]}" stroke-width="1.6" fill="none"/>` },
  { n: 'Folha', d: k => `<path d="M150 252 Q148 232 170 230 Q172 250 150 252Z" fill="${k.c[0]}"/><path d="M151 251 Q158 242 166 234" stroke="${k.c[1]}" stroke-width="1.4" fill="none"/>` },
  /* ---- rodada 2 ---- */
  { n: 'Gatinho', d: k => `<circle cx="160" cy="244" r="8" fill="${k.c[0]}"/><path d="M153 239 L154 230 L160 236 L166 230 L167 239Z" fill="${k.c[0]}"/><circle cx="157" cy="243" r="1.4" fill="${k.c[1]}"/><circle cx="163" cy="243" r="1.4" fill="${k.c[1]}"/>` },
  { n: 'Arco-íris', d: k => ['#ff5a5a', '#ffd23f', '#5ac8ff'].map((c2, i) => `<path d="M${148 + i * 3} 250 A${12 - i * 3} ${12 - i * 3} 0 0 1 ${172 - i * 3} 250" stroke="${c2}" stroke-width="3" fill="none"/>`).join('') },
  { n: 'Flor', d: k => [0, 72, 144, 216, 288].map(a => `<circle cx="${(160 + Math.cos(a * Math.PI / 180) * 6).toFixed(1)}" cy="${(242 + Math.sin(a * Math.PI / 180) * 6).toFixed(1)}" r="4.6" fill="${k.c[0]}"/>`).join('') + `<circle cx="160" cy="242" r="3" fill="${k.c[1]}"/>` },
  { n: 'Coroa', d: k => `<path d="M149 250 L148 236 L154 242 L160 232 L166 242 L172 236 L171 250Z" fill="${k.c[0]}"/>` },
  { n: 'Diamante', d: k => `<path d="M152 236 L168 236 L172 241 L160 254 L148 241Z" fill="${k.c[0]}"/><path d="M148 241 L172 241 M156 236 L160 254 L164 236" stroke="${k.c[1]}" stroke-width="1" fill="none"/>` },
  { n: 'Pata', d: k => `<ellipse cx="160" cy="246" rx="6" ry="5" fill="${k.c[0]}"/>` + [[152, 238], [158, 234], [165, 235], [170, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${k.c[0]}"/>`).join('') },
  { n: 'Cogumelo', d: k => `<path d="M149 242 Q150 230 160 230 Q170 230 171 242Z" fill="${k.c[0]}"/><rect x="156" y="242" width="8" height="9" rx="2" fill="${k.c[1]}"/><circle cx="156" cy="236" r="2" fill="#fff"/><circle cx="165" cy="235" r="1.6" fill="#fff"/>` },
  { n: 'Número 7', d: k => `<text x="160" y="252" text-anchor="middle" font-size="22" font-weight="700" font-family="sans-serif" fill="${k.c[0]}">7</text>` },
  { n: 'Cruz vermelha', d: k => `<path d="M157 234 L163 234 L163 239 L168 239 L168 245 L163 245 L163 250 L157 250 L157 245 L152 245 L152 239 L157 239Z" fill="${k.c[0]}"/>` },
  { n: 'Asas', d: k => [-1, 1].map(m => `<path d="M160 242 Q${160 + m * 10} 232 ${160 + m * 16} 236 Q${160 + m * 12} 240 ${160 + m * 14} 244 Q${160 + m * 8} 246 160 244Z" fill="${k.c[0]}"/>`).join('') },
  /* ---- padrões do Gacha Club ---- */
  { n: 'Planeta do clube', d: k => `<circle cx="160" cy="241" r="9.5" fill="${k.c[0]}"/><circle cx="160" cy="241" r="7" fill="${k.c[1]}"/><path d="M151 245 Q160 236 170 234 Q162 242 152 248Z" fill="${k.c[0]}"/>` },
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
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Boca de sino', d: (k, L) => L.band(k, -.2, .5, 1.6, 1.5) + L.band(k, .46, 1.04, 1.5, 9) + L.line(k, 1.01, 8.6, k.c[1], 1.3) },
  { n: 'Punho de babado', d: (k, L) => L.band(k, -.2, .84, 1.6, 1.4) + L.band(k, .82, .9, 2.4, 3, k.c[1]) + L.band(k, .88, 1.02, 3, 6.4, k.c[1]) },
  { n: 'Dobrada', d: (k, L) => L.band(k, -.2, .5, 1.8, 1.5) + L.band(k, .42, .56, 2.8, 2.8, Color.shade(k.c[0], -12)) },
  { n: 'Franzida', d: (k, L) => L.band(k, -.2, .97, 1.6, 1.3) + [.12, .24, .36, .5, .64, .78, .9].map(t => L.line(k, t, 1.8, k.c[2], .5)).join('') },
  { n: 'Ombro caído', d: (k, L) => L.band(k, .12, .97, 1.2, 1.3) + L.band(k, .08, .2, 2.4, 2.4, k.c[1]) },
  { n: 'Luva de braço', d: (k, L) => L.band(k, .55, 1, .6, .8) + L.line(k, .56, 1, k.c[1], 1.4) },
  { n: 'Com listra lateral', d: (k, L) => L.band(k, -.2, .97, 1.6, 1.3) + `<path d="M${L.pt(0).x - 2} ${L.pt(0).y} L${L.pt(.5).x - 2} ${L.pt(.5).y}" stroke="${k.c[1]}" stroke-width="1.6"/>` },
  { n: 'Pétala', d: (k, L) => { const p = L.pt(.12); return L.band(k, -.2, .97, 1.2, 1.1) + [-1, 0, 1].map(m => `<path d="M${p.x + m * 6} ${p.y - 6} Q${p.x + m * 12} ${p.y + 4} ${p.x + m * 6} ${p.y + 12} Q${p.x + m * 2} ${p.y + 4} ${p.x + m * 6} ${p.y - 6}Z" fill="${k.c[1]}" ${ol(k, 1.4)}/>`).join(''); } },
  { n: 'Manguito de pelo', d: (k, L) => L.band(k, -.2, .84, 1.6, 1.4) + L.band(k, .8, 1.02, 3.6, 3.6, k.c[1]) + L.line(k, .86, 3.4, k.c[2], .4) + L.line(k, .94, 3.4, k.c[2], .4) },
  { n: 'Morcego', d: (k, L) => L.band(k, -.2, .97, 1.6, 1.3) + L.band(k, .1, .9, 1.6, 7) },
  /* ---- rodada 2 ---- */
  { n: 'Listrada larga', d: (k, L) => L.stripes(k, -.2, .97, 1.6, 1.3, .16, .08) },
  { n: 'Curta com barra', d: (k, L) => L.band(k, -.2, .3, 1.8, 1.6) + L.band(k, .24, .32, 2.2, 2.2, k.c[1]) },
  { n: 'Longa larga', d: (k, L) => L.band(k, -.2, .97, 2.4, 4) },
  { n: 'Com cotoveleira', d: (k, L) => L.band(k, -.2, .97, 1.6, 1.3) + L.patch(k, L.knee, 3.6, 3, k.c[1]) },
  { n: 'Tule', d: (k, L) => `<g opacity=".6">${L.band(k, -.2, .97, 2.4, 3.4)}</g>` },
  { n: 'Punho largo', d: (k, L) => L.band(k, -.2, .8, 1.6, 1.4) + L.band(k, .78, 1, 2.4, 4, k.c[1]) },
  { n: 'Três quartos', d: (k, L) => L.band(k, -.2, .72, 1.6, 1.4) + L.line(k, .7, 1.6, k.c[1], 1.2) },
  { n: 'Com laço no ombro', d: (k, L) => { const p = L.pt(.06); return L.band(k, -.2, .4, 1.8, 1.6) + `<path d="M${p.x} ${p.y} l-6 -4 l0 8Z M${p.x} ${p.y} l6 -4 l0 8Z" fill="${k.c[1]}" ${ol(k, 1)}/>`; } },
  { n: 'Xadrez', d: (k, L) => L.stripes(k, -.2, .97, 1.6, 1.3, .12, .04) + [-.5, .5].map(d => `<path d="M${(L.pt(0).x + d * 6).toFixed(1)} ${L.pt(0).y.toFixed(1)} L${(L.pt(.97).x + d * 5).toFixed(1)} ${L.pt(.97).y.toFixed(1)}" stroke="${k.c[1]}" stroke-width="1.2"/>`).join('') },
  { n: 'Asa de morcego curta', d: (k, L) => L.band(k, -.2, .5, 1.8, 6) },
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
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Camuflada', d: (k, L) => L.band(k, 0, .97, 1.6, 3.2) + [[.1, 3], [.22, -3], [.36, 2], [.5, -2], [.64, 3], [.8, -3], [.9, 2]].map(([t, dx]) => L.patch(k, t, 3.2, 2, Color.shade(k.c[0], -18)).replace(/cx="([\d.-]+)"/, (m, v) => `cx="${(+v + dx).toFixed(1)}"`)).join('') },
  { n: 'Cargo', d: (k, L) => L.band(k, 0, .97, 2, 3.4) + L.patch(k, .38, 4.2, 3, Color.shade(k.c[0], -10)) + L.line(k, .34, 4, k.c[2], .5) },
  { n: 'Barra dobrada', d: (k, L) => L.band(k, 0, .9, 1.6, 2.6) + L.band(k, .82, .92, 3, 3, Color.shade(k.c[0], 10)) },
  { n: 'Jeans com remendo', d: (k, L) => L.band(k, 0, .97, 1.6, 3.2) + L.patch(k, L.knee, 3.4, 3, k.c[1]) + L.line(k, .2, 2, k.c[2], .4) },
  { n: 'Short de cintura alta', d: (k, L) => L.band(k, 0, .3, 2.6, 3) + L.line(k, .06, 2.6, k.c[1], 1.2) + L.line(k, .26, 3, k.c[1], 1) },
  { n: 'Calça com listra', d: (k, L) => L.band(k, 0, .97, 1.4, 2.4) + `<path d="M${L.pt(0).x + L.pt(0).w / 2 - 1} ${L.pt(0).y} L${L.pt(.97).x + L.pt(.97).w / 2 - 1} ${L.pt(.97).y}" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Pantalona', d: (k, L) => L.band(k, 0, 1, 3, 12) + L.line(k, .5, 6, k.c[2], .4) },
  { n: 'Short jeans desfiado', d: (k, L) => L.band(k, 0, .22, 2.2, 2.6) + L.line(k, .23, 2.8, k.c[1], 1.4) + L.line(k, .25, 2.6, k.c[1], .8) },
  { n: 'Calça de moletom', d: (k, L) => L.band(k, 0, .88, 2, 3.4) + L.band(k, .86, .98, 1.6, 1.6, k.c[1]) },
  { n: 'Macacão de bolinhas', d: (k, L) => L.band(k, 0, .97, 1.6, 3.2) + [.12, .28, .44, .6, .76, .9].map((t, i) => L.patch(k, t, 1.6, 1.6, k.c[1]).replace(/cx="([\d.-]+)"/, (m, v) => `cx="${(+v + (i % 2 ? 3 : -3)).toFixed(1)}"`)).join('') },
  /* ---- rodada 2 ---- */
  { n: 'Calça xadrez', d: (k, L) => L.stripes(k, 0, .97, 1.6, 3.2, .1, .03) + `<path d="M${L.pt(0).x} ${L.pt(0).y} L${L.pt(.97).x} ${L.pt(.97).y}" stroke="${k.c[1]}" stroke-width="1.2"/>` },
  { n: 'Short esportivo', d: (k, L) => L.band(k, 0, .26, 2.6, 3) + `<path d="M${L.pt(0).x + L.pt(0).w / 2} ${L.pt(0).y} L${L.pt(.26).x + L.pt(.26).w / 2 + 2} ${L.pt(.26).y}" stroke="${k.c[1]}" stroke-width="2"/>` },
  { n: 'Calça skinny', d: (k, L) => L.band(k, 0, .97, .8, .9) },
  { n: 'Calça bailarina', d: (k, L) => L.band(k, 0, .9, 2, 3) + L.band(k, .88, .98, 1.4, 1.4, k.c[1]) },
  { n: 'Legging de estrelas', d: (k, L) => L.band(k, 0, .96, .6, .6) + [.1, .3, .5, .7, .88].map((t, i) => { const p = L.pt(t); return `<path d="${Shape.star(p.x + (i % 2 ? 2 : -2), p.y, 2.4, 1)}" fill="${k.c[1]}"/>`; }).join('') },
  { n: 'Bermuda cargo', d: (k, L) => L.band(k, 0, .5, 2.4, 3) + L.patch(k, .34, 3.6, 2.6, Color.shade(k.c[0], -10)) },
  { n: 'Calça de pijama', d: (k, L) => L.band(k, 0, .97, 2, 3.6) + [.2, .45, .7, .9].map((t, i) => L.patch(k, t, 2, 2, k.c[1]).replace(/cx="([\d.-]+)"/, (m, v) => `cx="${(+v + (i % 2 ? 3 : -3)).toFixed(1)}"`)).join('') },
  { n: 'Short com cinto', d: (k, L) => L.band(k, 0, .24, 2.2, 2.6) + L.band(k, 0, .05, 2.6, 2.6, k.c[1]) },
  { n: 'Calça de couro', d: (k, L) => L.band(k, 0, .97, 1, 1.4) + `<path d="M${L.pt(.1).x - 3} ${L.pt(.1).y} L${L.pt(.9).x - 3} ${L.pt(.9).y}" stroke="#fff" stroke-width="1.4" opacity=".35"/>` },
  { n: 'Calça degradê', d: (k, L) => { const id = k.u + 'pg'; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.c[0]}"/><stop offset="1" stop-color="${k.c[1]}"/></linearGradient></defs>` + L.band(k, 0, .97, 1.6, 3.2).replace(`fill="${k.c[0]}"`, `fill="url(#${id})"`); } },
];

PARTS.sock = [null,
  { n: 'Curta', d: (k, L) => L.band(k, .86, 1, .7, .8) },
  { n: '3/4', d: (k, L) => L.band(k, .6, 1, .8, .8) + L.band(k, .6, .66, 1.3, 1.3, k.c[1]) },
  { n: 'Alta', d: (k, L) => L.band(k, .36, 1, .8, .8) + L.band(k, .36, .42, 1.3, 1.3, k.c[1]) },
  { n: 'Listrada alta', d: (k, L) => L.stripes(k, .36, 1, .8, .8, .08, .04) },
  { n: 'Meia-calça', d: (k, L) => L.band(k, 0, 1, .4, .5) },
  { n: 'Polaina', d: (k, L) => L.band(k, .6, .94, 2.6, 3.2) + [.68, .76, .84].map(t => L.line(k, t, 2.8, k.c[1], .9)).join('') },
  { n: 'Soquete babado', d: (k, L) => L.band(k, .84, .9, 2.2, 2.4, k.c[1]) + L.band(k, .88, 1, .7, .8) },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Arrastão', d: (k, L) => { const id = k.u + 'an'; let n = ''; for (let i = -6; i < 16; i++) n += `<path d="M${-12 + i * 3} ${-4} l30 90 M${18 + i * 3} ${-4} l-30 90" stroke="${k.c[0]}" stroke-width=".8"/>`; return `<clipPath id="${id}"><path d="${L.band(k, .05, 1, .3, .4).match(/d="([^"]+)"/)[1]}"/></clipPath><g clip-path="url(#${id})">${n}</g>`; } },
  { n: 'Meia de corações', d: (k, L) => L.band(k, .4, 1, .8, .8) + [.5, .62, .74, .86].map((t, i) => { const p = L.pt(t); return `<path d="${Shape.heart(p.x + (i % 2 ? 2 : -2), p.y, 1.8)}" fill="${k.c[1]}"/>`; }).join('') },
  { n: 'Degradê', d: (k, L) => { const id = k.u + 'dg'; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.c[0]}" stop-opacity="0"/><stop offset=".45" stop-color="${k.c[0]}"/><stop offset="1" stop-color="${k.c[1]}"/></linearGradient></defs>` + L.band(k, .3, 1, .6, .7).replace(`fill="${k.c[0]}"`, `fill="url(#${id})"`); } },
  { n: 'Meia com laço', d: (k, L) => { const p = L.pt(.7); return L.band(k, .7, 1, .7, .8) + L.band(k, .68, .74, 1.4, 1.4, k.c[1]) + `<path d="M${p.x} ${p.y} l-5 -3 l0 6Z M${p.x} ${p.y} l5 -3 l0 6Z" fill="${k.c[1]}" ${ol(k, 1)}/>`; } },
  { n: 'Listrada fina', d: (k, L) => L.stripes(k, .5, 1, .7, .8, .045, .02) },
  { n: 'Polaina de lã', d: (k, L) => L.band(k, .55, .96, 3, 3.6) + [.6, .66, .72, .78, .84, .9].map(t => L.line(k, t, 3.4, k.c[2], .4)).join('') },
  { n: 'Até o joelho com faixa', d: (k, L) => L.band(k, L.knee - .02, 1, .8, .8) + L.band(k, L.knee - .02, L.knee + .06, 1.2, 1.2, k.c[1]) + L.band(k, L.knee + .08, L.knee + .12, 1.2, 1.2, k.c[1]) },
  { n: 'Coxa com renda', d: (k, L) => L.band(k, .2, 1, .6, .8) + L.band(k, .18, .25, 1.4, 1.4, k.c[1]) },
  { n: 'Meia de oncinha', d: (k, L) => L.band(k, .45, 1, .8, .8) + [.52, .62, .72, .82, .92].map((t, i) => L.patch(k, t, 1.6, 1.1, k.c[1]).replace(/cx="([\d.-]+)"/, (m, v) => `cx="${(+v + (i % 2 ? 2.4 : -2.4)).toFixed(1)}"`)).join('') },
  { n: 'Meia-calça de estrelas', d: (k, L) => L.band(k, 0, 1, .4, .5) + [.12, .3, .48, .66, .84].map((t, i) => { const p = L.pt(t); return `<path d="${Shape.star(p.x + (i % 2 ? 2 : -2), p.y, 2, .8)}" fill="${k.c[1]}"/>`; }).join('') },
  /* ---- rodada 2 ---- */
  { n: 'Meia de xadrez', d: (k, L) => L.stripes(k, .45, 1, .8, .8, .08, .03) },
  { n: 'Meia com babado alta', d: (k, L) => L.band(k, .4, 1, .8, .8) + L.band(k, .38, .46, 2.4, 2.4, k.c[1]) },
  { n: 'Meia de dedinho', d: (k, L) => L.band(k, .82, 1, .7, .8) + L.line(k, .84, .9, k.c[1], .8) },
  { n: 'Meia listrada vertical', d: (k, L) => L.band(k, .4, 1, .8, .8) + [-1, 1].map(d => `<path d="M${(L.pt(.42).x + d * 3).toFixed(1)} ${L.pt(.42).y.toFixed(1)} L${(L.pt(.98).x + d * 2).toFixed(1)} ${L.pt(.98).y.toFixed(1)}" stroke="${k.c[1]}" stroke-width="1.4"/>`).join('') },
  { n: 'Meia-calça rendada', d: (k, L) => `<g opacity=".75">${L.band(k, 0, 1, .4, .5)}</g>` + [.2, .4, .6, .8].map(t => L.line(k, t, .5, k.c[1], .5)).join('') },
  { n: 'Meia com pompom', d: (k, L) => { const p = L.pt(.78); return L.band(k, .78, 1, .7, .8) + `<circle cx="${(p.x + p.w / 2).toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.6" fill="${k.c[1]}" ${ol(k, 1)}/>`; } },
  { n: 'Meia de listras coloridas', d: (k, L) => L.band(k, .45, 1, .8, .8) + [.5, .58, .66, .74, .82, .9].map((t, i) => L.line(k, t, .8, ['#ff5a5a', '#ffd23f', '#5ac8ff'][i % 3], 1.2)).join('') },
  { n: 'Caneleira', d: (k, L) => L.band(k, L.knee + .04, .9, 1.6, 1.6) + L.line(k, L.knee + .1, 1.6, k.c[1], .8) + L.line(k, .84, 1.6, k.c[1], .8) },
  { n: 'Meia-calça degradê', d: (k, L) => { const id = k.u + 'mg'; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.c[1]}"/><stop offset="1" stop-color="${k.c[0]}"/></linearGradient></defs>` + L.band(k, 0, 1, .4, .5).replace(`fill="${k.c[0]}"`, `fill="url(#${id})"`); } },
  { n: 'Meia com estrela', d: (k, L) => { const p = L.pt(.7); return L.band(k, .55, 1, .8, .8) + `<path d="${Shape.star(p.x, p.y, 3, 1.2)}" fill="${k.c[1]}"/>`; } },
  /* ---- padrões do Gacha Club ---- */
  { n: 'Até o joelho com borda', d: (k, L) => L.band(k, L.knee - .02, 1, .8, .8) + L.band(k, L.knee - .02, L.knee + .05, 1.2, 1.2, k.c[1]) },
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
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Coturno', d: k => P(k, tube(LS - 22, LS - 2, 19, 19)) + shoeBase(k) + P(k, `M-12 ${LS + 7} L12 ${LS + 7} L12 ${LS + 12} L-12 ${LS + 12}Z`, Color.shade(k.c[0], -30)) + [LS - 18, LS - 12, LS - 6].map(y => `<path d="M-4 ${y} L4 ${y + 3} M4 ${y} L-4 ${y + 3}" stroke="${k.c[1]}" stroke-width="1.2"/>`).join('') },
  { n: 'Chinelo de ursinho', d: k => { const o = -(G.toe || 0) * 3; return `<g transform="translate(${o} 0)"><ellipse cx="0" cy="${LS + 4}" rx="13" ry="9" fill="${k.c[0]}" ${ol(k, 2.2)}/><circle cx="-8" cy="${LS - 3}" r="3.4" fill="${k.c[0]}" ${ol(k, 1.6)}/><circle cx="8" cy="${LS - 3}" r="3.4" fill="${k.c[0]}" ${ol(k, 1.6)}/><circle cx="-3" cy="${LS + 2}" r="1.3" fill="${k.c[2]}"/><circle cx="3" cy="${LS + 2}" r="1.3" fill="${k.c[2]}"/><ellipse cx="0" cy="${LS + 5}" rx="2.4" ry="1.6" fill="${k.c[1]}"/></g>`; } },
  { n: 'Botinha de cano alto', d: k => P(k, tube(LS - 26, LS - 2, 17, 18)) + shoeBase(k) + P(k, tube(LS - 28, LS - 22, 20, 19), k.c[1]) },
  { n: 'Patins', d: k => shoeBase(k) + P(k, tube(LS - 16, LS - 2, 18, 18)) + `<rect x="-11" y="${LS + 10}" width="22" height="3" fill="#9aa0b0" ${ol(k, 1.2)}/><circle cx="-7" cy="${LS + 15}" r="3.4" fill="${k.c[1]}" ${ol(k, 1.4)}/><circle cx="7" cy="${LS + 15}" r="3.4" fill="${k.c[1]}" ${ol(k, 1.4)}/>` },
  { n: 'Plataforma', d: k => shoeBase(k) + P(k, `M-12 ${LS + 8} L12 ${LS + 8} L12 ${LS + 16} L-12 ${LS + 16}Z`, k.c[1]) },
  { n: 'Tênis de cano alto', d: k => P(k, tube(LS - 18, LS - 2, 18, 18)) + shoeBase(k) + P(k, `M-12 ${LS + 6} L12 ${LS + 6} L12 ${LS + 11} L-12 ${LS + 11}Z`, '#fff') + `<circle cx="0" cy="${LS - 12}" r="3.4" fill="${k.c[1]}" ${ol(k, 1.2)}/>` + [LS - 6, LS - 2].map(y => `<path d="M-4 ${y} L4 ${y}" stroke="${k.c[1]}" stroke-width="1.6"/>`).join('') },
  { n: 'Sapatilha com laço', d: k => shoeBase(k) + `<path d="M0 ${LS - 3} l-6 -3 l0 6Z M0 ${LS - 3} l6 -3 l0 6Z" fill="${k.c[1]}" ${ol(k, 1.2)}/><circle cx="0" cy="${LS - 3}" r="1.6" fill="${k.c[1]}"/>` },
  { n: 'Bota de chuva com bolinhas', d: k => P(k, tube(8, LS - 2, 19, 18)) + shoeBase(k) + [[-4, 16], [4, 26], [-3, 36], [5, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${k.c[1]}"/>`).join('') },
  { n: 'Sandália de tiras', d: k => { const o = -(G.toe || 0) * 2.5; return `<ellipse cx="${o}" cy="${LS + 4}" rx="8" ry="6" fill="${k.S}" stroke="${k.SO}" stroke-width="2"/>` + P(k, `M${-11 + o} ${LS + 7} L${11 + o} ${LS + 7} L${11 + o} ${LS + 12} L${-11 + o} ${LS + 12}Z`, k.c[1]) + [LS - 4, LS, LS + 4].map(y => `<path d="M${-8 + o} ${y} L${8 + o} ${y}" stroke="${k.c[0]}" stroke-width="2.4"/>`).join('') + `<path d="M${o} ${LS - 14} L${o} ${LS - 4}" stroke="${k.c[0]}" stroke-width="2.4"/>`; } },
  { n: 'Tamanco', d: k => shoeBase(k) + P(k, `M-12 ${LS + 7} L12 ${LS + 7} L10 ${LS + 16} L-10 ${LS + 16}Z`, '#c8905a') + `<path d="M-10 ${LS + 11} L10 ${LS + 11}" stroke="#8a5a2a" stroke-width="1.2"/>` },
  /* ---- rodada 2 ---- */
  { n: 'Mocassim', d: k => shoeBase(k) + `<path d="M-6 ${LS - 1} Q0 ${LS + 2} 6 ${LS - 1}" stroke="${k.c[1]}" stroke-width="1.6" fill="none"/>` },
  { n: 'Tênis de velcro', d: k => shoeBase(k) + P(k, `M-12 ${LS + 6} L12 ${LS + 6} L12 ${LS + 11} L-12 ${LS + 11}Z`, '#fff') + [LS - 3, LS + 1].map(y => `<rect x="-6" y="${y - 1.5}" width="12" height="3" fill="${k.c[1]}"/>`).join('') },
  { n: 'Bota de cowboy', d: k => P(k, tube(LS - 26, LS - 2, 18, 17)) + shoeBase(k) + `<path d="M-6 ${LS - 20} Q0 ${LS - 14} 6 ${LS - 20}" stroke="${k.c[1]}" stroke-width="1.6" fill="none"/>` + P(k, `M4 ${LS + 8} L10 ${LS + 8} L9 ${LS + 14} L5 ${LS + 14}Z`, k.c[1]) },
  { n: 'Chinelo', d: k => { const o = -(G.toe || 0) * 2.5; return `<ellipse cx="${o}" cy="${LS + 4}" rx="8" ry="6" fill="${k.S}" stroke="${k.SO}" stroke-width="2"/>` + P(k, `M${-11 + o} ${LS + 8} L${11 + o} ${LS + 8} L${11 + o} ${LS + 12} L${-11 + o} ${LS + 12}Z`) + `<path d="M${o} ${LS} L${-7 + o} ${LS + 8} M${o} ${LS} L${7 + o} ${LS + 8}" stroke="${k.c[1]}" stroke-width="2.4"/>`; } },
  { n: 'Sapato de verniz', d: k => shoeBase(k) + `<path d="M-6 ${LS - 3} Q-2 ${LS - 5} 2 ${LS - 3}" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>` + P(k, `M-4 ${LS + 7} L4 ${LS + 7} L3 ${LS + 13} L-3 ${LS + 13}Z`, k.c[1]) },
  { n: 'Bota de neve', d: k => P(k, tube(LS - 20, LS - 2, 20, 20)) + shoeBase(k) + Array.from({ length: 5 }, (_, i) => `<circle cx="${-8 + i * 4}" cy="${LS - 20}" r="3.4" fill="${k.c[1]}"/>`).join('') },
  { n: 'Sapato de palhaço', d: k => { const t = G.toe || 0; return `<ellipse cx="${-t * 6}" cy="${LS + 4}" rx="${t ? 16 : 13}" ry="8" fill="${k.c[0]}" ${ol(k, 2.4)}/><ellipse cx="${-t * 8}" cy="${LS + 1}" rx="4" ry="2.4" fill="#fff" opacity=".6"/>`; } },
  { n: 'Tênis de luz', d: k => shoeBase(k) + P(k, `M-12 ${LS + 6} L12 ${LS + 6} L12 ${LS + 11} L-12 ${LS + 11}Z`, k.c[1]) + [-7, 0, 7].map(x => `<circle cx="${x}" cy="${LS + 8.5}" r="1.4" fill="#fff" class="anim-tw"/>`).join('') },
  { n: 'Botinha de fada', d: k => P(k, tube(LS - 14, LS - 2, 16, 16)) + shoeBase(k) + `<path d="M-8 ${LS - 14} L-10 ${LS - 20} L-4 ${LS - 14} M8 ${LS - 14} L10 ${LS - 20} L4 ${LS - 14}" fill="${k.c[1]}" ${ol(k, 1.2)}/>` },
  { n: 'Bota militar', d: k => P(k, tube(LS - 24, LS - 2, 19, 19)) + shoeBase(k) + P(k, `M-12 ${LS + 7} L12 ${LS + 7} L12 ${LS + 12} L-12 ${LS + 12}Z`, '#2b2140') + [LS - 20, LS - 14, LS - 8].map(y => `<path d="M-6 ${y} L6 ${y}" stroke="${k.c[1]}" stroke-width="1.6"/>`).join('') },
];

PARTS.glove = [null,
  { n: 'Curta', d: k => ({ f: P(k, tube(AF - 7, AF + 1, 15, 15)), hand: k.c[0] }) },
  { n: 'Longa', d: k => ({ f: P(k, tube(-2, AF + 1, 15, 14)) + `<path d="M-7 2 L7 2" stroke="${k.c[1]}" stroke-width="3"/>`, hand: k.c[0] }) },
  { n: 'Sem dedos', d: k => ({ f: P(k, tube(AF - 7, AF + 1, 15, 15)), hand: k.c[0], after: `<circle cx="0" cy="${AF + 10}" r="3.6" fill="${k.S}"/>` }) },
  { n: 'Garras', d: k => ({ f: P(k, tube(AF - 9, AF + 1, 15, 15)), hand: k.c[0], after: `<path d="M-5 ${AF + 10} l-2 7 M0 ${AF + 12} l0 7 M5 ${AF + 10} l2 7" stroke="${k.c[1]}" stroke-width="2.4" stroke-linecap="round"/>` }) },
  { n: 'Boxe', d: k => ({ f: P(k, tube(AF - 6, AF + 1, 16, 16), k.c[1]), hand: k.c[0], big: true }) },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Luva de patinha', d: k => ({ f: P(k, tube(AF - 7, AF + 1, 15, 15)), hand: k.c[0], after: `<circle cx="0" cy="${AF + 8}" r="3" fill="${k.c[1]}"/>` + [-4, 0, 4].map(x => `<circle cx="${x}" cy="${AF + 3}" r="1.6" fill="${k.c[1]}"/>`).join(''), big: true }) },
  { n: 'Mitene', d: k => ({ f: P(k, tube(AF - 8, AF + 1, 15, 15)) + `<path d="M-7 ${AF - 4} L7 ${AF - 4}" stroke="${k.c[1]}" stroke-width="2.4"/>`, hand: k.c[0], big: true }) },
  { n: 'Punho de babado', d: k => ({ f: P(k, tube(AF - 4, AF + 1, 15, 15)) + P(k, tube(AF - 8, AF - 3, 14, 20), k.c[1]), hand: k.S }) },
  { n: 'Munhequeira', d: k => ({ f: P(k, tube(AF - 8, AF - 1, 15, 15)) + `<path d="M-7 ${AF - 5} L7 ${AF - 5}" stroke="${k.c[1]}" stroke-width="2"/>`, hand: k.S }) },
  { n: 'Luva de renda', d: k => ({ f: P(k, tube(-2, AF + 1, 14, 14), k.c[0]) + [4, 12, 20, 28].map(y => `<path d="M-6 ${y} q3 3 6 0 q3 3 6 0" stroke="${k.c[1]}" stroke-width="1.2" fill="none"/>`).join(''), hand: k.c[0] }) },
  { n: 'Luva de forno', d: k => ({ f: P(k, tube(AF - 10, AF + 1, 17, 17)) + [AF - 7, AF - 3].map(y => `<path d="M-8 ${y} L8 ${y}" stroke="${k.c[1]}" stroke-width="1.6" stroke-dasharray="2 2"/>`).join(''), hand: k.c[0], big: true }) },
  { n: 'Algema de ouro', d: k => ({ f: P(k, tube(AF - 7, AF - 1, 16, 16), k.c[1]) + `<circle cx="0" cy="${AF - 4}" r="1.8" fill="${k.c[0]}"/>`, hand: k.S }) },
  { n: 'Luva de motoqueiro', d: k => ({ f: P(k, tube(AF - 8, AF + 1, 16, 16)), hand: k.c[0], after: `<path d="M-5 ${AF + 3} L5 ${AF + 3}" stroke="${k.c[1]}" stroke-width="2"/>` }) },
  { n: 'Luvas de lã listradas', d: k => ({ f: P(k, tube(AF - 10, AF + 1, 16, 16)) + [AF - 8, AF - 4, AF].map(y => `<path d="M-8 ${y} L8 ${y}" stroke="${k.c[1]}" stroke-width="2"/>`).join(''), hand: k.c[0], big: true }) },
  { n: 'Garras de monstro', d: k => ({ f: P(k, tube(AF - 9, AF + 1, 16, 16)), hand: k.c[0], big: true, after: [-6, 0, 6].map(x => `<path d="M${x} ${AF + 12} l${x / 6} 8 l2 -7Z" fill="${k.c[1]}" ${ol(k, 1)}/>`).join('') }) },
  /* ---- rodada 2 ---- */
  { n: 'Luva de boxe vermelha', d: k => ({ f: P(k, tube(AF - 6, AF + 1, 16, 16), '#fff'), hand: k.c[0], big: true, after: `<path d="M-4 ${AF + 2} Q0 ${AF + 6} 4 ${AF + 2}" stroke="#fff" stroke-width="1.4" fill="none"/>` }) },
  { n: 'Luva cirúrgica', d: k => ({ f: P(k, tube(AF - 10, AF + 1, 14, 14)), hand: k.c[0] }) },
  { n: 'Luva de jardinagem', d: k => ({ f: P(k, tube(AF - 10, AF + 1, 16, 16)) + [AF - 7, AF - 3].map(y => `<circle cx="-3" cy="${y}" r="1.6" fill="${k.c[1]}"/><circle cx="3" cy="${y}" r="1.6" fill="${k.c[1]}"/>`).join(''), hand: k.c[0] }) },
  { n: 'Punho de pelúcia', d: k => ({ f: P(k, tube(AF - 6, AF + 1, 18, 18), k.c[1]), hand: k.S }) },
  { n: 'Luva de mágico', d: k => ({ f: P(k, tube(-2, AF + 1, 14, 14), '#fff'), hand: '#fff' }) },
  { n: 'Luva de gato', d: k => ({ f: P(k, tube(AF - 6, AF + 1, 15, 15)), hand: k.c[0], big: true, after: [-3, 0, 3].map(x => `<circle cx="${x}" cy="${AF + 2}" r="1.3" fill="${k.c[1]}"/>`).join('') + `<circle cx="0" cy="${AF + 7}" r="2.4" fill="${k.c[1]}"/>` }) },
  { n: 'Bracelete de ouro', d: k => ({ f: P(k, tube(AF - 12, AF - 4, 16, 16), k.c[1]) + `<path d="M-8 ${AF - 8} L8 ${AF - 8}" stroke="${k.c[0]}" stroke-width="1.6"/>`, hand: k.S }) },
  { n: 'Luva de esqui', d: k => ({ f: P(k, tube(AF - 12, AF + 1, 18, 18)) + `<path d="M-8 ${AF - 8} L8 ${AF - 8}" stroke="${k.c[1]}" stroke-width="3"/>`, hand: k.c[0], big: true }) },
  { n: 'Pulseira de contas', d: k => ({ f: Array.from({ length: 5 }, (_, i) => `<circle cx="${-6 + i * 3}" cy="${AF - 2}" r="2" fill="${['#ff5a8a', '#5ac8ff', '#ffd23f'][i % 3]}" ${ol(k, .8)}/>`).join(''), hand: k.S }) },
  { n: 'Luva de cavaleiro', d: k => ({ f: P(k, tube(AF - 12, AF + 1, 18, 17), '#9aa0b0') + [AF - 9, AF - 5, AF - 1].map(y => `<path d="M-8 ${y} L8 ${y}" stroke="#6a7080" stroke-width="1.4"/>`).join(''), hand: '#9aa0b0', big: true }) },
];

/* ---------- Extra: ombro, pulso e joelho ----------
   Presos num ponto do membro (t: 0 = ombro/quadril, 1 = pulso/tornozelo). No desenho local, x atravessa o membro
   (h = meia largura do membro naquele ponto) e y desce ao longo dele. */
const onLimb = (L, t, f) => { const p = L.pt(t), a = Math.atan2(p.ny, p.nx) * 180 / Math.PI;
  return `<g transform="translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${a.toFixed(1)})">${f(p.w / 2)}</g>`; };
const PL = (k, d, fill, w = 2.2) => `<path d="${d}" fill="${fill || k.c[0]}" ${ol(k, w)}/>`;
const EL = (k, cx, cy, rx, ry, fill, w = 1.8) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill || k.c[0]}" ${ol(k, w)}/>`;
/* traço fino na cor dada (espessura já compensada pela escala do membro) */
const LN = (d, color, w) => `<path d="${d}" stroke="${color}" stroke-width="${(w / G.sf).toFixed(2)}" fill="none" stroke-linecap="round"/>`;
const starD = (cx, cy, r) => Shape.star(cx, cy, r, r * .45);
/* cinta em volta do membro (arco na frente, como uma pulseira vista de lado) */
const cuff = (k, h, y0, y1, fill) => PL(k, `M${-h - .8} ${y0} Q0 ${y0 + 2} ${h + .8} ${y0} L${h + .8} ${y1} Q0 ${y1 + 2} ${-h - .8} ${y1}Z`, fill, 1.8);
const pad = (h, e = 3, top = 6, y = 5) => `M${-h - e} ${y} C${-h - e} ${-h - top} ${h + e} ${-h - top} ${h + e} ${y} Q0 ${y + 3} ${-h - e} ${y}Z`;
const ring = (k, n, h, dy = 0) => Array.from({ length: n }, (_, i) => `<ellipse cx="${(-h + i * 2 * h / (n - 1)).toFixed(1)}" cy="${(dy + (i % 2) * .8).toFixed(1)}" rx="1.9" ry="1.3" fill="none" stroke="${k.c[0]}" stroke-width="${(2 / G.sf).toFixed(2)}"/>`).join('');

PARTS.shoulder = [null,
  { n: 'Ombreira redonda', d: (k, L) => onLimb(L, 0, h => PL(k, pad(h))) },
  { n: 'Ombreira militar', d: (k, L) => onLimb(L, 0, h => PL(k, pad(h, 3, 5, 3)) + Array.from({ length: 6 }, (_, i) => LN(`M${(-h - 2 + i * (2 * h + 4) / 5).toFixed(1)} 4 l0 5`, k.c[1], 3)).join('')) },
  { n: 'Armadura', d: (k, L) => onLimb(L, 0, h => [8, 3, -2].map((y, i) => PL(k, pad(h + i, 3, 6, y), Color.shade(k.c[0], -14 + i * 7))).join('')) },
  { n: 'Babado', d: (k, L) => onLimb(L, .04, h => { const n = 5, s = (2 * h + 2) / n;
    return PL(k, `M${-h - 1} -2 ` + Array.from({ length: n }, (_, i) => `Q${(-h - 1 + (i + .5) * s).toFixed(1)} 10 ${(-h - 1 + (i + 1) * s).toFixed(1)} 5`).join(' ') + ` L${h + 1} -2 Q0 -6 ${-h - 1} -2Z`, k.c[1]); }) },
  { n: 'Laço', d: (k, L) => onLimb(L, .03, h => PL(k, 'M0 0 L-9 -6 L-9 6Z') + PL(k, 'M0 0 L9 -6 L9 6Z') + EL(k, 0, 0, 2.4, 2.8, k.c[1], 1.4)) },
  { n: 'Estrela', d: (k, L) => onLimb(L, .02, h => PL(k, starD(0, -1, 8))) },
  { n: 'Pelo', d: (k, L) => onLimb(L, .02, h => [-h, -h / 2, 0, h / 2, h].map((x, i) => EL(k, x.toFixed(1), i % 2 ? -3 : 0, 4.2, 4.2, i % 2 ? k.c[0] : Color.shade(k.c[0], -8), 1.4)).join('')) },
  { n: 'Espinhos', d: (k, L) => onLimb(L, 0, h => [-50, -15, 20].map(a => `<g transform="rotate(${a} 0 2)">${PL(k, `M-3 ${-h + 1} L0 ${-h - 10} L3 ${-h + 1}Z`, '#d8dce6', 1.6)}</g>`).join('') + PL(k, pad(h, 2, 3, 3))) },
  { n: 'Asinha', d: (k, L) => onLimb(L, .04, h => PL(k, `M${-h} -2 C${-h - 8} -12 ${-h - 18} -10 ${-h - 20} -4 C${-h - 14} -4 ${-h - 16} 2 ${-h - 10} 2 C${-h - 12} 6 ${-h - 6} 6 ${-h} 3Z`, k.c[0], 1.8)) },
  { n: 'Coração', d: (k, L) => onLimb(L, .02, h => PL(k, Shape.heart(0, -1, 6))) },
  { n: 'Faixa', d: (k, L) => L.band(k, .03, .13, 1.6, 1.6) },
  { n: 'Flor', d: (k, L) => onLimb(L, .02, h => [0, 72, 144, 216, 288].map(a => EL(k, (Math.cos(a * Math.PI / 180) * 4.5).toFixed(1), (Math.sin(a * Math.PI / 180) * 4.5 - 1).toFixed(1), 3.4, 3.4, k.c[0], 1.2)).join('') + EL(k, 0, -1, 2.6, 2.6, k.c[1], 1.2)) },
  { n: 'Pena', d: (k, L) => onLimb(L, .03, h => PL(k, `M${-h + 2} 0 C${-h - 4} -10 ${-h - 14} -16 ${-h - 20} -16 C${-h - 16} -8 ${-h - 8} -2 ${-h + 2} 0Z`, k.c[0], 1.6) + LN(`M${-h + 1} 0 L${-h - 16} -13`, k.c[1], 2)) },
  { n: 'Corrente', d: (k, L) => onLimb(L, .06, h => ring(k, 4, h)) },
  { n: 'Placa listrada', d: (k, L) => onLimb(L, 0, h => PL(k, pad(h)) + LN(`M${-h - 1} 0 Q0 -3 ${h + 1} 0`, k.c[1], 3.6)) },
  { n: 'Chama', d: (k, L) => onLimb(L, .02, h => `<g transform="translate(${-h * .5} -2)">` + PL(k, 'M-5 2 C-8 -6 -2 -8 -3 -14 C1 -10 3 -12 3 -16 C8 -10 8 -2 5 2Z', '#ff8a2a', 1.4) + PL(k, 'M-2 2 C-3 -3 0 -5 0 -8 C3 -4 4 -1 2 2Z', '#ffe066', 1) + '</g>') },
  { n: 'Escamas', d: (k, L) => onLimb(L, .03, h => [[-h, 2], [h, 2], [0, 2], [-h / 2, -2], [h / 2, -2]].map(([x, y]) => PL(k, `M${(x - 3.4).toFixed(1)} ${y} Q${x.toFixed(1)} ${y + 7} ${(x + 3.4).toFixed(1)} ${y} Q${x.toFixed(1)} ${y - 3} ${(x - 3.4).toFixed(1)} ${y}Z`, k.c[1], 1.2)).join('')) },
  { n: 'Tachinhas', d: (k, L) => L.band(k, .03, .12, 1.6, 1.6) + onLimb(L, .075, h => [-h / 1.6, 0, h / 1.6].map(x => `<circle cx="${x.toFixed(1)}" cy="0" r="1.3" fill="#e8ecf4"/>`).join('')) },
  { n: 'Ombreira de pelúcia', d: (k, L) => onLimb(L, 0, h => PL(k, pad(h, 4, 8, 6), k.c[1])) },
  { n: 'Fita solta', d: (k, L) => onLimb(L, .05, h => PL(k, `M${-h} -1 L${-h - 4} 14 L${-h - 7} 11 L${-h - 3} -1Z`, k.c[1], 1.4) + PL(k, `M${-h} 0 L${-h - 10} 10 L${-h - 12} 7 L${-h - 3} -1Z`, k.c[0], 1.4)) },
];

PARTS.wrist = [null,
  { n: 'Pulseira fina', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -1.5, 1)) },
  { n: 'Munhequeira', d: (k, L) => onLimb(L, .88, h => cuff(k, h, -4, 3)) },
  { n: 'Munhequeira listrada', d: (k, L) => onLimb(L, .88, h => cuff(k, h, -4, 3) + LN(`M${-h} -.5 Q0 1.5 ${h} -.5`, k.c[1], 3)) },
  { n: 'Relógio', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -1.8, 1.8) + `<rect x="-3.4" y="-3.6" width="6.8" height="7" rx="1.6" fill="${k.c[1]}" ${ol(k, 1.4)}/>` + LN('M0 -1.5 L0 0 L1.5 .8', k.c[2], 1)) },
  { n: 'Contas', d: (k, L) => onLimb(L, .9, h => Array.from({ length: 5 }, (_, i) => EL(k, (-h + i * h / 2).toFixed(1), .6, 1.7, 1.7, i % 2 ? k.c[1] : k.c[0], 1)).join('')) },
  { n: 'Bracelete com pedra', d: (k, L) => onLimb(L, .88, h => cuff(k, h, -3, 2.5) + PL(k, 'M0 -3.4 L2.6 -.4 L0 2.8 L-2.6 -.4Z', k.c[1], 1.2)) },
  { n: 'Espinhos', d: (k, L) => onLimb(L, .88, h => [-h / 1.5, 0, h / 1.5].map(x => PL(k, `M${(x - 1.6).toFixed(1)} -2 L${x.toFixed(1)} -7 L${(x + 1.6).toFixed(1)} -2Z`, '#dfe3ec', 1)).join('') + cuff(k, h, -2.5, 2.5)) },
  { n: 'Pelo', d: (k, L) => onLimb(L, .88, h => [-h, -h / 2, 0, h / 2, h].map(x => EL(k, x.toFixed(1), 0, 3, 3.4, k.c[0], 1.2)).join('')) },
  { n: 'Laço', d: (k, L) => onLimb(L, .88, h => cuff(k, h, -1.5, 1.5) + PL(k, 'M0 0 L-6 -4 L-6 4Z', k.c[1], 1.3) + PL(k, 'M0 0 L6 -4 L6 4Z', k.c[1], 1.3) + EL(k, 0, 0, 1.6, 1.8, k.c[0], 1)) },
  { n: 'Babado', d: (k, L) => onLimb(L, .86, h => PL(k, `M${-h - 1} -3 L${h + 1} -3 L${h + 4} 3 Q${h / 2} 6 0 3 Q${-h / 2} 6 ${-h - 4} 3Z`, k.c[1], 1.6)) },
  { n: 'Algema', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -2.2, 2.2, '#c8ccd8') + `<ellipse cx="${-h - 3}" cy="3" rx="2" ry="3" fill="none" stroke="#9aa0b0" stroke-width="${(2 / G.sf).toFixed(2)}"/>`) },
  { n: 'Atadura', d: (k, L) => onLimb(L, .86, h => [-4, -1, 2].map(y => PL(k, `M${-h - .6} ${y - 1} L${h + .6} ${y + .6} L${h + .6} ${y + 2.4} L${-h - .6} ${y + 1}Z`, '#f4f0e8', 1)).join('')) },
  { n: 'Pompom', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -1.5, 1.5) + EL(k, -h - 2, 1, 3.2, 3.2, k.c[1], 1.2)) },
  { n: 'Corações', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -1.2, 1.2) + [-h / 2, h / 2].map(x => PL(k, Shape.heart(x, 1.8, 2.4), k.c[1], 1)).join('')) },
  { n: 'Estrela', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -1.5, 1.5) + PL(k, starD(0, 0, 4.4), k.c[1], 1.2)) },
  { n: 'Relógio digital', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -2, 2) + `<rect x="-4" y="-3.4" width="8" height="6.8" rx="1.2" fill="#1c2238" ${ol(k, 1.4)}/><rect x="-2.6" y="-1.6" width="5.2" height="3" fill="${k.c[1]}" opacity=".85"/>`) },
  { n: 'Corrente', d: (k, L) => onLimb(L, .9, h => ring(k, 5, h)) },
  { n: 'Pulseira dupla', d: (k, L) => onLimb(L, .88, h => cuff(k, h, -3.5, -1.5) + cuff(k, h, .5, 2.5, k.c[1])) },
  { n: 'Fita', d: (k, L) => onLimb(L, .9, h => cuff(k, h, -1.5, 1.5) + PL(k, `M${-h} 0 L${-h - 3} 9 L${-h - 5} 7 L${-h - 2} 0Z`, k.c[1], 1.2)) },
  { n: 'Tachas', d: (k, L) => onLimb(L, .88, h => cuff(k, h, -3, 3) + [-h / 1.6, 0, h / 1.6].map(x => `<circle cx="${x.toFixed(1)}" cy=".5" r="1.1" fill="#eef1f8"/>`).join('')) },
];

PARTS.knee = [null,
  { n: 'Joelheira', d: (k, L) => onLimb(L, L.knee, h => PL(k, `M${-h - 1} -5 Q0 -9 ${h + 1} -5 L${h + 1} 5 Q0 9 ${-h - 1} 5Z`)) },
  { n: 'Joelheira redonda', d: (k, L) => onLimb(L, L.knee, h => EL(k, 0, 0, h * .8, h * .75) + EL(k, 0, 0, h * .4, h * .36, k.c[1], 1.2)) },
  { n: 'Curativo', d: (k, L) => onLimb(L, L.knee, h => `<g transform="rotate(-30)">${PL(k, 'M-5 -2.2 L5 -2.2 Q6.6 0 5 2.2 L-5 2.2 Q-6.6 0 -5 -2.2Z', '#f3c9a0', 1.2)}<rect x="-1.8" y="-1.6" width="3.6" height="3.2" fill="#e8a878"/></g>`) },
  { n: 'Faixa', d: (k, L) => L.band(k, L.knee - .03, L.knee + .03, 1.2, 1.2) },
  { n: 'Faixa dupla', d: (k, L) => L.band(k, L.knee - .05, L.knee - .015, 1.2, 1.2) + L.band(k, L.knee + .015, L.knee + .05, 1.2, 1.2, k.c[1]) },
  { n: 'Remendo', d: (k, L) => onLimb(L, L.knee, h => `<rect x="-5" y="-5" width="10" height="10" rx="1" fill="${k.c[0]}" ${ol(k, 1.4)}/><rect x="-3.6" y="-3.6" width="7.2" height="7.2" fill="none" stroke="${k.c[1]}" stroke-width="${(1.5 / G.sf).toFixed(2)}" stroke-dasharray="1.4 1"/>`) },
  { n: 'Laço', d: (k, L) => onLimb(L, L.knee, h => PL(k, 'M0 0 L-7 -4 L-7 4Z', k.c[0], 1.3) + PL(k, 'M0 0 L7 -4 L7 4Z', k.c[0], 1.3) + EL(k, 0, 0, 1.8, 2, k.c[1], 1)) },
  { n: 'Liga', d: (k, L) => L.band(k, L.knee - .12, L.knee - .07, 1.2, 1.2) + onLimb(L, L.knee - .095, h => PL(k, 'M0 0 L-4 -3 L-4 3Z', k.c[1], 1) + PL(k, 'M0 0 L4 -3 L4 3Z', k.c[1], 1)) },
  { n: 'Joelheira de metal', d: (k, L) => onLimb(L, L.knee, h => PL(k, `M${-h - 1.5} -6 Q0 -10 ${h + 1.5} -6 L${h + 1.5} 5 Q0 11 ${-h - 1.5} 5Z`, '#b8bfcc') + '<circle cx="0" cy="0" r="1.6" fill="#e8ecf4"/>') },
  { n: 'Fita em X', d: (k, L) => onLimb(L, L.knee, h => LN(`M${-h} -5 L${h} 5 M${h} -5 L${-h} 5`, k.c[0], 5.5)) },
  { n: 'Estrela', d: (k, L) => onLimb(L, L.knee, h => PL(k, starD(0, 0, 5.5), k.c[0], 1.4)) },
  { n: 'Coração', d: (k, L) => onLimb(L, L.knee, h => PL(k, Shape.heart(0, 0, 4.4), k.c[0], 1.4)) },
  { n: 'Rasgo', d: (k, L) => onLimb(L, L.knee, h => PL(k, `M${-h + 1} -2 L${-h / 3} -4 L0 -1.5 L${h / 3} -4 L${h - 1} -2 L${h - 1.5} 2 L${h / 3} 3.5 L0 1.5 L${-h / 3} 3.5 L${-h + 1.5} 2Z`, k.S, 1.2)) },
  { n: 'Esportiva', d: (k, L) => L.band(k, L.knee - .06, L.knee + .06, 1.4, 1.4) + L.line(k, L.knee - .02, 1.4, k.c[1], 1.2) + L.line(k, L.knee + .02, 1.4, k.c[1], 1.2) },
  { n: 'Pelo', d: (k, L) => onLimb(L, L.knee, h => [-h * .75, -h * .25, h * .25, h * .75].map(x => EL(k, x.toFixed(1), 0, h * .32, h * .38, k.c[0], 1.2)).join('')) },
  { n: 'Corrente', d: (k, L) => onLimb(L, L.knee, h => ring(k, 5, h)) },
  { n: 'Chama', d: (k, L) => onLimb(L, L.knee, h => PL(k, 'M-4 4 C-7 -2 -2 -4 -2 -9 C1 -6 3 -8 3 -11 C7 -6 7 1 4 4Z', '#ff8a2a', 1.2) + PL(k, 'M-1.5 4 C-2.5 0 0 -2 0 -4 C2 -1 3 1 1.5 4Z', '#ffe066', .8)) },
  { n: 'Esparadrapo em X', d: (k, L) => onLimb(L, L.knee, h => [30, -30].map(a => `<g transform="rotate(${a})">${PL(k, 'M-6 -1.8 L6 -1.8 L6 1.8 L-6 1.8Z', '#f4f0e8', 1)}</g>`).join('')) },
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
