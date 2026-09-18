/* ============ RIG: monta o personagem em SVG ============
   Camadas (de trás para frente): efeito atrás · [asas, capa, cabelo de trás] · cauda · pernas ·
   [tronco inclinável: pescoço/tronco, roupas, braços, frente da capa, rosto/cabelo da frente/chapéu] · efeito à frente · mascote */

const Rig = (() => {
  const FACE = 'M76 120 C76 70 110 58 150 58 C190 58 224 70 224 120 C224 162 200 196 150 198 C100 196 76 162 76 120Z';
  const VIEW = '-50 -30 400 480';
  const FACE_T = 'M80 116 C80 72 112 58 152 58 C194 58 226 72 226 122 C226 166 196 198 138 199 C104 194 82 158 80 116Z';

  const CROP = {
    hairBack: '0 20 300 360', hairBase: '40 10 220 250', ponytail: '10 -10 280 330', bangs: '60 30 180 190', ahoge: '90 -10 120 130',
    eye: '82 104 136 76', pupil: '82 104 136 76', brow: '82 88 136 76', nose: '112 142 76 56', mouth: '112 154 76 56', blush: '76 130 148 80', faceMark: '70 50 160 170',
    hat: '20 -40 260 220', glasses: '60 90 180 110', headAcc: '50 10 200 170', faceAcc: '70 100 160 120', neck: '100 180 100 110', logo: '110 200 100 90',
    shirt: '70 170 160 190', jacket: '70 170 160 230', skirt: '70 240 160 150', sleeve: '40 180 220 160', pants: '80 255 140 210', sock: '80 290 140 170', shoe: '80 350 140 90', glove: '40 210 220 150',
    cape: '30 150 240 280', tail: '120 180 180 200', wings: '-20 110 340 250', prop: '-60 20 420 390', shield: '40 190 140 150', effect: '-20 -20 340 460',
  };

  function adjAttr(a, ax, ay, mirror) {
    if (!a) return '';
    const m = mirror ? -1 : 1;
    return `translate(${ax + (a.x || 0)} ${ay + (a.y || 0)}) rotate(${a.r || 0}) scale(${(a.sx || 1) * m} ${a.sy || 1}) translate(${-ax} ${-ay})`;
  }

  function inner(ch, u, o = {}) {
    const pose = POSES[ch.body.pose] || POSES[0];
    const H = ch.hide || {};
    const T = ch.body.turn ? 1 : 0;
    const S = ch.skin, SO = H.outline ? 'none' : Color.shade(S, -48);
    const defs = [];

    const K = slot => {
      const p = ch.parts[slot];
      const c = [p.c[0], p.c[1], H.outline ? 'none' : p.c[2]];
      let F = c[0];
      if (SLOT_DEFS[slot].hair || SLOT_DEFS[slot].t === 'pupil') {
        const id = u + slot + 'g';
        defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="${SLOT_DEFS[slot].hair ? .35 : .25}" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`);
        F = `url(#${id})`;
      }
      return { c, F, u: u + slot, S, SO };
    };
    const tpl = slot => { const p = ch.parts[slot]; if (!p || !p.i) return null; return (PARTS[SLOT_DEFS[slot].t] || [])[p.i] || null; };
    const draw = (slot, arg) => {
      const t = tpl(slot); if (!t) return '';
      const svg = t.d(K(slot), arg);
      const a = ch.adj[slot], an = ANCHORS[slot];
      return a && an ? `<g transform="${adjAttr(a, an[0], an[1])}">${svg}</g>` : svg;
    };
    const limb = (L, w) => `<line x1="0" y1="0" x2="0" y2="${L}" stroke="${SO}" stroke-width="${w + 3.6}" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="${L}" stroke="${S}" stroke-width="${w}" stroke-linecap="round"/>`;

    /* ---- Braços (desenhados com a geometria esquerda; o direito é espelhado) ---- */
    function arm(s, dx = 0) {
      const X = s ? 'R' : 'L';
      const a1 = pose.a[s * 2], a2 = pose.a[s * 2 + 1];
      const hand = ch.body['hand' + X] || (pose.hd ? pose.hd[s] : 0);
      const gT = tpl('glove' + X), gl = gT ? gT.d(K('glove' + X)) : null;
      const upper = limb(G.AU, G.AW) + draw('sleeve' + X, 'u');
      let fore = limb(G.AF, G.AW - 1) + draw('sleeve' + X, 'f') + (gl ? gl.f : '');
      if (!s) fore += draw('shield');
      fore += drawHand(hand, gl ? gl.hand : S, SO, gl && gl.big) + (gl && gl.after || '') + draw('prop' + X);
      const g = `<g transform="translate(${G.SH[0][0] + dx} ${G.SH[0][1]}) rotate(${a1})">${upper}<g transform="translate(0 ${G.AU}) rotate(${a2})">${fore}</g></g>`;
      return s ? mir(g) : g;
    }

    /* ---- Pernas ---- */
    function leg(s, dx = 0) {
      const X = s ? 'R' : 'L';
      const h1 = pose.l[s * 2], h2 = pose.l[s * 2 + 1], ls = pose.ls || [1, 1, 1, 1];
      const thigh = limb(G.LT, G.TW) + draw('sock' + X, 't') + draw('pants' + X, 't');
      const foot = tpl('shoe' + X) ? draw('shoe' + X) : `<ellipse cx="0" cy="${G.LS + 4}" rx="8" ry="6" fill="${S}" stroke="${SO}" stroke-width="2.2"/>`;
      const shin = limb(G.LS, G.SW) + draw('sock' + X, 's') + draw('pants' + X, 's') + foot;
      const g = `<g transform="translate(${G.HIP[0][0] + dx} ${G.HIP[0][1]}) rotate(${h1}) scale(1 ${ls[s * 2]})">${thigh}<g transform="translate(0 ${G.LT}) rotate(${h2}) scale(1 ${ls[s * 2 + 1]})">${shin}</g></g>`;
      return s ? mir(g) : g;
    }

    /* ---- Olhos e sobrancelhas (locais, espelhados à direita) ---- */
    function eye(s) {
      const X = s ? 'R' : 'L', t = tpl('eye' + X); if (!t) return '';
      const k = K('eye' + X), r = t.d(k);
      const a = ch.adj['eye' + X] || {}, pa = ch.adj['pupil' + X] || {};
      let body = '';
      if (!r.closed) {
        const pt = tpl('pupil' + X), clip = u + 'ec' + X;
        body += `<path d="${r.w}" fill="${k.c[0]}"/>`;
        if (pt) body += `<clipPath id="${clip}"><path d="${r.w}"/></clipPath><g clip-path="url(#${clip})"><g transform="translate(${((pa.x || 0) - 2.5 * T) * (s ? -1 : 1)} ${pa.y || 0}) rotate(${pa.r || 0}) scale(${pa.sx || 1} ${pa.sy || 1})">${pt.d(K('pupil' + X))}</g></g>`;
      }
      body += r.lash;
      const ex = s ? 180 - 8 * T : 120 - 16 * T, far = !s && T ? .74 : 1;
      return `<g transform="translate(${ex + (a.x || 0)} ${144 + (a.y || 0)}) rotate(${a.r || 0}) scale(${(a.sx || 1) * (s ? -1 : 1) * 1.1 * far} ${(a.sy || 1) * 1.1})"><g class="anim-blink">${body}</g></g>`;
    }
    function brow(s) {
      const X = s ? 'R' : 'L', t = tpl('brow' + X); if (!t) return '';
      const a = ch.adj['brow' + X] || {};
      const bx = s ? 180 - 8 * T : 120 - 16 * T, far = !s && T ? .76 : 1;
      return `<g transform="translate(${bx + (a.x || 0)} ${108 + (a.y || 0)}) rotate(${a.r || 0}) scale(${(a.sx || 1) * (s ? -1 : 1) * far} ${a.sy || 1})">${t.d(K('brow' + X))}</g>`;
    }

    /* ---- Montagem ---- */
    const hs = 0.8 + (ch.body.head || 10) * 0.02;
    const headT = `translate(150 198) rotate(${(ch.body.headRot || 0) + (pose.h || 0)}) scale(${hs}) translate(-150 -198)`;
    const hair = !H.hair && !H.head;
    const headBack = H.head ? '' : `<g transform="${headT}"><g class="anim-hair">${hair ? draw('hairBack') + draw('ponytail') + draw('hairBase') : ''}</g></g>`;
    const emote = EMOTES[ch.chat && ch.chat.emote] || '';
    const headFront = H.head ? '' : `<g transform="${headT}">
      ${T ? '' : `<ellipse cx="78" cy="140" rx="9" ry="13" fill="${S}" stroke="${SO}" stroke-width="2.2"/>`}<ellipse cx="${222 + 2 * T}" cy="140" rx="9" ry="13" fill="${S}" stroke="${SO}" stroke-width="2.2"/>
      <path d="${T ? FACE_T : FACE}" fill="${S}" stroke="${SO}" stroke-width="2.5"/>
      ${H.face ? '' : `<g transform="translate(${-10 * T} 0)">${draw('blush') + draw('faceMark')}</g>` + eye(0) + eye(1) + brow(0) + brow(1) + `<g transform="translate(${-22 * T} 0)">${draw('nose')}</g><g transform="translate(${-14 * T} 0)">${draw('mouth')}</g>`}
      <g transform="translate(${-12 * T} 0)">${draw('faceAcc') + draw('glasses')}</g>
      ${hair ? `<g transform="translate(${-7 * T} 0)"><g class="anim-hair">${draw('bangs')}</g>${draw('ahoge')}</g>` : ''}
      <g transform="translate(${-4 * T} 0)">${draw('headAcc') + draw('headAcc2') + draw('hat')}</g>
      ${emote ? `<text x="214" y="40" font-size="40" text-anchor="middle" class="anim-bob" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif">${emote}</text>` : ''}
    </g>`;

    const capeT = tpl('cape'), cape = capeT ? capeT.d(K('cape')) : null;
    const capeAdj = s => { const a = ch.adj.cape; return a ? `<g transform="${adjAttr(a, 150, 212)}">${s}</g>` : s; };
    const pantsOn = ['pantsL', 'pantsR'].find(s => ch.parts[s].i);
    const torso = H.body ? '' :
      `<rect x="142" y="184" width="16" height="32" rx="6" fill="${Color.shade(S, -8)}" stroke="${SO}" stroke-width="2.2"/>` +
      `<path d="${TORSO}" fill="${S}" stroke="${SO}" stroke-width="2.2"/>` +
      (pantsOn ? `<path d="M119 264 L181 264 L184 293 Q150 303 116 293Z" fill="${ch.parts[pantsOn].c[0]}" stroke="${H.outline ? 'none' : ch.parts[pantsOn].c[2]}" stroke-width="2.2"/>` : '') +
      draw('shirt') + draw('skirt') + draw('jacket') + draw('neck') + draw('logo');

    const lean = `rotate(${pose.t || 0} 150 282)`;
    const behind = `<g transform="${lean}">
      <g class="anim-wing">${draw('wings')}</g>
      ${cape ? `<g class="anim-cape">${capeAdj(cape.back)}</g>` : ''}
      ${headBack}
    </g>`;
    const upper = `<g transform="${lean}">
      ${H.arms || !T ? '' : arm(0, 10)}
      ${torso}
      ${H.arms ? '' : (T ? '' : arm(0)) + arm(1)}
      ${cape && cape.front ? capeAdj(cape.front) : ''}
      ${headFront}
    </g>`;

    const petT = tpl('pet');
    const pet = petT && !o.noPet ? `<g transform="translate(${228 + (ch.pet.x || 0)} ${354 + (ch.pet.y || 0)}) scale(${ch.pet.s || 1})"><g class="anim-bob">${petT.d(K('pet'))}</g></g>` : '';

    const sz = 0.7 + (ch.body.size || 10) * 0.03, flip = ch.body.flip ? -1 : 1;
    const rot = (ch.body.rot || 0) + (pose.r || 0);
    const rootT = `translate(${(pose.x || 0) * sz} ${(pose.y || 0) * sz}) translate(150 ${G.FEET_Y}) scale(${sz * flip} ${sz}) translate(-150 ${-G.FEET_Y}) rotate(${rot} 150 250)`;
    const A = ch.anim || {};
    const cls = ['rig', !A.blink && 'na-blink', !A.hair && 'na-hair', !A.wings && 'na-wing', !A.cape && 'na-cape', !A.tail && 'na-tail', !A.effects && 'na-fx'].filter(Boolean).join(' ');

    const body = `<g transform="${rootT}">
      <g class="fx-back">${draw('effBack')}</g>
      ${behind}
      <g class="anim-tail">${H.body ? '' : draw('tail')}</g>
      ${H.legs ? '' : leg(0, 5 * T) + leg(1)}
      ${upper}
      <g class="fx-front">${draw('effFront')}</g>
      ${pet}
    </g>`;
    const shadow = ch.body.shadow && !o.noShadow ? `<ellipse cx="150" cy="${G.FEET_Y + 12}" rx="${62 * sz}" ry="${10 * sz}" fill="#000" opacity=".22"/>` : '';
    return `<defs>${defs.join('')}</defs><g class="${cls}">${shadow}${body}</g>`;
  }

  function render(ch, o = {}) {
    const u = uid();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.viewBox || VIEW}" class="${o.cls || 'rig-svg'}" preserveAspectRatio="${o.par || 'xMidYMid meet'}">${inner(ch, u, o)}</svg>`;
  }

  /* Retrato: pose neutra, só cabeça */
  function portrait(ch, cls = 'portrait') {
    const c = Object.assign({}, ch, { body: Object.assign({}, ch.body, { pose: 0, rot: 0, flip: 0, headRot: 0 }), chat: Object.assign({}, ch.chat, { emote: 0 }), anim: {} });
    c.parts = Object.assign({}, ch.parts, { effBack: { i: 0, c: [] }, effFront: { i: 0, c: [] }, wings: { i: 0, c: [] }, propL: { i: 0, c: [] }, propR: { i: 0, c: [] } });
    return render(c, { viewBox: '58 16 184 190', cls, noPet: true, noShadow: true });
  }

  /* Miniatura de uma peça aplicada no personagem atual */
  function thumb(ch, slot, i) {
    const t = SLOT_DEFS[slot].t;
    if (t === 'pet') {
      if (!i) return '<span class="none-mark">∅</span>';
      return `<svg viewBox="-6 -6 66 66" class="thumb still">${PARTS.pet[i].d({ c: ch.parts.pet.c, F: ch.parts.pet.c[0], u: uid() })}</svg>`;
    }
    const c = Object.assign({}, ch, { parts: Object.assign({}, ch.parts), chat: Object.assign({}, ch.chat, { emote: 0 }) });
    c.parts[slot] = Object.assign({}, ch.parts[slot], { i });
    if (PAIRS[slot]) c.parts[PAIRS[slot]] = Object.assign({}, ch.parts[PAIRS[slot]], { i });
    if (!['effect', 'wings', 'cape'].includes(t)) { c.parts.effBack = { i: 0, c: [] }; c.parts.effFront = { i: 0, c: [] }; }
    const CLOTH = ['shirt', 'jacket', 'skirt', 'sleeve', 'pants', 'sock', 'shoe', 'glove', 'neck', 'logo', 'prop', 'shield', 'tail'];
    if (CLOTH.includes(t)) for (const k of ['hairBack', 'ponytail', 'wings', 'cape']) c.parts[k] = { i: 0, c: [] };
    const body = t === 'effect' ? c.body : Object.assign({}, c.body, { pose: ['prop', 'shield', 'glove', 'sleeve'].includes(t) ? c.body.pose : 0, rot: 0, flip: 0, headRot: 0 });
    c.body = body;
    return render(c, { viewBox: CROP[t] || VIEW, cls: 'thumb still', noPet: true, noShadow: true });
  }

  /* Manequim neutro para as miniaturas de pose */
  let MANNEQUIN = null;
  function poseThumb(i) {
    if (!MANNEQUIN) { MANNEQUIN = baseChar(); MANNEQUIN.skin = '#dfe6ff'; MANNEQUIN.parts.hairBase = { i: 7, c: ['#dfe6ff', '#dfe6ff', '#8a93c8'] }; MANNEQUIN.anim = {}; }
    MANNEQUIN.body.pose = i;
    return render(MANNEQUIN, { cls: 'thumb still', noPet: true, noShadow: true });
  }

  return { render, inner, portrait, thumb, poseThumb, VIEW };
})();
