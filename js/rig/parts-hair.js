/* ============ PEÇAS: CABELO ============
   Espaço do personagem (viewBox 0 0 300 420). Cabeça centrada em (150,128).
   Cada modelo: { n: nome, d: k => svg }. k.F = preenchimento (gradiente principal→secundária),
   k.c = [principal, secundária, contorno], k.st = atributos de contorno. Índice 0 = nenhum. */

const PARTS = {};
const ol = (k, w = 3) => `stroke="${k.c[2]}" stroke-width="${(w / (typeof G === 'object' ? G.sf : 1)).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"`;
/* União de círculos com contorno único (cachos, nuvens) */
function blob(k, circles) {
  return `<g fill="${k.c[2]}">${circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.2}"/>`).join('')}</g>` +
    `<g fill="${k.F}">${circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
}
/* Brilho do cabelo (como no Gacha Club): 2-3 manchas alongadas na curva do alto da cabeça, na cor clara do cabelo */
function hairGloss(k, cx = 150, cy = 128, rx = 72, ry = 68, ang = [230, 251, 272], len = [7, 11, 8]) {
  const col = Color.mix(k.c[0], '#ffffff', .62);
  return ang.map((a, i) => { const r = a * Math.PI / 180, x = cx + rx * Math.cos(r), y = cy + ry * Math.sin(r);
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${len[i]}" ry="${(2.4 + len[i] * .08).toFixed(1)}" fill="${col}" opacity=".8" transform="rotate(${(a - 270).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join('');
}
const hairShine = () => '';
/* Trança: gomos em "V" alternados (de baixo para cima, cada gomo por cima do de baixo), com vinco e ponta solta */
function braid(k, pts, r = 11) {
  let s = '';
  const [lx, ly] = pts[pts.length - 1];
  s += `<path d="M${lx - 5} ${ly + 6} Q${lx - 7} ${ly + 22} ${lx - 2} ${ly + 30} L${lx} ${ly + 22} L${lx + 3} ${ly + 31} Q${lx + 8} ${ly + 20} ${lx + 5} ${ly + 6}Z" fill="${k.F}" ${ol(k, 2.4)}/>`;
  for (let i = pts.length - 1; i >= 0; i--) {
    const [x, y] = pts[i], m = i % 2 ? -1 : 1;
    s += `<g transform="rotate(${m * 16} ${x} ${y})"><path d="M${x - r} ${y - r * .55} Q${x - r * 1.05} ${y + r * .55} ${x} ${y + r * .85} Q${x + r * 1.05} ${y + r * .55} ${x + r} ${y - r * .55} Q${x} ${y - r * .1} ${x - r} ${y - r * .55}Z" fill="${k.F}" ${ol(k, 2.4)}/>` +
      `<path d="M${x - r * .55} ${y - r * .1} Q${x - r * .1} ${y + r * .3} ${x + r * .1} ${y + r * .6}" stroke="${k.c[2]}" stroke-opacity=".45" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>`;
  }
  return s;
}
/* Cachos: nuvem de círculos com uma voltinha desenhada dentro de cada cacho */
function curls(k, circles) {
  return blob(k, circles) + circles.filter(c => c[2] < 30).map(([x, y, r]) =>
    `<path d="M${(x - r * .5).toFixed(1)} ${(y + r * .15).toFixed(1)} A${(r * .45).toFixed(1)} ${(r * .45).toFixed(1)} 0 1 1 ${(x + r * .3).toFixed(1)} ${(y + r * .45).toFixed(1)}" stroke="${k.c[2]}" stroke-opacity=".45" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('') + hairGloss(k);
}
/* Espetado: contorno de pontas com lados levemente côncavos e um fio do centro até cada ponta */
function spiky(k, pts, c = [150, 110]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], mx = (ax + bx) / 2, my = (ay + by) / 2;
    d += ` Q${(mx + (c[0] - mx) * .08).toFixed(1)} ${(my + (c[1] - my) * .08).toFixed(1)} ${bx} ${by}`;
  }
  d += 'Z';
  const far = pts.filter((p, i) => i % 2 === 1);
  const id = k.u + 'sp';
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${k.F}"/><g clip-path="url(#${id})">` +
    far.map(([x, y]) => `<path d="M${(c[0] + (x - c[0]) * .5).toFixed(1)} ${(c[1] + (y - c[1]) * .5).toFixed(1)} L${(c[0] + (x - c[0]) * .82).toFixed(1)} ${(c[1] + (y - c[1]) * .82).toFixed(1)}" stroke="${k.c[2]}" stroke-opacity=".4" stroke-width="1.5" stroke-linecap="round"/>`).join('') +
    hairGloss(k) + `</g><path d="${d}" fill="none" ${ol(k, 3.2)}/>`;
}

/* ---------- Gerador de cabelo em mechas (estilo anime) ----------
   cap: caminho aberto que começa no último ponto de pts e termina no primeiro (a "calota" do cabelo).
   pts: borda de mechas, alternando reentrância e ponta. Cada trecho vira uma curva: bulge > 0 deixa a mecha
   cheia (lados convexos), sw inclina todas as mechas para um lado (fluxo do penteado).
   Fios internos saem do alto (top) até perto de cada ponta; o brilho é uma faixa tracejada no alto. */
function hairEdge(pts, sw, bulge) {
  let d = '';
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    /* ponto "cheio": perto da reentrância no x e perto da ponta no y */
    const [fx, fy] = by > ay ? [ax, by - (by - ay) * .2] : [bx, ay - (ay - by) * .2];
    const cx = mx + (fx - mx) * bulge + sw, cy = my + (fy - my) * bulge;
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${bx} ${by}`;
  }
  return d;
}
function hairTips(pts) {
  const t = [];
  for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] > pts[i - 1][1] && pts[i][1] > pts[i + 1][1]) t.push(pts[i]);
  return t;
}
function hairNotches(pts) {
  const t = [];
  for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] < pts[i - 1][1] && pts[i][1] < pts[i + 1][1]) t.push(pts[i]);
  return t;
}
function hair(k, cap, pts, o = {}) {
  const { sw = 0, bulge = .4, top = 66, shine = 'M98 74 Q150 54 202 74', lines = 1, w = 3.3, edgeOnly = 0 } = o;
  const e = hairEdge(pts, sw, bulge), d = cap + e + 'Z', id = k.u + 'hc' + (o.id || '');
  /* edgeOnly: contorna só as mechas (a calota fica por baixo do cabelo posterior e do contorno da silhueta) */
  const line = edgeOnly ? `M${pts[0][0]} ${pts[0][1]}` + e : d;
  let inner = '';
  const st = (d, op = .5, w = 1.9) => `<path d="${d}" stroke="${k.c[2]}" stroke-opacity="${op}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  if (lines) {
    /* linha que separa as mechas: sobe de cada reentrância, curvando no sentido do penteado */
    inner += hairNotches(pts).map(([x, y]) => {
      const ex = x + (150 - x) * .22 + sw * 1.5, ey = top + (y - top) * .15;
      return st(`M${x} ${y} Q${(x + sw).toFixed(1)} ${((y + ey) / 2).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
    }).join('');
    /* vinco curto dentro de cada mecha */
    inner += hairTips(pts).map(([x, y]) => {
      const y0 = y - (y - top) * .28, y1 = y - (y - top) * .62, x1 = x + (150 - x) * .12 + 3 + sw;
      return st(`M${(x + 2).toFixed(1)} ${y0.toFixed(1)} Q${(x + 3 + sw * .5).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`, .35, 1.5);
    }).join('');
  }
  if (lines) {
    /* fios longos e finos do alto até perto de cada ponta */
    inner += hairTips(pts).map(([x, y]) => {
      const x0 = 150 + (x - 150) * .35, y1 = y - (y - top) * .3, x1 = x + (150 - x) * .06 - 3 + sw;
      return st(`M${x0.toFixed(1)} ${top + 6} Q${(x + (150 - x) * .25 + sw).toFixed(1)} ${((top + y1) / 2).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`, .28, 1.3);
    }).join('');
  }
  if (shine) inner += hairGloss(k);
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${k.F}"/>` +
    `<g clip-path="url(#${id})">${inner}</g><path d="${line}" fill="none" ${ol(k, w)}/>`;
}
/* apelido usado pelo rig (lá, 'hair' é o nome de uma variável) */
const drawHair = (...a) => hair(...a);
/* Calotas prontas */
const CAP_BANGS = 'M70 150 C58 62 104 36 150 36 C196 36 242 62 230 150';
const CAP_BASE = 'M62 150 C52 54 102 28 150 28 C198 28 248 54 238 150';
const CAP_BACK = 'M74 128 L226 128';

/* Cabelo de trás (longo, atrás do corpo) */
PARTS.hairBack = [null,
  { n: 'Longo reto', d: k => hair(k, CAP_BACK, [[226, 128], [238, 250], [244, 332], [228, 318], [216, 342], [198, 322], [184, 346], [166, 326], [150, 348], [134, 326], [116, 346], [102, 322], [84, 342], [72, 318], [56, 332], [62, 250], [74, 128]], { top: 150, shine: 0, bulge: .25 }) },
  { n: 'Longo ondulado', d: k => hair(k, CAP_BACK, [[228, 128], [252, 192], [236, 242], [254, 300], [242, 346], [224, 334], [208, 354], [188, 336], [168, 356], [150, 340], [132, 356], [112, 336], [92, 354], [76, 334], [58, 346], [46, 300], [64, 242], [48, 192], [72, 128]], { top: 150, shine: 0, bulge: .6 }) },
  { n: 'Muito longo', d: k => hair(k, CAP_BACK, [[226, 128], [246, 280], [256, 396], [236, 382], [222, 404], [202, 386], [186, 408], [166, 388], [150, 410], [134, 388], [114, 408], [98, 386], [78, 404], [64, 382], [44, 396], [54, 280], [74, 128]], { top: 150, shine: 0, bulge: .25 }) },
  { n: 'Médio em camadas', d: k => hair(k, CAP_BACK, [[230, 128], [240, 232], [228, 222], [232, 270], [214, 252], [206, 284], [190, 262], [176, 290], [160, 266], [150, 292], [140, 266], [124, 290], [110, 262], [94, 284], [86, 252], [68, 270], [72, 222], [60, 232], [70, 128]], { top: 150, shine: 0, bulge: .35 }) },
  { n: 'Tranças', d: k => [86, 214].map((x, i) => braid(k, [[x, 190], [x + (i ? 2 : -2), 208], [x + (i ? 3 : -3), 226], [x + (i ? 3 : -3), 244], [x + (i ? 2 : -2), 262], [x, 280]], 12) + `<ellipse cx="${x}" cy="${291}" rx="7" ry="4.5" fill="${k.c[1]}" ${ol(k, 2.2)}/>`).join('') },
  { n: 'Cacheado longo', d: k => curls(k, [[78, 150, 22], [70, 186, 22], [74, 222, 22], [80, 258, 20], [96, 286, 18], [222, 150, 22], [230, 186, 22], [226, 222, 22], [220, 258, 20], [204, 286, 18], [120, 290, 18], [150, 294, 18], [180, 290, 18], [150, 200, 70]]) },
  { n: 'Repicado', d: k => hair(k, CAP_BACK, [[230, 128], [244, 240], [240, 318], [226, 296], [220, 326], [204, 300], [196, 334], [178, 306], [164, 336], [150, 310], [136, 336], [122, 306], [104, 334], [96, 300], [80, 326], [74, 296], [60, 318], [56, 240], [70, 128]], { top: 150, shine: 0, bulge: .1 }) },
  { n: 'Bob longo', d: k => hair(k, CAP_BACK, [[232, 128], [240, 200], [236, 256], [220, 246], [206, 262], [186, 248], [166, 264], [150, 250], [134, 264], [114, 248], [94, 262], [80, 246], [64, 256], [60, 200], [68, 128]], { top: 150, shine: 0, bulge: .5 }) },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Longo com pontas viradas', d: k => hair(k, CAP_BACK, [[226, 128], [240, 250], [262, 322], [238, 310], [220, 334], [198, 318], [178, 336], [150, 320], [122, 336], [102, 318], [80, 334], [62, 310], [38, 322], [60, 250], [74, 128]], { top: 150, shine: 0, bulge: .35 }) },
  { n: 'Ombro repicado', d: k => hair(k, CAP_BACK, [[228, 128], [238, 206], [224, 196], [226, 226], [208, 208], [198, 232], [180, 212], [166, 236], [150, 214], [134, 236], [120, 212], [102, 232], [92, 208], [74, 226], [76, 196], [62, 206], [72, 128]], { top: 150, shine: 0, bulge: .2 }) },
  { n: 'Longo e liso com franja', d: k => hair(k, CAP_BACK, [[226, 128], [236, 300], [234, 366], [210, 362], [180, 370], [150, 364], [120, 370], [90, 362], [66, 366], [64, 300], [74, 128]], { top: 150, shine: 0, bulge: .15 }) },
  { n: 'Cacheado volumoso', d: k => curls(k, [[64, 150, 26], [58, 196, 26], [64, 242, 24], [80, 280, 22], [236, 150, 26], [242, 196, 26], [236, 242, 24], [220, 280, 22], [110, 300, 22], [150, 306, 22], [190, 300, 22], [150, 210, 80]]) },
  { n: 'Ondas soltas', d: k => hair(k, CAP_BACK, [[228, 128], [256, 186], [232, 232], [260, 280], [236, 326], [214, 312], [198, 340], [176, 318], [150, 342], [124, 318], [102, 340], [86, 312], [64, 326], [40, 280], [68, 232], [44, 186], [72, 128]], { top: 150, shine: 0, bulge: .7 }) },
  { n: 'Chanel longo', d: k => hair(k, CAP_BACK, [[232, 128], [244, 232], [226, 244], [150, 250], [74, 244], [56, 232], [68, 128]], { top: 150, shine: 0, bulge: .6 }) },
  { n: 'Até a cintura em mechas', d: k => hair(k, CAP_BACK, [[228, 128], [246, 280], [230, 270], [236, 318], [214, 300], [208, 344], [186, 316], [172, 350], [150, 322], [128, 350], [114, 316], [92, 344], [86, 300], [64, 318], [70, 270], [54, 280], [72, 128]], { top: 150, shine: 0, bulge: .25 }) },
  { n: 'Longo com fita', d: k => hair(k, CAP_BACK, [[226, 128], [238, 250], [244, 332], [216, 342], [184, 346], [150, 348], [116, 346], [84, 342], [56, 332], [62, 250], [74, 128]], { top: 150, shine: 0, bulge: .25 }) + P(k, 'M150 300 L126 288 L126 312Z M150 300 L174 288 L174 312Z', k.c[1]) + `<circle cx="150" cy="300" r="5" fill="${k.c[1]}" ${ol(k, 1.6)}/>` },
  { n: 'Médio desfiado', d: k => hair(k, CAP_BACK, [[230, 128], [242, 216], [230, 206], [234, 250], [214, 232], [206, 264], [188, 240], [176, 270], [160, 244], [150, 272], [140, 244], [124, 270], [112, 240], [94, 264], [86, 232], [66, 250], [70, 206], [58, 216], [70, 128]], { top: 150, shine: 0, bulge: .05 }) },
  { n: 'Cascata', d: k => hair(k, CAP_BACK, [[228, 128], [250, 220], [236, 300], [250, 380], [222, 366], [196, 388], [170, 370], [150, 392], [130, 370], [104, 388], [78, 366], [50, 380], [64, 300], [50, 220], [72, 128]], { top: 150, shine: 0, bulge: .5 }) },
];

/* Cabelo posterior (volume da cabeça, atrás do rosto) */
PARTS.hairBase = [null,
  { n: 'Curto redondo', d: k => hair(k, CAP_BASE, [[238, 150], [250, 186], [232, 176], [226, 198], [210, 182], [196, 194], [150, 186], [104, 194], [90, 182], [74, 198], [68, 176], [50, 186], [62, 150]], { top: 60, bulge: .25, shine: 0 }) },
  { n: 'Chanel', d: k => hair(k, CAP_BASE, [[238, 150], [244, 200], [256, 224], [234, 212], [222, 228], [204, 212], [150, 212], [96, 212], [78, 228], [66, 212], [44, 224], [56, 200], [62, 150]], { top: 60, bulge: .25, shine: 0 }) },
  { n: 'Volumoso', d: k => hair(k, 'M50 150 C34 58 96 20 150 20 C204 20 266 58 250 150', [[250, 150], [268, 178], [250, 176], [262, 206], [238, 196], [232, 218], [212, 202], [150, 204], [88, 202], [68, 218], [62, 196], [38, 206], [50, 176], [32, 178], [50, 150]], { top: 50, bulge: .3, shine: 0 }) },
  { n: 'Espetado', d: k => spiky(k, [[70, 150], [44, 128], [64, 108], [38, 82], [72, 76], [62, 42], [100, 54], [108, 18], [134, 42], [152, 8], [168, 42], [194, 18], [202, 54], [240, 42], [228, 76], [262, 82], [236, 108], [256, 128], [230, 150]]) },
  { n: 'Cacheado', d: k => curls(k, [[74, 104, 22], [70, 140, 22], [78, 174, 20], [226, 104, 22], [230, 140, 22], [222, 174, 20], [92, 66, 24], [124, 46, 24], [150, 40, 24], [176, 46, 24], [208, 66, 24], [150, 120, 72]]) },
  { n: 'Médio reto', d: k => hair(k, CAP_BASE, [[238, 150], [246, 236], [258, 260], [234, 248], [222, 264], [206, 250], [150, 252], [94, 250], [78, 264], [66, 248], [42, 260], [54, 236], [62, 150]], { top: 60, bulge: .2, shine: 0 }) },
  { n: 'Raspado', d: k => `<path d="M72 124 C70 70 106 52 150 52 C194 52 230 70 228 124 C220 104 190 92 150 92 C110 92 80 104 72 124Z" fill="${k.F}" ${ol(k, 2.8)}/>` },
  { n: 'Fofo curto', d: k => hair(k, 'M60 150 C48 70 90 32 150 32 C210 32 252 70 240 150', [[240, 150], [256, 180], [238, 178], [244, 198], [222, 190], [150, 186], [78, 190], [56, 198], [62, 178], [44, 180], [60, 150]], { top: 60, bulge: .45, shine: 0 }) },
];

/* Rabo de cavalo / penteados presos */
PARTS.ponytail = [null,
  { n: 'Rabo alto', d: k => hair(k, 'M176 56 C224 14 294 48 286 128', [[286, 128], [292, 196], [276, 182], [280, 250], [260, 222], [258, 278], [240, 236], [232, 256], [224, 172], [206, 96], [182, 80]], { top: 64, bulge: .18, shine: 0, sw: -2 }) + `<ellipse cx="188" cy="66" rx="8" ry="11" fill="${k.c[1]}" ${ol(k, 2.4)} transform="rotate(35 188 66)"/>` },
  { n: 'Maria-chiquinha', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + m }), 'M92 92 C44 94 24 162 36 232', [[36, 232], [48, 262], [52, 240], [62, 256], [62, 218], [70, 150], [96, 118]], { top: 110, bulge: .3, shine: 0 }) + `<circle cx="86" cy="96" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Coque', d: k => `<circle cx="150" cy="36" r="27" fill="${k.F}" ${ol(k, 2.8)}/><path d="M130 30 Q150 20 170 30 M134 44 Q150 36 166 44" stroke="${k.c[2]}" stroke-width="1.7" fill="none" opacity=".45"/><rect x="132" y="56" width="36" height="7" rx="3" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Coques duplos', d: k => `<circle cx="90" cy="52" r="25" fill="${k.F}" ${ol(k, 2.8)}/><circle cx="210" cy="52" r="25" fill="${k.F}" ${ol(k, 2.8)}/><path d="M78 46 Q90 38 102 44 M198 44 Q210 38 222 46" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none"/><path d="M76 58 Q90 66 104 58 M196 58 Q210 66 224 58" stroke="${k.c[2]}" stroke-opacity=".4" stroke-width="1.7" fill="none"/>` },
  { n: 'Trança lateral', d: k => braid(k, [[80, 172], [83, 192], [86, 212], [89, 232], [92, 252], [95, 272]], 13) + `<ellipse cx="95" cy="284" rx="7.5" ry="4.8" fill="${k.c[1]}" ${ol(k, 2.2)}/>` },
  { n: 'Rabo de lado', d: k => hair(k, 'M86 104 C40 144 36 226 60 280', [[60, 280], [70, 300], [74, 276], [84, 290], [88, 240], [94, 184], [100, 150]], { top: 120, bulge: .3, shine: 0 }) + `<circle cx="86" cy="116" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Chiquinhas curtas', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + m }), 'M88 86 C58 78 42 104 44 134', [[44, 134], [48, 150], [56, 136], [64, 146], [70, 126], [80, 124], [92, 98]], { top: 96, bulge: .4, shine: 0 }) + `<circle cx="86" cy="90" r="6" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Rabo gigante', d: k => hair(k, 'M180 54 C258 4 318 90 304 190', [[304, 190], [306, 270], [290, 250], [288, 340], [266, 300], [262, 352], [244, 302], [236, 322], [224, 172], [206, 94], [186, 80]], { top: 64, bulge: .18, shine: 0, sw: -2 }) + `<ellipse cx="190" cy="66" rx="9" ry="12" fill="${k.c[1]}" ${ol(k, 2.4)} transform="rotate(35 190 66)"/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Rabo baixo', d: k => hair(k, 'M180 150 C220 150 240 190 236 250', [[236, 250], [240, 300], [226, 290], [222, 330], [210, 300], [202, 320], [200, 240], [190, 180], [178, 164]], { top: 160, bulge: .3, shine: 0 }) + `<ellipse cx="190" cy="168" rx="7" ry="9" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Chiquinhas longas onduladas', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + 'w' + m }), 'M88 88 C40 90 24 150 44 200', [[44, 200], [26 , 250], [46, 296], [34, 334], [52, 330], [62, 300], [58, 260], [72, 210], [80, 150], [96, 116]], { top: 110, bulge: .5, shine: 0 }) + `<circle cx="86" cy="94" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Coque bagunçado', d: k => hair(k, 'M126 40 C120 4 180 4 174 40', [[174, 40], [184, 26], [178, 50], [150, 58], [122, 50], [116, 26], [126, 40]], { top: 20, bulge: .6, shine: 0 }) + `<path d="M140 16 Q150 6 162 16 M134 30 Q150 22 166 30" stroke="${k.c[2]}" stroke-width="1.6" fill="none" opacity=".45"/>` },
  { n: 'Coques com laço', d: k => [90, 210].map(x => `<circle cx="${x}" cy="52" r="22" fill="${k.F}" ${ol(k, 2.8)}/>` + P(k, `M${x} 32 L${x - 14} 22 L${x - 14} 40Z M${x} 32 L${x + 14} 22 L${x + 14} 40Z`, k.c[1])).join('') },
  { n: 'Rabo de lado com laço', d: k => hair(k, 'M214 104 C260 144 264 226 236 280', [[236, 280], [226, 300], [222, 276], [212, 292], [212, 240], [204, 184], [200, 150]], { top: 120, bulge: .3, shine: 0 }) + P(k, 'M214 116 L200 104 L200 128Z M214 116 L228 104 L228 128Z', k.c[1]) },
  { n: 'Trança embutida', d: k => braid(k, [[150, 196], [150, 214], [150, 232], [150, 250], [150, 268], [150, 286], [150, 304]], 12) + `<ellipse cx="150" cy="318" rx="7" ry="4.5" fill="${k.c[1]}" ${ol(k, 2.2)}/>` },
  { n: 'Chiquinhas de coque', d: k => [0, 1].map(m => { const p = `<circle cx="80" cy="74" r="20" fill="${k.F}" ${ol(k, 2.8)}/>` + hair(Object.assign({}, k, { u: k.u + 'q' + m }), 'M70 86 C46 100 44 150 56 196', [[56, 196], [62, 220], [68, 200], [76, 214], [74, 170], [80, 120], [86, 90]], { top: 100, bulge: .4, shine: 0 }); return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Rabo alto cacheado', d: k => curls(k, [[200, 70, 16], [220, 90, 18], [232, 120, 18], [236, 150, 18], [232, 180, 16], [226, 206, 14], [218, 228, 12]]) + `<ellipse cx="192" cy="68" rx="8" ry="10" fill="${k.c[1]}" ${ol(k, 2.2)}/>` },
  { n: 'Orelhas de cabelo', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + 'o' + m }), 'M84 70 C70 50 80 26 94 30', [[94, 30], [112, 54], [100, 66], [84, 70]], { top: 40, bulge: .5, shine: 0 }); return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Rabo duplo alto', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + 'd' + m }), 'M104 48 C60 30 30 70 34 130', [[34, 130], [30, 176], [44, 162], [46, 200], [58, 170], [66, 184], [66, 120], [80, 76], [100, 64]], { top: 60, bulge: .3, shine: 0 }) + `<ellipse cx="102" cy="56" rx="7" ry="9" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
];

/* Cabelo frontal (franja) — mechas pontudas sobre a testa, laterais emoldurando o rosto */
PARTS.bangs = [null,
  { n: 'Franja reta', d: k => hair(k, CAP_BANGS, [[230, 150], [222, 184], [210, 116], [194, 142], [182, 100], [164, 138], [150, 98], [132, 140], [118, 100], [102, 140], [90, 116], [78, 184], [70, 150]], { edgeOnly: 1, bulge: .45 }) },
  { n: 'Franja lateral', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 178], [212, 108], [196, 132], [184, 90], [160, 128], [146, 84], [116, 136], [104, 94], [86, 150], [80, 122], [76, 188], [70, 150]], { edgeOnly: 1, bulge: .5, sw: -7 }) },
  { n: 'Repartida', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 196], [212, 118], [192, 142], [176, 98], [160, 124], [150, 76], [140, 124], [124, 98], [108, 142], [88, 118], [76, 196], [70, 150]], { edgeOnly: 1, bulge: .55 }) },
  { n: 'Espetada', d: k => hair(k, 'M68 150 C54 60 102 30 150 30 C198 30 246 60 232 150', [[232, 150], [226, 156], [216, 108], [206, 138], [196, 98], [180, 134], [170, 94], [154, 136], [144, 92], [128, 132], [118, 96], [102, 136], [92, 108], [80, 154], [68, 150]], { edgeOnly: 1, bulge: .05, w: 3 }) },
  { n: 'Mechas longas', d: k => hair(k, CAP_BANGS, [[230, 150], [226, 226], [212, 118], [194, 140], [180, 100], [162, 136], [148, 98], [130, 138], [116, 100], [102, 140], [88, 118], [74, 226], [70, 150]], { edgeOnly: 1, bulge: .45 }) },
  { n: 'Franjinha', d: k => hair(k, 'M72 132 C64 62 104 38 150 38 C196 38 236 62 228 132', [[228, 132], [216, 110], [204, 86], [190, 106], [178, 84], [164, 106], [150, 84], [136, 106], [122, 84], [110, 106], [96, 86], [84, 110], [72, 132]], { edgeOnly: 1, bulge: .3 }) },
  { n: 'Cacheada', d: k => curls(k, [[80, 96, 15], [98, 80, 16], [120, 72, 16], [142, 70, 16], [164, 70, 16], [186, 74, 16], [206, 84, 16], [222, 100, 14], [150, 60, 30]]) },
  { n: 'Topete', d: k => hair(k, 'M70 150 C58 70 94 40 134 42 C144 16 196 12 212 40 C234 58 240 96 230 150', [[230, 150], [222, 162], [214, 104], [196, 118], [184, 86], [160, 106], [150, 86], [124, 110], [112, 92], [92, 122], [84, 106], [76, 154], [70, 150]], { edgeOnly: 1, bulge: .35, sw: -3, shine: 'M150 34 Q180 22 206 42' }) },
  { n: 'Cobrindo o olho', d: k => hair(k, CAP_BANGS, [[232, 150], [226, 200], [214, 178], [204, 202], [190, 150], [176, 128], [160, 106], [140, 122], [126, 98], [108, 126], [96, 104], [84, 152], [70, 150]], { edgeOnly: 1, bulge: .4, sw: -4 }) },
  { n: 'Emo repicada', d: k => hair(k, CAP_BANGS, [[232, 150], [226, 202], [218, 168], [212, 194], [200, 152], [192, 178], [182, 126], [166, 110], [150, 124], [140, 100], [124, 120], [112, 98], [96, 122], [86, 104], [76, 148], [70, 150]], { edgeOnly: 1, bulge: .1, sw: -3 }) },
  { n: 'Princesa', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 184], [212, 110], [196, 134], [184, 96], [164, 124], [150, 82], [136, 124], [116, 96], [104, 134], [88, 110], [76, 184], [70, 150]], { edgeOnly: 1, bulge: .8 }) },
  { n: 'Moicano', d: k => spiky(k, [[126, 110], [114, 60], [132, 64], [126, 28], [146, 42], [150, 6], [156, 42], [176, 28], [168, 64], [186, 60], [174, 110]], [150, 100]) },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Franja bagunçada', d: k => hair(k, CAP_BANGS, [[230, 150], [226, 170], [216, 110], [206, 132], [196, 94], [184, 120], [172, 88], [160, 118], [148, 90], [136, 120], [122, 92], [110, 124], [98, 100], [88, 128], [78, 176], [70, 150]], { edgeOnly: 1, bulge: .15, sw: -3 }) },
  { n: 'Franja de lado longa', d: k => hair(k, CAP_BANGS, [[230, 150], [226, 186], [214, 122], [200, 142], [186, 110], [164, 134], [150, 98], [124, 150], [110, 120], [96, 170], [84, 146], [78, 204], [70, 150]], { edgeOnly: 1, bulge: .5, sw: -8 }) },
  { n: 'Franja reta com mechas', d: k => hair(k, CAP_BANGS, [[230, 150], [228, 236], [218, 122], [206, 126], [194, 118], [182, 124], [168, 116], [150, 124], [132, 116], [118, 124], [106, 118], [94, 126], [82, 122], [72, 236], [70, 150]], { edgeOnly: 1, bulge: .2 }) },
  { n: 'Franja em V', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 176], [212, 104], [194, 126], [178, 98], [150, 150], [122, 98], [106, 126], [88, 104], [76, 176], [70, 150]], { edgeOnly: 1, bulge: .4 }) },
  { n: 'Franja curtinha reta', d: k => hair(k, 'M72 124 C64 62 104 38 150 38 C196 38 236 62 228 124', [[228, 124], [220, 100], [206, 96], [192, 100], [178, 96], [164, 100], [150, 96], [136, 100], [122, 96], [108, 100], [94, 96], [80, 100], [72, 124]], { edgeOnly: 1, bulge: .1 }) },
  { n: 'Topete para cima', d: k => hair(k, 'M70 150 C60 86 88 54 120 44 C130 10 186 4 208 30 C236 56 240 100 230 150', [[230, 150], [224, 164], [214, 108], [198, 124], [186, 94], [166, 110], [150, 92], [128, 112], [112, 96], [96, 120], [84, 116], [76, 156], [70, 150]], { edgeOnly: 1, bulge: .35, sw: -4, shine: 'M130 32 Q170 16 200 36' }) },
  { n: 'Cortina', d: k => hair(k, CAP_BANGS, [[230, 150], [226, 204], [214, 132], [196, 116], [174, 96], [158, 78], [150, 70], [142, 78], [126, 96], [104, 116], [86, 132], [74, 204], [70, 150]], { edgeOnly: 1, bulge: .65 }) },
  { n: 'Franja pontuda', d: k => hair(k, CAP_BANGS, [[230, 150], [226, 172], [216, 108], [204, 140], [192, 100], [176, 144], [162, 98], [150, 146], [138, 98], [124, 144], [108, 100], [96, 140], [84, 108], [74, 172], [70, 150]], { edgeOnly: 1, bulge: .02 }) },
  { n: 'Franja caída no olho', d: k => hair(k, CAP_BANGS, [[232, 150], [226, 178], [214, 114], [200, 130], [186, 104], [170, 124], [156, 100], [140, 170], [124, 110], [104, 180], [94, 130], [80, 176], [70, 150]], { edgeOnly: 1, bulge: .45, sw: -6 }) },
  { n: 'Mechas laterais trançadas', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 170], [212, 110], [196, 132], [182, 98], [164, 128], [150, 96], [136, 128], [118, 98], [104, 132], [88, 110], [76, 170], [70, 150]], { edgeOnly: 1, bulge: .45 }) + [[80, -1], [220, 1]].map(([x]) => braid(k, [[x, 168], [x, 184], [x, 200], [x, 216]], 7)).join('') },
];

