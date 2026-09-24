/* ============ PAINÉIS DO EDITOR ============ */

const Panels = (() => {
  let mode = null, poseCat = POSE_CATS[0], club = -1, copyMode = 'all', adjSlot = null;
  let PRE = null;
  const box = () => $('#edPanel');
  const ch = () => Editor.ch();
  const linked = () => !!Store.s.settings.linkPairs;
  const RIGHT = new Set(Object.values(PAIRS));

  const SUBS = {
    head: [['hair', 'Cabelo'], ['eyes', 'Olhos'], ['face', 'Rosto'], ['expr', 'Expressões'], ['adj', 'Ajustar']],
    clothes: [['hats', 'Chapéus'], ['acc', 'Acessórios'], ['upper', 'Superior'], ['lower', 'Inferior'], ['other', 'Extras'], ['adj', 'Ajustar']],
    other: [['props', 'Itens'], ['effects', 'Efeitos'], ['hide', 'Ocultar'], ['chat', 'Chat'], ['pet', 'Mascote']],
  };
  const GROUPS = {
    'head:hair': HAIR_SLOTS, 'head:eyes': ['eyeL', 'eyeR', 'pupilL', 'pupilR', 'browL', 'browR'], 'head:face': ['nose', 'mouth', 'blush', 'faceMark'],
    'clothes:hats': ['hat', 'glasses', 'headAcc', 'headAcc2'], 'clothes:acc': ['faceAcc', 'neck', 'logo'],
    'clothes:upper': ['shirt', 'jacket', 'sleeveL', 'sleeveR', 'skirt'], 'clothes:lower': ['pantsL', 'pantsR', 'sockL', 'sockR', 'shoeL', 'shoeR'],
    'clothes:other': ['cape', 'tail', 'wings', 'gloveL', 'gloveR'], 'other:props': ['propL', 'propR', 'shield'], 'other:effects': ['effBack', 'effFront'],
  };
  const HAS_PAIRS = ['head:eyes', 'clothes:upper', 'clothes:lower', 'clothes:other'];

  /* ---------- Blocos reutilizáveis ---------- */
  const colorNames = slot => SLOT_DEFS[slot].cn || ['Principal', 'Secundária', 'Contorno'];
  function ctl(slot) {
    const d = SLOT_DEFS[slot], p = ch().parts[slot], list = PARTS[d.t], max = list.length - 1;
    const name = p.i ? list[p.i].n : 'Nenhum';
    const label = linked() && PAIRS[slot] ? d.n + 's' : d.n;
    return `<div class="ctl" data-slot="${slot}">
      <div class="ctl-lab"><span>${esc(label)}</span><b>${p.i}/${max}</b></div>
      <div class="ctl-row">
        <button class="arr" data-step="-1" aria-label="Anterior">‹</button>
        <button class="ctl-th" data-pick title="Ver todas as opções">${Rig.thumb(ch(), slot, p.i)}<small>${esc(name)}</small></button>
        <button class="arr" data-step="1" aria-label="Próximo">›</button>
        <div class="sws">${colorNames(slot).map((n, i) => `<button class="sw" data-col="${i}" style="background:${p.c[i]}" title="${esc(n)}"></button>`).join('')}</div>
      </div></div>`;
  }
  const group = key => `<div class="ctl-grid">${GROUPS[key].filter(s => !(linked() && RIGHT.has(s))).map(ctl).join('')}</div>`;
  const linkChip = () => `<button class="chip${linked() ? ' on' : ''}" data-link>${ICON.link} Lados iguais</button>`;
  const num = (key, label, val, shown) => `<div class="num"><span>${label}</span><div><button class="arr" data-num="${key}" data-d="-1">‹</button><b>${shown != null ? shown : val}</b><button class="arr" data-num="${key}" data-d="1">›</button></div></div>`;
  const toggle = (key, label, on) => `<button class="tgl${on ? ' on' : ''}" data-tgl="${key}"><span>${label}</span><i>${on ? 'ON' : 'OFF'}</i></button>`;

  function setPart(slot, fn, opt) {
    Editor.change(c => { fn(c.parts[slot], c); if (linked() && PAIRS[slot]) c.parts[PAIRS[slot]] = clone(c.parts[slot]); }, opt);
  }

  /* ---------- Conteúdo por aba ---------- */
  function content(tab, sub) {
    const key = tab + ':' + sub;
    if (tab === 'presets') return presets();
    if (tab === 'body') return body();
    if (tab === 'profile') return profile();
    if (sub === 'adj') return adjust(tab === 'head' ? ADJ_HEAD : ADJ_CLOTHES);
    if (key === 'head:expr') return expressions();
    if (key === 'other:hide') return hidePanel();
    if (key === 'other:chat') return chatPanel();
    if (key === 'other:pet') return petPanel();
    let top = '';
    if (key === 'head:hair') { const c = ch().parts.bangs.c; top = `<div class="bar-row"><span>Todos os cabelos</span><div class="sws">${['Base', 'Degradê', 'Contorno'].map((n, i) => `<button class="sw" data-allhair="${i}" style="background:${c[i]}" title="${n}"></button>`).join('')}</div></div>`; }
    if (HAS_PAIRS.includes(key)) top += `<div class="bar-row">${linkChip()}<small class="muted">${linked() ? 'Esquerda e direita mudam juntas' : 'Cada lado é editado separado'}</small></div>`;
    let extra = '';
    if (key === 'other:effects') { const A = ch().anim; extra = `<h4>Animações</h4><div class="tgl-grid">${[['blink', 'Piscar'], ['hair', 'Cabelo balança'], ['wings', 'Asas'], ['cape', 'Capa'], ['tail', 'Cauda'], ['effects', 'Efeitos']].map(([k, n]) => toggle('anim.' + k, n, A[k])).join('')}</div>`; }
    return top + group(key) + extra;
  }

  function presets() {
    PRE = PRE || PRESETS();
    const list = PRE.filter(p => club < 0 || p.club === club);
    return `<div class="bar-row wrap">
        <div class="seg">${[['all', 'Tudo'], ['clothes', 'Só roupas'], ['hair', 'Só cabelo']].map(([k, n]) => `<button class="${copyMode === k ? 'on' : ''}" data-copymode="${k}">${n}</button>`).join('')}</div>
        ${toggle('copyColors', 'Copiar cores', Store.s.settings.copyColors)}
      </div>
      <div class="clubs"><button class="club${club < 0 ? ' on' : ''}" data-club="-1">Todos</button>${CLUBS.map((c, i) => `<button class="club${club === i ? ' on' : ''}" data-club="${i}" title="${c.n}" style="--cc:${c.c}">${c.ic}</button>`).join('')}</div>
      <div class="preset-grid">${list.map(p => `<button class="preset" data-preset="${PRE.indexOf(p)}">${Rig.portrait(p.ch)}<small>${esc(p.ch.name)}</small></button>`).join('')}</div>
      <p class="hint">Toque num personagem pronto para copiar ${copyMode === 'all' ? 'o visual inteiro' : copyMode === 'clothes' ? 'só as roupas' : 'só o cabelo'}.</p>`;
  }

  function body() {
    const B = ch().body;
    const cats = `<div class="chips">${POSE_CATS.map(c => `<button class="chip${c === poseCat ? ' on' : ''}" data-posecat="${c}">${c}</button>`).join('')}</div>`;
    const poses = POSES.map((p, i) => [p, i]).filter(([p]) => p.c === poseCat);
    return `<div class="bar-row wrap"><span>Pele</span><div class="sws"><button class="sw big" data-skin style="background:${ch().skin}" title="Cor livre"></button>${SKIN_TONES.map(c => `<button class="sw" data-skintone="${c}" style="background:${c}"></button>`).join('')}</div></div>
      <div class="num-grid">
        ${num('size', 'Tamanho', B.size, B.size + '/20')}${num('head', 'Tamanho da cabeça', B.head, B.head + '/20')}
        ${num('headRot', 'Inclinar cabeça', B.headRot, B.headRot + '°')}${num('rot', 'Rotação', B.rot, B.rot + '°')}
        ${num('handL', 'Mão esquerda', B.handL, HANDS[B.handL])}${num('handR', 'Mão direita', B.handR, HANDS[B.handR])}
      </div>
      <div class="tgl-grid">${toggle('turn', 'De lado (3/4)', B.turn)}${toggle('flip', 'Virar ⇆', B.flip)}${toggle('shadow', 'Sombra', B.shadow)}${toggle('bust', 'Busto', B.bust)}</div>
      <h4>Pose <small class="muted">${POSES[B.pose].n}</small></h4>${cats}
      <div class="pose-grid">${poses.map(([p, i]) => `<button class="pz${B.pose === i ? ' on' : ''}" data-pose="${i}" title="${esc(p.n)}">${Rig.poseThumb(i)}<small>${esc(p.n)}</small></button>`).join('')}</div>`;
  }

  function applyExpr(c, x) {
    for (const X of ['L', 'R']) {
      if (x.e) c.parts['eye' + X].i = X === 'R' && x.eR ? x.eR : x.e;
      if (x.p) c.parts['pupil' + X].i = x.p; else if (c.parts['pupil' + X].i === 0) c.parts['pupil' + X].i = 1;
      if (x.b != null) c.parts['brow' + X].i = x.b;
    }
    if (x.m != null) c.parts.mouth.i = x.m;
    if (x.bl != null) c.parts.blush.i = x.bl;
  }
  function expressions() {
    return `<div class="expr-grid">${EXPRESSIONS.map((x, i) => {
      const t = clone(ch()); applyExpr(t, x); t.body = Object.assign(t.body, { pose: 0, rot: 0, flip: 0, headRot: 0 }); t.chat.emote = 0;
      return `<button class="pz" data-expr="${i}">${Rig.render(t, { viewBox: '70 56 160 150', cls: 'thumb still', noPet: true, noShadow: true })}<small>${x.n}</small></button>`;
    }).join('')}</div><p class="hint">As expressões trocam olhos, sobrancelhas, boca e corado de uma vez.</p>`;
  }

  function adjust(slots) {
    const c = ch();
    const act = slots.filter(s => c.parts[s].i);
    if (adjSlot && !act.includes(adjSlot)) adjSlot = null;
    if (!adjSlot) {
      return `<div class="bar-row"><b>Selecione um item para ajustar</b><button class="btn sm" data-adjresetall>Resetar tudo</button></div>
        <div class="adj-grid">${act.map(s => `<button class="pz${c.adj[s] ? ' mod' : ''}" data-adj="${s}">${Rig.thumb(c, s, c.parts[s].i)}<small>${esc(SLOT_DEFS[s].n)}</small></button>`).join('') || '<p class="hint">Nenhum item equipado nesta categoria.</p>'}</div>`;
    }
    const a = Object.assign({ x: 0, y: 0, sx: 1, sy: 1, r: 0 }, c.adj[adjSlot] || {});
    return `<div class="bar-row"><button class="btn sm" data-adjback>‹ Voltar</button><b>Ajustar · ${esc(SLOT_DEFS[adjSlot].n)}</b><button class="btn sm" data-adjreset>Resetar</button></div>
      <div class="adj-pad">
        <div class="dpad"><span class="dl">Posição X/Y</span>
          <button data-hold data-mv="0,-2" class="u">▲</button><button data-hold data-mv="-2,0" class="l">◀</button>
          <span class="dv">X ${a.x}<br>Y ${a.y}</span>
          <button data-hold data-mv="2,0" class="r">▶</button><button data-hold data-mv="0,2" class="d">▼</button></div>
        <div class="adj-side">
          <div class="num"><span>Escala X</span><div><button class="arr" data-hold data-sc="sx,-.05">−</button><b>${a.sx.toFixed(2)}</b><button class="arr" data-hold data-sc="sx,.05">+</button></div></div>
          <div class="num"><span>Escala Y</span><div><button class="arr" data-hold data-sc="sy,-.05">−</button><b>${a.sy.toFixed(2)}</b><button class="arr" data-hold data-sc="sy,.05">+</button></div></div>
          <div class="num"><span>Rotação</span><div><button class="arr" data-hold data-rt="-3">↺</button><b>${a.r}°</b><button class="arr" data-hold data-rt="3">↻</button></div></div>
        </div>
      </div>`;
  }

  function hidePanel() {
    const H = ch().hide;
    return `<p class="hint">Esconda partes para criar efeitos (por exemplo, só a cabeça flutuando).</p>
      <div class="tgl-grid">${[['head', 'Cabeça'], ['face', 'Rosto'], ['hair', 'Cabelo'], ['body', 'Tronco'], ['arms', 'Braços'], ['legs', 'Pernas'], ['outline', 'Contornos']].map(([k, n]) => toggle('hide.' + k, 'Esconder ' + n.toLowerCase(), H[k])).join('')}</div>`;
  }

  function chatPanel() {
    const C = ch().chat;
    const bubble = ['r-round', 'r-think', 'r-shout', 'r-whisper'][C.bubble] || 'r-round';
    return `<div class="chat-prev">
        <div class="bubble ${bubble}" style="background:${C.bubbleColor};color:${C.textColor};font-family:${FONTS[C.font].f}">${esc(C.text || '...')}</div>
        <div class="bname" style="color:${C.nameColor}">${esc(ch().name)}</div>
      </div>
      <button class="btn wide" data-chattext>✏️ Editar fala</button>
      <div class="num-grid">${num('chat.bubble', 'Balão', C.bubble, BUBBLES[C.bubble])}${num('chat.font', 'Fonte', C.font, FONTS[C.font].n)}</div>
      <div class="bar-row wrap"><span>Cores</span><div class="sws">
        <button class="sw" data-chatcol="nameColor" style="background:${C.nameColor}" title="Nome"></button>
        <button class="sw" data-chatcol="textColor" style="background:${C.textColor}" title="Texto"></button>
        <button class="sw" data-chatcol="bubbleColor" style="background:${C.bubbleColor}" title="Balão"></button></div>
        <small class="muted">nome · texto · balão</small></div>
      <h4>Emote sobre a cabeça</h4>
      <div class="emotes">${EMOTES.map((e, i) => `<button class="${C.emote === i ? 'on' : ''}" data-emote="${i}">${e || '∅'}</button>`).join('')}</div>`;
  }

  function petPanel() {
    const P = ch().pet;
    return `<div class="ctl-grid">${ctl('pet')}</div>
      <div class="bar-row"><span>Nome: <b>${esc(P.name)}</b></span><button class="btn sm" data-petname>✏️ Mudar nome</button></div>
      <div class="num-grid">${num('pet.x', 'Posição X', P.x)}${num('pet.y', 'Posição Y', P.y)}${num('pet.s', 'Tamanho', P.s, P.s.toFixed(1) + 'x')}</div>`;
  }

  function profile() {
    const c = ch(), P = c.profile;
    const f = (k, label, max = 24) => `<label class="fld"><span>${label}</span><input data-prof="${k}" value="${esc(P[k])}" maxlength="${max}"/></label>`;
    return `<div class="prof">
      <label class="fld big"><span>Nome do personagem</span><input data-name value="${esc(c.name)}" maxlength="18"/></label>
      <label class="fld"><span>Título favorito</span><select data-prof="title">${TITLES.map((t, i) => `<option value="${i}" ${+P.title === i ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>
      <label class="fld"><span>Clube favorito</span><select data-prof="club">${CLUBS.map((t, i) => `<option value="${i}" ${+P.club === i ? 'selected' : ''}>${t.ic} ${esc(t.n)}</option>`).join('')}</select></label>
      ${f('birthday', 'Aniversário', 5)}${f('age', 'Idade', 4)}
      <label class="fld wide"><span>Perfil do personagem</span><textarea data-prof="bio" maxlength="160" rows="3">${esc(P.bio)}</textarea></label>
      ${f('creator', 'Criado por')}${f('color', 'Cor favorita')}${f('food', 'Comida favorita')}${f('place', 'Localização')}${f('personality', 'Personalidade')}${f('job', 'Ocupação')}
      </div>
      <div class="btn-row"><button class="btn primary" data-profcard>⭐ Ver perfil completo</button><button class="btn" data-export>⬆️ Exportar</button><button class="btn" data-import>⬇️ Importar</button></div>
      <p class="hint">⚠️ Não coloque informações pessoais reais.</p>`;
  }

  /* ---------- Renderização ---------- */
  function subTabs(tab, sub) {
    return `<div class="sub-tabs">${SUBS[tab].map(([k, n]) => `<button class="${k === sub ? 'on' : ''}" data-sub="${k}">${n}</button>`).join('')}</div>`;
  }
  function render(tab, sub) {
    mode = null;
    if (SUBS[tab] && !SUBS[tab].some(s => s[0] === sub)) { sub = SUBS[tab][0][0]; Editor.sub = sub; }
    box().innerHTML = (SUBS[tab] ? subTabs(tab, sub) : '') + `<div class="pn-body">${content(tab, sub)}</div>`;
    box().onclick = onClick; box().onchange = onChange; box().oninput = null;
    bindHold();
  }
  const rerender = () => render(Editor.tab, Editor.sub);

  function pickGrid(slot) {
    const d = SLOT_DEFS[slot], list = PARTS[d.t], p = ch().parts[slot];
    mode = { type: 'pick', slot };
    box().innerHTML = `<div class="bar-row"><button class="btn sm" data-back>‹ Voltar</button><b>${esc(d.n)}</b><small class="muted">${list.length - 1} opções</small></div>
      <div class="pick-grid">${list.map((t, i) => `<button class="pz${i === p.i ? ' on' : ''}" data-pi="${i}">${Rig.thumb(ch(), slot, i)}<small>${i ? esc(t.n) : 'Nenhum'}</small></button>`).join('')}</div>`;
  }
  function openColor(title, targets, active = 0) {
    mode = { type: 'color' };
    ColorPicker.open(box(), { title, targets, active, onClose: rerender });
  }

  /* ---------- Eventos ---------- */
  function onClick(e) {
    const b = e.target.closest('button'); if (!b || b.hasAttribute('data-hold-done')) { if (b) b.removeAttribute('data-hold-done'); return; }
    const ds = b.dataset, c = ch();
    if (mode && mode.type === 'color') return;
    if (ds.back != null) { Sfx.play('close'); return rerender(); }
    if (ds.sub) { Editor.sub = ds.sub; adjSlot = null; Sfx.play('tap'); return rerender(); }
    if (ds.pi != null && mode && mode.type === 'pick') {
      const slot = mode.slot; Sfx.play('pick');
      setPart(slot, p => { p.i = +ds.pi; }, { panel: false });
      $$('.pick-grid .pz', box()).forEach(x => x.classList.toggle('on', x === b));
      return;
    }
    const ctlEl = b.closest('.ctl'), slot = ctlEl && ctlEl.dataset.slot;
    if (slot && ds.step) { const len = PARTS[SLOT_DEFS[slot].t].length; Sfx.play('tap'); return setPart(slot, p => { p.i = (p.i + +ds.step + len) % len; }); }
    if (slot && ds.pick != null) { Sfx.play('open'); return pickGrid(slot); }
    if (slot && ds.col != null) {
      const names = colorNames(slot);
      return openColor(SLOT_DEFS[slot].n, names.map((n, i) => ({ label: n, get: () => ch().parts[slot].c[i], set: v => setPart(slot, p => { p.c[i] = v; }, { panel: false }) })), +ds.col);
    }
    if (ds.allhair != null) return openColor('Todos os cabelos', ['Base', 'Degradê', 'Contorno'].map((n, i) => ({ label: n, get: () => ch().parts.bangs.c[i], set: v => Editor.change(x => HAIR_SLOTS.forEach(s => x.parts[s].c[i] = v), { panel: false }) })), +ds.allhair);
    if (ds.link != null) { Store.s.settings.linkPairs = linked() ? 0 : 1; Store.save(); Sfx.play('tap'); return rerender(); }
    // Predefinidos
    if (ds.copymode) { copyMode = ds.copymode; Sfx.play('tap'); return rerender(); }
    if (ds.club != null) { club = +ds.club; Sfx.play('tap'); return rerender(); }
    if (ds.preset != null) { const p = PRE[+ds.preset]; Sfx.play('pick'); return Editor.change(x => Store.copyInto(x, p.ch, copyMode, !!Store.s.settings.copyColors), { panel: false }); }
    // Corpo
    if (ds.skin != null) return openColor('Pele', [{ label: 'Pele', get: () => ch().skin, set: v => Editor.change(x => { x.skin = v; }, { panel: false }) }]);
    if (ds.skintone) { Sfx.play('pick'); return Editor.change(x => { x.skin = ds.skintone; x.parts.nose.c[0] = Color.shade(ds.skintone, -28); }); }
    if (ds.posecat) { poseCat = ds.posecat; Sfx.play('tap'); return rerender(); }
    if (ds.pose != null) { Sfx.play('pick'); Editor.change(x => { x.body.pose = +ds.pose; }, { panel: false }); $$('.pose-grid .pz', box()).forEach(x => x.classList.toggle('on', x === b)); return; }
    if (ds.num) return numStep(ds.num, +ds.d);
    if (ds.tgl) return toggleKey(ds.tgl);
    // Expressões
    if (ds.expr != null) { Sfx.play('pick'); return Editor.change(x => applyExpr(x, EXPRESSIONS[+ds.expr]), { panel: false }); }
    // Ajustar
    if (ds.adj) { adjSlot = ds.adj; Sfx.play('open'); return rerender(); }
    if (ds.adjback != null) { adjSlot = null; return rerender(); }
    if (ds.adjreset != null) { Sfx.play('close'); return Editor.change(x => { delete x.adj[adjSlot]; }); }
    if (ds.adjresetall != null) { const list = Editor.tab === 'head' ? ADJ_HEAD : ADJ_CLOTHES; return Editor.change(x => list.forEach(s => delete x.adj[s])); }
    if (ds.mv || ds.sc || ds.rt) return adjStep(ds);
    // Chat / mascote
    if (ds.chattext != null) return UI.prompt(c.chat.text, { max: 120, multiline: true }).then(v => { if (v != null) Editor.change(x => { x.chat.text = v; }); });
    if (ds.chatcol) { const k = ds.chatcol; return openColor('Cores do chat', [{ label: { nameColor: 'Nome', textColor: 'Texto', bubbleColor: 'Balão' }[k], get: () => ch().chat[k], set: v => Editor.change(x => { x.chat[k] = v; }, { panel: false }) }]); }
    if (ds.emote != null) { Sfx.play('pick'); return Editor.change(x => { x.chat.emote = +ds.emote; }); }
    if (ds.petname != null) return UI.prompt(c.pet.name, { max: 16 }).then(v => { if (v != null && v.trim()) Editor.change(x => { x.pet.name = v.trim(); }); });
    // Perfil
    if (ds.profcard != null) return Modals.profileCard(c);
    if (ds.export != null) return Modals.exportChar(c);
    if (ds.import != null) return Modals.importChar(nc => Editor.change(x => { const id = x.id; Object.assign(x, nc); x.id = id; }));
  }

  function numStep(key, d) {
    Sfx.play('tap');
    Editor.change(c => {
      const B = c.body;
      switch (key) {
        case 'size': B.size = clamp(B.size + d, 1, 20); break;
        case 'head': B.head = clamp(B.head + d, 1, 20); break;
        case 'headRot': B.headRot = clamp(B.headRot + d * 5, -40, 40); break;
        case 'rot': B.rot = ((B.rot + d * 15 + 540) % 360) - 180; break;
        case 'handL': B.handL = (B.handL + d + HANDS.length) % HANDS.length; break;
        case 'handR': B.handR = (B.handR + d + HANDS.length) % HANDS.length; break;
        case 'chat.bubble': c.chat.bubble = (c.chat.bubble + d + BUBBLES.length) % BUBBLES.length; break;
        case 'chat.font': c.chat.font = (c.chat.font + d + FONTS.length) % FONTS.length; break;
        case 'pet.x': c.pet.x = clamp(c.pet.x + d * 8, -300, 120); break;
        case 'pet.y': c.pet.y = clamp(c.pet.y + d * 8, -360, 60); break;
        case 'pet.s': c.pet.s = clamp(Math.round((c.pet.s + d * .1) * 10) / 10, .4, 3); break;
      }
    });
  }
  function toggleKey(k) {
    Sfx.play('tap');
    if (k === 'copyColors') { Store.s.settings.copyColors = Store.s.settings.copyColors ? 0 : 1; Store.save(); return rerender(); }
    Editor.change(c => {
      if (k === 'flip') c.body.flip = c.body.flip ? 0 : 1;
      else if (k === 'shadow') c.body.shadow = c.body.shadow ? 0 : 1;
      else if (k === 'turn') c.body.turn = c.body.turn ? 0 : 1;
      else if (k === 'bust') c.body.bust = c.body.bust ? 0 : 1;
      else { const [o, f] = k.split('.'); c[o][f] = c[o][f] ? 0 : 1; }
    });
  }
  function adjStep(ds, live) {
    Editor.change(c => {
      const a = c.adj[adjSlot] = Object.assign({ x: 0, y: 0, sx: 1, sy: 1, r: 0 }, c.adj[adjSlot] || {});
      if (ds.mv) { const [dx, dy] = ds.mv.split(',').map(Number); a.x = clamp(a.x + dx, -120, 120); a.y = clamp(a.y + dy, -120, 120); }
      if (ds.sc) { const [k, v] = ds.sc.split(','); a[k] = clamp(Math.round((a[k] + +v) * 100) / 100, .2, 3); }
      if (ds.rt) a.r = ((a.r + +ds.rt + 540) % 360) - 180;
    }, { panel: !live });
  }

  function onChange(e) {
    const t = e.target, c = ch();
    if (t.dataset.name != null) { const v = t.value.trim() || 'Sem nome'; Editor.change(x => { x.name = v; }, { panel: false }); return; }
    if (t.dataset.prof) { const k = t.dataset.prof; const v = t.tagName === 'SELECT' ? +t.value : t.value; Editor.change(x => { x.profile[k] = v; }, { panel: false }); }
  }

  /* Segurar o botão repete a ação (ajustes finos) */
  function bindHold() {
    $$('[data-hold]', box()).forEach(b => {
      let t = null, i = null, fired = false;
      const stop = () => { clearTimeout(t); clearInterval(i); t = i = null; };
      b.onpointerdown = ev => {
        fired = false;
        t = setTimeout(() => { i = setInterval(() => { fired = true; adjStep(b.dataset, true); }, 70); }, 380);
      };
      b.onpointerup = b.onpointerleave = b.onpointercancel = () => { if (fired) b.setAttribute('data-hold-done', ''); stop(); if (fired) rerender(); };
    });
  }

  return { render, applyExpr };
})();
