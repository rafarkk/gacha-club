/* ============ LÓGICA DE INVOCAÇÃO ============ */

const Gacha = (() => {
  const R = GACHA_RULES;

  function featuredTheme(d = new Date()) {
    return THEME_KEYS[Math.floor(Store.dayNumber(d) / 2) % THEME_KEYS.length];
  }
  function featuredEndsAt() {
    const n = Store.dayNumber();
    const days = (Math.floor(n / 2) + 1) * 2 - n;
    const t = new Date(); t.setHours(0, 0, 0, 0); t.setDate(t.getDate() + days);
    return t.getTime();
  }
  function bannerName(b) { return b.featured ? `${THEMES[featuredTheme()].icon} ${THEMES[featuredTheme()].name}` : b.name; }

  function pool(b) {
    return ITEM_LIST.filter(i => b.kind === 'all' || i.kind === b.kind);
  }
  function pity(bid) {
    const S = Store.s;
    if (!S.pity[bid]) S.pity[bid] = { l: 0, e: 0, g: false };
    return S.pity[bid];
  }

  function rollRarity(p) {
    const n = p.l + 1;
    let lr = RARITIES[3].weight + RARITIES[4].weight;
    if (n > R.softPity) lr += (n - R.softPity) * R.softStep;
    if (n >= R.hardPity) lr = 100;
    if (Math.random() * 100 < lr) return Math.random() < R.mythicShare ? 4 : 3;
    if (p.e + 1 >= R.epicEvery) return 2;
    const w = [RARITIES[0].weight, RARITIES[1].weight, RARITIES[2].weight];
    let x = Math.random() * (w[0] + w[1] + w[2]);
    for (let i = 0; i < 3; i++) { if (x < w[i]) return i; x -= w[i]; }
    return 0;
  }
  function bumpPity(p, r) {
    if (r >= 3) { p.l = 0; p.e = 0; }
    else if (r === 2) { p.l++; p.e = 0; }
    else { p.l++; p.e++; }
  }

  const pickFrom = arr => arr[Math.floor(Math.random() * arr.length)];

  function pickItem(b, rarity, p) {
    const all = pool(b);
    let r = rarity, cand = [];
    while (r >= 0 && !(cand = all.filter(i => i.rarity === r)).length) r--;
    const res = { rarity: r, featured: false };

    if (b.featured && (r === 2 || r === 3)) {
      const ft = featuredTheme();
      const fp = cand.filter(i => i.theme === ft), other = cand.filter(i => i.theme !== ft);
      if (fp.length) {
        if (r === 3) {
          if (p.g || Math.random() < R.featuredShare || !other.length) { p.g = false; res.item = pickFrom(fp); res.featured = true; }
          else { p.g = true; res.item = pickFrom(other); res.lost5050 = true; }
        } else if (Math.random() < R.featuredShare) { res.item = pickFrom(fp); res.featured = true; }
      }
    }
    if (!res.item && b.wish && Store.s.wish) {
      const w = ITEMS[Store.s.wish];
      if (w && w.rarity === r && Math.random() < R.wishShare) { res.item = w; res.wished = true; }
    }
    if (!res.item) res.item = pickFrom(cand);
    return res;
  }

  function grant(item) {
    const S = Store.s;
    const before = S.inv[item.id] || 0;
    const out = { isNew: before === 0, stars: before, dust: 0 };
    if (before === 0) S.inv[item.id] = 1;
    else if (before < R.maxStars) { S.inv[item.id] = before + 1; out.dust = Math.round(RARITIES[item.rarity].dust / 5); }
    else out.dust = RARITIES[item.rarity].dust;
    out.stars = S.inv[item.id];
    S.dust += out.dust;
    return out;
  }

  function costFor(bid, n) {
    const S = Store.s;
    if (n === 1 && bid === 'std' && S.freePullDay !== Store.dayKey()) return { free: true, tickets: 0, gems: 0 };
    const t = Math.min(S.tickets, n);
    return { free: false, tickets: t, gems: (n - t) * R.costGems };
  }
  const freeAvailable = () => Store.s.freePullDay !== Store.dayKey();

  function pull(bid, n) {
    const S = Store.s;
    const b = BANNERS.find(x => x.id === bid);
    const cost = costFor(bid, n);
    if (!cost.free && (S.gems < cost.gems || S.tickets < cost.tickets)) return { error: 'Gemas insuficientes' };
    if (cost.free) S.freePullDay = Store.dayKey();
    else { S.tickets -= cost.tickets; S.gems -= cost.gems; }

    const p = pity(bid);
    const results = [];
    const beginner = n === 10 && !S.firstTen;
    for (let i = 0; i < n; i++) {
      let r = rollRarity(p);
      if (beginner && i === n - 1 && !results.some(x => x.rarity >= 3)) r = 3;
      bumpPity(p, r);
      const pick = pickItem(b, r, p);
      const g = grant(pick.item);
      results.push(Object.assign({ item: pick.item }, pick, g));
      S.history.unshift({ id: pick.item.id, b: bid, t: Date.now() });
      if (pick.rarity >= 3) S.stats.legendaries++;
    }
    if (beginner) S.firstTen = true;
    S.history.length = Math.min(S.history.length, 120);
    S.stats.pulls += n;
    Store.progress('pull', n);
    Store.save();
    Store.addXp(n * 6);
    return { results, beginner };
  }

  function craft(id) {
    const it = ITEMS[id]; const S = Store.s;
    const cost = RARITIES[it.rarity].craft;
    if (!cost) return { error: 'Itens Míticos não podem ser criados' };
    if ((S.inv[id] || 0) >= R.maxStars) return { error: 'Já está no máximo ★5' };
    if (S.dust < cost) return { error: 'Poeira estelar insuficiente' };
    S.dust -= cost; S.inv[id] = (S.inv[id] || 0) + 1;
    Store.progress('craft'); Store.save();
    return { ok: true, stars: S.inv[id] };
  }

  function buy(shopId) {
    const S = Store.s; const it = SHOP.find(x => x.id === shopId);
    Store.ensureDaily();
    const used = S.daily.shop[shopId] || 0;
    if (used >= it.limit) return { error: 'Limite diário atingido' };
    if (!Store.pay(it.cost)) return { error: 'Saldo insuficiente' };
    S.daily.shop[shopId] = used + 1; Store.give(it.give); Store.progress('craft');
    return { ok: true };
  }

  function rates(b) {
    const p = pool(b);
    return RARITIES.map(r => ({ r, pct: r.weight / RARITIES.reduce((a, x) => a + x.weight, 0) * 100, count: p.filter(i => i.rarity === r.id).length }));
  }

  return { pull, costFor, freeAvailable, pity, featuredTheme, featuredEndsAt, bannerName, pool, craft, buy, rates };
})();
