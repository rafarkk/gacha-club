/* ============ ESTADO E PERSISTÊNCIA ============ */

const SAVE_KEY = 'atelieEstelar.clube.v2';
const SAVE_VERSION = 4;
const BACKUP_SLOTS = 90;

const Store = (() => {
  let S = null, timer = null;
  const listeners = new Set();

  function fresh() {
    return {
      v: SAVE_VERSION, created: Date.now(),
      chars: MAIN_CHARS(),
      cur: 0,
      backups: Array(BACKUP_SLOTS).fill(null),
      menuBg: { bg: 1, color: '#6b4cff', fg: 0, tint: 0, tintColor: '#000000', mx: 0, my: 0, scale: 1 },
      player: { xp: 0, level: 1, gems: 0, gold: 0 },
      recentColors: [],
      settings: { sound: 1, quality: 1, linkPairs: 1, copyColors: 1 },
      tutorialSeen: false,
      studio: defaultStudio(),
      scenes: Array(15).fill(null),
    };
  }

  /* Completa campos que faltam em personagens antigos/importados */
  function fixChar(ch) {
    const b = baseChar();
    const c = Object.assign(b, ch);
    c.parts = Object.assign(blankParts(), ch.parts || {});
    for (const [k, p] of Object.entries(c.parts)) {
      if (!SLOT_DEFS[k]) { delete c.parts[k]; continue; }
      if (!Array.isArray(p.c) || p.c.length < 3) p.c = ['#ffffff', '#b8c0cf', OUTLINE];
      const max = (PARTS[SLOT_DEFS[k].t] || []).length - 1;
      if (!(p.i >= 0 && p.i <= max)) p.i = 0;
    }
    for (const k of ['body', 'hide', 'anim', 'pet', 'chat', 'profile']) c[k] = Object.assign(baseChar()[k], ch[k] || {});
    if (!(c.body.pose >= 0 && c.body.pose < POSES.length)) c.body.pose = 0;
    c.adj = ch.adj || {};
    c.id = ch.id || newId();
    return c;
  }

  function migrate(d) {
    const base = fresh();
    for (const k of Object.keys(base)) if (d[k] === undefined) d[k] = base[k];
    d.settings = Object.assign(base.settings, d.settings);
    d.player = Object.assign(base.player, d.player);
    d.menuBg = Object.assign(base.menuBg, d.menuBg);
    d.chars = (d.chars || []).slice(0, 10).map(fixChar);
    while (d.chars.length < 10) d.chars.push(MAIN_CHARS()[d.chars.length]);
    d.backups = Array.from({ length: BACKUP_SLOTS }, (_, i) => d.backups && d.backups[i] ? fixChar(d.backups[i]) : null);
    d.chars.forEach(c => { if (c.name === 'Básica') c.name = 'Menina Padrão'; if (c.name === 'Básico') c.name = 'Menino Padrão'; });
    /* v3/v4: os padrões passaram a seguir o visual dos padrões do Gacha Club */
    if ((d.v || 0) < 4) d.chars.forEach((c, i) => {
      const n = c.name === 'Menina Padrão' ? DEFAULT_GIRL() : c.name === 'Menino Padrão' ? DEFAULT_BOY() : null;
      if (n) d.chars[i] = Object.assign(n, { id: c.id });
    });
    if (!(d.cur >= 0 && d.cur < 10)) d.cur = 0;
    const ds = defaultStudio(), st = d.studio || {};
    d.studio = Object.assign(ds, st, { bg: Object.assign(ds.bg, st.bg), narr: Object.assign(ds.narr, st.narr) });
    d.studio.chars = (d.studio.chars || []).filter(e => e.ci >= 0 && e.ci < 10);
    d.studio.pets = (d.studio.pets || []).filter(e => PARTS.pet[e.pi]);
    d.studio.objs = (d.studio.objs || []).filter(e => PARTS.object[e.oi]);
    d.scenes = Array.from({ length: 15 }, (_, i) => (d.scenes || [])[i] || null);
    d.v = SAVE_VERSION;
    return d;
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      S = raw ? migrate(JSON.parse(raw)) : fresh();
    } catch (e) {
      console.warn('Save inválido; começando do zero', e);
      try { localStorage.setItem(SAVE_KEY + '.corrompido', localStorage.getItem(SAVE_KEY) || ''); } catch (_) { }
      S = fresh();
    }
    saveNow();
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
    return S;
  }
  function saveNow() {
    clearTimeout(timer); timer = null;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
    catch (e) { console.error(e); UI.toast('⚠️ Não foi possível salvar (armazenamento cheio?)'); }
  }
  function save() { if (!timer) timer = setTimeout(saveNow, 400); listeners.forEach(f => f(S)); }
  window.addEventListener('pagehide', () => S && saveNow());
  document.addEventListener('visibilitychange', () => { if (document.hidden && S) saveNow(); });

  /* ---------- Progresso do jogador ---------- */
  const xpNeed = l => 80 + l * 40;
  function addXp(n) {
    const P = S.player; P.xp += n;
    let up = false;
    while (P.xp >= xpNeed(P.level)) { P.xp -= xpNeed(P.level); P.level++; P.gems += 50; up = true; }
    save();
    if (up) { Sfx.play('save'); UI.toast(`⭐ Nível ${P.level}! +50 💎`); }
  }

  /* ---------- Cópias entre personagens ---------- */
  const CLOTHES = ['hat', 'glasses', 'headAcc', 'headAcc2', 'faceAcc', 'neck', 'logo', 'shirt', 'jacket', 'skirt', 'sleeveL', 'sleeveR', 'pantsL', 'pantsR', 'sockL', 'sockR', 'shoeL', 'shoeR', 'gloveL', 'gloveR', 'cape', 'tail', 'wings', 'propL', 'propR', 'shield', 'effBack', 'effFront'];
  function copyInto(dst, src, mode = 'all', colors = true) {
    const slots = mode === 'hair' ? HAIR_SLOTS : mode === 'clothes' ? CLOTHES : Object.keys(SLOT_DEFS);
    for (const s of slots) {
      const p = src.parts[s]; if (!p) continue;
      dst.parts[s] = colors ? clone(p) : { i: p.i, c: dst.parts[s].c.slice() };
      if (src.adj[s]) dst.adj[s] = clone(src.adj[s]); else delete dst.adj[s];
    }
    if (mode === 'all') {
      if (colors) dst.skin = src.skin;
      dst.body = Object.assign(dst.body, clone(src.body));
      dst.anim = clone(src.anim); dst.hide = clone(src.hide);
      dst.pet = Object.assign(dst.pet, { x: src.pet.x, y: src.pet.y, s: src.pet.s });
    }
  }

  /* ---------- Exportar / importar ---------- */
  const toCode = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  const fromCode = t => { t = String(t).trim(); return JSON.parse(t.startsWith('{') ? t : decodeURIComponent(escape(atob(t)))); };
  function exportChar(ch) { return 'AE1:' + toCode(ch); }
  /* Código de exportação do Gacha Club: 10 textos | números | cores hex.
     O formato não é documentado; importamos nome, perfil e cores e aproximamos o visual. */
  function isGachaCode(code) { const f = String(code).trim().split('|'); return f.length > 60 && f.some(x => /^[0-9a-f]{6}$/i.test(x) && /[a-f]/i.test(x)); }
  function importGacha(code, base = 'girl') {
    const f = String(code).trim().split('|');
    const hi = f.findIndex((x, i) => i >= 10 && /^[0-9a-f]{6}$/i.test(x));
    if (hi < 0) throw new Error('Código do Gacha Club inválido');
    const col = f.slice(hi).map(x => '#' + x.toLowerCase());
    const at = (i, d) => /^#[0-9a-f]{6}$/.test(col[i] || '') ? col[i] : d;
    const c = base === 'boy' ? DEFAULT_BOY() : DEFAULT_GIRL();
    c.id = newId();
    c.name = (f[0] || 'Importado').slice(0, 18);
    const keys = ['birthday', 'age', 'bio', 'creator', 'color', 'food', 'place', 'personality', 'job'];
    keys.forEach((k, n) => { if (f[n + 1] != null) c.profile[k] = String(f[n + 1]).slice(0, k === 'bio' ? 160 : 24); });
    c.skin = at(0, c.skin);
    c.parts.nose.c[0] = Color.shade(c.skin, -28);
    const hair = [at(1, '#8a624f'), at(2, at(1, '#8a624f')), at(3, '#3a1f17')];
    HAIR_SLOTS.forEach(s => { c.parts[s].c = hair.slice(); });
    c.parts.blush.c[0] = at(18, c.parts.blush.c[0]);
    c.parts.pupilL.c = [at(19, '#855944'), Color.mix(at(19, '#855944'), '#ffffff', .35), at(21, '#27170f')];
    c.parts.pupilR.c = [at(22, at(19, '#855944')), Color.mix(at(22, at(19, '#855944')), '#ffffff', .35), at(24, '#27170f')];
    c.parts.browL.c[0] = at(25, hair[2]); c.parts.browR.c[0] = at(27, hair[2]);
    // Roupas: trios (principal | contorno | secundária) a partir da posição 36; usamos as cores mais frequentes
    const freq = {};
    for (let i = 35; i + 2 < col.length;) {
      if (Color.luminance(col[i + 1]) < .05 && Color.luminance(col[i]) > .08) { const k = col[i] + '|' + col[i + 2]; freq[k] = (freq[k] || 0) + 1; i += 3; } else i++;
    }
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([k]) => k.split('|'));
    const pick = (n, d) => top[n] || top[0] || d;
    const paint = (slots, [m, s2]) => slots.forEach(s => { if (c.parts[s]) { c.parts[s].c[0] = m; c.parts[s].c[1] = s2; } });
    if (top.length) {
      paint(['shirt', 'logo'], pick(0));
      paint(['jacket', 'sleeveL', 'sleeveR'], pick(1));
      paint(['skirt', 'pantsL', 'pantsR'], pick(2));
      paint(['sockL', 'sockR'], pick(3));
      paint(['shoeL', 'shoeR'], pick(4));
    }
    return c;
  }

  function importChar(code, base) {
    if (isGachaCode(code)) return importGacha(code, base);
    const d = fromCode(String(code).trim().replace(/^AE1:/, ''));
    if (!d || !d.parts) throw new Error('Código de personagem inválido');
    const c = fixChar(d); c.id = newId(); return c;
  }
  function exportAll() { saveNow(); return toCode(S); }
  function importAll(code) {
    const d = fromCode(code);
    if (!d || !d.chars) throw new Error('Backup inválido');
    S = migrate(d); saveNow(); listeners.forEach(f => f(S));
  }
  function reset() { S = fresh(); saveNow(); listeners.forEach(f => f(S)); }

  function addRecent(c) {
    const r = S.recentColors.filter(x => x !== c); r.unshift(c); S.recentColors = r.slice(0, 16); save();
  }

  return {
    load, save, saveNow, reset, get s() { return S; }, on: f => listeners.add(f),
    get cur() { return S.chars[S.cur]; }, fixChar,
    xpNeed, addXp, copyInto, CLOTHES,
    exportChar, importChar, isGachaCode, exportAll, importAll, addRecent,
    backup: i => S.backups[i] || genericDefault(i),
  };
})();
