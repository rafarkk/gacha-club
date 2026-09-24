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
const hairShine = (d = 'M104 66 Q150 50 196 66') => `<path d="${d}" stroke="#fff" stroke-opacity=".38" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const braid = (k, pts, r = 11) => pts.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${k.F}" ${ol(k, 2)}/>`).join('');

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
  if (shine) inner += `<path d="${shine}" stroke="#fff" stroke-opacity=".42" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="15 6"/>`;
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
  { n: 'Tranças', d: k => braid(k, [[86, 196], [84, 216], [83, 236], [83, 256], [84, 276], [86, 296]], 12) + braid(k, [[214, 196], [216, 216], [217, 236], [217, 256], [216, 276], [214, 296]], 12) + `<circle cx="86" cy="312" r="6" fill="${k.c[1]}" ${ol(k, 2)}/><circle cx="214" cy="312" r="6" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Cacheado longo', d: k => blob(k, [[78, 150, 22], [70, 186, 22], [74, 222, 22], [80, 258, 20], [96, 286, 18], [222, 150, 22], [230, 186, 22], [226, 222, 22], [220, 258, 20], [204, 286, 18], [120, 290, 18], [150, 294, 18], [180, 290, 18], [150, 200, 70]]) },
  { n: 'Repicado', d: k => hair(k, CAP_BACK, [[230, 128], [244, 240], [240, 318], [226, 296], [220, 326], [204, 300], [196, 334], [178, 306], [164, 336], [150, 310], [136, 336], [122, 306], [104, 334], [96, 300], [80, 326], [74, 296], [60, 318], [56, 240], [70, 128]], { top: 150, shine: 0, bulge: .1 }) },
  { n: 'Bob longo', d: k => hair(k, CAP_BACK, [[232, 128], [240, 200], [236, 256], [220, 246], [206, 262], [186, 248], [166, 264], [150, 250], [134, 264], [114, 248], [94, 262], [80, 246], [64, 256], [60, 200], [68, 128]], { top: 150, shine: 0, bulge: .5 }) },
];

/* Cabelo posterior (volume da cabeça, atrás do rosto) */
PARTS.hairBase = [null,
  { n: 'Curto redondo', d: k => hair(k, CAP_BASE, [[238, 150], [236, 190], [224, 178], [216, 198], [200, 182], [150, 188], [100, 182], [84, 198], [76, 178], [64, 190], [62, 150]], { top: 60, bulge: .5, shine: 0 }) },
  { n: 'Chanel', d: k => hair(k, CAP_BASE, [[238, 150], [242, 214], [228, 202], [218, 218], [204, 204], [150, 208], [96, 204], [82, 218], [72, 202], [58, 214], [62, 150]], { top: 60, bulge: .35, shine: 0 }) },
  { n: 'Volumoso', d: k => hair(k, 'M50 150 C34 58 96 20 150 20 C204 20 266 58 250 150', [[250, 150], [254, 198], [238, 186], [232, 210], [214, 194], [150, 200], [86, 194], [68, 210], [62, 186], [46, 198], [50, 150]], { top: 50, bulge: .55, shine: 0 }) },
  { n: 'Espetado', d: k => `<path d="M70 150 L50 122 L64 104 L46 80 L74 74 L68 44 L100 54 L110 24 L134 44 L150 16 L166 44 L190 24 L200 54 L232 44 L226 74 L254 80 L236 104 L250 122 L230 150Z" fill="${k.F}" ${ol(k, 2.8)}/>` },
  { n: 'Cacheado', d: k => blob(k, [[74, 104, 22], [70, 140, 22], [78, 174, 20], [226, 104, 22], [230, 140, 22], [222, 174, 20], [92, 66, 24], [124, 46, 24], [150, 40, 24], [176, 46, 24], [208, 66, 24], [150, 120, 72]]) },
  { n: 'Médio reto', d: k => hair(k, CAP_BASE, [[238, 150], [244, 248], [230, 234], [220, 252], [204, 238], [150, 242], [96, 238], [80, 252], [70, 234], [56, 248], [62, 150]], { top: 60, bulge: .3, shine: 0 }) },
  { n: 'Raspado', d: k => `<path d="M72 124 C70 70 106 52 150 52 C194 52 230 70 228 124 C220 104 190 92 150 92 C110 92 80 104 72 124Z" fill="${k.F}" ${ol(k, 2.8)}/>` },
  { n: 'Fofo curto', d: k => hair(k, 'M60 150 C48 70 90 32 150 32 C210 32 252 70 240 150', [[240, 150], [242, 188], [228, 178], [222, 196], [150, 186], [78, 196], [72, 178], [58, 188], [60, 150]], { top: 60, bulge: .7, shine: 0 }) },
];

/* Rabo de cavalo / penteados presos */
PARTS.ponytail = [null,
  { n: 'Rabo alto', d: k => hair(k, 'M182 62 C238 36 272 92 262 150', [[262, 150], [258, 214], [250, 196], [240, 268], [232, 222], [222, 250], [218, 150], [202, 94], [186, 86]], { top: 70, bulge: .3, shine: 0, sw: -2 }) + `<circle cx="190" cy="72" r="9" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Maria-chiquinha', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + m }), 'M92 92 C44 94 24 162 36 232', [[36, 232], [48, 262], [52, 240], [62, 256], [62, 218], [70, 150], [96, 118]], { top: 110, bulge: .3, shine: 0 }) + `<circle cx="86" cy="96" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Coque', d: k => `<circle cx="150" cy="36" r="27" fill="${k.F}" ${ol(k, 2.8)}/><path d="M130 30 Q150 20 170 30 M134 44 Q150 36 166 44" stroke="${k.c[2]}" stroke-width="1.7" fill="none" opacity=".45"/><rect x="132" y="56" width="36" height="7" rx="3" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Coques duplos', d: k => `<circle cx="90" cy="52" r="25" fill="${k.F}" ${ol(k, 2.8)}/><circle cx="210" cy="52" r="25" fill="${k.F}" ${ol(k, 2.8)}/><path d="M78 46 Q90 38 102 44 M198 44 Q210 38 222 46" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none"/><path d="M76 58 Q90 66 104 58 M196 58 Q210 66 224 58" stroke="${k.c[2]}" stroke-opacity=".4" stroke-width="1.7" fill="none"/>` },
  { n: 'Trança lateral', d: k => braid(k, [[80, 176], [84, 198], [88, 220], [92, 242], [96, 264], [100, 286]], 13) + `<circle cx="102" cy="302" r="7" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Rabo de lado', d: k => hair(k, 'M86 104 C40 144 36 226 60 280', [[60, 280], [70, 300], [74, 276], [84, 290], [88, 240], [94, 184], [100, 150]], { top: 120, bulge: .3, shine: 0 }) + `<circle cx="86" cy="116" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Chiquinhas curtas', d: k => [0, 1].map(m => { const p = hair(Object.assign({}, k, { u: k.u + m }), 'M88 86 C58 78 42 104 44 134', [[44, 134], [48, 150], [56, 136], [64, 146], [70, 126], [80, 124], [92, 98]], { top: 96, bulge: .4, shine: 0 }) + `<circle cx="86" cy="90" r="6" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Rabo gigante', d: k => hair(k, 'M186 58 C264 20 306 110 290 196', [[290, 196], [284, 262], [272, 244], [260, 336], [248, 288], [236, 306], [222, 170], [206, 94], [190, 84]], { top: 70, bulge: .3, shine: 0, sw: -2 }) + `<circle cx="192" cy="70" r="10" fill="${k.c[1]}" ${ol(k, 2)}/>` },
];

