/* ============ ARTE DOS PERSONAGENS (SVG procedural) ============
   Boneco em viewBox 0 0 200 260. Cabeça: elipse (100,92) rx52 ry48. */

const Art = (() => {
  let counter = 0;
  const uid = () => 'u' + (++counter).toString(36) + Math.random().toString(36).slice(2, 5);

  function rng(seed) {
    let s = typeof seed === 'string' ? [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7) : seed | 0;
    return () => {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shade(hex, pct) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const n = parseInt(h, 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = pct / 100;
    const adj = v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f);
    r = adj(r); g = adj(g); b = adj(b);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  const star = (cx, cy, r1, r2, n = 5, rot = -90) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? r2 : r1;
      const a = (rot + i * 180 / n) * Math.PI / 180;
      d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  };
  const heart = (cx, cy, s) =>
    `M${cx} ${cy + s * 0.9}C${cx - s * 1.6} ${cy - s * 0.2} ${cx - s * 0.6} ${cy - s * 1.3} ${cx} ${cy - s * 0.4}C${cx + s * 0.6} ${cy - s * 1.3} ${cx + s * 1.6} ${cy - s * 0.2} ${cx} ${cy + s * 0.9}Z`;
  const mirror = inner => `<g transform="translate(200 0) scale(-1 1)">${inner}</g>`;
  const INK = '#2a1a22';

  function defs(u) {
    return `<defs>
      <filter id="${u}alt"><feColorMatrix type="hueRotate" values="140"/></filter>
      <filter id="${u}pr"><feColorMatrix type="hueRotate" values="0"><animate attributeName="values" values="0;360" dur="4s" repeatCount="indefinite"/></feColorMatrix></filter>
      <filter id="${u}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  }

  /* ---------------- CABELO ---------------- */
  const BANGS = 'M46 96 Q44 36 100 34 Q156 36 154 96 Q146 70 126 64 Q118 80 100 72 Q84 84 70 70 Q54 78 46 96Z';
  const HAIR = {
    bob: F => ({
      back: `<path d="M40 96 Q36 30 100 30 Q164 30 160 96 L162 146 Q150 154 138 146 L138 110 L62 110 L62 146 Q50 154 38 146Z" fill="${F}"/>`,
      front: `<path d="${BANGS}" fill="${F}"/>`,
    }),
    long: F => ({
      back: `<path d="M38 96 Q34 28 100 28 Q166 28 162 96 L168 210 Q134 224 100 214 Q66 224 32 210Z" fill="${F}"/>`,
      front: `<path d="${BANGS}" fill="${F}"/><path d="M48 90 Q40 140 50 178 Q58 170 62 160 Q56 124 60 96Z" fill="${F}"/><path d="M152 90 Q160 140 150 178 Q142 170 138 160 Q144 124 140 96Z" fill="${F}"/>`,
    }),
    pony: (F, c) => ({
      back: `<ellipse cx="100" cy="86" rx="58" ry="54" fill="${F}"/><path d="M146 58 Q198 64 188 140 Q182 186 160 198 Q174 140 150 96Z" fill="${F}"/><circle cx="150" cy="62" r="7" fill="${c.b}"/>`,
      front: `<path d="M46 98 Q42 36 100 34 Q150 34 156 84 Q128 58 88 66 Q62 74 46 98Z" fill="${F}"/>`,
    }),
    spiky: F => ({
      back: `<ellipse cx="100" cy="86" rx="58" ry="52" fill="${F}"/>`,
      front: `<path d="M44 104 L36 62 L60 68 L54 30 L80 52 L92 20 L108 48 L130 22 L132 56 L158 36 L150 70 L168 66 L156 104 Q146 74 118 70 L112 84 L100 70 Q70 70 58 84Z" fill="${F}"/>`,
    }),
    curly: F => {
      const b = [[44, 96], [40, 122], [46, 146], [156, 96], [160, 122], [154, 146], [52, 62], [72, 42], [100, 34], [128, 42], [148, 62]];
      const f = [[56, 74], [72, 60], [90, 56], [110, 56], [128, 60], [144, 74]];
      return {
        back: b.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${F}"/>`).join('') + `<ellipse cx="100" cy="80" rx="54" ry="44" fill="${F}"/>`,
        front: f.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${F}"/>`).join(''),
      };
    },
    twintails: (F, c) => ({
      back: `<ellipse cx="100" cy="86" rx="57" ry="53" fill="${F}"/><path d="M52 70 Q14 110 26 190 Q34 206 44 190 Q36 130 62 92Z" fill="${F}"/><path d="M148 70 Q186 110 174 190 Q166 206 156 190 Q164 130 138 92Z" fill="${F}"/><circle cx="54" cy="76" r="7" fill="${c.c}"/><circle cx="146" cy="76" r="7" fill="${c.c}"/>`,
      front: `<path d="${BANGS}" fill="${F}"/>`,
    }),
    buns: F => ({
      back: `<circle cx="58" cy="46" r="23" fill="${F}"/><circle cx="142" cy="46" r="23" fill="${F}"/><ellipse cx="100" cy="86" rx="57" ry="53" fill="${F}"/>`,
      front: `<path d="${BANGS}" fill="${F}"/><path d="M48 38 Q56 30 66 34" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M134 34 Q144 30 152 38" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    }),
  };
  function hair(it, u) {
    const c = it.colors;
    let F = c.a, g = '';
    if (c.fx === 'grad') {
      g = `<defs><linearGradient id="${u}hg" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.c}"/></linearGradient></defs>`;
      F = `url(#${u}hg)`;
    }
    const r = (HAIR[it.tpl] || HAIR.bob)(F, c);
    const hi = `<path d="M72 46 Q100 36 128 46" stroke="#fff" stroke-opacity=".32" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return { back: g + r.back, front: r.front + (it.tpl === 'curly' ? '' : hi) };
  }

  /* ---------------- OLHOS ---------------- */
  const EX = [78, 122];
  const lash = x => `<path d="M${x - 10} 97 Q${x} 88 ${x + 10} 97" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const EYES = {
    round: (c) => EX.map(x => `<ellipse cx="${x}" cy="104" rx="9" ry="11" fill="#fff"/><ellipse cx="${x}" cy="105" rx="7.5" ry="9.5" fill="${c.a}"/><circle cx="${x}" cy="106" r="4" fill="#1a1020"/><circle cx="${x - 3}" cy="100" r="2.6" fill="#fff"/>${lash(x)}`).join(''),
    happy: () => EX.map(x => `<path d="M${x - 9} 107 Q${x} 94 ${x + 9} 107" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join(''),
    sleepy: (c) => EX.map(x => `<path d="M${x - 9} 103 Q${x} 116 ${x + 9} 103Z" fill="#fff"/><path d="M${x - 7} 103 Q${x} 114 ${x + 7} 103Z" fill="${c.a}"/><path d="M${x - 10} 103 L${x + 10} 103" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join(''),
    sparkle: (c, u) => `<defs><linearGradient id="${u}eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.a, -35)}"/><stop offset="1" stop-color="${shade(c.a, 45)}"/></linearGradient></defs>` +
      EX.map(x => `<ellipse cx="${x}" cy="103" rx="10" ry="13" fill="#fff"/><ellipse cx="${x}" cy="104" rx="8.5" ry="11.5" fill="url(#${u}eg)"/><ellipse cx="${x}" cy="105" rx="4" ry="5.5" fill="#1a1020"/><circle cx="${x - 3.5}" cy="98.5" r="3.2" fill="#fff"/><circle cx="${x + 3.5}" cy="110" r="1.6" fill="#fff"/><path d="${star(x + 4, 101, 2.2, 0.8, 4)}" fill="#fff"/>${lash(x)}`).join(''),
    star: (c) => EX.map(x => `<ellipse cx="${x}" cy="104" rx="9" ry="11" fill="#fff"/><ellipse cx="${x}" cy="105" rx="7.5" ry="9.5" fill="${c.a}"/><path d="${star(x, 105, 5.5, 2.3)}" fill="${c.b}"/><circle cx="${x - 3}" cy="99" r="2" fill="#fff"/>${lash(x)}`).join(''),
    heart: (c) => EX.map(x => `<path d="${heart(x, 104, 8)}" fill="${c.a}"/><circle cx="${x - 3}" cy="101" r="2" fill="#fff"/>`).join(''),
    cat: (c) => EX.map(x => `<ellipse cx="${x}" cy="104" rx="9" ry="11" fill="${c.a}"/><ellipse cx="${x}" cy="104" rx="1.8" ry="8" fill="#12070c"/><circle cx="${x - 3.5}" cy="99" r="2.2" fill="#fff"/>${lash(x)}`).join(''),
    glow: (c, u) => EX.map(x => `<ellipse cx="${x}" cy="104" rx="9" ry="10" fill="#0c0a1a"/><ellipse cx="${x}" cy="104" rx="6.5" ry="7.5" fill="${c.a}" filter="url(#${u}gl)"/><rect x="${x - 6}" y="103" width="12" height="2" fill="#fff" opacity=".8"/>`).join(''),
  };

  /* ---------------- BOCA ---------------- */
  const MOUTH = {
    smile: `<path d="M92 122 Q100 130 108 122" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    open: `<path d="M91 121 Q100 135 109 121Z" fill="#7a2a3a"/><path d="M95 128 Q100 125 105 128 Q100 132 95 128Z" fill="#ff8fa3"/>`,
    cat: `<path d="M90 122 Q95 128 100 122 Q105 128 110 122" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    flat: `<path d="M93 125 L107 125" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
    tongue: `<path d="M92 122 Q100 130 108 122" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="104" cy="128" rx="3.5" ry="4" fill="#ff7a93"/>`,
    o: `<ellipse cx="100" cy="126" rx="4" ry="5" fill="#7a2a3a"/>`,
  };

  /* ---------------- ROUPAS ---------------- */
  const TORSO = 'M70 150 Q100 141 130 150 L136 208 Q100 215 64 208Z';
  const shorts = col => `<path d="M68 200 L132 200 L133 224 L103 224 L100 214 L97 224 L67 224Z" fill="${col}"/>`;
  const pants = col => `<path d="M68 200 L132 200 L130 240 L103 240 L100 216 L97 240 L70 240Z" fill="${col}"/>`;
  const sleevesShort = col => `<path d="M72 150 Q60 156 55 172 L67 179 L78 160Z" fill="${col}"/><path d="M128 150 Q140 156 145 172 L133 179 L122 160Z" fill="${col}"/>`;
  const sleevesLong = (col, w = 15) => `<path d="M74 154 L60 194" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="M126 154 L140 194" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;

  const OUTFIT = {
    tee: (c, u) => {
      let pat = '';
      if (c.p === 'stripes') pat = [160, 172, 184, 196].map(y => `<rect x="60" y="${y}" width="80" height="5" fill="${c.c}"/>`).join('');
      if (c.p === 'dots') pat = [[82, 162], [110, 158], [96, 176], [120, 184], [78, 192], [104, 198], [124, 168]].map(([x, y]) => `<path d="${star(x, y, 4, 2, 5)}" fill="${c.c}"/>`).join('');
      return shorts(c.b) + sleevesShort(c.a) +
        `<clipPath id="${u}tc"><path d="${TORSO}"/></clipPath><path d="${TORSO}" fill="${c.a}"/><g clip-path="url(#${u}tc)">${pat}</g>` +
        `<path d="M90 146 Q100 156 110 146" stroke="${shade(c.a, -25)}" stroke-width="3" fill="none"/>`;
    },
    hoodie: c => pants(c.b) + sleevesLong(c.a, 16) +
      `<path d="M60 192 L58 200 M140 192 L142 200" stroke="${c.c}" stroke-width="15" stroke-linecap="round"/>` +
      `<path d="M68 148 Q100 138 132 148 L138 212 Q100 218 62 212Z" fill="${c.a}"/>` +
      `<path d="M76 146 Q100 168 124 146 Q118 136 100 138 Q82 136 76 146Z" fill="${shade(c.a, -15)}"/>` +
      `<path d="M82 188 L118 188 L114 204 L86 204Z" fill="${shade(c.a, -10)}"/>` +
      `<path d="M94 156 L93 172 M106 156 L107 172" stroke="${c.c}" stroke-width="2.5" stroke-linecap="round"/>`,
    overall: c => sleevesShort(c.b) + `<path d="${TORSO}" fill="${c.b}"/>` +
      `<path d="M70 178 L130 178 L133 234 L103 234 L100 214 L97 234 L67 234Z" fill="${c.a}"/>` +
      `<rect x="82" y="158" width="36" height="26" rx="4" fill="${c.a}"/>` +
      `<path d="M84 160 L78 147 M116 160 L122 147" stroke="${c.a}" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="87" cy="163" r="3" fill="${c.c}"/><circle cx="113" cy="163" r="3" fill="${c.c}"/>` +
      `<path d="M92 190 L108 190 L106 200 L94 200Z" fill="${shade(c.a, -15)}"/>`,
    tunic: c => pants(c.b) + sleevesLong(c.a) +
      `<path d="M68 148 Q100 138 132 148 L142 226 L132 222 L122 230 L111 223 L100 231 L89 223 L78 230 L68 222 L58 226Z" fill="${c.a}"/>` +
      `<rect x="66" y="184" width="68" height="7" fill="${c.b}"/><rect x="95" y="182" width="10" height="11" rx="2" fill="${c.c}"/>` +
      `<path d="M88 146 L100 164 L112 146" stroke="${c.c}" stroke-width="3" fill="none"/>`,
    vest: c => pants(c.b) + sleevesLong(c.e, 13) + `<path d="${TORSO}" fill="${c.e}"/>` +
      `<path d="M70 150 L95 148 L93 208 L64 208Z" fill="${c.a}"/><path d="M130 150 L105 148 L107 208 L136 208Z" fill="${c.a}"/>` +
      `<rect x="72" y="182" width="14" height="10" rx="2" fill="${shade(c.a, -20)}"/><rect x="114" y="182" width="14" height="10" rx="2" fill="${shade(c.a, -20)}"/>`,
    dress: c => `<circle cx="70" cy="156" r="11" fill="${shade(c.a, 20)}"/><circle cx="130" cy="156" r="11" fill="${shade(c.a, 20)}"/>` +
      `<path d="M72 150 Q100 142 128 150 L126 184 L74 184Z" fill="${c.a}"/>` +
      `<path d="M74 182 L126 182 Q150 212 154 228 Q100 240 46 228 Q50 212 74 182Z" fill="${c.a}"/>` +
      [52, 66, 80, 94, 108, 122, 136, 150].map(x => `<circle cx="${x}" cy="${229 + Math.abs(x - 100) * -0.03}" r="7.5" fill="${c.c}"/>`).join('') +
      `<rect x="72" y="179" width="56" height="7" fill="${c.b}"/><path d="M100 182 L88 174 L88 190Z M100 182 L112 174 L112 190Z" fill="${c.b}"/><circle cx="100" cy="182" r="3.5" fill="${shade(c.b, -20)}"/>`,
    cloak: (c, u) => {
      const r = rng('cloak');
      const stars = Array.from({ length: 12 }, () => `<path d="${star(50 + r() * 100, 158 + r() * 78, 2.6, 1, 4)}" fill="${c.c}"/>`).join('');
      return pants(c.d) + `<path d="${TORSO}" fill="${c.b}"/>` +
        `<clipPath id="${u}cl"><path d="M70 146 Q100 136 130 146 L156 242 Q100 252 44 242Z"/></clipPath>` +
        `<path d="M70 146 Q100 136 130 146 L156 242 Q100 252 44 242Z" fill="${c.a}"/><path d="M92 150 L108 150 L120 246 L80 246Z" fill="${c.b}"/>` +
        `<g clip-path="url(#${u}cl)" class="tw-slow">${stars}</g>` +
        `<path d="M72 148 Q62 126 80 122 L94 146Z" fill="${shade(c.a, -20)}"/><path d="M128 148 Q138 126 120 122 L106 146Z" fill="${shade(c.a, -20)}"/>` +
        `<circle cx="100" cy="150" r="6" fill="${c.c}" filter="url(#${u}gl)"/>`;
    },
    kimono: c => {
      const fl = (x, y) => [0, 72, 144, 216, 288].map(a => `<circle cx="${(x + 3.5 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(y + 3.5 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="2.6" fill="${c.c}"/>`).join('') + `<circle cx="${x}" cy="${y}" r="1.6" fill="${c.e}"/>`;
      return `<path d="M72 150 L44 160 L42 208 L70 206Z" fill="${c.a}"/><path d="M128 150 L156 160 L158 208 L130 206Z" fill="${c.a}"/>` +
        `<path d="M44 200 L70 198 M156 200 L130 198" stroke="${shade(c.a, -20)}" stroke-width="3"/>` +
        `<path d="M68 148 Q100 140 132 148 L136 242 Q100 248 64 242Z" fill="${c.a}"/>` +
        `<path d="M86 144 L112 196" stroke="${c.c}" stroke-width="5"/><path d="M114 144 L100 172" stroke="${c.c}" stroke-width="5"/>` +
        `<rect x="64" y="178" width="72" height="16" fill="${c.b}"/><path d="M64 186 L136 186" stroke="${c.e}" stroke-width="2"/>` +
        fl(56, 175) + fl(144, 168) + fl(80, 216) + fl(118, 226) + fl(100, 206);
    },
    suit: c => pants(shade(c.a, -25)) + `<path d="${TORSO}" fill="${c.c}"/>` +
      `<path d="M97 150 L103 150 L105 180 L100 188 L95 180Z" fill="${c.b}"/>` +
      sleevesLong(c.a) +
      `<path d="M70 150 L92 148 L100 200 L98 228 L66 222Z" fill="${c.a}"/><path d="M130 150 L108 148 L100 200 L102 228 L134 222Z" fill="${c.a}"/>` +
      `<path d="M92 148 L84 170 L96 176Z M108 148 L116 170 L104 176Z" fill="${shade(c.a, -25)}"/>` +
      `<circle cx="96" cy="196" r="2.5" fill="${c.b}"/><circle cx="96" cy="208" r="2.5" fill="${c.b}"/>`,
    jacket: (c, u) => pants(c.d) + `<path d="M84 206 L84 238 M116 206 L116 238" stroke="${c.b}" stroke-width="2" filter="url(#${u}gl)"/>` +
      `<path d="${TORSO}" fill="#1d1838"/>` + sleevesLong('#2a2350') +
      `<path d="M74 154 L60 194 M126 154 L140 194" stroke="${c.a}" stroke-width="2.5" filter="url(#${u}gl)"/>` +
      `<path d="M70 150 Q100 141 130 150 L134 200 Q100 206 66 200Z" fill="#2a2350"/>` +
      `<path d="M100 146 L100 202" stroke="${c.b}" stroke-width="2.5" filter="url(#${u}gl)"/>` +
      `<path d="M70 150 Q100 141 130 150 L134 200 Q100 206 66 200Z" fill="none" stroke="${c.a}" stroke-width="2" filter="url(#${u}gl)"/>` +
      `<path d="M112 164 L122 164 L117 174Z" fill="${c.c}" filter="url(#${u}gl)"/>`,
    armor: (c, u) => `<defs><linearGradient id="${u}ar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient></defs>` +
      pants(c.d) + sleevesLong(c.b) + `<path d="${TORSO}" fill="${c.b}"/>` +
      [70, 86, 102, 118].map(x => `<rect x="${x}" y="190" width="14" height="30" rx="3" fill="${shade(c.b, -15)}" stroke="${c.c}" stroke-width="1.5"/>`).join('') +
      `<path d="M72 150 Q100 144 128 150 L126 190 Q100 200 74 190Z" fill="url(#${u}ar)" stroke="${c.c}" stroke-width="2"/>` +
      `<ellipse cx="68" cy="155" rx="14" ry="10" fill="${c.a}" stroke="${c.c}" stroke-width="2"/><ellipse cx="132" cy="155" rx="14" ry="10" fill="${c.a}" stroke="${c.c}" stroke-width="2"/>` +
      `<path d="${star(100, 170, 7, 3, 4)}" fill="${c.c}" filter="url(#${u}gl)"/>`,
  };
  const BASE_OUTFIT = `<path d="M72 152 Q100 146 128 152 L132 204 Q100 210 68 204Z" fill="#e6e9f0"/>` + shorts('#b8c0cf');

  /* ---------------- CHAPÉUS / CABEÇA ---------------- */
  const HAT = {
    cap: c => `<path d="M50 72 Q50 28 100 28 Q150 28 150 72Z" fill="${c.a}"/><path d="M52 70 Q24 70 20 80 Q60 88 102 72Z" fill="${shade(c.a, -18)}"/><circle cx="100" cy="29" r="4" fill="${c.b}"/><path d="${star(112, 52, 8, 3.5)}" fill="${c.b}"/>`,
    bow: c => `<path d="M138 46 L116 30 L118 64Z" fill="${c.a}"/><path d="M138 46 L160 30 L158 64Z" fill="${c.a}"/><circle cx="138" cy="46" r="6.5" fill="${shade(c.a, -18)}"/>`,
    flowercrown: c => {
      const cols = ['#ff8fb1', '#ffe066', '#ffffff', '#c8a2ff'];
      const pts = [[54, 66], [66, 51], [82, 42], [100, 39], [118, 42], [134, 51], [146, 66]];
      return `<path d="M50 70 Q100 20 150 70" stroke="${c.a}" stroke-width="4" fill="none"/>` +
        pts.map(([x, y], i) => `<ellipse cx="${x + 7}" cy="${y + 3}" rx="5" ry="2.5" fill="${c.a}" transform="rotate(30 ${x + 7} ${y + 3})"/>` +
          [0, 72, 144, 216, 288].map(a => `<circle cx="${(x + 4.5 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(y + 4.5 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="3.8" fill="${cols[i % 4]}"/>`).join('') +
          `<circle cx="${x}" cy="${y}" r="2.6" fill="#ffb703"/>`).join('');
    },
    straw: c => `<ellipse cx="100" cy="58" rx="80" ry="14" fill="${c.a}"/><path d="M60 58 Q62 20 100 20 Q138 20 140 58Z" fill="${c.a}"/>` +
      `<path d="M60 50 Q100 42 140 50 L140 58 Q100 50 60 58Z" fill="${c.b}"/><path d="M36 58 Q100 72 164 58" stroke="${shade(c.a, -20)}" stroke-width="1.5" fill="none"/>` +
      `<circle cx="132" cy="50" r="6" fill="#ff6b8b"/><circle cx="132" cy="50" r="2.5" fill="#ffe066"/>`,
    halo: (c, u) => `<ellipse cx="100" cy="20" rx="36" ry="9" fill="none" stroke="${c.a}" stroke-width="5" filter="url(#${u}gl)" class="bob"/>`,
    bunnyears: c => `<g transform="rotate(-14 76 40)"><ellipse cx="76" cy="18" rx="12" ry="32" fill="${c.a}"/><ellipse cx="76" cy="20" rx="6" ry="22" fill="${c.b}"/></g>` +
      `<g transform="rotate(14 124 40)"><ellipse cx="124" cy="18" rx="12" ry="32" fill="${c.a}"/><ellipse cx="124" cy="20" rx="6" ry="22" fill="${c.b}"/></g>`,
    witch: c => `<ellipse cx="100" cy="52" rx="72" ry="13" fill="${c.a}"/><path d="M64 52 Q84 22 94 6 Q110 -4 134 8 Q116 12 112 24 Q124 40 136 52Z" fill="${c.a}"/>` +
      `<path d="M66 46 Q100 38 134 46 L136 53 Q100 45 64 53Z" fill="${c.b}"/><rect x="94" y="41" width="12" height="11" rx="2" fill="none" stroke="#ffd166" stroke-width="2.5"/>` +
      `<path d="${star(118, 22, 5, 2)}" fill="#ffd166"/>`,
    headphones: (c, u) => `<path d="M50 98 Q46 32 100 30 Q154 32 150 98" stroke="${c.d}" stroke-width="7" fill="none"/>` +
      `<ellipse cx="48" cy="102" rx="11" ry="17" fill="${c.d}" stroke="${c.a}" stroke-width="2.5" filter="url(#${u}gl)"/><ellipse cx="152" cy="102" rx="11" ry="17" fill="${c.d}" stroke="${c.a}" stroke-width="2.5" filter="url(#${u}gl)"/>` +
      `<path d="M44 96 L44 108 M156 96 L156 108" stroke="${c.b}" stroke-width="3" stroke-linecap="round" filter="url(#${u}gl)"/>`,
    kitsune: c => `<path d="M60 58 L128 40" stroke="${c.b}" stroke-width="2"/><g transform="translate(138 48) rotate(22)">` +
      `<path d="M-18 -8 L-15 -28 L-4 -13 L4 -13 L15 -28 L18 -8 Q20 14 0 24 Q-20 14 -18 -8Z" fill="#fff" stroke="#e3dbe0" stroke-width="1.5"/>` +
      `<path d="M-13 -20 L-8 -13 L-13 -12Z M13 -20 L8 -13 L13 -12Z" fill="${c.b}"/><path d="M-11 0 Q-6 -5 -2 0 M11 0 Q6 -5 2 0" stroke="${c.b}" stroke-width="2.5" fill="none"/>` +
      `<path d="M-2 -10 Q0 -4 2 -10" stroke="${c.b}" stroke-width="2" fill="none"/><circle cx="0" cy="14" r="2" fill="${c.b}"/><path d="M-10 8 L-4 10 M10 8 L4 10" stroke="${c.b}" stroke-width="1.5"/></g>`,
    horns: (c, u) => `<defs><linearGradient id="${u}hn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.d}"/><stop offset="1" stop-color="${c.c}"/></linearGradient></defs>` +
      `<path d="M70 58 Q46 36 60 6 Q64 30 86 48Z" fill="url(#${u}hn)"/><path d="M130 58 Q154 36 140 6 Q136 30 114 48Z" fill="url(#${u}hn)"/>`,
    crown: (c, u) => `<defs><linearGradient id="${u}cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff9e3d"/></linearGradient></defs>` +
      `<path d="M64 48 L58 12 L80 30 L100 2 L120 30 L142 12 L136 48Z" fill="url(#${u}cr)" stroke="#c58b00" stroke-width="2"/>` +
      `<circle cx="100" cy="36" r="6" fill="#ff5fa2" filter="url(#${u}gl)"/><circle cx="78" cy="40" r="4" fill="#5fd3ff"/><circle cx="122" cy="40" r="4" fill="#8cff8c"/>` +
      `<g class="tw">${[[58, 12], [100, 2], [142, 12]].map(([x, y]) => `<path d="${star(x, y, 6, 1.5, 4)}" fill="#fff"/>`).join('')}</g>`,
  };

  /* ---------------- ACESSÓRIOS DE ROSTO ---------------- */
  const FACE = {
    glasses: c => EX.map(x => `<circle cx="${x}" cy="104" r="13" fill="#fff" fill-opacity=".15" stroke="${c.a}" stroke-width="3"/>`).join('') +
      `<path d="M91 102 Q100 97 109 102 M65 101 L50 96 M135 101 L150 96" stroke="${c.a}" stroke-width="3" fill="none"/>`,
    bandaid: () => `<g transform="rotate(-20 128 120)"><rect x="118" y="115" width="22" height="9" rx="4" fill="#f2c29b"/><rect x="125" y="115" width="8" height="9" fill="#e6ad85"/></g>`,
    facepaint: c => [0, 1].map(m => { const s = `<path d="M60 112 Q66 116 72 112 M58 119 Q65 123 72 119 M60 126 Q66 130 72 126" stroke="${c.a}" stroke-width="3" fill="none" stroke-linecap="round"/>`; return m ? mirror(s) : s; }).join(''),
    goggles: c => `<rect x="44" y="97" width="112" height="8" rx="3" fill="#2b3a4a"/>` +
      EX.map(x => `<circle cx="${x}" cy="102" r="15" fill="${c.c}" fill-opacity=".55" stroke="${c.a}" stroke-width="4"/><path d="M${x - 8} 96 Q${x - 4} 92 ${x} 93" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join(''),
    starmark: (c, u) => `<path d="${star(132, 121, 6.5, 2.6)}" fill="${c.a}" filter="url(#${u}gl)"/><path d="${star(68, 120, 3.5, 1.4)}" fill="${c.a}"/>`,
    blush: () => `<ellipse cx="66" cy="119" rx="11" ry="6" fill="#ff6f9a" opacity=".6"/><ellipse cx="134" cy="119" rx="11" ry="6" fill="#ff6f9a" opacity=".6"/>` +
      `<path d="${star(146, 110, 4, 1, 4)}" fill="#fff"/><path d="${star(56, 128, 3, 0.8, 4)}" fill="#fff"/>`,
    eyepatch: c => `<path d="M50 82 L112 98 M134 96 L152 102" stroke="#1b1320" stroke-width="3"/><path d="M110 94 Q122 88 134 94 L132 112 Q122 118 112 112Z" fill="#1b1320"/><path d="${star(122, 103, 4, 1.6)}" fill="${c.e}"/>`,
    visor: (c, u) => `<rect x="60" y="94" width="80" height="19" rx="9" fill="${c.a}" fill-opacity=".45" stroke="${c.a}" stroke-width="2.5" filter="url(#${u}gl)"/><rect x="66" y="102" width="68" height="2" fill="${c.b}" class="scan"/>`,
    scales: c => [0, 1].map(m => { const s = [[58, 114], [66, 114], [62, 120], [70, 120], [66, 126]].map(([x, y]) => `<path d="M${x - 4} ${y} Q${x} ${y - 6} ${x + 4} ${y}" fill="${c.a}" stroke="${c.b}" stroke-width="1"/>`).join(''); return m ? mirror(s) : s; }).join(''),
  };

  /* ---------------- AURAS ---------------- */
  function glowBg(c, u) {
    return `<defs><radialGradient id="${u}ag"><stop offset="0" stop-color="${c.a}" stop-opacity=".55"/><stop offset="1" stop-color="${c.a}" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="140" rx="98" ry="125" fill="url(#${u}ag)"/>`;
  }
  const AURA = {
    fireflies: (c, u) => {
      const r = rng('ff');
      return { back: glowBg(c, u), front: Array.from({ length: 14 }, () => `<circle cx="${(10 + r() * 180).toFixed(0)}" cy="${(20 + r() * 220).toFixed(0)}" r="${(1.8 + r() * 2).toFixed(1)}" fill="${c.a}" filter="url(#${u}gl)" class="tw" style="animation-delay:${(r() * 2).toFixed(2)}s"/>`).join('') };
    },
    bubbles: (c, u) => {
      const r = rng('bb');
      return { back: glowBg(c, u), front: Array.from({ length: 10 }, () => { const x = 10 + r() * 180, y = 30 + r() * 200, s = 4 + r() * 8; return `<g class="float" style="animation-delay:${(r() * 3).toFixed(2)}s"><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="#fff" fill-opacity=".15" stroke="${c.c}" stroke-width="1.5"/><circle cx="${(x - s / 3).toFixed(1)}" cy="${(y - s / 3).toFixed(1)}" r="${(s / 4).toFixed(1)}" fill="#fff"/></g>`; }).join('') };
    },
    ring: (c, u) => ({
      back: glowBg(c, u) + `<defs><linearGradient id="${u}rg"><stop offset="0" stop-color="${c.c}"/><stop offset=".5" stop-color="${c.a}"/><stop offset="1" stop-color="${c.c}"/></linearGradient></defs><ellipse cx="100" cy="150" rx="96" ry="22" fill="none" stroke="url(#${u}rg)" stroke-width="7" transform="rotate(-12 100 150)" opacity=".85"/>`,
      front: `<path d="M4 150 A96 22 0 0 0 196 150" fill="none" stroke="url(#${u}rg)" stroke-width="7" transform="rotate(-12 100 150)"/>`,
    }),
    rainbow: (c, u) => ({
      back: glowBg(c, u) + ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#b197fc'].map((col, i) => { const rr = 98 - i * 7; return `<path d="M${100 - rr} 120 A${rr} ${rr} 0 0 1 ${100 + rr} 120" stroke="${col}" stroke-width="7" fill="none" opacity=".8"/>`; }).join('') +
        [[8, 122], [192, 122]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff"/><circle cx="${x + 10}" cy="${y + 4}" r="9" fill="#fff"/><circle cx="${x - 10}" cy="${y + 4}" r="9" fill="#fff"/>`).join(''),
      front: '',
    }),
    batwings: (c, u) => {
      const w = `<path d="M80 162 Q46 104 6 112 Q18 124 14 140 Q28 136 32 152 Q42 146 48 164 Q62 156 80 178Z" fill="${c.a}" stroke="${c.b}" stroke-width="2"/><path d="M78 164 L14 140 M78 166 L32 152 M78 170 L48 164" stroke="${c.b}" stroke-width="1.5" opacity=".7"/>`;
      return { back: glowBg({ a: c.b }, u) + `<g class="flap-l">${w}</g><g class="flap-r">${mirror(w)}</g>`, front: '' };
    },
    circuit: (c, u) => {
      const lines = ['M70 170 L40 170 L40 120 L20 120', 'M130 170 L160 170 L160 110 L184 110', 'M76 200 L30 200 L30 236', 'M124 200 L172 200 L172 240', 'M60 90 L24 90 L24 50', 'M140 80 L176 80 L176 40', 'M100 40 L100 8'];
      return {
        back: glowBg(c, u) + `<g filter="url(#${u}gl)" class="pulse">` + lines.map((d, i) => `<path d="${d}" stroke="${i % 2 ? c.b : c.a}" stroke-width="2.5" fill="none"/>`).join('') +
          [[20, 120], [184, 110], [30, 236], [172, 240], [24, 50], [176, 40], [100, 8]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4" fill="${i % 2 ? c.b : c.a}"/>`).join('') + '</g>',
        front: '',
      };
    },
    petals: (c, u) => {
      const r = rng('pt');
      return { back: glowBg(c, u), front: Array.from({ length: 16 }, () => { const x = (10 + r() * 180).toFixed(0), y = (10 + r() * 230).toFixed(0); return `<g class="sway" style="animation-delay:${(r() * 3).toFixed(2)}s"><ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="${c.a}" stroke="${shade(c.a, -15)}" stroke-width=".8" transform="rotate(${(r() * 180).toFixed(0)} ${x} ${y})"/></g>`; }).join('') };
    },
    flames: (c, u) => {
      const fl = (x, y, s, d) => `<path class="flicker" style="animation-delay:${d}s" d="M${x} ${y} Q${x - 14 * s} ${y - 20 * s} ${x - 4 * s} ${y - 44 * s} Q${x} ${y - 30 * s} ${x + 6 * s} ${y - 54 * s} Q${x + 18 * s} ${y - 26 * s} ${x + 12 * s} ${y}Z" fill="url(#${u}fl)"/>`;
      return {
        back: `<defs><linearGradient id="${u}fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.c}"/><stop offset=".5" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}" stop-opacity=".2"/></linearGradient></defs>` + glowBg(c, u) +
          fl(24, 250, 1.6, 0) + fl(160, 250, 1.7, .4) + fl(50, 200, 1.2, .8) + fl(136, 196, 1.3, .2) + fl(90, 110, 1.9, .6) + fl(8, 180, 1, .3) + fl(178, 176, 1, .9),
        front: '',
      };
    },
    angelwings: (c, u) => {
      let f = '';
      for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) {
        const x = 78 - i * 12 - row * 4, y = 150 - row * 22 + i * 6, len = 34 + i * 5 - row * 6;
        f += `<ellipse cx="${x - len / 2}" cy="${y}" rx="${len / 2}" ry="7" fill="${row === 0 ? '#fff' : row === 1 ? '#fff4fb' : '#f3eaff'}" stroke="url(#${u}wg)" stroke-width="1.5" transform="rotate(${-25 + i * 9 + row * 6} ${x} ${y})"/>`;
      }
      return {
        back: `<defs><linearGradient id="${u}wg" x1="0" x2="1"><stop offset="0" stop-color="#ff9df2"/><stop offset=".5" stop-color="#9ee7ff"/><stop offset="1" stop-color="#ffe66d"/></linearGradient></defs>` +
          glowBg({ a: '#ffe6ff' }, u) + `<g class="flap-l">${f}</g><g class="flap-r">${mirror(f)}</g>`,
        front: `<g class="tw">${[[20, 40], [180, 60], [30, 200], [170, 190], [100, 10]].map(([x, y]) => `<path d="${star(x, y, 6, 1.4, 4)}" fill="#fff" filter="url(#${u}gl)"/>`).join('')}</g>`,
      };
    },
  };

  /* ---------------- MASCOTES (caixa local 0..54) ---------------- */
  const PET = {
    fox: c => `<path d="M40 42 Q58 30 50 12 Q44 28 34 34Z" fill="${c.a}"/><path d="M50 12 Q48 20 44 24 L50 22Z" fill="#fff"/>` +
      `<ellipse cx="26" cy="42" rx="16" ry="11" fill="${c.a}"/><circle cx="22" cy="26" r="13" fill="${c.a}"/>` +
      `<path d="M11 20 L12 6 L20 15Z M33 20 L32 6 L24 15Z" fill="${c.a}"/><ellipse cx="22" cy="31" rx="8" ry="5" fill="#fff"/>` +
      `<circle cx="17" cy="25" r="2" fill="${INK}"/><circle cx="27" cy="25" r="2" fill="${INK}"/><circle cx="22" cy="30" r="1.8" fill="${INK}"/>` +
      `<ellipse cx="22" cy="10" rx="6" ry="3" fill="${c.b}" transform="rotate(-20 22 10)"/>`,
    fish: c => `<path d="M8 30 L-2 20 L-2 40Z" fill="${c.b}"/><ellipse cx="22" cy="30" rx="17" ry="12" fill="${c.a}"/><path d="M18 18 Q24 10 30 19Z" fill="${c.b}"/>` +
      `<circle cx="31" cy="27" r="3.2" fill="#fff"/><circle cx="32" cy="27" r="1.8" fill="${INK}"/><path d="M36 33 Q38 35 36 36" stroke="${INK}" fill="none" stroke-width="1.5"/>` +
      `<circle cx="44" cy="16" r="3" fill="none" stroke="#bfe9ff"/><circle cx="48" cy="8" r="2" fill="none" stroke="#bfe9ff"/>`,
    slime: (c, u) => `<defs><linearGradient id="${u}sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.c}"/><stop offset="1" stop-color="${c.a}"/></linearGradient></defs>` +
      `<path d="M4 48 Q2 22 26 14 Q50 22 48 48 Q26 54 4 48Z" fill="url(#${u}sl)" opacity=".92"/><ellipse cx="16" cy="26" rx="5" ry="3" fill="#fff" opacity=".7"/>` +
      `<circle cx="19" cy="36" r="3" fill="${INK}"/><circle cx="33" cy="36" r="3" fill="${INK}"/><path d="M23 42 Q26 45 29 42" stroke="${INK}" fill="none" stroke-width="1.5"/>` +
      `<path d="${star(34, 24, 4, 1.6)}" fill="#fff" class="tw"/>`,
    bunny: c => `<ellipse cx="18" cy="12" rx="5" ry="13" fill="${c.a}" stroke="#eadbe4"/><ellipse cx="32" cy="12" rx="5" ry="13" fill="${c.a}" stroke="#eadbe4"/><ellipse cx="18" cy="13" rx="2.4" ry="9" fill="${c.b}"/><ellipse cx="32" cy="13" rx="2.4" ry="9" fill="${c.b}"/>` +
      `<ellipse cx="25" cy="42" rx="17" ry="12" fill="${c.a}" stroke="#eadbe4"/><circle cx="25" cy="30" r="13" fill="${c.a}" stroke="#eadbe4"/>` +
      `<circle cx="20" cy="29" r="2" fill="${INK}"/><circle cx="30" cy="29" r="2" fill="${INK}"/><ellipse cx="17" cy="34" rx="3" ry="1.8" fill="${c.b}"/><ellipse cx="33" cy="34" rx="3" ry="1.8" fill="${c.b}"/><path d="M23 33 Q25 35 27 33" stroke="${INK}" fill="none"/>`,
    ghost: c => `<path d="M8 48 L8 24 Q8 4 26 4 Q44 4 44 24 L44 48 L38 43 L32 49 L26 43 L20 49 L14 43Z" fill="#f4f0ff" opacity=".95"/>` +
      `<ellipse cx="20" cy="24" rx="3" ry="4" fill="${c.d}"/><ellipse cx="32" cy="24" rx="3" ry="4" fill="${c.d}"/><ellipse cx="16" cy="31" rx="3" ry="1.8" fill="${c.e}" opacity=".5"/><ellipse cx="36" cy="31" rx="3" ry="1.8" fill="${c.e}" opacity=".5"/><ellipse cx="26" cy="32" rx="2.5" ry="3" fill="${c.d}"/>`,
    robot: (c, u) => `<path d="M26 10 L26 2" stroke="#8a93a6" stroke-width="2"/><circle cx="26" cy="2" r="3" fill="${c.b}" filter="url(#${u}gl)" class="tw"/>` +
      `<rect x="9" y="10" width="34" height="24" rx="7" fill="#cfd8e6" stroke="#8a93a6" stroke-width="1.5"/><rect x="13" y="15" width="26" height="12" rx="5" fill="#141029"/>` +
      `<circle cx="20" cy="21" r="2.6" fill="${c.a}" filter="url(#${u}gl)"/><circle cx="32" cy="21" r="2.6" fill="${c.a}" filter="url(#${u}gl)"/>` +
      `<rect x="14" y="35" width="24" height="12" rx="4" fill="#b6c1d3"/><circle cx="18" cy="50" r="4" fill="#4b5563"/><circle cx="34" cy="50" r="4" fill="#4b5563"/><path d="M22 40 L30 40" stroke="${c.b}" stroke-width="2"/>`,
    cat: c => `<ellipse cx="26" cy="42" rx="17" ry="12" fill="#fff" stroke="#e6dde0"/><circle cx="26" cy="26" r="15" fill="#fff" stroke="#e6dde0"/>` +
      `<path d="M13 18 L12 6 L22 13Z M39 18 L40 6 L30 13Z" fill="#fff" stroke="#e6dde0"/><path d="M14 16 L14 9 L19 13Z" fill="#ffb7c9"/><circle cx="34" cy="20" r="5" fill="#ffa94d" opacity=".8"/>` +
      `<path d="M18 26 Q20 23 22 26 M30 26 Q32 23 34 26" stroke="${INK}" fill="none" stroke-width="1.8"/><path d="M23 31 Q26 34 29 31" stroke="${INK}" fill="none"/>` +
      `<path d="M12 38 Q26 44 40 38" stroke="${c.b}" stroke-width="3" fill="none"/><circle cx="26" cy="42" r="3.2" fill="${c.e}"/>` +
      `<g class="wave"><ellipse cx="44" cy="22" rx="5" ry="7" fill="#fff" stroke="#e6dde0"/></g>`,
    dragon: (c, u) => `<path d="M34 30 Q52 14 50 36 Q46 30 38 36Z" fill="${c.b}" class="flap-r"/><path d="M8 40 Q-4 50 4 54 Q8 46 14 46Z" fill="${c.a}"/>` +
      `<ellipse cx="24" cy="40" rx="15" ry="11" fill="${c.a}"/><ellipse cx="24" cy="43" rx="9" ry="7" fill="${c.c}"/><circle cx="24" cy="22" r="12" fill="${c.a}"/>` +
      `<path d="M16 13 L12 3 L20 10Z M32 13 L36 3 L28 10Z" fill="${c.c}"/><circle cx="19" cy="21" r="2.6" fill="#fff"/><circle cx="29" cy="21" r="2.6" fill="#fff"/><circle cx="19.5" cy="21.5" r="1.5" fill="${INK}"/><circle cx="29.5" cy="21.5" r="1.5" fill="${INK}"/>` +
      `<path d="M21 28 Q24 30 27 28" stroke="${INK}" fill="none"/><path d="M36 26 Q44 22 46 26 Q42 27 44 30 Q40 28 36 29Z" fill="${c.c}" filter="url(#${u}gl)" class="flicker"/>`,
    phoenix: (c, u) => `<defs><linearGradient id="${u}px" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".5" stop-color="${c.c}"/><stop offset="1" stop-color="${c.a}"/></linearGradient></defs>` +
      `<g filter="url(#${u}gl)"><path class="flicker" d="M18 38 Q0 58 -4 50 Q4 46 2 40 Q-6 44 -8 34 Q4 36 12 30Z" fill="${c.a}"/><path class="flicker" style="animation-delay:.3s" d="M22 40 Q14 60 22 58 Q24 50 30 44Z" fill="${c.c}"/>` +
      `<path class="flap-l" d="M20 30 Q0 10 6 2 Q14 12 26 20Z" fill="url(#${u}px)"/><path class="flap-r" d="M32 30 Q52 10 46 2 Q38 12 28 20Z" fill="url(#${u}px)"/>` +
      `<ellipse cx="26" cy="32" rx="10" ry="12" fill="url(#${u}px)"/><circle cx="26" cy="18" r="8" fill="url(#${u}px)"/><path d="M24 11 Q22 2 28 0 Q26 6 30 10Z" fill="${c.c}"/>` +
      `<circle cx="24" cy="17" r="1.8" fill="${INK}"/><circle cx="29" cy="17" r="1.8" fill="${INK}"/><path d="M25 21 L27 24 L29 21Z" fill="#ff9e3d"/></g>`,
  };

  /* ---------------- MONTAGEM ---------------- */
  function variantWrap(content, v, u) {
    if (!content) return '';
    if (v === 1) return `<g filter="url(#${u}alt)">${content}</g>`;
    if (v === 2) return `<g filter="url(#${u}pr)">${content}</g>`;
    return content;
  }

  function layers(char, u) {
    const eq = char.eq || {};
    const get = s => eq[s] && ITEMS[eq[s].id] ? { it: ITEMS[eq[s].id], v: eq[s].v || 0 } : null;
    const S = char.skin || SKINS[1];
    const L = {};
    const h = get('hair'); if (h) { const r = hair(h.it, u); L.hairBack = variantWrap(r.back, h.v, u); L.hairFront = variantWrap(r.front, h.v, u); }
    const e = get('eyes'); L.eyes = e ? variantWrap((EYES[e.it.tpl] || EYES.round)(e.it.colors, u), e.v, u) : EYES.round({ a: '#6b4226' }, u);
    const o = get('outfit'); L.outfit = o ? variantWrap((OUTFIT[o.it.tpl] || OUTFIT.tee)(o.it.colors, u), o.v, u) : BASE_OUTFIT;
    const t = get('hat'); if (t) L.hat = variantWrap((HAT[t.it.tpl] || HAT.bow)(t.it.colors, u), t.v, u);
    const f = get('face'); if (f) L.face = variantWrap((FACE[f.it.tpl] || FACE.glasses)(f.it.colors, u), f.v, u);
    const a = get('aura'); if (a) { const r = (AURA[a.it.tpl] || AURA.fireflies)(a.it.colors, u); L.auraBack = variantWrap(r.back, a.v, u); L.auraFront = variantWrap(r.front, a.v, u); }
    const p = get('pet'); if (p) L.pet = variantWrap((PET[p.it.tpl] || PET.slime)(p.it.colors, u), p.v, u);

    const body =
      `<rect x="84" y="204" width="13" height="38" rx="6" fill="${S}"/><rect x="103" y="204" width="13" height="38" rx="6" fill="${S}"/>` +
      `<ellipse cx="90" cy="243" rx="10" ry="6" fill="#3a2f45"/><ellipse cx="110" cy="243" rx="10" ry="6" fill="#3a2f45"/>` +
      `<path d="M74 154 L60 196" stroke="${S}" stroke-width="13" stroke-linecap="round"/><path d="M126 154 L140 196" stroke="${S}" stroke-width="13" stroke-linecap="round"/>` +
      `<path d="M72 150 Q100 142 128 150 L134 210 Q100 216 66 210Z" fill="${S}"/>` +
      `<rect x="92" y="126" width="16" height="26" rx="6" fill="${shade(S, -10)}"/>`;
    const head =
      `<ellipse cx="48" cy="100" rx="7" ry="10" fill="${S}"/><ellipse cx="152" cy="100" rx="7" ry="10" fill="${S}"/>` +
      `<ellipse cx="100" cy="92" rx="52" ry="48" fill="${S}"/>` +
      (char.blush === false ? '' : `<ellipse cx="68" cy="118" rx="8" ry="4.5" fill="#ff8fa3" opacity=".45"/><ellipse cx="132" cy="118" rx="8" ry="4.5" fill="#ff8fa3" opacity=".45"/>`);
    return { L, body, head, mouth: MOUTH[char.mouth] || MOUTH.smile };
  }

  function dollInner(char, u, opts = {}) {
    const { L, body, head, mouth } = layers(char, u);
    return defs(u) +
      (L.auraBack || '') + (L.hairBack || '') + body + L.outfit + head + L.eyes + mouth +
      (L.face || '') + (L.hairFront || '') + (L.hat || '') + (L.auraFront || '') +
      (L.pet && !opts.noPet ? `<g transform="translate(146 200)"><g class="bob">${L.pet}</g></g>` : '');
  }

  function doll(char, opts = {}) {
    const u = uid();
    const vb = opts.viewBox || '0 -4 200 266';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="${opts.cls || 'doll'}" preserveAspectRatio="xMidYMid meet">${dollInner(char, u, opts)}</svg>`;
  }

  const MANNEQUIN_SKIN = '#f6c9a3';
  const THUMB_VB = {
    hair: '26 -2 148 150', eyes: '52 78 96 50', hat: '14 -8 172 110', face: '40 72 120 68',
    outfit: '36 132 128 118', aura: '0 -4 200 266', pet: '140 196 64 64',
  };
  function charThumb(item, v = 0) {
    const eq = { hair: { id: 'h_cast' }, eyes: { id: 'e_basic' } };
    eq[item.slot] = { id: item.id, v };
    const u = uid();
    let inner;
    if (item.slot === 'pet') {
      inner = defs(u) + `<g transform="translate(146 200)"><g class="bob">${variantWrap(PET[item.tpl](item.colors, u), v, u)}</g></g>`;
    } else if (item.slot === 'aura') {
      inner = dollInner({ skin: MANNEQUIN_SKIN, eq, mouth: 'smile' }, u);
    } else {
      inner = dollInner({ skin: MANNEQUIN_SKIN, eq, mouth: 'smile' }, u, { noPet: true });
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${THUMB_VB[item.slot]}" class="thumb-svg" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
  }

  return { uid, rng, shade, star, heart, defs, doll, dollInner, charThumb, EYES, HAIR, OUTFIT, HAT, FACE, AURA, PET, MOUTH };
})();
