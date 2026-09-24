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

  /* ---------- Blocos de profundidade (cenários em planos: fundo desfocado e azulado, meio, frente escura) ---------- */
  const fdefs = u => `<defs>
    <filter id="${u}b1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter>
    <filter id="${u}b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1"/></filter>
    <filter id="${u}b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="${u}b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="${u}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
  const rgrad = (id, col, a = .8) => `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${a}"/><stop offset=".4" stop-color="${col}" stop-opacity="${a * .45}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
  const band = (u, id, y, h, col, a = .5) => `<defs><linearGradient id="${u}${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".5" stop-color="${col}" stop-opacity="${a}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><rect x="-20" y="${y}" width="340" height="${h}" fill="url(#${u}${id})"/>`;
  /* Nuvem com volume: base sombreada, corpo e brilho no alto; drift = animação lenta */
  const cloud3 = (x, y, s = 1, col = '#ffffff', sh = '#c9d6f0', cls = 'bg-drift') => `<g class="${cls}"><g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="6" rx="34" ry="10" fill="${sh}"/><circle cx="-16" cy="0" r="13" fill="${col}"/><circle cx="4" cy="-8" r="17" fill="${col}"/><circle cx="22" cy="0" r="12" fill="${col}"/><ellipse cx="0" cy="4" rx="32" ry="9" fill="${col}"/>
    <path d="M-28 6 Q0 14 30 6 Q0 12 -28 6Z" fill="${sh}" opacity=".7"/><ellipse cx="-2" cy="-14" rx="9" ry="4" fill="#fff" opacity=".8"/></g></g>`;
  /* Morros em planos: cor da frente escurecida, os de trás clareados e misturados com a névoa */
  const ridge = (pts, y0, col) => { const P = [[-20, pts[0][1]], ...pts]; let d = `M-20 ${y0} L${P[0][0]} ${P[0][1]}`;
    for (let i = 1; i < P.length; i++) { const [x, y] = P[i], n = P[i + 1]; d += n ? ` Q${x} ${y} ${(x + n[0]) / 2} ${(y + n[1]) / 2}` : ` L${x} ${y}`; }
    return `<path d="${d} L320 ${y0} L320 420 L-20 420Z" fill="${col}"/>`; };
  const hill = (cx, cy, rx, ry, col, rim) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}"/>` + (rim ? `<path d="M${cx - rx * .8} ${cy - ry * .6} Q${cx} ${cy - ry * 1.02} ${cx + rx * .8} ${cy - ry * .6}" stroke="${rim}" stroke-width="3" fill="none" opacity=".55"/>` : '');
  const bokeh = (u, r, n, cols, y0 = 0, y1 = 400, rmin = 4, rmax = 14, op = [.1, .25]) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${(rmin + r() * (rmax - rmin)).toFixed(1)}" fill="${cols[i % cols.length]}" opacity="${(op[0] + r() * (op[1] - op[0])).toFixed(2)}"/>`; return `<g filter="url(#${u}b1)">${s}</g>`; };
  const rays = (x, col, n = 4, a = .12, cls = 'bg-rays') => `<g class="${cls}" opacity="${a}" fill="${col}">${Array.from({ length: n }, (_, i) => { const o = (i - n / 2) * 46; return `<path d="M${x + o} -10 L${x + o + 22} -10 L${x + o * 1.9 + 70} 420 L${x + o * 1.9 + 10} 420Z"/>`; }).join('')}</g>`;
  const motes = (r, n, col, x0 = 0, x1 = 300, y0 = 100, y1 = 400) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle class="w-rise" style="animation-delay:-${(r() * 8).toFixed(1)}s;animation-duration:${(7 + r() * 6).toFixed(1)}s" cx="${(x0 + r() * (x1 - x0)).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${(.8 + r() * 1.4).toFixed(1)}" fill="${col}" opacity=".8"/>`; return s; };
  const tree = (x, y, h, col, dk) => `<g transform="translate(${x} ${y})"><rect x="-3" y="-4" width="6" height="16" fill="#4a2c1a"/>
    <path d="M0 ${-h} L${-h * .38} ${-h * .35} L${-h * .2} ${-h * .38} L${-h * .46} 4 L${h * .46} 4 L${h * .2} ${-h * .38} L${h * .38} ${-h * .35}Z" fill="${col}"/>
    <path d="M0 ${-h} L${h * .38} ${-h * .35} L${h * .2} ${-h * .38} L${h * .46} 4 L0 4Z" fill="${dk}" opacity=".55"/></g>`;
  const blossom = (x, y, s, c1, c2) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-2 0 Q-4 22 -3 40 L3 40 Q2 22 3 0Z" fill="#5a3a2a"/><path d="M0 10 Q-10 4 -16 -2 M0 14 Q10 8 16 4" stroke="#5a3a2a" stroke-width="3" fill="none"/>
    ${[[-14, -8, 16], [10, -12, 18], [-2, -22, 16], [18, 2, 13], [-20, 4, 12], [2, -2, 14]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${c1}"/>`).join('')}
    ${[[-10, -2, 10], [12, -4, 11], [2, 6, 9]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${c2}" opacity=".6"/>`).join('')}
    ${[[-8, -20, 6], [8, -24, 7]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#fff" opacity=".45"/>`).join('')}</g>`;

  const BG = {
    /* Quarto: luz da janela entrando, parede com cantos sombreados, piso em perspectiva e poeira no raio de luz */
    room: (c, u) => {
      const r = rng('rm');
      let s = fdefs(u) + `<defs><linearGradient id="${u}wl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(c.a, -14)}"/><stop offset=".35" stop-color="${c.a}"/><stop offset=".7" stop-color="${shade(c.a, 6)}"/><stop offset="1" stop-color="${shade(c.a, -18)}"/></linearGradient>
        <linearGradient id="${u}fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.b, -18)}"/><stop offset="1" stop-color="${shade(c.b, 8)}"/></linearGradient>${rgrad(u + 'lg', '#fff6d6', .55)}</defs>`;
      s += `<rect width="300" height="290" fill="url(#${u}wl)"/>`;
      for (let y = 20; y < 290; y += 34) for (let x = (y / 34) % 2 ? 20 : 37; x < 300; x += 34) s += `<path d="${star(x, y, 3.4, 1.4, 4)}" fill="${shade(c.a, -9)}"/>`;
      s += `<rect y="0" width="300" height="14" fill="${shade(c.a, -22)}" opacity=".5"/><rect y="270" width="300" height="20" fill="#fff" opacity=".35"/><rect y="286" width="300" height="6" fill="${shade(c.b, -30)}"/>`;
      /* piso em perspectiva */
      s += `<rect y="290" width="300" height="130" fill="url(#${u}fl)"/>` + [-150, -80, -20, 40, 100, 150, 200, 260, 320, 380, 450].map(x => `<path d="M${(150 + (x - 150) * 40 / 170).toFixed(1)} 290 L${x} 420" stroke="${shade(c.b, -22)}" stroke-width="1.6" opacity=".5"/>`).join('') + [305, 330, 364].map(y => `<path d="M0 ${y} L300 ${y}" stroke="${shade(c.b, -22)}" stroke-width="1.4" opacity=".4"/>`).join('');
      /* janela com moldura em volume e céu */
      s += `<rect x="30" y="58" width="112" height="116" rx="6" fill="${shade(c.b, -30)}"/><rect x="36" y="62" width="100" height="106" fill="${c.c}"/>` + cloud3(70, 96, .55, '#fff', '#dce8ff', 'bg-drift') + cloud3(116, 132, .4, '#fff', '#dce8ff', 'bg-drift2') +
        `<path d="M86 62 L86 168 M36 115 L136 115" stroke="#fff" stroke-width="6"/><path d="M36 62 L136 62 L136 168" stroke="${shade(c.b, -40)}" stroke-width="2" fill="none" opacity=".4"/>` +
        `<rect x="26" y="170" width="120" height="8" rx="3" fill="#fff"/><rect x="26" y="176" width="120" height="3" fill="${shade(c.b, -30)}" opacity=".5"/>`;
      /* cortinas com dobras */
      s += [[16, 1], [156, -1]].map(([x, m]) => `<path d="M${x} 50 Q${x + 18 * m} 110 ${x + 4 * m} 186 L${x + 22 * m} 186 Q${x + 30 * m} 110 ${x + 20 * m} 50Z" fill="#ff8fa3"/><path d="M${x + 6 * m} 54 Q${x + 16 * m} 120 ${x + 10 * m} 184" stroke="#e0647f" stroke-width="3" fill="none" opacity=".7"/><path d="M${x + 14 * m} 54 Q${x + 24 * m} 120 ${x + 18 * m} 184" stroke="#ffc2cf" stroke-width="2" fill="none" opacity=".8"/>`).join('') + `<rect x="10" y="44" width="152" height="8" rx="4" fill="${shade(c.b, -25)}"/>`;
      /* quadro, prateleira */
      s += `<rect x="196" y="78" width="66" height="52" rx="3" fill="#fff"/><rect x="202" y="84" width="54" height="40" fill="#bfe6ff"/><path d="M202 124 L218 102 L230 116 L238 106 L256 124Z" fill="#7cc36a"/><circle cx="246" cy="94" r="5" fill="#ffd166"/><rect x="196" y="128" width="66" height="3" fill="${shade(c.b, -30)}" opacity=".4"/>` +
        `<rect x="192" y="176" width="80" height="7" rx="2" fill="${shade(c.b, -15)}"/><rect x="192" y="182" width="80" height="4" fill="${shade(c.b, -35)}" opacity=".6"/>` +
        `<rect x="200" y="160" width="12" height="16" rx="2" fill="#8a5cff"/><rect x="214" y="156" width="10" height="20" rx="2" fill="#ffb52e"/><rect x="226" y="162" width="12" height="14" rx="2" fill="#3fd0c9"/>` +
        `<path d="M252 176 L248 160 L266 160 L262 176Z" fill="#c58b5b"/><path d="M257 160 Q248 146 252 138 Q258 148 257 160 Q262 144 270 142 Q266 152 257 160Z" fill="#5aa24c"/>`;
      /* luz do sol no chão e na parede */
      s += `<path d="M36 170 L136 170 L210 420 L40 420Z" fill="#fff6d6" opacity=".16"/><ellipse cx="120" cy="330" rx="110" ry="40" fill="url(#${u}lg)" opacity=".6"/>`;
      /* tapete com sombra e franja */
      s += `<ellipse cx="150" cy="356" rx="118" ry="30" fill="#000" opacity=".12" filter="url(#${u}b2)"/><ellipse cx="150" cy="350" rx="116" ry="28" fill="#ffb3c7"/><ellipse cx="150" cy="346" rx="116" ry="26" fill="#ffc6d4"/><ellipse cx="150" cy="346" rx="92" ry="18" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 6"/>`;
      s += `<g opacity=".7">${motes(r, 14, '#fffbe6', 40, 180, 170, 380)}</g>`;
      return s;
    },
    /* Campo: céu, sol com brilho, nuvens que passam, morros em 3 planos com névoa, flores balançando */
    hills: (c, u) => {
      const r = rng('hl');
      let s = sky(u, ['#6ec6ff', c.a, '#e6f6ff']) + fdefs(u) + `<defs>${rgrad(u + 'sun', '#fff6b0', .9)}</defs>`;
      s += `<circle cx="236" cy="72" r="70" fill="url(#${u}sun)" class="bg-glow"/><circle cx="236" cy="72" r="24" fill="#fffbe0"/>` + rays(236, '#fffbe0', 3, .1);
      s += cloud3(70, 70, 1.1, '#fff', '#d4e6fa', 'bg-drift') + cloud3(180, 118, .7, '#fff', '#d4e6fa', 'bg-drift2') + cloud3(20, 140, .5, '#fff', '#d4e6fa', 'bg-drift');
      s += `<g filter="url(#${u}b1)">${ridge([[40, 236], [110, 216], [170, 240], [240, 212], [320, 236]], 250, Color.mix(c.b, '#bfe4ff', .6))}</g>`;
      s += band(u, 'hz', 220, 60, '#ffffff', .45);
      s += hill(60, 320, 200, 90, Color.mix(c.b, '#e6f6ff', .2), '#e9ffd0') + hill(270, 340, 180, 90, shade(c.b, -8), '#e9ffd0');
      s += `<rect y="336" width="300" height="84" fill="${c.c}"/><path d="M0 336 Q150 326 300 336" stroke="#d8f5a8" stroke-width="3" fill="none" opacity=".6"/>`;
      for (let i = 0; i < 30; i++) { const x = r() * 300, y = 340 + r() * 70; s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-2 -7 M${x.toFixed(0)} ${y.toFixed(0)} l2 -8 M${x.toFixed(0)} ${y.toFixed(0)} l5 -6" stroke="${shade(c.c, -22)}" stroke-width="1.6" stroke-linecap="round"/>`; }
      for (let i = 0; i < 26; i++) { const x = (r() * 300).toFixed(0), y = (300 + r() * 110).toFixed(0), col = ['#fff', '#ffe066', '#ff8fb1', '#b9a7ff'][i % 4], sz = y > 350 ? 3.4 : 2.2;
        s += `<g class="sway" style="animation-delay:-${(r() * 3).toFixed(1)}s"><path d="M${x} ${y} l0 ${sz * 3}" stroke="#4f8a3a" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${sz}" fill="${col}"/><circle cx="${x}" cy="${y}" r="${sz * .4}" fill="#ffb52e"/></g>`; }
      s += bokeh(u, r, 6, ['#ffffff', '#fffbe0'], 0, 200, 8, 18, [.08, .18]);
      return s;
    },
    /* Floresta: 3 planos de pinheiros com névoa entre eles, raios de luz, vaga-lumes e folhas desfocadas na frente */
    forest: (c, u) => {
      const r = rng('fr');
      let s = sky(u, ['#0f2a24', '#2b6e4e', '#bfe8b0']) + fdefs(u);
      s += rays(170, '#f4ffd0', 5, .14);
      let far = ''; for (let i = 0; i < 11; i++) far += tree(i * 30 + r() * 10 - 10, 232, 70 + r() * 30, '#5f9c7a', '#3f7a5a');
      s += `<g filter="url(#${u}b1)" opacity=".8">${far}</g>` + band(u, 'f1', 196, 70, '#e6ffe0', .5);
      let mid = ''; for (let i = 0; i < 9; i++) mid += tree(i * 38 + r() * 12 - 6, 272, 110 + r() * 40, '#2f6b45', '#1f4d30');
      s += `<g filter="url(#${u}b2)">${mid}</g>` + band(u, 'f2', 240, 60, '#d6ffd0', .35);
      let near = ''; for (let i = 0; i < 6; i++) near += tree(i * 60 + r() * 14 - 10, 318, 150 + r() * 40, c.d, '#0e2a18');
      s += near + `<rect y="312" width="300" height="108" fill="#23401c"/><ellipse cx="150" cy="316" rx="200" ry="18" fill="#3f6b2e"/><ellipse cx="150" cy="350" rx="110" ry="22" fill="#fffbd0" opacity=".08"/>`;
      for (let i = 0; i < 20; i++) s += `<circle class="w-wander" style="animation-delay:-${(r() * 5).toFixed(1)}s;animation-duration:${(4 + r() * 4).toFixed(1)}s" cx="${(r() * 300).toFixed(0)}" cy="${(60 + r() * 300).toFixed(0)}" r="${(1.4 + r() * 1.6).toFixed(1)}" fill="#eaff70" filter="url(#${u}gl)"/>`;
      s += `<g filter="url(#${u}b3)" opacity=".85"><path d="M-20 420 Q10 330 40 300 Q30 360 60 420Z M320 400 Q280 330 250 316 Q270 360 250 420Z" fill="#0b1f10"/></g>`;
      return s;
    },
    /* Praia: reflexo do sol tremendo na água, ondas indo e vindo, espuma, palmeira balançando e gaivotas */
    beach: (c, u) => {
      const r = rng('bc');
      let s = sky(u, ['#4fb8ff', '#8fd8ff', '#ffe9c4']) + fdefs(u) + `<defs>${rgrad(u + 'sun', '#fff3b0', .9)}${grad(u + 'sea', ['#5cc8f0', '#2f9fd8', '#1b4f8c'])}${grad(u + 'snd', ['#f8e2b0', '#eccb8a'])}</defs>`;
      s += `<circle cx="80" cy="172" r="60" fill="url(#${u}sun)" class="bg-glow"/><circle cx="80" cy="172" r="26" fill="#fff8d6"/>`;
      s += cloud3(210, 70, 1, '#fff', '#dcefff', 'bg-drift') + cloud3(100, 104, .6, '#fff', '#dcefff', 'bg-drift2');
      s += `<g filter="url(#${u}b1)" opacity=".7"><path d="M200 190 Q230 170 260 184 Q280 176 320 190Z" fill="#6fa8c8"/></g>`;
      s += `<rect y="188" width="300" height="110" fill="url(#${u}sea)"/><rect y="186" width="300" height="4" fill="#fff" opacity=".45"/>`;
      s += `<g class="bg-shimmer">${Array.from({ length: 9 }, (_, i) => `<rect x="${60 + (r() - .5) * 30 + i * 2}" y="${194 + i * 10}" width="${20 + r() * 24}" height="2.4" rx="1.2" fill="#fff8d6" opacity="${(.8 - i * .07).toFixed(2)}"/>`).join('')}</g>`;
      s += [212, 236, 262].map((y, i) => `<g class="bg-wave" style="animation-delay:-${i * .9}s"><path d="M-40 ${y} q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="#fff" stroke-opacity="${.55 - i * .12}" stroke-width="2" fill="none"/></g>`).join('');
      s += `<path d="M0 290 Q150 262 300 290 L300 420 L0 420Z" fill="url(#${u}snd)"/><g class="bg-wave2"><path d="M-20 294 Q40 282 100 292 Q160 280 220 290 Q270 282 330 292 L330 300 Q270 290 220 298 Q160 288 100 300 Q40 290 -20 302Z" fill="#fff" opacity=".85"/></g>`;
      for (let i = 0; i < 18; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(310 + r() * 100).toFixed(0)}" r="${(.8 + r()).toFixed(1)}" fill="#c9a26a" opacity=".7"/>`;
      s += `<ellipse cx="236" cy="392" rx="40" ry="8" fill="#000" opacity=".12" filter="url(#${u}b2)"/>`;
      s += `<g class="sway" style="transform-origin:248px 392px"><path d="M244 392 Q232 300 262 228" stroke="#8b5a2b" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M244 392 Q232 300 262 228" stroke="#b07a4a" stroke-width="4" fill="none" stroke-linecap="round" transform="translate(-3 0)"/>` +
        [[-70, 36], [-30, 44], [10, 42], [50, 34], [95, 38]].map(([a, l]) => { const rr = (a - 90) * Math.PI / 180, ex = l * Math.cos(rr), ey = l * Math.sin(rr); return `<path d="M262 228 q${(ex / 2).toFixed(1)} ${(ey / 2 - 12).toFixed(1)} ${ex.toFixed(1)} ${(ey + 20).toFixed(1)}" stroke="#2f8a3d" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M262 228 q${(ex / 2).toFixed(1)} ${(ey / 2 - 12).toFixed(1)} ${ex.toFixed(1)} ${(ey + 20).toFixed(1)}" stroke="#5cc26a" stroke-width="3" fill="none" stroke-linecap="round"/>`; }).join('') +
        `<circle cx="258" cy="234" r="5" fill="#6b4226"/><circle cx="266" cy="236" r="5" fill="#6b4226"/></g>`;
      s += [[150, 70], [176, 58]].map(([x, y]) => `<path class="anim-bob" d="M${x - 7} ${y} q3.5 -4 7 0 q3.5 -4 7 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('');
      return s;
    },
    /* Espaço: nebulosas em camadas, estrelas piscando, planeta com sombra e anéis, meteoros */
    space: (c, u) => {
      const r = rng('sp');
      let s = sky(u, [c.d, c.b, '#3a1f6e']) + fdefs(u) + `<defs><radialGradient id="${u}pl" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd1f7"/><stop offset=".55" stop-color="#ff9df2"/><stop offset="1" stop-color="#8a3aa8"/></radialGradient>${rgrad(u + 'pg', '#ff9df2', .5)}</defs>`;
      s += `<g filter="url(#${u}b4)" opacity=".7"><ellipse cx="70" cy="220" rx="110" ry="56" fill="${c.c}"/><ellipse cx="220" cy="300" rx="120" ry="46" fill="${c.a}"/><ellipse cx="160" cy="120" rx="70" ry="30" fill="#3fd0c9" opacity=".6"/></g>`;
      for (let i = 0; i < 110; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 420).toFixed(0)}" r="${(r() * 1.4 + .3).toFixed(1)}" fill="#fff" ${i % 5 ? '' : `class="tw" style="animation-delay:${(r() * 3).toFixed(1)}s"`}/>`;
      s += [[40, 60], [260, 250], [120, 330]].map(([x, y]) => `<path d="${star(x, y, 6, 1.2, 4)}" fill="#fff" class="tw" filter="url(#${u}gl)"/>`).join('');
      s += `<circle cx="220" cy="112" r="70" fill="url(#${u}pg)"/><circle cx="220" cy="112" r="38" fill="url(#${u}pl)"/><path d="M190 100 Q220 88 250 104" stroke="#ffe0fa" stroke-width="4" fill="none" opacity=".7"/><path d="M204 128 Q222 136 244 126" stroke="#b04ac8" stroke-width="3" fill="none" opacity=".5"/>`;
      s += `<g transform="rotate(-15 220 112)"><path d="M158 112 A62 13 0 0 0 282 112" stroke="#ffe66d" stroke-width="5" fill="none"/><path d="M158 112 A62 13 0 0 0 282 112" stroke="#fff6c0" stroke-width="1.6" fill="none"/></g>`;
      s += `<g transform="rotate(-15 220 112)"><path d="M158 112 A62 13 0 0 1 282 112" stroke="#c9a200" stroke-width="5" fill="none" opacity=".5"/></g>`;
      s += `<circle cx="58" cy="72" r="15" fill="#dcd6ff"/><circle cx="54" cy="68" r="3.4" fill="#b9b0ee"/><circle cx="63" cy="77" r="2.4" fill="#b9b0ee"/><path d="M47 80 A15 15 0 0 0 72 76 A13 13 0 0 1 47 80Z" fill="#8a80d0" opacity=".6"/>`;
      s += `<defs><linearGradient id="${u}mt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>` + [0, 1].map(i => `<path class="w-meteor" style="animation-duration:${5 + i * 2}s;animation-delay:-${i * 2.4}s" d="M${260 - i * 60} ${40 + i * 70} l60 -34" stroke="url(#${u}mt)" stroke-width="2.4" stroke-linecap="round"/>`).join('');
      s += `<g filter="url(#${u}b3)"><circle cx="30" cy="380" r="30" fill="#5a4a8a"/><circle cx="276" cy="30" r="18" fill="#6b5aa0" opacity=".7"/></g>`;
      return s;
    },
    /* Doceria: céu pastel, morros de bala desfocados atrás, pirulitos com brilho, nuvens de algodão doce e brilhos */
    candy: (c, u) => {
      const r = rng('cd');
      let s = sky(u, ['#ffc6e2', '#ffe0f0', '#c9f1ff']) + fdefs(u);
      s += cloud3(60, 60, 1.1, '#fff0f8', '#ffc6e2', 'bg-drift') + cloud3(236, 92, .8, '#f0fbff', '#c9e6ff', 'bg-drift2');
      s += `<g filter="url(#${u}b1)" opacity=".8">${hill(40, 300, 110, 80, '#c9f1ff')}${hill(250, 300, 130, 90, '#ffd1ea')}${hill(150, 320, 90, 70, '#fff7d6')}</g>`;
      s += band(u, 'hz', 240, 70, '#ffffff', .5);
      s += hill(30, 360, 120, 70, '#9ee7ff', '#fff') + hill(260, 366, 130, 70, '#ff8fc4', '#fff') + hill(150, 396, 110, 60, '#fff1c2', '#fff');
      s += [[60, 262, '#ff4f8b'], [240, 250, '#8a5cff'], [150, 292, '#3fd0c9']].map(([x, y, col], i) => `<g class="sway" style="transform-origin:${x}px ${y + 90}px;animation-duration:${4 + i}s"><rect x="${x - 3}" y="${y}" width="6" height="90" rx="3" fill="#fff"/><rect x="${x}" y="${y}" width="3" height="90" fill="#e6e0f0"/>
        <circle cx="${x}" cy="${y}" r="27" fill="${col}"/><path d="M${x} ${y} m-18 0 a18 18 0 1 1 18 18 a12 12 0 1 1 -12 -12 a6 6 0 1 1 6 6" stroke="#fff" stroke-width="4.4" fill="none"/>
        <path d="M${x + 6} ${y + 26} A27 27 0 0 0 ${x + 27} ${y + 4}" stroke="${shade(col, -25)}" stroke-width="5" fill="none" opacity=".5"/><ellipse cx="${x - 12}" cy="${y - 14}" rx="7" ry="4" fill="#fff" opacity=".6" transform="rotate(-35 ${x - 12} ${y - 14})"/></g>`).join('');
      s += `<path d="M0 372 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L300 420 L0 420Z" fill="#ffb3d1"/><path d="M0 374 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`;
      for (let i = 0; i < 16; i++) s += `<path class="tw" style="animation-delay:-${(r() * 3).toFixed(1)}s" d="${star((r() * 300), (r() * 300), 3 + r() * 3, 1, 4)}" fill="#fff"/>`;
      s += bokeh(u, r, 10, ['#ff8fc4', '#9ee7ff', '#fff1c2'], 0, 420, 6, 16, [.15, .3]);
      return s;
    },
    /* Castelo: lua com halo, montanhas em planos, castelo com janelas tremulando, névoa passando e morcegos */
    castle: (c, u) => {
      const r = rng('cs');
      let s = sky(u, ['#0d0620', '#2e1540', '#6b2a4a']) + fdefs(u) + `<defs>${rgrad(u + 'mn', '#ffe8c2', .7)}</defs>`;
      for (let i = 0; i < 40; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 200).toFixed(0)}" r="${(r() * 1 + .3).toFixed(1)}" fill="#fff" opacity=".7" ${i % 4 ? '' : `class="tw" style="animation-delay:${(r() * 3).toFixed(1)}s"`}/>`;
      s += `<circle cx="220" cy="90" r="80" fill="url(#${u}mn)" class="bg-glow"/><circle cx="220" cy="90" r="36" fill="#fff3d6"/><circle cx="208" cy="80" r="6" fill="#f0dfbd"/><circle cx="232" cy="102" r="4" fill="#f0dfbd"/><path d="M190 108 A36 36 0 0 0 254 96 A32 32 0 0 1 190 108Z" fill="#e0c9a0" opacity=".5"/>`;
      s += `<g filter="url(#${u}b1)" opacity=".75">${ridge([[40, 220], [90, 200], [140, 226], [200, 196], [260, 222], [320, 204]], 240, '#4a2a5a')}</g>` + band(u, 'fg1', 214, 60, '#c9a2d0', .3);
      s += ridge([[30, 262], [100, 244], [180, 266], [250, 246], [320, 262]], 280, '#2a1636');
      s += `<path d="M40 300 L40 170 L32 170 L50 130 L68 170 L60 170 L60 220 L100 220 L100 140 L90 140 L115 90 L140 140 L130 140 L130 200 L170 200 L170 150 L162 150 L180 112 L198 150 L190 150 L190 230 L230 230 L230 180 L222 180 L240 146 L258 180 L250 180 L250 300Z" fill="#150c1c"/>`;
      s += `<path d="M115 90 L140 140 L130 140 L130 200 L122 200 L122 140 Z M180 112 L198 150 L190 150 L190 230 L184 230 L184 150Z" fill="#ffe8c2" opacity=".12"/>`;
      s += [[46, 190], [110, 160], [120, 180], [176, 170], [236, 200], [150, 240], [80, 250]].map(([x, y], i) => `<rect class="anim-flicker" style="animation-delay:-${i * .3}s" x="${x}" y="${y}" width="8" height="12" rx="4" fill="${c.e}" filter="url(#${u}gl)"/>`).join('');
      s += `<path d="M0 300 Q150 270 300 300 L300 420 L0 420Z" fill="#0d0812"/>`;
      s += `<g class="w-fog" style="animation-duration:22s" opacity=".35" filter="url(#${u}b3)"><ellipse cx="80" cy="300" rx="120" ry="20" fill="#d9c2e9"/><ellipse cx="240" cy="310" rx="110" ry="18" fill="#d9c2e9"/></g>`;
      s += [[70, 60], [110, 80], [150, 50]].map(([x, y], i) => `<g class="anim-bob" style="animation-delay:-${i * .7}s"><path class="anim-flap" d="M${x} ${y} q5 -6 10 0 q5 -6 10 0 q-5 2 -10 6 q-5 -4 -10 -6Z" fill="#0d0812"/></g>`).join('');
      return s;
    },
    /* Cidade neon: prédios em 3 planos (o de trás desfocado), letreiros pulsando, rua molhada refletindo as luzes */
    city: (c, u) => {
      const r = rng('ct');
      let s = sky(u, ['#07051a', '#2b1455', '#7a1d6e']) + fdefs(u);
      for (let i = 0; i < 40; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 160).toFixed(0)}" r=".9" fill="#fff" opacity=".6"/>`;
      const bld = (y0, hmin, hmax, wmin, wmax, fill, win, op) => { let o = '', x = -10; while (x < 310) { const w = wmin + r() * (wmax - wmin), h = hmin + r() * (hmax - hmin), y = y0 - h;
        o += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${fill}"/><rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="2" fill="${c.a}" opacity=".35"/>`;
        for (let wy = y + 8; wy < y0 - 6; wy += 12) for (let wx = x + 5; wx < x + w - 5; wx += 8) if (r() > .5) o += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="4" height="6" fill="${r() > .6 ? c.b : c.a}" opacity="${(op * (.4 + r() * .6)).toFixed(2)}"/>`;
        x += w + 2; } return o; };
      s += `<g filter="url(#${u}b1)" opacity=".7">${bld(240, 80, 170, 18, 34, '#2a1e5a', 1, .6)}</g>` + band(u, 'hz', 200, 60, '#ff2bd6', .25);
      s += `<g filter="url(#${u}b2)">${bld(270, 70, 150, 26, 44, '#1a1440', 1, .8)}</g>`;
      s += bld(300, 50, 130, 34, 56, '#0f0b28', 1, 1);
      s += `<rect x="36" y="150" width="64" height="20" rx="5" fill="none" stroke="${c.b}" stroke-width="3.4" class="pulse" filter="url(#${u}gl)"/><text x="68" y="164.5" text-anchor="middle" font-size="11" font-weight="700" fill="${c.b}" font-family="sans-serif" class="pulse">CLUB</text>`;
      s += `<rect x="198" y="118" width="18" height="62" rx="5" fill="none" stroke="${c.a}" stroke-width="3.4" class="anim-glow" filter="url(#${u}gl)"/><path d="M152 200 l10 -18 l10 18Z" fill="none" stroke="${c.c}" stroke-width="2.6" class="anim-tw" filter="url(#${u}gl)"/>`;
      s += `<defs>${grad(u + 'st', ['#1a1036', '#07051a'])}</defs><rect y="300" width="300" height="120" fill="url(#${u}st)"/>`;
      s += `<g opacity=".4" filter="url(#${u}b2)"><rect x="36" y="306" width="64" height="30" fill="${c.b}" opacity=".5"/><rect x="198" y="306" width="18" height="60" fill="${c.a}" opacity=".5"/></g>`;
      s += [310, 326, 348, 378].map(y => `<path d="M0 ${y} L300 ${y}" stroke="${c.a}" stroke-opacity=".35"/>`).join('') + [-150, -75, 0, 75, 150, 225, 300, 375, 450].map(x => `<path d="M150 300 L${x} 420" stroke="${c.a}" stroke-opacity=".35"/>`).join('');
      s += `<g class="bg-shimmer">${Array.from({ length: 8 }, () => `<rect x="${(r() * 300).toFixed(0)}" y="${(312 + r() * 90).toFixed(0)}" width="${(10 + r() * 30).toFixed(0)}" height="1.6" fill="${r() > .5 ? c.a : c.b}" opacity=".6"/>`).join('')}</g>`;
      s += bokeh(u, r, 12, [c.a, c.b, c.c], 0, 420, 5, 14, [.12, .3]);
      return s;
    },
    /* Templo: pôr do sol, montanha com neve atrás, torii com volume, cerejeiras e pétalas caindo */
    temple: (c, u) => {
      const r = rng('tp');
      let s = sky(u, ['#ff9fb8', '#ffc9a0', '#fff1d6']) + fdefs(u) + `<defs>${rgrad(u + 'sn', '#fff', .8)}</defs>`;
      s += `<circle cx="150" cy="170" r="90" fill="url(#${u}sn)" class="bg-glow"/><circle cx="150" cy="170" r="30" fill="#fffaf0" opacity=".9"/>`;
      s += cloud3(50, 90, .8, '#ffe6ee', '#ffb8c8', 'bg-drift') + cloud3(250, 60, .6, '#ffe6ee', '#ffb8c8', 'bg-drift2');
      s += `<g filter="url(#${u}b1)" opacity=".85"><path d="M10 270 L130 124 Q150 110 170 124 L290 270Z" fill="#9a8ad0"/><path d="M112 146 L130 124 Q150 110 170 124 L188 146 L172 138 L160 148 L150 136 L140 148 L128 138Z" fill="#fff"/><path d="M150 112 L170 124 L290 270 L220 270Z" fill="#7a6ab8" opacity=".5"/></g>`;
      s += band(u, 'hz', 230, 60, '#fff1f4', .5);
      s += `<rect y="258" width="300" height="162" fill="#9bc27a"/><path d="M0 258 Q150 250 300 258" stroke="#c8e8a0" stroke-width="3" fill="none"/><path d="M60 420 L120 300 L180 300 L240 420Z" fill="#d8c4a0"/><path d="M120 300 L180 300 L182 306 L118 306Z" fill="#fff" opacity=".4"/>`;
      s += `<g><rect x="96" y="212" width="11" height="110" fill="${c.b}"/><rect x="101" y="212" width="6" height="110" fill="${shade(c.b, -25)}"/><rect x="194" y="212" width="11" height="110" fill="${c.b}"/><rect x="199" y="212" width="6" height="110" fill="${shade(c.b, -25)}"/>
        <path d="M72 200 Q150 184 228 200 L230 212 Q150 198 70 212Z" fill="${c.b}"/><path d="M70 212 Q150 198 230 212 L230 216 Q150 202 70 216Z" fill="${shade(c.b, -30)}"/><rect x="84" y="224" width="132" height="9" fill="${c.b}"/><rect x="84" y="230" width="132" height="3" fill="${shade(c.b, -30)}"/>
        <rect x="68" y="194" width="164" height="6" rx="3" fill="#2a1a1a"/><rect x="144" y="212" width="12" height="12" fill="${shade(c.b, -15)}"/></g>`;
      s += `<ellipse cx="150" cy="326" rx="80" ry="8" fill="#000" opacity=".1" filter="url(#${u}b2)"/>`;
      s += `<g filter="url(#${u}b2)">${blossom(34, 238, .9, '#ffc2d4', '#ff8fb1')}${blossom(272, 226, 1, '#ffc2d4', '#ff8fb1')}</g>` + blossom(250, 300, 1.2, '#ffd6e2', '#ff8fb1');
      for (let i = 0; i < 18; i++) s += `<g class="w-fall-sway" style="animation-duration:${(6 + r() * 5).toFixed(1)}s;animation-delay:-${(r() * 8).toFixed(1)}s"><ellipse cx="${(r() * 300).toFixed(0)}" cy="-10" rx="4" ry="2.4" fill="${i % 3 ? '#ffc2d4' : '#fff'}" transform="rotate(${(r() * 180).toFixed(0)} 150 -10)"/></g>`;
      return s;
    },
    /* Vulcão: céu em brasa, fumaça passando, lava pulsando, brasas subindo */
    volcano: (c, u) => {
      const r = rng('vc');
      let s = sky(u, ['#1a0503', '#6a140a', '#ff5a1f']) + fdefs(u) + `<defs>${rgrad(u + 'lv', '#ffb03f', .8)}</defs>`;
      s += `<ellipse cx="150" cy="140" rx="160" ry="90" fill="url(#${u}lv)" class="bg-glow" opacity=".7"/>`;
      s += `<g class="bg-drift" filter="url(#${u}b3)" opacity=".8"><circle cx="150" cy="80" r="34" fill="#3a2a2a"/><circle cx="184" cy="48" r="40" fill="#4a3434"/><circle cx="116" cy="40" r="30" fill="#3a2a2a"/><circle cx="210" cy="16" r="36" fill="#2a1e1e"/></g>`;
      s += `<g filter="url(#${u}b1)" opacity=".8">${ridge([[40, 250], [90, 226], [150, 252], [230, 224], [320, 246]], 270, '#3a120a')}</g>`;
      s += `<path d="M10 330 L120 132 L180 132 L290 330Z" fill="#2a0f0a"/><path d="M150 132 L180 132 L290 330 L200 330Z" fill="#1a0806" opacity=".7"/><path d="M120 132 L180 132 L172 146 L128 146Z" fill="${c.c}" class="anim-glow" filter="url(#${u}gl)"/>`;
      s += `<path d="M140 144 Q128 200 150 250 Q162 290 140 330" stroke="${c.a}" stroke-width="8" fill="none" filter="url(#${u}b2)" class="anim-glow"/><path d="M140 144 Q128 200 150 250 Q162 290 140 330" stroke="${c.c}" stroke-width="3" fill="none"/>`;
      s += `<path d="M168 144 Q182 190 170 232" stroke="${c.a}" stroke-width="5" fill="none" filter="url(#${u}b2)"/><path d="M168 144 Q182 190 170 232" stroke="${c.c}" stroke-width="2" fill="none"/>`;
      s += `<rect y="320" width="300" height="100" fill="#1a0806"/><path d="M0 362 Q80 342 150 364 T300 352" stroke="${c.a}" stroke-width="12" fill="none" class="pulse" filter="url(#${u}gl)"/><path d="M0 362 Q80 342 150 364 T300 352" stroke="${c.c}" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < 26; i++) s += `<circle class="w-rise" style="animation-duration:${(3 + r() * 4).toFixed(1)}s;animation-delay:-${(r() * 6).toFixed(1)}s" cx="${(r() * 300).toFixed(0)}" cy="420" r="${(1 + r() * 2).toFixed(1)}" fill="${i % 2 ? '#ffd23f' : '#ff7a1f'}" filter="url(#${u}gl)"/>`;
      return s;
    },
    /* Palácio submarino: raios de luz balançando, silhuetas ao fundo, palácio com volume, algas e bolhas */
    underwater: (c, u) => {
      const r = rng('uw');
      let s = sky(u, ['#2a9ad8', '#0b4e80', '#021a33']) + fdefs(u) + `<defs>${grad(u + 'gd', ['#fff3a8', '#ffc93c', '#c8801e'])}</defs>`;
      s += rays(130, '#dff6ff', 5, .16);
      s += `<g filter="url(#${u}b1)" opacity=".5"><path d="M-10 300 Q30 250 60 280 Q90 230 130 270 L130 300Z M200 300 Q230 240 260 270 Q290 250 320 290 L320 300Z" fill="#1a5a80"/></g>`;
      s += `<path d="M70 300 L70 200 Q100 150 130 200 L130 300Z M170 300 L170 210 Q200 160 230 210 L230 300Z" fill="#3fd0c9" opacity=".9"/><path d="M100 150 Q130 200 130 300 L118 300 L118 200 Q112 170 100 150Z M200 160 Q230 210 230 300 L218 300 L218 210 Q212 180 200 160Z" fill="#1f9a95" opacity=".6"/>`;
      s += `<path d="M110 300 L110 170 Q150 90 190 170 L190 300Z" fill="url(#${u}gd)"/><path d="M150 90 Q190 170 190 300 L170 300 L170 170 Q164 120 150 90Z" fill="#a8641a" opacity=".45"/><path d="M122 180 Q134 140 150 110" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/><circle cx="150" cy="104" r="8" fill="#ff5fa2" class="tw" filter="url(#${u}gl)"/>`;
      s += [[130, 230], [150, 210], [170, 230]].map(([x, y]) => `<rect x="${x - 6}" y="${y}" width="12" height="22" rx="6" fill="#0b3e70"/><rect x="${x - 6}" y="${y}" width="12" height="22" rx="6" fill="#7fe3ff" opacity=".2" class="pulse"/>`).join('');
      s += `<rect y="300" width="300" height="120" fill="#0e2a4a"/><path d="M0 300 Q150 280 300 300 L300 322 L0 322Z" fill="#e7d3a0" opacity=".6"/>`;
      s += [[30, 330, '#ff7aa8'], [260, 340, '#ffb52e'], [60, 370, '#b56cff'], [240, 380, '#ff7aa8']].map(([x, y, col]) => `<g class="sway" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y} l-10 -30 m10 30 l0 -40 m0 40 l10 -32 m-10 32 l-18 -16 m18 16 l18 -18" stroke="${col}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y} l0 -40" stroke="#fff" stroke-width="1.4" opacity=".4"/></g>`).join('');
      for (let i = 0; i < 7; i++) { const x = 10 + i * 48; s += `<path class="sway" style="animation-delay:-${i * .5}s" d="M${x} 420 q-12 -34 0 -68 q12 -34 0 -68" stroke="#2fbf71" stroke-width="6" fill="none" stroke-linecap="round"/>`; }
      s += [[60, 140, 1], [220, 250, -1]].map(([x, y, m], i) => `<g class="bg-drift${i ? 2 : ''}"><g transform="translate(${x} ${y}) scale(${m} 1)"><ellipse cx="0" cy="0" rx="10" ry="6" fill="#ffb52e"/><path d="M-9 0 L-16 -6 L-16 6Z" fill="#ff8a2a"/><circle cx="5" cy="-1" r="1.6" fill="#1a1030"/></g></g>`).join('');
      for (let i = 0; i < 18; i++) s += `<circle class="w-rise" style="animation-delay:-${(r() * 6).toFixed(1)}s;animation-duration:${(5 + r() * 4).toFixed(1)}s" cx="${(r() * 300).toFixed(0)}" cy="420" r="${(2 + r() * 4).toFixed(1)}" fill="#fff" fill-opacity=".12" stroke="#bfe9ff" stroke-width="1.2"/>`;
      return s;
    },
    /* ---- novos ---- */
    /* Sala de aula: lousa, carteiras em perspectiva, janelas com luz, poeira de giz */
    school: (c, u) => {
      const r = rng('sc');
      let s = fdefs(u) + `<defs>${grad(u + 'wl', ['#f3ead6', '#e8dcc0'])}${grad(u + 'fl', ['#b8875a', '#d9a878'])}</defs><rect width="300" height="300" fill="url(#${u}wl)"/>`;
      s += `<rect y="0" width="300" height="10" fill="#c9b894"/><rect y="238" width="300" height="62" fill="#cbb58e"/><rect y="236" width="300" height="4" fill="#fff" opacity=".5"/>`;
      s += `<rect x="40" y="70" width="170" height="104" rx="4" fill="#6b4a2a"/><rect x="46" y="76" width="158" height="92" fill="#2f5a46"/><path d="M46 76 L204 76 L204 168 L180 168 L100 76Z" fill="#fff" opacity=".05"/>`;
      s += `<text x="125" y="112" text-anchor="middle" font-size="16" fill="#e8f5ec" font-family="'Fredoka',sans-serif" opacity=".85">Olá, turma!</text><path d="M70 130 Q100 124 130 132 T190 128" stroke="#e8f5ec" stroke-width="2" fill="none" opacity=".6"/><path d="${star(176, 150, 7, 3)}" fill="none" stroke="#ffe066" stroke-width="1.6" opacity=".8"/>`;
      s += `<rect x="40" y="174" width="170" height="6" fill="#8a643a"/><rect x="70" y="171" width="16" height="4" rx="1" fill="#fff"/><rect x="92" y="171" width="12" height="4" rx="1" fill="#ffb3c7"/>`;
      s += `<rect x="228" y="60" width="62" height="140" fill="#9fd8ff"/>` + cloud3(258, 110, .4, '#fff', '#dcefff', 'bg-drift') + `<path d="M259 60 L259 200 M228 130 L290 130" stroke="#fff" stroke-width="5"/><rect x="224" y="56" width="70" height="148" fill="none" stroke="#e0d2b0" stroke-width="6"/>`;
      s += `<path d="M228 200 L290 200 L300 330 L200 330Z" fill="#fff8d6" opacity=".22"/>`;
      s += `<rect y="300" width="300" height="120" fill="url(#${u}fl)"/>` + [-100, -20, 60, 140, 220, 300, 380].map(x => `<path d="M${(150 + (x - 150) * 40 / 160).toFixed(1)} 300 L${x} 420" stroke="#8a5a34" stroke-width="1.4" opacity=".4"/>`).join('');
      const desk = (x, y, s2) => `<g transform="translate(${x} ${y}) scale(${s2})"><ellipse cx="0" cy="46" rx="44" ry="7" fill="#000" opacity=".12"/><rect x="-40" y="0" width="80" height="10" rx="2" fill="#c98f58"/><rect x="-40" y="8" width="80" height="4" fill="#9a6a3a"/><rect x="-34" y="12" width="5" height="34" fill="#6b6b7a"/><rect x="29" y="12" width="5" height="34" fill="#6b6b7a"/><rect x="-10" y="-6" width="20" height="6" rx="1" fill="#ff8fa3"/></g>`;
      s += `<g filter="url(#${u}b2)">${desk(60, 290, .8)}${desk(240, 290, .8)}</g>` + desk(40, 350, 1.1) + desk(262, 352, 1.1);
      s += `<g opacity=".6">${motes(r, 12, '#fff', 220, 300, 180, 330)}</g>`;
      return s;
    },
    /* Aurora: céu noturno com faixas de aurora ondulando, montanhas nevadas e lago refletindo */
    aurora: (c, u) => {
      const r = rng('au');
      let s = sky(u, ['#020818', '#0a1f3a', '#12305a']) + fdefs(u) + `<defs><linearGradient id="${u}ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fffd0" stop-opacity="0"/><stop offset=".45" stop-color="#5cffb0" stop-opacity=".7"/><stop offset="1" stop-color="#b98cff" stop-opacity="0"/></linearGradient></defs>`;
      for (let i = 0; i < 90; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 260).toFixed(0)}" r="${(r() * 1.2 + .3).toFixed(1)}" fill="#fff" ${i % 5 ? '' : `class="tw" style="animation-delay:${(r() * 3).toFixed(1)}s"`}/>`;
      s += `<g filter="url(#${u}b3)">${[0, 1, 2].map(i => `<path class="bg-aurora" style="animation-delay:-${i * 2.2}s" d="M-20 ${120 + i * 26} Q60 ${60 + i * 30} 140 ${110 + i * 20} T320 ${80 + i * 26} L320 ${170 + i * 26} Q220 ${150 + i * 20} 140 ${190 + i * 20} T-20 ${200 + i * 26}Z" fill="url(#${u}ag)" opacity="${.8 - i * .2}"/>`).join('')}</g>`;
      s += `<g filter="url(#${u}b1)" opacity=".8">${ridge([[40, 230], [90, 190], [150, 232], [210, 180], [270, 222], [320, 200]], 250, '#2a4a7a')}</g>`;
      s += ridge([[30, 270], [80, 222], [130, 262], [190, 212], [250, 258], [320, 230]], 280, '#16284a') + `<path d="M80 222 L70 236 L88 234Z M190 212 L178 230 L202 228Z" fill="#dff0ff" opacity=".8"/>`;
      s += `<rect y="280" width="300" height="140" fill="#081428"/><g opacity=".45" transform="translate(0 560) scale(1 -1)" filter="url(#${u}b2)">${[0, 1].map(i => `<path class="bg-aurora" style="animation-delay:-${i * 2.2}s" d="M-20 ${120 + i * 26} Q60 ${60 + i * 30} 140 ${110 + i * 20} T320 ${80 + i * 26} L320 ${170 + i * 26} Q220 ${150 + i * 20} 140 ${190 + i * 20} T-20 ${200 + i * 26}Z" fill="url(#${u}ag)"/>`).join('')}</g>`;
      s += `<g class="bg-shimmer">${Array.from({ length: 8 }, (_, i) => `<rect x="${(r() * 260).toFixed(0)}" y="${290 + i * 14}" width="${(20 + r() * 40).toFixed(0)}" height="1.4" fill="#bfffe8" opacity=".35"/>`).join('')}</g>`;
      s += `<path d="M-10 420 L-10 350 Q20 330 40 356 L60 344 L80 364 L80 420Z M320 420 L320 340 Q290 324 270 350 L250 338 L234 362 L234 420Z" fill="#040a16"/>`;
      return s;
    },
    /* Entardecer: céu laranja e roxo, nuvens iluminadas de baixo, cidade distante em silhueta e passarinhos */
    sunset: (c, u) => {
      const r = rng('su');
      let s = sky(u, ['#3a2a7a', '#b04a8a', '#ff8a5a', '#ffd08a']) + fdefs(u) + `<defs>${rgrad(u + 'sg', '#ffe6a0', .9)}</defs>`;
      s += `<circle cx="150" cy="250" r="120" fill="url(#${u}sg)" class="bg-glow"/><circle cx="150" cy="250" r="34" fill="#fff4d0"/>`;
      s += cloud3(60, 120, 1.2, '#ffb0a0', '#ff7a8a', 'bg-drift') + cloud3(230, 90, 1, '#ffc0b0', '#e06a90', 'bg-drift2') + cloud3(170, 170, .7, '#ffd0a0', '#ff8a7a', 'bg-drift');
      s += `<g filter="url(#${u}b1)" opacity=".85">${(() => { let o = '', x = -10; while (x < 310) { const w = 14 + r() * 22, h = 20 + r() * 60; o += `<rect x="${x.toFixed(0)}" y="${(262 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#6a3a6a"/>`; x += w + 2; } return o; })()}</g>`;
      s += band(u, 'hz', 230, 50, '#ffd0a0', .5) + `<rect y="262" width="300" height="160" fill="#4a2a5a"/>`;
      s += `<path d="M0 300 Q150 280 300 300 L300 420 L0 420Z" fill="#2a1a3a"/><path d="M0 300 Q150 280 300 300" stroke="#ff9a7a" stroke-width="2" fill="none" opacity=".6"/>`;
      s += `<g class="bg-shimmer">${Array.from({ length: 6 }, (_, i) => `<rect x="${130 + (r() - .5) * 30}" y="${268 + i * 6}" width="${14 + r() * 26}" height="2" rx="1" fill="#ffe0a0" opacity="${(.7 - i * .1).toFixed(2)}"/>`).join('')}</g>`;
      s += [[80, 150], [100, 140], [210, 200]].map(([x, y], i) => `<path class="anim-bob" style="animation-delay:-${i * .6}s" d="M${x - 6} ${y} q3 -4 6 0 q3 -4 6 0" stroke="#3a1a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join('');
      return s;
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

  const T = {
    base: { a: '#8fd3ff', b: '#7cc36a', c: '#5aa24c' }, room: { a: '#f3d9b1', b: '#c58b5b', c: '#8fd3ff' },
    floresta: { a: '#3fa34d', b: '#8b5a2b', c: '#c8e86b', d: '#1f4d2b', e: '#f4e3b1' }, oceano: { a: '#2f9fd8', b: '#1b4f8c', c: '#7fe3e0', d: '#0e2a4a', e: '#fff3c9' },
    cosmos: { a: '#6b4cff', b: '#1b1446', c: '#ff9df2', d: '#0b0822', e: '#ffffff' }, doce: { a: '#ff8fc4', b: '#ffd1e6', c: '#9ee7ff', d: '#b0457a', e: '#fff7d6' },
    sombra: { a: '#2b2233', b: '#8e1b3a', c: '#d9d2e9', d: '#120d17', e: '#ff4d6d' }, neon: { a: '#00e5ff', b: '#ff2bd6', c: '#faff00', d: '#141029', e: '#ffffff' },
    sakura: { a: '#ffb7c9', b: '#d7263d', c: '#ffffff', d: '#5a1a2b', e: '#ffd166' }, fogo: { a: '#ff5a1f', b: '#8a1c0e', c: '#ffd23f', d: '#2a0a05', e: '#ffe9b0' },
  };
  const BG_LIST = [
    { n: 'Cor sólida', g: 'solid' }, { n: 'Palco do clube', g: 'club' }, { n: 'Degradê estelar', g: 'gradient' }, { n: 'Espiral', g: 'spiral' },
    { n: 'Anéis', g: 'rings' }, { n: 'Bolinhas', g: 'dots' }, { n: 'Xadrez', g: 'checker' }, { n: 'Listras', g: 'stripes' },
    { n: 'Quarto', b: 'room', t: 'room' }, { n: 'Campo', b: 'hills', t: 'base' }, { n: 'Floresta', b: 'forest', t: 'floresta' }, { n: 'Praia', b: 'beach', t: 'oceano' },
    { n: 'Espaço', b: 'space', t: 'cosmos' }, { n: 'Doceria', b: 'candy', t: 'doce' }, { n: 'Castelo', b: 'castle', t: 'sombra' }, { n: 'Cidade neon', b: 'city', t: 'neon' },
    { n: 'Templo', b: 'temple', t: 'sakura' }, { n: 'Vulcão', b: 'volcano', t: 'fogo' }, { n: 'Palácio submarino', b: 'underwater', t: 'oceano' },
    { n: 'Sala de aula', b: 'school', t: 'base' }, { n: 'Aurora', b: 'aurora', t: 'cosmos' }, { n: 'Entardecer', b: 'sunset', t: 'fogo' },
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
    let s = d.g ? GEN[d.g](color, u) : BG[d.b](T[d.t], u);
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
