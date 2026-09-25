/* ============ RIG: monta o personagem em SVG ============
   Camadas (de trás para frente): efeito atrás · [asas, capa, cabelo de trás] · cauda · pernas ·
   [tronco inclinável: pescoço/tronco, roupas, braços, frente da capa, rosto/cabelo da frente/chapéu] · efeito à frente · mascote
   Profundidade: cada peça passa pelo filtro "cel" (sombra de dois tons embaixo/direita e luz de borda em cima/esquerda,
   calculadas a partir da forma, então respeitam qualquer cor). Franja e chapéu projetam sombra no rosto, a cabeça no
   pescoço, e o cabelo de trás fica mais escuro. Com qualidade baixa, .fx perde o filtro e .fxs (sombras) some. */

const Rig = (() => {
  /* Rosto largo, bochechas cheias e queixo arredondado (estilo chibi) */
  const FACE = 'M74 118 C74 66 110 54 150 54 C190 54 226 66 226 118 C227 156 216 180 192 192 C174 201 126 201 108 192 C84 180 73 156 74 118Z';
  const VIEW = '-50 -30 400 480';
  const FACE_T = 'M80 116 C80 68 114 54 154 54 C196 54 228 68 228 120 C229 158 214 184 184 195 C162 203 126 202 108 192 C90 182 79 156 80 116Z';
  /* Proporção do Gacha Club (medida nas referências): cabeça ~43% da altura, tronco curto com metade da largura
     da cabeça, braços curtos e grossos (o pulso chega ao quadril), pernas grossas ~33% da altura.
     Tronco: escala em volta da base do pescoço (BN). Braços e pernas: escala UNIFORME (ARM_F/LEG_F), então as
     roupas crescem sem deformar; os contornos dividem pela escala (G.sf) para manter a espessura. */
  const TSX = 1.36, TSY = .88, BN = [150, 206], TORSO_SF = 1.3;
  const TORSO_T = `translate(${BN[0]} ${BN[1]}) scale(${TSX} ${TSY}) translate(${-BN[0]} ${-BN[1]})`;
  const BODY_T = `translate(${BN[0]} ${BN[1]}) scale(1.2) translate(${-BN[0]} ${-BN[1]})`;
  const ARM_F = 1.7, LEG_F = 1.95;
  const bodyY = y => BN[1] + (y - BN[1]) * TSY;
  /* o corpo sobe para os pés continuarem no chão (as miniaturas compensam com o mesmo valor) */
  const SHIFT = 402 - (bodyY(282) + (G.LT + G.LS + 12) * LEG_F);
  /* 3/4 leve (como no jogo de referência): o tronco é desenhado em duas metades cortadas no meio (x=150);
     a de longe um pouco mais estreita, a de perto um pouco mais larga, e zíper/botões vão para o lado do olhar.
     Ombros e quadril usam o mesmo mapeamento, então braços e pernas continuam presos no lugar certo. */
  /* olho ~22% da largura do rosto (medido nas referências do Gacha Club) */
  const EYE = .98;
  const TURN_C = 146, TURN_FAR = .64, TURN_NEAR = 1.1;
  const turnX = x => TURN_C + (x - 150) * (x < 150 ? TURN_FAR : TURN_NEAR);

  /* recortes das miniaturas do editor (medidos no corpo atual) */
  const CROP = {
    hairBack: '-9 -20 318 382', hairBase: '33 -30 233 265', ponytail: '2 -51 297 350', bangs: '55 -9 191 201', ahoge: '86 -51 127 138',
    eye: '78 69 144 81', pupil: '78 69 144 81', brow: '78 52 144 81', nose: '110 110 81 59', mouth: '110 122 81 59', blush: '72 97 157 85', faceMark: '65 12 170 180',
    hat: '12 -83 276 233', glasses: '55 55 191 117', headAcc: '44 -30 212 180', faceAcc: '65 65 170 127', neck: '108 162 84 64', logo: '112 178 76 64',
    shirt: '85 170 130 95', jacket: '78 170 144 135', skirt: '72 225 156 115', sleeve: '48 168 204 95', pants: '82 232 136 172', sock: '85 290 130 115', shoe: '90 362 120 48', glove: '48 190 204 75', shoulder: '60 170 180 70', wrist: '48 200 204 75', knee: '82 290 136 70',
    cape: '25 120 250 290', tail: '105 160 205 240', wings: '-20 100 340 230', prop: '-40 40 380 360', shield: '35 160 135 125', effect: '-20 -40 340 460',
  };

  /* Sombra (sh) e luz (hl) de borda: a forma encolhida, deslocada e subtraída de si mesma vira um crescente nítido.
     dark < 1 escurece a peça inteira (cabelo de trás). */
  const celFilter = (id, { dark = 1, sh = [-7, -9], hl = [2.5, 3.5], color = '#1c0a3a', op = .22, lop = .16 } = {}) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="in"/>
    <feOffset in="in" dx="${sh[0]}" dy="${sh[1]}" result="o1"/><feComposite in="in" in2="o1" operator="out" result="s1"/>
    <feFlood flood-color="${color}" flood-opacity="${op}"/><feComposite in2="s1" operator="in" result="shade"/>
    <feOffset in="in" dx="${hl[0]}" dy="${hl[1]}" result="o2"/><feComposite in="in" in2="o2" operator="out" result="s2"/>
    <feFlood flood-color="#fff" flood-opacity="${lop}"/><feComposite in2="s2" operator="in" result="light"/>
    ${dark < 1 ? `<feComponentTransfer in="SourceGraphic" result="src"><feFuncR type="linear" slope="${dark}"/><feFuncG type="linear" slope="${dark}"/><feFuncB type="linear" slope="${dark}"/></feComponentTransfer>` : ''}
    <feMerge><feMergeNode in="${dark < 1 ? 'src' : 'SourceGraphic'}"/><feMergeNode in="shade"/><feMergeNode in="light"/></feMerge></filter>`;
  /* Silhueta chapada de uma cor (sombra projetada) */
  const silFilter = (id, color, op = 1) => `<filter id="${id}" color-interpolation-filters="sRGB"><feFlood flood-color="${color}" flood-opacity="${op}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
  /* Peças pequenas do rosto ficam sem filtro */
  const NO_CEL = new Set(['eye', 'pupil', 'brow', 'nose', 'mouth', 'blush', 'faceMark', 'logo', 'effect', 'glasses']);
  const DARK = { hairBack: .82, hairBase: .88 };

  function adjAttr(a, ax, ay, mirror) {
    if (!a) return '';
    const m = mirror ? -1 : 1;
    return `translate(${ax + (a.x || 0)} ${ay + (a.y || 0)}) rotate(${a.r || 0}) scale(${(a.sx || 1) * m} ${a.sy || 1}) translate(${-ax} ${-ay})`;
  }

  function inner(ch, u, o = {}) {
    const pose = POSES[ch.body.pose] || POSES[0];
    const H = ch.hide || {};
    const T = ch.body.turn ? 1 : 0;
    const bust = !!ch.body.bust;
    TORSO = bust ? TORSO_F : TORSO_M; JACKET = bust ? JACKET_F : JACKET_M;
    const S = ch.skin, SO = H.outline ? 'none' : Color.shade(S, -48);
    const FC = Object.assign({ hl: 0, chin: 0, eyeHl: 1, look: 0, blushPos: 0, shade: 0 }, ch.face || {}), HF = ch.hairFx || {};
    const defs = [
      celFilter(u + 'cel'), celFilter(u + 'celD1', { dark: DARK.hairBack }), celFilter(u + 'celD2', { dark: DARK.hairBase }),
      /* só o tom do cabelo posterior, sem borda (linha do cabelo sem franja: não pode ter emenda) */
      celFilter(u + 'dkB', { dark: DARK.hairBase, op: 0, lop: 0 }),
      /* pele: sombra quente e mais curta, luz fraca */
      /* membros: desenhados em escala ~2x, então sombra/luz com deslocamento menor */
      celFilter(u + 'celL', { color: Color.shade(Color.mix(S, '#d8506e', .45), -30), op: .26, sh: [-2.2, -3], hl: [1, 1.4], lop: .12 }),
      celFilter(u + 'celS', { color: Color.shade(Color.mix(S, '#d8506e', .45), -30), op: .26, sh: [-4, -6], lop: .12 }),
      silFilter(u + 'sil', Color.shade(S, -24)), silFilter(u + 'silK', '#1c0a3a', .2),
      /* contorno externo grosso da silhueta inteira (o traço forte do estilo anime) */
      `<filter id="${u}ol" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.2" result="d"/><feFlood flood-color="#160c2c"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
      `<radialGradient id="${u}gs"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".6" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`,
    ];
    const fx = (svg, f = 'cel') => svg ? `<g class="fx" filter="url(#${u}${f})">${svg}</g>` : '';
    /* Tingimento: cobre a forma com a cor na força pedida (0 a 100) */
    const tintF = (key, col, amt) => { const id = u + 'tn' + key;
      defs.push(`<filter id="${id}" color-interpolation-filters="sRGB"><feFlood flood-color="${col}" flood-opacity="${(amt / 100).toFixed(2)}"/><feComposite in2="SourceAlpha" operator="in" result="t"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>`);
      return id; };

    const K = slot => {
      const p = ch.parts[slot];
      const c = [p.c[0], p.c[1], H.outline ? 'none' : p.c[2]];
      let F = c[0];
      if (SLOT_DEFS[slot].hair || SLOT_DEFS[slot].t === 'pupil') {
        const id = u + slot + 'g';
        defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="${SLOT_DEFS[slot].hair ? .35 : .25}" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`);
        F = `url(#${id})`;
      }
      const k = { c, F, u: u + slot, S, SO };
      if (SLOT_DEFS[slot].hair) { k.HL = HF.hl || ''; k.ACC = HF.acc || ''; }
      return k;
    };
    const tpl = slot => { const p = ch.parts[slot]; if (!p || !p.i) return null; return (PARTS[SLOT_DEFS[slot].t] || [])[p.i] || null; };
    const draw = (slot, arg, raw) => {
      const t = tpl(slot); if (!t) return '';
      let svg = t.d(K(slot), arg);
      if (!raw && !NO_CEL.has(SLOT_DEFS[slot].t)) svg = fx(svg, slot === 'hairBack' ? 'celD1' : slot === 'hairBase' ? 'celD2' : 'cel');
      const pp = ch.parts[slot];
      if (pp.tint) svg = `<g filter="url(#${tintF(slot, pp.tc || '#ff4f86', pp.tint)})">${svg}</g>`;
      const a = ch.adj[slot], an = ANCHORS[slot];
      return a && an ? `<g transform="${adjAttr(a, an[0], an[1])}">${svg}</g>` : svg;
    };
    const limb = (L, w0, w1 = w0, sides, sx = 1) => { const a = w0 / 2, b = w1 / 2, sw = (3.2 / sx).toFixed(2);
      const l = `M${-a} 0 C${-a} ${L * .45} ${-b - .6} ${L * .7} ${-b} ${L}`, r = `M${b} ${L} C${b + .6} ${L * .7} ${a} ${L * .45} ${a} 0`;
      const d = `M${-a} 0 C${-a} ${L * .45} ${-b - .6} ${L * .7} ${-b} ${L} A${b} ${b} 0 0 0 ${b} ${L} C${b + .6} ${L * .7} ${a} ${L * .45} ${a} 0 A${a} ${a} 0 0 0 ${-a} 0Z`;
      return sides ? `<path d="${d}" fill="${S}"/><path d="${l} ${r}" fill="none" stroke="${SO}" stroke-width="${sw}" stroke-linecap="round"/>`
        : `<path d="${d}" fill="${S}" stroke="${SO}" stroke-width="${sw}"/>`; };

    /* Junta sem costura: repete o membro recortado numa faixa em volta do joelho/cotovelo, sem contornos
       (a barra da coxa/manga some; o contorno de fora volta pelo contorno da silhueta) */
    const joint = (id, svg) => `<g class="nostk" clip-path="url(#${u}${id})">${svg}</g>`;
    defs.push(`<style>.nostk *{stroke:none!important}</style>`,
      '');

    /* ---- Braços (desenhados com a geometria esquerda; o direito é espelhado) ---- */
    function arm(s, x) {
      const X = s ? 'R' : 'L', sf0 = G.sf; G.sf = ARM_F;
      const a1 = pose.a[s * 2], a2 = pose.a[s * 2 + 1];
      const hand = ch.body['hand' + X] || (pose.hd ? pose.hd[s] : 0);
      const gT = tpl('glove' + X), gl = gT ? gT.d(K('glove' + X)) : null;
      /* Cotovelo sem emenda: antebraço primeiro, depois o braço por cima só com os contornos laterais (a ponta
         arredondada cobre o topo do antebraço). Mão, luva e itens vêm por último, por cima de tudo.
         O volume (celL) é aplicado no braço inteiro de uma vez. */
      /* pele do braço inteiro num contorno só (sem emenda no cotovelo) */
      const ag = legGeo(a2, 1, 1, { L1: G.AU, L2: G.AF, w: (t, tk) => t <= tk ? G.AW - 1.5 * t / tk : (() => { const v = (t - tk) / (1 - tk); return G.AW - 1.5 - 2 * v + .9 * Math.sin(Math.PI * Math.min(v / .8, 1)); })() });
      const armSkin = `<path d="${ag.capD(0, 1)}" fill="${S}" stroke="${SO}" stroke-width="${(3.2 / ARM_F).toFixed(2)}" stroke-linejoin="round"/>`;
      const LA = limbAPI(ag, 'a' + X, ARM_F), sleeve = draw('sleeve' + X, LA, 1);
      /* acessórios de ombro e pulso vão por cima da manga e da luva */
      const extra = draw('shoulder' + X, LA, 1) + draw('wrist' + X, LA, 1);
      const fore = gl ? gl.f : '';
      /* no 3/4 a mão de longe fica atrás do tronco: o item dela não é desenhado (apareceria atravessando o corpo) */
      const farHidden = T && !s;
      let hands = s || farHidden ? '' : draw('shield', undefined, 1);
      hands += (H.hands ? '' : drawHand(hand, gl ? gl.hand : S, SO, gl && gl.big) + (gl && gl.after || '')) + (farHidden ? '' : draw('prop' + X, undefined, 1));
      const inFore = svg => `<g transform="translate(0 ${G.AU}) rotate(${a2})">${svg}</g>`;
      /* ombro: com o braço abaixado a junta fica logo abaixo da linha do ombro; conforme o braço sobe, ela vai
         para o canto de cima do tronco (senão o braço levantado parece sair do peito) */
      const up = clamp((Math.abs(a1) - 25) / 65, 0, 1);
      const g = `<g transform="translate(${((s ? 300 - x : x) - 5 * up).toFixed(2)} ${(bodyY(G.SH[0][1]) - 6 * up).toFixed(2)}) rotate(${a1}) scale(${ARM_F})">${fx(armSkin + sleeve + inFore(fore) + extra + inFore(hands), 'celL')}</g>`;
      G.sf = sf0;
      return s ? mir(g) : g;
    }

    /* ---- Pernas: um contorno contínuo do quadril ao tornozelo (sem emenda no joelho) ----
       Espaço local da perna (girado pelo quadril e escalado por LEG_F): quadril em (0,0), joelho em K, tornozelo em A.
       Largura: coxa grossa afinando até o joelho, panturrilha levemente cheia, tornozelo fino. */
    /* geo (opcional) troca comprimentos e largura: usado também no braço (ombro→cotovelo→pulso) */
    function legGeo(h2, lsT, lsS, geo) {
      const lt = (geo ? geo.L1 : G.LT) * lsT, lsn = (geo ? geo.L2 : G.LS) * lsS, tot = lt + lsn, tk = lt / tot, r = h2 * Math.PI / 180;
      const dir = [-Math.sin(r), Math.cos(r)], n2 = [Math.cos(r), Math.sin(r)];
      const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
      const width = geo ? t => geo.w(t, tk) : t => t <= tk ? G.TW + (G.SW - .6 - G.TW) * Math.pow(t / tk, 1.15)
        : (() => { const v = (t - tk) / (1 - tk); return G.SW - .6 + (-3.2 * v) + 1.7 * Math.sin(Math.PI * Math.min(v / .75, 1)); })();
      const at = t => {
        const d = t * tot;
        const c = d <= lt ? [0, d] : [dir[0] * (d - lt), lt + dir[1] * (d - lt)];
        const m = smooth(tk - .07, tk + .07, t), nx = 1 + (n2[0] - 1) * m, ny = n2[1] * m, nl = Math.hypot(nx, ny);
        return { x: c[0], y: c[1], nx: nx / nl, ny: ny / nl, w: width(t) };
      };
      const pts = (t0, t1, d0, d1) => {
        const n = Math.max(3, Math.ceil((t1 - t0) * 30)), L = [], Rr = [];
        for (let i = 0; i <= n; i++) {
          const t = t0 + (t1 - t0) * i / n, p = at(t), h = p.w / 2 + d0 + (d1 - d0) * i / n;
          L.push([p.x - p.nx * h, p.y - p.ny * h]); Rr.push([p.x + p.nx * h, p.y + p.ny * h]);
        }
        return [L, Rr];
      };
      const curve = P => { let d = `${P[0][0].toFixed(2)} ${P[0][1].toFixed(2)}`;
        for (let i = 1; i < P.length - 1; i++) d += ` Q${P[i][0].toFixed(2)} ${P[i][1].toFixed(2)} ${((P[i][0] + P[i + 1][0]) / 2).toFixed(2)} ${((P[i][1] + P[i + 1][1]) / 2).toFixed(2)}`;
        return d + ` L${P[P.length - 1][0].toFixed(2)} ${P[P.length - 1][1].toFixed(2)}`; };
      const bandD = (t0, t1, d0 = 0, d1 = d0) => { const [L, Rr] = pts(t0, t1, d0, d1); return `M${curve(L)} L${curve(Rr.reverse())}Z`; };
      /* igual a bandD, mas com as pontas arredondadas (ombro e pulso) */
      const capD = (t0, t1) => { const [L, Rr] = pts(t0, t1, 0, 0), a = at(t0).w / 2, b = at(t1).w / 2, e = Rr[Rr.length - 1], f = L[0];
        return `M${curve(L)} A${b.toFixed(2)} ${b.toFixed(2)} 0 0 0 ${e[0].toFixed(2)} ${e[1].toFixed(2)} L${curve(Rr.reverse())} A${a.toFixed(2)} ${a.toFixed(2)} 0 0 0 ${f[0].toFixed(2)} ${f[1].toFixed(2)}Z`; };
      const roundTopD = (t0, t1, d0 = 0, d1 = d0) => { const [L, Rr] = pts(t0, t1, d0, d1), a = at(t0).w / 2 + d0, f = L[0];
        return `M${curve(L)} L${curve(Rr.reverse())} A${a.toFixed(2)} ${a.toFixed(2)} 0 0 0 ${f[0].toFixed(2)} ${f[1].toFixed(2)}Z`; };
      return { tk, at, bandD, capD, roundTopD, A: at(1), K: [0, lt], r };
    }
    /* Peças que vestem um membro contínuo (calça, meia, manga): faixas ao longo do membro, t = 0 na raiz e 1 na ponta */
    function limbAPI(g0, tag, F) {
      return {
        knee: g0.tk,
        /* começando no ombro (t0 < 0) a faixa tem a ponta arredondada: manga com ombro redondo */
        band: (k, t0, t1, d0 = 1.2, d1 = d0, fill) => `<path d="${t0 < 0 ? g0.roundTopD(0, t1, d0, d1) : g0.bandD(t0, t1, d0, d1)}" fill="${fill || k.c[0]}" ${ol(k)}/>`,
        stripes: (k, t0, t1, d0, d1, step, w) => { const id = k.u + 's' + tag;
          let b = ''; for (let t = t0 + step / 2; t < t1; t += step) b += `<path d="${g0.bandD(t, Math.min(t + w, t1), d0 + 2, d1 + 2)}" fill="${k.c[1]}"/>`;
          return `<clipPath id="${id}"><path d="${g0.bandD(t0, t1, d0, d1)}"/></clipPath><path d="${g0.bandD(t0, t1, d0, d1)}" fill="${k.c[0]}"/><g clip-path="url(#${id})">${b}</g><path d="${g0.bandD(t0, t1, d0, d1)}" fill="none" ${ol(k)}/>`; },
        line: (k, t, d, color, w = 1) => { const p = g0.at(t), h = p.w / 2 + d;
          return `<path d="M${(p.x - p.nx * h).toFixed(2)} ${(p.y - p.ny * h).toFixed(2)} L${(p.x + p.nx * h).toFixed(2)} ${(p.y + p.ny * h).toFixed(2)}" stroke="${color}" stroke-width="${(w * 3 / F).toFixed(2)}"/>`; },
        patch: (k, t, rx, ry, fill) => { const p = g0.at(t);
          return `<ellipse cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${k.c[2]}" stroke-width="${(1.6 / F).toFixed(2)}" transform="rotate(${(Math.atan2(p.ny, p.nx) * 180 / Math.PI).toFixed(1)} ${p.x.toFixed(2)} ${p.y.toFixed(2)})"/>`; },
        pt: t => g0.at(t),
      };
    }
    function leg(s, x) {
      const X = s ? 'R' : 'L', sf0 = G.sf; G.sf = LEG_F;
      /* no 3/4 (como no Gacha Club): perna de longe abre para o lado do olhar, a de perto fica quase vertical */
      const h1 = pose.l[s * 2] + (T ? (s ? -2 : 5) : 0), h2 = pose.l[s * 2 + 1], ls = pose.ls || [1, 1, 1, 1];
      const g0 = legGeo(h2, ls[s * 2], ls[s * 2 + 1]), sw = (3.2 / LEG_F).toFixed(2);
      const L = limbAPI(g0, 'l' + X, LEG_F);
      const skin = `<path d="${g0.bandD(0, 1)}" fill="${S}" stroke="${SO}" stroke-width="${sw}"/>`;
      G.toe = T ? (s ? 1 : -1) : 0;
      let foot = H.feet ? '' : tpl('shoe' + X) ? draw('shoe' + X, undefined, 1) : `<ellipse cx="${-1.5 * G.toe}" cy="${G.LS + 4}" rx="${T ? 8.8 : 8}" ry="6" fill="${S}" stroke="${SO}" stroke-width="${sw}"/>`;
      G.toe = 0;
      /* pé com a sola sempre plana no chão (desfaz o giro do quadril); no 3/4 aponta para o lado do olhar */
      /* no 3/4 o sapato é desenhado de perfil em diagonal (bico para o lado do olhar; o direito é espelhado) */
      foot = `<g transform="translate(${g0.A.x.toFixed(2)} ${g0.A.y.toFixed(2)}) rotate(${-h1}) scale(.86 ${.78 * ls[s * 2 + 1]}) translate(0 ${-G.LS})">${foot}</g>`;
      const body = skin + draw('sock' + X, L, 1) + draw('pants' + X, L, 1) + draw('knee' + X, L, 1) + foot;
      G.sf = sf0;
      const g = `<g transform="translate(${s ? 300 - x : x} ${bodyY(G.HIP[0][1])}) rotate(${h1}) scale(${LEG_F})">${fx(body, 'celL')}</g>`;
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
        /* sombra da pálpebra no branco (embaixo da íris, para não apagar os brilhos) */
        body += `<path d="${r.w}" fill="${k.c[0]}"/><clipPath id="${clip}"><path d="${r.w}"/></clipPath><g clip-path="url(#${clip})">`;
        /* olhar: automático = para o lado do rosto no 3/4; o resto em coordenadas da tela (o olho direito é espelhado) */
        const lk = LOOK_XY[FC.look] || [-2.5 * T, 0];
        let psvg = pt ? pt.d(K('pupil' + X)) : '';
        /* sem brilho nos olhos: tira os reflexos brancos da pupila */
        if (!FC.eyeHl) psvg = psvg.replace(/<(?:ellipse|circle|path)\b[^>]*fill="#fff"[^>]*\/>/g, '');
        if (pt) body += `<g transform="translate(${((pa.x || 0) + lk[0]) * (s ? -1 : 1)} ${(pa.y || 0) + lk[1]}) rotate(${pa.r || 0}) scale(${pa.sx || 1} ${pa.sy || 1})">${psvg}</g>`;
        body += `</g>`;
      }
      body += r.lash;
      const ex = s ? 180 - 8 * T : 120 - 14 * T, far = !s && T ? .8 : 1;
      return `<g transform="translate(${ex + (a.x || 0)} ${150 + (a.y || 0)}) rotate(${a.r || 0}) scale(${(a.sx || 1) * (s ? -1 : 1) * EYE * far} ${(a.sy || 1) * EYE})"><g class="anim-blink">${body}</g></g>`;
    }
    function brow(s) {
      const X = s ? 'R' : 'L', t = tpl('brow' + X); if (!t) return '';
      const a = ch.adj['brow' + X] || {};
      const bx = s ? 181 - 8 * T : 119 - 14 * T, far = !s && T ? .78 : 1;
      return `<g transform="translate(${bx + (a.x || 0)} ${116 + (a.y || 0)}) rotate(${a.r || 0}) scale(${(a.sx || 1) * (s ? -1 : 1) * far} ${a.sy || 1})">${t.d(K('brow' + X))}</g>`;
    }

    /* ---- Montagem ---- */
    const hs = 0.86 + (ch.body.head || 10) * 0.02;
    const headT = `translate(150 198) rotate(${(ch.body.headRot || 0) + (pose.h || 0)}) scale(${hs}) translate(-150 -198)`;
    const hair = !H.hair && !H.head;
    const headBack = H.head ? '' : `<g transform="${headT}"><g class="anim-hairb">${hair && !H.hairB ? draw('hairBack') + draw('ponytail') : ''}</g><g class="anim-hair">${hair ? draw('hairBase') : ''}</g></g>`;
    const emote = EMOTES[ch.chat && ch.chat.emote] || '';
    /* Sem franja, o cabelo de cima desenha a linha do cabelo na testa (como no Gacha Club), para a testa não ficar enorme */
    const hairline = () => {
      const bt = tpl('hairBase'); if (!bt) return '';
      const svg = drawHair(K('hairBase'), 'M70 138 C60 62 104 38 150 38 C196 38 240 62 230 138',
        [[230, 138], [218, 110], [196, 94], [172, 90], [158, 100], [146, 90], [118, 92], [94, 102], [80, 116], [70, 138]], { edgeOnly: 1, bulge: .35, lines: 0 });
      /* acompanha o rosto (no 3/4 o rosto é FACE_T, mais estreito e deslocado) */
      return `<g transform="${T ? 'translate(154 0) scale(.95 1) translate(-150 0)' : ''}">${fx(svg, 'dkB')}</g>`;
    };
    const faceD = T ? FACE_T : FACE;
    const bp = BLUSH_POS[FC.blushPos] || BLUSH_POS[0];
    /* sombra do rosto: escurece o alto do rosto (0 a 9) */
    const faceShade = () => { if (!FC.shade || H.head) return '';
      defs.push(`<linearGradient id="${u}fsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Color.shade(S, -45)}" stop-opacity="${(FC.shade * .1).toFixed(2)}"/><stop offset=".75" stop-color="${Color.shade(S, -45)}" stop-opacity="0"/></linearGradient>`);
      return `<path d="${faceD}" fill="url(#${u}fsg)" class="fxs"/>`; };
    /* brilho do rosto: traços brancos no nariz, bochechas e testa */
    const faceHl = () => { const t = FC.hl; if (!t) return '';
      const x = -12 * T, sp = (cx, cy, rx, ry, r = 0) => `<ellipse cx="${cx + x}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".85" transform="rotate(${r} ${cx + x} ${cy})"/>`;
      let o = '';
      if (t === 1 || t >= 3) o += sp(147, 167, 2.2, 4.4, 14);
      if (t === 2 || t === 4) o += sp(100 + 12 * T, 164, 7, 2.6, -22) + sp(200, 164, 7, 2.6, 22) + sp(92 + 12 * T, 170, 2.2, 1.4) + sp(208, 170, 2.2, 1.4);
      if (t === 3) o += sp(136, 104, 12, 3.2, -8);
      return `<g class="fxs" clip-path="url(#${u}fc)">${o}</g>`; };
    /* queixo */
    const chin = () => { const t = FC.chin; if (!t) return '';
      const x = 150 - 13 * T, y = 194, c = Color.shade(S, -40), ln = (d, w = 1.8) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
      const hc = ch.parts.bangs.c[0] || '#6b4226';
      return [ '',
        ln(`M${x - 5} ${y} Q${x} ${y + 1.5} ${x + 5} ${y}`),
        ln(`M${x - 3} ${y - 2} Q${x - 1} ${y + 1} ${x - 2} ${y + 3} M${x + 3} ${y - 2} Q${x + 1} ${y + 1} ${x + 2} ${y + 3}`, 1.5),
        ln(`M${x - 9} ${y - 3} Q${x} ${y + 4} ${x + 9} ${y - 3}`),
        ln(`M${x - 8} ${y - 3} L${x} ${y + 3} L${x + 8} ${y - 3}`),
        ln(`M${x - 8} ${y - 3} Q${x} ${y + 3} ${x + 8} ${y - 3} M${x - 6} ${y + 2} Q${x} ${y + 6} ${x + 6} ${y + 2}`, 1.5),
        [[-12, -6], [-6, -2], [0, 0], [6, -2], [12, -6], [-9, -1], [9, -1], [-3, 3], [3, 3]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r=".9" fill="${Color.shade(hc, -10)}" opacity=".7"/>`).join(''),
        `<path d="M${x - 5} ${y - 3} Q${x} ${y - 5} ${x + 5} ${y - 3} Q${x + 4} ${y + 5} ${x} ${y + 6} Q${x - 4} ${y + 5} ${x - 5} ${y - 3}Z" fill="${hc}" stroke="${Color.shade(hc, -40)}" stroke-width="1.2"/>`,
        `<ellipse cx="${x}" cy="${y}" rx="11" ry="4" fill="${c}" opacity=".22"/>`,
        `<circle cx="${x + 9}" cy="${y - 4}" r="1.3" fill="${Color.shade(S, -60)}"/>`,
      ][t] || ''; };
    defs.push(`<clipPath id="${u}fc"><path d="${faceD}"/></clipPath>`);
    const hatOn = tpl('hat');
    const faceShadow = !hair && !hatOn ? '' : `<g class="fxs" clip-path="url(#${u}fc)">
      ${hair ? `<g filter="url(#${u}sil)" transform="translate(3 9)"><g class="anim-hair">${draw('bangs', undefined, 1)}</g></g>` : ''}
      ${hatOn ? `<g filter="url(#${u}sil)" transform="translate(${-4 * T + 3} 11)">${draw('hat', undefined, 1)}</g>` : ''}
    </g>`;
    const headFront = H.head ? '' : `<g transform="${headT}">
      ${fx((T ? '' : `<ellipse cx="77" cy="146" rx="7" ry="10" fill="${S}" stroke="${SO}" stroke-width="3"/>`) + `<ellipse cx="${223 + 2 * T}" cy="146" rx="7" ry="10" fill="${S}" stroke="${SO}" stroke-width="3"/>
      <path d="${faceD}" fill="${S}" stroke="${SO}" stroke-width="3"/>`, 'celS')}
      ${faceShadow}
      ${faceShade()}
      ${H.face ? '' : `<g clip-path="url(#${u}fc)"><g transform="translate(${-10 * T + bp[0]} ${8 + bp[1]}) translate(150 166) scale(${.94 * bp[2]} 1) translate(-150 -166)">${draw('blush')}</g></g>${faceHl()}${chin()}<g transform="translate(${-10 * T} 4)">${draw('faceMark')}</g><g transform="translate(${-12 * T} 6)">${draw('faceAcc3')}</g>` + (FC.over ? '' : eye(0) + eye(1)) + `<g transform="translate(${-18 * T} 3)">${draw('nose')}</g><g transform="translate(${-13 * T} 1) translate(150 184) scale(.9) translate(-150 -184)">${draw('mouth')}</g>`}
      <g transform="translate(${-12 * T} 6)">${draw('faceAcc') + draw('glasses')}</g>
      <g transform="translate(${-4 * T} 0)">${draw('headAcc4')}</g>
      ${hair ? `<g class="anim-hair">${draw('bangs') || hairline()}</g>${draw('ahoge')}` : ''}
      ${H.face ? '' : (FC.over ? eye(0) + eye(1) : '') + brow(0) + brow(1)}
      <g transform="translate(${-12 * T} 6)">${draw('faceAcc2')}</g>
      <g transform="translate(${-4 * T} 0)">${draw('headAcc') + draw('headAcc2') + draw('hat') + draw('headAcc3')}</g>
      ${emote ? `<text x="214" y="40" font-size="40" text-anchor="middle" class="anim-bob" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif">${emote}</text>` : ''}
    </g>`;

    /* asas: cada lado é a peça desenhada inteira e recortada na metade dela (a direita fica do lado direito da tela) */
    defs.push(`<clipPath id="${u}wL"><rect x="-600" y="-600" width="750" height="1800"/></clipPath><clipPath id="${u}wR"><rect x="150" y="-600" width="750" height="1800"/></clipPath>`);
    const wing = (slot, clip) => { const t = tpl(slot); if (!t) return '';
      const svg = fx(`<g clip-path="url(#${u}${clip})">${t.d(K(slot))}</g>`), a = ch.adj[slot], an = ANCHORS[slot];
      return a && an ? `<g transform="${adjAttr(a, an[0], an[1])}">${svg}</g>` : svg; };
    const capeT = tpl('cape'), cape = capeT ? capeT.d(K('cape')) : null;
    const capeAdj = s => { const a = ch.adj.cape; return a ? `<g transform="${adjAttr(a, 150, 212)}">${s}</g>` : s; };
    const pantsOn = ['pantsL', 'pantsR'].find(s => ch.parts[s].i);
    const NECK_R = `<rect x="144" y="184" width="12" height="32" rx="5"/>`;
    defs.push(`<linearGradient id="${u}tmg" gradientUnits="userSpaceOnUse" x1="146.5" y1="0" x2="150.5" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="${u}tm" maskUnits="userSpaceOnUse" x="-300" y="-300" width="900" height="1100"><rect x="-300" y="-300" width="900" height="1100" fill="url(#${u}tmg)"/></mask><clipPath id="${u}tg"><rect x="143" y="-300" width="600" height="1100"/></clipPath>`);
    defs.push(`<clipPath id="${u}nk">${NECK_R}</clipPath><clipPath id="${u}tr">${NECK_R}<path d="${TORSO}"/></clipPath>`);
    const headSil = (f, dy) => H.head ? '' : `<g filter="url(#${u}${f})"><g transform="${headT} translate(0 ${dy})"><path d="${faceD}"/></g></g>`;
    G.sf = TORSO_SF;
    /* linha curta embaixo do busto, na cor do contorno da camisa (ou da pele) */
    const shirtOn = ['shirt', 'jacket'].find(k => ch.parts[k].i);
    const bustLine = bust ? `<path d="M153 239 Q163 244 171 239" stroke="${shirtOn ? (H.outline ? 'none' : ch.parts.shirt.i ? ch.parts.shirt.c[2] : ch.parts.jacket.c[2]) : SO}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>` : '';
    /* Decote: a pele do pescoço entra na gola (sem a linha da camisa atravessando o pescoço) */
    const neckCut = () => {
      const sh = ch.parts.shirt; if (!sh.i || [3, 5, 15].includes(sh.i)) return '';
      const oc = H.outline ? 'none' : sh.c[2];
      return `<path d="M144.5 198 L155.5 198 L155.5 211 Q150 215.5 144.5 211Z" fill="${Color.shade(S, -8)}"/>` +
        `<path d="M144 198 L144 210.5 M156 198 L156 210.5" stroke="${SO}" stroke-width="2.3" stroke-linecap="round"/>` +
        `<path d="M141.5 208.5 Q150 218 158.5 208.5" stroke="${oc}" stroke-width="2.3" fill="none" stroke-linecap="round"/>`;
    };
    /* estampa em uma das 16 posições do tronco (LOGO_POS) */
    const logo = () => { const lp = LOGO_POS[ch.parts.logo.p || 0] || LOGO_POS[0], svg = draw('logo');
      return svg && (lp[0] || lp[1] || lp[2] !== 1) ? `<g transform="translate(${160 + lp[0]} ${241 + lp[1]}) scale(${lp[2]}) translate(-160 -241)">${svg}</g>` : svg; };
    const torso = H.body ? '' :
      `<rect x="144" y="184" width="12" height="32" rx="5" fill="${Color.shade(S, -8)}" stroke="${SO}" stroke-width="2.3"/>` +
      `<g class="fxs" clip-path="url(#${u}nk)">${headSil('sil', 10)}</g>` +
      fx(`<path d="${TORSO}" fill="${S}" stroke="${SO}" stroke-width="2.3"/>`, 'celS') +
      (pantsOn ? fx(`<path d="${bust ? 'M130.5 262 L169.5 262 C179 271 184 281 184 293 Q150 303 116 293 C116 281 121 271 130.5 262Z' : 'M125.5 260 L174.5 260 L184 293 Q150 303 116 293Z'}" fill="${ch.parts[pantsOn].c[0]}" stroke="${H.outline ? 'none' : ch.parts[pantsOn].c[2]}" stroke-width="2.2"/>`) : '') +
      draw('shirt') + neckCut() + draw('skirt2') + draw('skirt') + draw('neck2') + draw('jacket') + draw('neck') + logo() +
      `<g class="fxs" clip-path="url(#${u}tr)">${headSil('silK', 18)}</g>`;
    G.sf = 1;

    /* x de um ponto do tronco na tela (escala do tronco + 3/4) */
    const bodyX = x => { const v = 150 + (x - 150) * TSX; return T ? turnX(v) : v; };
    const lean = `rotate(${pose.t || 0} 150 ${bodyY(282)})`;
    const behind = `<g transform="${lean}">
      <g transform="${BODY_T} translate(150 232) scale(1.3) translate(-150 -232)"><g class="anim-wing">${H.wings ? '' : wing('wings', 'wL') + wing('wingsR', 'wR')}</g>
      ${cape && !H.cape ? `<g class="anim-cape">${capeAdj(cape.back)}</g>` : ''}</g>
      ${headBack}
    </g>`;
    const upper = `<g transform="${lean}">
      ${H.arms || !T ? '' : arm(0, bodyX(126))}
      ${T ? [[TURN_NEAR, 'tg'], [TURN_FAR, 'tl']].map(([k, id]) => `<g transform="translate(${TURN_C} 0) scale(${k} 1) translate(-150 0)"><g ${id === 'tl' ? `mask="url(#${u}tm)"` : `clip-path="url(#${u}${id})"`}><g transform="${TORSO_T}">${torso}</g></g></g>`).join('') : `<g transform="${TORSO_T}">${torso}</g>`}
      ${H.arms ? '' : (T ? '' : arm(0, bodyX(126))) + arm(1, bodyX(174))}
      ${cape && cape.front && !H.cape ? `<g transform="${BODY_T}">${capeAdj(cape.front)}</g>` : ''}
      ${headFront}
    </g>`;

    /* mascote: o do espaço ligado ao personagem (Store.s.petSlots) ou, em dados antigos, parts.pet */
    const PS = ch.petSlot >= 0 && typeof Store !== 'undefined' && Store.s && Store.s.petSlots ? Store.s.petSlots[ch.petSlot] : null;
    const petT = tpl('pet');
    let pet = '';
    if (!o.noPet && PS && PS.i) pet = `<g transform="translate(${228 + (PS.x || 0)} ${354 + (PS.y || 0)})"><g class="anim-bob">${petSVG(PS, u + 'pt')}</g></g>`;
    else if (!o.noPet && petT) pet = `<g transform="translate(${228 + (ch.pet.x || 0)} ${354 + (ch.pet.y || 0)}) scale(${ch.pet.s || 1})"><g class="anim-bob">${petT.d(K('pet'))}</g></g>`;
    const petBack = PS && PS.back;

    const sz = 0.7 + (ch.body.size || 10) * 0.03, flip = ch.body.flip ? -1 : 1, wx = 0.7 + (ch.body.w || 10) * 0.03;
    const rot = (ch.body.rot || 0) + (pose.r || 0);
    const rootT = `translate(${(pose.x || 0) * sz} ${(pose.y || 0) * sz}) translate(150 ${G.FEET_Y}) scale(${sz * flip * wx} ${sz}) translate(-150 ${-G.FEET_Y}) rotate(${rot} 150 250)`;
    const A = ch.anim || {};
    const cls = ['rig', !A.blink && 'na-blink', !A.hair && 'na-hair', !A.hairB && 'na-hairb', !A.wings && 'na-wing', !A.cape && 'na-cape', !A.tail && 'na-tail', !A.effects && 'na-fx'].filter(Boolean).join(' ');
    /* velocidade: nível 5 = normal; cada nível acima acelera (a duração da animação é multiplicada) */
    const spd = k => { const l = A[k] == null ? 5 : A[k]; return l ? Math.pow(2, (5 - l) / 4).toFixed(2) : 1; };
    const animVars = ['blink', 'hair', 'hairB', 'wings', 'cape', 'tail', 'effects'].map(k => `--d-${k}:${spd(k)}`).join(';');

    const tintOn = ch.body.tint ? ` filter="url(#${tintF('body', ch.body.tintCol || '#ff4f86', ch.body.tint)})"` : '';
    const body = `<g transform="${rootT} translate(0 ${SHIFT})"${tintOn}>
      ${petBack ? pet : ''}
      <g class="fx-back">${draw('effBack')}</g>
      <g${H.outline ? '' : ` class="fx" filter="url(#${u}ol)"`}>
      ${behind}
      <g class="anim-tail"><g transform="${TORSO_T}">${H.body || H.tail ? '' : draw('tail')}</g></g>
      ${H.legs ? '' : leg(0, bodyX(bust ? 135.5 : 137)) + leg(1, bodyX(bust ? 164.5 : 163))}
      ${upper}
      </g>
      <g class="fx-front">${draw('effFront')}</g>
      ${petBack ? '' : pet}
    </g>`;
    /* sombra no chão como no Gacha Club: elipse sólida translúcida, da largura dos pés, com as solas a 3/4 da altura dela (base logo abaixo dos pés) */
    const shadow = ch.body.shadow && !o.noShadow ? groundShadow(ch.body.shType || 0, 150 + (T ? -10.5 : 0) * sz * flip, G.FEET_Y - 13 * sz, 57 * sz * wx, 11.5 * sz, ch.body.shCol || '#0a0620', u, defs) : '';
    return `<defs>${defs.join('')}</defs><g class="${cls}" style="${animVars}">${shadow}${body}</g>`;
  }

  /* Sombra no chão (20 tipos, SHADOWS em defaults.js): cx/cy centro, rx/ry tamanho da padrão */
  function groundShadow(t, cx, cy, rx, ry, col, u, defs) {
    const E = (x, y, a, b, extra = '') => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${a.toFixed(1)}" ry="${b.toFixed(1)}" ${extra}/>`;
    const f = (op = .6) => `fill="${col}" opacity="${op}"`, st = (w, op = .7, dash = '') => `fill="none" stroke="${col}" stroke-width="${w}" opacity="${op}"${dash ? ` stroke-dasharray="${dash}"` : ''}`;
    const rg = (id, inner, outer) => { defs.push(`<radialGradient id="${u}${id}"><stop offset="0" stop-color="${inner}" stop-opacity=".8"/><stop offset=".55" stop-color="${inner}" stop-opacity=".45"/><stop offset="1" stop-color="${outer}" stop-opacity="0"/></radialGradient>`); return `fill="url(#${u}${id})"`; };
    const shape = (d, op = .6) => `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${(rx / 57 * 1.3).toFixed(3)} ${(ry / 11.5 * 1.3).toFixed(3)})"><path d="${d}" fill="${col}" opacity="${op}"/></g>`;
    switch (t) {
      case 1: return E(cx, cy, rx * 1.15, ry * 1.3, rg('sh1', col, col));
      case 2: return E(cx, cy, rx * .62, ry * .75, f());
      case 3: return E(cx, cy, rx * 1.4, ry * 1.4, f());
      case 4: return E(cx, cy, rx, ry, f(.3));
      case 5: return E(cx, cy, rx, ry, f(.88));
      case 6: return E(cx, cy, rx, ry, st(3.2));
      case 7: return E(cx, cy, rx, ry, f(.45)) + E(cx, cy, rx * .6, ry * .6, f(.45));
      case 8: return E(cx, cy, rx * 1.3, ry * 1.6, rg('sh8', Color.mix(col, '#ffffff', .75), col));
      case 9: return E(cx, cy, rx * 1.2, ry * 1.4, rg('sh9', '#fffbe0', '#fffbe0')) + E(cx, cy, rx * 1.2, ry * 1.4, st(1.6, .5));
      case 10: return `<rect x="${(cx - rx).toFixed(1)}" y="${(cy - ry).toFixed(1)}" width="${(rx * 2).toFixed(1)}" height="${(ry * 2).toFixed(1)}" rx="${(ry * .5).toFixed(1)}" ${f()}/>`;
      case 11: return shape('M0 9 C-30 -2 -52 -6 -48 -12 C-44 -18 -12 -14 0 -6 C12 -14 44 -18 48 -12 C52 -6 30 -2 0 9Z');
      case 12: return shape('M0 -13 L10 -4 L52 -4 L17 3 L32 13 L0 7 L-32 13 L-17 3 L-52 -4 L-10 -4Z');
      case 13: return shape('M-50 -2 C-56 -12 -30 -14 -14 -10 C0 -16 26 -14 40 -9 C62 -4 58 8 36 10 C20 14 -2 11 -18 12 C-40 13 -60 8 -50 -2Z');
      case 14: return E(cx, cy, rx, ry, st(2.6, .8, '5 5'));
      case 15: return [1, .66, .33].map((k, i) => E(cx, cy, rx * k, ry * k, i === 2 ? f(.6) : st(2.4, .65))).join('');
      case 16: return E(cx + rx * .6, cy, rx * 1.7, ry * .9, f(.5));
      case 17: return `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) skewX(-50)">${E(0, 0, rx * .8, ry, f(.5))}<ellipse cx="${(rx * 1.3).toFixed(1)}" cy="${(-ry * .2).toFixed(1)}" rx="${(rx * .9).toFixed(1)}" ry="${(ry * .6).toFixed(1)}" ${f(.35)}/></g>`;
      case 18: return [[-.55, 0, .5], [0, -.2, .6], [.55, 0, .5], [-.25, .35, .45], [.28, .35, .45]].map(([dx, dy, k]) => E(cx + rx * dx, cy + ry * dy, rx * k, ry * k * 1.6, f(.5))).join('');
      case 19: return E(cx, cy, rx * 1.1, ry * 1.4, rg('sh19', Color.mix(col, '#9ae8ff', .6), col)) + E(cx, cy, rx * 1.1, ry * 1.4, st(2.2, .9)) + E(cx, cy, rx * .75, ry, st(1.4, .7));
      default: return E(cx, cy, rx, ry, f());
    }
  }

  const tintDef = (id, col, amt) => `<filter id="${id}" color-interpolation-filters="sRGB"><feFlood flood-color="${col}" flood-opacity="${(amt / 100).toFixed(2)}"/><feComposite in2="SourceAlpha" operator="in" result="t"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>`;
  /* Mascote de um espaço (P), em coordenadas do mascote (~54×54): escala/rotação no centro, tingimento, contorno e sombra */
  function petSVG(P, u) {
    const t = PARTS.pet[P.i]; if (!t) return '';
    const c = [P.c[0], P.c[1], P.ol === 0 ? 'none' : P.c[2]];
    let svg = t.d({ c, F: c[0], u, shOp: P.shadow == null ? .6 : P.shadow / 10 });
    if (P.tint) svg = `<defs>${tintDef(u + 'tn', P.tc || '#ff4f86', P.tint)}</defs><g filter="url(#${u}tn)">${svg}</g>`;
    return `<g transform="translate(26 30) rotate(${P.r || 0}) scale(${P.sx || 1} ${P.sy || 1}) translate(-26 -30)">${svg}</g>`;
  }
  /* Objeto de um espaço (O): dy sobe/desce o desenho (profundidade), com tingimento, contorno e sombra */
  function objSVG(O, u) {
    const t = PARTS.object[O.i]; if (!t) return '';
    const c = [O.c[0], O.c[1], O.ol === 0 ? 'none' : O.c[2]];
    let svg = t.d({ c, F: c[0], u, shOp: O.shadow == null ? .6 : O.shadow / 10 });
    if (O.tint) svg = `<defs>${tintDef(u + 'tn', O.tc || '#ff4f86', O.tint)}</defs><g filter="url(#${u}tn)">${svg}</g>`;
    return O.dy ? `<g transform="translate(0 ${O.dy * 4})">${svg}</g>` : svg;
  }

  function render(ch, o = {}) {
    const u = uid();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.viewBox || VIEW}" class="${o.cls || 'rig-svg'}" preserveAspectRatio="${o.par || 'xMidYMid meet'}">${inner(ch, u, o)}</svg>`;
  }

  /* Retrato: pose neutra, só cabeça */
  function portrait(ch, cls = 'portrait') {
    const c = Object.assign({}, ch, { body: Object.assign({}, ch.body, { pose: 0, rot: 0, flip: 0, headRot: 0 }), chat: Object.assign({}, ch.chat, { emote: 0 }), anim: {} });
    c.parts = Object.assign({}, ch.parts, { effBack: { i: 0, c: [] }, effFront: { i: 0, c: [] }, wings: { i: 0, c: [] }, wingsR: { i: 0, c: [] }, propL: { i: 0, c: [] }, propR: { i: 0, c: [] } });
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
    const CLOTH = ['shirt', 'jacket', 'skirt', 'sleeve', 'pants', 'sock', 'shoe', 'glove', 'shoulder', 'wrist', 'knee', 'neck', 'logo', 'prop', 'shield', 'tail'];
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

  return { render, inner, portrait, thumb, poseThumb, petSVG, objSVG, VIEW };
})();
