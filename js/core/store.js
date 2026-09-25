/* ============ ESTADO E PERSISTÊNCIA ============ */

const SAVE_KEY = 'atelieEstelar.clube.v2';
const SAVE_VERSION = 5;
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
      petSlots: Array.from({ length: PET_SLOTS }, () => blankPet()),
      objSlots: Array.from({ length: OBJ_SLOTS }, (_, i) => blankObj(i + 1)),
    };
  }
  /* ---------- 20 mascotes e 30 objetos personalizáveis (como no Gacha Club) ----------
     Mascote: { i, c: [principal, secundária, contorno], tint, tc, back, shadow 0-10, x, y, sx, sy, r, ol, name, chat }
     Objeto: { i, c, tint, tc, dy (profundidade), shadow 0-10, ol } */
  function blankPet(i = 0) { return { i, c: petColorsFor(i), tint: 0, tc: '#ff4f86', back: 0, shadow: 6, x: 0, y: 0, sx: 1, sy: 1, r: 0, ol: 1, name: i && PARTS.pet[i] ? PARTS.pet[i].n : 'Bichinho', chat: '' }; }
  function blankObj(i = 0) { return { i: PARTS.object[i] ? i : 0, c: objColorsFor(i), tint: 0, tc: '#ff4f86', dy: 0, shadow: 6, ol: 1 }; }
  /* guarda o mascote antigo de um personagem (parts.pet + pet) num espaço livre e liga o personagem a ele */
  function adoptPet(c, slots) {
    if (!c.parts.pet || !c.parts.pet.i || c.petSlot >= 0) { if (c.parts.pet) c.parts.pet.i = 0; return; }
    let k = slots.findIndex(p => !p.i && !p.used); if (k < 0) k = slots.findIndex(p => !p.used); if (k < 0) return;
    const P = c.pet || {};
    slots[k] = Object.assign(blankPet(c.parts.pet.i), { c: c.parts.pet.c.slice(0, 3), x: P.x || 0, y: P.y || 0, sx: P.s || 1, sy: P.s || 1, name: P.name && P.name !== 'Bichinho' ? P.name : PARTS.pet[c.parts.pet.i].n, used: 1 });
    c.petSlot = k; c.parts.pet.i = 0;
  }
  /* completa os espaços: os livres ganham um mascote diferente cada */
  function fillPets(d) {
    d.petSlots = Array.from({ length: PET_SLOTS }, (_, i) => Object.assign(blankPet(), (d.petSlots || [])[i] || {}));
    d.chars.forEach(c => adoptPet(c, d.petSlots));
    const used = new Set(d.petSlots.map(p => p.i)); let n = 1;
    d.petSlots.forEach(p => { delete p.used; if (!p.i) { while (used.has(n) && n < PARTS.pet.length - 1) n++; Object.assign(p, blankPet(n)); used.add(n); } });
    d.objSlots = Array.from({ length: OBJ_SLOTS }, (_, i) => Object.assign(blankObj(i + 1), (d.objSlots || [])[i] || {}));
  }

  /* Completa campos que faltam em personagens antigos/importados */
  function fixChar(ch) {
    const b = baseChar();
    const c = Object.assign(b, ch);
    c.parts = Object.assign(blankParts(), ch.parts || {});
    /* asa direita virou peça separada: saves antigos continuam com as duas asas */
    if (ch.parts && ch.parts.wings && !ch.parts.wingsR) c.parts.wingsR = clone(ch.parts.wings);
    for (const [k, p] of Object.entries(c.parts)) {
      if (!SLOT_DEFS[k]) { delete c.parts[k]; continue; }
      if (!Array.isArray(p.c) || p.c.length < 3) p.c = ['#ffffff', '#b8c0cf', OUTLINE];
      const max = (PARTS[SLOT_DEFS[k].t] || []).length - 1;
      if (!(p.i >= 0 && p.i <= max)) p.i = 0;
    }
    for (const k of ['body', 'hide', 'anim', 'pet', 'chat', 'profile', 'face', 'hairFx']) c[k] = Object.assign(baseChar()[k], ch[k] || {});
    if (!(c.body.pose >= 0 && c.body.pose < POSES.length)) c.body.pose = 0;
    /* animações viraram níveis de 0 a 10 (antes 1 = ligada) */
    if (!(ch.anim && ch.anim.v >= 2)) { const a = ch.anim || {}; for (const k of ['blink', 'hair', 'wings', 'cape', 'tail', 'effects']) c.anim[k] = a[k] === 0 ? 0 : 5; c.anim.hairB = c.anim.hair; c.anim.v = 2; }
    c.adj = ch.adj || {};
    if (!(c.petSlot >= 0 && c.petSlot < PET_SLOTS)) c.petSlot = -1;
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
    d.studio.pets = (d.studio.pets || []).filter(e => e.ps >= 0 || PARTS.pet[e.pi]);
    d.studio.objs = (d.studio.objs || []).filter(e => e.os >= 0 || PARTS.object[e.oi]);
    d.scenes = Array.from({ length: 15 }, (_, i) => (d.scenes || [])[i] || null);
    fillPets(d);
    d.v = SAVE_VERSION;
    return d;
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      S = raw ? migrate(JSON.parse(raw)) : fresh();
      if (!raw) fillPets(S);
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
  const CLOTHES = ['hat', 'glasses', 'headAcc', 'headAcc2', 'headAcc3', 'headAcc4', 'faceAcc', 'faceAcc2', 'faceAcc3', 'neck', 'neck2', 'logo', 'shirt', 'jacket', 'skirt', 'skirt2', 'sleeveL', 'sleeveR', 'pantsL', 'pantsR', 'sockL', 'sockR', 'shoeL', 'shoeR', 'gloveL', 'gloveR', 'shoulderL', 'shoulderR', 'wristL', 'wristR', 'kneeL', 'kneeR', 'cape', 'tail', 'wings', 'wingsR', 'propL', 'propR', 'shield', 'effBack', 'effFront'];
  function copyInto(dst, src, mode = 'all', colors = true) {
    if (mode !== 'clothes' && colors) dst.hairFx = clone(src.hairFx);
    const slots = mode === 'hair' ? HAIR_SLOTS : mode === 'clothes' ? CLOTHES : Object.keys(SLOT_DEFS).filter(k => k !== 'pet');
    for (const s of slots) {
      const p = src.parts[s]; if (!p) continue;
      dst.parts[s] = colors ? clone(p) : { i: p.i, c: dst.parts[s].c.slice() };
      if (src.adj[s]) dst.adj[s] = clone(src.adj[s]); else delete dst.adj[s];
    }
    if (mode === 'all') {
      if (colors) dst.skin = src.skin;
      dst.body = Object.assign(dst.body, clone(src.body));
      dst.anim = clone(src.anim); dst.hide = clone(src.hide); dst.face = clone(src.face);
      dst.pet = Object.assign(dst.pet, { x: src.pet.x, y: src.pet.y, s: src.pet.s });
    }
  }

  /* ---------- Exportar / importar ---------- */
  const toCode = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  const fromCode = t => { t = String(t).trim(); return JSON.parse(t.startsWith('{') ? t : decodeURIComponent(escape(atob(t)))); };
  function exportChar(ch) { const o = clone(ch); if (ch.petSlot >= 0) o._pet = clone(S.petSlots[ch.petSlot]); delete o.petSlot; return 'AE1:' + toCode(o); }
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
    const c = fixChar(d); c.id = newId();
    if (d._pet && d._pet.i) { delete c._pet; c.petSlot = -1; c.parts.pet = { i: d._pet.i, c: (d._pet.c || []).slice(0, 3), _full: d._pet }; }
    if (c.parts.pet.i) { const full = c.parts.pet._full; delete c.parts.pet._full; adoptPet(c, S.petSlots); if (full && c.petSlot >= 0) Object.assign(S.petSlots[c.petSlot], full); }
    return c;
  }
  function exportAll() { saveNow(); return toCode(S); }
  function importAll(code) {
    const d = fromCode(code);
    if (!d || !d.chars) throw new Error('Backup inválido');
    S = migrate(d); saveNow(); listeners.forEach(f => f(S));
  }
  function reset() { S = fresh(); fillPets(S); saveNow(); listeners.forEach(f => f(S)); }

  function addRecent(c) {
    const r = S.recentColors.filter(x => x !== c); r.unshift(c); S.recentColors = r.slice(0, 16); save();
  }

  return {
    load, save, saveNow, reset, get s() { return S; }, on: f => listeners.add(f),
    get cur() { return S.chars[S.cur]; }, fixChar, blankPet, blankObj, adoptPet,
    xpNeed, addXp, copyInto, CLOTHES,
    exportChar, importChar, isGachaCode, exportAll, importAll, addRecent,
    backup: i => S.backups[i] || genericDefault(i),
  };
})();
