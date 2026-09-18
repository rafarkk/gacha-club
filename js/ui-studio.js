/* ============ TELA: ESTÚDIO DE PERSONAGEM ============ */

Screens.studio = (() => {
  let draft = null;
  let tab = 'hair';
  let dirty = false;
  const el = () => $('#scr-studio');

  const newDraft = () => ({
    uid: null, name: 'Nova Estrela', skin: SKINS[1], mouth: 'smile', blush: true,
    eq: { hair: { id: 'h_cast', v: 0 }, eyes: { id: 'e_basic', v: 0 }, outfit: { id: 'o_tee', v: 0 } },
  });
  const clone = o => JSON.parse(JSON.stringify(o));

  function ensureDraft() {
    if (!draft) {
      const S = Store.s;
      draft = S.chars.length ? clone(S.chars[0]) : newDraft();
    }
    // remove itens que o jogador não possui mais (ex.: após importar save)
    for (const s of CHAR_SLOTS) if (draft.eq[s] && !Store.owned(draft.eq[s].id)) delete draft.eq[s];
  }

  function renderStage() {
    const sc = Store.charScore(draft);
    $('#stStage').innerHTML = Art.doll(draft, { cls: 'doll big' }) +
      `<div class="score-badge">⭐ ${fmt(sc.score)}</div>` +
      (sc.setCount >= 2 ? `<div class="set-badge ${sc.setCount >= 3 ? 'on' : ''}">${THEMES[sc.setTheme].icon} ${THEMES[sc.setTheme].name} ${sc.setCount}/5 ${sc.setCount >= 5 ? '· +50%' : sc.setCount >= 3 ? '· +20%' : '· 3 p/ bônus'}</div>` : '') +
      (dirty ? '<div class="dirty">• não salvo</div>' : '');
  }

  function render() {
    ensureDraft();
    const S = Store.s, lim = Store.limits();
    el().innerHTML = `
      <div class="split"><div class="split-l">
      <div class="roster">
        <button class="roster-new${!draft.uid ? ' on' : ''}" data-act="new">＋<small>Novo</small></button>
        ${S.chars.map(c => `<button class="roster-item${draft.uid === c.uid ? ' on' : ''}" data-cid="${c.uid}">${Art.doll(c, { viewBox: '30 20 140 130', cls: 'mini', noPet: true })}<small>${esc(c.name)}</small></button>`).join('')}
        <span class="roster-count">${S.chars.length}/${lim.chars}</span>
      </div>
      <div class="stage" id="stStage"></div>
      <div class="studio-actions">
        <input id="stName" maxlength="18" value="${esc(draft.name)}" aria-label="Nome do personagem" />
        <button class="btn primary" data-act="save">💾 Salvar</button>
        <button class="btn icon" data-act="rand" title="Aleatório">🎲</button>
        <button class="btn icon" data-act="png" title="Baixar imagem">📸</button>
        ${draft.uid ? '<button class="btn icon danger" data-act="del" title="Excluir">🗑️</button>' : ''}
      </div>
      </div><div class="split-r">
      <div class="slot-tabs" id="stTabs">
        <button data-tab="body" class="${tab === 'body' ? 'on' : ''}">🙂<small>Corpo</small></button>
        ${CHAR_SLOTS.map(s => `<button data-tab="${s}" class="${tab === s ? 'on' : ''}">${SLOTS[s].icon}<small>${SLOTS[s].name}</small></button>`).join('')}
      </div>
      <div id="stPanel"></div>
      </div></div>`;
    renderStage();
    renderPanel();

    el().onclick = onClick;
    $('#stName').oninput = e => { draft.name = e.target.value; dirty = true; };
  }

  function renderPanel() {
    const P = $('#stPanel');
    if (tab === 'body') {
      P.innerHTML = `<h4>Tom de pele</h4><div class="swatches">${SKINS.map(c => `<button class="sw${draft.skin === c ? ' on' : ''}" data-skin="${c}" style="background:${c}"></button>`).join('')}</div>
        <h4>Expressão</h4><div class="chips">${Object.entries(MOUTHS).map(([k, n]) => `<button class="chip${draft.mouth === k ? ' on' : ''}" data-mouth="${k}">${n}</button>`).join('')}</div>
        <h4>Bochechas</h4><div class="chips"><button class="chip${draft.blush !== false ? ' on' : ''}" data-blush="1">Rosadas</button><button class="chip${draft.blush === false ? ' on' : ''}" data-blush="0">Sem blush</button></div>`;
      return;
    }
    const all = ITEM_LIST.filter(i => i.slot === tab).sort((a, b) => b.rarity - a.rarity);
    const own = all.filter(i => Store.owned(i.id)), locked = all.filter(i => !Store.owned(i.id));
    const cur = draft.eq[tab];
    let variant = '';
    if (cur) {
      const st = Store.stars(cur.id);
      variant = `<div class="variants"><span>Variante:</span>
        <button class="chip${!cur.v ? ' on' : ''}" data-var="0">Normal</button>
        <button class="chip${cur.v === 1 ? ' on' : ''}" data-var="1" ${st < 3 ? 'disabled' : ''}>🎨 Cor ${st < 3 ? '(★3)' : ''}</button>
        <button class="chip prisma${cur.v === 2 ? ' on' : ''}" data-var="2" ${st < 5 ? 'disabled' : ''}>🌈 Prisma ${st < 5 ? '(★5)' : ''}</button></div>`;
    }
    P.innerHTML = variant + `<div class="grid-head"><span>${own.length}/${all.length} coletados</span></div>
      <div class="grid">
        <button class="card none${!cur ? ' sel' : ''}" data-id=""><div class="card-art"><span class="q">∅</span></div><div class="card-name">Nenhum</div></button>
        ${own.map(i => UI.itemCard(i, { sel: cur && cur.id === i.id, v: cur && cur.id === i.id ? cur.v : 0 })).join('')}
        ${locked.map(i => UI.itemCard(i, { locked: true, hideLocked: true })).join('')}
      </div>`;
  }

  function onClick(e) {
    const t = e.target.closest('button'); if (!t) return;
    const S = Store.s;
    if (t.dataset.tab) { tab = t.dataset.tab; Sfx.play('tap'); $$('#stTabs button').forEach(b => b.classList.toggle('on', b === t)); renderPanel(); return; }
    if (t.dataset.skin) { draft.skin = t.dataset.skin; dirty = true; Sfx.play('tap'); renderStage(); renderPanel(); return; }
    if (t.dataset.mouth) { draft.mouth = t.dataset.mouth; dirty = true; Sfx.play('tap'); renderStage(); renderPanel(); return; }
    if (t.dataset.blush) { draft.blush = t.dataset.blush === '1'; dirty = true; Sfx.play('tap'); renderStage(); renderPanel(); return; }
    if (t.dataset.var != null) { draft.eq[tab].v = +t.dataset.var; dirty = true; Sfx.play('equip'); renderStage(); renderPanel(); return; }
    if (t.dataset.cid) {
      const c = S.chars.find(x => x.uid === t.dataset.cid);
      const go = () => { draft = clone(c); dirty = false; Sfx.play('tap'); render(); };
      if (dirty) UI.confirm('Descartar alterações não salvas?', 'Descartar', 'danger').then(ok => ok && go()); else go();
      return;
    }
    if (t.classList.contains('card')) {
      const id = t.dataset.id;
      if (t.classList.contains('locked')) { Sfx.play('error'); const it = ITEMS[id]; UI.toast(`🔒 ${RARITIES[it.rarity].name} · ${THEMES[it.theme].name}<br><small>Obtenha invocando ou criando com ✨ no Álbum</small>`); return; }
      if (!id) delete draft.eq[tab]; else draft.eq[tab] = { id, v: 0 };
      dirty = true; Sfx.play('equip'); renderStage(); renderPanel(); return;
    }
    const act = t.dataset.act;
    if (act === 'new') {
      const go = () => { draft = newDraft(); dirty = false; render(); };
      if (dirty) UI.confirm('Descartar alterações não salvas?', 'Descartar', 'danger').then(ok => ok && go()); else go();
    }
    if (act === 'save') save();
    if (act === 'rand') randomize();
    if (act === 'png') UI.exportPNG(Art.doll(draft, { viewBox: '-20 -10 240 280' }), 720, 840, draft.name || 'personagem');
    if (act === 'del') {
      UI.confirm(`Excluir <b>${esc(draft.name)}</b>? Ele também sairá dos cenários.`, 'Excluir', 'danger').then(ok => {
        if (!ok) return;
        S.chars = S.chars.filter(c => c.uid !== draft.uid);
        S.scenes.forEach(sc => sc.els = sc.els.filter(x => !(x.t === 'char' && x.cid === draft.uid)));
        Store.save(); draft = null; dirty = false; render();
      });
    }
  }

  function save() {
    const S = Store.s;
    draft.name = (draft.name || '').trim() || 'Sem nome';
    if (draft.uid) {
      const i = S.chars.findIndex(c => c.uid === draft.uid);
      if (i >= 0) S.chars[i] = clone(draft);
    } else {
      if (S.chars.length >= Store.limits().chars) { Sfx.play('error'); UI.toast(`Elenco cheio (${S.chars.length}). Suba de nível para mais vagas!`); return; }
      draft.uid = Store.newUid();
      S.chars.push(clone(draft));
      Store.addXp(25);
    }
    dirty = false;
    Store.progress('char');
    Store.save(); Sfx.play('equip'); UI.toast(`💾 ${esc(draft.name)} salvo!`);
    UI.refresh(); render();
  }

  function randomize() {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    for (const s of CHAR_SLOTS) {
      const own = ITEM_LIST.filter(i => i.slot === s && Store.owned(i.id));
      const optional = !['hair', 'eyes', 'outfit'].includes(s);
      if (!own.length || (optional && Math.random() < .4)) delete draft.eq[s];
      else draft.eq[s] = { id: pick(own).id, v: 0 };
    }
    draft.skin = pick(SKINS.slice(0, 6)); draft.mouth = pick(Object.keys(MOUTHS));
    dirty = true; Sfx.play('equip'); renderStage(); renderPanel();
  }

  return { render };
})();
