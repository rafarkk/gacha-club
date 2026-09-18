/* ============ JANELAS: opções, tutorial, reservas, fundos, perfil, importar/exportar ============ */

const Modals = (() => {

  /* ---------- Opções ---------- */
  function options() {
    const S = Store.s;
    const draw = root => {
      $('.modal-body', root).innerHTML = `<div class="opt-grid">
        <button class="opt" data-o="sound">Efeitos sonoros: <b>${S.settings.sound ? 'On' : 'Off'}</b></button>
        <button class="opt" data-o="reset">Resetar personagens</button>
        <button class="opt" data-o="quality">Qualidade: <b>${S.settings.quality ? 'Alta' : 'Baixa'}</b></button>
        <button class="opt" data-o="tutorial">Tutorial</button>
        <button class="opt" data-o="lang">🇧🇷 Idioma: <b>Português</b></button>
        <button class="opt" data-o="credits">Créditos</button>
        <button class="opt" data-o="backup">Backup do progresso</button>
        <button class="opt danger" data-o="wipe">Apagar todos os dados</button>
      </div><button class="btn wide" data-close>Voltar ao menu principal</button>`;
    };
    UI.modal({
      title: 'Opções', cls: 'opt-modal', onOpen: (root, close) => {
        draw(root);
        root.addEventListener('click', e => {
          const b = e.target.closest('[data-o]'); if (!b) return;
          Sfx.play('tap');
          switch (b.dataset.o) {
            case 'sound': S.settings.sound = S.settings.sound ? 0 : 1; break;
            case 'quality': S.settings.quality = S.settings.quality ? 0 : 1; App.applyQuality(); break;
            case 'lang': UI.toast('Por enquanto o jogo está só em português 🇧🇷'); break;
            case 'tutorial': close(); setTimeout(tutorial, 200); return;
            case 'credits': credits(); return;
            case 'backup': backup(); return;
            case 'reset': UI.confirm('Restaurar os 10 personagens principais ao visual original? As reservas não são afetadas.', 'Restaurar', 'danger').then(ok => { if (ok) { S.chars = MAIN_CHARS(); Store.save(); Menu.render(); UI.toast('Personagens restaurados'); } }); return;
            case 'wipe': UI.confirm('Apagar <b>tudo</b>: personagens, reservas e progresso? Não dá para desfazer.', 'Apagar tudo', 'danger').then(ok => { if (ok) { Store.reset(); close(); Menu.render(); UI.toast('Tudo novo! ✨'); } }); return;
          }
          Store.save(); draw(root);
        });
      },
    });
  }

  function credits() {
    UI.modal({ title: 'Créditos', body: `<div class="credits"><img src="icon.svg" alt="" width="72"/><h3>Ateliê Estelar</h3>
      <p>Jogo de personalização feito com HTML, CSS e JavaScript puros.</p>
      <p>Toda a arte (personagens, roupas, mascotes e cenários) é desenhada por código em SVG.</p>
      <p class="muted small">Inspirado no formato dos jogos de vestir estilo gacha. Personagens e marcas originais.</p></div>`, buttons: [{ label: 'Fechar', cls: 'primary' }] });
  }

  function backup() {
    UI.modal({
      title: 'Backup do progresso',
      body: `<p class="muted">O jogo salva sozinho neste aparelho. Use o backup para levar tudo para outro navegador ou celular.</p>
        <div class="btn-row"><button class="btn" data-bk="copy">📋 Copiar código</button><button class="btn" data-bk="file">⬇️ Baixar arquivo</button></div>
        <textarea data-code rows="3" placeholder="Cole aqui um código de backup para restaurar..."></textarea>
        <div class="btn-row"><button class="btn primary" data-bk="import">⬆️ Restaurar do código</button><label class="btn">📁 Restaurar arquivo<input type="file" data-file accept=".json,.txt" hidden/></label></div>`,
      onOpen: (root, close) => {
        const doImport = txt => UI.confirm('Restaurar vai <b>substituir</b> tudo que está salvo agora. Continuar?', 'Restaurar', 'danger').then(ok => {
          if (!ok) return;
          try { Store.importAll(txt); close(); Menu.render(); UI.toast('✅ Backup restaurado!'); } catch (e) { Sfx.play('error'); UI.toast('❌ Código inválido'); }
        });
        root.addEventListener('click', async e => {
          const b = e.target.closest('[data-bk]'); if (!b) return;
          if (b.dataset.bk === 'copy') { const c = Store.exportAll(); try { await navigator.clipboard.writeText(c); UI.toast('📋 Código copiado!'); } catch (_) { $('[data-code]', root).value = c; UI.toast('Copie o código da caixa'); } }
          if (b.dataset.bk === 'file') downloadText(JSON.stringify(Store.s), `atelie-estelar-${new Date().toISOString().slice(0, 10)}.json`);
          if (b.dataset.bk === 'import') { const v = $('[data-code]', root).value.trim(); if (v) doImport(v); else UI.toast('Cole um código primeiro'); }
        });
        $('[data-file]', root).onchange = e => { const f = e.target.files[0]; if (f) f.text().then(doImport); };
      },
    });
  }
  function downloadText(txt, name) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- Tutorial ---------- */
  const TUT = [
    { t: 'Boas-vindas', say: 'Bem-vindo ao Ateliê Estelar! Eu sou a Estela, a fada guia daqui.', list: ['Toque no lado direito para avançar.', 'Feche a janela quando quiser para pular.'], pet: 'E eu sou a Estrelinha, a mascote! ✨' },
    { t: 'Personalizar', say: 'Primeiro, o guarda-roupa. Olha tudo que dá para fazer!', list: ['Personalize 10 personagens principais e guarde mais 90 nas reservas.', 'Mude as cores de cada peça: principal, secundária e contorno.', '51 poses divididas em categorias.', 'Ajuste posição, tamanho e rotação de cabelo, olhos e acessórios.', 'Olhos, mangas, calças e sapatos podem ser diferentes de cada lado.', 'Expressões prontas, mascotes, efeitos e itens nas mãos.', 'Monte o perfil de cada personagem e exporte o código para compartilhar.'], pet: 'Crie todos os personagens fofos que quiser!' },
    { t: 'Estúdio', say: 'No Estúdio você vai montar cenas com vários personagens.', list: ['Coloque personagens em qualquer lugar da tela.', 'Adicione mascotes e objetos.', 'Escolha fundos e sobreposições (chuva, neve, pétalas...).', 'Faça os personagens conversarem com balões de fala.', 'Use um narrador para contar histórias.'], pet: 'Em construção: chega na próxima fase!' },
    { t: 'Gacha', say: 'O gacha vai trazer unidades especiais para as batalhas!', list: ['Invoque unidades e mascotes raros.', 'Repetidos deixam as unidades mais fortes.'], pet: 'Em breve!' },
    { t: 'Unidades', say: 'Fortaleça suas unidades para as aventuras.', list: ['Suba de nível, desperte e melhore habilidades.'], pet: 'Em breve!' },
    { t: 'Batalhas', say: 'Vamos salvar o mundo do Ateliê!', list: ['Modos história e treino.', 'Ganhe gemas nas batalhas.'], pet: 'Em breve!' },
    { t: 'Minigames', say: 'Uma pausa para se divertir!', list: ['Minigames com modo fácil e difícil.', 'Ganhe moedas e gemas jogando.'], pet: 'Em breve!' },
  ];
  function tutorial(start = 0) {
    let i = start;
    const guide = () => { const c = Store.s.chars[0]; const g = clone(c); g.body.pose = 8; g.chat.emote = 0; return Rig.render(g, { cls: 'tut-guide', noShadow: true }); };
    const draw = root => {
      const p = TUT[i];
      $('.modal-body', root).innerHTML = `<div class="tut">
        <div class="tut-tabs">${TUT.map((x, n) => `<button class="${n === i ? 'on' : ''}" data-ti="${n}">${x.t}</button>`).join('')}</div>
        <div class="tut-main">
          <button class="tut-arrow" data-tstep="-1" aria-label="Anterior">‹</button>
          <div class="tut-guide-wrap">${guide()}</div>
          <div class="tut-text"><div class="say">${esc(p.say)}</div><ul>${p.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul><div class="say pet">${esc(p.pet)}</div></div>
          <button class="tut-arrow" data-tstep="1" aria-label="Próximo">›</button>
        </div></div>`;
    };
    UI.modal({
      title: 'Tutorial', cls: 'tut-modal', onClose: () => { Store.s.tutorialSeen = true; Store.save(); },
      onOpen: root => {
        draw(root);
        root.addEventListener('click', e => {
          const b = e.target.closest('[data-ti],[data-tstep]'); if (!b) return;
          Sfx.play('tap');
          i = b.dataset.ti != null ? +b.dataset.ti : clamp(i + +b.dataset.tstep, 0, TUT.length - 1);
          draw(root);
        });
      },
    });
  }

  /* ---------- Trocar personagens (reservas) ---------- */
  function swap() {
    const S = Store.s; let main = S.cur, slot = 0, page = 0;
    const PER = 30;
    const draw = root => {
      const b = S.backups;
      $('.modal-body', root).innerHTML = `<p class="muted small">Guarde até 90 personagens reserva. Troque, clone ou copie roupas e cores entre eles.</p>
        <div class="swap">
          <div class="swap-main">${S.chars.map((c, i) => `<button class="ro${i === main ? ' on' : ''}" data-m="${i}">${Rig.portrait(c)}<small>${esc(c.name)}</small></button>`).join('')}</div>
          <div class="swap-list">${Array.from({ length: PER }, (_, k) => { const i = page * PER + k, c = b[i]; return `<button class="bk${i === slot ? ' on' : ''}${c ? '' : ' empty'}" data-b="${i}">${c ? Rig.portrait(c, 'mini') : ''}<small>${c ? esc(c.name) : 'Vazio ' + (i + 1)}</small></button>`; }).join('')}</div>
        </div>
        <div class="swap-actions">
          <button class="btn" data-a="swap">⇄ Trocar</button><button class="btn" data-a="store">💾 Guardar cópia</button>
          <button class="btn" data-a="all">Copiar tudo</button><button class="btn" data-a="clothes">Copiar roupas</button><button class="btn" data-a="hair">Copiar cabelo</button>
          <button class="btn${S.settings.copyColors ? ' on' : ''}" data-a="colors">Copiar cores: ${S.settings.copyColors ? 'ON' : 'OFF'}</button>
          <button class="btn danger" data-a="del">🗑️</button>
          <span class="pager"><button class="btn sm" data-pg="-1">‹</button> ${page + 1}/3 <button class="btn sm" data-pg="1">›</button></span>
        </div>`;
    };
    UI.modal({
      title: 'Trocar personagens', cls: 'swap-modal', onClose: () => Menu.render(),
      onOpen: root => {
        draw(root);
        root.addEventListener('click', e => {
          const t = e.target.closest('button'); if (!t) return;
          const d = t.dataset, B = S.backups;
          if (d.m != null) { main = +d.m; Sfx.play('tap'); return draw(root); }
          if (d.b != null) { slot = +d.b; Sfx.play('tap'); return draw(root); }
          if (d.pg) { page = clamp(page + +d.pg, 0, 2); return draw(root); }
          if (!d.a) return;
          const need = () => { if (!B[slot]) { Sfx.play('error'); UI.toast('Essa reserva está vazia'); return false; } return true; };
          switch (d.a) {
            case 'swap': { const m = S.chars[main]; S.chars[main] = B[slot] || Object.assign(DEFAULT_GIRL(), { name: 'Novo' }); B[slot] = m; UI.toast('⇄ Trocados!'); break; }
            case 'store': if (B[slot]) return UI.confirm(`Substituir <b>${esc(B[slot].name)}</b> na reserva?`, 'Substituir').then(ok => { if (ok) { B[slot] = clone(S.chars[main]); B[slot].id = newId(); Store.save(); draw(root); } }); B[slot] = clone(S.chars[main]); B[slot].id = newId(); UI.toast('💾 Guardado na reserva'); break;
            case 'all': case 'clothes': case 'hair': if (!need()) return; Store.copyInto(S.chars[main], B[slot], d.a, !!S.settings.copyColors); UI.toast('Copiado!'); break;
            case 'colors': S.settings.copyColors = S.settings.copyColors ? 0 : 1; break;
            case 'del': if (!need()) return; return UI.confirm(`Apagar <b>${esc(B[slot].name)}</b> da reserva?`, 'Apagar', 'danger').then(ok => { if (ok) { B[slot] = null; Store.save(); draw(root); } });
          }
          Sfx.play('pick'); Store.save(); draw(root);
        });
      },
    });
  }

  /* ---------- Fundos ---------- */
  function backgrounds(st, onChange) {
    let tab = 'bg';
    const draw = root => {
      const list = tab === 'bg' ? Scenery.BG_LIST : Scenery.FG_LIST;
      $('.modal-body', root).innerHTML = `<div class="seg"><button class="${tab === 'bg' ? 'on' : ''}" data-tab="bg">Fundos</button><button class="${tab === 'fg' ? 'on' : ''}" data-tab="fg">Sobreposições</button></div>
        <div class="bg-grid">${list.map((x, i) => `<button class="bgt${(tab === 'bg' ? st.bg : st.fg) === i ? ' on' : ''}" data-i="${i}">${tab === 'bg' ? Scenery.thumbBg(i, st.color) : Scenery.thumbFg(i)}<small>${esc(x.n)}</small></button>`).join('')}</div>
        ${tab === 'bg' ? `<div class="bg-ctl">
          <div class="num"><span>Mover</span><div><button class="arr" data-mv="-10,0">◀</button><button class="arr" data-mv="10,0">▶</button><button class="arr" data-mv="0,-10">▲</button><button class="arr" data-mv="0,10">▼</button></div></div>
          <div class="num"><span>Escala ${st.scale.toFixed(1)}</span><div><button class="arr" data-sc="-.1">−</button><button class="arr" data-sc=".1">+</button></div></div>
          <div class="num"><span>Tom ${st.tint}%</span><div><button class="arr" data-tn="-10">−</button><button class="arr" data-tn="10">+</button></div></div>
          <div class="num"><span>Cores</span><div><button class="sw" data-col="color" style="background:${st.color}" title="Cor do fundo"></button><button class="sw" data-col="tintColor" style="background:${st.tintColor}" title="Cor do tom"></button></div></div>
          <button class="btn sm" data-reset>Resetar</button></div>` : ''}`;
    };
    UI.modal({
      title: 'Fundos', cls: 'bg-modal', onOpen: root => {
        draw(root);
        root.addEventListener('click', e => {
          const b = e.target.closest('button'); if (!b || !b.closest('.modal-body')) return;
          const d = b.dataset;
          if (d.tab) { tab = d.tab; Sfx.play('tap'); return draw(root); }
          if (d.i != null) { st[tab] = +d.i; Sfx.play('pick'); }
          else if (d.mv) { const [x, y] = d.mv.split(',').map(Number); st.mx = clamp(st.mx + x, -200, 200); st.my = clamp(st.my + y, -200, 200); }
          else if (d.sc) st.scale = clamp(Math.round((st.scale + +d.sc) * 10) / 10, .5, 3);
          else if (d.tn) st.tint = clamp(st.tint + +d.tn, 0, 90);
          else if (d.reset != null) Object.assign(st, { mx: 0, my: 0, scale: 1, tint: 0 });
          else if (d.col) {
            const k = d.col, body = $('.modal-body', root);
            return ColorPicker.open(body, { title: k === 'color' ? 'Cor do fundo' : 'Cor do tom', targets: [{ label: 'Cor', get: () => st[k], set: v => { st[k] = v; onChange(); } }], onClose: () => draw(root) });
          } else return;
          onChange(); draw(root);
        });
      },
    });
  }

  /* ---------- Perfil completo ---------- */
  function profileCard(ch) {
    const P = ch.profile, cl = CLUBS[P.club || 0];
    const row = (l, v) => `<div class="pf-row"><small>${l}</small><b>${esc(v || '—')}</b></div>`;
    UI.modal({
      title: esc(ch.name), cls: 'profile-modal',
      body: `<div class="pf">
        <div class="pf-art">${Rig.render(ch, { cls: 'rig-svg' })}</div>
        <div class="pf-info">
          <div class="pf-title" style="--tc:${cl.c}">${esc(TITLES[P.title] || TITLES[0])}</div>
          <div class="pf-grid">${row('Aniversário', P.birthday)}${row('Idade', P.age)}${row('Criado por', P.creator)}${row('Clube favorito', cl.ic + ' ' + cl.n)}</div>
          <div class="pf-bio"><small>Perfil</small><p>${esc(P.bio || 'Sem descrição ainda.')}</p></div>
          <div class="pf-grid">${row('Cor favorita', P.color)}${row('Comida favorita', P.food)}${row('Localização', P.place)}${row('Personalidade', P.personality)}${row('Ocupação', P.job)}${row('Mascote', ch.parts.pet.i ? ch.pet.name : '')}</div>
        </div></div>`,
    });
  }

  /* ---------- Exportar / importar personagem ---------- */
  function exportChar(ch) {
    const code = Store.exportChar(ch);
    UI.modal({
      title: 'Exportar personagem', body: `<p class="muted small">Envie este código para alguém importar <b>${esc(ch.name)}</b>.</p><textarea readonly rows="4">${esc(code)}</textarea>`,
      buttons: [{ label: '⬇️ Arquivo', onClick: () => { downloadText(code, (ch.name || 'personagem') + '.txt'); return false; } }, { label: '📋 Copiar', cls: 'primary', onClick: () => { navigator.clipboard.writeText(code).then(() => UI.toast('📋 Copiado!'), () => UI.toast('Selecione e copie o código')); } }],
    });
  }
  function importChar(done) {
    UI.modal({
      title: 'Importar personagem', body: `<p class="muted small">Cole o código de um personagem. Ele vai <b>substituir</b> o personagem atual.</p><textarea data-code rows="4" placeholder="AE1:..."></textarea><label class="btn">📁 Abrir arquivo<input type="file" data-file accept=".txt,.json" hidden/></label>`,
      buttons: [{ label: 'Cancelar' }, {
        label: 'Importar', cls: 'primary', onClick: root => {
          try { done(Store.importChar($('[data-code]', root).value)); UI.toast('✅ Personagem importado!'); } catch (e) { Sfx.play('error'); UI.toast('❌ Código inválido'); return false; }
        },
      }],
      onOpen: root => { $('[data-file]', root).onchange = e => { const f = e.target.files[0]; if (f) f.text().then(t => { $('[data-code]', root).value = t.trim(); }); }; },
    });
  }

  return { options, tutorial, swap, backgrounds, profileCard, exportChar, importChar, credits };
})();
