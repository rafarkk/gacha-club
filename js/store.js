/* ============ ESTADO, PERSISTÊNCIA E ECONOMIA ============ */

const SAVE_KEY = 'atelieEstelar.save.v1';
const SAVE_VERSION = 1;

const Store = (() => {
  let S = null;
  let saveTimer = null;
  const listeners = new Set();

  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dayNumber = (d = new Date()) => Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
  const newUid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function fresh() {
    const inv = {};
    STARTER_ITEMS.forEach(id => inv[id] = 1);
    return {
      v: SAVE_VERSION, created: Date.now(),
      gems: 1600, coins: 1000, dust: 0, tickets: 10,
      xp: 0, level: 1,
      inv,
      pity: {},
      firstTen: false,
      wish: null,
      freePullDay: '',
      chars: [],
      scenes: [],
      daily: null,
      login: { last: '', count: 0 },
      album: { milestones: [], themes: [] },
      history: [],
      stats: { pulls: 0, legendaries: 0, contests: 0, wins: 0 },
      settings: { sound: true, fastPull: false },
      tutorialSeen: false,
    };
  }

  function migrate(d) {
    const base = fresh();
    for (const k of Object.keys(base)) if (d[k] === undefined) d[k] = base[k];
    d.settings = Object.assign(base.settings, d.settings);
    d.stats = Object.assign(base.stats, d.stats);
    d.album = Object.assign(base.album, d.album);
    // Remove itens que não existem mais
    for (const id of Object.keys(d.inv)) if (!ITEMS[id]) delete d.inv[id];
    d.v = SAVE_VERSION;
    return d;
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      S = raw ? migrate(JSON.parse(raw)) : fresh();
    } catch (e) {
      console.warn('Save corrompido, iniciando novo jogo', e);
      try { localStorage.setItem(SAVE_KEY + '.corrupt', localStorage.getItem(SAVE_KEY) || ''); } catch (_) {}
      S = fresh();
    }
    ensureDaily();
    saveNow();
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    return S;
  }

  function saveNow() {
    clearTimeout(saveTimer); saveTimer = null;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
    catch (e) { console.error('Falha ao salvar', e); UI && UI.toast && UI.toast('⚠️ Não foi possível salvar (armazenamento cheio?)'); }
  }
  function save() {
    if (!saveTimer) saveTimer = setTimeout(saveNow, 300);
    listeners.forEach(fn => fn(S));
  }
  window.addEventListener('pagehide', () => saveNow());
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });

  function ensureDaily() {
    const today = dayKey();
    if (!S.daily || S.daily.day !== today) {
      S.daily = { day: today, prog: {}, claimed: {}, bonus: false, contestTries: 3, shop: {} };
    }
  }

  /* ---------- Moedas ---------- */
  function can(cost) { return Object.entries(cost).every(([k, v]) => (S[k] || 0) >= v); }
  function pay(cost) { if (!can(cost)) return false; for (const [k, v] of Object.entries(cost)) S[k] -= v; save(); return true; }
  function give(rew) { for (const [k, v] of Object.entries(rew)) S[k] = (S[k] || 0) + v; save(); }
  const fmtReward = rew => Object.entries(rew).map(([k, v]) => `${CURRENCY[k].icon} ${v.toLocaleString('pt-BR')}`).join('  ');

  /* ---------- XP / Nível ---------- */
  const xpNeed = lvl => 100 + lvl * 60;
  function addXp(n) {
    S.xp += n;
    const ups = [];
    while (S.xp >= xpNeed(S.level)) {
      S.xp -= xpNeed(S.level); S.level++;
      const rew = { gems: 150, tickets: 1 };
      give(rew); ups.push(S.level);
    }
    save();
    ups.forEach(l => UI.levelUp(l));
  }
  const limits = () => ({
    chars: Math.min(12, 3 + Math.floor(S.level / 2)),
    scenes: Math.min(10, 2 + Math.floor(S.level / 2)),
    exhibit: Math.min(6, 1 + Math.floor(S.level / 3)),
  });

  /* ---------- Missões ---------- */
  function progress(id, n = 1) {
    ensureDaily();
    S.daily.prog[id] = (S.daily.prog[id] || 0) + n;
    save();
  }
  function missionState(m) {
    const p = Math.min(m.goal, S.daily.prog[m.id] || 0);
    return { p, done: p >= m.goal, claimed: !!S.daily.claimed[m.id] };
  }
  function claimMission(id) {
    const m = MISSIONS.find(x => x.id === id); const st = missionState(m);
    if (!st.done || st.claimed) return null;
    S.daily.claimed[id] = true; give(m.reward); addXp(15);
    return m.reward;
  }
  function claimMissionBonus() {
    if (S.daily.bonus || !MISSIONS.every(m => S.daily.claimed[m.id])) return null;
    S.daily.bonus = true; give(MISSION_BONUS); return MISSION_BONUS;
  }
  const missionsPending = () => MISSIONS.some(m => { const s = missionState(m); return s.done && !s.claimed; }) || (!S.daily.bonus && MISSIONS.every(m => S.daily.claimed[m.id]));

  /* ---------- Login diário ---------- */
  const loginAvailable = () => S.login.last !== dayKey();
  function claimLogin() {
    if (!loginAvailable()) return null;
    const idx = S.login.count % LOGIN_REWARDS.length;
    const rew = LOGIN_REWARDS[idx];
    S.login.last = dayKey(); S.login.count++;
    give(rew);
    return { rew, idx };
  }

  /* ---------- Inventário / Pontuação ---------- */
  const stars = id => S.inv[id] || 0;
  const owned = id => stars(id) > 0;
  function itemPts(id, st) {
    const it = ITEMS[id]; if (!it) return 0;
    const s = st == null ? Math.max(1, stars(id)) : st;
    return RARITIES[it.rarity].pts * (1 + 0.25 * (s - 1));
  }
  function charScore(ch, starFn) {
    let sum = 0; const themes = {};
    for (const slot of CHAR_SLOTS) {
      const e = ch.eq && ch.eq[slot]; if (!e || !ITEMS[e.id]) continue;
      const it = ITEMS[e.id];
      sum += itemPts(e.id, starFn ? starFn(e.id) : undefined);
      if (it.theme !== 'base') themes[it.theme] = (themes[it.theme] || 0) + 1;
    }
    let setTheme = null, setCount = 0;
    for (const [t, n] of Object.entries(themes)) if (n > setCount) { setTheme = t; setCount = n; }
    const mult = setCount >= 5 ? 1.5 : setCount >= 3 ? 1.2 : 1;
    return { score: Math.round(sum * mult * 10), setTheme, setCount, mult };
  }
  function sceneScore(sc) {
    let sum = 0; const themes = {};
    const add = id => { const it = ITEMS[id]; if (!it) return; sum += itemPts(id); if (it.theme !== 'base') themes[it.theme] = (themes[it.theme] || 0) + 1; };
    if (sc.bg) add(sc.bg);
    if (sc.weather) add(sc.weather);
    const seen = new Set();
    for (const el of sc.els || []) {
      if (el.t === 'prop') add(el.id);
      if (el.t === 'char' && !seen.has(el.cid)) {
        seen.add(el.cid);
        const ch = S.chars.find(c => c.uid === el.cid);
        if (ch) sum += charScore(ch).score / 20;
      }
    }
    const harmony = Math.max(0, ...Object.values(themes));
    const mult = harmony >= 5 ? 1.4 : harmony >= 3 ? 1.15 : 1;
    return { score: Math.round(sum * mult * 10), harmony, mult };
  }

  /* ---------- Exposição (renda passiva) ---------- */
  const EXHIBIT_CAP_H = 10;
  const coinRate = sc => Math.round(40 + sceneScore(sc).score * 0.2); // moedas/hora
  function pendingCoins(sc) {
    if (!sc.ex) return 0;
    const h = Math.min(EXHIBIT_CAP_H, (Date.now() - sc.ex) / 3600000);
    return Math.floor(h * coinRate(sc));
  }
  function collectAll() {
    let total = 0;
    for (const sc of S.scenes) if (sc.ex) { total += pendingCoins(sc); sc.ex = Date.now(); }
    if (total > 0) { give({ coins: total }); progress('collect'); }
    return total;
  }

  /* ---------- Álbum ---------- */
  function albumPct() { const own = ITEM_LIST.filter(i => owned(i.id)).length; return { own, total: ITEM_LIST.length, pct: own / ITEM_LIST.length * 100 }; }
  function themeComplete(t) { return ITEM_LIST.filter(i => i.theme === t).every(i => owned(i.id)); }
  const albumPending = () => {
    const { pct } = albumPct();
    return ALBUM_MILESTONES.some(m => pct >= m.pct && !S.album.milestones.includes(m.pct)) ||
      Object.keys(THEMES).some(t => themeComplete(t) && !S.album.themes.includes(t));
  };

  /* ---------- Exportar / Importar ---------- */
  function exportCode() {
    saveNow();
    return btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  }
  function importCode(code) {
    const txt = code.trim().startsWith('{') ? code.trim() : decodeURIComponent(escape(atob(code.trim())));
    const d = JSON.parse(txt);
    if (!d || typeof d !== 'object' || !d.inv) throw new Error('Código inválido');
    S = migrate(d); ensureDaily(); saveNow(); listeners.forEach(fn => fn(S));
  }
  function reset() { S = fresh(); ensureDaily(); saveNow(); listeners.forEach(fn => fn(S)); }

  return {
    load, save, saveNow, get s() { return S; }, on: fn => listeners.add(fn),
    dayKey, dayNumber, newUid, ensureDaily,
    can, pay, give, fmtReward,
    addXp, xpNeed, limits,
    progress, missionState, claimMission, claimMissionBonus, missionsPending,
    loginAvailable, claimLogin,
    stars, owned, itemPts, charScore, sceneScore,
    coinRate, pendingCoins, collectAll, EXHIBIT_CAP_H,
    albumPct, themeComplete, albumPending,
    exportCode, importCode, reset,
  };
})();
