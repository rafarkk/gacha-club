/* ============ PAINÉIS DO EDITOR ============ */

const Panels = (() => {
  let mode = null, poseCat = POSE_CATS[0], club = -1, copyMode = 'all', adjSlot = null;
  let PRE = null;
  const box = () => $('#edPanel');
  const ch = () => Editor.ch();

  const SUBS = {
    head: [['hair', 'Cabelo'], ['eyes', 'Olhos'], ['face', 'Rosto'], ['expr', 'Expressões'], ['adj', 'Ajustar']],
    clothes: [['hats', 'Chapéus'], ['acc', 'Acessórios'], ['upper', 'Superior'], ['lower', 'Inferior'], ['other', 'Outros'], ['extra', 'Extra'], ['adj', 'Ajustar']],
    other: [['props', 'Itens'], ['effects', 'Efeitos'], ['hide', 'Ocultar'], ['chat', 'Chat'], ['pet', 'Mascote'], ['objects', 'Objetos']],
  };
  const GROUPS = {
    'head:hair': HAIR_SLOTS, 'head:eyes': ['eyeL', 'eyeR', 'pupilL', 'pupilR', 'browL', 'browR'], 'head:face': ['nose', 'mouth', 'blush', 'faceMark'],
    /* mesma ordem das telas do Gacha Club (em duas colunas: esquerda/direita, topo/base) */
    'clothes:hats': ['hat', 'glasses', 'headAcc3', 'headAcc', 'headAcc2', 'headAcc4'],
    'clothes:acc': ['faceAcc2', 'neck', 'faceAcc', 'neck2', 'faceAcc3', 'logo'],
    'clothes:upper': ['shirt', 'jacket', 'sleeveL', 'sleeveR', 'skirt', 'skirt2'], 'clothes:lower': ['pantsL', 'pantsR', 'sockL', 'sockR', 'shoeL', 'shoeR'],
    'clothes:other': ['cape', 'tail', 'wings', 'wingsR', 'gloveL', 'gloveR'], 'clothes:extra': ['shoulderL', 'shoulderR', 'wristL', 'wristR', 'kneeL', 'kneeR'],
    'other:props': ['propL', 'propR', 'shield'], 'other:effects': ['effBack', 'effFront'],
  };

  /* ---------- Blocos reutilizáveis ---------- */
  const ANIMS = [['blink', 'Piscar'], ['hair', 'Cabelo da frente'], ['hairB', 'Cabelo de trás'], ['wings', 'Asas'], ['cape', 'Capa'], ['tail', 'Cauda'], ['effects', 'Efeitos']];
  /* posição/tamanho/rotação de uma peça (mesmo ajuste da ferramenta Ajustar) */
  function adjNums(sl, xy) {
    const a = Object.assign({ x: 0, y: 0, sx: 1, sy: 1, r: 0 }, ch().adj[sl] || {});
    return `<div class="num-grid">${num('adj.' + sl + '.x', 'X', a.x)}${num('adj.' + sl + '.y', 'Y', -a.y)}` +
      (xy ? num('adj.' + sl + '.sx', 'Escala X', a.sx, a.sx.toFixed(1) + 'x') + num('adj.' + sl + '.sy', 'Escala Y', a.sy, a.sy.toFixed(1) + 'x') : num('adj.' + sl + '.s', 'Tamanho', a.sx, a.sx.toFixed(1) + 'x')) +
      num('adj.' + sl + '.r', 'Rotação', a.r, a.r + '°') + '</div>';
  }
  /* cor do brilho/acessório do cabelo; vazia = a automática que o desenho usa */
  const hairFx = k => ch().hairFx[k] || (k === 'hl' ? Color.mix(ch().parts.bangs.c[0], '#ffffff', .62) : '#ff4f86');
  const colorNames = slot => SLOT_DEFS[slot].cn || ['Principal', 'Secundária', 'Contorno'];
  function ctl(slot) {
    const d = SLOT_DEFS[slot], p = ch().parts[slot], list = PARTS[d.t], max = list.length - 1;
    const name = p.i ? list[p.i].n : 'Nenhum';
    const pos = slot === 'logo' ? `<button class="pos" data-logopos title="Posição da estampa">Pos.<b>${(p.p || 0) + 1}/${LOGO_POS.length}</b></button>` : '';
    return `<div class="ctl" data-slot="${slot}">
      <div class="ctl-lab"><span>${esc(d.n)}</span><b>${p.i}/${max}</b></div>
      <div class="ctl-row">
        <button class="arr" data-step="-1" aria-label="Anterior">‹</button>
        <button class="ctl-th" data-pick title="Ver todas as opções">${Rig.thumb(ch(), slot, p.i)}<small>${esc(name)}</small></button>
        <button class="arr" data-step="1" aria-label="Próximo">›</button>
        <div class="sws">${colorNames(slot).map((n, i) => `<button class="sw" data-col="${i}" style="background:${p.c[i]}" title="${esc(n)}"></button>`).join('')}${pos}</div>
      </div></div>`;
  }
  const group = key => `<div class="ctl-grid">${GROUPS[key].map(ctl).join('')}</div>`;
  const num = (key, label, val, shown) => `<div class="num"><span>${label}</span><div><button class="arr" data-num="${key}" data-d="-1">‹</button><b>${shown != null ? shown : val}</b><button class="arr" data-num="${key}" data-d="1">›</button></div></div>`;
  const toggle = (key, label, on) => `<button class="tgl${on ? ' on' : ''}" data-tgl="${key}"><span>${label}</span><i>${on ? 'ON' : 'OFF'}</i></button>`;

  /* Como no Gacha Club: o cartão do lado esquerdo (ex.: "Meia") muda os dois lados; o "direito" muda só o direito */
  function setPart(slot, fn, opt) {
    Editor.change(c => { fn(c.parts[slot], c); if (PAIRS[slot]) fn(c.parts[PAIRS[slot]], c); }, opt);
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
    if (key === 'other:objects') return objPanel();
    let top = '';
    if (key === 'head:hair') { const c = ch().parts.bangs.c;
      top = `<div class="bar-row wrap"><span>Todos os cabelos</span><div class="sws">${['Base', 'Degradê', 'Contorno'].map((n, i) => `<button class="sw" data-allhair="${i}" style="background:${c[i]}" title="${n}"></button>`).join('')}</div>
        <span>Brilho</span><div class="sws"><button class="sw" data-hairfx="hl" style="background:${hairFx('hl')}" title="Cor do brilho"></button></div>
        <span>Acessórios</span><div class="sws"><button class="sw" data-hairfx="acc" style="background:${hairFx('acc')}" title="Cor dos acessórios do cabelo"></button></div></div>`; }
    let extra = '';
    if (key === 'head:face') { const F = ch().face;
      extra = `<h4>Detalhes do rosto</h4><div class="num-grid">
        ${num('face.hl', 'Brilho do rosto', F.hl, FACE_HL[F.hl])}${num('face.chin', 'Queixo', F.chin, CHINS[F.chin])}
        ${num('face.look', 'Olhar', F.look, LOOKS[F.look])}${num('face.blushPos', 'Posição do corado', F.blushPos, (F.blushPos + 1) + '/' + BLUSH_POS.length)}
        ${num('face.shade', 'Sombra do rosto', F.shade, F.shade + '/9')}</div>
        <div class="tgl-grid">${toggle('face.eyeHl', 'Brilho dos olhos', F.eyeHl)}</div>`; }
    if (key === 'other:props') extra = ['propL', 'propR', 'shield'].map(sl => `<h4>${SLOT_DEFS[sl].n}</h4>${adjNums(sl, false)}`).join('');
    if (key === 'other:effects') { const A = ch().anim, B = ch().body;
      extra = ['effBack', 'effFront'].map(sl => { const p = ch().parts[sl];
          return `<h4>${SLOT_DEFS[sl].n}</h4>${adjNums(sl, true)}<div class="num-grid">${num('tint.' + sl, 'Tingimento', p.tint || 0, (p.tint || 0) + '%')}<div class="num"><span>Cor do tingimento</span><div class="sws"><button class="sw" data-tintcol="${sl}" style="background:${p.tc || '#ff4f86'}"></button></div></div></div>`; }).join('') +
        `<h4>Tingir o personagem</h4><div class="num-grid">${num('tint.body', 'Tingimento', B.tint, B.tint + '%')}<div class="num"><span>Cor do tingimento</span><div class="sws"><button class="sw" data-tintcol="body" style="background:${B.tintCol}"></button></div></div></div>
        <h4>Animações <small class="muted">0 = parado · 5 = normal · 10 = rápido</small></h4><div class="num-grid">${ANIMS.map(([k, n]) => num('anim.' + k, n, A[k], A[k] ? A[k] + '/10' : 'Parado')).join('')}</div>`; }
    return top + group(key) + extra;
  }

  function presets() {
    PRE = PRE || PRESETS();
    const list = PRE.filter(p => club < 0 || p.club === club);
    return `<div class="bar-row wrap">
        <div class="seg">${[['all', 'Tudo'], ['clothes', 'Só roupas'], ['hair', 'Só cabelo']].map(([k, n]) => `<button class="${copyMode === k ? 'on' : ''}" data-copymode="${k}">${n}</button>`).join('')}</div>
        ${toggle('copyColors', 'Copiar cores', Store.s.settings.copyColors)}
      </div>
      <div class="clubs"><button class="club${club < 0 ? ' on' : ''}" data-club="-1">Todos</button>${CLUBS.map((c, i) => !PRE.some(p => p.club === i) ? '' : `<button class="club${club === i ? ' on' : ''}" data-club="${i}" title="${c.n}" style="--cc:${c.c}">${c.ic}</button>`).join('')}</div>
      <div class="preset-grid">${list.map(p => `<button class="preset" data-preset="${PRE.indexOf(p)}">${Rig.portrait(p.ch)}<small>${esc(p.ch.name)}</small></button>`).join('')}</div>
      <p class="hint">Toque num personagem pronto para copiar ${copyMode === 'all' ? 'o visual inteiro' : copyMode === 'clothes' ? 'só as roupas' : 'só o cabelo'}.</p>`;
  }

  function body() {
    const B = ch().body;
    const cats = `<div class="chips">${POSE_CATS.map(c => `<button class="chip${c === poseCat ? ' on' : ''}" data-posecat="${c}">${c}</button>`).join('')}</div>`;
    const poses = POSES.map((p, i) => [p, i]).filter(([p]) => p.c === poseCat);
    return `<div class="bar-row wrap"><span>Pele</span><div class="sws"><button class="sw big" data-skin style="background:${ch().skin}" title="Cor livre"></button>${SKIN_TONES.map(c => `<button class="sw" data-skintone="${c}" style="background:${c}"></button>`).join('')}</div></div>
      <div class="num-grid">
        ${num('size', 'Tamanho', B.size, B.size + '/20')}${num('w', 'Largura', B.w, B.w + '/20')}${num('head', 'Tamanho da cabeça', B.head, B.head + '/20')}
        ${num('headRot', 'Inclinar cabeça', B.headRot, B.headRot + '°')}${num('rot', 'Rotação', B.rot, B.rot + '°')}
        ${num('handL', 'Mão esquerda', B.handL, HANDS[B.handL])}${num('handR', 'Mão direita', B.handR, HANDS[B.handR])}
      </div>
      <div class="tgl-grid">${toggle('turn', 'De lado (3/4)', B.turn)}${toggle('flip', 'Virar ⇆', B.flip)}${toggle('shadow', 'Sombra', B.shadow)}${toggle('bust', 'Busto', B.bust)}</div>
      <div class="num-grid">${num('shType', 'Tipo de sombra', B.shType, (B.shType + 1) + '/' + SHADOWS.length + ' · ' + SHADOWS[B.shType])}
        <div class="num"><span>Cor da sombra</span><div class="sws"><button class="sw" data-shcol style="background:${B.shCol}" title="Cor da sombra"></button></div></div></div>
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
      <div class="tgl-grid">${[['head', 'Cabeça'], ['face', 'Rosto'], ['hair', 'Cabelo'], ['hairB', 'Cabelo de trás'], ['body', 'Tronco'], ['arms', 'Braços'], ['hands', 'Mãos'], ['legs', 'Pernas'], ['feet', 'Pés'], ['wings', 'Asas'], ['cape', 'Capa'], ['tail', 'Cauda'], ['outline', 'Contornos']].map(([k, n]) => toggle('hide.' + k, 'Esconder ' + n.toLowerCase(), H[k])).join('')}</div>
      <h4>Camadas do rosto</h4><div class="tgl-grid">${toggle('face.over', 'Olhos por cima da franja', ch().face.over)}</div>`;
  }

  function chatPanel() {
    const C = ch().chat;
    const svg = Studio.bubbleSVG(200, 118, C.text || '...', { bubble: C.bubble, style: C.style, font: C.font, bg: C.bubbleColor, color: C.textColor, line: C.lineColor, w: 400 });
    return `<div class="chat-prev"><svg viewBox="0 0 400 150" class="chat-svg">${svg}
        <text x="200" y="142" text-anchor="middle" class="st-name" style="fill:${C.nameColor};font-family:${esc(FONTS[C.nameFont || 0].f)}">${esc(ch().name)}</text></svg></div>
      <button class="btn wide" data-chattext>✏️ Editar fala</button>
      <div class="num-grid">${num('chat.bubble', 'Tipo de balão', C.bubble, BUBBLES[C.bubble])}${num('chat.style', 'Estilo do balão', C.style, (C.style + 1) + '/' + BUBBLE_STYLES.length + ' · ' + BUBBLE_STYLES[C.style])}
        ${num('chat.nameFont', 'Fonte do nome', C.nameFont, FONTS[C.nameFont || 0].n)}${num('chat.font', 'Fonte da fala', C.font, FONTS[C.font].n)}</div>
      <div class="bar-row wrap"><span>Cores</span><div class="sws">
        <button class="sw" data-chatcol="nameColor" style="background:${C.nameColor}" title="Nome"></button>
        <button class="sw" data-chatcol="textColor" style="background:${C.textColor}" title="Texto"></button>
        <button class="sw" data-chatcol="bubbleColor" style="background:${C.bubbleColor}" title="Balão"></button>
        <button class="sw" data-chatcol="lineColor" style="background:${C.lineColor}" title="Contorno do balão"></button></div>
        <small class="muted">nome · fala · balão · contorno</small></div>
      <h4>Emote sobre a cabeça</h4>
      <div class="emotes">${EMOTES.map((e, i) => `<button class="${C.emote === i ? 'on' : ''}" data-emote="${i}">${e || '∅'}</button>`).join('')}</div>`;
  }

  /* ---------- Mascotes e objetos personalizáveis (20 e 30 espaços, usados no Estúdio) ---------- */
  let petSel = null, objSel = 0, copying = null;
  const PS = () => Store.s.petSlots, OS = () => Store.s.objSlots;
  const petThumb = (P, vb = '-8 -8 70 70') => P.i ? `<svg viewBox="${vb}" class="thumb still">${Rig.petSVG(P, uid())}</svg>` : '<span class="none-mark">∅</span>';
  const objThumb = O => { if (!O.i) return '<span class="none-mark">∅</span>'; const b = PARTS.object[O.i].box, m = Math.max(b[2], b[3]) * .12;
    return `<svg viewBox="${b[0] - m} ${b[1] - m + (O.dy || 0) * 4} ${b[2] + 2 * m} ${b[3] + 2 * m}" class="thumb still">${Rig.objSVG(O, uid())}</svg>`; };
  function slotGrid(kind) {
    const L = kind === 'pet' ? PS() : OS(), cur = kind === 'pet' ? petSel : objSel, star = kind === 'pet' ? ch().petSlot : -2;
    return `<div class="slot-grid">${L.map((X, i) => `<button class="pz slot${i === cur ? ' on' : ''}${copying && copying.kind === kind ? ' target' : ''}" data-slotpick="${kind}:${i}">${kind === 'pet' ? petThumb(X) : objThumb(X)}${i === star ? '<i class="star">★</i>' : ''}<small>${i + 1}</small></button>`).join('')}</div>
      <div class="bar-row"><button class="btn sm${copying ? ' on' : ''}" data-slotcopy="${kind}">⧉ ${copying ? 'Toque no espaço de destino' : 'Copiar'}</button><small class="muted">${kind === 'pet' ? 'Personalize 20 mascotes e use no Estúdio.' : 'Personalize 30 objetos e use no Estúdio.'}</small></div>`;
  }
  function slotCtl(kind, X) {
    const list = kind === 'pet' ? PARTS.pet : PARTS.object, max = list.length - 1;
    return `<div class="ctl" data-kind="${kind}"><div class="ctl-lab"><span>${kind === 'pet' ? 'Mascote' : 'Objeto'}</span><b>${X.i}/${max}</b></div>
      <div class="ctl-row"><button class="arr" data-sstep="-1">‹</button>
        <button class="ctl-th" data-spick title="Ver todas as opções">${kind === 'pet' ? petThumb(X) : objThumb(X)}<small>${X.i ? esc(list[X.i].n) : 'Nenhum'}</small></button>
        <button class="arr" data-sstep="1">›</button>
        <div class="sws">${['Principal', 'Secundária', 'Contorno'].map((n, i) => `<button class="sw" data-scol="${i}" style="background:${X.c[i]}" title="${n}"></button>`).join('')}</div></div></div>`;
  }
  const tintRow = (key, X) => `${num(key + '.tint', 'Tingimento', X.tint || 0, (X.tint || 0) + '%')}<div class="num"><span>Cor do tingimento</span><div class="sws"><button class="sw" data-stc="${key}" style="background:${X.tc || '#ff4f86'}"></button></div></div>`;
  function petPanel() {
    if (petSel == null) petSel = ch().petSlot >= 0 ? ch().petSlot : 0;
    const P = PS()[petSel], linkedHere = ch().petSlot === petSel;
    return slotGrid('pet') + `<h4>Mascote ${petSel + 1} · ${esc(P.name)}</h4>
      <div class="ctl-grid">${slotCtl('pet', P)}</div>
      <div class="tgl-grid"><button class="tgl${linkedHere ? ' on' : ''}" data-plink><span>★ Mascote de ${esc(ch().name)}</span><i>${linkedHere ? 'ON' : 'OFF'}</i></button>${toggle('ps.back', 'Atrás do personagem', P.back)}${toggle('ps.ol', 'Contorno', P.ol)}</div>
      <div class="num-grid">${num('ps.x', 'Posição X', P.x)}${num('ps.y', 'Posição Y', -P.y)}${num('ps.sx', 'Escala X', P.sx, P.sx.toFixed(1) + 'x')}${num('ps.sy', 'Escala Y', P.sy, P.sy.toFixed(1) + 'x')}
        ${num('ps.r', 'Rotação', P.r, P.r + '°')}${num('ps.shadow', 'Sombra', P.shadow, P.shadow + '/10')}${tintRow('ps', P)}</div>
      <div class="btn-row"><button class="btn" data-petname>✏️ Nome: ${esc(P.name)}</button><button class="btn" data-petchat>💬 ${P.chat ? 'Fala: ' + esc(P.chat) : 'Escrever fala'}</button></div>`;
  }
  function objPanel() {
    const O = OS()[objSel];
    return slotGrid('obj') + `<h4>Objeto ${objSel + 1}</h4>
      <div class="obj-edit"><div class="obj-prev">${objThumb(O)}</div><div>
      <div class="ctl-grid one">${slotCtl('obj', O)}</div>
      <div class="num-grid">${num('os.dy', 'Y (profundidade)', O.dy, -O.dy)}${num('os.shadow', 'Sombra', O.shadow, O.shadow + '/10')}${tintRow('os', O)}</div>
      <div class="tgl-grid">${toggle('os.ol', 'Contorno', O.ol)}</div></div></div>`;
  }
  function slotPick(kind, page) {
    const list = kind === 'pet' ? PARTS.pet : PARTS.object, X = kind === 'pet' ? PS()[petSel] : OS()[objSel], pages = Math.max(1, Math.ceil((list.length - 1) / PER_PAGE));
    if (page == null) page = X.i ? Math.floor((X.i - 1) / PER_PAGE) : 0;
    page = clamp(page, 0, pages - 1);
    mode = { type: 'pick', kind, page };
    const first = 1 + page * PER_PAGE;
    box().innerHTML = `<div class="pk-head"><button class="btn sm danger" data-pi="0">✕ Remover</button><b>${kind === 'pet' ? 'Escolher mascote' : 'Escolher objeto'}</b><button class="btn sm" data-back aria-label="Fechar">✕</button></div>
      <div class="pick-grid pk">${list.slice(first, first + PER_PAGE).map((t, j) => { const i = first + j, T = Object.assign({}, X, { i, c: X.c }); return `<button class="pz${i === X.i ? ' on' : ''}" data-pi="${i}" title="${esc(t.n)}">${kind === 'pet' ? petThumb(T) : objThumb(T)}<small>${esc(t.n)}</small></button>`; }).join('')}</div>
      <div class="pk-nav"><button class="btn" data-pg="-1"${page ? '' : ' disabled'}>‹ Anterior</button><span>Página<br><b>${page + 1}/${pages}</b></span><button class="btn" data-pg="1"${page < pages - 1 ? '' : ' disabled'}>Próxima ›</button></div>`;
  }
  /* muda um espaço (não entra no desfazer do personagem, mas redesenha tudo) */
  const slotChange = fn => Editor.change(() => fn(), {});

  function profile() {
    const c = ch(), P = c.profile;
    const f = (k, label, max = 24) => `<label class="fld"><span>${label}</span><input data-prof="${k}" value="${esc(P[k])}" maxlength="${max}"/></label>`;
    return `<div class="prof">
      <label class="fld big"><span>Nome do personagem</span><input data-name value="${esc(c.name)}" maxlength="18"/></label>
      <label class="fld"><span>Título favorito</span><select data-prof="title">${TITLES.map((t, i) => `<option value="${i}" ${+P.title === i ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>
      <div class="fav-row"><div class="fld"><span>Personagem favorito</span><button class="fav" data-favgal="char">${favPortrait(P.fav)}</button></div>
        <div class="fld"><span>Clube favorito</span><button class="fav" data-favgal="club" style="--cc:${CLUBS[P.club || 0].c}"><i>${CLUBS[P.club || 0].ic}</i><small>${esc(CLUBS[P.club || 0].n)}</small></button></div></div>
      ${f('birthday', 'Aniversário', 5)}${f('age', 'Idade', 4)}
      <label class="fld wide"><span>Perfil do personagem</span><textarea data-prof="bio" maxlength="160" rows="3">${esc(P.bio)}</textarea></label>
      ${f('creator', 'Criado por')}${f('color', 'Cor favorita')}${f('food', 'Comida favorita')}${f('place', 'Localização')}${f('personality', 'Personalidade')}${f('job', 'Ocupação')}
      </div>
      <div class="btn-row"><button class="btn primary" data-profcard>⭐ Ver perfil completo</button><button class="btn" data-export>⬆️ Exportar</button><button class="btn" data-import>⬇️ Importar</button></div>
      <p class="hint">⚠️ Não coloque informações pessoais reais.</p>`;
  }

  /* Galerias do perfil: personagem favorito (seus personagens e os predefinidos) e clube favorito */
  function favList() {
    PRE = PRE || PRESETS();
    const seen = new Set();
    return [...Store.s.chars.map((c, i) => ['m' + i, c]), ...PRE.map((p, i) => ['p' + i, p.ch])].filter(([, c]) => !seen.has(c.name) && seen.add(c.name));
  }
  function favPortrait(v) {
    const f = v && favList().find(([k]) => k === v);
    return f ? `${Rig.portrait(f[1])}<small>${esc(f[1].name)}</small>` : '<span class="none-mark">?</span><small>Escolher</small>';
  }
  function favGallery(kind) {
    mode = { type: 'fav' };
    const P = ch().profile;
    box().innerHTML = `<div class="pk-head"><span></span><b>${kind === 'char' ? 'Personagem favorito' : 'Clube favorito'}</b><button class="btn sm" data-back aria-label="Fechar">✕</button></div>` + (kind === 'char'
      ? `<div class="pick-grid fav-grid">${favList().map(([k, c]) => `<button class="pz${P.fav === k ? ' on' : ''}" data-favset="char:${k}">${Rig.portrait(c)}<small>${esc(c.name)}</small></button>`).join('')}</div>`
      : `<div class="club-gal"><div class="club-big" style="--cc:${CLUBS[P.club || 0].c}"><i>${CLUBS[P.club || 0].ic}</i><b>${esc(CLUBS[P.club || 0].n)}</b></div>
          <div class="club-grid">${CLUBS.map((c, i) => `<button class="${+P.club === i ? 'on' : ''}" data-favset="club:${i}" style="--cc:${c.c}" title="${esc(c.n)}">${c.ic}</button>`).join('')}</div></div>`);
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

  /* Lista de opções como no Gacha Club: 20 por página, "Remover" e título da peça */
  const PER_PAGE = 20;
  function pickGrid(slot, page) {
    const d = SLOT_DEFS[slot], list = PARTS[d.t], p = ch().parts[slot], pages = Math.max(1, Math.ceil((list.length - 1) / PER_PAGE));
    if (page == null) page = p.i ? Math.floor((p.i - 1) / PER_PAGE) : 0;
    page = clamp(page, 0, pages - 1);
    mode = { type: 'pick', slot, page };
    const title = PAIRS[slot] ? `${d.n} · os dois lados` : d.n;
    const first = 1 + page * PER_PAGE, items = list.slice(first, first + PER_PAGE);
    box().innerHTML = `<div class="pk-head"><button class="btn sm danger" data-pi="0">✕ Remover</button><b>${esc(title)}</b><button class="btn sm" data-back aria-label="Fechar">✕</button></div>
      <div class="pick-grid pk">${items.map((t, j) => { const i = first + j; return `<button class="pz${i === p.i ? ' on' : ''}" data-pi="${i}" title="${esc(t.n)}">${Rig.thumb(ch(), slot, i)}<small>${esc(t.n)}</small></button>`; }).join('')}</div>
      <div class="pk-nav"><button class="btn" data-pg="-1"${page ? '' : ' disabled'}>‹ Anterior</button><span>Página<br><b>${page + 1}/${pages}</b></span><button class="btn" data-pg="1"${page < pages - 1 ? '' : ' disabled'}>Próxima ›</button></div>`;
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
    if (ds.pg && mode && mode.type === 'pick') { Sfx.play('tap'); return mode.kind ? slotPick(mode.kind, mode.page + +ds.pg) : pickGrid(mode.slot, mode.page + +ds.pg); }
    if (ds.pi != null && mode && mode.type === 'pick' && mode.kind) {
      const kind = mode.kind, X = kind === 'pet' ? PS()[petSel] : OS()[objSel]; Sfx.play('pick');
      slotChange(() => { X.i = +ds.pi; if (kind === 'pet' && X.i) X.name = PARTS.pet[X.i].n; });
      return slotPick(kind, mode.page);
    }
    if (ds.pi != null && mode && mode.type === 'pick') {
      const slot = mode.slot; Sfx.play('pick');
      setPart(slot, p => { p.i = +ds.pi; }, { panel: false });
      $$('.pick-grid .pz', box()).forEach(x => x.classList.toggle('on', x === b));
      return;
    }
    const ctlEl = b.closest('.ctl'), slot = ctlEl && ctlEl.dataset.slot;
    if (slot && ds.step) { const len = PARTS[SLOT_DEFS[slot].t].length, v = (c.parts[slot].i + +ds.step + len) % len; Sfx.play('tap'); return setPart(slot, p => { p.i = v; }); }
    if (slot && ds.logopos != null) { Sfx.play('tap'); return setPart(slot, p => { p.p = ((p.p || 0) + 1) % LOGO_POS.length; }); }
    if (slot && ds.pick != null) { Sfx.play('open'); return pickGrid(slot); }
    if (slot && ds.col != null) {
      const names = colorNames(slot);
      return openColor(SLOT_DEFS[slot].n, names.map((n, i) => ({ label: n, get: () => ch().parts[slot].c[i], set: v => setPart(slot, p => { p.c[i] = v; }, { panel: false }) })), +ds.col);
    }
    if (ds.hairfx) { const k = ds.hairfx; return openColor(k === 'hl' ? 'Brilho do cabelo' : 'Acessórios do cabelo', [{ label: k === 'hl' ? 'Brilho' : 'Acessórios', get: () => hairFx(k), set: v => Editor.change(x => { x.hairFx[k] = v; }, { panel: false }) }]); }
    if (ds.tintcol) { const sl = ds.tintcol; return openColor('Tingimento', [{ label: 'Tingimento', get: () => sl === 'body' ? ch().body.tintCol : ch().parts[sl].tc || '#ff4f86', set: v => Editor.change(x => { if (sl === 'body') x.body.tintCol = v; else x.parts[sl].tc = v; }, { panel: false }) }]); }
    if (ds.shcol != null) return openColor('Sombra', [{ label: 'Sombra', get: () => ch().body.shCol, set: v => Editor.change(x => { x.body.shCol = v; }, { panel: false }) }]);
    if (ds.allhair != null) return openColor('Todos os cabelos', ['Base', 'Degradê', 'Contorno'].map((n, i) => ({ label: n, get: () => ch().parts.bangs.c[i], set: v => Editor.change(x => HAIR_SLOTS.forEach(s => x.parts[s].c[i] = v), { panel: false }) })), +ds.allhair);
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
    if (ds.chatcol) { const k = ds.chatcol; return openColor('Cores do chat', [{ label: { nameColor: 'Nome', textColor: 'Texto', bubbleColor: 'Balão', lineColor: 'Contorno do balão' }[k], get: () => ch().chat[k], set: v => Editor.change(x => { x.chat[k] = v; }, { panel: false }) }]); }
    if (ds.emote != null) { Sfx.play('pick'); return Editor.change(x => { x.chat.emote = +ds.emote; }); }
    if (ds.petname != null) { const P = PS()[petSel]; return UI.prompt(P.name, { max: 16 }).then(v => { if (v != null && v.trim()) slotChange(() => { P.name = v.trim(); }); }); }
    // Mascotes e objetos
    if (ds.slotpick) {
      const [kind, v] = ds.slotpick.split(':'), i = +v;
      if (copying && copying.kind === kind) { const from = copying.i; copying = null; Sfx.play('pick');
        return slotChange(() => { const L = kind === 'pet' ? PS() : OS(); L[i] = clone(L[from]); if (kind === 'pet') petSel = i; else objSel = i; }); }
      Sfx.play('tap'); if (kind === 'pet') petSel = i; else objSel = i; return rerender();
    }
    if (ds.slotcopy) { copying = copying ? null : { kind: ds.slotcopy, i: ds.slotcopy === 'pet' ? petSel : objSel }; Sfx.play('tap'); return rerender(); }
    const kindEl = b.closest('.ctl[data-kind]'), kind = kindEl && kindEl.dataset.kind;
    if (kind) {
      const X = kind === 'pet' ? PS()[petSel] : OS()[objSel], len = (kind === 'pet' ? PARTS.pet : PARTS.object).length;
      if (ds.sstep) { Sfx.play('tap'); return slotChange(() => { X.i = (X.i + +ds.sstep + len) % len; if (kind === 'pet' && X.i) X.name = PARTS.pet[X.i].n; }); }
      if (ds.spick != null) { Sfx.play('open'); return slotPick(kind); }
      if (ds.scol != null) return openColor(kind === 'pet' ? 'Mascote' : 'Objeto', ['Principal', 'Secundária', 'Contorno'].map((n, i) => ({ label: n, get: () => X.c[i], set: v => slotChange(() => { X.c[i] = v; }) })), +ds.scol);
    }
    if (ds.stc) { const X = ds.stc === 'ps' ? PS()[petSel] : OS()[objSel]; return openColor('Tingimento', [{ label: 'Tingimento', get: () => X.tc || '#ff4f86', set: v => slotChange(() => { X.tc = v; }) }]); }
    if (ds.plink != null) { Sfx.play('pick'); return Editor.change(x => { x.petSlot = x.petSlot === petSel ? -1 : petSel; x.parts.pet.i = 0; }); }
    if (ds.petchat != null) { const P = PS()[petSel]; return UI.prompt(P.chat, { max: 80, placeholder: 'Fala do mascote' }).then(v => { if (v != null) slotChange(() => { P.chat = v.trim(); }); }); }
    // Perfil
    if (ds.favgal) { Sfx.play('open'); return favGallery(ds.favgal); }
    if (ds.favset) { const [k, v] = ds.favset.split(':'); Sfx.play('pick'); return Editor.change(x => { if (k === 'club') x.profile.club = +v; else x.profile.fav = v; }); }
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
        case 'w': B.w = clamp(B.w + d, 1, 20); break;
        case 'shType': B.shType = (B.shType + d + SHADOWS.length) % SHADOWS.length; break;
        case 'face.hl': c.face.hl = (c.face.hl + d + FACE_HL.length) % FACE_HL.length; break;
        case 'face.chin': c.face.chin = (c.face.chin + d + CHINS.length) % CHINS.length; break;
        case 'face.look': c.face.look = (c.face.look + d + LOOKS.length) % LOOKS.length; break;
        case 'face.blushPos': c.face.blushPos = (c.face.blushPos + d + BLUSH_POS.length) % BLUSH_POS.length; break;
        case 'face.shade': c.face.shade = clamp(c.face.shade + d, 0, 9); break;
        case 'head': B.head = clamp(B.head + d, 1, 20); break;
        case 'headRot': B.headRot = clamp(B.headRot + d * 5, -40, 40); break;
        case 'rot': B.rot = ((B.rot + d * 15 + 540) % 360) - 180; break;
        case 'handL': B.handL = (B.handL + d + HANDS.length) % HANDS.length; break;
        case 'handR': B.handR = (B.handR + d + HANDS.length) % HANDS.length; break;
        case 'chat.bubble': c.chat.bubble = (c.chat.bubble + d + BUBBLES.length) % BUBBLES.length; break;
        case 'chat.font': c.chat.font = (c.chat.font + d + FONTS.length) % FONTS.length; break;
        case 'chat.nameFont': c.chat.nameFont = ((c.chat.nameFont || 0) + d + FONTS.length) % FONTS.length; break;
        case 'chat.style': c.chat.style = ((c.chat.style || 0) + d + BUBBLE_STYLES.length) % BUBBLE_STYLES.length; break;
        default:
          if (key.startsWith('anim.')) { const k = key.slice(5); c.anim[k] = clamp((c.anim[k] || 0) + d, 0, 10); }
          else if (key.startsWith('tint.')) { const k = key.slice(5), o = k === 'body' ? c.body : c.parts[k]; o.tint = clamp((o.tint || 0) + d * 10, 0, 100); }
          else if (key.startsWith('adj.')) {
            const [, sl, f] = key.split('.'), a = c.adj[sl] = Object.assign({ x: 0, y: 0, sx: 1, sy: 1, r: 0 }, c.adj[sl] || {});
            if (f === 'x') a.x = clamp(a.x + d * 4, -200, 200);
            if (f === 'y') a.y = clamp(a.y - d * 4, -200, 200);
            if (f === 's') { a.sx = a.sy = clamp(Math.round((a.sx + d * .1) * 10) / 10, .2, 4); }
            if (f === 'sx' || f === 'sy') a[f] = clamp(Math.round((a[f] + d * .1) * 10) / 10, -4, 4) || d * .1;
            if (f === 'r') a.r = ((a.r + d * 15 + 540) % 360) - 180;
          }
        case 'ps.x': { const P = PS()[petSel]; P.x = clamp(P.x + d * 8, -320, 140); break; }
        case 'ps.y': { const P = PS()[petSel]; P.y = clamp(P.y - d * 8, -380, 60); break; }
        case 'ps.sx': case 'ps.sy': { const P = PS()[petSel], f = key.slice(3); P[f] = clamp(Math.round((P[f] + d * .1) * 10) / 10, -3, 3) || d * .1; break; }
        case 'ps.r': { const P = PS()[petSel]; P.r = ((P.r + d * 15 + 540) % 360) - 180; break; }
        case 'ps.shadow': { const P = PS()[petSel]; P.shadow = clamp(P.shadow + d, 0, 10); break; }
        case 'ps.tint': { const P = PS()[petSel]; P.tint = clamp((P.tint || 0) + d * 10, 0, 100); break; }
        case 'os.dy': { const O = OS()[objSel]; O.dy = clamp((O.dy || 0) - d, -30, 30); break; }
        case 'os.shadow': { const O = OS()[objSel]; O.shadow = clamp(O.shadow + d, 0, 10); break; }
        case 'os.tint': { const O = OS()[objSel]; O.tint = clamp((O.tint || 0) + d * 10, 0, 100); break; }
      }
    });
  }
  function toggleKey(k) {
    Sfx.play('tap');
    if (k.startsWith('ps.') || k.startsWith('os.')) { const X = k[0] === 'p' ? PS()[petSel] : OS()[objSel], f = k.slice(3); return slotChange(() => { X[f] = X[f] ? 0 : 1; }); }
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
