/* ============ FUNDOS E SOBREPOSIÇÕES (viewBox 0 0 300 400) ============
   Cenários portados do jogo anterior + fundos gerados (palco do clube, padrões) + sobreposições animadas. */

const Scenery = (() => {
  const shade = Color.shade, star = Shape.star;
  const EMOJI_FONT = `font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"`;
  const grad = (id, stops, vertical = true) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map((s, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${s}"/>`).join('')}</linearGradient>`;
  const sky = (u, stops) => `<defs>${grad(u + 'sk', stops)}</defs><rect width="300" height="400" fill="url(#${u}sk)"/>`;
  const cloud = (x, y, s = 1, op = .9) => `<g opacity="${op}" fill="#fff"><ellipse cx="${x}" cy="${y}" rx="${26 * s}" ry="${12 * s}"/><circle cx="${x - 10 * s}" cy="${y - 6 * s}" r="${11 * s}"/><circle cx="${x + 8 * s}" cy="${y - 9 * s}" r="${14 * s}"/></g>`;
  const blur = (u, sd = 6) => `<filter id="${u}bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

  /* ---------- Cenários panorâmicos (desenhados em 960×540, como os do jogo de referência) ----------
     O menu e o Estúdio mostram o fundo em 16:9: com o viewBox 300×400 e "slice", só a faixa y≈116–284 aparece.
     wide() encaixa o desenho 960×540 exatamente nessa faixa; cada cenário desenha também acima de y=0 e abaixo
     de y=540 (teto/céu e chão prolongados) para telas em retrato. */
  const wide = s => `<g transform="translate(0 115.625) scale(.3125)">${s}</g>`;
  const wdefs = u => `<defs>
    <filter id="${u}w1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${u}w2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${u}w3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="${u}w4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="34"/></filter>
    <filter id="${u}wg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
  const lg = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  const f1 = n => n.toFixed(1);
  const quad = (a, b, c, d, fill, extra = '') => `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} L${f1(c[0])} ${f1(c[1])} L${f1(d[0])} ${f1(d[1])}Z" fill="${fill}" ${extra}/>`;

  /* peças reutilizáveis dos cenários panorâmicos (coordenadas 960×540) */
  const cloudW = (x, y, sc = 1, cls = 'bg-drift-w') => `<g class="${cls}"><g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})">
    <ellipse cx="0" cy="14" rx="96" ry="22" fill="#cfe4f6"/><circle cx="-50" cy="0" r="32" fill="#fff"/><circle cx="4" cy="-20" r="46" fill="#fff"/><circle cx="56" cy="0" r="30" fill="#fff"/><ellipse cx="0" cy="10" rx="92" ry="20" fill="#fff"/>
    <path d="M-86 16 Q0 34 90 16 Q0 28 -86 16Z" fill="#cfe4f6"/><ellipse cx="-6" cy="-40" rx="22" ry="8" fill="#fff" opacity=".9"/><ellipse cx="-50" cy="-18" rx="12" ry="5" fill="#fff" opacity=".9"/></g></g>`;
  const sunW = (u, x, y, rr, col = '#fff8c8') => `<defs><radialGradient id="${u}sg${x}"><stop offset="0" stop-color="${col}" stop-opacity=".95"/><stop offset=".35" stop-color="${col}" stop-opacity=".45"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${rr * 3}" fill="url(#${u}sg${x})" class="bg-glow"/><circle cx="${x}" cy="${y}" r="${rr * .6}" fill="#fffef0"/>`;
  const haze = (u, y, h, col = '#ffffff') => `<defs>${lg(u + 'hz' + y, [[0, col, 0], [.5, col, .5], [1, col, 0]])}</defs><rect x="-60" y="${y}" width="1080" height="${h}" fill="url(#${u}hz${y})"/>`;
  const hillW = (cx, cy, rx, ry, fill, rim) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>` + (rim ? `<path d="M${cx - rx * .8} ${cy - ry * .6} Q${cx} ${cy - ry * 1.02} ${cx + rx * .8} ${cy - ry * .6}" stroke="${rim}" stroke-width="5" fill="none" opacity=".6"/>` : '');
  const ridgeW = (pts, col) => { let d = `M${pts[0][0]} 560 L${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x, y] = pts[i], n = pts[i + 1]; d += n ? ` Q${x} ${y} ${(x + n[0]) / 2} ${(y + n[1]) / 2}` : ` L${x} ${y}`; } return `<path d="${d} L${pts[pts.length - 1][0]} 560Z" fill="${col}"/>`; };
  /* árvore redonda: tronco, copa em cachos com luz em cima/esquerda e sombra embaixo/direita, sombra no chão */
  const treeR = (x, y, sc, col, hi) => `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="6" cy="2" rx="70" ry="10" fill="#000" opacity=".15"/><path d="M-9 0 L-6 -80 Q0 -90 6 -80 L9 0Z" fill="#7a4a28"/><path d="M0 0 L6 -80 L9 0Z" fill="#5a3218"/><path d="M-4 -60 Q-26 -80 -34 -90 M4 -70 Q24 -86 30 -98" stroke="#7a4a28" stroke-width="7" fill="none"/>
    ${[[-40, -100, 40], [36, -110, 42], [0, -140, 50], [-30, -150, 34], [34, -150, 32], [0, -100, 40]].map(([a, b, rr]) => `<circle cx="${a}" cy="${b}" r="${rr}" fill="${col}"/>`).join('')}
    ${[[20, -96, 34], [40, -128, 26], [6, -110, 30]].map(([a, b, rr]) => `<circle cx="${a}" cy="${b}" r="${rr}" fill="#000" opacity=".12"/>`).join('')}
    ${[[-30, -150, 20], [-6, -160, 24], [-44, -112, 18]].map(([a, b, rr]) => `<circle cx="${a}" cy="${b}" r="${rr}" fill="${hi}" opacity=".65"/>`).join('')}</g>`;
  const pineW = (x, y, h, col, dk) => `<g><rect x="${x - 5}" y="${y - 14}" width="10" height="16" fill="#6a4020"/>${[0, 1, 2].map(i => { const w = h * (.42 - i * .09), top = y - h + i * h * .18, bot = y - 10 - i * h * .24; return `<path d="M${x} ${f1(top)} L${f1(x - w)} ${f1(bot)} Q${x} ${f1(bot + 8)} ${f1(x + w)} ${f1(bot)}Z" fill="${col}"/><path d="M${x} ${f1(top)} L${f1(x + w)} ${f1(bot)} Q${f1(x + w / 2)} ${f1(bot + 5)} ${x} ${f1(bot + 7)}Z" fill="${dk}" opacity=".6"/>`; }).reverse().join('')}</g>`;
  const bush = (x, y, rr, col, hi) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${col}"/><circle cx="${x - rr * .6}" cy="${y + rr * .2}" r="${rr * .75}" fill="${col}"/><circle cx="${x + rr * .6}" cy="${y + rr * .25}" r="${rr * .7}" fill="${col}"/><circle cx="${x - rr * .25}" cy="${y - rr * .35}" r="${rr * .45}" fill="${hi}" opacity=".6"/>`;
  const rockW = (x, y, w, h, col = '#8a94a0', dk = '#5a6470') => `<ellipse cx="${x}" cy="${y + h * .45}" rx="${w * .6}" ry="${h * .22}" fill="#000" opacity=".2"/><path d="M${x - w / 2} ${y + h * .4} Q${x - w * .45} ${y - h * .4} ${x - w * .1} ${y - h * .5} Q${x + w * .4} ${y - h * .45} ${x + w / 2} ${y + h * .4}Z" fill="${col}"/><path d="M${x - w * .1} ${y - h * .5} Q${x + w * .4} ${y - h * .45} ${x + w / 2} ${y + h * .4} L${x + w * .1} ${y + h * .4}Z" fill="${dk}"/><path d="M${x - w * .38} ${y} Q${x - w * .3} ${y - h * .35} ${x - w * .05} ${y - h * .42}" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
  const tuftW = (x, y, sc, col) => `<g class="bg-plant" style="animation-delay:-${f1((x * 7) % 3)}s"><g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})">${[-40, -20, 0, 20, 40].map(a => `<path d="M0 0 Q${f1(Math.sin(a * Math.PI / 180) * 12)} -14 ${f1(Math.sin(a * Math.PI / 180) * 22)} ${f1(-20 - Math.cos(a * Math.PI / 180) * 8)}" stroke="${col}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
  const flowerW = (x, y, col, sc = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})"><path d="M0 0 L0 12" stroke="#3a8a2a" stroke-width="2"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${f1(Math.cos(a * Math.PI / 180) * 4)}" cy="${f1(Math.sin(a * Math.PI / 180) * 4)}" r="3.4" fill="${col}"/>`).join('')}<circle r="2.4" fill="#ffc83a"/></g>`;
  const benchW = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="4" rx="70" ry="8" fill="#000" opacity=".15"/><path d="M-56 0 L-56 -26 M56 0 L56 -26 M-50 -26 L-50 -60 M50 -26 L50 -60" stroke="#3a3a4a" stroke-width="5"/><rect x="-66" y="-30" width="132" height="10" rx="3" fill="#c8844a"/><rect x="-66" y="-22" width="132" height="4" fill="#8a5a2a"/><rect x="-62" y="-62" width="124" height="9" rx="3" fill="#c8844a"/><rect x="-62" y="-48" width="124" height="9" rx="3" fill="#c8844a"/></g>`;
  const potPlant = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-12 0 L-14 -26 L14 -26 L12 0Z" fill="#fff"/><path d="M0 0 L14 -26 L12 0Z" fill="#d8d8e4"/><g class="bg-plant">${[-30, -10, 10, 30].map(a => `<path d="M0 -26 Q${f1(Math.sin(a * Math.PI / 180) * 14)} -44 ${f1(Math.sin(a * Math.PI / 180) * 26)} -60" stroke="#4aa058" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
  const dust = (r, n, x0, x1, y0, y1) => { let o = ''; for (let i = 0; i < n; i++) o += `<circle class="w-rise" style="animation-delay:-${f1(r() * 8)}s;animation-duration:${f1(8 + r() * 6)}s" cx="${f1(x0 + r() * (x1 - x0))}" cy="${f1(y0 + r() * (y1 - y0))}" r="${f1(2 + r() * 3)}" fill="#fffbe6" opacity=".7"/>`; return o; };
  const butterflies = (r, n) => Array.from({ length: n }, (_, i) => { const x = f1(100 + r() * 760), y = f1(300 + r() * 120), col = ['#ffd23f', '#ff8ab8', '#8ad0ff', '#fff'][i % 4]; return `<g class="w-wander" style="animation-duration:${f1(6 + r() * 4)}s;animation-delay:-${f1(r() * 4)}s"><g class="anim-flap"><ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${col}" transform="translate(-5 0)"/><ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${col}" transform="translate(5 0)"/></g><path d="M${x} ${f1(+y - 4)} L${x} ${f1(+y + 5)}" stroke="#2b2140" stroke-width="2"/></g>`; }).join('');

  const WIDE = {
    /* Balada: parede azul com neons, pilares rosa com brilho, globo espelhado girando luzes, bar, caixas de som,
       palco redondo iluminado, piso em perspectiva refletindo as luzes e sofá desfocado em primeiro plano */
    club: (c, u) => {
      const r = rng('wclub');
      let s = wdefs(u) + `<defs>${lg(u + 'wall', [[0, '#0a1450'], [.55, '#13207a'], [1, '#1c2a8c']])}${lg(u + 'flr', [[0, '#4a1a8a'], [.4, '#6a1f9a'], [1, '#2a0c5a']])}
        ${lg(u + 'pil', [[0, '#ff4fb8'], [.35, '#ffd0f0'], [.5, '#fff'], [.65, '#ffd0f0'], [1, '#e0309a']], 1, 0)}${lg(u + 'stg', [[0, '#f0a8ff'], [1, '#b060e0']])}
        <radialGradient id="${u}ball" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#e8fbff"/><stop offset=".45" stop-color="#6ad8ff"/><stop offset="1" stop-color="#2a4ab8"/></radialGradient>
        ${lg(u + 'beam', [[0, '#bff4ff', .55], [1, '#bff4ff', 0]])}
        <clipPath id="${u}bc"><circle cx="470" cy="18" r="56"/></clipPath></defs>`;
      /* prolongamentos: teto em cima, piso embaixo */
      s += `<rect x="-60" y="-420" width="1080" height="480" fill="#070c30"/><rect x="-60" y="500" width="1080" height="500" fill="#24084e"/>`;
      /* parede do fundo com painéis */
      s += `<rect x="-60" y="30" width="1080" height="350" fill="url(#${u}wall)"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${i * 86 + 20} 40 L${i * 86 + 20} 360" stroke="#3050c0" stroke-width="2" opacity=".25"/>`).join('');
      /* luzes do globo espalhadas pela parede (piscando) */
      for (let i = 0; i < 34; i++) s += `<ellipse class="tw" style="animation-delay:-${f1(r() * 3)}s;animation-duration:${f1(1.5 + r() * 2)}s" cx="${f1(r() * 960)}" cy="${f1(60 + r() * 280)}" rx="${f1(6 + r() * 12)}" ry="${f1(3 + r() * 4)}" fill="${['#ff7ad8', '#7ae8ff', '#ffb070', '#b88aff'][i % 4]}" opacity=".75" filter="url(#${u}w1)"/>`;
      /* neons diagonais na parede */
      s += `<g filter="url(#${u}wg)" class="pulse">${[[180, 70, 245, 265], [478, 80, 478, 225], [480, 118, 585, 222], [652, 75, 690, 250], [690, 150, 632, 350]].map(([a, b, cc, d]) => `<path d="M${a} ${b} L${cc} ${d}" stroke="#3ae8ff" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`;
      /* teto curvo com faixa de neon */
      s += `<path d="M-60 -20 L1020 -20 L1020 40 Q480 110 -60 40Z" fill="#0b1440"/><path d="M-60 40 Q480 110 1020 40" stroke="#36e0ff" stroke-width="7" fill="none" filter="url(#${u}wg)"/>`;
      /* feixes do globo varrendo (animados) */
      s += `<g opacity=".5">${[-38, -12, 16, 42].map((a, i) => `<g class="bg-sweep" style="animation-delay:-${i * 1.4}s;transform-origin:470px 18px"><path d="M470 18 L${470 + Math.sin(a * Math.PI / 180) * 520 - 40} 560 L${470 + Math.sin(a * Math.PI / 180) * 520 + 40} 560Z" fill="url(#${u}beam)"/></g>`).join('')}</g>`;
      /* globo espelhado */
      s += `<path d="M470 -120 L470 -38" stroke="#8aa0d0" stroke-width="4"/><circle cx="470" cy="18" r="80" fill="#7ae8ff" opacity=".35" filter="url(#${u}w3)" class="bg-glow"/><circle cx="470" cy="18" r="56" fill="url(#${u}ball)"/>`;
      s += `<g clip-path="url(#${u}bc)" class="bg-facets">${Array.from({ length: 9 }, (_, i) => `<path d="M${400 + i * 16} -40 L${400 + i * 16} 80" stroke="#1a3a90" stroke-width="1.6" opacity=".55"/>`).join('')}${Array.from({ length: 8 }, (_, i) => `<path d="M400 ${-30 + i * 14} Q470 ${-24 + i * 14} 540 ${-30 + i * 14}" stroke="#1a3a90" stroke-width="1.6" fill="none" opacity=".55"/>`).join('')}
        ${Array.from({ length: 16 }, () => `<rect x="${f1(420 + r() * 90)}" y="${f1(-30 + r() * 80)}" width="12" height="10" fill="#fff" opacity="${f1(.3 + r() * .6)}"/>`).join('')}</g>`;
      s += `<path d="${star(448, -6, 14, 3, 4)}" fill="#fff" class="anim-tw" filter="url(#${u}wg)"/>`;
      /* pilares: brilho (bloom) atrás + tubo com gradiente */
      const pillar = (x, w, y0, y1) => `<rect x="${x - w * 1.6}" y="${y0}" width="${w * 4.2}" height="${y1 - y0}" fill="#ff5fc8" opacity=".35" filter="url(#${u}w3)"/><rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" rx="3" fill="url(#${u}pil)"/>`;
      s += pillar(306, 26, 60, 362) + pillar(588, 26, 60, 362);
      /* caixas de som */
      const spk = x => `<rect x="${x}" y="288" width="56" height="84" rx="5" fill="#0e2860"/><rect x="${x + 4}" y="292" width="48" height="76" rx="4" fill="#12357a"/><circle cx="${x + 28}" cy="312" r="12" fill="#081a40"/><circle cx="${x + 28}" cy="312" r="5" fill="#2a5ab0"/><circle cx="${x + 28}" cy="346" r="18" fill="#081a40" class="bg-thump"/><circle cx="${x + 28}" cy="346" r="7" fill="#2a5ab0"/><rect x="${x}" y="288" width="56" height="3" fill="#6aa8ff" opacity=".7"/>`;
      s += spk(222) + spk(642);
      /* bar com banquetas e garrafas */
      s += `<rect x="330" y="296" width="262" height="66" rx="4" fill="#123a6a"/><rect x="330" y="296" width="262" height="9" fill="#1e5a9a"/><rect x="330" y="296" width="262" height="2" fill="#7ae8ff"/>` + [360, 420, 480, 540].map(x => `<path d="M${x} 306 L${x} 360" stroke="#0a2448" stroke-width="3"/>`).join('');
      s += [[436, '#ff8fb8'], [446, '#7ae8ff'], [522, '#b8ff9a'], [530, '#ffd070']].map(([x, col]) => `<rect x="${x}" y="276" width="7" height="20" rx="2" fill="${col}" opacity=".85"/><rect x="${x + 2}" y="270" width="3" height="7" fill="${col}"/>`).join('');
      const stool = (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="78" rx="18" ry="4" fill="#000" opacity=".3"/><path d="M0 16 L0 76 M-14 76 L14 76" stroke="#9ab0d0" stroke-width="3"/><rect x="-20" y="4" width="40" height="12" rx="6" fill="#2a4a8a"/><rect x="-14" y="-24" width="28" height="30" rx="9" fill="#34569a"/><rect x="-14" y="-24" width="28" height="4" rx="2" fill="#6a8ad0"/></g>`;
      s += stool(326, 290) + stool(405, 292) + stool(490, 292) + stool(778, 284, 1.1) + `<rect x="790" y="286" width="54" height="6" rx="3" fill="#9ab0d0"/><path d="M817 292 L817 388" stroke="#9ab0d0" stroke-width="3"/>`;
      /* piso em perspectiva */
      s += `<rect x="-60" y="362" width="1080" height="180" fill="url(#${u}flr)"/>`;
      s += Array.from({ length: 17 }, (_, i) => { const x = -400 + i * 110; return `<path d="M${f1(470 + (x - 470) * .22)} 362 L${x} 560" stroke="#ff7ae0" stroke-width="2" opacity=".35"/>`; }).join('') + [378, 404, 444, 500].map(y => `<path d="M-60 ${y} L1020 ${y}" stroke="#ff7ae0" stroke-width="2" opacity=".3"/>`).join('');
      /* reflexos dos pilares e do bar no piso molhado */
      s += `<g filter="url(#${u}w2)" opacity=".45"><rect x="300" y="364" width="38" height="140" fill="#ff7ad8"/><rect x="582" y="364" width="38" height="140" fill="#ff7ad8"/><rect x="330" y="364" width="262" height="30" fill="#3a8ad0"/><rect x="0" y="364" width="50" height="170" fill="#ff7ad8"/><rect x="900" y="364" width="50" height="170" fill="#ff7ad8"/></g>`;
      /* palco redondo: lateral com neon, tampo iluminado, luzes dançando */
      s += `<ellipse cx="472" cy="424" rx="352" ry="54" fill="#1a0a4a"/><path d="M120 402 L120 424 A352 54 0 0 0 824 424 L824 402" fill="#7a2ab0"/><path d="M120 424 A352 54 0 0 0 824 424" stroke="#3ae8ff" stroke-width="5" fill="none" filter="url(#${u}wg)"/>`;
      s += `<ellipse cx="472" cy="402" rx="352" ry="50" fill="url(#${u}stg)"/><ellipse cx="472" cy="396" rx="300" ry="36" fill="#fff" opacity=".18"/>`;
      s += `<g class="bg-spots">${Array.from({ length: 12 }, () => `<ellipse cx="${f1(160 + r() * 620)}" cy="${f1(382 + r() * 40)}" rx="${f1(5 + r() * 9)}" ry="${f1(2 + r() * 3)}" fill="#fff" opacity="${f1(.4 + r() * .5)}"/>`).join('')}</g>`;
      s += `<g class="bg-spots2">${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${f1(r() * 960)}" cy="${f1(440 + r() * 90)}" rx="${f1(10 + r() * 14)}" ry="${f1(4 + r() * 5)}" fill="${['#ff9ae8', '#9ae8ff', '#fff'][i % 3]}" opacity=".55" filter="url(#${u}w1)"/>`).join('')}</g>`;
      /* primeiro plano: pilares da frente e sofá desfocados (profundidade de campo) */
      s += `<g filter="url(#${u}w1)">${pillar(18, 36, -40, 380)}${pillar(906, 36, -40, 380)}</g>`;
      s += `<g filter="url(#${u}w2)"><path d="M-60 336 Q60 330 126 350 L132 470 L-60 480Z" fill="#0e3a66"/><path d="M-60 400 Q60 392 132 404 L134 470 L-60 486Z" fill="#12507e"/><path d="M-60 336 Q60 330 126 350" stroke="#3ae8ff" stroke-width="3" fill="none" opacity=".6"/></g>`;
      return wide(s);
    },

    /* Shopping: abóbada de vidro com céu e nuvens passando, lojas nos dois lados em perspectiva, letreiros,
       piso de porcelanato refletindo, raios de sol entrando, névoa ao fundo e planta desfocada na frente */
    mall: (c, u) => {
      const r = rng('wmall'), VP = [410, 292];
      /* perspectiva: ponto "de perto" p visto na profundidade z */
      const at = (p, z) => [VP[0] + (p[0] - VP[0]) / z, VP[1] + (p[1] - VP[1]) / z];
      const L = -90, R = 1050, SP_ = 70, FL = 720, AP = -260;
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#3a8ae0'], [.6, '#8ad0ff'], [1, '#d8f2ff']])}${lg(u + 'fl', [[0, '#e8e0cc'], [1, '#f6f1e4']])}
        ${lg(u + 'wl', [[0, '#e8c070'], [1, '#f6d690']], 0, 1)}${lg(u + 'ray', [[0, '#fffbe0', .45], [1, '#fffbe0', 0]])}${lg(u + 'hz', [[0, '#fffaf0', 0], [.5, '#fffaf0', .55], [1, '#fffaf0', 0]], 1, 0)}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}sky)"/>`;
      s += [[140, -80, 1.4], [520, -120, 1.8], [800, -40, 1.2], [320, 20, 1], [660, 60, .9]].map(([x, y, sc], i) => `<g class="bg-drift-w${i % 2 ? '2' : ''}"><g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="10" rx="80" ry="20" fill="#dcefff"/><circle cx="-40" cy="0" r="30" fill="#fff"/><circle cx="10" cy="-14" r="40" fill="#fff"/><circle cx="54" cy="2" r="28" fill="#fff"/><ellipse cx="0" cy="8" rx="76" ry="18" fill="#fff"/></g></g>`).join('');
      /* paredes laterais (planos em perspectiva) */
      const zF = 3.9, wall = (x) => quad(at([x, SP_], 1), at([x, SP_], zF), at([x, FL], zF), at([x, FL], 1), `url(#${u}wl)`);
      s += wall(L) + wall(R);
      /* faixas horizontais do revestimento */
      for (const x of [L, R]) for (let k = 0; k < 7; k++) { const y = SP_ + 40 + k * 26; const a = at([x, y], 1), b = at([x, y], zF); s += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#c89a50" stroke-width="2" opacity=".45"/>`; }
      /* janelas do andar de cima e lojas embaixo, em segmentos de profundidade */
      const signs = ['#6a3a2a', '#c8203a', '#1e3a5a', '#e8a018', '#2a6ac8', '#8a2a8a', '#1e3a5a', '#c8203a'];
      const glass = ['#bfe6ff', '#ffc2cc', '#c8f0d0', '#fff0b0', '#e0ccff', '#bfe6ff'];
      const zs = [1, 1.45, 1.95, 2.5, 3.1, zF];
      for (const [x, side] of [[L, -1], [R, 1]]) for (let i = 0; i < zs.length - 1; i++) {
        const z0 = zs[i] + .06, z1 = zs[i + 1] - .06;
        s += quad(at([x, SP_ + 44], z0), at([x, SP_ + 44], z1), at([x, SP_ + 120], z1), at([x, SP_ + 120], z0), '#fff8e8') + quad(at([x, SP_ + 52], z0 + .05), at([x, SP_ + 52], z1 - .05), at([x, SP_ + 112], z1 - .05), at([x, SP_ + 112], z0 + .05), '#9ad8ff');
        s += quad(at([x, SP_ + 170], z0), at([x, SP_ + 170], z1), at([x, SP_ + 222], z1), at([x, SP_ + 222], z0), signs[(i * 2 + (side > 0 ? 1 : 0)) % signs.length]);
        s += quad(at([x, SP_ + 232], z0), at([x, SP_ + 232], z1), at([x, FL - 58], z1), at([x, FL - 58], z0), glass[(i + (side > 0 ? 3 : 0)) % glass.length]) +
          quad(at([x, SP_ + 232], z0), at([x, SP_ + 232], z0 + (z1 - z0) * .3), at([x, FL - 58], z0 + (z1 - z0) * .3), at([x, FL - 58], z0), '#fff', 'opacity=".35"');
        s += `<path d="M${f1(at([x, SP_ + 232], z1)[0])} ${f1(at([x, SP_ + 232], z1)[1])} L${f1(at([x, FL - 58], z1)[0])} ${f1(at([x, FL - 58], z1)[1])}" stroke="#a87a40" stroke-width="${f1(10 / z1)}"/>`;
        /* letras do letreiro (traços claros, encolhendo com a distância) */
        const m = at([x, SP_ + 196], (z0 + z1) / 2); s += `<rect x="${f1(m[0] - 28 / ((z0 + z1) / 2))}" y="${f1(m[1] - 5 / ((z0 + z1) / 2))}" width="${f1(56 / ((z0 + z1) / 2))}" height="${f1(10 / ((z0 + z1) / 2))}" rx="3" fill="#fff" opacity=".8"/>`;
      }
      /* parede do fundo, porta e janela em arco */
      const bw0 = at([L, SP_], zF), bw1 = at([R, FL], zF);
      s += `<rect x="${f1(bw0[0])}" y="${f1(bw0[1])}" width="${f1(bw1[0] - bw0[0])}" height="${f1(bw1[1] - bw0[1])}" fill="#c8985a"/><rect x="${f1(bw0[0] + 12)}" y="${f1(bw0[1] + 36)}" width="${f1(bw1[0] - bw0[0] - 24)}" height="26" fill="#8a5a2a"/>`;
      /* abóbada: arcos (costelas) em profundidade + vidros */
      const arch = z => { const a = at([L, SP_], z), b = at([R, SP_], z), ap = at([(L + R) / 2, AP], z); return `M${f1(a[0])} ${f1(a[1])} A${f1((b[0] - a[0]) / 2)} ${f1(a[1] - ap[1])} 0 0 1 ${f1(b[0])} ${f1(b[1])}`; };
      s += `<path d="${arch(zF)}" stroke="#8a5a2a" stroke-width="7" fill="none"/>`;
      for (let k = 1; k < 8; k++) { const t = k / 8 * Math.PI, p = [(L + R) / 2 - Math.cos(t) * (R - L) / 2, SP_ - Math.sin(t) * (SP_ - AP)]; const a = at(p, 1), b = at(p, zF); s += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#8a5a2a" stroke-width="5" opacity=".9"/>`; }
      for (const z of [1.05, 1.35, 1.75, 2.25, 2.85, 3.4]) s += `<path d="${arch(z)}" stroke="#8a5a2a" stroke-width="${f1(16 / z)}" fill="none"/><path d="${arch(z)}" stroke="#c8905a" stroke-width="${f1(5 / z)}" fill="none" transform="translate(0 ${f1(-5 / z)})"/>`;
      /* raios de sol entrando pela abóbada */
      s += `<g class="bg-rays">${[[220, 60], [420, 80], [640, 60]].map(([x, w]) => `<path d="M${x} -40 L${x + w} -40 L${x + w + 150} 560 L${x + 60} 560Z" fill="url(#${u}ray)"/>`).join('')}</g>`;
      /* piso: porcelanato em perspectiva com reflexos */
      s += quad(at([L, FL], 1), at([R, FL], 1), at([R, FL], zF), at([L, FL], zF), `url(#${u}fl)`);
      for (let k = 0; k <= 12; k++) { const x = L + (R - L) * k / 12, a = at([x, FL], 1), b = at([x, FL], zF); s += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#cbbfa4" stroke-width="2"/>`; }
      for (const z of [1.1, 1.3, 1.55, 1.85, 2.2, 2.65, 3.2]) { const a = at([L, FL], z), b = at([R, FL], z); s += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#cbbfa4" stroke-width="${f1(3 / z)}"/>`; }
      s += `<g opacity=".35" filter="url(#${u}w2)">${[1.3, 2, 2.8].map(z => { const a = at([L, FL - 10], z), b = at([R, FL - 10], z); return `<rect x="${f1(a[0])}" y="${f1(a[1])}" width="${f1(60 / z)}" height="${f1(60 / z)}" fill="#9ad8ff"/><rect x="${f1(b[0] - 60 / z)}" y="${f1(b[1])}" width="${f1(60 / z)}" height="${f1(60 / z)}" fill="#ffc2cc"/>`; }).join('')}</g>`;
      /* névoa de profundidade no fundo do corredor */
      s += `<rect x="${f1(bw0[0] - 120)}" y="${f1(bw0[1] - 40)}" width="${f1(bw1[0] - bw0[0] + 240)}" height="${f1(bw1[1] - bw0[1] + 60)}" fill="url(#${u}hz)" opacity=".8"/>`;
      /* banners pendurados e vasos */
      const banner = (x, y, w, h, col, dots) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/><rect x="${x}" y="${y}" width="${w * .18}" height="${h}" fill="#000" opacity=".15"/>` + dots.map((d, i) => `<circle cx="${x + w / 2}" cy="${y + h * (.2 + i * .2)}" r="${w * .26}" fill="${d}"/>`).join('');
      s += `<path d="M130 -60 L130 60" stroke="#6a4a2a" stroke-width="3"/>` + banner(96, 60, 66, 170, '#d8263a', ['#f0e070', '#f0a050', '#7ac0f0', '#f0d0e0']);
      s += `<path d="M905 -60 L905 70" stroke="#6a4a2a" stroke-width="3"/>` + banner(880, 70, 56, 150, '#d8263a', []) + `<rect x="${f1(at([R, 230], 2.2)[0] - 6)}" y="${f1(at([R, 230], 2.2)[1])}" width="12" height="46" fill="#f0e8d0" transform="skewY(-6)"/>`;
      const pot = (x, y, sc, blur) => `<g transform="translate(${x} ${y}) scale(${sc})"${blur ? ` filter="url(#${u}${blur})"` : ''}><ellipse cx="0" cy="44" rx="30" ry="7" fill="#000" opacity=".15"/><path d="M-22 10 L22 10 L18 44 L-18 44Z" fill="#6aa0c0"/><rect x="-24" y="6" width="48" height="8" rx="3" fill="#8ac0e0"/>` +
        [-60, -35, -12, 12, 35, 60].map(a => `<path d="M0 8 Q${f1(Math.sin(a * Math.PI / 180) * 30)} -30 ${f1(Math.sin(a * Math.PI / 180) * 60)} ${f1(-40 - Math.cos(a * Math.PI / 180) * 30)}" stroke="#4aa060" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('') + `</g>`;
      s += pot(...at([L + 150, FL - 60], 1.9), .7) + pot(...at([R - 150, FL - 60], 1.6), .8) + pot(880, 440, 1.6, 'w2');
      /* chão prolongado para baixo */
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#f6f1e4"/>`;
      return wide(s);
    },

    /* Trilha: céu com nuvens passando, cordilheiras em planos com névoa, pinheiros, campos em camadas,
       trilha de terra serpenteando até o horizonte, pedras, placa de madeira e árvore grande em primeiro plano */
    trail: (c, u) => {
      const r = rng('wtrail');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#3ab8e8'], [.55, '#8ae0f0'], [1, '#e0fbf6']])}${lg(u + 'mt', [[0, '#8ad0e0'], [1, '#bfeaf0']])}${lg(u + 'mt2', [[0, '#5ab0c8'], [1, '#9ad8e0']])}
        ${lg(u + 'path', [[0, '#e8c890'], [1, '#d8a868']])}${lg(u + 'g1', [[0, '#8ad860'], [1, '#6ac048']])}${lg(u + 'g2', [[0, '#6ac848'], [1, '#48a838']])}${lg(u + 'hz', [[0, '#e8fbff', 0], [.5, '#e8fbff', .6], [1, '#e8fbff', 0]])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}sky)"/>`;
      s += [[500, 40, 1.4], [760, 120, .8], [180, 70, 1], [880, 30, .7]].map(([x, y, sc], i) => `<g class="bg-drift-w${i % 2 ? '2' : ''}"><g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="8" rx="110" ry="14" fill="#fff" opacity=".9"/><ellipse cx="-30" cy="-4" rx="50" ry="18" fill="#fff"/><ellipse cx="30" cy="-10" rx="44" ry="20" fill="#fff"/><ellipse cx="0" cy="12" rx="100" ry="6" fill="#d0eef6"/></g></g>`).join('');
      /* montanhas distantes (claras, com névoa) e próximas (face de sombra e face iluminada) */
      const mount = (pts, fill, light, dark) => { let d = `M${pts[0][0]} 330`; pts.forEach(([x, y]) => d += ` L${x} ${y}`); d += ` L${pts[pts.length - 1][0]} 330Z`;
        let faces = ''; for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] < pts[i - 1][1] && pts[i][1] < pts[i + 1][1]) { const [x, y] = pts[i]; faces += `<path d="M${x} ${y} L${x + (pts[i + 1][0] - x) * .9} ${y + (pts[i + 1][1] - y) * .9} L${x + 40} 330 L${x - 10} 330Z" fill="${dark}" opacity=".55"/><path d="M${x} ${y} L${x - 30} ${y + 60} L${x - 8} ${y + 44} L${x + 6} ${y + 70} Z" fill="${light}" opacity=".7"/>`; }
        return `<path d="${d}" fill="${fill}"/>${faces}`; };
      s += `<g opacity=".8">${mount([[-60, 140], [60, 70], [180, 150], [300, 90], [420, 170], [560, 130], [700, 190], [820, 150], [1020, 200]], `url(#${u}mt)`, '#f4ffff', '#7ab8c8')}</g>`;
      s += mount([[-60, 200], [60, 26], [190, 130], [260, 62], [390, 190], [470, 134], [560, 210], [720, 156], [800, 176], [1020, 230]], `url(#${u}mt2)`, '#e8ffff', '#3a90a8');
      s += `<rect x="-60" y="170" width="1080" height="90" fill="url(#${u}hz)"/>`;
      /* pinheiros no meio (azulados pela distância) e árvores redondas à esquerda */
      const pine = (x, y, h, col, dk) => `<path d="M${x} ${y - h} L${x - h * .28} ${y - h * .45} L${x - h * .16} ${y - h * .47} L${x - h * .36} ${y} L${x + h * .36} ${y} L${x + h * .16} ${y - h * .47} L${x + h * .28} ${y - h * .45}Z" fill="${col}"/><path d="M${x} ${y - h} L${x + h * .28} ${y - h * .45} L${x + h * .16} ${y - h * .47} L${x + h * .36} ${y} L${x} ${y}Z" fill="${dk}" opacity=".5"/>`;
      let pines = ''; [[330, 250, 90], [360, 244, 110], [392, 250, 96], [420, 246, 120], [452, 252, 104], [484, 248, 128], [512, 252, 92], [680, 252, 90], [712, 250, 110], [744, 254, 86]].forEach(([x, y, h]) => pines += pine(x, y, h, '#2a9a70', '#1a6a50'));
      s += `<g filter="url(#${u}w1)" opacity=".95">${pines}</g>`;
      const bush = (x, y, rr, col, hi) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${col}"/><circle cx="${x - rr * .5}" cy="${y + rr * .2}" r="${rr * .75}" fill="${col}"/><circle cx="${x + rr * .55}" cy="${y + rr * .25}" r="${rr * .7}" fill="${col}"/><circle cx="${x - rr * .25}" cy="${y - rr * .35}" r="${rr * .45}" fill="${hi}" opacity=".6"/>`;
      s += bush(40, 150, 40, '#3aa848', '#8ae070') + bush(200, 150, 52, '#3aa848', '#8ae070') + bush(280, 176, 36, '#48b050', '#9ae880') + bush(790, 190, 40, '#3aa848', '#8ae070') + `<path d="M246 230 Q252 196 236 176" stroke="#7a5030" stroke-width="7" fill="none"/>`;
      /* campos em camadas (claro atrás, escuro na frente) */
      s += `<path d="M-60 250 Q200 226 470 240 Q720 230 1020 246 L1020 560 L-60 560Z" fill="url(#${u}g1)"/>`;
      s += `<path d="M-60 300 Q150 280 330 296 Q420 260 600 272 Q800 262 1020 290 L1020 560 L-60 560Z" fill="#78cc50" opacity=".9"/><path d="M600 272 Q800 262 1020 290" stroke="#b8f080" stroke-width="4" fill="none" opacity=".7"/>`;
      s += `<path d="M560 330 Q760 300 1020 318 L1020 560 L500 560Z" fill="url(#${u}g2)"/><path d="M560 330 Q760 300 1020 318" stroke="#9ae070" stroke-width="4" fill="none" opacity=".6"/>`;
      /* trilha de terra: larga embaixo, fina no horizonte, com borda escura e centro mais claro */
      const trail = 'M436 248 Q470 250 474 256 Q452 266 470 276 Q560 288 574 300 Q520 322 500 336 Q430 350 330 358 Q250 366 246 384 Q300 402 520 408 Q700 414 760 450 Q800 490 840 560 L60 560 Q120 500 250 470 Q380 446 360 426 Q180 418 190 380 Q200 344 360 330 Q450 320 470 308 Q430 292 420 276 Q410 262 436 248Z';
      s += `<path d="${trail}" fill="#b88a50" transform="translate(0 6)"/><path d="${trail}" fill="url(#${u}path)"/>`;
      s += `<path d="M458 254 Q446 266 462 280 Q540 298 520 318 Q440 340 330 346 Q226 356 232 382 Q280 398 500 404" stroke="#f6e0b0" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>`;
      s += `<path d="M300 486 Q420 470 460 440 M600 500 Q700 480 720 460" stroke="#c89a60" stroke-width="5" fill="none" opacity=".5"/>`;
      /* pedras com luz e sombra */
      const rock = (x, y, w, h) => `<ellipse cx="${x}" cy="${y + h * .45}" rx="${w * .6}" ry="${h * .25}" fill="#3a7a30" opacity=".35"/><path d="M${x - w / 2} ${y + h * .4} Q${x - w * .45} ${y - h * .4} ${x - w * .1} ${y - h * .5} Q${x + w * .4} ${y - h * .45} ${x + w / 2} ${y + h * .4}Z" fill="#8a94a0"/><path d="M${x - w * .1} ${y - h * .5} Q${x + w * .4} ${y - h * .45} ${x + w / 2} ${y + h * .4} L${x + w * .1} ${y + h * .4}Z" fill="#5a6470"/><path d="M${x - w * .38} ${y} Q${x - w * .3} ${y - h * .35} ${x - w * .05} ${y - h * .42}" stroke="#c8d0d8" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      s += rock(420, 298, 40, 20) + rock(345, 326, 30, 14) + rock(376, 326, 42, 20) + rock(440, 328, 24, 12) + rock(630, 318, 90, 38) + rock(210, 318, 40, 18) + rock(60, 360, 50, 26) + rock(30, 450, 44, 22);
      /* tufos de grama e samambaias balançando */
      const tuft = (x, y, sc, col) => `<g class="bg-plant" style="animation-delay:-${f1(r() * 3)}s"><g transform="translate(${x} ${y}) scale(${sc})">${[-40, -20, 0, 20, 40].map(a => `<path d="M0 0 Q${f1(Math.sin(a * Math.PI / 180) * 16)} -18 ${f1(Math.sin(a * Math.PI / 180) * 30)} ${f1(-26 - Math.cos(a * Math.PI / 180) * 10)}" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
      s += tuft(200, 320, 1, '#3a9a30') + tuft(130, 372, 1.2, '#3a9a30') + tuft(660, 336, 1, '#3a8a30') + tuft(40, 380, 1.6, '#2a8a28') + tuft(900, 360, 1.4, '#2a8a28') + tuft(560, 520, 1.3, '#48a838');
      const fern = (x, y, sc) => `<g class="bg-plant"><g transform="translate(${x} ${y}) scale(${sc})">${[-70, -40, -10, 20, 50].map(a => `<path d="M0 0 Q${f1(Math.sin(a * Math.PI / 180) * 30)} -30 ${f1(Math.sin(a * Math.PI / 180) * 60)} ${f1(-20 - Math.cos(a * Math.PI / 180) * 40)}" stroke="#1e7a30" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M0 0 Q${f1(Math.sin(a * Math.PI / 180) * 30)} -30 ${f1(Math.sin(a * Math.PI / 180) * 60)} ${f1(-20 - Math.cos(a * Math.PI / 180) * 40)}" stroke="#4ab848" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
      s += fern(40, 372, 1) + fern(930, 346, 1.1);
      /* placa de madeira */
      s += `<ellipse cx="130" cy="340" rx="80" ry="12" fill="#2a6a20" opacity=".3"/><rect x="42" y="240" width="22" height="100" fill="#6a4020"/><rect x="200" y="226" width="22" height="92" fill="#6a4020"/><rect x="54" y="240" width="10" height="100" fill="#4a2a10" opacity=".6"/>`;
      s += `<path d="M-60 126 L246 150 L240 272 L-60 262Z" fill="#9a7058"/><path d="M-60 126 L246 150 L244 162 L-60 140Z" fill="#c09078"/><path d="M-60 176 L243 190 M-60 220 L241 232" stroke="#6a4838" stroke-width="3"/><path d="M-20 160 Q60 166 140 162 M20 202 Q100 210 200 206 M-10 246 Q80 250 180 252" stroke="#7a5848" stroke-width="2" fill="none" opacity=".6"/><path d="M240 150 L246 150 L240 272 L234 272Z" fill="#5a3828"/>`;
      /* árvore grande em primeiro plano: tronco com vincos, raízes e copa cortada no alto */
      s += `<path d="M812 330 Q846 300 850 250 Q856 150 836 60 L930 40 Q920 150 930 240 Q940 300 990 330 Q1020 340 1020 350 L760 340 Q790 336 812 330Z" fill="#7a4a28"/>`;
      s += `<path d="M900 50 Q896 150 906 250 Q916 310 980 334 L1020 340 L1020 40Z" fill="#4a2a14" opacity=".55"/><path d="M852 90 Q862 170 858 260 M880 120 Q884 200 876 290 M846 200 Q840 240 830 280" stroke="#4a2a14" stroke-width="4" fill="none" opacity=".6"/>`;
      s += `<path d="M760 340 Q780 322 820 318 Q800 300 770 306 M990 336 Q1010 320 1020 322 M832 330 Q850 300 890 296" stroke="#7a4a28" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M836 70 Q760 50 700 70 Q740 40 800 34" stroke="#7a4a28" stroke-width="18" fill="none" stroke-linecap="round"/>`;
      s += `<g>${[[700, -20, 70], [780, -60, 90], [880, -70, 100], [980, -40, 90], [620, -40, 50], [940, 30, 60], [800, 10, 60]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#2a7a3a"/><circle cx="${x - rr * .3}" cy="${y - rr * .3}" r="${rr * .55}" fill="#3a9a48" opacity=".7"/>`).join('')}</g>`;
      /* folhas caindo e passarinhos */
      for (let i = 0; i < 10; i++) s += `<g class="bg-leaf" style="animation-duration:${f1(7 + r() * 5)}s;animation-delay:-${f1(r() * 10)}s"><ellipse cx="${f1(560 + r() * 400)}" cy="0" rx="7" ry="4" fill="${i % 2 ? '#4ab040' : '#8ad050'}" transform="rotate(${f1(r() * 180)} 700 0)"/></g>`;
      s += [[300, 60], [330, 48], [620, 90]].map(([x, y], i) => `<path class="anim-bob" style="animation-delay:-${i * .6}s" d="M${x - 10} ${y} q5 -7 10 0 q5 -7 10 0" stroke="#2a4a6a" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
      /* primeiro plano embaixo: grama escura desfocada */
      s += `<g filter="url(#${u}w2)"><path d="M-60 520 Q60 490 180 512 Q260 530 300 560 L-60 560Z" fill="#2a7a28"/><path d="M1020 500 Q900 490 820 520 Q780 540 770 560 L1020 560Z" fill="#2a7a28"/></g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#48a838"/>`;
      return wide(s);
    },

    /* Sala de estar: parede laranja com sombras projetadas, janelão com luz entrando, cortinas, estante de vidro,
       sofá, cômoda, prateleira com livros e quadros, vasos, piso de tábuas em perspectiva e tapete oval */
    living: (c, u) => {
      const r = rng('wliv');
      let s = wdefs(u) + `<defs>${lg(u + 'wal', [[0, '#e0762e'], [1, '#ec8a40']])}${lg(u + 'fl', [[0, '#e8dcc0'], [1, '#f4ecd8']])}${lg(u + 'sky', [[0, '#5ab8ea'], [1, '#bfe8fb']])}
        ${lg(u + 'cur', [[0, '#6a0a3a'], [.3, '#9a1a50'], [.55, '#7a0e40'], [.8, '#a01e56'], [1, '#6a0a3a']], 1, 0)}${lg(u + 'sofa', [[0, '#f0e8d0'], [1, '#d8ceb0']])}${lg(u + 'wood', [[0, '#b0302a'], [1, '#8a1e1e']])}
        ${lg(u + 'sun', [[0, '#fff6d0', .5], [1, '#fff6d0', 0]])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="780" fill="url(#${u}wal)"/><rect x="-60" y="-420" width="1080" height="420" fill="#c8641e" opacity=".35"/>`;
      /* janelão com céu, nuvem e faixas de reflexo */
      s += `<rect x="296" y="-40" width="316" height="260" fill="url(#${u}sky)"/><g class="bg-drift-w"><g transform="translate(400 120)"><ellipse cx="0" cy="0" rx="60" ry="16" fill="#fff"/><circle cx="-18" cy="-10" r="18" fill="#fff"/><circle cx="12" cy="-16" r="22" fill="#fff"/></g></g>`;
      s += `<g opacity=".5" fill="#fff">${[[330, 60], [420, 90], [500, 40]].map(([x, w]) => `<path d="M${x} 220 L${x + w} 220 L${x + w + 170} -40 L${x + 170} -40Z"/>`).join('')}</g>`;
      s += `<path d="M383 -40 L383 220 M530 -40 L530 220" stroke="#e8a060" stroke-width="12"/><rect x="292" y="-40" width="324" height="264" fill="none" stroke="#e8a060" stroke-width="10"/>`;
      /* cortinas com dobras, balançando de leve */
      const cur = (x, m) => `<g class="bg-curtain" style="transform-origin:${x + 30}px -40px"><path d="M${x} -40 L${x + 64} -40 Q${x + 60 + 6 * m} 120 ${x + 66} 236 L${x - 2} 236 Q${x + 4} 120 ${x} -40Z" fill="url(#${u}cur)"/><path d="M${x + 20} -30 Q${x + 18} 110 ${x + 22} 232 M${x + 44} -30 Q${x + 42} 110 ${x + 46} 232" stroke="#4a0426" stroke-width="3" fill="none" opacity=".5"/></g>`;
      s += cur(246, -1) + cur(598, 1);
      /* sombras projetadas na parede (luz vindo do alto) */
      s += `<path d="M20 52 L-20 52 L-20 380 L20 380Z" fill="#a8501a" opacity=".45"/><path d="M216 52 L250 90 L250 380 L216 380Z" fill="#a8501a" opacity=".4"/><path d="M676 236 L660 250 L660 360 L676 360Z" fill="#a8501a" opacity=".4"/><path d="M700 96 L884 96 L900 150 L716 150Z" fill="#a8501a" opacity=".35"/>`;
      /* rodapé */
      s += `<rect x="-60" y="352" width="1080" height="20" fill="#f4ead0"/><rect x="-60" y="370" width="1080" height="4" fill="#c8a870"/>`;
      /* estante de vidro com livros */
      s += `<rect x="20" y="52" width="200" height="330" fill="url(#${u}wood)"/><rect x="16" y="46" width="208" height="14" fill="#a0281f"/><rect x="36" y="80" width="170" height="220" fill="#2a4a78"/>` +
        [150, 204, 258].map(y => `<rect x="36" y="${y}" width="170" height="5" fill="#6a8ab8"/>`).join('') + `<path d="M120 80 L120 300" stroke="#8a1e1e" stroke-width="6"/>`;
      s += [[136, 112, ['#e8e8e8', '#2a6a4a', '#e8e8e8', '#2a6a4a', '#e8e8e8']], [134, 162, ['#8a1e1e', '#c8a040', '#8a1e1e', '#c8a040', '#8a1e1e', '#c8a040', '#8a1e1e', '#c8a040']], [42, 214, ['#2a6a4a', '#e8d070', '#2a6a4a', '#e8d070', '#2a6a4a', '#e8d070', '#2a6a4a']], [136, 262, ['#2a6a4a', '#1e3a6a', '#4a8ac8', '#1e3a6a']]].map(([x, y, cols]) => cols.map((col, i) => `<rect x="${x + i * 7}" y="${y + (i % 3) * 3}" width="6" height="${38 - (i % 3) * 3}" fill="${col}"/>`).join('')).join('');
      s += `<g opacity=".35" fill="#fff"><path d="M40 90 L70 80 L200 250 L170 260Z"/><path d="M130 80 L150 80 L206 170 L206 200Z"/></g><rect x="36" y="80" width="170" height="220" fill="none" stroke="#a0281f" stroke-width="6"/><circle cx="112" cy="190" r="3" fill="#f0d070"/><circle cx="128" cy="190" r="3" fill="#f0d070"/>`;
      s += [40, 124].map(x => `<rect x="${x}" y="312" width="78" height="52" rx="3" fill="#b0302a" stroke="#7a1616" stroke-width="3"/><circle cx="${x + 39}" cy="324" r="3" fill="#f0d070"/>`).join('') + `<rect x="16" y="370" width="208" height="14" fill="#a0281f"/>`;
      /* cômoda, prateleira, quadros */
      s += `<rect x="678" y="232" width="138" height="12" fill="#a0281f"/><rect x="686" y="244" width="122" height="148" fill="url(#${u}wood)"/>` + [252, 298, 344].map(y => `<rect x="696" y="${y}" width="102" height="38" rx="3" fill="#b8342c" stroke="#7a1616" stroke-width="3"/><circle cx="747" cy="${y + 19}" r="4" fill="#f0e0b0"/>`).join('') + `<rect x="690" y="392" width="10" height="8" fill="#5a1010"/><rect x="794" y="392" width="10" height="8" fill="#5a1010"/>`;
      s += `<rect x="700" y="92" width="184" height="9" fill="#a0281f"/><path d="M716 101 L724 130 L732 101 M852 101 L860 130 L868 101" fill="#7a1616"/>` + Array.from({ length: 11 }, (_, i) => `<rect x="${708 + i * 7}" y="${48 + (i % 2) * 2}" width="6" height="${44 - (i % 2) * 2}" fill="${i % 3 ? '#8a1e1e' : '#c8a040'}"/>`).join('');
      s += `<rect x="752" y="118" width="80" height="86" fill="#7a3a22"/><rect x="762" y="128" width="60" height="66" fill="#fff6e8"/><rect x="694" y="152" width="48" height="66" fill="#7a3a22"/><rect x="702" y="160" width="32" height="50" fill="#fff6e8"/>`;
      const plant = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-18 0 L18 0 L14 48 L-14 48Z" fill="#e8a868"/><path d="M-4 0 L18 0 L14 48 L0 48Z" fill="#c8804a"/><g class="bg-plant">${[-50, -28, -8, 12, 32, 52].map(a => { const sn = Math.sin(a * Math.PI / 180), cs = Math.cos(a * Math.PI / 180), d = `M0 2 Q${f1(sn * 20)} -30 ${f1(sn * 44)} ${f1(-50 - cs * 20)}`; return `<path d="${d}" stroke="#3a9a48" stroke-width="10" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#7ad070" stroke-width="3" fill="none" stroke-linecap="round"/>`; }).join('')}</g></g>`;
      s += plant(838, 50, .7) + plant(870, 322, 1.3);
      /* piso de tábuas em perspectiva + sol entrando pela janela */
      s += `<rect x="-60" y="374" width="1080" height="180" fill="url(#${u}fl)"/>` + [388, 408, 436, 474, 522].map(y => `<path d="M-60 ${y} L1020 ${y}" stroke="#c8b890" stroke-width="3"/>`).join('');
      s += [[388, 408, 90], [408, 436, 150], [436, 474, 110], [474, 522, 180], [522, 560, 130]].map(([y0, y1, st], k) => Array.from({ length: 9 }, (_, i) => { const x = (i * st + k * 47) % 1080 - 60; return `<path d="M${x} ${y0} L${f1(x + (y1 - y0) * .1)} ${y1}" stroke="#c8b890" stroke-width="3"/>`; }).join('')).join('');
      s += `<path d="M296 224 L612 224 L720 470 L200 470Z" fill="url(#${u}sun)"/>`;
      /* sofá com volume: encosto, assento, braços, sombra no chão */
      s += `<path d="M250 398 L720 398 L760 430 L220 430Z" fill="#b8a88a" opacity=".45"/>`;
      s += `<rect x="296" y="222" width="316" height="80" rx="26" fill="url(#${u}sofa)"/><rect x="316" y="230" width="278" height="44" rx="18" fill="#d8ceb0" opacity=".7"/>`;
      s += `<rect x="300" y="284" width="312" height="72" rx="14" fill="#f4ecd4"/><rect x="300" y="336" width="312" height="22" fill="#d0c6a8"/><path d="M456 290 L456 336" stroke="#c8bea0" stroke-width="3"/>`;
      s += [252, 620].map(x => `<rect x="${x}" y="238" width="44" height="158" rx="18" fill="url(#${u}sofa)"/><rect x="${x}" y="238" width="44" height="22" rx="11" fill="#fff8e8"/>`).join('') + `<rect x="296" y="356" width="316" height="40" fill="#c8bea0"/><rect x="268" y="394" width="10" height="8" fill="#6a5a40"/><rect x="632" y="394" width="10" height="8" fill="#6a5a40"/>`;
      /* tapete oval em perspectiva com sombra */
      s += `<ellipse cx="456" cy="486" rx="320" ry="44" fill="#8a1e30" opacity=".35"/><ellipse cx="450" cy="480" rx="320" ry="44" fill="#c02a44"/><ellipse cx="450" cy="480" rx="250" ry="32" fill="#a01e38"/><ellipse cx="450" cy="480" rx="180" ry="22" fill="#c02a44"/>`;
      let dust = ''; for (let i = 0; i < 14; i++) dust += `<circle class="w-rise" style="animation-delay:-${f1(r() * 8)}s;animation-duration:${f1(8 + r() * 6)}s" cx="${f1(300 + r() * 400)}" cy="${f1(200 + r() * 260)}" r="${f1(2 + r() * 3)}" fill="#fffbe6" opacity=".7"/>`;
      s += dust + `<rect x="-60" y="540" width="1080" height="460" fill="#f4ecd8"/>`;
      return wide(s);
    },

    /* Quarto: parede listrada, janelão panorâmico com a cidade lá fora (desfocada), cama com cabeceira capitonê,
       criados-mudos, luminária, planta, piso de madeira em perspectiva e luz da janela no chão */
    bedroom: (c, u) => {
      const r = rng('wbed');
      let s = wdefs(u) + `<defs>${lg(u + 'wl', [[0, '#f2f2f6'], [1, '#e2e2ea']])}${lg(u + 'fl', [[0, '#e6c49a'], [1, '#f2d8b4']])}${lg(u + 'sky', [[0, '#7ad0f0'], [1, '#d8f4ff']])}${lg(u + 'duv', [[0, '#9a948a'], [1, '#7a746a']])}${lg(u + 'sun', [[0, '#fffbe6', .55], [1, '#fffbe6', 0]])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="800" fill="url(#${u}wl)"/>` + Array.from({ length: 30 }, (_, i) => `<rect x="${-60 + i * 36}" y="-420" width="14" height="800" fill="#d8d8e4" opacity=".45"/>`).join('');
      /* janelão com vista */
      s += `<rect x="60" y="-40" width="840" height="150" fill="url(#${u}sky)"/><g filter="url(#${u}w1)" opacity=".75">${(() => { let o = '', x = 60; while (x < 900) { const w = 20 + r() * 40, h = 30 + r() * 80; o += `<rect x="${f1(x)}" y="${f1(110 - h)}" width="${f1(w)}" height="${f1(h)}" fill="${['#b8d0e0', '#a8c4d8', '#c8dce8'][Math.floor(r() * 3)]}"/>`; x += w + 4; } return o; })()}</g>`;
      s += `<g filter="url(#${u}w1)">${[140, 330, 620, 820].map(x => `<rect x="${x - 3}" y="70" width="6" height="40" fill="#6a5040"/><circle cx="${x}" cy="62" r="24" fill="#5aa84a"/><circle cx="${x - 10}" cy="56" r="12" fill="#8ad070"/>`).join('')}</g>`;
      s += cloudW(300, 10, .7) + cloudW(700, 30, .5, 'bg-drift-w2');
      s += `<g opacity=".4" fill="#fff">${[180, 420, 700].map(x => `<path d="M${x} 110 L${x + 50} 110 L${x + 110} -40 L${x + 60} -40Z"/>`).join('')}</g>`;
      s += `<rect x="60" y="-40" width="840" height="150" fill="none" stroke="#fff" stroke-width="12"/>` + [270, 480, 690].map(x => `<rect x="${x - 5}" y="-40" width="10" height="150" fill="#fff"/>`).join('') + `<rect x="50" y="108" width="860" height="12" rx="4" fill="#fff"/><rect x="50" y="118" width="860" height="4" fill="#c8c8d4"/>`;
      /* quadros */
      s += `<rect x="10" y="140" width="56" height="56" fill="#fff" stroke="#6a6a7a" stroke-width="3"/><rect x="18" y="148" width="40" height="40" fill="#f2c8d0"/><rect x="894" y="140" width="56" height="56" fill="#fff" stroke="#6a6a7a" stroke-width="3"/><rect x="902" y="148" width="40" height="40" fill="#c8e0f2"/>`;
      /* rodapé e piso */
      s += `<rect x="-60" y="368" width="1080" height="12" fill="#fff"/><rect x="-60" y="378" width="1080" height="4" fill="#c8b090"/>`;
      s += `<rect x="-60" y="380" width="1080" height="180" fill="url(#${u}fl)"/>` + Array.from({ length: 21 }, (_, i) => { const x = -540 + i * 100; return `<path d="M${f1(480 + (x - 480) * .35)} 380 L${x} 560" stroke="#c8a478" stroke-width="2.4"/>`; }).join('') + [398, 424, 462, 512].map(y => `<path d="M-60 ${y} L1020 ${y}" stroke="#c8a478" stroke-width="1.6" opacity=".6"/>`).join('');
      s += `<path d="M180 382 L780 382 L900 540 L60 540Z" fill="url(#${u}sun)"/>`;
      /* criados-mudos, luminária, relógio, planta */
      const stand = x => `<ellipse cx="${x + 45}" cy="382" rx="56" ry="8" fill="#000" opacity=".12"/><rect x="${x}" y="286" width="90" height="94" rx="4" fill="#fff"/><rect x="${x}" y="286" width="90" height="8" fill="#e8e8f0"/><rect x="${x + 8}" y="300" width="74" height="30" rx="3" fill="#f4f4f8" stroke="#c8c8d4" stroke-width="2"/><rect x="${x + 8}" y="338" width="74" height="30" rx="3" fill="#f4f4f8" stroke="#c8c8d4" stroke-width="2"/><circle cx="${x + 45}" cy="315" r="3" fill="#8a8a9a"/><circle cx="${x + 45}" cy="353" r="3" fill="#8a8a9a"/><rect x="${x + 70}" y="286" width="20" height="94" fill="#c8c8d4" opacity=".5"/>`;
      s += stand(40) + stand(830);
      s += `<path d="M62 286 L62 250 M50 250 L74 250 L68 226 L56 226Z" stroke="#8a8a9a" stroke-width="3" fill="#ffe6a0"/><ellipse cx="62" cy="238" rx="30" ry="22" fill="#fff6c0" opacity=".45" filter="url(#${u}w2)" class="bg-glow"/>`;
      s += `<circle cx="850" cy="272" r="13" fill="#ff8aa0"/><circle cx="850" cy="272" r="9" fill="#fff"/><path d="M850 266 L850 272 L854 274" stroke="#2b2140" stroke-width="1.6" fill="none"/>` + potPlant(890, 286, .9);
      /* cama: cabeceira capitonê, colchão, edredom com dobras, travesseiros */
      s += `<ellipse cx="480" cy="408" rx="330" ry="22" fill="#000" opacity=".14" filter="url(#${u}w1)"/>`;
      s += `<rect x="200" y="176" width="560" height="140" rx="16" fill="#e8b890"/><rect x="214" y="188" width="532" height="120" rx="10" fill="#f0c8a0"/>` + Array.from({ length: 5 }, (_, j) => Array.from({ length: 9 }, (_, i) => `<circle cx="${250 + i * 58 + (j % 2) * 29}" cy="${204 + j * 22}" r="3" fill="#c8906a"/>`).join('')).join('');
      s += `<rect x="176" y="296" width="608" height="96" rx="12" fill="#f2d4b4"/><rect x="176" y="360" width="608" height="32" rx="8" fill="#e0b890"/>`;
      s += `<path d="M190 280 Q480 262 770 280 L776 362 Q480 376 184 362Z" fill="url(#${u}duv)"/><path d="M190 280 Q480 262 770 280" stroke="#b8b2a8" stroke-width="4" fill="none"/><path d="M300 290 Q320 330 300 360 M520 286 Q540 330 520 368 M680 290 Q690 330 670 362" stroke="#5a544a" stroke-width="3" fill="none" opacity=".35"/>`;
      s += [340, 620].map(x => `<path d="M${x - 70} 250 Q${x} 226 ${x + 70} 250 Q${x + 76} 282 ${x + 64} 290 Q${x} 300 ${x - 64} 290 Q${x - 76} 282 ${x - 70} 250Z" fill="#f4f4f8"/><path d="M${x - 64} 290 Q${x} 300 ${x + 64} 290 Q${x} 284 ${x - 64} 290Z" fill="#c8c8d4"/><path d="M${x - 30} 258 L${x} 274 L${x + 30} 258" stroke="#c8c8d4" stroke-width="3" fill="none"/>`).join('');
      /* tapete e poeira no raio de luz */
      s += `<ellipse cx="480" cy="480" rx="300" ry="36" fill="#e8b8c8"/><ellipse cx="480" cy="476" rx="300" ry="34" fill="#f4ccd8"/><ellipse cx="480" cy="476" rx="250" ry="24" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/>`;
      s += dust(r, 14, 200, 780, 140, 460) + `<rect x="-60" y="540" width="1080" height="460" fill="#f2d8b4"/>`;
      return wide(s);
    },

    /* Parque: céu, sol, nuvens, fileira de árvores ao fundo desfocada, árvores redondas e cônicas, chafariz
       com água caindo, bancos, canteiros floridos, caminho de pedra e grama em primeiro plano */
    park: (c, u) => {
      const r = rng('wpark');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#5ac0f0'], [1, '#d8f4ff']])}${lg(u + 'wt', [[0, '#bff0ff'], [1, '#5ac8f0']])}${lg(u + 'pv', [[0, '#d8ccb8'], [1, '#c8b8a0']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}sky)"/>` + sunW(u, 90, 20, 70);
      s += cloudW(300, 40, 1) + cloudW(620, 10, .8, 'bg-drift-w2') + cloudW(880, 70, .7);
      s += `<g filter="url(#${u}w1)" opacity=".85">${Array.from({ length: 16 }, (_, i) => `<circle cx="${-40 + i * 66}" cy="${230 + (i % 3) * 8}" r="${46 + (i % 4) * 6}" fill="#6aa870"/>`).join('')}<rect x="-60" y="236" width="1080" height="40" fill="#6aa870"/></g>`;
      s += treeR(80, 290, 1.1, '#58b848', '#8ae070') + treeR(880, 290, 1.2, '#58b848', '#8ae070') + pineW(250, 290, 150, '#3a9a4a', '#2a7a3a') + pineW(710, 290, 160, '#3a9a4a', '#2a7a3a') + treeR(170, 300, .8, '#4aa848', '#7ad060') + treeR(800, 300, .85, '#4aa848', '#7ad060');
      /* chafariz com água animada */
      s += `<ellipse cx="480" cy="326" rx="150" ry="22" fill="#b8b0a0"/><path d="M330 318 L330 334 A150 22 0 0 0 630 334 L630 318" fill="#d8d0c0"/><ellipse cx="480" cy="318" rx="150" ry="22" fill="#e8e2d4"/><ellipse cx="480" cy="318" rx="132" ry="16" fill="url(#${u}wt)"/>`;
      s += `<path d="M462 316 L466 250 L494 250 L498 316Z" fill="#e8e2d4"/><ellipse cx="480" cy="250" rx="62" ry="10" fill="#d8d0c0"/><ellipse cx="480" cy="246" rx="62" ry="10" fill="#f0eadc"/><ellipse cx="480" cy="246" rx="50" ry="6" fill="url(#${u}wt)"/>`;
      s += `<path d="M472 246 L474 200 L486 200 L488 246Z" fill="#f0eadc"/><ellipse cx="480" cy="200" rx="30" ry="6" fill="#f0eadc"/>`;
      s += `<g class="bg-water">${[-1, 1].map(m => `<path d="M480 186 Q${480 + m * 40} 170 ${480 + m * 56} 244" stroke="#8ae0ff" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="10 8"/><path d="M480 240 Q${480 + m * 80} 226 ${480 + m * 110} 316" stroke="#8ae0ff" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="10 8"/>`).join('')}<path d="M480 200 L480 160" stroke="#bff4ff" stroke-width="6" stroke-linecap="round" stroke-dasharray="8 6"/></g>`;
      s += `<g class="tw">${[[420, 312], [540, 314], [470, 246], [500, 318]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="2.4" fill="#fff" opacity=".8"/>`).join('')}</g>`;
      /* canteiros, bancos */
      const bed = (x0, x1, y) => `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y - 30} ${x1} ${y} Z" fill="#3a8a3a"/>` + Array.from({ length: Math.floor((x1 - x0) / 22) }, (_, i) => flowerW(x0 + 12 + i * 22 + r() * 6, y - 8 - r() * 14, ['#ff5a8a', '#ffd23f', '#b98cff', '#fff', '#ff8a3a'][i % 5])).join('');
      s += bed(290, 360, 336) + bed(600, 670, 336) + bed(-20, 90, 344) + bed(870, 990, 344);
      s += benchW(180, 330, 1) + benchW(760, 330, 1);
      s += `<rect x="150" y="320" width="12" height="30" fill="#6a7a8a"/><path d="M130 320 L172 320" stroke="#6a7a8a" stroke-width="3"/>`;
      /* caminho de pedra em perspectiva e grama */
      s += `<rect x="-60" y="340" width="1080" height="220" fill="#6ac048"/><path d="M-60 352 L1020 352 L1020 440 L-60 440Z" fill="url(#${u}pv)"/><path d="M-60 352 L1020 352" stroke="#e8e0d0" stroke-width="3"/>` + Array.from({ length: 26 }, (_, i) => `<path d="M${-40 + i * 42} 352 L${-80 + i * 46} 440" stroke="#b8a890" stroke-width="2"/>`).join('') + `<path d="M-60 392 L1020 392" stroke="#b8a890" stroke-width="2"/>`;
      s += `<path d="M-60 440 L1020 440 L1020 560 L-60 560Z" fill="#58b040"/><path d="M-60 440 L1020 440" stroke="#8ad860" stroke-width="4"/>`;
      for (let i = 0; i < 26; i++) s += tuftW(r() * 960, 460 + r() * 90, .7 + r() * .6, '#3a9a30');
      s += `<g filter="url(#${u}w2)">${bush(-20, 520, 70, '#3a9a38', '#6ac858')}${bush(980, 520, 80, '#3a9a38', '#6ac858')}</g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#58b040"/>`;
      return wide(s);
    },

    /* Campo: morros em camadas com névoa, lago brilhando atrás, árvores grandes com sombra, gramado com flores */
    meadow: (c, u) => {
      const r = rng('wmeadow');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#4ab8f0'], [1, '#dcf6ff']])}${lg(u + 'h1', [[0, '#b8e070'], [1, '#8ac850']])}${lg(u + 'h2', [[0, '#9ad858'], [1, '#6ab840']])}${lg(u + 'lk', [[0, '#8ad8f0'], [1, '#5ab8e0']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}sky)"/>` + cloudW(160, 30, 1.1) + cloudW(540, 0, .8, 'bg-drift-w2') + cloudW(840, 50, 1);
      s += `<g opacity=".7">${hillW(200, 260, 360, 190, '#b8e8a0')}${hillW(700, 250, 420, 210, '#a8e090')}</g>` + haze(u, 170, 110);
      s += hillW(120, 300, 380, 170, `url(#${u}h1)`, '#e0f8a0') + hillW(820, 300, 360, 150, `url(#${u}h1)`, '#e0f8a0');
      s += `<rect x="-60" y="282" width="1080" height="34" fill="url(#${u}lk)"/><g class="bg-shimmer">${Array.from({ length: 14 }, () => `<rect x="${f1(r() * 960)}" y="${f1(286 + r() * 24)}" width="${f1(20 + r() * 40)}" height="2.4" rx="1.2" fill="#fff" opacity=".7"/>`).join('')}</g>`;
      s += `<path d="M-60 316 Q480 300 1020 316 L1020 560 L-60 560Z" fill="url(#${u}h2)"/><path d="M-60 316 Q480 300 1020 316" stroke="#c8f080" stroke-width="4" fill="none"/>`;
      s += `<g filter="url(#${u}w1)">${treeR(60, 300, .7, '#3a9a3a', '#6ac850')}${treeR(620, 296, .6, '#3a9a3a', '#6ac850')}</g>`;
      s += treeR(200, 350, 1.5, '#3aa040', '#7ad060') + treeR(760, 344, 1.6, '#3aa040', '#7ad060') + treeR(880, 360, 1.1, '#48a848', '#8ae070');
      s += `<path d="M-60 420 Q300 400 600 420 Q800 432 1020 416 L1020 560 L-60 560Z" fill="#6ac048"/>`;
      for (let i = 0; i < 40; i++) s += flowerW(r() * 960, 360 + r() * 180, ['#fff', '#fff', '#ffe066', '#ffb3d1'][i % 4], .8 + r() * .5);
      for (let i = 0; i < 24; i++) s += tuftW(r() * 960, 430 + r() * 110, .7 + r() * .7, '#3a9a30');
      s += butterflies(r, 4) + `<rect x="-60" y="540" width="1080" height="460" fill="#6ac048"/>`;
      return wide(s);
    },

    /* Praia: céu com nuvens grandes, mar até o horizonte com ilha distante, ondas chegando na areia com espuma,
       marcas na areia e folhas de palmeira em primeiro plano */
    beach: (c, u) => {
      const r = rng('wbeach');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#2a8ae0'], [.7, '#8ad0f8'], [1, '#e0f4ff']])}${lg(u + 'sea', [[0, '#2aa8d8'], [1, '#7ae0e8']])}${lg(u + 'snd', [[0, '#f4ead4'], [1, '#e8d8b4']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="660" fill="url(#${u}sky)"/>` + sunW(u, 180, 10, 60);
      s += cloudW(340, 60, 1.4) + cloudW(700, 20, 1.1, 'bg-drift-w2') + cloudW(900, 110, .8) + cloudW(80, 130, .7, 'bg-drift-w2');
      s += `<g filter="url(#${u}w1)"><path d="M620 196 Q700 170 780 186 Q860 176 1020 190 L1020 202 L620 202Z" fill="#3a9a6a"/><path d="M660 190 Q720 176 780 188" stroke="#8ad0a0" stroke-width="3" fill="none"/></g>`;
      s += `<rect x="-60" y="200" width="1080" height="130" fill="url(#${u}sea)"/><rect x="-60" y="198" width="1080" height="4" fill="#fff" opacity=".5"/>`;
      s += `<g class="bg-shimmer">${Array.from({ length: 20 }, () => `<rect x="${f1(r() * 960)}" y="${f1(206 + r() * 100)}" width="${f1(14 + r() * 40)}" height="2" rx="1" fill="#fff" opacity=".6"/>`).join('')}</g>`;
      s += `<path d="M-60 330 Q300 300 600 330 Q800 346 1020 320 L1020 560 L-60 560Z" fill="url(#${u}snd)"/>`;
      s += `<g class="bg-wave2"><path d="M-60 316 Q140 300 330 322 Q520 344 700 318 Q860 300 1020 312 L1020 334 Q860 322 700 342 Q520 364 330 342 Q140 322 -60 340Z" fill="#fff" opacity=".9"/><path d="M-60 330 Q140 314 330 336 Q520 358 700 332 Q860 316 1020 326" stroke="#bff4ff" stroke-width="6" fill="none" opacity=".6"/></g>`;
      s += `<path d="M-60 348 Q300 330 600 352 Q800 366 1020 344 L1020 360 Q800 380 600 368 Q300 348 -60 364Z" fill="#d8c8a0" opacity=".6"/>`;
      for (let i = 0; i < 40; i++) s += `<ellipse cx="${f1(r() * 960)}" cy="${f1(380 + r() * 150)}" rx="${f1(2 + r() * 4)}" ry="${f1(1 + r())}" fill="#c8b084" opacity=".6"/>`;
      s += `<path d="M120 520 q30 -20 40 -40 M180 510 q20 -20 50 -30" stroke="#d8c09a" stroke-width="3" fill="none" opacity=".6"/><path d="M640 460 l8 0 m10 -12 l8 0 m10 12 l8 0 m10 -12 l8 0" stroke="#c8b08a" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
      s += `<path d="M300 480 q-6 -14 6 -18 q14 4 6 18Z M860 430 q-8 -10 2 -16 q12 2 8 16Z" fill="#ff9aa8"/><path d="M500 500 l10 -4 l2 -10 l6 8 l10 0 l-6 8 l4 10 l-10 -4 l-8 8 l0 -10Z" fill="#ff8a5a"/>`;
      /* coqueiro na direita: tronco curvo com anéis e folhas com folíolos */
      const frond = (a, l) => { const rr = a * Math.PI / 180, ex = Math.cos(rr) * l, ey = Math.sin(rr) * l, mx = ex * .5, my = ey * .5 - 30; let o = `<path d="M0 0 Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="#2a8a3a" stroke-width="7" fill="none"/>`;
        for (let t = .15; t < 1; t += .085) { const px = 2 * (1 - t) * t * mx + t * t * ex, py = 2 * (1 - t) * t * my + t * t * ey, len = 46 * (1 - t * .6); o += `<path d="M${f1(px)} ${f1(py)} l${f1(-len * .35)} ${f1(len)} M${f1(px)} ${f1(py)} l${f1(len * .45)} ${f1(len * .9)}" stroke="${t > .5 ? '#48b048' : '#2f9a3a'}" stroke-width="8" stroke-linecap="round"/>`; }
        return o; };
      s += `<path d="M980 560 Q940 380 900 200 Q890 150 900 110" stroke="#9a6a3a" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M980 560 Q940 380 900 200 Q890 150 900 110" stroke="#c89060" stroke-width="10" fill="none" transform="translate(-8 0)"/>` + Array.from({ length: 12 }, (_, i) => { const t = i / 12, y = 540 - t * 420; return `<path d="M${f1(972 - t * 76 - 14)} ${f1(y)} q14 6 28 0" stroke="#7a4a24" stroke-width="3" fill="none"/>`; }).join('');
      s += `<g class="bg-plant" style="animation-duration:5s"><g transform="translate(900 110)">${[200, 230, 260, 300, 330, 160, 130].map((a, i) => frond(a, 200 - (i % 3) * 20)).join('')}<circle cx="-6" cy="10" r="12" fill="#6a4226"/><circle cx="10" cy="14" r="12" fill="#6a4226"/></g></g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#e8d8b4"/>`;
      return wide(s);
    },

    /* Portal estelar: fundo espacial com rastros de luz caindo (velocidade), núcleo verde-dourado pulsando e estrelas */
    portal: (c, u) => {
      const r = rng('wportal');
      let s = wdefs(u) + `<defs><radialGradient id="${u}core"><stop offset="0" stop-color="#fffbc0"/><stop offset=".25" stop-color="#d8ff6a" stop-opacity=".9"/><stop offset=".6" stop-color="#3ad0a0" stop-opacity=".45"/><stop offset="1" stop-color="#1a2a6a" stop-opacity="0"/></radialGradient>${lg(u + 'st', [[0, '#bff4ff', 0], [.5, '#bff4ff', .9], [1, '#bff4ff', 0]])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="1420" fill="#050a24"/><ellipse cx="480" cy="270" rx="420" ry="360" fill="#1a2a7a" opacity=".6" filter="url(#${u}w4)"/>`;
      for (let i = 0; i < 90; i++) s += `<circle cx="${f1(r() * 960)}" cy="${f1(-100 + r() * 740)}" r="${f1(.8 + r() * 1.6)}" fill="#fff" ${i % 4 ? '' : `class="tw" style="animation-delay:-${f1(r() * 3)}s"`}/>`;
      s += `<g filter="url(#${u}w1)">${Array.from({ length: 70 }, () => { const x = r() * 960, h = 80 + r() * 260; return `<rect class="bg-streak" style="animation-delay:-${f1(r() * 3)}s;animation-duration:${f1(1.4 + r() * 2)}s" x="${f1(x)}" y="${f1(-200 + r() * 500)}" width="${f1(1 + r() * 3)}" height="${f1(h)}" fill="url(#${u}st)" opacity="${f1(.4 + r() * .6)}"/>`; }).join('')}</g>`;
      s += `<ellipse cx="480" cy="250" rx="300" ry="280" fill="url(#${u}core)" class="bg-glow"/><ellipse cx="480" cy="250" rx="120" ry="110" fill="#fffbd0" opacity=".6" filter="url(#${u}w3)" class="bg-glow"/>`;
      s += `<g opacity=".6" filter="url(#${u}w2)">${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<path d="M480 250 L${f1(480 + Math.cos(a) * 520)} ${f1(250 + Math.sin(a) * 520)}" stroke="${i % 2 ? '#8affc8' : '#b88aff'}" stroke-width="10" opacity=".35"/>`; }).join('')}</g>`;
      s += `<g filter="url(#${u}w2)" opacity=".6"><ellipse cx="200" cy="480" rx="200" ry="80" fill="#6a3ab8"/><ellipse cx="820" cy="80" rx="180" ry="60" fill="#2a8ab8"/></g>`;
      return wide(s);
    },

    /* Brinquedoteca: canto de sala em perspectiva (duas paredes), papel zigue-zague, quadro de letras, prateleiras,
       mesinha, carrinho de brinquedo, tapete de bolinhas e luz da janela */
    playroom: (c, u) => {
      const r = rng('wplay');
      let s = wdefs(u) + `<defs>${lg(u + 'wl', [[0, '#fff8ec'], [1, '#fdeede']])}${lg(u + 'wr', [[0, '#ffe8d0'], [1, '#fcd8b8']], 1, 0)}${lg(u + 'fl', [[0, '#f8c8b8'], [1, '#fcdccc']])}<pattern id="${u}zz" width="40" height="30" patternUnits="userSpaceOnUse"><path d="M0 10 L10 0 L20 10 L30 0 L40 10 M0 25 L10 15 L20 25 L30 15 L40 25" stroke="#8ad8c8" stroke-width="4" fill="none"/></pattern></defs>`;
      /* parede esquerda (frontal) e direita (em fuga) */
      s += `<rect x="-60" y="-420" width="820" height="820" fill="url(#${u}wl)"/><rect x="-60" y="-420" width="820" height="820" fill="url(#${u}zz)" opacity=".7"/>`;
      s += `<path d="M760 -420 L1020 -500 L1020 520 L760 400Z" fill="url(#${u}wr)"/><path d="M760 -420 L760 400" stroke="#e8c8a8" stroke-width="4"/>`;
      /* janela na parede lateral (luz entrando) */
      s += `<path d="M800 40 L990 -6 L990 250 L800 270Z" fill="#ffe8a8"/><path d="M800 40 L990 -6 L990 250 L800 270Z" fill="none" stroke="#fff" stroke-width="8"/><path d="M895 17 L895 260 M800 155 L990 122" stroke="#fff" stroke-width="5"/><path d="M810 60 L980 20 L980 110 L810 140Z" fill="#fff4d0" opacity=".6"/>`;
      s += `<path d="M800 270 L990 250 L700 540 L360 540Z" fill="#fff4c0" opacity=".3"/>`;
      /* rodapé e piso */
      s += `<rect x="-60" y="392" width="820" height="14" fill="#f8b890"/><path d="M760 400 L1020 520 L1020 532 L760 410Z" fill="#f8b890"/>`;
      s += `<path d="M-60 406 L760 406 L1020 530 L1020 1000 L-60 1000Z" fill="url(#${u}fl)"/>`;
      /* letras e formas na parede */
      s += `<text x="140" y="90" font-size="76" font-weight="700" font-family="'Fredoka',sans-serif" fill="#ff5a5a">O</text><text x="200" y="150" font-size="54" font-weight="700" font-family="'Fredoka',sans-serif" fill="#3aa8a0">G</text><text x="120" y="190" font-size="60" font-weight="700" font-family="'Fredoka',sans-serif" fill="#ffb03a">S</text>`;
      s += `<path d="M300 40 L330 90 L270 90Z" fill="#ff8a8a"/><circle cx="560" cy="60" r="18" fill="#8ad0ff"/><rect x="620" y="40" width="30" height="30" fill="#b8e070" transform="rotate(15 635 55)"/>`;
      /* quadro de letras */
      s += `<rect x="330" y="120" width="190" height="130" rx="6" fill="#c87a4a"/><rect x="340" y="130" width="170" height="110" fill="#2a6a5a"/><text x="425" y="176" text-anchor="middle" font-size="38" font-weight="700" font-family="'Fredoka',sans-serif" fill="#fff">ABC</text><text x="425" y="222" text-anchor="middle" font-size="32" font-family="'Fredoka',sans-serif" fill="#ffe0a0">DEF</text>`;
      /* prateleiras com potes de lápis e livros */
      s += `<rect x="30" y="236" width="170" height="10" fill="#e8905a"/><rect x="30" y="300" width="170" height="10" fill="#e8905a"/>` + [[46, '#ff5a5a'], [84, '#3aa8e0'], [122, '#ffd03a'], [160, '#8ac050']].map(([x, col]) => `<rect x="${x}" y="206" width="26" height="30" rx="3" fill="${col}"/>${[0, 6, 12, 18].map(d => `<rect x="${x + 3 + d}" y="${194 + (d % 12)}" width="3" height="16" fill="${['#ff5a5a', '#3a7ae0', '#ffd03a', '#8ac050'][d / 6]}"/>`).join('')}`).join('') + Array.from({ length: 8 }, (_, i) => `<rect x="${40 + i * 18}" y="${262 + (i % 3) * 3}" width="14" height="${38 - (i % 3) * 3}" fill="${['#ff8a5a', '#5ab8e0', '#b88aff', '#ffd03a'][i % 4]}"/>`).join('');
      /* ábaco de parede e estante lateral */
      s += `<rect x="560" y="120" width="130" height="160" rx="6" fill="#f0d8c0" stroke="#c89a70" stroke-width="4"/>` + [150, 190, 230].map((y, j) => `<path d="M570 ${y} L680 ${y}" stroke="#a87a50" stroke-width="3"/>` + Array.from({ length: 5 }, (_, i) => `<circle cx="${584 + i * 14 + j * 8}" cy="${y}" r="7" fill="${['#ff5a5a', '#3aa8e0', '#ffd03a', '#8ac050', '#b88aff'][(i + j) % 5]}"/>`).join('')).join('');
      /* tapete de bolinhas em perspectiva */
      s += `<path d="M160 430 L760 430 L900 540 L40 540Z" fill="#fff8e0"/>` + Array.from({ length: 24 }, () => { const y = 440 + r() * 90, x = 100 + r() * 740; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(10 + (y - 430) * .12)}" ry="${f1(4 + (y - 430) * .05)}" fill="${['#ffb8c8', '#b8e8ff', '#ffe8a0', '#c8f0b0'][Math.floor(r() * 4)]}"/>`; }).join('');
      /* mesinha e cadeirinha */
      s += `<ellipse cx="230" cy="470" rx="130" ry="14" fill="#000" opacity=".12"/><path d="M110 380 L360 380 L340 400 L130 400Z" fill="#f0a060"/><rect x="110" y="376" width="250" height="8" rx="3" fill="#f8b878"/><path d="M140 400 L130 468 M330 400 L340 468" stroke="#d8804a" stroke-width="10" stroke-linecap="round"/><rect x="200" y="360" width="60" height="16" rx="3" fill="#fff"/><path d="M200 360 L230 344 L260 360" fill="#8ad0ff"/>`;
      /* carrinho de brinquedo */
      s += `<ellipse cx="660" cy="494" rx="70" ry="10" fill="#000" opacity=".12"/><path d="M600 470 L720 470 L716 440 L690 420 L640 420 L620 440 L600 444Z" fill="#ff7a4a"/><path d="M640 424 L686 424 L700 440 L632 440Z" fill="#bff0ff"/><circle cx="626" cy="480" r="16" fill="#2a8a8a"/><circle cx="626" cy="480" r="6" fill="#bff0ff"/><circle cx="700" cy="480" r="16" fill="#2a8a8a"/><circle cx="700" cy="480" r="6" fill="#bff0ff"/>`;
      s += dust(r, 12, 360, 900, 200, 460);
      return wide(s);
    },

    /* Noite assombrada: céu alaranjado com lua e nuvens, morros em silhueta em 3 planos, cemitério com cruzes
       e lápides, árvore seca, abóbora, morcegos voando e névoa baixa */
    haunted: (c, u) => {
      const r = rng('whaunt');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#5a2a1a'], [.5, '#b0602a'], [1, '#d8844a']])}<radialGradient id="${u}mn"><stop offset="0" stop-color="#fff6e0"/><stop offset=".4" stop-color="#ffe0b0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe0b0" stop-opacity="0"/></radialGradient></defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="780" fill="url(#${u}sky)"/><circle cx="470" cy="90" r="160" fill="url(#${u}mn)" class="bg-glow"/><circle cx="470" cy="90" r="46" fill="#fbf2e0"/><circle cx="456" cy="80" r="8" fill="#e8d8c0"/><circle cx="486" cy="104" r="6" fill="#e8d8c0"/>`;
      s += `<g class="bg-drift-w" opacity=".55" filter="url(#${u}w2)">${[[160, 60], [320, 140], [700, 70], [860, 150]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="120" ry="18" fill="#7a3a1e"/>`).join('')}</g>`;
      s += `<path d="M-60 280 Q120 230 300 270 Q480 220 660 262 Q820 236 1020 270 L1020 560 L-60 560Z" fill="#6a3a24" opacity=".7"/>`;
      s += `<path d="M-60 330 Q160 280 420 320 Q640 290 1020 330 L1020 560 L-60 560Z" fill="#3a1e14"/>`;
      /* lápides e cruzes no morro do meio */
      s += [[150, 300, 1], [300, 310, .8], [600, 300, .9], [760, 310, 1.1]].map(([x, y, sc]) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-14 0 L-14 -30 Q0 -44 14 -30 L14 0Z" fill="#2a140e"/><rect x="-20" y="-2" width="40" height="6" fill="#2a140e"/></g>`).join('');
      s += [[230, 300], [680, 296], [860, 306]].map(([x, y]) => `<path d="M${x} ${y} L${x} ${y - 50} M${x - 16} ${y - 36} L${x + 16} ${y - 36}" stroke="#2a140e" stroke-width="7"/>`).join('');
      s += `<path d="M-60 400 Q200 360 480 390 Q760 360 1020 396 L1020 560 L-60 560Z" fill="#1a0c08"/>`;
      /* árvore seca à esquerda */
      s += `<path d="M40 400 Q60 300 40 200 Q30 120 60 40 M50 220 Q100 180 140 190 M44 160 Q0 120 -20 100 M58 100 Q100 60 150 70 M120 186 Q150 160 170 170" stroke="#140806" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M60 40 Q70 10 60 -20 M150 70 Q170 60 180 40" stroke="#140806" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      s += `<g class="anim-bob"><path d="M150 70 L150 100" stroke="#140806" stroke-width="2"/><circle cx="150" cy="112" r="14" fill="#e8702a"/><path d="M142 110 l4 -4 l4 4 M152 110 l4 -4 l4 4 M142 118 q8 6 16 0" stroke="#2a140e" stroke-width="2" fill="none"/></g>`;
      /* abóbora iluminada e névoa baixa */
      s += `<g transform="translate(820 404)"><ellipse cx="0" cy="0" rx="36" ry="28" fill="#e8702a"/><path d="M-12 -26 Q0 -30 12 -26 M0 -28 Q2 -40 8 -44" stroke="#3a5a1a" stroke-width="4" fill="none"/><path d="M-16 -6 L-8 -12 L-4 -2Z M16 -6 L8 -12 L4 -2Z M-16 8 Q0 20 16 8 Q0 12 -16 8Z" fill="#ffe070" class="anim-flicker"/><ellipse cx="0" cy="0" rx="70" ry="44" fill="#ffb040" opacity=".3" filter="url(#${u}w3)" class="bg-glow"/></g>`;
      s += `<g class="w-fog" style="animation-duration:24s" opacity=".35" filter="url(#${u}w3)"><ellipse cx="200" cy="420" rx="260" ry="30" fill="#d8b8a0"/><ellipse cx="720" cy="440" rx="240" ry="26" fill="#d8b8a0"/></g>`;
      s += [[300, 120], [360, 90], [620, 150], [700, 60]].map(([x, y], i) => `<g class="bg-bat" style="animation-delay:-${i * 1.3}s"><path class="anim-flap" d="M${x} ${y} q9 -10 18 0 q9 -10 18 0 q-9 4 -18 10 q-9 -6 -18 -10Z" fill="#1a0c08"/></g>`).join('');
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#1a0c08"/>`;
      return wide(s);
    },

    /* Rua da cidade: fachadas de tijolo em relevo (janelas com sombra, escada de incêndio, portas, toldos),
       árvores de outono, calçada, rua e faixa de pedestres; folhas caindo */
    street: (c, u) => {
      const r = rng('wstreet');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#8ad0f0'], [1, '#e0f4ff']])}<pattern id="${u}br" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#c85a3a"/><path d="M0 12 L24 12 M12 0 L12 6 M0 6 L24 6 M0 6 L0 12 M24 6 L24 12" stroke="#a8442a" stroke-width="1.6"/></pattern></defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="780" fill="url(#${u}sky)"/>`;
      const bld = (x, w, top, fill, winCol, trim) => { let o = `<rect x="${x}" y="${top}" width="${w}" height="${400 - top}" fill="${fill}"/><rect x="${x}" y="${top}" width="${w}" height="10" fill="${trim}"/><rect x="${x + w - 10}" y="${top}" width="10" height="${400 - top}" fill="#000" opacity=".12"/>`;
        for (let y = top + 30; y < 250; y += 80) for (let wx = x + 20; wx < x + w - 50; wx += 60) o += `<rect x="${wx}" y="${y}" width="40" height="52" fill="${trim}"/><rect x="${wx + 4}" y="${y + 4}" width="32" height="44" fill="${winCol}"/><path d="M${wx + 20} ${y + 4} L${wx + 20} ${y + 48} M${wx + 4} ${y + 24} L${wx + 36} ${y + 24}" stroke="${trim}" stroke-width="3"/><rect x="${wx + 4}" y="${y + 4}" width="32" height="10" fill="#000" opacity=".15"/><rect x="${wx - 4}" y="${y + 52}" width="48" height="6" fill="${trim}"/>`;
        return o; };
      s += `<g filter="url(#${u}w1)" opacity=".7">${[[-20, 140, 40], [120, 120, 20], [700, 130, 30], [840, 160, 10]].map(([x, w, t]) => `<rect x="${x}" y="${t}" width="${w}" height="300" fill="#a8b8c8"/>`).join('')}</g>`;
      s += bld(-60, 250, 20, `url(#${u}br)`, '#bfe0f0', '#f0e6d8') + bld(190, 230, 0, '#e8d8c8', '#a8c8d8', '#8a7060') + bld(420, 230, 40, '#9ab0a0', '#d0e8f0', '#e8e0d0') + bld(650, 170, 10, '#e8c0a8', '#bfe0f0', '#fff') + bld(820, 200, 30, `url(#${u}br)`, '#c8e0f0', '#f0e6d8');
      /* escada de incêndio */
      s += `<g stroke="#2a2a3a" stroke-width="3" fill="none"><path d="M30 120 L150 120 M30 200 L150 200 M30 120 L30 110 M150 120 L150 110 M30 200 L30 190 M150 200 L150 190"/><path d="M50 120 L130 200"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${50 + i * 10} ${120 + i * 10} L${60 + i * 10} ${120 + i * 10}"/>`).join('')}</g>`;
      /* portas, vitrines e toldos */
      s += `<rect x="60" y="286" width="60" height="108" fill="#fff"/><rect x="66" y="292" width="48" height="100" fill="#f0f0f4"/><path d="M40 388 L140 388 L148 398 L32 398Z" fill="#c8c0b8"/>`;
      s += `<rect x="270" y="290" width="70" height="106" fill="#2a6a4a"/><rect x="280" y="300" width="50" height="40" fill="#8ab8a0"/><circle cx="326" cy="350" r="3" fill="#f0d070"/>`;
      s += `<rect x="440" y="276" width="190" height="120" fill="#3a3a4a"/><rect x="448" y="284" width="174" height="104" fill="#a8d0e0"/><path d="M430 250 L640 250 L630 276 L440 276Z" fill="#e84a5a"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${440 + i * 30} 276 q15 10 30 0" fill="${i % 2 ? '#fff' : '#e84a5a'}"/>`).join('') + `<rect x="760" y="260" width="10" height="36" fill="#fff"/><path d="M756 272 L774 272 M765 263 L765 281" stroke="#3ac860" stroke-width="5"/>`;
      s += `<rect x="690" y="296" width="80" height="100" fill="#fff"/><rect x="698" y="304" width="64" height="92" fill="#bfe0f0"/>`;
      /* árvores de outono na calçada */
      const aut = (x, sc) => `<g transform="translate(${x} 400) scale(${sc})"><rect x="-6" y="-80" width="12" height="80" fill="#6a4020"/><path d="M0 -70 L-20 -100 M0 -60 L22 -90" stroke="#6a4020" stroke-width="5"/>${[[-30, -110, 34], [10, -130, 40], [36, -100, 30], [0, -96, 32], [-10, -140, 26]].map(([a, b, rr]) => `<circle cx="${a}" cy="${b}" r="${rr}" fill="#e8a020"/><circle cx="${a - rr * .3}" cy="${b - rr * .3}" r="${rr * .5}" fill="#ffd060"/>`).join('')}</g>`;
      s += aut(160, 1) + aut(600, 1.1) + aut(930, .9);
      /* calçada, meio-fio, rua e faixa */
      s += `<rect x="-60" y="396" width="1080" height="44" fill="#e8d8c4"/>` + Array.from({ length: 27 }, (_, i) => `<path d="M${-60 + i * 42} 396 L${-70 + i * 42} 440" stroke="#c8b8a4" stroke-width="2"/>`).join('') + `<rect x="-60" y="440" width="1080" height="10" fill="#b0a898"/><rect x="-60" y="450" width="1080" height="110" fill="#6a6a78"/><path d="M-60 500 L1020 500" stroke="#f0e070" stroke-width="5" stroke-dasharray="40 30"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${800 + i * 30}" y="456" width="20" height="100" fill="#fff" opacity=".85" transform="skewX(-20)"/>`).join('');
      for (let i = 0; i < 12; i++) s += `<g class="bg-leaf" style="animation-duration:${f1(7 + r() * 5)}s;animation-delay:-${f1(r() * 10)}s"><ellipse cx="${f1(r() * 1000)}" cy="0" rx="6" ry="4" fill="${['#e8a020', '#ffd060', '#d86a20'][i % 3]}"/></g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#6a6a78"/>`;
      return wide(s);
    },

    /* Templo oriental: montanhas pontudas em planos com névoa, nuvens espiraladas, pagodes, pinheiros
       orientais e muro de telhas cinza com base vermelha em primeiro plano */
    oriental: (c, u) => {
      const r = rng('worient');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#7ac8f0'], [1, '#e0f6ff']])}${lg(u + 'mt', [[0, '#7a8a70'], [1, '#b8c0a8']])}${lg(u + 'mt2', [[0, '#5a6a50'], [1, '#8a9a78']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="780" fill="url(#${u}sky)"/>`;
      const peak = (x, y, w, h, fill, hi) => `<path d="M${x - w} ${y} Q${x - w * .6} ${y - h * .5} ${x - w * .2} ${y - h} Q${x} ${y - h * 1.08} ${x + w * .25} ${y - h * .9} Q${x + w * .7} ${y - h * .4} ${x + w} ${y}Z" fill="${fill}"/><path d="M${x - w * .2} ${y - h} Q${x - w * .5} ${y - h * .5} ${x - w * .7} ${y}" stroke="${hi}" stroke-width="6" fill="none" opacity=".5"/>`;
      s += `<g opacity=".6" filter="url(#${u}w1)">${peak(160, 300, 120, 260, `url(#${u}mt)`, '#e0e8d0')}${peak(640, 300, 140, 280, `url(#${u}mt)`, '#e0e8d0')}</g>` + haze(u, 200, 100);
      s += peak(300, 330, 150, 290, `url(#${u}mt2)`, '#c8d8b8') + peak(820, 330, 130, 300, `url(#${u}mt2)`, '#c8d8b8');
      s += `<g class="bg-drift-w">${[[200, 120], [520, 60], [740, 180]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-50 10 Q-60 -14 -30 -14 Q-24 -30 0 -24 Q20 -36 34 -16 Q60 -16 54 10Z" fill="#fff"/><path d="M-20 -6 q6 -8 12 0 q-4 6 -8 2 M14 -4 q6 -8 12 0" stroke="#8ab8d8" stroke-width="2.4" fill="none"/></g>`).join('')}</g>`;
      /* pagodes */
      const pagoda = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-60" y="-50" width="120" height="50" fill="#f0ece0"/>${[-40, -12, 16].map(d => `<rect x="${d}" y="-40" width="18" height="26" fill="#3a3a3a"/>`).join('')}<path d="M-90 -50 Q0 -64 90 -50 L70 -74 Q0 -84 -70 -74Z" fill="#d82a2a"/><path d="M-90 -50 Q0 -64 90 -50" stroke="#8a1010" stroke-width="3" fill="none"/><rect x="-44" y="-100" width="88" height="28" fill="#f0ece0"/><path d="M-64 -100 Q0 -112 64 -100 L48 -120 Q0 -128 -48 -120Z" fill="#d82a2a"/></g>`;
      s += pagoda(90, 300, 1.2) + pagoda(640, 300, .9);
      /* pinheiros orientais (galhos em camadas) */
      const opine = (x, y, sc, fl) => `<g transform="translate(${x} ${y}) scale(${sc * fl} ${sc})"><path d="M0 0 Q-10 -60 20 -110 Q40 -150 10 -190" stroke="#6a4a2a" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M10 -120 Q60 -130 100 -120 M18 -70 Q-40 -80 -80 -64" stroke="#6a4a2a" stroke-width="8" fill="none"/>${[[100, -130, 44], [-80, -76, 40], [10, -200, 46], [60, -170, 34], [-30, -150, 30]].map(([a, b, w]) => `<ellipse cx="${a}" cy="${b}" rx="${w}" ry="${w * .4}" fill="#3a8a3a"/><ellipse cx="${a - w * .2}" cy="${b - w * .12}" rx="${w * .6}" ry="${w * .2}" fill="#6ab850"/>`).join('')}</g>`;
      s += opine(260, 320, 1, 1) + opine(860, 320, 1.1, -1);
      /* muro com telhado de telhas em primeiro plano */
      s += `<path d="M-60 360 L1020 360 L1060 420 L-100 420Z" fill="#8a8a8a"/>` + Array.from({ length: 60 }, (_, i) => `<path d="M${-80 + i * 20} 362 L${-100 + i * 20.6} 420" stroke="#6a6a6a" stroke-width="3"/>`).join('') + `<path d="M-60 360 L1020 360" stroke="#b0b0b0" stroke-width="6"/>`;
      s += `<rect x="-100" y="420" width="1160" height="16" fill="#5a5a5a"/>` + Array.from({ length: 50 }, (_, i) => `<circle cx="${-90 + i * 24}" cy="440" r="10" fill="#d82a2a"/>`).join('') + `<rect x="-100" y="446" width="1160" height="120" fill="#c82020"/>`;
      s += [80, 330, 580, 830].map(x => `<path d="M${x} 560 L${x} 500 Q${x + 50} 460 ${x + 100} 500 L${x + 100} 560Z" fill="#2a4a3a"/><path d="M${x + 20} 540 Q${x + 50} 500 ${x + 80} 540" stroke="#4a8a6a" stroke-width="4" fill="none"/>`).join('');
      s += `<rect x="-60" y="560" width="1080" height="440" fill="#c82020"/>`;
      return wide(s);
    },

    /* Deserto: céu vermelho com nuvens em faixas, sol baixo, dunas em 4 planos com névoa de calor */
    desert: (c, u) => {
      const r = rng('wdesert');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#7a1a1a'], [.45, '#c8402a'], [.8, '#f0904a'], [1, '#f8c080']])}${lg(u + 'd1', [[0, '#c86a3a'], [1, '#a84a2a']])}${lg(u + 'd2', [[0, '#b04a26'], [1, '#8a2e1a']])}${lg(u + 'd3', [[0, '#d8784a'], [1, '#a84224']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}sky)"/>` + sunW(u, 700, 230, 90, '#ffd080');
      s += `<g class="bg-drift-w" opacity=".7">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="${f1(r() * 960)}" cy="${f1(-20 + i * 18 + r() * 10)}" rx="${f1(140 + r() * 160)}" ry="${f1(6 + r() * 8)}" fill="${i % 2 ? '#e87a5a' : '#8a2a2a'}" opacity=".6"/>`).join('')}</g>`;
      s += `<g filter="url(#${u}w1)" opacity=".8"><path d="M-60 250 Q100 220 260 240 Q420 200 600 236 Q780 214 1020 238 L1020 300 L-60 300Z" fill="#c86a4a"/></g>` + haze(u, 220, 80, '#ffc090');
      s += `<path d="M-60 290 Q200 240 440 280 Q640 250 1020 286 L1020 560 L-60 560Z" fill="url(#${u}d1)"/><path d="M-60 290 Q200 240 440 280" stroke="#f0a060" stroke-width="3" fill="none" opacity=".7"/>`;
      s += `<path d="M-60 360 Q300 300 560 350 Q780 380 1020 330 L1020 560 L-60 560Z" fill="url(#${u}d3)"/><path d="M-60 360 Q300 300 560 350" stroke="#f8b070" stroke-width="4" fill="none" opacity=".6"/>`;
      s += `<path d="M-60 440 Q200 400 480 436 Q760 470 1020 420 L1020 560 L-60 560Z" fill="url(#${u}d2)"/><path d="M200 470 Q300 450 400 470 M620 490 Q720 470 820 486" stroke="#c86a40" stroke-width="3" fill="none" opacity=".5"/>`;
      s += `<g class="bg-shimmer" opacity=".3"><rect x="-60" y="280" width="1080" height="14" fill="#ffd0a0" filter="url(#${u}w2)"/></g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#8a2e1a"/>`;
      return wide(s);
    },

    /* Fundo do mar: superfície ondulando lá em cima, raios de luz, cardumes distantes, rochas e algas em planos,
       areia no fundo e bolhas subindo */
    ocean: (c, u) => {
      const r = rng('wocean');
      let s = wdefs(u) + `<defs>${lg(u + 'sea', [[0, '#6ae0f8'], [.35, '#1a9ad8'], [1, '#0a3a8a']])}${lg(u + 'ray', [[0, '#e0fbff', .5], [1, '#e0fbff', 0]])}${lg(u + 'snd', [[0, '#e8d8a8'], [1, '#c8b080']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="1420" fill="url(#${u}sea)"/><rect x="-60" y="-420" width="1080" height="400" fill="#8af0ff" opacity=".4"/>`;
      s += `<g class="bg-wave">${Array.from({ length: 14 }, (_, i) => `<path d="M${-80 + i * 80} 0 q20 -10 40 0 t40 0" stroke="#e0fbff" stroke-width="4" fill="none" opacity=".7"/>`).join('')}</g>`;
      s += `<g class="bg-rays">${[[120, 40], [300, 70], [520, 50], [720, 80]].map(([x, w]) => `<path d="M${x} -40 L${x + w} -40 L${x + w + 120} 560 L${x + 20} 560Z" fill="url(#${u}ray)"/>`).join('')}</g>`;
      s += `<g filter="url(#${u}w2)" opacity=".4">${[[200, 200], [700, 150]].map(([x, y]) => Array.from({ length: 9 }, (_, i) => `<ellipse cx="${x + (i % 3) * 20}" cy="${y + Math.floor(i / 3) * 12}" rx="8" ry="3" fill="#0a3a6a"/>`).join('')).join('')}</g>`;
      s += `<g filter="url(#${u}w1)" opacity=".6"><path d="M-60 400 Q40 320 140 380 Q220 300 320 390 L320 560 L-60 560Z M640 390 Q740 310 840 380 Q940 320 1020 380 L1020 560 L640 560Z" fill="#1a4a7a"/></g>`;
      s += `<path d="M-60 440 Q240 410 480 432 Q720 452 1020 424 L1020 560 L-60 560Z" fill="url(#${u}snd)"/><g class="bg-shimmer" opacity=".5">${Array.from({ length: 10 }, () => `<path d="M${f1(r() * 960)} ${f1(450 + r() * 80)} q12 -6 24 0" stroke="#fff" stroke-width="2" fill="none"/>`).join('')}</g>`;
      s += rockW(120, 440, 110, 60, '#4a6a8a', '#2a4a6a') + rockW(820, 446, 140, 70, '#4a6a8a', '#2a4a6a');
      for (let i = 0; i < 9; i++) { const x = 40 + i * 110 + r() * 30; s += `<path class="sway" style="animation-delay:-${f1(r() * 3)}s" d="M${f1(x)} 480 q-16 -40 0 -80 q16 -40 0 -80" stroke="#2abf71" stroke-width="10" fill="none" stroke-linecap="round"/>`; }
      s += [[300, 460, '#ff7aa8'], [620, 470, '#ffb52e'], [520, 480, '#b56cff']].map(([x, y, col]) => `<g class="sway"><path d="M${x} ${y} l-16 -44 m16 44 l0 -56 m0 56 l16 -46 m-16 46 l-28 -22 m28 22 l28 -24" stroke="${col}" stroke-width="8" stroke-linecap="round"/></g>`).join('');
      s += [[160, 260, 1], [760, 300, -1]].map(([x, y, m], i) => `<g class="bg-drift-w${i ? 2 : ''}"><g transform="translate(${x} ${y}) scale(${m * 2} 2)"><ellipse cx="0" cy="0" rx="10" ry="6" fill="#ffb52e"/><path d="M-9 0 L-16 -6 L-16 6Z" fill="#ff8a2a"/><circle cx="5" cy="-1" r="1.6" fill="#1a1030"/></g></g>`).join('');
      for (let i = 0; i < 22; i++) s += `<circle class="w-rise" style="animation-delay:-${f1(r() * 6)}s;animation-duration:${f1(5 + r() * 4)}s" cx="${f1(r() * 960)}" cy="560" r="${f1(3 + r() * 7)}" fill="#fff" fill-opacity=".12" stroke="#bff4ff" stroke-width="2"/>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#c8b080"/>`;
      return wide(s);
    },

    /* Corredor da escola: forro com luminárias, paredes com janelas das salas, portas, quadro de avisos,
       armários, piso encerado refletindo e luz entrando */
    hallway: (c, u) => {
      const r = rng('whall');
      let s = wdefs(u) + `<defs>${lg(u + 'wl', [[0, '#f4f6f8'], [1, '#e4e8ec']])}${lg(u + 'fl', [[0, '#c8d8e0'], [1, '#e8f0f4']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="840" fill="url(#${u}wl)"/>`;
      /* forro com painéis e luminárias */
      s += `<rect x="-60" y="-420" width="1080" height="440" fill="#e8e0d4"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${-60 + i * 90} -40 L${-60 + i * 90} 20" stroke="#d0c8bc" stroke-width="2"/>`).join('') + `<path d="M-60 -10 L1020 -10" stroke="#d0c8bc" stroke-width="2"/>`;
      s += [80, 420, 760].map(x => `<rect x="${x}" y="-2" width="140" height="14" rx="3" fill="#fff"/><rect x="${x}" y="8" width="140" height="80" fill="#fffbe6" opacity=".25" filter="url(#${u}w2)"/>`).join('');
      s += `<rect x="-60" y="20" width="1080" height="12" fill="#f0ece4"/>`;
      /* paredes das salas com janelas internas e portas */
      const room = (x, w) => `<rect x="${x}" y="60" width="${w}" height="300" fill="#fff"/><rect x="${x + 6}" y="70" width="${w - 12}" height="100" fill="#bfe0f0"/>` + Array.from({ length: Math.floor((w - 12) / 60) }, (_, i) => `<rect x="${x + 8 + i * 60}" y="72" width="54" height="96" fill="#d8eef8"/><path d="M${x + 12 + i * 60} 80 L${x + 40 + i * 60} 160" stroke="#fff" stroke-width="6" opacity=".6"/>`).join('') + `<rect x="${x}" y="170" width="${w}" height="8" fill="#e0e4e8"/>`;
      s += room(-60, 300) + room(320, 340) + room(740, 300);
      s += [[250, '#9aa8b8'], [670, '#9aa8b8']].map(([x, col]) => `<rect x="${x - 10}" y="60" width="80" height="300" fill="#f8f8fa"/><rect x="${x}" y="150" width="60" height="210" fill="${col}"/><rect x="${x + 8}" y="162" width="44" height="60" fill="#d0e8f4"/><circle cx="${x + 50}" cy="270" r="4" fill="#e8d070"/><rect x="${x + 50}" y="162" width="10" height="198" fill="#000" opacity=".1"/>`).join('');
      /* quadro de avisos e lousa na sala do meio */
      s += `<rect x="380" y="200" width="160" height="100" fill="#3a6a5a" stroke="#b08a60" stroke-width="6"/><path d="M400 230 Q440 222 480 234 M400 256 Q460 250 520 258" stroke="#e8f5ec" stroke-width="3" fill="none" opacity=".7"/>`;
      s += `<rect x="560" y="210" width="80" height="60" fill="#e8c090"/>` + [[570, 218, '#ffb8c8'], [600, 222, '#b8e8ff'], [576, 244, '#fff0a0'], [610, 246, '#c8f0b0']].map(([x, y, col]) => `<rect x="${x}" y="${y}" width="22" height="18" fill="${col}" transform="rotate(${f1(-6 + r() * 12)} ${x + 11} ${y + 9})"/>`).join('');
      /* armários à esquerda */
      s += Array.from({ length: 5 }, (_, i) => `<rect x="${-50 + i * 50}" y="210" width="46" height="150" fill="#6a9ad0"/><rect x="${-46 + i * 50}" y="220" width="38" height="8" fill="#4a7ab0"/><rect x="${-46 + i * 50}" y="232" width="38" height="8" fill="#4a7ab0"/><rect x="${-18 + i * 50}" y="290" width="6" height="14" rx="2" fill="#dde"/>`).join('');
      /* rodapé e piso encerado com reflexos */
      s += `<rect x="-60" y="356" width="1080" height="10" fill="#c8ccd0"/><rect x="-60" y="366" width="1080" height="200" fill="url(#${u}fl)"/>`;
      s += Array.from({ length: 19 }, (_, i) => { const x = -480 + i * 100; return `<path d="M${f1(480 + (x - 480) * .3)} 366 L${x} 560" stroke="#b8c8d0" stroke-width="2"/>`; }).join('') + [384, 410, 450, 510].map(y => `<path d="M-60 ${y} L1020 ${y}" stroke="#b8c8d0" stroke-width="2"/>`).join('');
      s += `<g opacity=".35" filter="url(#${u}w2)"><rect x="-60" y="370" width="300" height="80" fill="#bfe0f0"/><rect x="320" y="370" width="340" height="80" fill="#bfe0f0"/><rect x="740" y="370" width="300" height="80" fill="#bfe0f0"/><rect x="250" y="370" width="60" height="110" fill="#9aa8b8"/><rect x="670" y="370" width="60" height="110" fill="#9aa8b8"/></g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#e8f0f4"/>`;
      return wide(s);
    },

    /* Aurora: céu noturno com cortinas de aurora ondulando, estrelas, montanhas azuladas e colinas de neve
       em camadas (sombra azul de um lado, brilho do outro) */
    aurora: (c, u) => {
      const r = rng('waur');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#020a1a'], [.6, '#0a2a3a'], [1, '#1a4a4a']])}${lg(u + 'ag', [[0, '#3affb0', 0], [.4, '#3affb0', .8], [.7, '#1ac890', .4], [1, '#1ac890', 0]])}${lg(u + 'sn', [[0, '#ffffff'], [1, '#d8e4f0']])}${lg(u + 'sn2', [[0, '#f0f4fa'], [1, '#c8d4e4']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="840" fill="url(#${u}sky)"/>`;
      for (let i = 0; i < 110; i++) s += `<circle cx="${f1(r() * 960)}" cy="${f1(-300 + r() * 560)}" r="${f1(.6 + r() * 1.6)}" fill="#fff" ${i % 5 ? '' : `class="tw" style="animation-delay:-${f1(r() * 3)}s"`}/>`;
      s += `<g filter="url(#${u}w3)">${[0, 1, 2, 3].map(i => `<path class="bg-aurora" style="animation-delay:-${i * 2}s" d="M${-100 + i * 260} -60 Q${40 + i * 260} 100 ${-40 + i * 260} 300 L${120 + i * 260} 300 Q${200 + i * 260} 100 ${80 + i * 260} -60Z" fill="url(#${u}ag)" opacity="${f1(.9 - i * .12)}"/>`).join('')}</g>`;
      s += `<g opacity=".8">${ridgeW([[-60, 300], [80, 230], [200, 290], [360, 220], [520, 300], [700, 240], [860, 290], [1020, 250]], '#2a4a6a')}</g>`;
      s += `<path d="M-60 360 Q200 300 480 340 Q720 370 1020 320 L1020 560 L-60 560Z" fill="url(#${u}sn2)"/>`;
      s += `<path d="M-60 440 Q300 380 600 420 Q820 450 1020 410 L1020 560 L-60 560Z" fill="url(#${u}sn)"/><path d="M-60 440 Q300 380 600 420" stroke="#fff" stroke-width="5" fill="none"/>`;
      s += `<g class="bg-shimmer">${Array.from({ length: 14 }, () => `<path d="${star(r() * 960, 360 + r() * 180, 3, .8, 4)}" fill="#fff"/>`).join('')}</g>`;
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#d8e4f0"/>`;
      return wide(s);
    },

    /* Céu: sol brilhando no alto, camadas de nuvens (as de perto maiores e mais nítidas), raios de luz */
    skyview: (c, u) => {
      const r = rng('wsky');
      let s = wdefs(u) + `<defs>${lg(u + 'sky', [[0, '#0a5ad8'], [.5, '#3a9af0'], [1, '#bfe8ff']])}${lg(u + 'ray', [[0, '#ffffff', .5], [1, '#ffffff', 0]])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="1420" fill="url(#${u}sky)"/>` + sunW(u, 200, 60, 120, '#ffffff');
      s += `<g class="bg-rays" opacity=".6">${[0, 1, 2, 3, 4].map(i => { const a = (20 + i * 14) * Math.PI / 180; return `<path d="M200 60 L${f1(200 + Math.cos(a) * 1100 - 30)} ${f1(60 + Math.sin(a) * 1100)} L${f1(200 + Math.cos(a) * 1100 + 30)} ${f1(60 + Math.sin(a) * 1100)}Z" fill="url(#${u}ray)"/>`; }).join('')}</g>`;
      s += `<g opacity=".6" filter="url(#${u}w2)">${Array.from({ length: 8 }, () => cloudW(r() * 960, 40 + r() * 200, .6 + r() * .5, 'bg-drift-w2')).join('')}</g>`;
      s += `<g opacity=".85" filter="url(#${u}w1)">${Array.from({ length: 6 }, () => cloudW(r() * 960, 200 + r() * 180, 1 + r() * .6)).join('')}</g>`;
      s += Array.from({ length: 5 }, (_, i) => cloudW(-40 + i * 250 + r() * 60, 440 + r() * 60, 1.8 + r() * .6, i % 2 ? 'bg-drift-w' : 'bg-drift-w2')).join('');
      s += `<g class="tw">${Array.from({ length: 10 }, () => `<path d="${star(r() * 960, r() * 400, 5, 1, 4)}" fill="#fff"/>`).join('')}</g>`;
      return wide(s);
    },
    /* ================= rodada de 20 cenários ================= */
    /* Sala rosa: parede com galhos pintados, prateleiras, sofá, luminárias pendentes, tapete e piso */
    pinkroom: (c, u) => {
      const r = rng('wpink');
      let s = wdefs(u) + `<defs>${lg(u + 'w', [[0, '#f08a90'], [1, '#e87880']])}${lg(u + 'f', [[0, '#d8a878'], [1, '#e8c098']])}</defs>`;
      s += `<rect x="-60" y="-420" width="1080" height="800" fill="url(#${u}w)"/>` + [[240, 100], [480, 60], [720, 110]].map(([x, y]) => `<g opacity=".8" stroke="#fff" stroke-width="3" fill="none"><path d="M${x} 340 Q${x - 10} ${y + 120} ${x} ${y}"/>${[0, 1, 2, 3].map(i => `<path d="M${x} ${y + 40 + i * 50} q${i % 2 ? 30 : -30} -20 ${i % 2 ? 44 : -44} -10"/><circle cx="${x + (i % 2 ? 44 : -44)}" cy="${y + 30 + i * 50}" r="6" fill="#fff"/>`).join('')}</g>`).join('');
      s += [[120, -40], [480, -30], [840, -40]].map(([x]) => `<path d="M${x} -420 L${x} 20" stroke="#fff" stroke-width="2"/><path d="M${x - 20} 20 L${x + 20} 20 L${x + 12} 44 L${x - 12} 44Z" fill="#fff"/><ellipse cx="${x}" cy="60" rx="40" ry="30" fill="#fff6d0" opacity=".3" filter="url(#${u}w2)" class="bg-glow"/>`).join('');
      s += [[40, 160], [40, 230]].map(([x, y]) => `<rect x="${x}" y="${y}" width="150" height="8" fill="#fff"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${x + 10 + i * 26}" y="${y - 24 + (i % 2) * 6}" width="16" height="${24 - (i % 2) * 6}" fill="${['#ffd23f', '#5ac8a8', '#fff', '#8a5cff', '#ff8ab8'][i]}"/>`).join('')).join('');
      s += `<rect x="-60" y="360" width="1080" height="12" fill="#fff"/><rect x="-60" y="372" width="1080" height="190" fill="url(#${u}f)"/>` + Array.from({ length: 23 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 100 - 480) * .35)} 372 L${-620 + i * 100} 560" stroke="#c8966a" stroke-width="2"/>`).join('');
      s += `<ellipse cx="480" cy="408" rx="300" ry="16" fill="#000" opacity=".12" filter="url(#${u}w1)"/><rect x="240" y="270" width="480" height="70" rx="26" fill="#5ac8c0"/><rect x="220" y="310" width="520" height="70" rx="18" fill="#6ad8d0"/><rect x="220" y="360" width="520" height="30" fill="#48b0a8"/>` + [300, 420, 540].map((x, i) => `<rect x="${x}" y="286" width="90" height="46" rx="14" fill="${['#ffd23f', '#ff8ab8', '#fff'][i]}"/>`).join('') + `<rect x="236" y="390" width="10" height="14" fill="#8a5a3a"/><rect x="714" y="390" width="10" height="14" fill="#8a5a3a"/>`;
      s += `<rect x="780" y="300" width="150" height="80" rx="4" fill="#ffe8a0"/><rect x="790" y="312" width="130" height="26" fill="#f0d070"/><rect x="790" y="344" width="130" height="26" fill="#f0d070"/>` + potPlant(90, 380, 2.2);
      s += `<ellipse cx="480" cy="470" rx="300" ry="40" fill="#e84a5f"/><ellipse cx="480" cy="466" rx="260" ry="32" fill="#ff6a7a"/>` + dust(r, 10, 200, 760, 100, 440) + `<rect x="-60" y="540" width="1080" height="460" fill="#e8c098"/>`;
      return wide(s);
    },
    /* Apartamento com vista: janelão com a cidade desfocada, sofás, tapete e luminária */
    apartment: (c, u) => {
      const r = rng('wapt');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#8ad0f8'], [1, '#e8f6ff']])}</defs><rect x="-60" y="-420" width="1080" height="800" fill="#e8d0a8"/>`;
      s += `<rect x="0" y="-40" width="960" height="340" fill="url(#${u}s)"/><g filter="url(#${u}w1)">${(() => { let o = '', x = 0; while (x < 960) { const w = 40 + r() * 60, h = 120 + r() * 200; o += `<rect x="${f1(x)}" y="${f1(300 - h)}" width="${f1(w)}" height="${f1(h)}" fill="${['#f8b050', '#f0c070', '#e89040', '#ffd080'][Math.floor(r() * 4)]}"/>` + Array.from({ length: 6 }, (_, j) => `<rect x="${f1(x + 8)}" y="${f1(310 - h + j * 26)}" width="${f1(w - 16)}" height="10" fill="#fff" opacity=".35"/>`).join(''); x += w + 6; } return o; })()}</g>`;
      s += [0, 240, 480, 720, 960].map(x => `<rect x="${x - 8}" y="-40" width="16" height="340" fill="#f8b030"/>`).join('') + `<rect x="-60" y="296" width="1080" height="14" fill="#f8b030"/>`;
      s += `<path d="M480 -40 L480 30" stroke="#6a4020" stroke-width="3"/><path d="M430 30 L530 30 L500 70 L460 70Z" fill="#a8743a"/><ellipse cx="480" cy="90" rx="80" ry="30" fill="#fff6d0" opacity=".35" filter="url(#${u}w2)"/>`;
      s += `<rect x="-60" y="310" width="1080" height="250" fill="#c8303a"/><path d="M-60 310 L1020 310" stroke="#8a1e2a" stroke-width="4"/>` + Array.from({ length: 23 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 100 - 480) * .4)} 310 L${-620 + i * 100} 560" stroke="#a82030" stroke-width="2"/>`).join('');
      const sofa = (x, w) => `<ellipse cx="${x + w / 2}" cy="392" rx="${w * .55}" ry="12" fill="#000" opacity=".2" filter="url(#${u}w1)"/><rect x="${x}" y="296" width="${w}" height="56" rx="18" fill="#2a8a9a"/><rect x="${x - 10}" y="334" width="${w + 20}" height="54" rx="14" fill="#3aa8b8"/><rect x="${x - 10}" y="370" width="${w + 20}" height="18" fill="#1e6a78"/>`;
      s += sofa(60, 220) + sofa(620, 280) + `<rect x="320" y="370" width="300" height="80" rx="10" fill="#8a1e2a"/><rect x="370" y="350" width="200" height="16" rx="6" fill="#a8743a"/><rect x="380" y="366" width="8" height="40" fill="#6a4020"/><rect x="552" y="366" width="8" height="40" fill="#6a4020"/>` + potPlant(900, 330, 2.4);
      s += `<rect x="-60" y="540" width="1080" height="460" fill="#c8303a"/>`;
      return wide(s);
    },
    /* Cozinha: armários superiores, coifa, fogão, geladeira, bancada com banquetas e piso */
    kitchen: (c, u) => {
      let s = wdefs(u) + `<rect x="-60" y="-420" width="1080" height="800" fill="#f4ecdc"/>`;
      s += `<rect x="-60" y="-420" width="1080" height="440" fill="#e8dcc4"/>` + [60, 200, 600, 740].map(x => `<rect x="${x}" y="-40" width="130" height="150" rx="4" fill="#f8f0e0" stroke="#d8c8a8" stroke-width="4"/><rect x="${x + 55}" y="80" width="20" height="5" rx="2" fill="#a89878"/>`).join('');
      s += `<path d="M380 -40 L580 -40 L600 110 L360 110Z" fill="#e8e0d0" stroke="#c8b898" stroke-width="4"/><rect x="360" y="104" width="240" height="14" fill="#c8b898"/>`;
      s += `<rect x="-60" y="240" width="1080" height="16" fill="#8a7050"/><rect x="-60" y="256" width="1080" height="110" fill="#f0e4cc"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-40 + i * 160}" y="266" width="140" height="92" rx="4" fill="#f8f0e0" stroke="#d8c8a8" stroke-width="3"/><rect x="${20 + i * 160}" y="276" width="24" height="5" rx="2" fill="#a89878"/>`).join('');
      s += `<rect x="400" y="200" width="160" height="42" rx="4" fill="#3a3a44"/>` + [430, 470, 510].map(x => `<ellipse cx="${x}" cy="210" rx="14" ry="4" fill="#1a1a22"/>`).join('') + `<rect x="410" y="256" width="140" height="100" fill="#3a3a44"/><rect x="424" y="276" width="112" height="60" rx="6" fill="#1a1a22"/><rect x="430" y="282" width="100" height="10" fill="#fff" opacity=".15"/>`;
      s += `<rect x="-40" y="40" width="130" height="330" rx="8" fill="#e8e8f0" stroke="#b8b8c8" stroke-width="4"/><path d="M-40 160 L90 160" stroke="#b8b8c8" stroke-width="4"/><rect x="70" y="80" width="8" height="50" rx="3" fill="#8a8a9a"/><rect x="70" y="200" width="8" height="70" rx="3" fill="#8a8a9a"/>`;
      s += `<rect x="-60" y="366" width="1080" height="200" fill="#e0d4bc"/>` + Array.from({ length: 21 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 110 - 480) * .35)} 366 L${-620 + i * 110} 560" stroke="#c8b898" stroke-width="2"/>`).join('') + [400, 450, 520].map(y => `<path d="M-60 ${y} L1020 ${y}" stroke="#c8b898" stroke-width="2"/>`).join('');
      s += `<g filter="url(#${u}w2)"><rect x="620" y="380" width="360" height="60" rx="6" fill="#f0e4cc"/><rect x="620" y="370" width="360" height="16" fill="#8a7050"/>` + [680, 780, 880].map(x => `<rect x="${x - 24}" y="440" width="48" height="12" rx="4" fill="#3a3a44"/><path d="M${x} 452 L${x} 560" stroke="#8a8a9a" stroke-width="6"/>`).join('') + `</g>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#e0d4bc"/>`);
    },
    /* Biblioteca: estantes de madeira em perspectiva, janela em arco com luz, piso de tábuas e poeira */
    library: (c, u) => {
      const r = rng('wlib');
      let s = wdefs(u) + `<defs>${lg(u + 'f', [[0, '#a8743a'], [1, '#d8a060']])}${lg(u + 'ray', [[0, '#fff6d0', .5], [1, '#fff6d0', 0]])}</defs><rect x="-60" y="-420" width="1080" height="800" fill="#6a4020"/>`;
      const shelf = (x, w, y0, y1) => `<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="#8a5a2a" stroke="#4a2a10" stroke-width="4"/>` + Array.from({ length: Math.floor((y1 - y0 - 20) / 50) }, (_, j) => { const y = y0 + 12 + j * 50; return `<rect x="${x + 6}" y="${y + 38}" width="${w - 12}" height="6" fill="#4a2a10"/>` + Array.from({ length: Math.floor((w - 16) / 12) }, (_, i) => `<rect x="${x + 8 + i * 12}" y="${y + 6 + (i % 3) * 4}" width="10" height="${32 - (i % 3) * 4}" fill="${['#8a1e2a', '#2a5a8a', '#c8a040', '#3a7a4a', '#6a3a8a'][Math.floor(r() * 5)]}"/>`).join(''); }).join('');
      s += `<g filter="url(#${u}w1)">${shelf(260, 440, 40, 330)}</g>`;
      s += `<path d="M420 40 L420 -80 Q480 -130 540 -80 L540 40Z" fill="#fff6d0"/><path d="M480 -118 L480 40 M420 -20 L540 -20" stroke="#6a4020" stroke-width="6"/>` + `<path d="M420 40 L540 40 L700 560 L260 560Z" fill="url(#${u}ray)" class="bg-rays"/>`;
      s += shelf(-40, 260, -60, 350) + shelf(740, 260, -60, 350);
      s += `<rect x="-60" y="346" width="1080" height="220" fill="url(#${u}f)"/>` + Array.from({ length: 23 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 100 - 480) * .3)} 346 L${-620 + i * 100} 560" stroke="#8a5a2a" stroke-width="2.4"/>`).join('');
      s += `<ellipse cx="480" cy="470" rx="220" ry="30" fill="#8a1e2a"/><ellipse cx="480" cy="466" rx="190" ry="24" fill="#a82838"/>` + dust(r, 18, 300, 700, 60, 480);
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#d8a060"/>`);
    },
    /* Muro de grafite: céu noturno, prédios ao fundo, muro com pichação neon, calçada e poste */
    graffiti: (c, u) => {
      const r = rng('wgraf');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#0a0a2a'], [1, '#3a2a6a']])}</defs><rect x="-60" y="-420" width="1080" height="800" fill="url(#${u}s)"/>`;
      for (let i = 0; i < 40; i++) s += `<circle cx="${f1(r() * 960)}" cy="${f1(-100 + r() * 200)}" r="1" fill="#fff" opacity=".6"/>`;
      s += `<g filter="url(#${u}w1)" opacity=".8">${(() => { let o = '', x = -40; while (x < 1000) { const w = 60 + r() * 80, h = 100 + r() * 140; o += `<rect x="${f1(x)}" y="${f1(160 - h)}" width="${f1(w)}" height="${f1(h + 40)}" fill="#1a1a3a"/>`; for (let j = 0; j < 8; j++) if (r() > .4) o += `<rect x="${f1(x + 10 + r() * (w - 20))}" y="${f1(170 - h + r() * h)}" width="6" height="8" fill="#ffd070" opacity=".7"/>`; x += w + 8; } return o; })()}</g>`;
      s += `<rect x="-60" y="130" width="1080" height="250" fill="#2a2a44"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${-60 + i * 50} 130 L${-60 + i * 50} 380" stroke="#1e1e34" stroke-width="3"/>`).join('') + `<rect x="-60" y="126" width="1080" height="10" fill="#3a3a58"/>`;
      s += `<g filter="url(#${u}wg)" class="pulse"><text x="480" y="300" text-anchor="middle" font-size="140" font-weight="700" font-family="'Fredoka',sans-serif" fill="none" stroke="#6ae8ff" stroke-width="6">GRAFFITI</text></g><path d="M120 200 Q180 160 240 210 M700 180 l40 60 l40 -60" stroke="#ff5ad8" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="880" cy="220" r="36" fill="none" stroke="#ffd23f" stroke-width="8"/>`;
      s += `<rect x="-60" y="380" width="1080" height="60" fill="#5a5a70"/><rect x="-60" y="380" width="1080" height="6" fill="#8a8aa0"/><rect x="-60" y="440" width="1080" height="120" fill="#3a3a4a"/><path d="M-60 500 L1020 500" stroke="#f0e070" stroke-width="5" stroke-dasharray="50 30"/>`;
      s += `<path d="M60 380 L60 -60 Q60 -80 90 -80 L130 -80" stroke="#1a1a2a" stroke-width="10" fill="none"/><ellipse cx="140" cy="-70" rx="20" ry="8" fill="#ffd070"/><path d="M120 -70 L60 380 L220 380Z" fill="#ffd070" opacity=".12"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#3a3a4a"/>`);
    },
    /* Metrô: vagão por dentro em perspectiva, janelas com túnel passando, bancos e barras */
    subway: (c, u) => {
      let s = wdefs(u) + `<rect x="-60" y="-420" width="1080" height="800" fill="#dfe6ee"/>`;
      s += `<rect x="-60" y="-420" width="1080" height="440" fill="#c8d0dc"/>` + [120, 480, 840].map(x => `<rect x="${x - 60}" y="0" width="120" height="10" rx="4" fill="#fff"/><rect x="${x - 60}" y="10" width="120" height="30" fill="#fffbe6" opacity=".4" filter="url(#${u}w2)"/>`).join('');
      s += `<path d="M-60 60 L1020 60" stroke="#9aa4b0" stroke-width="6"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${-40 + i * 90} 60 L${-40 + i * 90} 90" stroke="#9aa4b0" stroke-width="3"/><ellipse cx="${-40 + i * 90}" cy="96" rx="8" ry="6" fill="none" stroke="#9aa4b0" stroke-width="3"/>`).join('');
      s += [80, 320, 560, 800].map(x => `<rect x="${x}" y="120" width="160" height="110" rx="10" fill="#2a3a5a"/><g class="bg-streak" style="animation-duration:1.2s">${[0, 1, 2].map(i => `<rect x="${x + 10}" y="${140 + i * 30}" width="140" height="4" fill="#ffd070" opacity=".6"/>`).join('')}</g><rect x="${x}" y="120" width="160" height="110" rx="10" fill="none" stroke="#9aa4b0" stroke-width="6"/>`).join('');
      s += `<rect x="-60" y="256" width="1080" height="16" fill="#4a7ac8"/><rect x="-60" y="272" width="1080" height="70" fill="#3a6ab8"/><rect x="-60" y="336" width="1080" height="14" fill="#2a4a8a"/>` + [100, 400, 700].map(x => `<path d="M${x} 60 L${x} 350" stroke="#c8d0dc" stroke-width="10"/><path d="M${x} 60 L${x} 350" stroke="#fff" stroke-width="3" transform="translate(-2 0)"/>`).join('');
      s += `<rect x="-60" y="350" width="1080" height="210" fill="#b8c0cc"/>` + Array.from({ length: 23 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 100 - 480) * .35)} 350 L${-620 + i * 100} 560" stroke="#a0a8b4" stroke-width="2"/>`).join('') + `<path d="M-60 460 L1020 460" stroke="#ffd23f" stroke-width="8" stroke-dasharray="30 20"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#b8c0cc"/>`);
    },
    /* Terraço da escola: céu com nuvens, grade, prédio da escada, piso de concreto em perspectiva */
    rooftop: (c, u) => {
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#2a8ae0'], [1, '#bfe8ff']])}</defs><rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}s)"/>` + sunW(u, 820, 40, 60);
      s += cloudW(200, 60, 1.4) + cloudW(620, 120, 1, 'bg-drift-w2') + cloudW(900, 180, .8);
      s += `<g filter="url(#${u}w1)" opacity=".7">${[[40, 220, 60, 80], [140, 200, 50, 100], [760, 210, 70, 90], [860, 190, 60, 110]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9ab8d0"/>`).join('')}</g>`;
      s += `<rect x="-60" y="240" width="1080" height="8" fill="#6a7a8a"/>` + Array.from({ length: 44 }, (_, i) => `<path d="M${-60 + i * 25} 248 L${-60 + i * 25} 330" stroke="#6a7a8a" stroke-width="3"/>`).join('') + `<rect x="-60" y="326" width="1080" height="6" fill="#6a7a8a"/>`;
      s += `<rect x="-60" y="60" width="200" height="290" fill="#e8ecf0"/><rect x="140" y="60" width="30" height="290" fill="#c8ccd4"/><rect x="0" y="180" width="80" height="170" fill="#8a9aaa"/><rect x="60" y="260" width="8" height="14" rx="2" fill="#dde"/><rect x="-60" y="52" width="230" height="12" fill="#b8bcc4"/>`;
      s += `<rect x="-60" y="332" width="1080" height="230" fill="#c8ccd0"/>` + Array.from({ length: 21 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 110 - 480) * .3)} 332 L${-620 + i * 110} 560" stroke="#b0b4b8" stroke-width="2"/>`).join('') + [360, 400, 460].map(y => `<path d="M-60 ${y} L1020 ${y}" stroke="#b0b4b8" stroke-width="2"/>`).join('');
      s += `<ellipse cx="300" cy="400" rx="140" ry="16" fill="#6a7a8a" opacity=".25"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#c8ccd0"/>`);
    },
    /* Sala de aula (lousa): lousa verde com contas, mesa do professor, carteiras em primeiro plano desfocadas */
    classroom: (c, u) => {
      let s = wdefs(u) + `<rect x="-60" y="-420" width="1080" height="800" fill="#f0e0c0"/><rect x="-60" y="320" width="1080" height="20" fill="#c8a878"/>`;
      s += `<rect x="60" y="-20" width="840" height="300" rx="6" fill="#7a5030"/><rect x="76" y="-6" width="808" height="272" fill="#2e6a4a"/><path d="M76 -6 L884 -6 L884 266 L800 266 L200 -6Z" fill="#fff" opacity=".04"/>`;
      s += `<g stroke="#eaf6ee" stroke-width="3" fill="none" opacity=".85"><path d="M140 60 L240 60 L140 160Z"/><text x="300" y="80" font-size="30" fill="#eaf6ee" stroke="none" font-family="'Fredoka',sans-serif">a² + b² = c²</text><text x="300" y="140" font-size="26" fill="#eaf6ee" stroke="none" font-family="'Fredoka',sans-serif">sen x = ?</text><circle cx="760" cy="80" r="44"/><path d="M760 36 L760 124 M716 80 L804 80"/><path d="M620 200 L700 170 L780 200" /></g>`;
      s += `<rect x="60" y="278" width="840" height="12" fill="#a87a50"/><rect x="200" y="272" width="30" height="8" rx="2" fill="#fff"/><rect x="240" y="272" width="20" height="8" rx="2" fill="#ffb3c7"/><path d="M620 250 L700 270 L640 280Z" fill="#ffd23f" stroke="#a87a30" stroke-width="3"/>`;
      s += `<rect x="-60" y="340" width="1080" height="220" fill="#d8b888"/>` + Array.from({ length: 23 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 100 - 480) * .3)} 340 L${-620 + i * 100} 560" stroke="#b89868" stroke-width="2"/>`).join('');
      s += `<rect x="360" y="290" width="240" height="18" rx="3" fill="#b8844a"/><rect x="370" y="308" width="220" height="70" fill="#a8743a"/>`;
      s += `<g filter="url(#${u}w2)">${[80, 800].map(x => `<rect x="${x - 70}" y="440" width="140" height="18" rx="3" fill="#c8945a"/><rect x="${x - 60}" y="458" width="10" height="100" fill="#6a6a7a"/><rect x="${x + 50}" y="458" width="10" height="100" fill="#6a6a7a"/>`).join('')}</g>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#d8b888"/>`);
    },
    /* Frente da escola: prédio com janelas azuis, relógio, portão, árvores e calçada */
    schoolfront: (c, u) => {
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#5ab8f0'], [1, '#dff4ff']])}</defs><rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}s)"/>` + cloudW(160, 20, 1) + cloudW(760, 0, .9, 'bg-drift-w2');
      s += `<rect x="60" y="40" width="840" height="300" fill="#f4f0e8"/><rect x="60" y="40" width="840" height="14" fill="#c84a3a"/><rect x="400" y="0" width="160" height="340" fill="#e8e0d0"/><rect x="400" y="-6" width="160" height="14" fill="#c84a3a"/><circle cx="480" cy="50" r="30" fill="#fff" stroke="#6a6a7a" stroke-width="5"/><path d="M480 50 L480 32 M480 50 L494 56" stroke="#2b2140" stroke-width="3" stroke-linecap="round"/>`;
      s += [80, 160, 240, 320, 580, 660, 740, 820].map(x => [80, 170, 260].map(y => `<rect x="${x}" y="${y}" width="60" height="60" fill="#6ab0e0" stroke="#fff" stroke-width="4"/><path d="M${x + 4} ${y + 4} L${x + 30} ${y + 4} L${x + 4} ${y + 40}Z" fill="#fff" opacity=".35"/>`).join('')).join('');
      s += `<rect x="430" y="240" width="100" height="100" fill="#4a6a8a"/><path d="M480 240 L480 340" stroke="#fff" stroke-width="3"/>`;
      s += `<g filter="url(#${u}w1)">${treeR(40, 340, 1.4, '#3a9a48', '#7ad060')}${treeR(920, 340, 1.4, '#3a9a48', '#7ad060')}</g>`;
      s += `<rect x="-60" y="336" width="1080" height="20" fill="#9aa4b0"/>` + Array.from({ length: 44 }, (_, i) => `<path d="M${-60 + i * 25} 356 L${-60 + i * 25} 400" stroke="#6a7480" stroke-width="3"/>`).join('') + `<rect x="-60" y="352" width="1080" height="6" fill="#6a7480"/>`;
      s += `<rect x="-60" y="400" width="1080" height="160" fill="#d8d0c0"/>` + Array.from({ length: 21 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 110 - 480) * .3)} 400 L${-620 + i * 110} 560" stroke="#c0b8a8" stroke-width="2"/>`).join('') + bush(120, 420, 30, '#3a9a48', '#7ad060') + bush(840, 420, 30, '#3a9a48', '#7ad060');
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#d8d0c0"/>`);
    },
    /* Estrada na montanha: montanhas nevadas em planos, pinheiros, campo e estrada com faixas */
    mountainroad: (c, u) => {
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#5ab0e8'], [1, '#dff4ff']])}</defs><rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}s)"/>` + cloudW(700, 30, 1.2);
      const peak = (x, y, w, h, col, snow) => `<path d="M${x - w} ${y} L${x} ${y - h} L${x + w} ${y}Z" fill="${col}"/><path d="M${x} ${y - h} L${x + w * .3} ${y - h * .65} L${x + w * .1} ${y - h * .7} L${x - w * .1} ${y - h * .6} L${x - w * .3} ${y - h * .68}Z" fill="${snow}"/><path d="M${x} ${y - h} L${x + w} ${y} L${x + w * .2} ${y}Z" fill="#000" opacity=".15"/>`;
      s += `<g opacity=".75" filter="url(#${u}w1)">${peak(160, 260, 200, 240, '#8aa8c8', '#fff')}${peak(520, 260, 240, 280, '#8aa8c8', '#fff')}${peak(860, 260, 200, 220, '#8aa8c8', '#fff')}</g>` + haze(u, 200, 80);
      s += peak(300, 290, 180, 200, '#6a8ab0', '#f4f8ff') + peak(740, 290, 200, 230, '#6a8ab0', '#f4f8ff');
      s += `<g filter="url(#${u}w2)" opacity=".9">${Array.from({ length: 16 }, (_, i) => pineW(i * 64 - 20, 300, 80 + (i % 3) * 20, '#2a6a4a', '#1a4a30')).join('')}</g>`;
      s += `<path d="M-60 290 Q480 270 1020 290 L1020 560 L-60 560Z" fill="#8ad060"/><path d="M-60 290 Q480 270 1020 290" stroke="#c0f080" stroke-width="4" fill="none"/>`;
      s += `<path d="M-60 420 Q480 380 1020 420 L1020 520 Q480 490 -60 520Z" fill="#6a6a78"/><path d="M-60 470 Q480 436 1020 470" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="40 30"/><path d="M-60 520 Q480 490 1020 520 L1020 560 L-60 560Z" fill="#6ac048"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#6ac048"/>`);
    },
    /* Floresta encantada: troncos escuros em 3 planos, névoa verde, cogumelos brilhando e vaga-lumes */
    darkforest: (c, u) => {
      const r = rng('wdf');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#051a10'], [1, '#1a4a2a']])}</defs><rect x="-60" y="-420" width="1080" height="980" fill="url(#${u}s)"/>`;
      const trunks = (n, y, w, col, blur) => `<g ${blur ? `filter="url(#${u}${blur})"` : ''}>${Array.from({ length: n }, () => { const x = r() * 1000 - 20; return `<path d="M${f1(x)} ${y} Q${f1(x + 10)} -100 ${f1(x - 6)} -420 L${f1(x + w)} -420 Q${f1(x + w + 14)} -100 ${f1(x + w)} ${y}Z" fill="${col}"/>`; }).join('')}</g>`;
      s += trunks(14, 340, 30, '#123a22', 'w2') + haze(u, 180, 160, '#6aff9a');
      s += trunks(8, 380, 50, '#0a2a16', 'w1');
      s += `<path d="M-60 360 Q480 330 1020 360 L1020 560 L-60 560Z" fill="#0e2a18"/>` + Array.from({ length: 30 }, () => `<ellipse cx="${f1(r() * 960)}" cy="${f1(370 + r() * 160)}" rx="${f1(10 + r() * 30)}" ry="${f1(4 + r() * 8)}" fill="#1e5a30"/>`).join('');
      s += [[160, 420], [320, 460], [700, 440], [820, 480]].map(([x, y]) => `<ellipse cx="${x}" cy="${y - 10}" rx="30" ry="20" fill="#6affc8" opacity=".3" filter="url(#${u}w3)" class="bg-glow"/><rect x="${x - 4}" y="${y - 14}" width="8" height="16" fill="#dff"/><path d="M${x - 16} ${y - 12} Q${x} ${y - 32} ${x + 16} ${y - 12}Z" fill="#3affb0"/>`).join('');
      s += trunks(3, 560, 90, '#051a0c');
      for (let i = 0; i < 26; i++) s += `<circle class="w-wander" style="animation-delay:-${f1(r() * 5)}s;animation-duration:${f1(4 + r() * 4)}s" cx="${f1(r() * 960)}" cy="${f1(r() * 480)}" r="${f1(2 + r() * 3)}" fill="#eaff80" filter="url(#${u}wg)"/>`;
      return wide(s);
    },
    /* Ilha tropical: sol, céu claro, mar com ondas, ilha de areia com coqueiros */
    island: (c, u) => {
      const r = rng('wisl');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#8ad8f8'], [1, '#e8f8ff']])}${lg(u + 'sea', [[0, '#3ac8e8'], [1, '#1a8ac8']])}</defs><rect x="-60" y="-420" width="1080" height="700" fill="url(#${u}s)"/>` + sunW(u, 480, 0, 50, '#fff0a0') + cloudW(160, 60, .8) + cloudW(800, 40, 1, 'bg-drift-w2');
      s += `<rect x="-60" y="220" width="1080" height="340" fill="url(#${u}sea)"/><g class="bg-shimmer">${Array.from({ length: 24 }, () => `<rect x="${f1(r() * 960)}" y="${f1(230 + r() * 300)}" width="${f1(20 + r() * 40)}" height="3" rx="1.5" fill="#fff" opacity=".6"/>`).join('')}</g>`;
      s += `<ellipse cx="480" cy="340" rx="420" ry="60" fill="#7ae8f0" opacity=".6"/><ellipse cx="480" cy="330" rx="380" ry="46" fill="#f4e0a8"/><ellipse cx="480" cy="322" rx="340" ry="32" fill="#fff0c0"/>`;
      const palm = (x, y, sc, fl) => { const leaf = (ang, l) => { const rr = ang * Math.PI / 180, ex = Math.cos(rr) * l, ey = Math.sin(rr) * l * .5 + l * .25, mx = ex * .5, my = ey * .5 - l * .25; let o = `<path d="M0 0 Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="#2a8a3a" stroke-width="5" fill="none"/>`;
        for (let t = .15; t < 1; t += .1) { const px = 2 * (1 - t) * t * mx + t * t * ex, py = 2 * (1 - t) * t * my + t * t * ey, ln = 22 * (1 - t * .6); o += `<path d="M${f1(px)} ${f1(py)} l${f1(-ln * .3)} ${f1(ln)} M${f1(px)} ${f1(py)} l${f1(ln * .35)} ${f1(ln * .9)}" stroke="${t > .5 ? '#4ab84a' : '#2f9a3a'}" stroke-width="6" stroke-linecap="round"/>`; } return o; };
        return `<g transform="translate(${x} ${y}) scale(${sc * fl} ${sc})"><path d="M0 0 Q-10 -80 20 -160" stroke="#8a5a2a" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M0 0 Q-10 -80 20 -160" stroke="#b8844a" stroke-width="4" fill="none" transform="translate(-4 0)"/><g transform="translate(20 -160)">${[200, 235, 270, 305, 340, 160].map(a => leaf(a, 90)).join('')}<circle cx="-4" cy="6" r="7" fill="#6a4226"/><circle cx="6" cy="8" r="7" fill="#6a4226"/></g></g>`; };
      s += `<g class="bg-plant" style="animation-duration:6s">${palm(260, 320, 1, 1)}${palm(700, 320, 1.1, -1)}</g>`;
      s += `<g class="bg-wave">${[380, 430, 490].map((y, i) => `<path d="M-80 ${y} q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#fff" stroke-width="3" fill="none" opacity="${.6 - i * .15}"/>`).join('')}</g>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#1a8ac8"/>`);
    },
    /* Iglu: céu e montanhas de gelo, iglu com blocos, neve caindo e montinhos de neve */
    igloo: (c, u) => {
      const r = rng('wigl');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#3ac0d8'], [1, '#bff0f8']])}</defs><rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}s)"/>`;
      s += `<g opacity=".7" filter="url(#${u}w1)">${ridgeW([[-60, 250], [120, 150], [260, 230], [420, 140], [600, 240], [760, 160], [1020, 230]], '#dff6fb')}</g>`;
      s += `<path d="M-60 300 Q480 250 1020 300 L1020 560 L-60 560Z" fill="#f4fbff"/><path d="M480 290 Q480 250 1020 300 L1020 380 Q700 330 480 330Z" fill="#c8e8f4" opacity=".6"/>`;
      s += `<path d="M300 400 A180 170 0 0 1 660 400Z" fill="#e8f6fb" stroke="#9ac8dc" stroke-width="4"/>` + [340, 300, 260].map((y, i) => `<path d="M${320 + i * 30} ${y} L${640 - i * 30} ${y}" stroke="#9ac8dc" stroke-width="3"/>`).join('') + Array.from({ length: 12 }, (_, i) => `<path d="M${330 + i * 28} ${400 - (i % 2) * 30} l0 -30" stroke="#9ac8dc" stroke-width="3"/>`).join('') + `<path d="M430 400 L430 340 A50 50 0 0 1 530 340 L530 400Z" fill="#2a6a8a"/><path d="M430 400 L430 340 A50 50 0 0 1 530 340" fill="none" stroke="#9ac8dc" stroke-width="6"/>`;
      s += `<path d="M300 400 A180 170 0 0 1 480 230 L480 400Z" fill="#fff" opacity=".35"/>`;
      s += [[120, 470, 90], [820, 470, 100], [480, 510, 140]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="24" fill="#fff"/><ellipse cx="${x + 10}" cy="${y + 6}" rx="${w * .9}" ry="18" fill="#d8eef6"/>`).join('');
      for (let i = 0; i < 50; i++) s += `<g class="w-fall-sway" style="animation-duration:${f1(6 + r() * 6)}s;animation-delay:-${f1(r() * 10)}s"><circle cx="${f1(r() * 960)}" cy="-10" r="${f1(2 + r() * 3)}" fill="#fff"/></g>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#f4fbff"/>`);
    },
    /* Natal: sala com árvore iluminada, meias na janela, sofá, presentes e piso */
    christmas: (c, u) => {
      let s = wdefs(u) + `<rect x="-60" y="-420" width="1080" height="800" fill="#f4ead8"/><rect x="-60" y="340" width="1080" height="14" fill="#c8a878"/>`;
      s += `<rect x="200" y="-40" width="360" height="180" fill="#2a3a6a"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${210 + i * 26}" cy="${-20 + (i % 3) * 50}" r="2" fill="#fff"/>`).join('') + `<rect x="200" y="-40" width="360" height="180" fill="none" stroke="#6a4020" stroke-width="10"/><path d="M380 -40 L380 140" stroke="#6a4020" stroke-width="8"/>` + [240, 320, 440, 520].map((x, i) => `<path d="M${x} 140 L${x} 160 L${x + 20} 160 L${x + 26} 184 L${x - 2} 184Z" fill="${['#e84a5f', '#3a9a48', '#e84a5f', '#3a9a48'][i]}"/><rect x="${x - 4}" y="138" width="28" height="8" fill="#fff"/>`).join('');
      s += `<rect x="-60" y="354" width="1080" height="210" fill="#a8743a"/>` + Array.from({ length: 21 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 110 - 480) * .3)} 354 L${-620 + i * 110} 560" stroke="#8a5a2a" stroke-width="2"/>`).join('');
      s += `<ellipse cx="300" cy="400" rx="220" ry="14" fill="#000" opacity=".15"/><rect x="100" y="260" width="400" height="70" rx="20" fill="#6a6a78"/><rect x="80" y="300" width="440" height="80" rx="16" fill="#7a7a88"/><rect x="80" y="360" width="440" height="20" fill="#5a5a68"/>`;
      const tr = 780;
      s += `<rect x="${tr - 16}" y="336" width="32" height="50" fill="#6a4020"/>` + [0, 1, 2].map(i => `<path d="M${tr} ${40 + i * 80} L${tr - 90 - i * 30} ${180 + i * 80} L${tr + 90 + i * 30} ${180 + i * 80}Z" fill="#2a8a3a"/><path d="M${tr} ${40 + i * 80} L${tr + 90 + i * 30} ${180 + i * 80} L${tr} ${180 + i * 80}Z" fill="#1a6a2a"/>`).reverse().join('');
      s += Array.from({ length: 22 }, (_, i) => { const t = i / 21, y = 70 + t * 260, half = 20 + t * 130, x = tr + Math.sin(i * 2.1) * half * .8; return `<circle class="tw" style="animation-delay:-${(i * .3).toFixed(1)}s" cx="${x}" cy="${y}" r="6" fill="${['#ffd23f', '#e84a5f', '#5ac8ff'][i % 3]}" filter="url(#${u}wg)"/>`; }).join('') + `<path d="${star(tr, 34, 26, 11)}" fill="#ffd23f" filter="url(#${u}wg)"/>`;
      s += [[680, 380, '#e84a5f'], [730, 390, '#3a8ae0'], [870, 384, '#ffd23f']].map(([x, y, col]) => `<rect x="${x - 26}" y="${y - 30}" width="52" height="40" fill="${col}" stroke="#2b2140" stroke-width="3"/><rect x="${x - 4}" y="${y - 30}" width="8" height="40" fill="#fff"/><path d="M${x} ${y - 30} l-12 -10 l0 10 M${x} ${y - 30} l12 -10 l0 10" stroke="#fff" stroke-width="3" fill="none"/>`).join('');
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#a8743a"/>`);
    },
    /* Planeta alienígena: céu roxo com planetas, crateras em planos e meteoros */
    alien: (c, u) => {
      const r = rng('walien');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#1a0a3a'], [1, '#6a2a8a']])}<radialGradient id="${u}pl" cx=".35" cy=".3"><stop offset="0" stop-color="#ff9ae0"/><stop offset="1" stop-color="#8a2a8a"/></radialGradient></defs><rect x="-60" y="-420" width="1080" height="800" fill="url(#${u}s)"/>`;
      for (let i = 0; i < 90; i++) s += `<circle cx="${f1(r() * 960)}" cy="${f1(-200 + r() * 460)}" r="${f1(.6 + r() * 1.6)}" fill="#fff" ${i % 5 ? '' : 'class="tw"'}/>`;
      s += `<circle cx="760" cy="80" r="90" fill="url(#${u}pl)"/><path d="M680 60 Q760 30 840 70" stroke="#ffc8f0" stroke-width="6" fill="none" opacity=".6"/><circle cx="160" cy="40" r="30" fill="#8a6ad8"/>`;
      s += `<defs><linearGradient id="${u}mt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>` + [0, 1, 2].map(i => `<path class="w-meteor" style="animation-duration:${4 + i}s;animation-delay:-${i * 1.6}s" d="M${700 - i * 200} ${20 + i * 40} l140 -70" stroke="url(#${u}mt)" stroke-width="4" stroke-linecap="round"/>`).join('');
      s += `<g opacity=".7" filter="url(#${u}w1)">${ridgeW([[-60, 330], [160, 290], [360, 320], [560, 280], [800, 320], [1020, 300]], '#8a3a5a')}</g>`;
      s += `<path d="M-60 380 Q480 330 1020 380 L1020 560 L-60 560Z" fill="#e8703a"/><path d="M-60 380 Q480 330 1020 380" stroke="#ffb070" stroke-width="5" fill="none"/>` + [[160, 430, 70], [520, 480, 100], [840, 440, 60], [340, 400, 40]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .28}" fill="#b04a2a"/><ellipse cx="${x}" cy="${y - 4}" rx="${w * .8}" ry="${w * .2}" fill="#8a3018"/><path d="M${x - w} ${y} Q${x} ${y - w * .4} ${x + w} ${y}" stroke="#ffa060" stroke-width="3" fill="none"/>`).join('');
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#e8703a"/>`);
    },
    /* Pirâmides: céu, dunas em planos, pirâmides com face iluminada e sombreada, sol forte */
    pyramids: (c, u) => {
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#5ab8f0'], [1, '#e8f6ff']])}</defs><rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}s)"/>` + sunW(u, 180, 30, 60, '#fff4b0') + cloudW(540, 40, .8) + cloudW(860, 90, .6, 'bg-drift-w2');
      const pyr = (x, y, w, h, blur) => `<g ${blur ? `filter="url(#${u}${blur})" opacity=".8"` : ''}><path d="M${x - w} ${y} L${x} ${y - h} L${x + w} ${y}Z" fill="#f0c070"/><path d="M${x} ${y - h} L${x + w} ${y} L${x + w * .15} ${y}Z" fill="#c8904a"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${x - w + (w * i / 6)} ${y - h * i / 6} L${x + w * .15 - w * .15 * i / 6} ${y - h * i / 6}" stroke="#d8a060" stroke-width="2"/>`).join('')}</g>`;
      s += pyr(820, 290, 120, 140, 'w1') + pyr(560, 300, 200, 240) + pyr(820, 320, 150, 170);
      s += haze(u, 250, 80, '#fff0c0');
      s += `<path d="M-60 300 Q300 270 600 300 Q800 320 1020 290 L1020 560 L-60 560Z" fill="#f4d890"/><path d="M-60 380 Q400 340 800 390 Q920 400 1020 380 L1020 560 L-60 560Z" fill="#ecc878"/><path d="M-60 460 Q300 430 700 470 L1020 450 L1020 560 L-60 560Z" fill="#e0b860"/>`;
      s += `<g class="bg-shimmer" opacity=".25"><rect x="-60" y="290" width="1080" height="16" fill="#fff4d0" filter="url(#${u}w2)"/></g>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#e0b860"/>`);
    },
    /* Salão do castelo: janelões em arco, armaduras, brasão, trono e tapete vermelho em perspectiva */
    throneroom: (c, u) => {
      let s = wdefs(u) + `<rect x="-60" y="-420" width="1080" height="800" fill="#d88a6a"/><rect x="-60" y="-420" width="1080" height="440" fill="#c87858"/>`;
      s += [160, 800].map(x => `<path d="M${x - 70} 260 L${x - 70} 30 Q${x} -50 ${x + 70} 30 L${x + 70} 260Z" fill="#fff6e0"/><path d="M${x} -20 L${x} 260 M${x - 70} 130 L${x + 70} 130" stroke="#8a4a3a" stroke-width="8"/><path d="M${x - 70} 260 L${x + 70} 260 L${x + 160} 560 L${x - 160} 560Z" fill="#fff6e0" opacity=".2"/>`).join('');
      s += `<path d="M430 -20 L530 -20 L530 60 L480 90 L430 60Z" fill="#8a1e2a" stroke="#ffd23f" stroke-width="5"/><path d="M455 0 L505 50 M505 0 L455 50" stroke="#ffd23f" stroke-width="5"/>`;
      s += [340, 620].map(x => `<ellipse cx="${x}" cy="330" rx="40" ry="8" fill="#000" opacity=".2"/><circle cx="${x}" cy="150" r="22" fill="#c8ccd8" stroke="#6a6a7a" stroke-width="3"/><rect x="${x - 12}" y="146" width="24" height="5" fill="#2b2140"/><path d="M${x - 30} 176 L${x + 30} 176 L${x + 24} 260 L${x - 24} 260Z" fill="#c8ccd8" stroke="#6a6a7a" stroke-width="3"/><path d="M${x - 24} 260 L${x - 20} 330 M${x + 24} 260 L${x + 20} 330" stroke="#9aa0b0" stroke-width="12"/><path d="M${x + 36} 120 L${x + 36} 330" stroke="#8a8a9a" stroke-width="4"/>`).join('');
      s += `<rect x="440" y="170" width="80" height="120" rx="10" fill="#e84a5f" stroke="#ffd23f" stroke-width="5"/><path d="M430 170 L480 130 L530 170" fill="#ffd23f"/><rect x="430" y="280" width="100" height="50" rx="6" fill="#c8303a" stroke="#ffd23f" stroke-width="4"/>`;
      s += `<rect x="-60" y="330" width="1080" height="230" fill="#e8dcd0"/>` + Array.from({ length: 21 }, (_, i) => `<path d="M${f1(480 + (-620 + i * 110 - 480) * .3)} 330 L${-620 + i * 110} 560" stroke="#c8bcb0" stroke-width="2"/>`).join('') + `<path d="M430 330 L530 330 L620 560 L340 560Z" fill="#c8303a"/><path d="M430 330 L440 330 L360 560 L340 560Z M530 330 L520 330 L600 560 L620 560Z" fill="#ffd23f"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#e8dcd0"/>`);
    },
    /* Campo de futebol: arquibancada desfocada, gol com rede, gramado listrado em perspectiva */
    soccer: (c, u) => {
      const r = rng('wsoc');
      let s = wdefs(u) + `<defs>${lg(u + 's', [[0, '#5ab8f0'], [1, '#e0f4ff']])}</defs><rect x="-60" y="-420" width="1080" height="760" fill="url(#${u}s)"/>` + cloudW(200, 10, 1) + cloudW(760, 40, .8, 'bg-drift-w2');
      s += `<g filter="url(#${u}w1)"><rect x="-60" y="120" width="1080" height="130" fill="#4a5a7a"/>${Array.from({ length: 160 }, () => `<circle cx="${f1(r() * 1080 - 60)}" cy="${f1(130 + r() * 110)}" r="5" fill="${['#e84a5f', '#ffd23f', '#5ac8ff', '#fff'][Math.floor(r() * 4)]}"/>`).join('')}</g>`;
      s += `<rect x="-60" y="246" width="1080" height="10" fill="#2a3a5a"/><path d="M-60 256 L1020 256 L1400 560 L-440 560Z" fill="#4aa848"/>` + Array.from({ length: 21 }, (_, i) => `<path d="M${f1(480 + (-675 + i * 110 - 480) * .35)} 256 L${f1(480 + (-565 + i * 110 - 480) * .35)} 256 L${-565 + i * 110} 560 L${-675 + i * 110} 560Z" fill="${i % 2 ? '#5ac058' : '#4aa848'}"/>`).join('');
      s += `<path d="M-60 300 L1020 300" stroke="#fff" stroke-width="4"/><ellipse cx="480" cy="480" rx="180" ry="40" fill="none" stroke="#fff" stroke-width="4"/>`;
      s += `<g><path d="M340 300 L340 160 L620 160 L620 300" stroke="#fff" stroke-width="8" fill="none"/><path d="M340 160 L370 140 L590 140 L620 160 M370 140 L370 280 M590 140 L590 280" stroke="#e0e8f0" stroke-width="4" fill="none"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${350 + i * 19} 160 L${370 + i * 16} 290" stroke="#fff" stroke-width="1.2" opacity=".6"/>`).join('')}${Array.from({ length: 7 }, (_, i) => `<path d="M340 ${170 + i * 18} L620 ${170 + i * 18}" stroke="#fff" stroke-width="1.2" opacity=".6"/>`).join('')}</g>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#4aa848"/>`);
    },
    /* Estúdio de foto: fundo infinito branco, holofotes com feixes, tripé e cabos */
    photostudio: (c, u) => {
      let s = wdefs(u) + `<defs>${lg(u + 'b', [[0, '#d8dce4'], [.6, '#f4f6fa'], [1, '#e0e4ea']])}${lg(u + 'beam', [[0, '#fff', .5], [1, '#fff', 0]])}</defs><rect x="-60" y="-420" width="1080" height="1000" fill="#3a3a44"/>`;
      s += Array.from({ length: 20 }, (_, i) => `<rect x="${-60 + i * 56}" y="-420" width="54" height="800" fill="#44444e"/>`).join('');
      s += `<path d="M160 -40 L800 -40 L800 340 Q800 420 900 440 L60 440 Q160 420 160 340Z" fill="url(#${u}b)"/><path d="M160 340 Q160 420 60 440 L900 440 Q800 420 800 340" fill="#fff" opacity=".4"/>`;
      s += [[180, -20, 30], [480, -40, 0], [780, -20, -30]].map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y} L${x - 110} 560 L${x + 110} 560Z" fill="url(#${u}beam)" class="bg-rays"/></g><rect x="${x - 26}" y="${y - 30}" width="52" height="30" rx="4" fill="#2a2a34" transform="rotate(${a} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="22" ry="6" fill="#fffbe0" transform="rotate(${a} ${x} ${y})"/>`).join('');
      s += `<rect x="-60" y="440" width="1080" height="120" fill="#2a2a34"/><g filter="url(#${u}w2)"><path d="M900 560 L940 380 L980 560 M940 380 L940 300" stroke="#1a1a22" stroke-width="8" fill="none"/><rect x="908" y="270" width="64" height="40" rx="6" fill="#1a1a22"/><circle cx="940" cy="290" r="12" fill="#6a8ab8"/></g><path d="M40 560 Q120 480 60 440" stroke="#1a1a22" stroke-width="5" fill="none"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#2a2a34"/>`);
    },
    /* Teatro: plateia desfocada com poltronas vermelhas, camarotes dourados, luz dos holofotes e palco de madeira */
    theater: (c, u) => {
      const r = rng('wthe');
      let s = wdefs(u) + `<defs>${lg(u + 'p', [[0, '#a8743a'], [1, '#6a4020']])}${lg(u + 'beam', [[0, '#fff0c0', .45], [1, '#fff0c0', 0]])}</defs><rect x="-60" y="-420" width="1080" height="800" fill="#3a1010"/>`;
      s += `<g filter="url(#${u}w2)">${Array.from({ length: 3 }, (_, j) => Array.from({ length: 16 }, (_, i) => `<rect x="${-40 + i * 66}" y="${-30 + j * 50}" width="56" height="34" rx="6" fill="#c8a040"/><rect x="${-36 + i * 66}" y="${-26 + j * 50}" width="48" height="24" fill="#6a1a1a"/><circle cx="${-12 + i * 66}" cy="${-34 + j * 50}" r="4" fill="#ffe070"/>`).join('')).join('')}</g>`;
      s += `<g filter="url(#${u}w1)">${Array.from({ length: 5 }, (_, j) => Array.from({ length: 22 }, (_, i) => `<path d="M${-60 + i * 50 + j * 6} ${150 + j * 40} q20 -24 40 0 l0 20 l-40 0Z" fill="#a81e2a"/>`).join('')).join('')}</g>`;
      s += [200, 480, 760].map(x => `<path d="M${x} -40 L${x - 90} 460 L${x + 90} 460Z" fill="url(#${u}beam)" class="bg-rays"/>`).join('');
      s += `<rect x="-60" y="340" width="1080" height="24" fill="#2a1a0a"/><rect x="-60" y="364" width="1080" height="200" fill="url(#${u}p)"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${-60 + i * 50} 364 L${-80 + i * 52} 560" stroke="#5a3418" stroke-width="2"/>`).join('') + `<rect x="-60" y="360" width="1080" height="6" fill="#ffd070" opacity=".6"/>`;
      s += `<ellipse cx="480" cy="440" rx="200" ry="30" fill="#fff0c0" opacity=".25" filter="url(#${u}w2)"/>`;
      return wide(s + `<rect x="-60" y="540" width="1080" height="460" fill="#6a4020"/>`);
    },

  };

  /* Clima: partículas animadas (ou estáticas, para exportar imagem) */

  /* Fundos gerados (usam a cor escolhida) */
  const GEN = {
    solid: (c) => `<rect width="300" height="400" fill="${c}"/>`,
    /* Palco do clube em planos: cidade distante desfocada, halo de luz, anel de barras com brilho,
       prédios próximos, piso que reflete a luz e luzes desfocadas na frente (profundidade de campo). */
    club: (c, u) => {
      const r = rng('club');
      let s = sky(u, ['#0a0620', '#24124f', '#3b1c6e', '#140a30']);
      s += `<defs>
        <filter id="${u}b1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter>
        <filter id="${u}b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter>
        <filter id="${u}b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="${u}gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="${u}cg"><stop offset="0" stop-color="${shade(c, 35)}" stop-opacity=".75"/><stop offset=".35" stop-color="${c}" stop-opacity=".4"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
        <linearGradient id="${u}fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1660"/><stop offset=".25" stop-color="#170c38"/><stop offset="1" stop-color="#07041a"/></linearGradient>
        <linearGradient id="${u}hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset=".5" stop-color="${shade(c, 30)}" stop-opacity=".45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>
      </defs>`;
      /* estrelas bem ao fundo */
      for (let i = 0; i < 40; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 190).toFixed(0)}" r="${(r() * .9 + .3).toFixed(1)}" fill="#fff" opacity="${(.25 + r() * .4).toFixed(2)}"/>`;
      /* cidade distante: azulada e desfocada */
      let far = '';
      for (let x = -20; x < 320; x += 14 + r() * 16) {
        const w = 12 + r() * 20, h = 50 + r() * 110, y = 262 - h;
        far += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#3a2f8a"/>`;
        for (let wy = y + 8; wy < 256; wy += 11) if (r() > .55) far += `<rect x="${(x + 3 + r() * (w - 8)).toFixed(0)}" y="${wy.toFixed(0)}" width="3" height="4" fill="${r() > .6 ? '#ff9df2' : '#9fd8ff'}" opacity=".7"/>`;
      }
      s += `<g filter="url(#${u}b1)" opacity=".55">${far}</g>`;
      /* halo de luz atrás do personagem */
      s += `<ellipse cx="150" cy="215" rx="200" ry="175" fill="url(#${u}cg)"/>`;
      /* anel de barras: brilho próprio, mais forte perto do centro */
      let bars = '';
      for (let i = 0; i < 64; i++) {
        const a = i / 64 * 360, h = 14 + r() * 34;
        bars += `<rect x="-3" y="${(-78 - h).toFixed(0)}" width="6" height="${h.toFixed(0)}" rx="3" fill="${i % 3 ? '#c4b5ff' : '#ff9df2'}" opacity="${(.45 + r() * .35).toFixed(2)}" transform="translate(150 210) rotate(${a.toFixed(1)})"/>`;
      }
      s += `<g filter="url(#${u}gl)">${bars}</g>`;
      /* névoa luminosa no horizonte */
      s += `<rect y="222" width="300" height="70" fill="url(#${u}hz)"/>`;
      /* prédios próximos: escuros, com borda iluminada pelo palco */
      let near = '';
      for (let x = -10; x < 300; x += 26 + r() * 20) {
        const w = 18 + r() * 14, h = 22 + r() * 62, y = 264 - h;
        near += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#1a0f3d"/>` +
          `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="2" fill="${shade(c, 40)}" opacity=".55"/>` +
          `<rect x="${(x + w / 2 > 150 ? x : x + w - 2).toFixed(0)}" y="${y.toFixed(0)}" width="2" height="${h.toFixed(0)}" fill="${c}" opacity=".35"/>`;
        for (let wy = y + 8; wy < 258; wy += 12) for (let wx = x + 4; wx < x + w - 4; wx += 7) if (r() > .72) near += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="3" height="5" fill="${r() > .5 ? '#ffd6fb' : '#b8e4ff'}" opacity="${(.5 + r() * .5).toFixed(2)}"/>`;
      }
      s += `<g filter="url(#${u}b2)">${near}</g>`;
      /* piso refletivo: reflexo do halo, linhas em perspectiva e holofote */
      s += `<rect y="262" width="300" height="138" fill="url(#${u}fl)"/>`;
      s += `<ellipse cx="150" cy="272" rx="170" ry="20" fill="${c}" opacity=".4" filter="url(#${u}b3)"/>`;
      s += [-180, -90, 0, 90, 180, 270, 360, 450].map(x => `<path d="M150 262 L${x} 400" stroke="${shade(c, 30)}" stroke-opacity=".12"/>`).join('');
      s += [270, 284, 310, 350].map((y, i) => `<path d="M0 ${y} L300 ${y}" stroke="${shade(c, 30)}" stroke-opacity="${(.16 - i * .03).toFixed(2)}"/>`).join('');
      s += `<ellipse cx="150" cy="270" rx="90" ry="12" fill="${shade(c, 45)}" opacity=".32" filter="url(#${u}b2)"/><ellipse cx="150" cy="270" rx="56" ry="6" fill="#fff" opacity=".14"/>`;
      /* luzes desfocadas na frente */
      let bok = '';
      for (let i = 0; i < 18; i++) {
        const x = r() * 300, y = 110 + r() * 190, rad = 5 + r() * 14;
        bok += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(1)}" fill="${['#ff9df2', '#9fd8ff', '#c4b5ff', '#ffe29a'][i % 4]}" opacity="${(.12 + r() * .16).toFixed(2)}"/>`;
      }
      s += `<g filter="url(#${u}b1)">${bok}</g>`;
      return s;
    },
    gradient: (c, u) => { const r = rng('gs'); let s = sky(u, [shade(c, 30), c, shade(c, -45)]); for (let i = 0; i < 40; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 400).toFixed(0)}" r="${(r() * 1.4 + .4).toFixed(1)}" fill="#fff" opacity=".7"/>`; return s; },
    spiral: (c) => `<rect width="300" height="400" fill="${shade(c, -35)}"/>` + Array.from({ length: 18 }, (_, i) => `<path d="M150 200 L${(150 + 400 * Math.cos(i / 9 * Math.PI)).toFixed(0)} ${(200 + 400 * Math.sin(i / 9 * Math.PI)).toFixed(0)} L${(150 + 400 * Math.cos((i + .5) / 9 * Math.PI)).toFixed(0)} ${(200 + 400 * Math.sin((i + .5) / 9 * Math.PI)).toFixed(0)}Z" fill="${c}" opacity=".55"/>`).join('') + `<circle cx="150" cy="200" r="30" fill="${shade(c, 30)}"/>`,
    rings: (c) => `<rect width="300" height="400" fill="${shade(c, -40)}"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="150" cy="200" r="${(12 - i) * 26}" fill="${i % 2 ? c : shade(c, -20)}"/>`).join(''),
    dots: (c) => { let s = `<rect width="300" height="400" fill="${c}"/>`; for (let y = 10; y < 410; y += 26) for (let x = (y / 26) % 2 ? 0 : 13; x < 310; x += 26) s += `<circle cx="${x}" cy="${y}" r="6" fill="#fff" opacity=".35"/>`; return s; },
    checker: (c) => { let s = `<rect width="300" height="400" fill="${c}"/>`; for (let y = 0; y < 400; y += 30) for (let x = ((y / 30) % 2) * 30; x < 300; x += 60) s += `<rect x="${x}" y="${y}" width="30" height="30" fill="${shade(c, -18)}"/>`; return s; },
    stripes: (c) => { let s = `<rect width="300" height="400" fill="${c}"/>`; for (let x = -400; x < 300; x += 36) s += `<path d="M${x} 400 L${x + 400} 0 L${x + 418} 0 L${x + 18} 400Z" fill="#fff" opacity=".18"/>`; return s; },
  };


  const BG_LIST = [
    { n: 'Cor sólida', g: 'solid' }, { n: 'Palco do clube', g: 'club' }, { n: 'Degradê estelar', g: 'gradient' }, { n: 'Espiral', g: 'spiral' },
    { n: 'Anéis', g: 'rings' }, { n: 'Bolinhas', g: 'dots' }, { n: 'Xadrez', g: 'checker' }, { n: 'Listras', g: 'stripes' },
    { n: 'Quarto', w: 'bedroom' }, { n: 'Parque', w: 'park' }, { n: 'Campo', w: 'meadow' }, { n: 'Praia', w: 'beach' },
    { n: 'Portal estelar', w: 'portal' }, { n: 'Brinquedoteca', w: 'playroom' }, { n: 'Noite assombrada', w: 'haunted' }, { n: 'Rua da cidade', w: 'street' },
    { n: 'Templo oriental', w: 'oriental' }, { n: 'Deserto', w: 'desert' }, { n: 'Fundo do mar', w: 'ocean' },
    { n: 'Corredor da escola', w: 'hallway' }, { n: 'Aurora', w: 'aurora' }, { n: 'Céu', w: 'skyview' },
    { n: 'Balada', w: 'club' }, { n: 'Shopping', w: 'mall' }, { n: 'Trilha', w: 'trail' }, { n: 'Sala de estar', w: 'living' },
    { n: 'Sala rosa', w: 'pinkroom' }, { n: 'Apartamento', w: 'apartment' }, { n: 'Cozinha', w: 'kitchen' }, { n: 'Biblioteca', w: 'library' }, { n: 'Muro de grafite', w: 'graffiti' }, { n: 'Metrô', w: 'subway' }, { n: 'Terraço da escola', w: 'rooftop' }, { n: 'Sala de aula', w: 'classroom' }, { n: 'Frente da escola', w: 'schoolfront' }, { n: 'Estrada na montanha', w: 'mountainroad' }, { n: 'Floresta encantada', w: 'darkforest' }, { n: 'Ilha tropical', w: 'island' }, { n: 'Iglu', w: 'igloo' }, { n: 'Natal', w: 'christmas' }, { n: 'Planeta alienígena', w: 'alien' }, { n: 'Pirâmides', w: 'pyramids' }, { n: 'Salão do castelo', w: 'throneroom' }, { n: 'Campo de futebol', w: 'soccer' }, { n: 'Estúdio de foto', w: 'photostudio' }, { n: 'Teatro', w: 'theater' },
  ];
  const FG_LIST = [
    { n: 'Nenhum' }, { n: 'Chuva', tpl: 'rain', a: '#bfe9ff' }, { n: 'Neve', tpl: 'snow' }, { n: 'Pétalas', tpl: 'petals' }, { n: 'Folhas', tpl: 'leaves', a: '#9bd46a' },
    { n: 'Vaga-lumes', tpl: 'fireflies', a: '#e9ff70' }, { n: 'Confete', tpl: 'confetti' }, { n: 'Brasas', tpl: 'embers' }, { n: 'Estrelas cadentes', tpl: 'meteors' },
    { n: 'Névoa', tpl: 'fog' }, { n: 'Bolhas', tpl: 'bubbles' }, { n: 'Céu estrelado', tpl: 'stars' },
    { n: 'Cortina de palco', frame: 'curtain' }, { n: 'Janela', frame: 'window' }, { n: 'Vinheta', frame: 'vignette' }, { n: 'Moldura dourada', frame: 'gold' },
  ];

  function weather(item, stat) {
    if (!item) return '';
    const c = item.colors, r = rng(item.id), u = uid();
    const n = { leaves: 14, fireflies: 22, rain: 60, meteors: 5, confetti: 40, fog: 6, petals: 26, embers: 30, snow: 40, bubbles: 18, stars: 30 }[item.tpl] || 20;
    const out = [];
    for (let i = 0; i < n; i++) {
      const x = (r() * 300).toFixed(0), ys = (r() * 400).toFixed(0), dur = 2 + r() * 4, del = (-r() * dur).toFixed(2);
      const anim = (cls, d = dur) => stat ? '' : `class="${cls}" style="animation-duration:${d.toFixed(2)}s;animation-delay:${del}s"`;
      const yTop = stat ? ys : -20, yBot = stat ? ys : 420;
      switch (item.tpl) {
        case 'rain': out.push(`<path ${anim('w-fall', .6 + r() * .5)} d="M${x} ${yTop} l-3 14" stroke="${c.a}" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>`); break;
        case 'leaves': out.push(`<g ${anim('w-fall-sway', 5 + r() * 4)}><ellipse cx="${x}" cy="${yTop}" rx="6" ry="3" fill="${i % 2 ? c.a : shade(c.a, -25)}" transform="rotate(${(r() * 180).toFixed(0)} ${x} ${yTop})"/></g>`); break;
        case 'petals': out.push(`<g ${anim('w-fall-sway', 5 + r() * 4)}><ellipse cx="${x}" cy="${yTop}" rx="5" ry="3" fill="${i % 3 ? '#ffc2d4' : '#fff'}" transform="rotate(${(r() * 180).toFixed(0)} ${x} ${yTop})"/></g>`); break;
        case 'confetti': out.push(`<g ${anim('w-fall-spin', 3 + r() * 3)}><rect x="${x}" y="${yTop}" width="5" height="9" fill="${['#ff4f8b', '#ffe066', '#3fd0c9', '#8a5cff', '#7ddc6a'][i % 5]}"/></g>`); break;
        case 'embers': out.push(`<circle ${anim('w-rise', 3 + r() * 4)} cx="${x}" cy="${yBot}" r="${(1 + r() * 2).toFixed(1)}" fill="${i % 2 ? '#ffd23f' : '#ff7a1f'}"/>`); break;
        case 'fireflies': out.push(`<circle ${anim('w-wander', 4 + r() * 4)} cx="${x}" cy="${ys}" r="${(1.5 + r() * 1.8).toFixed(1)}" fill="${c.a}"/>`); break;
        case 'meteors': out.push(`<path ${anim('w-meteor', 3 + r() * 3)} d="M${(r() * 300 + 60).toFixed(0)} ${stat ? ys : (r() * 120 - 60).toFixed(0)} l-50 30" stroke="url(#${u}mt)" stroke-width="2.5" stroke-linecap="round"/>`); break;
        case 'snow': out.push(`<g ${anim('w-fall-sway', 6 + r() * 5)}><circle cx="${x}" cy="${yTop}" r="${(1.6 + r() * 2.4).toFixed(1)}" fill="#fff" opacity=".9"/></g>`); break;
        case 'bubbles': out.push(`<circle ${anim('w-rise', 5 + r() * 4)} cx="${x}" cy="${yBot}" r="${(3 + r() * 6).toFixed(1)}" fill="#fff" fill-opacity=".12" stroke="#bfe9ff" stroke-width="1.4"/>`); break;
        case 'stars': out.push(`<path ${stat ? '' : `class="anim-tw" style="animation-delay:${del}s"`} d="${star(+x, +ys, 3 + r() * 4, 1, 4)}" fill="#fff"/>`); break;
        case 'fog': out.push(`<ellipse ${anim('w-fog', 14 + r() * 10)} cx="${x}" cy="${(180 + r() * 220).toFixed(0)}" rx="${(90 + r() * 60).toFixed(0)}" ry="${(24 + r() * 16).toFixed(0)}" fill="#d9d2e9" opacity=".22" filter="url(#${u}fb)"/>`); break;
      }
    }
    const d = `<defs><linearGradient id="${u}mt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="${u}fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter></defs>`;
    const glow = item.tpl === 'fireflies' || item.tpl === 'embers' ? ` filter="url(#${u}gw)"` : '';
    return d + `<defs><filter id="${u}gw" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g${glow}>${out.join('')}</g>`;
  }


  function frame(kind, u) {
    switch (kind) {
      case 'curtain': return `<defs><linearGradient id="${u}cu" x1="0" x2="1"><stop offset="0" stop-color="#8a0f1f"/><stop offset=".5" stop-color="#d7263d"/><stop offset="1" stop-color="#8a0f1f"/></linearGradient></defs>` +
        `<path d="M0 0 L70 0 Q60 200 80 400 L0 400Z" fill="url(#${u}cu)"/><path d="M300 0 L230 0 Q240 200 220 400 L300 400Z" fill="url(#${u}cu)"/>` +
        `<path d="M0 0 L300 0 L300 40 Q275 60 250 40 Q225 60 200 40 Q175 60 150 40 Q125 60 100 40 Q75 60 50 40 Q25 60 0 40Z" fill="#b01a2e"/><path d="M0 40 Q25 60 50 40 Q75 60 100 40 Q125 60 150 40 Q175 60 200 40 Q225 60 250 40 Q275 60 300 40" stroke="#ffd166" stroke-width="3" fill="none"/>`;
      case 'window': return `<path fill-rule="evenodd" d="M-200 -200 H500 V600 H-200Z M40 50 H260 V330 H40Z" fill="#6b4226"/><path d="M150 50 V330 M40 190 H260" stroke="#6b4226" stroke-width="10"/><rect x="30" y="330" width="240" height="16" fill="#8b5a2b"/>`;
      case 'vignette': return `<defs><radialGradient id="${u}vg" cx=".5" cy=".5" r=".7"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient></defs><rect x="-200" y="-200" width="700" height="800" fill="url(#${u}vg)"/>`;
      case 'gold': return `<rect x="6" y="6" width="288" height="388" fill="none" stroke="#c58b00" stroke-width="12"/><rect x="14" y="14" width="272" height="372" fill="none" stroke="#ffd23f" stroke-width="4"/>` + [[14, 14], [286, 14], [14, 386], [286, 386]].map(([x, y]) => `<path d="${star(x, y, 12, 5, 4)}" fill="#ffd23f" stroke="#c58b00" stroke-width="2"/>`).join('');
    }
    return '';
  }

  /* st = { bg, color, fg, tint, tintColor, mx, my, scale } */
  function background(st) {
    const u = uid(), d = BG_LIST[st.bg || 0] || BG_LIST[0];
    const color = st.color || '#6b4cff';
    let s = d.w ? WIDE[d.w](color, u) : GEN[d.g](color, u);
    const sc = st.scale || 1, mx = st.mx || 0, my = st.my || 0;
    if (sc !== 1 || mx || my) s = `<g transform="translate(${150 + mx} ${200 + my}) scale(${sc}) translate(-150 -200)">${s}</g>`;
    if (st.tint) s += `<rect x="-400" y="-400" width="1100" height="1200" fill="${st.tintColor || '#000'}" opacity="${st.tint / 100}"/>`;
    if (d.g !== 'solid') s += `<defs><radialGradient id="${u}vn" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#05021a" stop-opacity="0"/><stop offset="1" stop-color="#05021a" stop-opacity=".55"/></radialGradient></defs><rect width="300" height="400" fill="url(#${u}vn)"/>`;
    return s;
  }
  function foreground(st, stat) {
    const f = FG_LIST[st.fg || 0]; if (!f || (!f.tpl && !f.frame)) return '';
    if (f.frame) return frame(f.frame, uid());
    return weather({ id: 'fg' + st.fg, tpl: f.tpl, colors: { a: f.a || '#ffffff' } }, stat);
  }
  function svg(st, cls = 'bg-svg', par = 'xMidYMid slice') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" class="${cls}" preserveAspectRatio="${par}">${background(st)}<g pointer-events="none">${foreground(st)}</g></svg>`;
  }
  const thumbBg = (i, color) => `<svg viewBox="0 0 300 400" class="thumb still" preserveAspectRatio="xMidYMid slice">${background({ bg: i, color })}</svg>`;
  const thumbFg = i => `<svg viewBox="0 0 300 400" class="thumb" preserveAspectRatio="xMidYMid slice"><rect width="300" height="400" fill="#3a2d70"/>${foreground({ fg: i }, true)}</svg>`;

  return { svg, background, foreground, thumbBg, thumbFg, BG_LIST, FG_LIST, EMOJI_FONT };
})();