/* Ahoge (mechas-antena no topo) */
PARTS.ahoge = [null,
  { n: 'Antena', d: k => `<path d="M150 50 C144 28 160 12 180 10 C166 20 158 32 160 50Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Dupla', d: k => `<path d="M146 50 C136 30 142 16 158 8 C150 22 150 34 154 50Z" fill="${k.F}" ${ol(k)}/><path d="M156 50 C160 28 178 18 196 20 C180 28 170 38 164 52Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Coração', d: k => `<path d="M150 50 C148 40 150 32 152 26" stroke="${k.c[2]}" stroke-width="3" fill="none"/><path d="${Shape.heart(152, 18, 9)}" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Raio', d: k => `<path d="M148 52 L160 34 L150 32 L166 10 L160 30 L170 32 L156 52Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Cacho', d: k => `<path d="M150 50 C140 34 150 18 166 20 C178 22 180 36 170 40 C162 42 160 34 166 32" stroke="${k.c[2]}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M150 50 C140 34 150 18 166 20 C178 22 180 36 170 40 C162 42 160 34 166 32" stroke="${k.c[0]}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  /* ---- recriados a partir do Gacha Club ---- */
  { n: 'Mecha curva', d: k => `<path d="M146 50 C130 30 140 8 170 6 C152 16 150 32 158 50Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Tripla', d: k => [[140, -20], [150, 0], [160, 20]].map(([x, a]) => `<path d="M${x} 50 C${x - 4} 34 ${x} 20 ${x + 6} 12 C${x + 4} 26 ${x + 4} 38 ${x + 6} 50Z" fill="${k.F}" ${ol(k)} transform="rotate(${a} ${x} 50)"/>`).join('') },
  { n: 'Orelhas de gato', d: k => [0, 1].map(m => { const p = `<path d="M104 70 L96 30 L130 54Z" fill="${k.F}" ${ol(k)}/><path d="M106 60 L102 40 L120 54Z" fill="${k.c[1]}"/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Espiral', d: k => `<path d="M150 50 C140 34 146 16 164 16 C178 16 180 32 168 36 C160 38 158 28 166 26" stroke="${k.c[2]}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M150 50 C140 34 146 16 164 16 C178 16 180 32 168 36 C160 38 158 28 166 26" stroke="${k.c[0]}" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { n: 'Estrela', d: k => `<path d="M150 50 L152 30" stroke="${k.c[2]}" stroke-width="3"/><path d="${Shape.star(152, 22, 11, 5)}" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Folha', d: k => `<path d="M150 50 Q148 36 152 28" stroke="${k.c[2]}" stroke-width="3" fill="none"/><path d="M152 30 Q136 10 150 0 Q170 12 152 30Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Chifrinho de cabelo', d: k => `<path d="M140 50 Q136 22 150 10 Q164 22 160 50Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Mecha lateral', d: k => `<path d="M186 58 C196 40 214 34 232 40 C214 44 204 52 196 64Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Onda', d: k => `<path d="M140 52 C132 40 146 32 150 22 C154 12 166 12 170 20 C160 18 158 26 156 34 C152 44 150 48 152 54Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Coração duplo', d: k => [[140, -14], [160, 14]].map(([x, a]) => `<g transform="rotate(${a} ${x} 50)"><path d="M${x} 50 L${x} 30" stroke="${k.c[2]}" stroke-width="3"/><path d="${Shape.heart(x, 22, 7)}" fill="${k.F}" ${ol(k, 2)}/></g>`).join('') },
];
