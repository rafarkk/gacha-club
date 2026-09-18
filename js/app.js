/* ============ INICIALIZAÇÃO ============ */

const App = {
  screen: 'menu',
  show(name) {
    App.screen = name;
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === 'scr-' + name));
  },
  applyQuality() { document.body.classList.toggle('low-quality', !Store.s.settings.quality); },
};

(function init() {
  Store.load();
  App.applyQuality();
  Menu.render();
  if (!Store.s.tutorialSeen) setTimeout(() => Modals.tutorial(0), 400);

  /* Teclado (desktop) */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) return;
    const modals = $$('.modal-wrap');
    if (e.key === 'Escape') {
      if (modals.length) { const x = $('[data-close]', modals[modals.length - 1]); if (x) x.click(); return; }
      if (App.screen === 'editor') Editor.close();
      if (App.screen === 'studio' && Studio.view) Studio.view = false;
      return;
    }
    if (modals.length) return;
    if (App.screen === 'editor' && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); $('[data-act="undo"]').click(); }
    if (App.screen === 'studio' && Studio.key(e)) e.preventDefault();
  });


  /* PWA offline */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
