/* ============ ARTE DOS CENÁRIOS (viewBox 0 0 300 400) ============ */

const SceneArt = (() => {
  const { rng, shade, star, uid } = Art;
  const EMOJI_FONT = `font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"`;

  const grad = (id, stops, vertical = true) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map((s, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${s}"/>`).join('')}</linearGradient>`;
  const sky = (u, stops) => `<defs>${grad(u + 'sk', stops)}</defs><rect width="300" height="400" fill="url(#${u}sk)"/>`;
  const cloud = (x, y, s = 1, op = .9) => `<g opacity="${op}" fill="#fff"><ellipse cx="${x}" cy="${y}" rx="${26 * s}" ry="${12 * s}"/><circle cx="${x - 10 * s}" cy="${y - 6 * s}" r="${11 * s}"/><circle cx="${x + 8 * s}" cy="${y - 9 * s}" r="${14 * s}"/></g>`;
  const blur = (u, sd = 6) => `<filter id="${u}bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

  const BG = {
    room: (c, u) => {
      let s = `<rect width="300" height="290" fill="${c.a}"/>`;
      for (let y = 20; y < 290; y += 34) for (let x = (y / 34) % 2 ? 20 : 37; x < 300; x += 34) s += `<circle cx="${x}" cy="${y}" r="3" fill="${shade(c.a, -8)}"/>`;
      s += `<rect y="284" width="300" height="116" fill="${c.b}"/>` + [300, 330, 362].map(y => `<path d="M0 ${y} L300 ${y}" stroke="${shade(c.b, -15)}" stroke-width="2"/>`).join('');
      s += `<rect y="280" width="300" height="8" fill="${shade(c.b, -25)}"/>`;
      s += `<rect x="36" y="60" width="104" height="110" rx="6" fill="${c.c}" stroke="#fff" stroke-width="7"/><path d="M88 60 L88 170 M36 115 L140 115" stroke="#fff" stroke-width="5"/>` + cloud(70, 90, .7);
      s += `<path d="M26 54 Q44 120 30 180 L20 180 L20 54Z M150 54 Q132 120 146 180 L156 180 L156 54Z" fill="#ff8fa3"/><rect x="16" y="48" width="144" height="8" rx="4" fill="${shade(c.b, -20)}"/>`;
      s += `<rect x="196" y="80" width="64" height="50" rx="3" fill="#fff" stroke="${shade(c.b, -20)}" stroke-width="5"/><path d="M204 122 L220 100 L232 114 L240 104 L252 122Z" fill="#7cc36a"/><circle cx="244" cy="94" r="5" fill="#ffd166"/>`;
      s += `<ellipse cx="150" cy="350" rx="120" ry="28" fill="#ffb3c7" opacity=".8"/><ellipse cx="150" cy="350" rx="96" ry="20" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>`;
      return s;
    },
    hills: (c, u) => sky(u, [c.a, '#d8f1ff']) + `<circle cx="236" cy="70" r="28" fill="#fff3b0"/><circle cx="236" cy="70" r="40" fill="#fff3b0" opacity=".3"/>` +
      cloud(70, 70, 1) + cloud(170, 110, .7) +
      `<ellipse cx="60" cy="320" rx="200" ry="110" fill="${c.b}"/><ellipse cx="270" cy="340" rx="180" ry="100" fill="${shade(c.b, -8)}"/><rect y="330" width="300" height="70" fill="${c.c}"/>` +
      (() => { const r = rng('hl'); let s = ''; for (let i = 0; i < 40; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(300 + r() * 100).toFixed(0)}" r="2.5" fill="${['#fff', '#ffe066', '#ff8fb1'][i % 3]}"/>`; return s; })(),
    forest: (c, u) => {
      const r = rng('fr');
      let s = sky(u, ['#10261c', '#2e5e3a', '#9fd48b']);
      s += `<g opacity=".1" fill="#fff"><path d="M120 0 L170 0 L260 400 L140 400Z"/><path d="M40 0 L70 0 L110 400 L50 400Z"/></g>`;
      const pine = (x, y, h, col) => `<path d="M${x} ${y - h} L${x - h * .35} ${y} L${x + h * .35} ${y}Z" fill="${col}"/><rect x="${x - 3}" y="${y}" width="6" height="12" fill="#3a2415"/>`;
      for (let i = 0; i < 9; i++) s += pine(i * 38 + r() * 10, 250, 120 + r() * 50, '#1c3b27');
      for (let i = 0; i < 7; i++) s += pine(i * 50 + 20 + r() * 10, 300, 110 + r() * 40, c.d);
      s += `<rect y="300" width="300" height="100" fill="#2d4a22"/><ellipse cx="150" cy="300" rx="200" ry="20" fill="#3f6b2e"/>`;
      for (let i = 0; i < 18; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(40 + r() * 280).toFixed(0)}" r="2" fill="#e9ff70" opacity=".8" class="tw" style="animation-delay:${(r() * 3).toFixed(1)}s"/>`;
      return s;
    },
    beach: (c, u) => sky(u, ['#7fd3ff', '#ffe9c4']) + `<circle cx="80" cy="170" r="34" fill="#fff3b0"/>` + cloud(210, 70, 1) + cloud(90, 100, .6) +
      `<defs>${grad(u + 'sea', ['#2f9fd8', '#1b4f8c'])}</defs><rect y="190" width="300" height="100" fill="url(#${u}sea)"/>` +
      [210, 232, 256].map((y, i) => `<path d="M0 ${y} q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="#fff" stroke-opacity="${.5 - i * .1}" stroke-width="2" fill="none"/>`).join('') +
      `<path d="M0 290 Q150 262 300 290 L300 400 L0 400Z" fill="#f4dca3"/><path d="M0 292 Q150 266 300 292" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>` +
      `<path d="M248 380 Q236 300 262 230" stroke="#8b5a2b" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      [[-60, 30], [-20, 38], [20, 36], [60, 28], [100, 34]].map(([a, l]) => `<path d="M262 230 q${l * Math.cos((a - 90) * Math.PI / 180) / 2} ${l * Math.sin((a - 90) * Math.PI / 180) / 2 - 10} ${l * Math.cos((a - 90) * Math.PI / 180)} ${l * Math.sin((a - 90) * Math.PI / 180) + 20}" stroke="#3fa34d" stroke-width="9" fill="none" stroke-linecap="round"/>`).join(''),
    space: (c, u) => {
      const r = rng('sp');
      let s = sky(u, [c.d, c.b, '#3a1f6e']) + `<defs>${blur(u, 14)}</defs>`;
      s += `<g filter="url(#${u}bl)" opacity=".55"><ellipse cx="80" cy="220" rx="90" ry="50" fill="${c.c}"/><ellipse cx="200" cy="300" rx="100" ry="40" fill="${c.a}"/></g>`;
      for (let i = 0; i < 90; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 400).toFixed(0)}" r="${(r() * 1.4 + .3).toFixed(1)}" fill="#fff" ${i % 6 ? '' : `class="tw" style="animation-delay:${(r() * 3).toFixed(1)}s"`}/>`;
      s += `<circle cx="220" cy="110" r="36" fill="#ff9df2"/><path d="M188 96 Q220 88 252 100" stroke="#ffd1f7" stroke-width="5" fill="none"/><ellipse cx="220" cy="112" rx="60" ry="12" fill="none" stroke="#ffe66d" stroke-width="4" transform="rotate(-15 220 112)"/>`;
      s += `<circle cx="60" cy="70" r="14" fill="#dcd6ff"/><circle cx="56" cy="66" r="3" fill="#b9b0ee"/><circle cx="64" cy="75" r="2" fill="#b9b0ee"/>`;
      return s;
    },
    candy: (c, u) => {
      let s = sky(u, ['#ffd1e6', '#c9f1ff']) + cloud(60, 60, 1) + cloud(230, 90, .8);
      s += `<circle cx="40" cy="330" r="110" fill="#9ee7ff"/><circle cx="250" cy="340" r="120" fill="#ff8fc4"/><circle cx="150" cy="380" r="100" fill="#fff7d6"/>`;
      s += [[60, 250], [240, 240], [150, 280]].map(([x, y], i) => `<rect x="${x - 3}" y="${y}" width="6" height="80" fill="#fff"/><circle cx="${x}" cy="${y}" r="26" fill="${['#ff4f8b', '#8a5cff', '#3fd0c9'][i]}"/><path d="M${x} ${y} m-18 0 a18 18 0 1 1 18 18 a12 12 0 1 1 -12 -12 a6 6 0 1 1 6 6" stroke="#fff" stroke-width="4" fill="none"/>`).join('');
      s += `<path d="M0 360 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L300 400 L0 400Z" fill="#ffb3d1"/>`;
      return s;
    },
    castle: (c, u) => {
      let s = sky(u, ['#140a24', '#3d1d45', '#6b2a4a']) + `<defs>${blur(u, 12)}</defs>`;
      s += `<circle cx="220" cy="90" r="50" fill="#ffe8c2" filter="url(#${u}bl)" opacity=".6"/><circle cx="220" cy="90" r="38" fill="#fff3d6"/><circle cx="208" cy="80" r="6" fill="#f0dfbd"/><circle cx="232" cy="102" r="4" fill="#f0dfbd"/>`;
      const r = rng('cs'); for (let i = 0; i < 30; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 200).toFixed(0)}" r="1" fill="#fff" opacity=".7"/>`;
      s += `<path d="M40 300 L40 170 L32 170 L50 130 L68 170 L60 170 L60 220 L100 220 L100 140 L90 140 L115 90 L140 140 L130 140 L130 200 L170 200 L170 150 L162 150 L180 112 L198 150 L190 150 L190 230 L230 230 L230 180 L222 180 L240 146 L258 180 L250 180 L250 300Z" fill="#150c1c"/>`;
      s += [[46, 190], [110, 160], [120, 180], [176, 170], [236, 200], [150, 240], [80, 250]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="12" rx="4" fill="${c.e}" opacity=".85"/>`).join('');
      s += `<path d="M0 300 Q150 270 300 300 L300 400 L0 400Z" fill="#0d0812"/>`;
      s += [[70, 60], [110, 80], [150, 50]].map(([x, y]) => `<path d="M${x} ${y} q5 -6 10 0 q5 -6 10 0 q-5 2 -10 6 q-5 -4 -10 -6Z" fill="#0d0812"/>`).join('');
      return s;
    },
    city: (c, u) => {
      const r = rng('ct');
      let s = sky(u, ['#07051a', '#2b1455', '#7a1d6e']);
      for (let i = 0; i < 40; i++) s += `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 160).toFixed(0)}" r=".9" fill="#fff" opacity=".6"/>`;
      let x = -10;
      while (x < 300) {
        const w = 30 + r() * 30, h = 120 + r() * 160, y = 300 - h;
        s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${r() > .5 ? '#140f2e' : '#1d1640'}"/>`;
        for (let wy = y + 10; wy < 290; wy += 14) for (let wx = x + 6; wx < x + w - 6; wx += 10) if (r() > .45) s += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="5" height="7" fill="${r() > .7 ? c.b : c.a}" opacity="${(.4 + r() * .6).toFixed(2)}"/>`;
        x += w + 2;
      }
      s += `<rect x="40" y="150" width="60" height="18" rx="4" fill="none" stroke="${c.b}" stroke-width="3" class="pulse"/><rect x="190" y="120" width="18" height="60" rx="4" fill="none" stroke="${c.a}" stroke-width="3" class="pulse"/>`;
      s += `<rect y="300" width="300" height="100" fill="#0a0718"/>` + [310, 325, 345, 372].map(y => `<path d="M0 ${y} L300 ${y}" stroke="${c.a}" stroke-opacity=".5"/>`).join('') +
        [-150, -75, 0, 75, 150, 225, 300, 375, 450].map(x => `<path d="M150 300 L${x} 400" stroke="${c.a}" stroke-opacity=".5"/>`).join('');
      return s;
    },
    temple: (c, u) => {
      let s = sky(u, ['#ffb7c9', '#ffd9a0', '#fff1d6']) + `<circle cx="150" cy="170" r="50" fill="#fff" opacity=".6"/>`;
      s += `<path d="M20 260 L130 120 Q150 108 170 120 L280 260Z" fill="#8e7cc3"/><path d="M112 144 L130 120 Q150 108 170 120 L188 144 L172 136 L160 146 L150 134 L140 146 L128 136Z" fill="#fff"/>`;
      s += `<rect y="250" width="300" height="150" fill="#9bc27a"/><path d="M0 330 Q150 300 300 330 L300 400 L0 400Z" fill="#c9b18a"/>`;
      s += `<rect x="96" y="210" width="10" height="110" fill="${c.b}"/><rect x="194" y="210" width="10" height="110" fill="${c.b}"/><path d="M76 204 Q150 190 224 204 L226 214 Q150 202 74 214Z" fill="${c.b}"/><rect x="86" y="222" width="128" height="8" fill="${c.b}"/><rect x="72" y="198" width="156" height="6" rx="3" fill="#2a1a22"/>`;
      s += [[30, 230], [270, 220], [250, 300]].map(([x, y]) => `<rect x="${x - 3}" y="${y}" width="6" height="60" fill="#5a3a2a"/>` + [[-16, 0], [14, -4], [0, -16], [-8, 10], [10, 10]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="16" fill="#ffc2d4"/>`).join('')).join('');
      return s;
    },
    volcano: (c, u) => {
      let s = sky(u, ['#1a0503', '#6a140a', '#ff5a1f']) + `<defs>${blur(u, 8)}</defs>`;
      s += `<g fill="#3a2a2a" opacity=".7" filter="url(#${u}bl)"><circle cx="150" cy="80" r="30"/><circle cx="180" cy="50" r="36"/><circle cx="120" cy="40" r="28"/></g>`;
      s += `<path d="M10 320 L120 130 L180 130 L290 320Z" fill="#2a0f0a"/><path d="M120 130 L180 130 L172 142 L128 142Z" fill="${c.c}"/>`;
      s += `<path d="M140 140 Q130 200 150 250 Q160 290 140 330" stroke="${c.a}" stroke-width="7" fill="none" filter="url(#${u}bl)"/><path d="M140 140 Q130 200 150 250 Q160 290 140 330" stroke="${c.c}" stroke-width="3" fill="none"/>`;
      s += `<path d="M168 140 Q180 190 170 230" stroke="${c.c}" stroke-width="3" fill="none"/>`;
      s += `<rect y="310" width="300" height="90" fill="#1a0806"/><path d="M0 360 Q80 340 150 362 T300 350" stroke="${c.a}" stroke-width="10" fill="none" class="pulse"/>`;
      return s;
    },
    underwater: (c, u) => {
      const r = rng('uw');
      let s = sky(u, ['#1a78b8', '#0b3e70', '#021a33']) + `<defs>${blur(u, 6)}${grad(u + 'gd', ['#fff3a8', '#ffc93c', '#e0902a'])}</defs>`;
      s += `<g opacity=".15" fill="#fff"><path d="M60 0 L90 0 L150 400 L100 400Z"/><path d="M180 0 L200 0 L240 400 L200 400Z"/></g>`;
      s += `<path d="M70 300 L70 200 Q100 150 130 200 L130 300Z M170 300 L170 210 Q200 160 230 210 L230 300Z" fill="#3fd0c9" opacity=".85"/>`;
      s += `<path d="M110 300 L110 170 Q150 90 190 170 L190 300Z" fill="url(#${u}gd)"/><circle cx="150" cy="104" r="8" fill="#ff5fa2" class="tw"/>`;
      s += [[130, 230], [150, 210], [170, 230]].map(([x, y]) => `<rect x="${x - 6}" y="${y}" width="12" height="22" rx="6" fill="#0b3e70"/>`).join('');
      s += `<rect y="300" width="300" height="100" fill="#0e2a4a"/><path d="M0 300 Q150 280 300 300 L300 320 L0 320Z" fill="#e7d3a0" opacity=".6"/>`;
      s += [[30, 320, '#ff7aa8'], [260, 330, '#ffb52e'], [60, 360, '#b56cff'], [240, 370, '#ff7aa8']].map(([x, y, col]) => `<path d="M${x} ${y} l-10 -30 m10 30 l0 -40 m0 40 l10 -32 m-10 32 l-18 -16 m18 16 l18 -18" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`).join('');
      for (let i = 0; i < 6; i++) { const x = 10 + i * 55; s += `<path class="sway" d="M${x} 400 q-10 -30 0 -60 q10 -30 0 -60" stroke="#2fbf71" stroke-width="5" fill="none"/>`; }
      for (let i = 0; i < 16; i++) s += `<circle class="w-rise" style="animation-delay:-${(r() * 6).toFixed(1)}s;animation-duration:${(5 + r() * 4).toFixed(1)}s" cx="${(r() * 300).toFixed(0)}" cy="410" r="${(2 + r() * 4).toFixed(1)}" fill="none" stroke="#bfe9ff"/>`;
      return s;
    },
  };

  /* Clima: partículas animadas (ou estáticas, para exportar imagem) */
  function weather(item, stat) {
    if (!item) return '';
    const c = item.colors, r = rng(item.id), u = uid();
    const n = { leaves: 14, fireflies: 22, rain: 60, meteors: 5, confetti: 40, fog: 6, petals: 26, embers: 30 }[item.tpl] || 20;
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
        case 'fog': out.push(`<ellipse ${anim('w-fog', 14 + r() * 10)} cx="${x}" cy="${(180 + r() * 220).toFixed(0)}" rx="${(90 + r() * 60).toFixed(0)}" ry="${(24 + r() * 16).toFixed(0)}" fill="#d9d2e9" opacity=".22" filter="url(#${u}fb)"/>`); break;
      }
    }
    const d = `<defs><linearGradient id="${u}mt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="${u}fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter></defs>`;
    const glow = item.tpl === 'fireflies' || item.tpl === 'embers' ? ` filter="url(#${u}gw)"` : '';
    return d + `<defs><filter id="${u}gw" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g${glow}>${out.join('')}</g>`;
  }

  function background(item) {
    if (!item) return `<rect width="300" height="400" fill="#2a2150"/>`;
    return (BG[item.tpl] || BG.hills)(item.colors, uid());
  }

  const propGlow = r => r >= 3 ? 'drop-shadow(0 0 6px #ffc93c)' : r >= 2 ? 'drop-shadow(0 0 4px #b56cff)' : 'none';

  function elementSVG(el, i, chars, sel, stat) {
    const sx = (el.s || 1) * (el.f ? -1 : 1), sy = el.s || 1;
    const tr = `translate(${el.x.toFixed(1)} ${el.y.toFixed(1)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`;
    if (el.t === 'prop') {
      const it = ITEMS[el.id]; if (!it) return '';
      return `<g class="el${sel ? ' sel' : ''}" data-i="${i}" transform="${tr}">${sel ? '<circle r="34" class="selring"/>' : ''}` +
        `<text x="0" y="4" font-size="48" text-anchor="middle" dominant-baseline="central" ${EMOJI_FONT} style="filter:${stat ? 'none' : propGlow(it.rarity)}">${it.tpl}</text></g>`;
    }
    if (el.t === 'char') {
      const ch = chars.find(c => c.uid === el.cid); if (!ch) return '';
      return `<g class="el${sel ? ' sel' : ''}" data-i="${i}" transform="${tr}">${sel ? '<rect x="-54" y="-70" width="108" height="140" rx="10" class="selring"/>' : ''}` +
        `<g transform="translate(-50 -65) scale(.5)">${Art.dollInner(ch, uid())}</g><rect x="-50" y="-65" width="100" height="130" fill="transparent"/></g>`;
    }
    return '';
  }

  function svg(scene, chars, opts = {}) {
    const els = (scene.els || []).map((el, i) => elementSVG(el, i, chars, opts.sel === i, opts.static)).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" class="${opts.cls || 'scene-svg'}" preserveAspectRatio="xMidYMid slice">` +
      `<g class="bg">${background(ITEMS[scene.bg])}</g><g class="els">${els}</g>` +
      `<g class="weather" pointer-events="none">${weather(ITEMS[scene.weather], opts.static)}</g></svg>`;
  }

  function thumb(item, v = 0) {
    switch (item.slot) {
      case 'bg': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" class="thumb-svg" preserveAspectRatio="xMidYMid slice">${background(item)}</svg>`;
      case 'prop': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" class="thumb-svg"><text x="30" y="32" font-size="40" text-anchor="middle" dominant-baseline="central" ${EMOJI_FONT}>${item.tpl}</text></svg>`;
      case 'weather': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" class="thumb-svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="wt${item.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1446"/><stop offset="1" stop-color="#4a2f7a"/></linearGradient></defs><rect width="300" height="400" fill="url(#wt${item.id})"/>${weather(item)}</svg>`;
      default: return Art.charThumb(item, v);
    }
  }

  return { svg, thumb, background, weather, BG, EMOJI_FONT };
})();

/* Miniatura universal de item */
Art.thumb = (item, v) => SceneArt.thumb(item, v);
