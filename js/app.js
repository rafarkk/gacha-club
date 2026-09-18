/* ============ INICIALIZAÇÃO ============ */

(function () {
  Store.load();

  /* Navegação */
  $('#bottomnav').addEventListener('click', e => {
    const b = e.target.closest('button[data-scr]'); if (!b) return;
    Sfx.play('tap'); UI.go(b.dataset.scr);
  });
  $('#wallet').addEventListener('click', e => {
    const p = e.target.closest('[data-cur]'); if (!p) return;
    const hints = {
      gems: 'Usadas para invocar (100 por invocação). Ganhe no login, missões, desfile, álbum e níveis.',
      tickets: 'Cada bilhete = 1 invocação em qualquer banner. Usados antes das gemas.',
      coins: 'Renda da Exposição e do Desfile. Troque na Loja por bilhetes, gemas e poeira.',
      dust: 'Vem de repetidos. Use no Álbum para criar ou evoluir itens.',
    };
    const k = p.dataset.cur;
    UI.toast(`${CURRENCY[k].icon} <b>${CURRENCY[k].name}</b><br><small>${hints[k]}</small>`, 3200);
  });
  $('#btnProfile').addEventListener('click', profileModal);
  $('#btnDaily').addEventListener('click', loginModal);
  $('#btnSettings').addEventListener('click', settingsModal);

  function loginModal() {
    const S = Store.s, avail = Store.loginAvailable();
    const cur = S.login.count % LOGIN_REWARDS.length;
    const idxShown = avail ? cur : (cur + LOGIN_REWARDS.length - 1) % LOGIN_REWARDS.length;
    UI.modal({
      title: '🎁 Presente Diário',
      body: `<p class="muted small">Entre todo dia para ganhar presentes. Dia ${S.login.count + (avail ? 1 : 0)} da sua jornada!</p>
        <div class="login-grid">${LOGIN_REWARDS.map((r, i) => `<div class="login-day${i < idxShown || (!avail && i === idxShown) ? ' got' : ''}${avail && i === idxShown ? ' today' : ''}${i === 6 ? ' big' : ''}"><small>Dia ${i + 1}</small><div>${Object.entries(r).map(([k, v]) => `<span>${CURRENCY[k].icon}${fmt(v)}</span>`).join('')}</div></div>`).join('')}</div>`,
      buttons: avail ? [{ label: 'Resgatar!', cls: 'gold', onClick: () => { const r = Store.claimLogin(); if (r) setTimeout(() => UI.reward('Presente do dia!', r.rew), 220); } }] : [{ label: 'Volte amanhã ✨' }],
    });
  }

  function profileModal() {
    const S = Store.s, lim = Store.limits();
    const next = Store.xpNeed(S.level);
    UI.modal({
      title: `⭐ Estilista Nível ${S.level}`,
      body: `<div class="bar"><i style="width:${S.xp / next * 100}%"></i></div><p class="muted small center">${fmt(S.xp)} / ${fmt(next)} XP</p>
        <ul class="rules"><li>Personagens salvos: <b>${S.chars.length}/${lim.chars}</b></li><li>Cenários salvos: <b>${S.scenes.length}/${lim.scenes}</b></li><li>Vagas de exposição: <b>${lim.exhibit}</b></li></ul>
        <p class="muted small">Ganhe XP invocando, criando, desfilando e cumprindo missões. Cada nível: 💎150 + 🎟️1 e mais vagas. Rivais do desfile também ficam mais fortes!</p>`,
    });
  }

  function settingsModal() {
    const S = Store.s;
    UI.modal({
      title: '⚙️ Ajustes', buttons: [],
      body: `
        <label class="toggle"><input type="checkbox" id="setSound" ${S.settings.sound ? 'checked' : ''}/><span>🔊 Sons</span></label>
        <label class="toggle"><input type="checkbox" id="setFast" ${S.settings.fastPull ? 'checked' : ''}/><span>⏩ Animações rápidas de invocação</span></label>
        <h4>💾 Backup do progresso</h4>
        <p class="muted small">O jogo salva automaticamente neste aparelho. Use o backup para levar seu progresso a outro navegador/celular.</p>
        <div class="btn-row"><button class="btn" id="setCopy">📋 Copiar código</button><button class="btn" id="setFile">⬇️ Baixar arquivo</button></div>
        <textarea id="setCode" placeholder="Cole aqui um código de backup para importar..." rows="3"></textarea>
        <div class="btn-row"><button class="btn primary" id="setImport">⬆️ Importar código</button><label class="btn">📁 Importar arquivo<input type="file" id="setFileIn" accept=".json,.txt,application/json" hidden/></label></div>
        <h4>⚠️ Zona de perigo</h4>
        <button class="btn danger wide" id="setReset">Apagar todo o progresso</button>
        <p class="muted small center">Ateliê Estelar · save v${SAVE_VERSION}</p>`,
      onOpen: (root, close) => {
        $('#setSound', root).onchange = e => { S.settings.sound = e.target.checked; Store.save(); Sfx.play('tap'); };
        $('#setFast', root).onchange = e => { S.settings.fastPull = e.target.checked; Store.save(); };
        $('#setCopy', root).onclick = async () => {
          const code = Store.exportCode();
          try { await navigator.clipboard.writeText(code); UI.toast('📋 Código copiado!'); }
          catch (e) { $('#setCode', root).value = code; $('#setCode', root).select(); UI.toast('Copie o código da caixa de texto'); }
        };
        $('#setFile', root).onclick = () => {
          Store.saveNow();
          const blob = new Blob([JSON.stringify(Store.s, null, 1)], { type: 'application/json' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `atelie-estelar-${Store.dayKey()}.json`;
          document.body.appendChild(a); a.click(); a.remove();
        };
        const doImport = txt => {
          UI.confirm('Importar vai <b>substituir</b> o progresso atual. Continuar?', 'Importar', 'danger').then(ok => {
            if (!ok) return;
            try { Store.importCode(txt); close(); UI.toast('✅ Progresso importado!'); UI.refresh(); UI.go(UI.current); }
            catch (e) { Sfx.play('error'); UI.toast('❌ Código inválido'); }
          });
        };
        $('#setImport', root).onclick = () => { const v = $('#setCode', root).value.trim(); if (v) doImport(v); else UI.toast('Cole um código primeiro'); };
        $('#setFileIn', root).onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(doImport); };
        $('#setReset', root).onclick = () => UI.confirm('Tem certeza? <b>Tudo será apagado</b> e não dá para desfazer (a menos que você tenha um backup).', 'Apagar tudo', 'danger').then(ok => {
          if (!ok) return;
          Store.reset(); close(); UI.refresh(); UI.go('gacha'); UI.toast('Novo começo! ✨'); welcome();
        });
      },
    });
  }

  function welcome() {
    UI.modal({
      title: '✨ Bem-vindo ao Ateliê Estelar!', dismissable: false,
      body: `<div class="reward-burst">🔮</div>
        <ul class="rules">
          <li><b>🔮 Invocar:</b> gaste 💎 ou 🎟️ para obter cabelos, roupas, auras, mascotes, fundos e objetos.</li>
          <li><b>🧑‍🎨 Estúdio:</b> monte personagens. 3+ itens do mesmo tema ativam <b>Conjunto</b>.</li>
          <li><b>🏞️ Cenário:</b> arraste objetos e personagens, escolha fundo e clima.</li>
          <li><b>🏆 Eventos:</b> desfile contra rivais e exponha cenários para ganhar 🪙.</li>
          <li><b>📖 Álbum:</b> complete a coleção e use ✨ poeira para criar itens.</li>
        </ul>
        <p class="center">Presente de boas-vindas: <b>💎1.600 + 🎟️10</b>.<br>Sua 1ª invocação ×10 garante um <b style="color:${RARITIES[3].color}">Lendário</b>!</p>`,
      buttons: [{ label: 'Começar!', cls: 'gold', onClick: () => { Store.s.tutorialSeen = true; Store.save(); if (Store.loginAvailable()) setTimeout(loginModal, 300); } }],
    });
  }

  /* Teclado (desktop) */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    const ov = $('#pull-overlay');
    if (!ov.classList.contains('hidden') && ov.innerHTML) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        const ok = $('#resOk'), sp = $('.spotlight', ov), skip = $('#resSkip');
        if (ok && !ok.classList.contains('hidden')) ok.click();
        else if (sp) sp.click();
        else if (e.key === 'Escape' && skip && !skip.classList.contains('hidden')) skip.click();
        else ov.click();
      }
      return;
    }
    const modals = $$('.modal-wrap');
    if (modals.length) {
      if (e.key === 'Escape') { const x = $('.modal-x', modals[modals.length - 1]); if (x) x.click(); }
      return;
    }
    if (UI.current === 'scene' && Screens.scene.key(e)) { e.preventDefault(); return; }
    const tabs = { 1: 'gacha', 2: 'studio', 3: 'scene', 4: 'events', 5: 'album' };
    if (tabs[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) UI.go(tabs[e.key]);
  });

  /* Virada do dia enquanto o app está aberto */
  let lastDay = Store.dayKey();
  setInterval(() => {
    if (Store.dayKey() !== lastDay) { lastDay = Store.dayKey(); Store.ensureDaily(); Store.save(); UI.refresh(); UI.go(UI.current); UI.toast('🌅 Um novo dia começou! Missões renovadas.'); }
  }, 30000);
  Store.on(() => UI.renderWallet());

  UI.refresh();
  UI.go('gacha');
  if (!Store.s.tutorialSeen) welcome();
  else if (Store.loginAvailable()) setTimeout(loginModal, 500);

  /* PWA offline */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
