/* ============ TELA: ÁLBUM (coleção, conquistas, criação com poeira) ============ */

Screens.album = (() => {
  let fSlot = 'all', fTheme = 'all';
  const el = () => $('#scr-album');

  function render() {
    const S = Store.s;
    const { own, total, pct } = Store.albumPct();
    const items = ITEM_LIST.filter(i => (fSlot === 'all' || i.slot === fSlot) && (fTheme === 'all' || i.theme === fTheme))
      .sort((a, b) => (Store.owned(b.id) - Store.owned(a.id)) || b.rarity - a.rarity);

    el().innerHTML = `
      <section class="panel">
        <div class="panel-head"><h3>📖 Coleção</h3><b>${own}/${total} · ${pct.toFixed(0)}%</b></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="milestones">${ALBUM_MILESTONES.map(m => {
          const got = S.album.milestones.includes(m.pct), ready = pct >= m.pct && !got;
          return `<button class="ms${got ? ' got' : ''}${ready ? ' ready' : ''}" data-ms="${m.pct}" ${ready ? '' : 'disabled'}><b>${m.pct}%</b><small>${got ? '✔' : Store.fmtReward(m.reward)}</small></button>`;
        }).join('')}</div>
      </section>

      <section class="panel">
        <div class="panel-head"><h3>🏅 Conjuntos</h3><span class="muted small">complete um tema: ${Store.fmtReward(THEME_COMPLETE_REWARD)}</span></div>
        <div class="theme-list">${Object.keys(THEMES).map(t => {
          const list = ITEM_LIST.filter(i => i.theme === t), n = list.filter(i => Store.owned(i.id)).length;
          const done = n === list.length, got = S.album.themes.includes(t);
          return `<button class="theme-row${fTheme === t ? ' on' : ''}${done ? ' done' : ''}" data-theme="${t}"><span>${THEMES[t].icon}</span><b>${THEMES[t].name}</b><small>${n}/${list.length}</small>
            ${done && !got ? `<span class="claim-theme" data-tclaim="${t}">Pegar!</span>` : got ? '<span class="ok">✔</span>' : ''}</button>`;
        }).join('')}</div>
      </section>

      <div class="filters">
        <button class="chip${fSlot === 'all' ? ' on' : ''}" data-slot="all">Todos</button>
        ${Object.entries(SLOTS).map(([k, s]) => `<button class="chip${fSlot === k ? ' on' : ''}" data-slot="${k}">${s.icon} ${s.name}</button>`).join('')}
      </div>
      ${fTheme !== 'all' ? `<div class="filter-note">Tema: <b>${THEMES[fTheme].icon} ${THEMES[fTheme].name}</b> <button class="chip" data-theme="all">✕ limpar</button></div>` : ''}
      <div class="grid album-grid">${items.map(i => UI.itemCard(i)).join('')}</div>
      <p class="muted small center">✨ Poeira: ${fmt(S.dust)} — toque num item para criar ou evoluir.</p>`;

    el().onclick = onClick;
  }

  function onClick(e) {
    const S = Store.s;
    const tc = e.target.closest('[data-tclaim]');
    if (tc) {
      e.stopPropagation();
      const t = tc.dataset.tclaim;
      if (Store.themeComplete(t) && !S.album.themes.includes(t)) { S.album.themes.push(t); Store.give(THEME_COMPLETE_REWARD); UI.reward(`${THEMES[t].icon} ${THEMES[t].name} completo!`, THEME_COMPLETE_REWARD); render(); }
      return;
    }
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.ms) {
      const m = ALBUM_MILESTONES.find(x => x.pct === +t.dataset.ms);
      S.album.milestones.push(m.pct); Store.give(m.reward); UI.reward(`Coleção ${m.pct}%!`, m.reward); render(); return;
    }
    if (t.dataset.slot) { fSlot = t.dataset.slot; Sfx.play('tap'); render(); return; }
    if (t.dataset.theme) { fTheme = fTheme === t.dataset.theme ? 'all' : t.dataset.theme; Sfx.play('tap'); render(); return; }
    if (t.classList.contains('card')) detail(ITEMS[t.dataset.id]);
  }

  function detail(it) {
    const draw = root => {
      const st = Store.stars(it.id), r = RARITIES[it.rarity], S = Store.s;
      const canCraft = r.craft > 0 && st < GACHA_RULES.maxStars;
      const isChar = it.kind === 'char';
      $('.modal-body', root).innerHTML = `
        <div class="detail r${it.rarity}">
          <div class="detail-art${st ? '' : ' locked'}">${Art.thumb(it)}</div>
          <h3>${esc(it.name)}</h3>
          <div class="detail-tags">${UI.rarityTag(it.rarity)}<span class="rtag">${SLOTS[it.slot].icon} ${SLOTS[it.slot].name}</span><span class="rtag">${THEMES[it.theme].icon} ${THEMES[it.theme].name}</span></div>
          <div class="detail-stars">${st ? UI.stars(st) : '<span class="muted">Não obtido</span>'}</div>
          <p class="muted small">Pontos de estilo: ${fmt(Store.itemPts(it.id, Math.max(1, st)) * 10)} ${st >= 5 ? '(máx.)' : `→ ${fmt(Store.itemPts(it.id, Math.max(1, st) + (st ? 1 : 0)) * 10)} no próximo ★`}</p>
          ${isChar ? `<div class="variant-prev">${[0, 1, 2].map(v => `<div class="vp${(v === 1 && st < 3) || (v === 2 && st < 5) ? ' lock' : ''}">${Art.thumb(it, v)}<small>${['Normal', '★3 Cor', '★5 Prisma'][v]}</small></div>`).join('')}</div>` : ''}
          ${canCraft ? `<button class="btn primary wide" id="dtCraft" ${S.dust < r.craft ? 'disabled' : ''}>${st ? `Evoluir para ★${st + 1}` : 'Criar item'} · ✨ ${fmt(r.craft)}</button><small class="muted">Você tem ✨ ${fmt(S.dust)}</small>`
            : r.craft === 0 ? '<p class="muted small">Itens Míticos só podem ser obtidos por invocação.</p>' : '<p class="ok small">Estrelas no máximo! Repetidos viram poeira.</p>'}
        </div>`;
      const b = $('#dtCraft', root);
      if (b) b.onclick = () => {
        const res = Gacha.craft(it.id);
        if (res.error) { Sfx.play('error'); UI.toast(res.error); return; }
        Sfx.play('reveal', it.rarity); UI.toast(`✨ ${esc(it.name)} ★${res.stars}!`);
        UI.refresh(); draw(root); render();
      };
    };
    UI.modal({ title: '', buttons: [], cls: 'detail-modal', onOpen: draw });
  }

  return { render };
})();
