/* ============ EDITOR DE PERSONAGEM (casca: personagem, abas, desfazer) ============ */

const Editor = (() => {
  let tab = 'presets', sub = null, zoom = 1;
  let undo = [], changed = false, from = 'menu';
  const el = () => $('#scr-editor');
  const TABS = [
    { k: 'presets', n: 'Predefinidos', i: 'person', c: '#1fa3c4' },
    { k: 'body', n: 'Corpo', i: 'body', c: '#2fb35a' },
    { k: 'head', n: 'Cabeça', i: 'hair', c: '#e8a318' },
    { k: 'clothes', n: 'Roupas', i: 'shirt', c: '#f06a23' },
    { k: 'other', n: 'Outros', i: 'cat', c: '#a64fd8' },
    { k: 'profile', n: 'Perfil', i: 'profile', c: '#5b7390' },
  ];
  const ch = () => Store.cur;

  function open(t = 'presets', s = null, origin = 'menu') {
    tab = t; sub = s; undo = []; changed = false; from = origin;
    App.show('editor');
    render();
  }
  function close() {
    if (changed) Store.addXp(10);
    if (from === 'studio') return Studio.open();
    App.show('menu'); Menu.render();
  }

  /* Toda alteração passa por aqui (guarda o desfazer, salva e redesenha) */
  function change(fn, { panel = true } = {}) {
    undo.push(JSON.stringify(ch())); if (undo.length > 40) undo.shift();
    fn(ch());
    changed = true;
    Store.save();
    drawChar();
    if (panel) Panels.render(tab, sub);
  }
  function doUndo() {
    const last = undo.pop();
    if (!last) { Sfx.play('error'); UI.toast('Nada para desfazer'); return; }
    Store.s.chars[Store.s.cur] = JSON.parse(last);
    Store.save(); Sfx.play('close'); drawChar(); Panels.render(tab, sub);
  }

  function drawChar() {
    const c = ch();
    $('#edChar').innerHTML = `<div class="stage-char" style="transform:scale(${zoom})">${Rig.render(c, { cls: 'rig-svg big' })}</div><div class="spot"></div>`;
    $('#edWho').innerHTML = `${Rig.portrait(c)}<b>${esc(c.name)}</b>`;
  }

  function render() {
    el().innerHTML = `<div class="editor">
      <div class="ed-left">
        <div class="scene-bg">${Scenery.svg(Store.s.menuBg)}</div>
        <div class="ed-who-bar"><button class="nav-arrow" data-act="prev" aria-label="Anterior">‹</button><div class="ed-who" id="edWho"></div><button class="nav-arrow" data-act="next" aria-label="Próximo">›</button></div>
        <div class="stage" id="edChar"></div>
        <div class="side-icons">
          <button data-act="zin" title="Aproximar">${ICON.zoomIn}</button>
          <button data-act="zout" title="Afastar">${ICON.zoomOut}</button>
          <button data-act="undo" title="Desfazer">${ICON.undo}</button>
          <button data-act="random" title="Visual aleatório">${ICON.dice}</button>
        </div>
        <div class="ed-foot">
          <button data-act="stand">${ICON.stand}<b>Em pé</b></button>
          <button data-act="png"><b>Salvar<br>.PNG</b></button>
        </div>
      </div>
      <div class="ed-right">
        <div class="ed-tabs">${TABS.map(t => `<button class="${t.k === tab ? 'on' : ''}" data-tab="${t.k}" style="--ac:${t.c}">${ICON[t.i]}<b>${t.n}</b></button>`).join('')}<button class="ed-x" data-act="close" aria-label="Voltar ao menu">✕</button></div>
        <div class="ed-panel" id="edPanel"></div>
      </div>
    </div>`;
    drawChar();
    Panels.render(tab, sub);
    el().querySelector('.ed-left').onclick = onLeft;
    el().querySelector('.ed-tabs').onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.act === 'close') { Sfx.play('close'); return close(); }
      tab = b.dataset.tab; sub = null; Sfx.play('tap');
      $$('.ed-tabs button[data-tab]').forEach(x => x.classList.toggle('on', x === b));
      Panels.render(tab, sub);
    };
  }

  function onLeft(e) {
    const b = e.target.closest('button'); if (!b) return;
    const S = Store.s;
    switch (b.dataset.act) {
      case 'prev': case 'next':
        S.cur = (S.cur + (b.dataset.act === 'next' ? 1 : 9)) % 10; undo = []; Store.save(); Sfx.play('pick'); drawChar(); Panels.render(tab, sub); break;
      case 'zin': zoom = Math.min(2.4, zoom + .2); $('#edChar .stage-char').style.transform = `scale(${zoom})`; break;
      case 'zout': zoom = Math.max(.6, zoom - .2); $('#edChar .stage-char').style.transform = `scale(${zoom})`; break;
      case 'undo': doUndo(); break;
      case 'random': Sfx.play('pick'); change(c => randomize(c)); break;
      case 'stand': Sfx.play('tap'); change(c => { c.body.pose = 0; c.body.rot = 0; c.body.headRot = 0; }); break;
      case 'png': UI.exportPNG(Rig.render(ch(), { viewBox: Rig.VIEW }), 800, 900, ch().name || 'personagem'); Store.addXp(5); break;
      case 'studio': if (changed) Store.addXp(10); changed = false; UI.loading(350).then(() => Studio.open()); break;
    }
  }

  /* Visual aleatório (mantém nome e perfil) */
  function randomize(c) {
    const r = Math.random, pick = n => Math.floor(r() * n);
    const hue = pick(360), pal = l => Color.hsl((hue + pick(120) - 60 + 360) % 360, 55 + pick(40), l);
    const hair = [pal(55), pal(75), Color.hsl(hue, 40, 18)];
    for (const s of HAIR_SLOTS) c.parts[s] = { i: 0, c: hair.slice() };
    c.parts.hairBase.i = 1 + pick(PARTS.hairBase.length - 1);
    c.parts.bangs.i = 1 + pick(PARTS.bangs.length - 1);
    if (r() < .5) c.parts.hairBack.i = 1 + pick(PARTS.hairBack.length - 1);
    if (r() < .3) c.parts.ponytail.i = 1 + pick(PARTS.ponytail.length - 1);
    if (r() < .25) c.parts.ahoge.i = 1 + pick(PARTS.ahoge.length - 1);
    const eye = 1 + pick(8), pupil = 1 + pick(PARTS.pupil.length - 1), iris = [pal(50), pal(78), Color.hsl(hue, 50, 12)];
    for (const X of ['L', 'R']) {
      c.parts['eye' + X] = { i: eye, c: ['#ffffff', '#2b1a2e', OUTLINE] };
      c.parts['pupil' + X] = { i: pupil, c: iris.slice() };
      c.parts['brow' + X].i = 1 + pick(6); c.parts['brow' + X].c[0] = Color.shade(hair[0], -35);
    }
    c.parts.mouth.i = [1, 2, 3, 7, 8, 11][pick(6)];
    c.parts.blush.i = pick(3);
    c.skin = SKIN_TONES[pick(8)];
    c.parts.nose.c[0] = Color.shade(c.skin, -28);
    const cloth = () => [pal(40 + pick(40)), pal(60 + pick(30)), OUTLINE];
    const set = (s, max, chance = 1) => { c.parts[s] = { i: r() < chance ? 1 + pick(max) : 0, c: cloth() }; };
    set('shirt', PARTS.shirt.length - 1);
    const sl = { i: pick(PARTS.sleeve.length), c: c.parts.shirt.c.slice() }; c.parts.sleeveL = clone(sl); c.parts.sleeveR = clone(sl);
    set('jacket', PARTS.jacket.length - 1, .3);
    set('skirt', PARTS.skirt.length - 1, .5);
    const pa = { i: c.parts.skirt.i && r() < .7 ? 0 : 1 + pick(PARTS.pants.length - 1), c: cloth() }; c.parts.pantsL = clone(pa); c.parts.pantsR = clone(pa);
    const so = { i: pick(PARTS.sock.length), c: cloth() }; c.parts.sockL = clone(so); c.parts.sockR = clone(so);
    const sh = { i: 1 + pick(PARTS.shoe.length - 1), c: cloth() }; c.parts.shoeL = clone(sh); c.parts.shoeR = clone(sh);
    set('hat', PARTS.hat.length - 1, .3);
    set('neck', PARTS.neck.length - 1, .3);
    set('wings', PARTS.wings.length - 1, .12);
    set('tail', PARTS.tail.length - 1, .12);
    c.parts.gloveL.i = c.parts.gloveR.i = 0;
    c.parts.effBack.i = c.parts.effFront.i = 0;
    c.adj = {};
  }

  return { open, close, change, drawChar, get tab() { return tab; }, set sub(v) { sub = v; }, get sub() { return sub; }, ch };
})();
