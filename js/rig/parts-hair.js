/* ============ PEÇAS: CABELO ============
   Espaço do personagem (viewBox 0 0 300 420). Cabeça centrada em (150,128).
   Cada modelo: { n: nome, d: k => svg }. k.F = preenchimento (gradiente principal→secundária),
   k.c = [principal, secundária, contorno], k.st = atributos de contorno. Índice 0 = nenhum. */

const PARTS = {};
const ol = (k, w = 2.5) => `stroke="${k.c[2]}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
/* União de círculos com contorno único (cachos, nuvens) */
function blob(k, circles) {
  return `<g fill="${k.c[2]}">${circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.2}"/>`).join('')}</g>` +
    `<g fill="${k.F}">${circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
}
const hairShine = (d = 'M104 66 Q150 50 196 66') => `<path d="${d}" stroke="#fff" stroke-opacity=".38" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const braid = (k, pts, r = 11) => pts.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${k.F}" ${ol(k, 2)}/>`).join('');

/* Cabelo de trás (longo, atrás do corpo) */
PARTS.hairBack = [null,
  { n: 'Longo reto', d: k => `<path d="M72 128 L60 330 C100 344 200 344 240 330 L228 128Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Longo ondulado', d: k => `<path d="M72 128 C50 180 78 220 58 262 C42 300 72 322 62 342 C110 354 190 354 238 342 C228 322 258 300 242 262 C222 220 250 180 228 128Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Muito longo', d: k => `<path d="M74 128 L48 392 C110 408 190 408 252 392 L226 128Z" fill="${k.F}" ${ol(k)}/><path d="M110 200 L100 380 M190 200 L200 380 M150 210 L150 396" stroke="${k.c[2]}" stroke-opacity=".35" stroke-width="2" fill="none"/>` },
  { n: 'Médio em camadas', d: k => `<path d="M70 128 L62 252 L80 240 L84 270 L104 252 L112 280 L132 260 L150 284 L168 260 L188 280 L196 252 L216 270 L220 240 L238 252 L230 128Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Tranças', d: k => braid(k, [[86, 196], [84, 216], [83, 236], [83, 256], [84, 276], [86, 296]], 12) + braid(k, [[214, 196], [216, 216], [217, 236], [217, 256], [216, 276], [214, 296]], 12) + `<circle cx="86" cy="312" r="6" fill="${k.c[1]}" ${ol(k, 2)}/><circle cx="214" cy="312" r="6" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Cacheado longo', d: k => blob(k, [[78, 150, 22], [70, 186, 22], [74, 222, 22], [80, 258, 20], [96, 286, 18], [222, 150, 22], [230, 186, 22], [226, 222, 22], [220, 258, 20], [204, 286, 18], [120, 290, 18], [150, 294, 18], [180, 290, 18], [150, 200, 70]]) },
  { n: 'Repicado', d: k => `<path d="M70 128 L58 310 L74 296 L80 322 L98 300 L108 330 L126 306 L140 334 L150 310 L160 334 L174 306 L192 330 L202 300 L220 322 L226 296 L242 310 L230 128Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Bob longo', d: k => `<path d="M68 128 C60 180 62 230 74 250 C110 262 190 262 226 250 C238 230 240 180 232 128Z" fill="${k.F}" ${ol(k)}/>` },
];

/* Cabelo posterior (volume da cabeça, atrás do rosto) */
PARTS.hairBase = [null,
  { n: 'Curto redondo', d: k => `<path d="M68 128 C62 60 104 42 150 42 C196 42 238 60 232 128 C234 152 226 170 216 180 L84 180 C74 170 66 152 68 128Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Chanel', d: k => `<path d="M66 124 C62 56 104 40 150 40 C196 40 238 56 234 124 L238 208 C220 216 200 212 190 206 L110 206 C100 212 80 216 62 208Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Volumoso', d: k => `<path d="M58 140 C38 100 60 42 110 36 C130 22 170 22 190 36 C240 42 262 100 242 140 C252 172 238 198 214 202 L86 202 C62 198 48 172 58 140Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Espetado', d: k => `<path d="M70 150 L50 122 L64 104 L46 80 L74 74 L68 44 L100 54 L110 24 L134 44 L150 16 L166 44 L190 24 L200 54 L232 44 L226 74 L254 80 L236 104 L250 122 L230 150Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Cacheado', d: k => blob(k, [[74, 104, 22], [70, 140, 22], [78, 174, 20], [226, 104, 22], [230, 140, 22], [222, 174, 20], [92, 66, 24], [124, 46, 24], [150, 40, 24], [176, 46, 24], [208, 66, 24], [150, 120, 72]]) },
  { n: 'Médio reto', d: k => `<path d="M66 124 C62 56 104 40 150 40 C196 40 238 56 234 124 L240 240 C200 250 100 250 60 240Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Raspado', d: k => `<path d="M72 124 C70 70 106 52 150 52 C194 52 230 70 228 124 C220 104 190 92 150 92 C110 92 80 104 72 124Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Fofo curto', d: k => `<path d="M64 132 C52 90 76 46 118 40 C138 30 162 30 182 40 C224 46 248 90 236 132 C242 160 230 184 214 190 C200 178 100 178 86 190 C70 184 58 160 64 132Z" fill="${k.F}" ${ol(k)}/>` },
];

/* Rabo de cavalo / penteados presos */
PARTS.ponytail = [null,
  { n: 'Rabo alto', d: k => `<path d="M182 62 C238 40 266 92 254 152 C248 194 254 232 234 266 C228 222 216 182 216 142 C216 112 202 92 186 86Z" fill="${k.F}" ${ol(k)}/><circle cx="190" cy="72" r="9" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Maria-chiquinha', d: k => [0, 1].map(m => { const p = `<path d="M86 90 C40 98 28 170 42 244 C46 266 60 268 62 248 C58 192 68 142 94 118Z" fill="${k.F}" ${ol(k)}/><circle cx="86" cy="96" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Coque', d: k => `<circle cx="150" cy="36" r="27" fill="${k.F}" ${ol(k)}/><path d="M130 30 Q150 20 170 30" stroke="${k.c[2]}" stroke-width="2" fill="none" opacity=".5"/><rect x="132" y="56" width="36" height="7" rx="3" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Coques duplos', d: k => `<circle cx="90" cy="52" r="25" fill="${k.F}" ${ol(k)}/><circle cx="210" cy="52" r="25" fill="${k.F}" ${ol(k)}/><path d="M78 46 Q90 38 102 44 M198 44 Q210 38 222 46" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none"/>` },
  { n: 'Trança lateral', d: k => braid(k, [[80, 176], [84, 198], [88, 220], [92, 242], [96, 264], [100, 286]], 13) + `<circle cx="102" cy="302" r="7" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Rabo de lado', d: k => `<path d="M82 108 C40 150 44 232 72 284 C82 252 86 202 98 152Z" fill="${k.F}" ${ol(k)}/><circle cx="86" cy="116" r="8" fill="${k.c[1]}" ${ol(k, 2)}/>` },
  { n: 'Chiquinhas curtas', d: k => [0, 1].map(m => { const p = `<path d="M84 84 C56 80 44 110 50 140 C56 128 66 122 80 124 C70 110 74 96 90 96Z" fill="${k.F}" ${ol(k)}/><circle cx="86" cy="90" r="6" fill="${k.c[1]}" ${ol(k, 2)}/>`; return m ? `<g transform="translate(300 0) scale(-1 1)">${p}</g>` : p; }).join('') },
  { n: 'Rabo gigante', d: k => `<path d="M186 58 C260 24 300 110 282 190 C272 236 280 290 250 330 C238 270 226 220 222 170 C220 120 206 94 190 84Z" fill="${k.F}" ${ol(k)}/><path d="M230 120 C250 170 246 230 258 280" stroke="${k.c[2]}" stroke-opacity=".35" stroke-width="2" fill="none"/><circle cx="192" cy="70" r="10" fill="${k.c[1]}" ${ol(k, 2)}/>` },
];

/* Cabelo frontal (franja) — define a linha do cabelo sobre o rosto */
PARTS.bangs = [null,
  { n: 'Franja reta', d: k => `<path d="M70 118 C64 64 104 46 150 46 C196 46 236 64 230 118 L218 118 L214 100 L200 112 L190 96 L176 110 L164 94 L150 108 L136 94 L124 110 L110 96 L100 112 L86 100 L82 118Z" fill="${k.F}" ${ol(k)}/>` + hairShine() },
  { n: 'Franja lateral', d: k => `<path d="M70 124 C64 60 110 44 160 46 C206 48 236 70 230 122 C220 100 206 84 186 76 C170 100 130 118 96 112 C86 114 76 120 70 124Z" fill="${k.F}" ${ol(k)}/>` + hairShine('M118 60 Q160 50 200 64') },
  { n: 'Repartida', d: k => `<path d="M68 128 C62 60 104 44 150 50 C196 44 238 60 232 128 C224 96 200 74 170 70 C160 80 154 90 150 106 C146 90 140 80 130 70 C100 74 76 96 68 128Z" fill="${k.F}" ${ol(k)}/>` + hairShine('M100 66 Q124 54 142 58 M158 58 Q176 54 200 66') },
  { n: 'Espetada', d: k => `<path d="M66 124 L60 84 L78 90 L74 58 L100 70 L104 40 L126 60 L140 34 L156 58 L176 36 L184 64 L208 50 L206 78 L230 72 L222 100 L236 124 L214 106 L204 120 L190 96 L176 114 L160 92 L146 112 L130 92 L116 112 L104 94 L90 116 L80 102Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Mechas longas', d: k => `<path d="M72 112 C60 150 64 192 78 218 L90 210 C84 178 86 142 92 120Z" fill="${k.F}" ${ol(k)}/><path d="M228 112 C240 150 236 192 222 218 L210 210 C216 178 214 142 208 120Z" fill="${k.F}" ${ol(k)}/>` + `<path d="M70 118 C64 64 104 46 150 46 C196 46 236 64 230 118 L218 118 L214 100 L200 112 L190 96 L176 110 L164 94 L150 108 L136 94 L124 110 L110 96 L100 112 L86 100 L82 118Z" fill="${k.F}" ${ol(k)}/>` + hairShine() },
  { n: 'Franjinha', d: k => `<path d="M72 106 C70 62 106 48 150 48 C194 48 230 62 228 106 C212 92 190 88 150 90 C110 88 88 92 72 106Z" fill="${k.F}" ${ol(k)}/>` + hairShine() },
  { n: 'Cacheada', d: k => blob(k, [[80, 96, 15], [98, 80, 16], [120, 72, 16], [142, 70, 16], [164, 70, 16], [186, 74, 16], [206, 84, 16], [222, 100, 14], [150, 60, 30]]) },
  { n: 'Topete', d: k => `<path d="M70 120 C64 70 100 50 140 50 C150 28 192 22 208 44 C232 60 236 90 230 120 C220 96 200 82 176 80 C150 84 110 90 90 104 C80 108 74 114 70 120Z" fill="${k.F}" ${ol(k)}/>` + hairShine('M150 40 Q176 30 200 46') },
  { n: 'Cobrindo o olho', d: k => `<path d="M70 120 C64 60 110 44 160 46 C210 50 240 80 230 152 C224 172 214 180 204 182 C200 152 186 122 160 106 C130 104 100 110 70 120Z" fill="${k.F}" ${ol(k)}/>` + hairShine('M120 58 Q170 48 210 70') },
  { n: 'Emo repicada', d: k => `<path d="M70 118 C64 60 110 44 162 46 C212 50 240 84 232 160 L222 146 L218 172 L206 150 L200 176 L190 144 C180 124 170 112 150 106 L140 118 L132 104 L116 116 L110 102 L94 116 L88 104Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Princesa', d: k => `<path d="M70 124 C60 64 104 42 150 48 C196 42 240 64 230 124 C226 104 214 90 196 84 C186 96 170 100 160 90 C150 100 136 100 126 88 C114 98 100 98 92 86 C80 94 72 108 70 124Z" fill="${k.F}" ${ol(k)}/>` + hairShine() },
  { n: 'Moicano', d: k => `<path d="M126 110 L118 60 L132 66 L130 30 L146 44 L150 10 L156 44 L172 30 L168 66 L182 60 L174 110 Q150 100 126 110Z" fill="${k.F}" ${ol(k)}/>` },
];

/* Ahoge (mechas-antena no topo) */
PARTS.ahoge = [null,
  { n: 'Antena', d: k => `<path d="M150 50 C144 28 160 12 180 10 C166 20 158 32 160 50Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Dupla', d: k => `<path d="M146 50 C136 30 142 16 158 8 C150 22 150 34 154 50Z" fill="${k.F}" ${ol(k)}/><path d="M156 50 C160 28 178 18 196 20 C180 28 170 38 164 52Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Coração', d: k => `<path d="M150 50 C148 40 150 32 152 26" stroke="${k.c[2]}" stroke-width="3" fill="none"/><path d="${Shape.heart(152, 18, 9)}" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Raio', d: k => `<path d="M148 52 L160 34 L150 32 L166 10 L160 30 L170 32 L156 52Z" fill="${k.F}" ${ol(k)}/>` },
  { n: 'Cacho', d: k => `<path d="M150 50 C140 34 150 18 166 20 C178 22 180 36 170 40 C162 42 160 34 166 32" stroke="${k.c[2]}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M150 50 C140 34 150 18 166 20 C178 22 180 36 170 40 C162 42 160 34 166 32" stroke="${k.c[0]}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
];
