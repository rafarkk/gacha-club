/* ============ TELA: EDITOR DE CENÁRIO ============ */

Screens.scene = (() => {
  let draft = null;
  let tab = 'bg';
  let sel = -1;
  let dirty = false;
  const MAX_ELS = 24;
  const el = () => $('#scr-scene');
  const clone = o => JSON.parse(JSON.stringify(o));
  const newDraft = () => ({ uid: null, name: 'Meu Cenário', bg: 'b_campo', weather: null, els: [{ t: 'prop', id: 'p_flor', x: 80, y: 340, s: 1 }], ex: 0 });

  function ensureDraft() {
    const S = Store.s;
    if (!draft) draft = S.scenes.length ? clone(S.scenes[0]) : newDraft();
    if (draft.bg && !Store.owned(draft.bg)) draft.bg = ITEM_LIST.find(i => i.slot === 'bg' && Store.owned(i.id))?.id || null;
    if (draft.weather && !Store.owned(draft.weather)) draft.weather = null;
    draft.els = draft.els.filter(x => x.t === 'prop' ? Store.owned(x.id) : S.chars.some(c => c.uid === x.cid));
  }

  function drawCanvas() {
    $('#scCanvas').innerHTML = SceneArt.svg(draft, Store.s.chars, { sel });
    const sc = Store.sceneScore(draft);
    $('#scInfo').innerHTML = `<span>⭐ ${fmt(sc.score)}</span><span>🪙 ${fmt(Store.coinRate(draft))}/h</span>${sc.harmony >= 3 ? `<span class="ok">Harmonia ×${sc.mult}</span>` : '<span class="muted">3+ itens do mesmo tema = harmonia</span>'}${dirty ? '<span class="dirty">• não salvo</span>' : ''}`;
    $('#scTools').classList.toggle('hidden', sel < 0);
  }

  function render() {
    ensureDraft();
    const S = Store.s, lim = Store.limits();
    el().innerHTML = `
      <div class="split"><div class="split-l">
      <div class="roster">
        <button class="roster-new${!draft.uid ? ' on' : ''}" data-act="new">＋<small>Novo</small></button>
        ${S.scenes.map(s => `<button class="roster-item scene${draft.uid === s.uid ? ' on' : ''}" data-sid="${s.uid}">${SceneArt.svg(s, S.chars, { cls: 'mini' })}<small>${esc(s.name)}</small></button>`).join('')}
        <span class="roster-count">${S.scenes.length}/${lim.scenes}</span>
      </div>
      <div class="scene-wrap">
        <div class="scene-canvas" id="scCanvas"></div>
        <div class="scene-tools hidden" id="scTools">
          <button data-tool="down" title="Diminuir">➖</button>
          <button data-tool="up" title="Aumentar">➕</button>
          <button data-tool="flip" title="Espelhar">↔️</button>
          <button data-tool="back" title="Para trás">⤵️</button>
          <button data-tool="front" title="Para frente">⤴️</button>
          <button data-tool="dup" title="Duplicar">⧉</button>
          <button data-tool="del" title="Remover">🗑️</button>
        </div>
      </div>
      <div class="scene-info" id="scInfo"></div>
      <div class="studio-actions">
        <input id="scName" maxlength="20" value="${esc(draft.name)}" aria-label="Nome do cenário" />
        <button class="btn primary" data-act="save">💾 Salvar</button>
        <button class="btn icon" data-act="png" title="Baixar imagem">📸</button>
        ${draft.uid ? '<button class="btn icon danger" data-act="del" title="Excluir">🗑️</button>' : ''}
      </div>
      <p class="kbd-hint">🖱️ Arraste para mover · roda do mouse = tamanho · ⌨️ setas, +/−, F espelha, Del remove</p>
      </div><div class="split-r">
      <div class="slot-tabs" id="scTabs">
        ${[['bg', '🏞️', 'Fundo'], ['prop', '🪴', 'Objetos'], ['char', '🧑‍🎨', 'Elenco'], ['weather', '🌦️', 'Clima']].map(([k, i, n]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${i}<small>${n}</small></button>`).join('')}
      </div>
      <div id="scPanel"></div>
      </div></div>`;
    drawCanvas();
    renderPanel();
    el().onclick = onClick;
    $('#scName').oninput = e => { draft.name = e.target.value; dirty = true; };
    bindDrag();
  }

  function renderPanel() {
    const P = $('#scPanel');
    if (tab === 'char') {
      const chars = Store.s.chars;
      P.innerHTML = chars.length
        ? `<p class="muted small">Toque para colocar no cenário. Arraste para mover.</p><div class="grid">${chars.map(c => `<button class="card r0 charcard" data-addchar="${c.uid}"><div class="card-art">${Art.doll(c, { cls: 'thumb-svg', noPet: true })}</div><div class="card-name">${esc(c.name)}</div></button>`).join('')}</div>`
        : `<div class="empty">Nenhum personagem salvo ainda.<br><button class="btn primary" data-goto="studio">Criar no Estúdio</button></div>`;
      return;
    }
    const all = ITEM_LIST.filter(i => i.slot === tab).sort((a, b) => b.rarity - a.rarity);
    const own = all.filter(i => Store.owned(i.id)), locked = all.filter(i => !Store.owned(i.id));
    const cur = tab === 'bg' ? draft.bg : tab === 'weather' ? draft.weather : null;
    P.innerHTML = `<div class="grid-head"><span>${own.length}/${all.length} coletados</span>${tab === 'prop' ? `<span>${draft.els.length}/${MAX_ELS} no cenário</span>` : ''}</div>
      <div class="grid">
        ${tab === 'weather' ? `<button class="card none${!cur ? ' sel' : ''}" data-id=""><div class="card-art"><span class="q">☀️</span></div><div class="card-name">Limpo</div></button>` : ''}
        ${own.map(i => UI.itemCard(i, { sel: cur === i.id })).join('')}
        ${locked.map(i => UI.itemCard(i, { locked: true, hideLocked: true })).join('')}
      </div>`;
  }

  function addEl(obj) {
    if (draft.els.length >= MAX_ELS) { Sfx.play('error'); UI.toast(`Máximo de ${MAX_ELS} elementos`); return; }
    const jitter = () => (Math.random() - .5) * 60;
    draft.els.push(Object.assign({ x: 150 + jitter(), y: 240 + jitter(), s: 1 }, obj));
    sel = draft.els.length - 1; dirty = true; Sfx.play('equip'); drawCanvas();
  }

  function onClick(e) {
    const t = e.target.closest('button'); if (!t) return;
    const S = Store.s;
    if (t.dataset.goto) { UI.go(t.dataset.goto); return; }
    if (t.dataset.tab) { tab = t.dataset.tab; Sfx.play('tap'); $$('#scTabs button').forEach(b => b.classList.toggle('on', b === t)); renderPanel(); return; }
    if (t.dataset.addchar) { addEl({ t: 'char', cid: t.dataset.addchar, y: 280 }); return; }
    if (t.dataset.tool) { tool(t.dataset.tool); return; }
    if (t.dataset.sid) {
      const s = S.scenes.find(x => x.uid === t.dataset.sid);
      const go = () => { draft = clone(s); sel = -1; dirty = false; Sfx.play('tap'); render(); };
      if (dirty) UI.confirm('Descartar alterações não salvas?', 'Descartar', 'danger').then(ok => ok && go()); else go();
      return;
    }
    if (t.classList.contains('card')) {
      const id = t.dataset.id;
      if (t.classList.contains('locked')) { Sfx.play('error'); const it = ITEMS[id]; UI.toast(`🔒 ${RARITIES[it.rarity].name} · ${THEMES[it.theme].name}<br><small>Tente o banner Mundos Oníricos</small>`); return; }
      if (tab === 'bg') { draft.bg = id; dirty = true; Sfx.play('equip'); drawCanvas(); renderPanel(); }
      else if (tab === 'weather') { draft.weather = id || null; dirty = true; Sfx.play('equip'); drawCanvas(); renderPanel(); }
      else if (tab === 'prop') { addEl({ t: 'prop', id }); renderPanel(); }
      return;
    }
    const act = t.dataset.act;
    if (act === 'new') {
      const go = () => { draft = newDraft(); sel = -1; dirty = false; render(); };
      if (dirty) UI.confirm('Descartar alterações não salvas?', 'Descartar', 'danger').then(ok => ok && go()); else go();
    }
    if (act === 'save') save();
    if (act === 'png') UI.exportPNG(SceneArt.svg(draft, S.chars, { static: true }), 900, 1200, draft.name || 'cenario');
    if (act === 'del') {
      UI.confirm(`Excluir o cenário <b>${esc(draft.name)}</b>?`, 'Excluir', 'danger').then(ok => {
        if (!ok) return;
        S.scenes = S.scenes.filter(s => s.uid !== draft.uid); Store.save();
        draft = null; sel = -1; dirty = false; render();
      });
    }
  }

  function tool(k) {
    const e = draft.els[sel]; if (!e) return;
    if (k === 'up') e.s = Math.min(3, +(e.s * 1.15).toFixed(3));
    if (k === 'down') e.s = Math.max(.3, +(e.s / 1.15).toFixed(3));
    if (k === 'flip') e.f = e.f ? 0 : 1;
    if (k === 'front' && sel < draft.els.length - 1) { draft.els.splice(sel, 1); draft.els.push(e); sel = draft.els.length - 1; }
    if (k === 'back' && sel > 0) { draft.els.splice(sel, 1); draft.els.unshift(e); sel = 0; }
    if (k === 'dup') { addEl(Object.assign(clone(e), { x: e.x + 20, y: e.y + 10 })); return; }
    if (k === 'del') { draft.els.splice(sel, 1); sel = -1; }
    dirty = true; Sfx.play('tap'); drawCanvas();
  }

  /* Arrastar com pointer events (mouse e toque); pinça com dois dedos para escalar */
  function bindDrag() {
    const box = $('#scCanvas');
    let drag = null; const pts = new Map();
    const toSvg = (svg, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(svg.getScreenCTM().inverse()); };
    const applyT = (g, e) => g.setAttribute('transform', `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) scale(${(e.s * (e.f ? -1 : 1)).toFixed(3)} ${e.s.toFixed(3)})`);

    box.onpointerdown = ev => {
      const svg = box.querySelector('svg');
      pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (pts.size === 2 && drag) { const [a, b] = [...pts.values()]; drag.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: draft.els[drag.i].s }; return; }
      const g = ev.target.closest('.el');
      if (!g) { if (sel >= 0) { sel = -1; drawCanvas(); } return; }
      const i = +g.dataset.i;
      if (sel !== i) { sel = i; drawCanvas(); }
      const g2 = box.querySelector(`.el[data-i="${i}"]`);
      const p = toSvg(box.querySelector('svg'), ev.clientX, ev.clientY);
      drag = { i, g: g2, ox: p.x - draft.els[i].x, oy: p.y - draft.els[i].y, moved: false };
      box.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    };
    box.onpointermove = ev => {
      if (!pts.has(ev.pointerId)) return;
      pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (!drag) return;
      const e = draft.els[drag.i];
      if (drag.pinch && pts.size >= 2) {
        const [a, b] = [...pts.values()];
        e.s = Math.max(.3, Math.min(3, drag.pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / drag.pinch.d));
      } else {
        const p = toSvg(box.querySelector('svg'), ev.clientX, ev.clientY);
        e.x = Math.max(0, Math.min(300, p.x - drag.ox)); e.y = Math.max(0, Math.min(400, p.y - drag.oy));
      }
      drag.moved = true; applyT(drag.g, e);
    };
    const end = ev => {
      pts.delete(ev.pointerId);
      if (drag && pts.size === 0) { if (drag.moved) { dirty = true; drawCanvas(); } drag = null; }
      else if (drag && drag.pinch) drag.pinch = null;
    };
    box.onpointerup = end; box.onpointercancel = end;

    // Desktop: roda do mouse muda o tamanho do elemento selecionado
    box.onwheel = ev => {
      const e = draft.els[sel]; if (!e) return;
      ev.preventDefault();
      e.s = Math.max(.3, Math.min(3, e.s * (ev.deltaY < 0 ? 1.08 : 1 / 1.08)));
      const g = box.querySelector(`.el[data-i="${sel}"]`); if (g) applyT(g, e);
      dirty = true; clearTimeout(box._wt); box._wt = setTimeout(drawCanvas, 250);
    };
  }

  /* Desktop: atalhos de teclado */
  function key(ev) {
    if (sel < 0 || !draft || !draft.els[sel]) return false;
    const e = draft.els[sel], step = ev.shiftKey ? 16 : 4;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[ev.key]) {
      e.x = Math.max(0, Math.min(300, e.x + moves[ev.key][0])); e.y = Math.max(0, Math.min(400, e.y + moves[ev.key][1]));
      dirty = true; drawCanvas(); return true;
    }
    const map = { Delete: 'del', Backspace: 'del', '+': 'up', '=': 'up', '-': 'down', f: 'flip', F: 'flip', d: 'dup', D: 'dup', PageUp: 'front', PageDown: 'back' };
    if (map[ev.key]) { tool(map[ev.key]); return true; }
    if (ev.key === 'Escape') { sel = -1; drawCanvas(); return true; }
    return false;
  }

  function save() {
    const S = Store.s;
    draft.name = (draft.name || '').trim() || 'Sem nome';
    if (!draft.bg) { UI.toast('Escolha um fundo primeiro'); return; }
    if (draft.uid) {
      const i = S.scenes.findIndex(s => s.uid === draft.uid);
      if (i >= 0) { draft.ex = S.scenes[i].ex; S.scenes[i] = clone(draft); }
    } else {
      if (S.scenes.length >= Store.limits().scenes) { Sfx.play('error'); UI.toast('Limite de cenários atingido. Suba de nível!'); return; }
      draft.uid = Store.newUid(); draft.ex = 0;
      S.scenes.push(clone(draft)); Store.addXp(25);
    }
    dirty = false; sel = -1;
    Store.progress('scene'); Store.save(); Sfx.play('equip');
    UI.toast(`💾 ${esc(draft.name)} salvo! Exponha na aba Eventos 🏆`);
    UI.refresh(); render();
  }

  return { render, key };
})();
