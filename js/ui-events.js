/* ============ TELA: EVENTOS (Desfile, Exposição, Missões) ============ */

Screens.events = (() => {
  let pickCid = null;
  let tick = null;
  const el = () => $('#scr-events');

  function contestThemes() {
    const r = Art.rng('desfile' + Store.dayKey());
    const a = THEME_KEYS[Math.floor(r() * THEME_KEYS.length)];
    let b; do { b = THEME_KEYS[Math.floor(r() * THEME_KEYS.length)]; } while (b === a);
    return [a, b];
  }
  function matches(ch, themes) {
    return CHAR_SLOTS.filter(s => ch.eq[s] && ITEMS[ch.eq[s].id] && themes.includes(ITEMS[ch.eq[s].id].theme)).length;
  }

  function render() {
    const S = Store.s; Store.ensureDaily();
    const th = contestThemes();
    if (!pickCid || !S.chars.some(c => c.uid === pickCid)) pickCid = S.chars[0] && S.chars[0].uid;
    const lim = Store.limits();
    const exCount = S.scenes.filter(s => s.ex).length;

    el().innerHTML = `
      <section class="panel">
        <div class="panel-head"><h3>🎭 Desfile do Dia</h3><span class="tries">${'💃'.repeat(S.daily.contestTries)}${'<i>💃</i>'.repeat(3 - S.daily.contestTries)}</span></div>
        <div class="theme-of-day">${th.map(t => `<span class="theme-pill">${THEMES[t].icon} ${THEMES[t].name}</span>`).join('<b>+</b>')}</div>
        <p class="muted small">Cada item dos temas do dia dá <b>+25%</b> de pontuação. Conjuntos (3+ itens do mesmo tema) dão bônus extra!</p>
        ${S.chars.length ? `<div class="pick-row">${S.chars.map(c => {
          const sc = Store.charScore(c).score, m = matches(c, th);
          return `<button class="pick${pickCid === c.uid ? ' on' : ''}" data-pick="${c.uid}">${Art.doll(c, { cls: 'mini', noPet: true, viewBox: '20 0 160 260' })}<b>${esc(c.name)}</b><small>⭐${fmt(sc)}${m ? ` · 🎯${m}` : ''}</small></button>`;
        }).join('')}</div>
        <button class="btn primary wide" id="evRun" ${S.daily.contestTries <= 0 ? 'disabled' : ''}>${S.daily.contestTries > 0 ? '✨ Entrar na passarela' : 'Volte amanhã!'}</button>`
        : `<div class="empty">Crie um personagem no Estúdio para desfilar.<br><button class="btn primary" data-goto="studio">Ir ao Estúdio</button></div>`}
      </section>

      <section class="panel">
        <div class="panel-head"><h3>🖼️ Exposição</h3><span class="muted">${exCount}/${lim.exhibit} vagas</span></div>
        <p class="muted small">Cenários expostos atraem visitantes e rendem 🪙 por hora (até ${Store.EXHIBIT_CAP_H}h acumuladas).</p>
        ${S.scenes.length ? `<div class="ex-list">${S.scenes.map(s => `
          <div class="ex-row${s.ex ? ' on' : ''}">
            <div class="ex-thumb">${SceneArt.svg(s, S.chars, { cls: 'mini' })}</div>
            <div class="ex-info"><b>${esc(s.name)}</b><small>🪙 ${fmt(Store.coinRate(s))}/h</small>
              ${s.ex ? `<div class="bar sm"><i data-exbar="${s.uid}"></i></div><small class="coins" data-expend="${s.uid}"></small>` : ''}</div>
            <button class="btn sm ${s.ex ? '' : 'primary'}" data-ex="${s.uid}">${s.ex ? 'Retirar' : 'Expor'}</button>
          </div>`).join('')}</div>
          <button class="btn gold wide" id="evCollect">Coletar tudo</button>`
        : `<div class="empty">Salve um cenário para expor.<br><button class="btn primary" data-goto="scene">Criar cenário</button></div>`}
      </section>

      <section class="panel">
        <div class="panel-head"><h3>📋 Missões Diárias</h3><span class="muted small">renovam à meia-noite</span></div>
        <div class="missions">${MISSIONS.map(m => {
          const st = Store.missionState(m);
          return `<div class="mission${st.claimed ? ' done' : ''}"><div><b>${m.name}</b><div class="bar sm"><i style="width:${st.p / m.goal * 100}%"></i></div><small>${st.p}/${m.goal} · ${Store.fmtReward(m.reward)}</small></div>
            <button class="btn sm ${st.done && !st.claimed ? 'gold' : ''}" data-claim="${m.id}" ${!st.done || st.claimed ? 'disabled' : ''}>${st.claimed ? '✔' : 'Pegar'}</button></div>`;
        }).join('')}
          <div class="mission bonus"><div><b>🎁 Bônus: complete todas</b><small>${Store.fmtReward(MISSION_BONUS)}</small></div>
            <button class="btn sm gold" data-claim="bonus" ${S.daily.bonus || !MISSIONS.every(m => S.daily.claimed[m.id]) ? 'disabled' : ''}>${S.daily.bonus ? '✔' : 'Pegar'}</button></div>
        </div>
      </section>

      <section class="panel stats">
        <h3>📈 Sua jornada</h3>
        <div class="stat-grid">
          <div><b>${fmt(S.stats.pulls)}</b><small>invocações</small></div>
          <div><b>${fmt(S.stats.legendaries)}</b><small>Lendário+</small></div>
          <div><b>${fmt(S.stats.contests)}</b><small>desfiles</small></div>
          <div><b>${fmt(S.stats.wins)}</b><small>vitórias</small></div>
        </div>
      </section>`;

    el().onclick = onClick;
    updatePending();
    clearInterval(tick);
    tick = setInterval(() => { if (UI.current !== 'events') return clearInterval(tick); updatePending(); }, 3000);
  }

  function updatePending() {
    let total = 0;
    for (const s of Store.s.scenes) {
      if (!s.ex) continue;
      const p = Store.pendingCoins(s); total += p;
      const h = Math.min(Store.EXHIBIT_CAP_H, (Date.now() - s.ex) / 3600000);
      const bar = $(`[data-exbar="${s.uid}"]`); if (bar) bar.style.width = (h / Store.EXHIBIT_CAP_H * 100) + '%';
      const t = $(`[data-expend="${s.uid}"]`); if (t) t.textContent = `+${fmt(p)} 🪙 ${h >= Store.EXHIBIT_CAP_H ? '(cheio!)' : ''} · 👀 ${Math.floor(h * 7 + 1)} visitantes`;
    }
    const b = $('#evCollect'); if (b) { b.textContent = total > 0 ? `Coletar tudo  🪙 ${fmt(total)}` : 'Nada para coletar ainda'; b.disabled = total <= 0; }
  }

  function onClick(e) {
    const t = e.target.closest('button'); if (!t) return;
    const S = Store.s;
    if (t.dataset.goto) return UI.go(t.dataset.goto);
    if (t.dataset.pick) { pickCid = t.dataset.pick; Sfx.play('tap'); $$('.pick').forEach(p => p.classList.toggle('on', p === t)); return; }
    if (t.id === 'evRun') return runContest();
    if (t.id === 'evCollect') {
      const n = Store.collectAll();
      if (n > 0) { Sfx.play('coin'); UI.toast(`🪙 +${fmt(n)} moedas coletadas!`); UI.refresh(); render(); }
      return;
    }
    if (t.dataset.ex) {
      const s = S.scenes.find(x => x.uid === t.dataset.ex);
      if (s.ex) { const p = Store.pendingCoins(s); if (p) { Store.give({ coins: p }); Store.progress('collect'); } s.ex = 0; }
      else {
        if (S.scenes.filter(x => x.ex).length >= Store.limits().exhibit) { Sfx.play('error'); UI.toast('Sem vagas. Retire outro cenário ou suba de nível!'); return; }
        s.ex = Date.now();
      }
      Store.save(); Sfx.play('equip'); UI.refresh(); render(); return;
    }
    if (t.dataset.claim) {
      const rew = t.dataset.claim === 'bonus' ? Store.claimMissionBonus() : Store.claimMission(t.dataset.claim);
      if (rew) UI.reward('Missão cumprida!', rew);
      render();
    }
  }

  /* ---------- Desfile ---------- */
  function makeRival(level) {
    const r = Math.random;
    const maxR = level < 3 ? 2 : level < 7 ? 3 : 4;
    const eq = {};
    for (const s of CHAR_SLOTS) {
      if (!['hair', 'eyes', 'outfit'].includes(s) && r() < .35) continue;
      const pool = ITEM_LIST.filter(i => i.slot === s && i.rarity <= maxR);
      eq[s] = { id: pool[Math.floor(r() * pool.length)].id, v: 0 };
    }
    return { name: RIVAL_NAMES[Math.floor(r() * RIVAL_NAMES.length)], skin: SKINS[Math.floor(r() * 6)], mouth: Object.keys(MOUTHS)[Math.floor(r() * 6)], eq };
  }

  function runContest() {
    const S = Store.s;
    const ch = S.chars.find(c => c.uid === pickCid);
    if (!ch || S.daily.contestTries <= 0) return;
    S.daily.contestTries--;
    const th = contestThemes();
    const L = S.level;
    const target = 60 + L * 30 + L * L * 1.5;
    const used = new Set();
    const rivals = [0, 1, 2].map(() => {
      let rv; do { rv = makeRival(L); } while (used.has(rv.name)); used.add(rv.name);
      return { name: rv.name, ch: rv, score: Math.round(target * (0.65 + Math.random() * 0.65)) };
    });
    const m = matches(ch, th);
    const base = Store.charScore(ch).score;
    const charm = 0.9 + Math.random() * 0.2;
    const me = { name: ch.name, ch, score: Math.round(base * (1 + 0.25 * m) * charm), me: true, detail: `⭐${fmt(base)} × 🎯${(1 + 0.25 * m).toFixed(2)} × 💫${charm.toFixed(2)}` };
    const all = [me, ...rivals].sort(() => Math.random() - .5);

    const modal = UI.modal({
      title: '🎭 Passarela', cls: 'contest', dismissable: false, buttons: [],
      body: `<div class="runway">${all.map((c, i) => `<div class="runner${c.me ? ' me' : ''}" data-r="${i}" style="--d:${i * .15}s">${Art.doll(c.ch, { cls: 'mini' })}<b>${esc(c.name)}</b><span class="rscore" data-sc="${i}">?</span></div>`).join('')}</div><div id="ctResult"></div>`,
    });
    Sfx.play('charge');
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
      all.forEach((c, i) => { const s = $(`[data-sc="${i}"]`, modal.el); if (s) s.textContent = fmt(c.score * ease); });
      if (k < 1) return requestAnimationFrame(step);
      finish();
    };
    setTimeout(() => requestAnimationFrame(step), 700);

    function finish() {
      const ranked = [...all].sort((a, b) => b.score - a.score);
      const place = ranked.indexOf(me) + 1;
      const medals = ['🥇', '🥈', '🥉', '4º'];
      ranked.forEach((c, pos) => { const n = $(`[data-r="${all.indexOf(c)}"]`, modal.el); n.style.order = pos; n.insertAdjacentHTML('afterbegin', `<span class="medal">${medals[pos]}</span>`); });
      const rew = [{ gems: 150, coins: 1000 }, { gems: 80, coins: 600 }, { gems: 40, coins: 400 }, { gems: 20, coins: 200 }][place - 1];
      Store.give(rew); S.stats.contests++; if (place === 1) S.stats.wins++;
      Store.progress('contest'); Store.save(); Store.addXp(30);
      Sfx.play(place === 1 ? 'fanfare' : 'reveal', place === 1 ? 4 : 2);
      $('#ctResult', modal.el).innerHTML = `<div class="ct-res p${place}"><h3>${place === 1 ? '👑 Vitória!' : `${place}º lugar`}</h3><small class="muted">${me.detail}</small><div class="reward-list">${Object.entries(rew).map(([k, v]) => `<div class="reward-chip"><span>${CURRENCY[k].icon}</span><b>+${fmt(v)}</b></div>`).join('')}</div><button class="btn primary wide" id="ctOk">Continuar</button></div>`;
      $('#ctOk', modal.el).onclick = () => { modal.close(); UI.refresh(); render(); };
    }
  }

  return { render };
})();