/* Cabelo frontal (franja) — mechas pontudas sobre a testa, laterais emoldurando o rosto */
PARTS.bangs = [null,
  { n: 'Franja reta', d: k => hair(k, CAP_BANGS, [[230, 150], [222, 184], [210, 116], [194, 142], [182, 100], [164, 138], [150, 98], [132, 140], [118, 100], [102, 140], [90, 116], [78, 184], [70, 150]], { edgeOnly: 1, bulge: .45 }) },
  { n: 'Franja lateral', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 178], [212, 108], [196, 132], [184, 90], [160, 128], [146, 84], [116, 136], [104, 94], [86, 150], [80, 122], [76, 188], [70, 150]], { edgeOnly: 1, bulge: .5, sw: -7 }) },
  { n: 'Repartida', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 196], [212, 118], [192, 142], [176, 98], [160, 124], [150, 76], [140, 124], [124, 98], [108, 142], [88, 118], [76, 196], [70, 150]], { edgeOnly: 1, bulge: .55 }) },
  { n: 'Espetada', d: k => hair(k, 'M68 150 C54 60 102 30 150 30 C198 30 246 60 232 150', [[232, 150], [226, 156], [216, 108], [206, 138], [196, 98], [180, 134], [170, 94], [154, 136], [144, 92], [128, 132], [118, 96], [102, 136], [92, 108], [80, 154], [68, 150]], { edgeOnly: 1, bulge: .05, w: 3 }) },
  { n: 'Mechas longas', d: k => hair(k, CAP_BANGS, [[230, 150], [226, 226], [212, 118], [194, 140], [180, 100], [162, 136], [148, 98], [130, 138], [116, 100], [102, 140], [88, 118], [74, 226], [70, 150]], { edgeOnly: 1, bulge: .45 }) },
  { n: 'Franjinha', d: k => hair(k, 'M72 132 C64 62 104 38 150 38 C196 38 236 62 228 132', [[228, 132], [216, 110], [204, 86], [190, 106], [178, 84], [164, 106], [150, 84], [136, 106], [122, 84], [110, 106], [96, 86], [84, 110], [72, 132]], { edgeOnly: 1, bulge: .3 }) },
  { n: 'Cacheada', d: k => blob(k, [[80, 96, 15], [98, 80, 16], [120, 72, 16], [142, 70, 16], [164, 70, 16], [186, 74, 16], [206, 84, 16], [222, 100, 14], [150, 60, 30]]) },
  { n: 'Topete', d: k => hair(k, 'M70 150 C58 70 94 40 134 42 C144 16 196 12 212 40 C234 58 240 96 230 150', [[230, 150], [222, 162], [214, 104], [196, 118], [184, 86], [160, 106], [150, 86], [124, 110], [112, 92], [92, 122], [84, 106], [76, 154], [70, 150]], { edgeOnly: 1, bulge: .35, sw: -3, shine: 'M150 34 Q180 22 206 42' }) },
  { n: 'Cobrindo o olho', d: k => hair(k, CAP_BANGS, [[232, 150], [226, 200], [214, 178], [204, 202], [190, 150], [176, 128], [160, 106], [140, 122], [126, 98], [108, 126], [96, 104], [84, 152], [70, 150]], { edgeOnly: 1, bulge: .4, sw: -4 }) },
  { n: 'Emo repicada', d: k => hair(k, CAP_BANGS, [[232, 150], [226, 202], [218, 168], [212, 194], [200, 152], [192, 178], [182, 126], [166, 110], [150, 124], [140, 100], [124, 120], [112, 98], [96, 122], [86, 104], [76, 148], [70, 150]], { edgeOnly: 1, bulge: .1, sw: -3 }) },
  { n: 'Princesa', d: k => hair(k, CAP_BANGS, [[230, 150], [224, 184], [212, 110], [196, 134], [184, 96], [164, 124], [150, 82], [136, 124], [116, 96], [104, 134], [88, 110], [76, 184], [70, 150]], { edgeOnly: 1, bulge: .8 }) },
  { n: 'Moicano', d: k => `<path d="M126 110 L118 60 L132 66 L130 30 L146 44 L150 10 L156 44 L172 30 L168 66 L182 60 L174 110 Q150 100 126 110Z" fill="${k.F}" ${ol(k, 2.8)}/>` },
];

/* Ahoge (mechas-antena no topo) */
PARTS.ahoge = [null,
  { n: 'Antena', d: k => `<path d="M150 50 C144 28 160 12 180 10 C166 20 158 32 160 50Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Dupla', d: k => `<path d="M146 50 C136 30 142 16 158 8 C150 22 150 34 154 50Z" fill="${k.F}" ${ol(k)}/><path d="M156 50 C160 28 178 18 196 20 C180 28 170 38 164 52Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Coração', d: k => `<path d="M150 50 C148 40 150 32 152 26" stroke="${k.c[2]}" stroke-width="3" fill="none"/><path d="${Shape.heart(152, 18, 9)}" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Raio', d: k => `<path d="M148 52 L160 34 L150 32 L166 10 L160 30 L170 32 L156 52Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Cacho', d: k => `<path d="M150 50 C140 34 150 18 166 20 C178 22 180 36 170 40 C162 42 160 34 166 32" stroke="${k.c[2]}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M150 50 C140 34 150 18 166 20 C178 22 180 36 170 40 C162 42 160 34 166 32" stroke="${k.c[0]}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
];
