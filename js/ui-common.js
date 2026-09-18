/* ============ UTILITÁRIOS DE INTERFACE ============ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.floor(n).toLocaleString('pt-BR');
const Screens = {};

/* ---------- Som sintetizado (sem arquivos) ---------- */
const Sfx = (() => {
  let ctx = null;
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; };
  function tone(f, dur = .12, type = 'sine', vol = .15, when = 0, slide = 0) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .02);
  }
  const P = {
    tap: () => tone(660, .06, 'triangle', .08),
    equip: () => { tone(520, .07, 'triangle', .1); tone(780, .09, 'triangle', .1, .05); },
    error: () => tone(180, .18, 'square', .06, 0, -60),
    coin: () => { tone(988, .07, 'square', .06); tone(1319, .12, 'square', .06, .06); },
    charge: () => { for (let i = 0; i < 8; i++) tone(300 + i * 70, .12, 'sine', .07, i * .09); },
    flip: () => tone(440, .05, 'triangle', .07, 0, 200),
    reveal: r => {
      const notes = [[523], [523, 659], [523, 659, 784], [523, 659, 784, 1047, 1319], [523, 659, 784, 1047, 1319, 1568, 2093]][r];
      notes.forEach((f, i) => tone(f, .25 + (r >= 3 ? .2 : 0), r >= 3 ? 'triangle' : 'sine', .12, i * .07));
    },
    fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, .2, 'triangle', .12, i * .1)),
  };
  return { play: (n, a) => { if (Store.s && Store.s.settings.sound) try { P[n](a); } catch (e) { } } };
})();

const UI = {
  /* ---------- Toast ---------- */
  toast(msg, ms = 2200) {
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = msg;
    $('#toasts').appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
  },

  /* ---------- Modal ---------- */
  modal({ title = '', body = '', buttons = [{ label: 'OK', cls: 'primary' }], cls = '', onOpen, dismissable = true } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">
      ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
      ${dismissable ? '<button class="modal-x" aria-label="Fechar">✕</button>' : ''}
      <div class="modal-body">${body}</div>
      ${buttons.length ? `<div class="modal-btns">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-b="${i}">${b.label}</button>`).join('')}</div>` : ''}
    </div>`;
    $('#modal-root').appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    const close = () => { wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 200); };
    wrap.addEventListener('click', e => {
      if (dismissable && (e.target === wrap || e.target.classList.contains('modal-x'))) return close();
      const bi = e.target.closest('[data-b]');
      if (bi) { const b = buttons[+bi.dataset.b]; Sfx.play('tap'); const r = b.onClick ? b.onClick(wrap) : undefined; if (r !== false) close(); }
    });
    if (onOpen) onOpen(wrap, close);
    return { el: wrap, close };
  },
  confirm(msg, ok = 'Confirmar', cls = 'primary') {
    return new Promise(res => UI.modal({ title: 'Confirmar', body: `<p>${msg}</p>`, buttons: [{ label: 'Cancelar', onClick: () => res(false) }, { label: ok, cls, onClick: () => res(true) }], dismissable: false }));
  },
  reward(title, rew, extra = '') {
    Sfx.play('coin');
    UI.modal({ title, cls: 'reward', body: `<div class="reward-burst">🎉</div><div class="reward-list">${Object.entries(rew).map(([k, v]) => `<div class="reward-chip"><span>${CURRENCY[k].icon}</span><b>+${fmt(v)}</b><small>${CURRENCY[k].name}</small></div>`).join('')}</div>${extra}`, buttons: [{ label: 'Oba!', cls: 'primary' }] });
    UI.refresh();
  },
  levelUp(l) {
    Sfx.play('fanfare');
    const lim = Store.limits();
    UI.modal({ title: `Nível ${l}!`, cls: 'reward', body: `<div class="reward-burst">⭐</div><p>Seu ateliê cresceu!</p><div class="reward-list"><div class="reward-chip"><span>💎</span><b>+150</b></div><div class="reward-chip"><span>🎟️</span><b>+1</b></div></div><p class="muted small">Personagens: ${lim.chars} · Cenários: ${lim.scenes} · Exposição: ${lim.exhibit}</p>` });
  },

  /* ---------- Carteira / topo ---------- */
  renderWallet() {
    const S = Store.s;
    $('#wallet').innerHTML = ['gems', 'tickets', 'coins', 'dust'].map(k => `<span class="pill" data-cur="${k}" title="${CURRENCY[k].name}"><i>${CURRENCY[k].icon}</i>${fmt(S[k])}</span>`).join('');
    $('#lvlNum').textContent = S.level;
    $('#lvlBar').style.width = Math.min(100, S.xp / Store.xpNeed(S.level) * 100) + '%';
    $('#dotDaily').classList.toggle('on', Store.loginAvailable());
    $('#dotEvents').classList.toggle('on', Store.missionsPending() || (Store.s.daily.contestTries > 0 && Store.s.chars.length > 0));
    $('#dotAlbum').classList.toggle('on', Store.albumPending());
  },
  refresh() { UI.renderWallet(); },

  /* ---------- Cartas de item ---------- */
  stars(n, max = 5) { return `<span class="stars">${'★'.repeat(n)}<i>${'★'.repeat(Math.max(0, max - n))}</i></span>`; },
  itemCard(item, o = {}) {
    const st = o.stars != null ? o.stars : Store.stars(item.id);
    const locked = o.locked != null ? o.locked : st === 0;
    return `<button class="card r${item.rarity}${locked ? ' locked' : ''}${o.sel ? ' sel' : ''}" data-id="${item.id}">
      <div class="card-art">${locked && o.hideLocked ? '<span class="q">?</span>' : Art.thumb(item, o.v || 0)}</div>
      ${o.badge ? `<span class="badge">${o.badge}</span>` : ''}
      <div class="card-foot">${locked ? `<span class="rk">${RARITIES[item.rarity].key}</span>` : UI.stars(st)}</div>
      ${o.name !== false ? `<div class="card-name">${esc(item.name)}</div>` : ''}
    </button>`;
  },
  rarityTag(r) { return `<span class="rtag r${r}">${RARITIES[r].name}</span>`; },

  /* ---------- Exportar PNG ---------- */
  async exportPNG(svgStr, w, h, name) {
    try {
      const svg = svgStr.replace(/class="[^"]*"/, `width="${w}" height="${h}"`);
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      await new Promise((ok, err) => { img.onload = ok; img.onerror = err; img.src = url; });
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d'); cx.fillStyle = '#1a1238'; cx.fillRect(0, 0, w, h); cx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
      const file = new File([blob], name + '.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; }
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.png';
      document.body.appendChild(a); a.click(); a.remove();
      UI.toast('📸 Imagem salva!');
    } catch (e) { console.error(e); UI.toast('Não foi possível gerar a imagem'); }
  },

  current: 'gacha',
  go(name) {
    UI.current = name;
    $$('#bottomnav button').forEach(b => b.classList.toggle('active', b.dataset.scr === name));
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === 'scr-' + name));
    Screens[name] && Screens[name].render();
    $('#screens').scrollTop = 0;
  },
};

/* Recompensa com texto amigável */
function rewardText(rew) { return Store.fmtReward(rew); }
