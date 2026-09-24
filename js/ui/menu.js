/* ============ ÍCONES (SVG, traço branco) ============ */
const ICON = (() => {
  const s = (d, extra = '') => `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</g></svg>`;
  return {
    person: s('<circle cx="12" cy="5.5" r="3"/><path d="M8 21v-6l-1.5-4.5h11L16 15v6M10 21v-5M14 21v-5"/>'),
    body: s('<path d="M8 3l-4 3 1.5 13h4.5V9M16 3l4 3-1.5 13H14V9M8 3c1 2 2.5 3 4 3s3-1 4-3"/>'),
    hair: s('<path d="M4 16c-1-7 3-12 8-12s9 5 8 12M4 16c2-1 3-4 3-6 2 2 5 2 7-1 1 2 2 3 4 3M8 20c-2-1-4-2-4-4M16 20c2-1 4-2 4-4"/>'),
    shirt: s('<path d="M8 3L3 6l2 5 2-1v11h10V10l2 1 2-5-5-3c-.5 2-2 3-4 3s-3.5-1-4-3z"/>'),
    sword: s('<path d="M14.5 3H21v6.5L10 20.5l-3-3zM7 17.5l-3 3M5 14l5 5"/>'),
    chat: s('<path d="M4 5h16v11H9l-5 4z"/><circle cx="9" cy="10.5" r=".6" fill="currentColor"/><circle cx="12" cy="10.5" r=".6" fill="currentColor"/><circle cx="15" cy="10.5" r=".6" fill="currentColor"/>'),
    cat: s('<path d="M5 20c-2-2-2-6 0-9l-1-7 5 3h6l5-3-1 7c2 3 2 7 0 9z"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M11 16.5c.6.6 1.4.6 2 0"/>'),
    car: s('<path d="M3 16v-4l2-5h14l2 5v4zM5 12h14"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>'),
    profile: s('<path d="M7 3l1.5 3.2 3.4.4-2.5 2.3.7 3.4L7 10.6l-3.1 1.7.7-3.4L2.1 6.6l3.4-.4z"/><path d="M14 7h7M14 11h7M3 16h18M3 20h12"/>'),
    home: s('<path d="M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5"/>'),
    camera: s('<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/>'),
    star: s('<circle cx="12" cy="12" r="9"/><path d="M12 6.5l1.6 3.4 3.7.5-2.7 2.6.7 3.7L12 14.9l-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z"/>'),
    orb: s('<circle cx="12" cy="12" r="8"/><path d="M4 12c3 3 13 3 16 0M7 7c2 1 8 1 10 0"/>'),
    swords: s('<path d="M4 4l8 8M4 4h4M4 4v4M20 4l-12 12M20 4h-4M20 4v4M6 18l-2 2M5 15l4 4M18 18l2 2M19 15l-4 4"/>'),
    game: s('<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11.5" r=".8" fill="currentColor"/><circle cx="18" cy="13.5" r=".8" fill="currentColor"/>'),
    gear: s('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'),
    userPlus: s('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M18 8v6M15 11h6"/>'),
    image: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/>'),
    eye: s('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    zoomIn: s('<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M8 11h6M11 8v6"/>'),
    zoomOut: s('<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M8 11h6"/>'),
    undo: s('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>'),
    dice: s('<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="16" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/>'),
    stand: s('<circle cx="12" cy="4.5" r="2.5"/><path d="M12 8v7M8 11h8M12 15l-3 6M12 15l3 6"/>'),
    lock: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
    link: s('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
  };
})();

/* ============ MENU PRINCIPAL ============ */
const Menu = (() => {
  let zoom = 1, hideUI = false;
  const el = () => $('#scr-menu');
  const APPS = [
    { k: 'presets', n: 'Predefinidos', i: 'person', c: '#1fa3c4' },
    { k: 'body', n: 'Corpo', i: 'body', c: '#2fb35a' },
    { k: 'head', n: 'Cabeça', i: 'hair', c: '#e8a318' },
    { k: 'clothes', n: 'Roupas', i: 'shirt', c: '#f06a23' },
    { k: 'other:props', n: 'Itens', i: 'sword', c: '#e0364a' },
    { k: 'other:chat', n: 'Chat', i: 'chat', c: '#a64fd8' },
    { k: 'other:pet', n: 'Mascote', i: 'cat', c: '#2f6fe0' },
    { k: 'objects', n: 'Objetos', i: 'car', c: '#1cb89a' },
    { k: 'profile', n: 'Perfil', i: 'profile', c: '#5b7390' },
  ];
  const NAV = [
    { k: 'menu', n: 'Menu Principal', i: 'home' }, { k: 'studio', n: 'Estúdio', i: 'camera' },
    { k: 'units', n: 'Unidades', i: 'star', off: 1 }, { k: 'gacha', n: 'Gacha', i: 'orb', off: 1 },
    { k: 'battle', n: 'Batalha', i: 'swords', off: 1 }, { k: 'mini', n: 'Minigames', i: 'game', off: 1 },
    { k: 'options', n: 'Opções', i: 'gear' },
  ];

  function stageHTML() {
    return `<div class="stage-char" style="transform:scale(${zoom})">${Rig.render(Store.cur, { cls: 'rig-svg big' })}</div>`;
  }
  function cardHTML() {
    const S = Store.s, ch = Store.cur, P = S.player;
    return `<div class="pc-portrait">${Rig.portrait(ch)}</div>
      <div class="pc-main"><div class="pc-title" style="--tc:${CLUBS[ch.profile.club || 0].c}">${esc(TITLES[ch.profile.title] || TITLES[0])}</div><div class="pc-name">${esc(ch.name)}</div></div>
      <div class="pc-lv"><small>XP: ${P.xp}</small><div class="xpbar"><i style="width:${P.xp / Store.xpNeed(P.level) * 100}%"></i></div><b>Nv.${P.level}</b></div>
      <div class="pc-cur"><span><i>💎</i>${fmt(P.gems)}</span><span><i class="gold">G</i>${fmt(P.gold)}</span></div>`;
  }

  function render() {
    const S = Store.s;
    el().innerHTML = `<div class="menu${hideUI ? ' ui-hidden' : ''}">
      <div class="scene-bg" id="menuBg">${Scenery.svg(S.menuBg)}</div>
      <header class="pcard ui" id="pcard">${cardHTML()}</header>
      <aside class="roster ui" id="roster">${S.chars.map((c, i) => `<button class="ro${i === S.cur ? ' on' : ''}" data-ci="${i}">${Rig.portrait(c)}<small>${esc(c.name)}</small></button>`).join('')}</aside>
      <div class="stage" id="menuStage">${stageHTML()}<div class="spot"></div></div>
      <div class="side-icons ui">
        <button data-act="swap" title="Trocar personagens">${ICON.userPlus}</button>
        <button data-act="bg" title="Fundos">${ICON.image}</button>
        <button data-act="hide" title="Esconder interface">${ICON.eye}</button>
        <button data-act="zin" title="Aproximar">${ICON.zoomIn}</button>
        <button data-act="zout" title="Afastar">${ICON.zoomOut}</button>
      </div>
      <div class="tablet ui">
        <div class="tb-frame">
          <div class="tb-head"><span>✚ Tablet do Ateliê</span><span class="tb-status"><small class="tb-ver">OS ${APP_VERSION}</small>📶 <i class="batt"><b></b></i></span></div>
          <div class="tb-apps">${APPS.map(a => `<button class="app" data-app="${a.k}"><span class="ai" style="--ac:${a.c}">${ICON[a.i]}</span><b>${a.n}</b></button>`).join('')}</div>
        </div>
      </div>
      <nav class="bnav ui">${NAV.map(n => `<button class="${n.k === 'menu' ? 'on' : ''}${n.off ? ' off' : ''}" data-nav="${n.k}">${ICON[n.i]}<b>${n.n}</b></button>`).join('')}</nav>
      ${hideUI ? `<button class="unhide" data-act="hide" title="Mostrar interface">${ICON.eye}</button>` : ''}
    </div>`;
    el().onclick = onClick;
  }

  /* Atualiza só o que depende do personagem atual */
  function refresh() {
    if (!$('#menuStage')) return render();
    $('#menuStage').innerHTML = stageHTML() + '<div class="spot"></div>';
    $('#pcard').innerHTML = cardHTML();
    $$('#roster .ro').forEach((b, i) => b.classList.toggle('on', i === Store.s.cur));
  }

  function onClick(e) {
    const b = e.target.closest('button'); if (!b) return;
    const S = Store.s;
    if (b.dataset.ci != null) { S.cur = +b.dataset.ci; Store.save(); Sfx.play('pick'); refresh(); return; }
    if (b.dataset.app) {
      Sfx.play('open');
      const [tab, sub] = b.dataset.app.split(':');
      if (tab === 'objects') { UI.loading(350).then(() => Studio.open('objects')); return; }
      Editor.open(tab, sub); return;
    }
    if (b.dataset.nav) {
      const n = NAV.find(x => x.k === b.dataset.nav);
      if (n.k === 'options') return Modals.options();
      if (n.k === 'studio') { Sfx.play('tap'); UI.loading(350).then(() => Studio.open()); return; }
      if (n.off) { Sfx.play('error'); UI.toast(`🔒 ${n.n}: em breve`); }
      return;
    }
    switch (b.dataset.act) {
      case 'swap': Modals.swap(); break;
      case 'bg': Modals.backgrounds(S.menuBg, () => { $('#menuBg').innerHTML = Scenery.svg(S.menuBg); Store.save(); }); break;
      case 'hide': hideUI = !hideUI; Sfx.play('tap'); render(); break;
      case 'zin': zoom = Math.min(2.2, zoom + .2); $('.stage-char').style.transform = `scale(${zoom})`; break;
      case 'zout': zoom = Math.max(.6, zoom - .2); $('.stage-char').style.transform = `scale(${zoom})`; break;
    }
  }

  return { render, refresh };
})();
