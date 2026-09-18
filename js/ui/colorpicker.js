/* ============ SELETOR DE COR ============
   Renderiza dentro de um container (substitui o painel, como no jogo de referência).
   opts: { title, targets: [{ label, get(), set(c) }], active, onClose } */

const ColorPicker = (() => {
  const HUES = Array.from({ length: 18 }, (_, i) => i * 20);
  const LIGHT = [92, 82, 72, 62, 52, 42, 32, 22];
  const GRAYS = Array.from({ length: 12 }, (_, i) => Color.hsl(0, 0, 100 - i * 9));
  const SKINS = ['#fff0e6', '#fde0cc', '#f6c9a3', '#e8b48a', '#d19a6e', '#b07a4f', '#8a5634', '#5b3522'];

  function open(box, opts) {
    let active = opts.active || 0;
    const draw = () => {
      const t = opts.targets;
      box.innerHTML = `<div class="cp">
        <div class="cp-head">
          <b>${esc(opts.title || 'Mudar cores')}</b>
          <div class="cp-targets">${t.map((x, i) => `<button class="cp-t${i === active ? ' on' : ''}" data-t="${i}"><small>${esc(x.label)}</small><i style="background:${x.get()}"></i></button>`).join('')}</div>
          <button class="xbtn" data-cpclose aria-label="Fechar">✕</button>
        </div>
        <div class="cp-grid" style="--cols:${HUES.length}">${LIGHT.map(l => HUES.map(h => { const c = Color.hsl(h, l > 85 ? 70 : 88, l); return `<button class="cp-c" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`; }).join('')).join('')}</div>
        <div class="cp-row">${GRAYS.concat(SKINS).map(c => `<button class="cp-c" data-c="${c}" style="background:${c}"></button>`).join('')}</div>
        <div class="cp-foot">
          <span>Recentes</span>
          <div class="cp-recent">${(Store.s.recentColors || []).map(c => `<button class="cp-c" data-c="${c}" style="background:${c}"></button>`).join('') || '<i class="muted">—</i>'}</div>
          <label class="cp-custom" title="Cor livre"><input type="color" value="${t[active].get()}" data-native /><span>🎨</span></label>
          <input class="cp-hex" value="${t[active].get()}" maxlength="7" data-hex aria-label="Código da cor" />
        </div>
      </div>`;
    };
    const apply = c => {
      opts.targets[active].set(c); Store.addRecent(c);
      const sw = box.querySelector(`.cp-t[data-t="${active}"] i`); if (sw) sw.style.background = c;
      const hx = box.querySelector('[data-hex]'); if (hx) hx.value = c;
      const nt = box.querySelector('[data-native]'); if (nt) nt.value = c;
      $$('.cp-c.sel', box).forEach(b => b.classList.remove('sel'));
      const b = box.querySelector(`.cp-c[data-c="${c}"]`); if (b) b.classList.add('sel');
    };
    draw();
    box.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.cpclose != null) { Sfx.play('close'); box.onclick = null; box.oninput = box.onchange = null; opts.onClose && opts.onClose(); return; }
      if (b.dataset.t != null) { active = +b.dataset.t; Sfx.play('tap'); draw(); return; }
      if (b.dataset.c) { Sfx.play('pick'); apply(b.dataset.c); }
    };
    box.oninput = e => { if (e.target.dataset.native != null) apply(e.target.value); };
    box.onchange = e => {
      if (e.target.dataset.hex != null) {
        let v = e.target.value.trim(); if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9a-f]{6}$/i.test(v)) apply(v.toLowerCase()); else UI.toast('Use o formato #rrggbb');
      }
    };
  }
  return { open };
})();
