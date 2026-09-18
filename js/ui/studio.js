/* ============ ESTÚDIO: cenas com personagens, mascotes, objetos, falas e narrador ============
   Cena em coordenadas 800×450. Personagens referenciam os 10 principais (edições valem para ambos).
   Salvar uma cena guarda cópias dos personagens; carregar restaura essas cópias nos mesmos lugares. */

const Studio = (() => {
  const W = 800, H = 450, MAX_PETS = 20, MAX_OBJS = 30, SLOTS = 15;
  let sel = null, panel = null, viewMode = false, poseCat = POSE_CATS[0];
  const el = () => $('#scr-studio');
  const st = () => Store.s.studio;
  const list = k => k === 'c' ? st().chars : k === 'p' ? st().pets : st().objs;
  const selEnt = () => sel && list(sel.k)[sel.i];
  const nextZ = () => 1 + Math.max(0, ...['c', 'p', 'o'].flatMap(k => list(k).map(e => e.z || 0)));

  function open(p = null) {
    App.show('studio');
    if (!st().chars.length) st().chars.push({ ci: Store.s.cur, x: 400, y: 425, s: 1, f: 0, z: 1, b: 0 });
    sel = null; panel = p; viewMode = false;
    render();
  }

  /* ---------- Texto em SVG ---------- */
  function wrap(text, max) {
    const out = []; let cur = '';
    for (const w of String(text || '').split(/\s+/).filter(Boolean)) {
      if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
    }
    if (cur) out.push(cur);
    return out.slice(0, 6);
  }
  function bubbleSVG(x, y, text, o) {
    const fs = o.fs || 17, lines = wrap(text, 24); if (!lines.length) return '';
    const w = Math.max(70, Math.max(...lines.map(l => l.length)) * fs * .55 + 30), h = lines.length * fs * 1.25 + 20;
    const bx = clamp(x - w / 2, 4, W - w - 4), by = Math.max(4, y - h - 16);
    const kind = o.bubble || 0, stroke = '#2b2140';
    let shape;
    if (kind === 1) shape = `<rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="${h / 2}" fill="${o.bg}" stroke="${stroke}" stroke-width="3"/><circle cx="${x - 6}" cy="${by + h + 7}" r="5" fill="${o.bg}" stroke="${stroke}" stroke-width="2"/><circle cx="${x - 2}" cy="${by + h + 15}" r="3" fill="${o.bg}" stroke="${stroke}" stroke-width="2"/>`;
    else {
      const tail = `<path d="M${x - 9} ${by + h - 2} L${x} ${by + h + 14} L${x + 9} ${by + h - 2}Z" fill="${o.bg}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
      shape = tail + `<rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="${kind === 2 ? 3 : 14}" fill="${o.bg}" stroke="${stroke}" stroke-width="${kind === 2 ? 4 : 3}" ${kind === 3 ? 'stroke-dasharray="7 5"' : ''}/><path d="M${x - 7} ${by + h - 1.5} L${x + 7} ${by + h - 1.5}" stroke="${o.bg}" stroke-width="3"/>`;
    }
    const t = lines.map((l, i) => `<text x="${bx + w / 2}" y="${by + 14 + fs * .95 + i * fs * 1.25}" text-anchor="middle" font-size="${fs}" font-family="${esc(FONTS[o.font || 0].f)}" fill="${o.color}" ${kind === 2 ? 'font-weight="700"' : ''} ${kind === 3 ? 'font-style="italic"' : ''}>${esc(l)}</text>`).join('');
    return `<g class="st-bubble">${shape}${t}</g>`;
  }

  function narratorSVG() {
    const N = st().narr;
    if (N.mode === 'off' || (N.mode === 'view' && !viewMode) || !N.text) return '';
    const fs = [16, 20, 26, 32][N.size] || 20, lines = wrap(N.text, Math.floor(730 / (fs * .52)));
    const h = lines.length * fs * 1.3 + 28, y = N.pos === 'top' ? 34 : N.pos === 'mid' ? (H - h) / 2 : H - h - 10;
    const name = N.who === -2 ? '' : N.who === -1 ? 'Narrador' : N.who === -3 ? N.custom : (Store.s.chars[N.who] || {}).name || '';
    const font = esc(FONTS[N.font || 0].f);
    return `<g class="st-narr">${name ? `<rect x="24" y="${y - 26}" width="${Math.max(90, name.length * 11 + 30)}" height="30" rx="6" fill="${N.boxColor === '#ffffff' ? '#2a3a7a' : Color.shade(N.boxColor, -35)}"/><text x="38" y="${y - 5}" font-size="18" font-weight="700" fill="${N.nameColor}" font-family="${font}">${esc(name)}</text>` : ''}
      <rect x="16" y="${y}" width="${W - 32}" height="${h}" rx="14" fill="${N.boxColor}" fill-opacity=".94" stroke="#2b2140" stroke-width="3"/>
      ${lines.map((l, i) => `<text x="34" y="${y + 18 + fs * .95 + i * fs * 1.3}" font-size="${fs}" fill="${N.textColor}" font-family="${font}">${esc(l)}</text>`).join('')}</g>`;
  }

  /* ---------- Cena ---------- */
  const CH_BOX = [-100, -300, 200, 312];
  function entSVG(k, i, e, o) {
    const tr = `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) scale(${(e.s * (e.f ? -1 : 1)).toFixed(3)} ${e.s.toFixed(3)})`;
    let inner = '', box;
    if (k === 'c') {
      const ch = Store.s.chars[e.ci]; if (!ch) return '';
      inner = `<svg x="-133.5" y="-292.4" width="267" height="320.4" viewBox="${Rig.VIEW}" overflow="visible">${Rig.inner(ch, uid(), { noShadow: false })}</svg>`; box = CH_BOX;
    } else if (k === 'p') {
      const t = PARTS.pet[e.pi]; if (!t) return '';
      inner = `<g transform="rotate(${e.r || 0} 0 -60)"><g transform="translate(-59 -123) scale(2.2)"><g class="anim-bob">${t.d({ c: e.c, F: e.c[0], u: uid() })}</g></g></g>`; box = [-66, -132, 132, 136];
    } else {
      const t = PARTS.object[e.oi]; if (!t) return '';
      inner = `<g transform="rotate(${e.r || 0} 0 ${t.box[1] / 2})">${t.d({ c: e.c, F: e.c[0], u: uid() })}</g>`; box = t.box;
    }
    const isSel = !o.export && !viewMode && sel && sel.k === k && sel.i === i;
    return `<g class="ent${isSel ? ' sel' : ''}" data-k="${k}" data-i="${i}" transform="${tr}">${isSel ? `<rect x="${box[0] - 6}" y="${box[1] - 6}" width="${box[2] + 12}" height="${box[3] + 12}" rx="10" class="st-selbox"/>` : ''}${inner}<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="transparent"/></g>`;
  }

  function sceneSVG(o = {}) {
    const S = st();
    const ents = ['c', 'p', 'o'].flatMap(k => list(k).map((e, i) => ({ k, i, e }))).sort((a, b) => (a.e.z || 0) - (b.e.z || 0) || a.e.y - b.e.y);
    let over = '';
    for (const { k, e } of ents) {
      if (k === 'c') {
        const ch = Store.s.chars[e.ci]; if (!ch) continue;
        if (S.names && !viewMode && !o.export) over += `<text x="${e.x}" y="${e.y - 286 * e.s}" class="st-name" text-anchor="middle">${esc(ch.name)}</text>`;
        if (e.b && ch.chat.text) over += bubbleSVG(e.x, e.y - 286 * e.s - (S.names && !viewMode && !o.export ? 18 : 0), ch.chat.text, { bubble: ch.chat.bubble, font: ch.chat.font, bg: ch.chat.bubbleColor, color: ch.chat.textColor });
      } else if (k === 'p' && e.chat) over += bubbleSVG(e.x, e.y - 128 * e.s, e.chat, { bg: '#ffffff', color: '#2b2140' });
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="${o.cls || 'st-svg'}" preserveAspectRatio="xMidYMid meet">
      <svg x="0" y="0" width="${W}" height="${H}" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">${Scenery.background(S.bg)}</svg>
      <g class="st-ents">${ents.map(({ k, i, e }) => entSVG(k, i, e, o)).join('')}</g>
      <svg x="0" y="0" width="${W}" height="${H}" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" pointer-events="none">${Scenery.foreground(S.bg, o.export)}</svg>
      <g class="st-over" pointer-events="none">${over}${narratorSVG()}</g>
    </svg>`;
  }

  /* ---------- Interface ---------- */
  const LEFT = [
    { k: 'home', n: 'Início', i: 'home' }, { k: 'save', n: 'Salvar/Carregar', i: 'camera' }, { k: 'bg', n: 'Fundos', i: 'image' },
    { k: 'pets', n: 'Mascotes', i: 'cat' }, { k: 'objects', n: 'Objetos', i: 'car' }, { k: 'narr', n: 'Narrador', i: 'chat' }, { k: 'view', n: 'Visualizar', i: 'eye' },
  ];
  function render() {
    const S = st();
    el().innerHTML = `<div class="studio${viewMode ? ' view' : ''}${panel ? ' has-panel' : ''}">
      <div class="st-stage" id="stStage">${sceneSVG()}</div>
      <div class="st-left">${LEFT.map(b => `<button data-left="${b.k}" class="${panel === b.k ? 'on' : ''}">${ICON[b.i]}<b>${b.n}</b></button>`).join('')}</div>
      <div class="st-right">${Store.s.chars.map((c, i) => { const on = S.chars.some(e => e.ci === i); return `<button class="st-ch${on ? ' in' : ''}${sel && sel.k === 'c' && S.chars[sel.i] && S.chars[sel.i].ci === i ? ' on' : ''}" data-ci="${i}">${Rig.portrait(c)}<small>${esc(c.name)}</small><i class="dot"></i></button>`; }).join('')}</div>
      <div class="st-actions" id="stActions">${actionsHTML()}</div>
      <div class="st-panel" id="stPanel">${panelHTML()}</div>
      ${viewMode ? `<button class="st-exitview" data-left="view" title="Sair da visualização">${ICON.eye}</button>` : ''}
    </div>`;
    el().onclick = onClick;
    bindStage();
  }
  const drawStage = () => { $('#stStage').innerHTML = sceneSVG(); };
  const drawActions = () => { $('#stActions').innerHTML = actionsHTML(); };
  const drawPanel = () => { $('#stPanel').innerHTML = panelHTML(); el().querySelector('.studio').classList.toggle('has-panel', !!panel); $$('.st-left button').forEach(b => b.classList.toggle('on', b.dataset.left === panel)); };
  const refresh = () => { drawStage(); drawActions(); drawPanel(); $$('.st-ch').forEach(b => { const i = +b.dataset.ci; b.classList.toggle('in', st().chars.some(e => e.ci === i)); b.classList.toggle('on', !!(sel && sel.k === 'c' && st().chars[sel.i] && st().chars[sel.i].ci === i)); }); };

  function actionsHTML() {
    const e = selEnt(); if (!e || viewMode) return '';
    const a = (k, label, icon = '') => `<button data-a="${k}">${icon}<b>${label}</b></button>`;
    const scale = `<div class="st-scale"><button data-a="sdown">−</button><b>x${e.s.toFixed(1)}</b><button data-a="sup">+</button></div>`;
    const common = a('flip', 'Virar', '⇆') + scale + a('front', 'Frente', '⤒') + a('back', 'Trás', '⤓');
    if (sel.k === 'c') return a('remove', 'Remover', '✕') + a('edit', 'Editar', '»') + a('chat', 'Fala', ICON.chat) + a('face', 'Rosto', '☺') + a('pose', 'Pose', ICON.stand) + common;
    const rot = a('rl', 'Girar', '↺') + a('rr', 'Girar', '↻');
    if (sel.k === 'p') return a('remove', 'Remover', '✕') + a('pchat', 'Fala', ICON.chat) + a('colors', 'Cores', '🎨') + a('pname', 'Nome', '✎') + common + rot;
    return a('remove', 'Remover', '✕') + a('colors', 'Cores', '🎨') + a('dup', 'Duplicar', '⧉') + common + rot;
  }

  function panelHTML() {
    if (!panel || viewMode) return '';
    const head = t => `<div class="st-ph"><b>${t}</b><button class="xbtn" data-pclose aria-label="Fechar">✕</button></div>`;
    const S = st();
    if (panel === 'pose') {
      const e = selEnt(), ch = e && Store.s.chars[e.ci]; if (!ch) return '';
      return head('Pose · ' + esc(ch.name)) + `<div class="chips">${POSE_CATS.map(c => `<button class="chip${c === poseCat ? ' on' : ''}" data-posecat="${c}">${c}</button>`).join('')}</div>
        <div class="pose-grid">${POSES.map((p, i) => [p, i]).filter(([p]) => p.c === poseCat).map(([p, i]) => `<button class="pz${ch.body.pose === i ? ' on' : ''}" data-pose="${i}">${Rig.poseThumb(i)}<small>${esc(p.n)}</small></button>`).join('')}</div>`;
    }
    if (panel === 'face') {
      const e = selEnt(), ch = e && Store.s.chars[e.ci]; if (!ch) return '';
      return head('Rosto · ' + esc(ch.name)) + `<div class="expr-grid">${EXPRESSIONS.map((x, i) => { const t = clone(ch); Panels.applyExpr(t, x); Object.assign(t.body, { pose: 0, rot: 0, flip: 0, headRot: 0 }); t.chat.emote = 0; return `<button class="pz" data-expr="${i}">${Rig.render(t, { viewBox: '70 56 160 150', cls: 'thumb still', noPet: true, noShadow: true })}<small>${x.n}</small></button>`; }).join('')}</div>
        <h4>Emote</h4><div class="emotes">${EMOTES.map((m, i) => `<button class="${ch.chat.emote === i ? 'on' : ''}" data-emote="${i}">${m || '∅'}</button>`).join('')}</div>`;
    }
    if (panel === 'pets') return head(`Mascotes <small class="muted">${S.pets.length}/${MAX_PETS}</small>`) + `<p class="hint">Toque para colocar na cena. Toque no mascote na cena para editar.</p><div class="pick-grid">${PARTS.pet.map((t, i) => i ? `<button class="pz" data-addpet="${i}"><svg viewBox="-6 -6 66 66" class="thumb still">${t.d({ c: petColors(i), F: petColors(i)[0], u: uid() })}</svg><small>${esc(t.n)}</small></button>` : '').join('')}</div>`;
    if (panel === 'objects') return head(`Objetos <small class="muted">${S.objs.length}/${MAX_OBJS}</small>`) + `<p class="hint">Toque para colocar na cena e arraste para posicionar.</p><div class="pick-grid">${PARTS.object.map((t, i) => i ? `<button class="pz" data-addobj="${i}"><svg viewBox="${t.box[0] - 10} ${t.box[1] - 10} ${t.box[2] + 20} ${t.box[3] + 20}" class="thumb still">${t.d({ c: objColors(i), F: objColors(i)[0], u: uid() })}</svg><small>${esc(t.n)}</small></button>` : '').join('')}</div>`;
    if (panel === 'narr') {
      const N = S.narr;
      const who = [[-2, 'Nenhum'], [-1, '"Narrador"'], [-3, 'Personalizado']];
      return head('Narrador') + `<div class="seg">${who.map(([v, n]) => `<button class="${N.who === v ? 'on' : ''}" data-who="${v}">${n}</button>`).join('')}</div>
        <div class="st-who">${Store.s.chars.map((c, i) => `<button class="${N.who === i ? 'on' : ''}" data-who="${i}" title="${esc(c.name)}">${Rig.portrait(c)}</button>`).join('')}</div>
        <button class="btn wide" data-narrtext>✏️ ${N.text ? 'Editar texto' : 'Escrever texto'}</button>
        <h4>Mostrar narração</h4><div class="seg">${[['off', 'Não'], ['view', 'Só visualizando'], ['always', 'Sempre']].map(([v, n]) => `<button class="${N.mode === v ? 'on' : ''}" data-nmode="${v}">${n}</button>`).join('')}</div>
        <h4>Posição</h4><div class="seg">${[['bottom', 'Embaixo'], ['mid', 'Meio'], ['top', 'Em cima']].map(([v, n]) => `<button class="${N.pos === v ? 'on' : ''}" data-npos="${v}">${n}</button>`).join('')}</div>
        <div class="num-grid" style="margin-top:10px">
          <div class="num"><span>Tamanho</span><div><button class="arr" data-nsize="-1">‹</button><b>${N.size + 1}/4</b><button class="arr" data-nsize="1">›</button></div></div>
          <div class="num"><span>Fonte</span><div><button class="arr" data-nfont="-1">‹</button><b>${FONTS[N.font].n}</b><button class="arr" data-nfont="1">›</button></div></div>
        </div>
        <div class="bar-row"><span>Cores</span><div class="sws"><button class="sw" data-ncol="nameColor" style="background:${N.nameColor}" title="Nome"></button><button class="sw" data-ncol="textColor" style="background:${N.textColor}" title="Texto"></button><button class="sw" data-ncol="boxColor" style="background:${N.boxColor}" title="Caixa"></button></div><small class="muted">nome · texto · caixa</small></div>
        ${toggleHTML('names', 'Nomes sobre os personagens', S.names)}`;
    }
    if (panel === 'colors') {
      const e = selEnt(); if (!e) return '';
      return head('Cores') + `<div id="stCp"></div>`;
    }
    return '';
  }
  const toggleHTML = (k, label, on) => `<button class="tgl${on ? ' on' : ''}" data-stgl="${k}"><span>${label}</span><i>${on ? 'ON' : 'OFF'}</i></button>`;
  const petColors = i => { const c = OBJ_COLORS[i % OBJ_COLORS.length]; return [Color.mix(c[0], '#ffffff', .45), c[1], OUTLINE]; };
  const objColors = i => { const c = OBJ_COLORS[i % OBJ_COLORS.length]; return [c[0], c[1], OUTLINE]; };

  /* ---------- Ações ---------- */
  function change(fn, what = 'all') {
    fn(); Store.save();
    if (what === 'stage') drawStage(); else refresh();
  }
  function addEnt(k, e) {
    const arr = list(k), max = k === 'p' ? MAX_PETS : MAX_OBJS;
    if (arr.length >= max) { Sfx.play('error'); UI.toast(`Máximo de ${max}`); return; }
    const j = () => (Math.random() - .5) * 160;
    arr.push(Object.assign({ x: 400 + j(), y: 400 + j() / 6, s: 1, f: 0, r: 0, z: nextZ() }, e));
    sel = { k, i: arr.length - 1 }; Sfx.play('pick'); Store.save(); refresh();
  }
  function toggleChar(ci) {
    const S = st(), idx = S.chars.findIndex(e => e.ci === ci);
    if (idx >= 0) {
      if (sel && sel.k === 'c' && sel.i === idx) { S.chars.splice(idx, 1); sel = null; Sfx.play('close'); }
      else { sel = { k: 'c', i: idx }; Sfx.play('tap'); }
    } else {
      const n = S.chars.length;
      S.chars.push({ ci, x: 90 + ((n * 150) % 640), y: 425, s: 1, f: 0, z: nextZ(), b: 0 });
      sel = { k: 'c', i: S.chars.length - 1 }; Sfx.play('pick');
    }
    if (panel === 'pose' || panel === 'face' || panel === 'colors') panel = null;
    Store.save(); refresh();
  }

  function onClick(ev) {
    const b = ev.target.closest('button'); if (!b) return;
    const d = b.dataset, S = st(), e = selEnt();
    if (d.left) return leftAction(d.left);
    if (d.ci != null) return toggleChar(+d.ci);
    if (d.pclose != null) { panel = null; Sfx.play('close'); return refresh(); }
    if (d.a) return entAction(d.a);
    if (d.posecat) { poseCat = d.posecat; return drawPanel(); }
    if (d.pose != null && e) { Store.s.chars[e.ci].body.pose = +d.pose; Sfx.play('pick'); Store.save(); drawStage(); $$('.st-panel .pz').forEach(x => x.classList.toggle('on', x === b)); return; }
    if (d.expr != null && e) { Panels.applyExpr(Store.s.chars[e.ci], EXPRESSIONS[+d.expr]); Sfx.play('pick'); return change(() => { }, 'stage'); }
    if (d.emote != null && e) { Store.s.chars[e.ci].chat.emote = +d.emote; Sfx.play('pick'); return change(() => { }); }
    if (d.addpet) return addEnt('p', { pi: +d.addpet, c: petColors(+d.addpet), name: PARTS.pet[+d.addpet].n, chat: '' });
    if (d.addobj) return addEnt('o', { oi: +d.addobj, c: objColors(+d.addobj) });
    // Narrador
    const N = S.narr;
    if (d.who != null) {
      const v = +d.who;
      if (v === -3) return UI.prompt(N.custom, { max: 20, placeholder: 'Nome do narrador' }).then(t => { if (t != null) change(() => { N.who = -3; N.custom = t.trim(); }); });
      return change(() => { N.who = v; });
    }
    if (d.narrtext != null) return UI.prompt(N.text, { max: 240, multiline: true, placeholder: 'O que o narrador diz?' }).then(t => { if (t != null) change(() => { N.text = t.trim(); if (N.text && N.mode === 'off') N.mode = 'always'; }); });
    if (d.nmode) return change(() => { N.mode = d.nmode; });
    if (d.npos) return change(() => { N.pos = d.npos; });
    if (d.nsize) return change(() => { N.size = (N.size + +d.nsize + 4) % 4; });
    if (d.nfont) return change(() => { N.font = (N.font + +d.nfont + FONTS.length) % FONTS.length; });
    if (d.ncol) { const k = d.ncol; panel = 'narr'; return ColorPicker.open($('#stPanel'), { title: 'Cores do narrador', targets: [{ label: { nameColor: 'Nome', textColor: 'Texto', boxColor: 'Caixa' }[k], get: () => N[k], set: v => { N[k] = v; Store.save(); drawStage(); } }], onClose: drawPanel }); }
    if (d.stgl === 'names') return change(() => { S.names = S.names ? 0 : 1; });
  }

  function leftAction(k) {
    Sfx.play('tap');
    switch (k) {
      case 'home': UI.loading(350).then(() => { App.show('menu'); Menu.render(); }); return;
      case 'save': return saveLoad();
      case 'bg': return Modals.backgrounds(st().bg, () => { Store.save(); drawStage(); });
      case 'view': viewMode = !viewMode; sel = viewMode ? null : sel; if (viewMode) panel = null; return render();
      default: panel = panel === k ? null : k; return refresh();
    }
  }

  function entAction(a) {
    const e = selEnt(); if (!e) return;
    const k = sel.k;
    switch (a) {
      case 'remove': list(k).splice(sel.i, 1); sel = null; panel = null; Sfx.play('close'); break;
      case 'edit': return quickJump(e.ci);
      case 'chat': {
        const ch = Store.s.chars[e.ci];
        return UI.prompt(ch.chat.text, { max: 120, multiline: true, placeholder: 'O que ' + ch.name + ' diz?' }).then(t => { if (t != null) change(() => { ch.chat.text = t.trim(); e.b = t.trim() ? 1 : 0; }); });
      }
      case 'pchat': return UI.prompt(e.chat, { max: 80, placeholder: 'Fala do mascote' }).then(t => { if (t != null) change(() => { e.chat = t.trim(); }); });
      case 'pname': return UI.prompt(e.name, { max: 16 }).then(t => { if (t != null && t.trim()) change(() => { e.name = t.trim(); }); });
      case 'face': case 'pose': panel = panel === a ? null : a; break;
      case 'colors':
        panel = 'colors'; refresh();
        return ColorPicker.open($('#stPanel'), { title: 'Cores', targets: ['Principal', 'Secundária', 'Contorno'].map((n, i) => ({ label: n, get: () => e.c[i], set: v => { e.c[i] = v; Store.save(); drawStage(); } })), onClose: () => { panel = null; refresh(); } });
      case 'dup': list(k).push(Object.assign(clone(e), { x: e.x + 30, y: e.y + 4, z: nextZ() })); sel = { k, i: list(k).length - 1 }; break;
      case 'flip': e.f = e.f ? 0 : 1; break;
      case 'sup': e.s = clamp(Math.round((e.s + .1) * 10) / 10, .3, 3); break;
      case 'sdown': e.s = clamp(Math.round((e.s - .1) * 10) / 10, .3, 3); break;
      case 'front': e.z = nextZ(); break;
      case 'back': { const all = ['c', 'p', 'o'].flatMap(x => list(x)); const min = Math.min(...all.map(x => x.z || 0)); e.z = min - 1; break; }
      case 'rl': e.r = ((e.r || 0) - 15 + 540) % 360 - 180; break;
      case 'rr': e.r = ((e.r || 0) + 15 + 540) % 360 - 180; break;
    }
    Sfx.play('tap'); Store.save(); refresh();
  }

  /* Atalho para o editor (como o "Quick Jump" do jogo de referência) */
  function quickJump(ci) {
    const J = [['presets', null, 'Predefinidos', 'person'], ['body', null, 'Corpo', 'body'], ['head', 'hair', 'Cabelo', 'hair'], ['head', 'eyes', 'Olhos', 'eye'], ['head', 'face', 'Rosto', 'chat'], ['head', 'adj', 'Ajustar', 'zoomIn'],
      ['clothes', 'hats', 'Chapéus', 'hair'], ['clothes', 'acc', 'Acessórios', 'star'], ['clothes', 'upper', 'Superior', 'shirt'], ['clothes', 'lower', 'Inferior', 'body'], ['clothes', 'other', 'Extras', 'cat'], ['clothes', 'adj', 'Ajustar', 'zoomIn'],
      ['other', 'props', 'Itens', 'sword'], ['other', 'effects', 'Efeitos', 'star'], ['profile', null, 'Perfil', 'profile']];
    UI.modal({
      title: 'Ir para o editor', cls: 'jump-modal',
      body: `<div class="jump-grid">${J.map((j, n) => `<button data-j="${n}">${ICON[j[3]]}<b>${j[2]}</b></button>`).join('')}</div>`,
      onOpen: (root, close) => root.addEventListener('click', ev => {
        const b = ev.target.closest('[data-j]'); if (!b) return;
        const j = J[+b.dataset.j]; close();
        Store.s.cur = ci; Store.save(); Editor.open(j[0], j[1], 'studio');
      }),
    });
  }

  /* ---------- Salvar / carregar cenas ---------- */
  function saveLoad() {
    const S = Store.s; let slot = 0;
    const thumb = sc => { const keep = S.studio; S.studio = sc.studio; const s = sceneSVG({ export: true, cls: 'thumb still' }); S.studio = keep; return s; };
    const draw = root => {
      $('.modal-body', root).innerHTML = `<div class="scene-slots">${S.scenes.map((sc, i) => `<button class="scs${i === slot ? ' on' : ''}${sc ? '' : ' empty'}" data-slot="${i}">${sc ? thumb(sc) : `<span>Vazio</span>`}<small>${sc ? esc(sc.name) : 'Cena ' + (i + 1)}</small></button>`).join('')}</div>
        <div class="btn-row"><button class="btn primary" data-sa="save">💾 Salvar aqui</button><button class="btn" data-sa="load" ${S.scenes[slot] ? '' : 'disabled'}>📂 Carregar</button><button class="btn" data-sa="png">📸 Salvar PNG</button><button class="btn" data-sa="new">🆕 Cena nova</button><button class="btn danger" data-sa="del" ${S.scenes[slot] ? '' : 'disabled'}>🗑️</button></div>
        <p class="hint">Salvar guarda o cenário e uma cópia dos personagens da cena. Carregar restaura esses personagens como estavam.</p>`;
    };
    UI.modal({
      title: 'Salvar / Carregar', cls: 'scenes-modal', onOpen: (root, close) => {
        draw(root);
        root.addEventListener('click', ev => {
          const b = ev.target.closest('button'); if (!b || !b.closest('.modal-body')) return;
          if (b.dataset.slot != null) { slot = +b.dataset.slot; Sfx.play('tap'); return draw(root); }
          const act = b.dataset.sa; if (!act) return;
          if (act === 'save') {
            const doSave = name => { S.scenes[slot] = { name, date: Date.now(), studio: clone(S.studio), chars: Object.fromEntries(S.studio.chars.map(e => [e.ci, clone(S.chars[e.ci])])) }; Store.save(); Sfx.play('save'); UI.toast('💾 Cena salva!'); Store.addXp(10); draw(root); };
            return UI.prompt(S.scenes[slot] ? S.scenes[slot].name : 'Cena ' + (slot + 1), { max: 24 }).then(n => { if (n != null) doSave(n.trim() || 'Cena ' + (slot + 1)); });
          }
          if (act === 'load') return UI.confirm('Carregar esta cena? Os personagens dela voltam a ficar como estavam quando foi salva.', 'Carregar').then(ok => {
            if (!ok) return; const sc = S.scenes[slot];
            S.studio = Object.assign(defaultStudio(), clone(sc.studio));
            for (const [ci, ch] of Object.entries(sc.chars || {})) S.chars[+ci] = Store.fixChar(clone(ch));
            Store.save(); sel = null; panel = null; close(); render(); UI.toast('📂 Cena carregada');
          });
          if (act === 'png') { close(); return exportPNG(); }
          if (act === 'new') return UI.confirm('Começar uma cena vazia? (as cenas salvas continuam guardadas)', 'Nova cena').then(ok => { if (ok) { S.studio = defaultStudio(); Store.save(); sel = null; close(); open(); } });
          if (act === 'del') return UI.confirm(`Apagar <b>${esc(S.scenes[slot].name)}</b>?`, 'Apagar', 'danger').then(ok => { if (ok) { S.scenes[slot] = null; Store.save(); draw(root); } });
        });
      },
    });
  }
  function exportPNG() {
    const was = viewMode; viewMode = true;
    const svg = sceneSVG({ export: true });
    viewMode = was;
    UI.exportPNG(svg, 1600, 900, 'cena-atelie', '#120c2a');
  }

  /* ---------- Arrastar, pinça e roda do mouse ---------- */
  function bindStage() {
    const box = $('#stStage');
    let drag = null; const pts = new Map();
    const svgEl = () => box.querySelector('svg');
    const toSvg = (x, y) => { const s = svgEl(), p = s.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(s.getScreenCTM().inverse()); };
    const gOf = () => box.querySelector(`.ent[data-k="${sel.k}"][data-i="${sel.i}"]`);
    const applyT = (g, e) => g && g.setAttribute('transform', `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) scale(${(e.s * (e.f ? -1 : 1)).toFixed(3)} ${e.s.toFixed(3)})`);
    box.onpointerdown = ev => {
      if (viewMode) return;
      pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (pts.size === 2 && drag) { const [a, b] = [...pts.values()]; drag.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: selEnt().s }; return; }
      const g = ev.target.closest('.ent');
      if (!g) { if (sel) { sel = null; if (['pose', 'face', 'colors'].includes(panel)) panel = null; refresh(); } return; }
      const k = g.dataset.k, i = +g.dataset.i;
      if (!sel || sel.k !== k || sel.i !== i) { sel = { k, i }; if (['pose', 'face', 'colors'].includes(panel) && k !== 'c') panel = null; refresh(); }
      const e = selEnt(), p = toSvg(ev.clientX, ev.clientY);
      drag = { ox: p.x - e.x, oy: p.y - e.y, moved: false };
      box.setPointerCapture(ev.pointerId); ev.preventDefault();
    };
    box.onpointermove = ev => {
      if (!pts.has(ev.pointerId)) return;
      pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (!drag || !sel) return;
      const e = selEnt();
      if (drag.pinch && pts.size >= 2) { const [a, b] = [...pts.values()]; e.s = clamp(drag.pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / drag.pinch.d, .3, 3); }
      else { const p = toSvg(ev.clientX, ev.clientY); e.x = clamp(p.x - drag.ox, -50, W + 50); e.y = clamp(p.y - drag.oy, 40, H + 200); }
      if (!drag.moved) { drag.moved = true; svgEl().classList.add('dragging'); }
      applyT(gOf(), e);
    };
    const end = ev => {
      pts.delete(ev.pointerId);
      if (drag && pts.size === 0) { if (drag.moved) { Store.save(); drawStage(); drawActions(); } drag = null; }
      else if (drag) drag.pinch = null;
    };
    box.onpointerup = end; box.onpointercancel = end;
    box.onwheel = ev => {
      const e = selEnt(); if (!e || viewMode) return;
      ev.preventDefault();
      e.s = clamp(e.s * (ev.deltaY < 0 ? 1.06 : 1 / 1.06), .3, 3); applyT(gOf(), e);
      clearTimeout(box._t); box._t = setTimeout(() => { Store.save(); drawStage(); drawActions(); }, 250);
    };
    if (viewMode) box.onclick = () => { };
  }

  /* Atalhos de teclado */
  function key(ev) {
    const e = selEnt(); if (!e) return false;
    const step = ev.shiftKey ? 20 : 5;
    const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[ev.key];
    if (mv) { e.x += mv[0]; e.y += mv[1]; Store.save(); drawStage(); return true; }
    const map = { Delete: 'remove', Backspace: 'remove', '+': 'sup', '=': 'sup', '-': 'sdown', f: 'flip', F: 'flip', PageUp: 'front', PageDown: 'back' };
    if (map[ev.key]) { entAction(map[ev.key]); return true; }
    return false;
  }

  return { open, key, exportPNG, get view() { return viewMode; }, set view(v) { viewMode = v; render(); } };
})();

function defaultStudio() {
  return {
    bg: { bg: 1, color: '#6b4cff', fg: 0, tint: 0, tintColor: '#000000', mx: 0, my: 0, scale: 1 },
    chars: [], pets: [], objs: [], names: 1,
    narr: { mode: 'always', pos: 'bottom', who: -1, custom: '', text: '', size: 1, font: 0, nameColor: '#ffffff', textColor: '#2b2140', boxColor: '#ffffff' },
  };
}
