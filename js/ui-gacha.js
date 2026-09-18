/* ============ TELA: INVOCAR ============ */

Screens.gacha = (() => {
  let bid = 'std';
  let timerInt = null;
  const el = () => $('#scr-gacha');

  function showcase(b) {
    if (b.id === 'std') {
      return `<div class="bn-bg bn-std"></div>` + Art.doll({ skin: '#ffe0c7', mouth: 'open', eq: { hair: { id: 'h_nebulosa' }, eyes: { id: 'e_estrela' }, outfit: { id: 'o_galaxia' }, hat: { id: 't_aureola' }, aura: { id: 'a_asas' }, pet: { id: 'pt_slime' } } }, { cls: 'bn-doll' });
    }
    if (b.id === 'world') {
      return SceneArt.svg({ bg: 'b_palacio', els: [{ t: 'prop', id: 'p_golfinho', x: 70, y: 150, s: 1.1 }, { t: 'prop', id: 'p_concha', x: 240, y: 330, s: .8 }, { t: 'prop', id: 'p_veleiro', x: 230, y: 60, s: .7 }] }, [], { cls: 'bn-scene' });
    }
    const t = Gacha.featuredTheme();
    const eq = {};
    ITEM_LIST.filter(i => i.theme === t && i.kind === 'char').forEach(i => { if (!eq[i.slot] || ITEMS[eq[i.slot].id].rarity < i.rarity) eq[i.slot] = { id: i.id }; });
    const bg = ITEM_LIST.find(i => i.theme === t && i.slot === 'bg');
    return (bg ? SceneArt.svg({ bg: bg.id, els: [] }, [], { cls: 'bn-scene' }) : '') + Art.doll({ skin: '#f6c9a3', mouth: 'open', eq }, { cls: 'bn-doll' });
  }

  function costLabel(n) {
    const c = Gacha.costFor(bid, n);
    if (c.free) return '<b class="free">GRÁTIS</b>';
    const parts = [];
    if (c.tickets) parts.push(`🎟️${c.tickets}`);
    if (c.gems) parts.push(`💎${fmt(c.gems)}`);
    return parts.join(' + ');
  }

  function timeLeft(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    return d ? `${d}d ${h}h` : `${h}h ${m}min`;
  }

  function render() {
    const S = Store.s;
    const b = BANNERS.find(x => x.id === bid);
    const p = Gacha.pity(bid);
    const toL = GACHA_RULES.hardPity - p.l;
    const toE = GACHA_RULES.epicEvery - p.e;
    const ft = Gacha.featuredTheme();
    const wish = S.wish && ITEMS[S.wish];

    const highlights = Gacha.pool(b).filter(i => b.featured ? i.theme === ft && i.rarity >= 2 : i.rarity >= 3).sort((x, y) => y.rarity - x.rarity).slice(0, 8);

    el().innerHTML = `
      <div class="split gacha-split"><div class="split-l">
      <div class="banner-tabs">${BANNERS.map(x => `<button class="chip${x.id === bid ? ' on' : ''}" data-bid="${x.id}">${x.featured ? THEMES[ft].icon + ' Destaque' : x.id === 'std' ? '🌟 ' + x.name : '🌍 ' + x.name}</button>`).join('')}</div>
      <div class="banner-card bc-${b.id}">
        <div class="banner-art">${showcase(b)}</div>
        <div class="banner-info">
          ${b.featured ? '<span class="tag-limited">LIMITADO</span>' : ''}
          <h2>${esc(Gacha.bannerName(b))}</h2>
          <p>${esc(b.desc)}</p>
          ${b.featured ? `<div class="timer">⏳ Troca em <b id="featTimer">${timeLeft(Gacha.featuredEndsAt() - Date.now())}</b></div>` : ''}
        </div>
        ${!S.firstTen ? '<div class="beginner">✨ 1ª invocação x10 garante <b>Lendário</b>!</div>' : ''}
      </div>

      </div><div class="split-r">
      <div class="pity card-glass">
        <div class="pity-row"><span>Lendário+ garantido em</span><b>${toL}</b></div>
        <div class="bar"><i style="width:${p.l / GACHA_RULES.hardPity * 100}%"></i></div>
        <div class="pity-sub">
          <span>Épico+ em <b>${toE}</b></span>
          ${p.l >= GACHA_RULES.softPity ? '<span class="hot">🔥 Chance aumentada!</span>' : `<span class="muted">Chance sobe após ${GACHA_RULES.softPity}</span>`}
        </div>
        ${b.featured ? `<div class="pity-sub"><span>Próximo Lendário:</span>${p.g ? '<b class="ok">destaque garantido ✔</b>' : '<span>50% destaque</span>'}</div>` : ''}
        ${b.wish ? `<button class="wish-btn" id="gWish">🌠 Desejo: ${wish ? `<b style="color:${RARITIES[wish.rarity].color}">${esc(wish.name)}</b>` : '<b>escolher</b>'} <span class="muted">(40%)</span></button>` : ''}
      </div>

      <div class="pull-btns">
        <button class="pull-btn x1" id="gPull1"><span>Invocar ×1</span><small>${costLabel(1)}</small></button>
        <button class="pull-btn x10" id="gPull10"><span>Invocar ×10</span><small>${costLabel(10)}</small></button>
      </div>

      <div class="gacha-links">
        <button class="btn ghost" id="gRates">📊 Taxas</button>
        <button class="btn ghost" id="gHist">📜 Histórico</button>
        <button class="btn ghost" id="gShop">🛒 Loja</button>
      </div>

      <div class="card-glass highlights">
        <h4>${b.featured ? '⭐ Itens do tema em destaque' : '💫 Destaques deste banner'}</h4>
        <div class="grid mini-grid">${highlights.map(i => UI.itemCard(i, { locked: !Store.owned(i.id) })).join('')}</div>
      </div>
      </div></div>`;

    el().onclick = e => {
      const t = e.target.closest('[data-bid]');
      if (t) { Sfx.play('tap'); bid = t.dataset.bid; render(); return; }
      const id = e.target.closest('button') && e.target.closest('button').id;
      if (id === 'gPull1') doPull(1);
      else if (id === 'gPull10') doPull(10);
      else if (id === 'gRates') ratesModal(b);
      else if (id === 'gHist') historyModal();
      else if (id === 'gShop') shopModal();
      else if (id === 'gWish') wishModal();
    };

    clearInterval(timerInt);
    if (b.featured) timerInt = setInterval(() => { const t = $('#featTimer'); if (!t) return clearInterval(timerInt); t.textContent = timeLeft(Gacha.featuredEndsAt() - Date.now()); if (Gacha.featuredEndsAt() - Date.now() <= 0) render(); }, 30000);
  }

  async function doPull(n) {
    const c = Gacha.costFor(bid, n);
    const S = Store.s;
    if (!c.free && (S.gems < c.gems)) {
      Sfx.play('error');
      UI.modal({ title: 'Gemas insuficientes', body: `<p>Você precisa de ${costLabel(n)}.</p><p class="muted">Ganhe gemas com login diário, missões, desfiles, álbum e subindo de nível — ou troque moedas na loja.</p>`, buttons: [{ label: 'Fechar' }, { label: '🛒 Loja', cls: 'primary', onClick: () => setTimeout(shopModal, 250) }] });
      return;
    }
    const res = Gacha.pull(bid, n);
    if (res.error) { UI.toast(res.error); return; }
    UI.refresh();
    await playPull(res);
    render();
  }

  /* ---------- Animação de invocação ---------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function waitTap(node, auto) {
    return new Promise(res => {
      let done = false;
      const fin = () => { if (done) return; done = true; node.removeEventListener('click', fin); res(); };
      node.addEventListener('click', fin);
      if (auto) setTimeout(fin, auto);
    });
  }

  async function playPull({ results }) {
    const ov = $('#pull-overlay');
    const fast = Store.s.settings.fastPull;
    const max = Math.max(...results.map(r => r.rarity));
    ov.className = 'pull-overlay';
    ov.innerHTML = `<div class="portal-stage pr${max}">
        <div class="portal"><div class="p-ring a"></div><div class="p-ring b"></div><div class="p-orb"></div>${Array.from({ length: 12 }, (_, i) => `<i class="p-spark" style="--a:${i * 30}deg;--d:${(i % 4) * .2}s"></i>`).join('')}</div>
        <p class="tap-hint">Toque para invocar</p>
      </div>`;
    Sfx.play('charge');
    await waitTap(ov, fast ? 700 : 4500);
    ov.querySelector('.portal-stage').classList.add('burst');
    Sfx.play('reveal', Math.min(max, 2));
    await sleep(fast ? 250 : 650);

    const single = results.length === 1;
    ov.innerHTML = `<div class="results ${single ? 'single' : ''}">
        <div class="res-grid">${results.map((r, i) => `
          <div class="res-card r${r.rarity}" data-i="${i}">
            <div class="res-inner">
              <div class="res-back"><span>✦</span></div>
              <div class="res-face">
                <div class="res-art">${Art.thumb(r.item)}</div>
                ${r.isNew ? '<span class="res-new">NOVO!</span>' : r.dust && r.stars >= 5 ? `<span class="res-dup">+${r.dust}✨</span>` : `<span class="res-dup">★${r.stars}</span>`}
                ${r.featured ? '<span class="res-feat">⭐</span>' : ''}
                <div class="res-name">${esc(r.item.name)}</div>
                <div class="res-slot">${SLOTS[r.item.slot].icon} ${RARITIES[r.rarity].name}</div>
              </div>
            </div>
          </div>`).join('')}</div>
        <div class="res-actions"><button class="btn ghost" id="resSkip">Revelar tudo ⏩</button><button class="btn primary hidden" id="resOk">Continuar</button></div>
      </div>`;

    let skip = false;
    $('#resSkip').onclick = e => { e.stopPropagation(); skip = true; };
    const cards = $$('.res-card', ov);
    for (let i = 0; i < cards.length; i++) {
      const r = results[i];
      if (!skip) await sleep(fast ? 70 : single ? 200 : 170);
      if (!skip && r.rarity >= 3) {
        cards[i].classList.add('shake');
        await sleep(fast ? 200 : 600);
      }
      cards[i].classList.add('flipped');
      if (!skip) Sfx.play(r.rarity >= 2 ? 'reveal' : 'flip', r.rarity);
      if (!skip && r.rarity >= 3) await spotlight(ov, r);
    }
    if (skip) Sfx.play('reveal', max);
    $('#resSkip').classList.add('hidden');
    const ok = $('#resOk'); ok.classList.remove('hidden');
    await new Promise(res => ok.onclick = res);
    Sfx.play('tap');
    ov.className = 'hidden'; ov.innerHTML = '';
    UI.refresh();
  }

  async function spotlight(ov, r) {
    const sp = document.createElement('div');
    sp.className = `spotlight r${r.rarity}`;
    sp.innerHTML = `<div class="rays"></div><div class="sp-art">${Art.thumb(r.item)}</div>
      <div class="sp-title">${RARITIES[r.rarity].name.toUpperCase()}!</div>
      <div class="sp-name">${esc(r.item.name)}</div>
      <div class="sp-sub">${THEMES[r.item.theme].icon} ${THEMES[r.item.theme].name} · ${SLOTS[r.item.slot].name}${r.lost5050 ? ' · <span class="muted">perdeu o 50/50 — próximo é garantido!</span>' : ''}</div>
      <p class="tap-hint">toque para continuar</p>`;
    ov.appendChild(sp);
    requestAnimationFrame(() => sp.classList.add('show'));
    Sfx.play('fanfare');
    await sleep(400);
    await waitTap(sp, Store.s.settings.fastPull ? 1500 : null);
    sp.classList.remove('show');
    await sleep(250); sp.remove();
  }

  /* ---------- Modais ---------- */
  function ratesModal(b) {
    const rows = Gacha.rates(b).map(({ r, pct, count }) => `<tr><td>${UI.rarityTag(r.id)}</td><td>${pct.toFixed(1)}%</td><td>${count} itens</td></tr>`).join('');
    UI.modal({
      title: '📊 Taxas e Regras',
      body: `<table class="rates">${rows}</table>
        <ul class="rules">
          <li>A cada <b>${GACHA_RULES.epicEvery}</b> invocações sem Épico, o próximo é <b>Épico+</b> garantido.</li>
          <li>A partir da <b>${GACHA_RULES.softPity}ª</b> invocação sem Lendário, a chance sobe <b>+${GACHA_RULES.softStep}%</b> por invocação. Na <b>${GACHA_RULES.hardPity}ª</b> é garantido.</li>
          <li>${Math.round(GACHA_RULES.mythicShare * 100)}% dos Lendário+ se tornam <b style="color:${RARITIES[4].color}">Míticos</b>.</li>
          <li><b>Destaque:</b> 50% de chance do Lendário/Épico ser do tema. Perdeu o 50/50? O próximo Lendário é garantido do destaque.</li>
          <li><b>Desejo:</b> no banner Estrelas Eternas, 40% de chance do seu Desejo quando sair a raridade dele.</li>
          <li>Repetidos sobem estrelas (★1→★5). ★3 libera a <b>Variante</b> de cor, ★5 libera o <b>Prisma</b> animado. Acima de ★5 vira ✨ Poeira.</li>
          <li>O contador de garantia é separado por banner.</li>
        </ul>`,
    });
  }

  function historyModal() {
    const H = Store.s.history;
    UI.modal({
      title: '📜 Histórico',
      body: H.length ? `<div class="hist">${H.map(h => { const it = ITEMS[h.id]; if (!it) return ''; const d = new Date(h.t); return `<div class="hist-row"><span class="dotc" style="background:${RARITIES[it.rarity].color}"></span><b style="color:${RARITIES[it.rarity].color}">${esc(it.name)}</b><small>${SLOTS[it.slot].icon} ${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small></div>`; }).join('')}</div>` : '<p class="muted">Nenhuma invocação ainda.</p>',
    });
  }

  function shopModal() {
    const draw = (root) => {
      Store.ensureDaily();
      $('.modal-body', root).innerHTML = `<p class="muted small">Estoque renova todo dia.</p><div class="shop">${SHOP.map(it => {
        const left = it.limit - (Store.s.daily.shop[it.id] || 0);
        const cost = Object.entries(it.cost).map(([k, v]) => `${CURRENCY[k].icon}${fmt(v)}`).join(' ');
        return `<div class="shop-row"><span class="shop-ic">${it.icon}</span><div><b>${it.name}</b><small>${left}/${it.limit} hoje</small></div><button class="btn primary sm" data-buy="${it.id}" ${left <= 0 || !Store.can(it.cost) ? 'disabled' : ''}>${cost}</button></div>`;
      }).join('')}</div>`;
    };
    UI.modal({
      title: '🛒 Loja do Ateliê', buttons: [],
      onOpen: (root) => {
        draw(root);
        root.addEventListener('click', e => {
          const b = e.target.closest('[data-buy]'); if (!b) return;
          const r = Gacha.buy(b.dataset.buy);
          if (r.error) { Sfx.play('error'); UI.toast(r.error); } else { Sfx.play('coin'); UI.toast('Compra realizada!'); }
          UI.refresh(); draw(root); if (UI.current === 'gacha') render();
        });
      },
    });
  }

  function wishModal() {
    const opts = ITEM_LIST.filter(i => i.kind === 'char' && i.rarity >= 3);
    UI.modal({
      title: '🌠 Escolha seu Desejo', buttons: [],
      body: `<p class="muted small">Quando sair um item da mesma raridade no banner Estrelas Eternas, há 40% de chance de ser o seu Desejo.</p><div class="grid">${opts.map(i => UI.itemCard(i, { sel: Store.s.wish === i.id, locked: false })).join('')}</div>`,
      onOpen: (root, close) => root.addEventListener('click', e => {
        const c = e.target.closest('.card'); if (!c) return;
        Store.s.wish = c.dataset.id; Store.save(); Sfx.play('equip'); close(); render();
      }),
    });
  }

  return { render, shopModal };
})();
