/* ============ NÚCLEO: utilitários, cores, som e componentes de interface ============ */

/* Versão do app (aparece no tablet do menu). Mantenha igual ao CACHE de sw.js. */
const APP_VERSION = 'v43';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.floor(n).toLocaleString('pt-BR');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clone = o => JSON.parse(JSON.stringify(o));
let _uidN = 0;
const uid = () => 'u' + (++_uidN).toString(36) + Math.random().toString(36).slice(2, 5);
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function rng(seed) {
  let s = typeof seed === 'string' ? [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7) : seed | 0;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Cores ---------- */
const Color = {
  hexToRgb(hex) {
    let h = String(hex || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  },
  rgbToHex(r, g, b) { return '#' + ((1 << 24) | (clamp(Math.round(r), 0, 255) << 16) | (clamp(Math.round(g), 0, 255) << 8) | clamp(Math.round(b), 0, 255)).toString(16).slice(1); },
  /* pct < 0 escurece, > 0 clareia */
  shade(hex, pct) {
    const [r, g, b] = Color.hexToRgb(hex), f = pct / 100;
    const adj = v => f < 0 ? v * (1 + f) : v + (255 - v) * f;
    return Color.rgbToHex(adj(r), adj(g), adj(b));
  },
  mix(a, b, t) {
    const A = Color.hexToRgb(a), B = Color.hexToRgb(b);
    return Color.rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  },
  hsl(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Color.rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
  },
  luminance(hex) { const [r, g, b] = Color.hexToRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; },
};

/* ---------- Formas reutilizáveis ---------- */
const Shape = {
  star(cx, cy, r1, r2, n = 5, rot = -90) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? r2 : r1, a = (rot + i * 180 / n) * Math.PI / 180;
      d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  },
  heart(cx, cy, s) {
    return `M${cx} ${cy + s * 0.9}C${cx - s * 1.6} ${cy - s * 0.2} ${cx - s * 0.6} ${cy - s * 1.3} ${cx} ${cy - s * 0.4}C${cx + s * 0.6} ${cy - s * 1.3} ${cx + s * 1.6} ${cy - s * 0.2} ${cx} ${cy + s * 0.9}Z`;
  },
};

/* ---------- Som sintetizado ---------- */
const Sfx = (() => {
  let ctx = null;
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; };
  function tone(f, dur = .1, type = 'sine', vol = .12, when = 0, slide = 0) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .02);
  }
  const P = {
    tap: () => tone(700, .05, 'triangle', .06),
    pick: () => { tone(520, .06, 'triangle', .08); tone(780, .08, 'triangle', .08, .04); },
    open: () => tone(420, .09, 'sine', .08, 0, 260),
    close: () => tone(520, .08, 'sine', .07, 0, -220),
    error: () => tone(180, .16, 'square', .05, 0, -60),
    save: () => [523, 659, 784].forEach((f, i) => tone(f, .14, 'triangle', .09, i * .07)),
  };
  return { play(n) { if (typeof Store !== 'undefined' && Store.s && !Store.s.settings.sound) return; try { P[n] && P[n](); } catch (e) { } } };
})();

/* ---------- Componentes de interface ---------- */
const UI = {
  toast(msg, ms = 2200) {
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = msg;
    $('#toasts').appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
  },

  /* Janela modal genérica. buttons: [{label, cls, onClick(root) -> false mantém aberta}] */
  modal({ title = '', body = '', buttons = [], cls = '', onOpen, dismissable = true, onClose } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">
      ${title || dismissable ? `<div class="modal-head"><h2>${title}</h2>${dismissable ? '<button class="xbtn" data-close aria-label="Fechar">✕</button>' : ''}</div>` : ''}
      <div class="modal-body">${body}</div>
      ${buttons.length ? `<div class="modal-btns">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-b="${i}">${b.label}</button>`).join('')}</div>` : ''}
    </div>`;
    $('#modal-root').appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    let closed = false;
    const close = () => { if (closed) return; closed = true; wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 180); onClose && onClose(); };
    wrap.addEventListener('click', e => {
      if (dismissable && (e.target === wrap || e.target.closest('[data-close]'))) { Sfx.play('close'); return close(); }
      const bi = e.target.closest('[data-b]');
      if (bi && bi.closest('.modal-btns')) { const b = buttons[+bi.dataset.b]; Sfx.play('tap'); const r = b.onClick ? b.onClick(wrap) : undefined; if (r !== false) close(); }
    });
    wrap._close = close;
    if (onOpen) onOpen(wrap, close);
    Sfx.play('open');
    return { el: wrap, close };
  },
  confirm(msg, ok = 'Confirmar', cls = 'primary') {
    return new Promise(res => UI.modal({ title: 'Confirmar', body: `<p>${msg}</p>`, dismissable: false, buttons: [{ label: 'Cancelar', onClick: () => res(false) }, { label: ok, cls, onClick: () => res(true) }] }));
  },
  /* Caixa de texto no estilo do jogo (barra no topo com ✗ e ✓) */
  prompt(value = '', { max = 40, multiline = false, placeholder = '' } = {}) {
    return new Promise(res => {
      const w = document.createElement('div');
      w.className = 'text-entry';
      w.innerHTML = `<div class="te-bar"><button class="te-no" aria-label="Cancelar">✗</button>
        ${multiline ? `<textarea maxlength="${max}" rows="3" placeholder="${esc(placeholder)}">${esc(value)}</textarea>` : `<input maxlength="${max}" value="${esc(value)}" placeholder="${esc(placeholder)}"/>`}
        <button class="te-ok" aria-label="Confirmar">✓</button></div>`;
      document.body.appendChild(w);
      const inp = w.querySelector('input,textarea');
      setTimeout(() => { inp.focus(); inp.select && inp.select(); }, 30);
      const done = v => { w.remove(); res(v); };
      w.querySelector('.te-no').onclick = () => done(null);
      w.querySelector('.te-ok').onclick = () => done(inp.value);
      w.addEventListener('click', e => { if (e.target === w) done(null); });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !multiline) done(inp.value); if (e.key === 'Escape') done(null); });
    });
  },

  /* Exporta um SVG como PNG (compartilha no celular, baixa no desktop) */
  async exportPNG(svgStr, w, h, name, bg) {
    try {
      const svg = svgStr.replace(/<svg([^>]*?)class="[^"]*"/, `<svg$1width="${w}" height="${h}"`).replace(/<svg(?![^>]*width=)/, `<svg width="${w}" height="${h}"`);
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      await new Promise((ok, err) => { img.onload = ok; img.onerror = err; img.src = url; });
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d');
      if (bg) { cx.fillStyle = bg; cx.fillRect(0, 0, w, h); }
      cx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
      const file = new File([blob], name + '.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
        try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; }
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.png';
      document.body.appendChild(a); a.click(); a.remove();
      UI.toast('📸 Imagem salva!');
    } catch (e) { console.error(e); UI.toast('Não foi possível gerar a imagem'); }
  },

  /* Tela de carregamento curta entre modos (como no vídeo) */
  loading(ms = 450) {
    return new Promise(res => {
      const l = document.createElement('div');
      l.className = 'loading-screen';
      l.innerHTML = `<div class="ld-logo"><img src="icon.svg" alt=""/><b>Ateliê Estelar</b></div><p>Carregando...</p>`;
      document.body.appendChild(l);
      requestAnimationFrame(() => l.classList.add('show'));
      setTimeout(() => { res(); l.classList.remove('show'); setTimeout(() => l.remove(), 250); }, ms);
    });
  },
};
