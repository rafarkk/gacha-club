/* ============ DEFINIÇÕES: slots, personagem padrão, predefinidos, expressões ============ */

/* Cada slot aponta para uma lista de PARTS (t). pair = lado esquerdo/direito. */
const SLOT_DEFS = {
  hairBack: { t: 'hairBack', n: 'Cabelo de trás', hair: 1 },
  hairBase: { t: 'hairBase', n: 'Cabelo posterior', hair: 1 },
  ponytail: { t: 'ponytail', n: 'Rabo de cavalo', hair: 1 },
  bangs: { t: 'bangs', n: 'Cabelo frontal', hair: 1 },
  ahoge: { t: 'ahoge', n: 'Ahoge', hair: 1 },
  eyeL: { t: 'eye', n: 'Olho', cn: ['Branco', 'Cílios'] }, eyeR: { t: 'eye', n: 'Olho direito', cn: ['Branco', 'Cílios'] },
  pupilL: { t: 'pupil', n: 'Pupila', cn: ['Íris', 'Degradê', 'Pupila'] }, pupilR: { t: 'pupil', n: 'Pupila direita', cn: ['Íris', 'Degradê', 'Pupila'] },
  browL: { t: 'brow', n: 'Sobrancelha', cn: ['Cor'] }, browR: { t: 'brow', n: 'Sobrancelha direita', cn: ['Cor'] },
  nose: { t: 'nose', n: 'Nariz', cn: ['Cor'] }, mouth: { t: 'mouth', n: 'Boca', cn: ['Interior', 'Língua', 'Contorno'] },
  blush: { t: 'blush', n: 'Corado', cn: ['Cor'] }, faceMark: { t: 'faceMark', n: 'Marca no rosto', cn: ['Cor'] },
  hat: { t: 'hat', n: 'Chapéu' }, glasses: { t: 'glasses', n: 'Óculos' },
  headAcc: { t: 'headAcc', n: 'Enfeite de cabeça' }, headAcc2: { t: 'headAcc', n: 'Enfeite de cabeça 2' },
  faceAcc: { t: 'faceAcc', n: 'Acessório de rosto' }, neck: { t: 'neck', n: 'Pescoço' }, logo: { t: 'logo', n: 'Estampa' },
  shirt: { t: 'shirt', n: 'Camisa' }, jacket: { t: 'jacket', n: 'Jaqueta' }, skirt: { t: 'skirt', n: 'Cinto/Saia' },
  sleeveL: { t: 'sleeve', n: 'Manga' }, sleeveR: { t: 'sleeve', n: 'Manga direita' },
  pantsL: { t: 'pants', n: 'Calça' }, pantsR: { t: 'pants', n: 'Calça direita' },
  sockL: { t: 'sock', n: 'Meia' }, sockR: { t: 'sock', n: 'Meia direita' },
  shoeL: { t: 'shoe', n: 'Sapato' }, shoeR: { t: 'shoe', n: 'Sapato direito' },
  gloveL: { t: 'glove', n: 'Luva' }, gloveR: { t: 'glove', n: 'Luva direita' },
  cape: { t: 'cape', n: 'Capa' }, tail: { t: 'tail', n: 'Cauda' }, wings: { t: 'wings', n: 'Asas' },
  propL: { t: 'prop', n: 'Item mão esquerda' }, propR: { t: 'prop', n: 'Item mão direita' }, shield: { t: 'shield', n: 'Escudo' },
  effBack: { t: 'effect', n: 'Efeito atrás' }, effFront: { t: 'effect', n: 'Efeito à frente' },
  pet: { t: 'pet', n: 'Mascote' },
};
const HAIR_SLOTS = ['hairBack', 'hairBase', 'ponytail', 'bangs', 'ahoge'];
const PAIRS = { eyeL: 'eyeR', pupilL: 'pupilR', browL: 'browR', sleeveL: 'sleeveR', pantsL: 'pantsR', sockL: 'sockR', shoeL: 'shoeR', gloveL: 'gloveR' };

/* Âncoras para Ajustar (posição/escala/rotação) */
const ANCHORS = {
  hairBack: [150, 110], hairBase: [150, 110], ponytail: [150, 90], bangs: [150, 100], ahoge: [150, 40],
  eyeL: [0, 0], eyeR: [0, 0], pupilL: [0, 0], pupilR: [0, 0], browL: [0, 0], browR: [0, 0],
  mouth: [150, 184], nose: [150, 168], blush: [150, 166], faceMark: [150, 160],
  hat: [150, 60], glasses: [150, 142], headAcc: [150, 80], headAcc2: [150, 80], faceAcc: [150, 160],
  neck: [150, 210], logo: [160, 240], wings: [150, 230], tail: [170, 280], cape: [150, 212],
  propL: [0, 36], propR: [0, 36], shield: [0, 15],
};
const ADJ_HEAD = ['bangs', 'hairBack', 'hairBase', 'ponytail', 'ahoge', 'eyeL', 'eyeR', 'pupilL', 'pupilR', 'browL', 'browR', 'mouth', 'nose', 'blush', 'faceMark'];
const ADJ_CLOTHES = ['hat', 'glasses', 'headAcc', 'headAcc2', 'faceAcc', 'neck', 'logo', 'wings', 'tail', 'cape', 'propL', 'propR', 'shield'];

const OUTLINE = '#2b2140';
const SKIN_TONES = ['#fff0e6', '#fde0cc', '#f6c9a3', '#e8b48a', '#d19a6e', '#b07a4f', '#8a5634', '#5b3522', '#cfe8ff', '#d9ffd6', '#ffd6f0', '#c9b8ff'];

function blankParts() {
  const p = {};
  for (const s of Object.keys(SLOT_DEFS)) p[s] = { i: 0, c: ['#ffffff', '#b8c0cf', OUTLINE] };
  return p;
}

/* Monta um visual a partir de uma descrição curta */
function look(o) {
  const ch = baseChar();
  if (o.name) ch.name = o.name;
  if (o.s) ch.skin = o.s;
  const set = (slot, v) => { if (!v) return; const [i, m, s, x] = v; ch.parts[slot] = { i, c: [m || '#ffffff', s || Color.shade(m || '#fff', -25), x || OUTLINE] }; };
  const both = (slot, v) => { set(slot + 'L', v); set(slot + 'R', v); };
  if (o.h) { const hc = o.hc || ['#6b4226', '#8a5a3a']; HAIR_SLOTS.forEach((s, n) => set(s, [o.h[n] || 0, hc[0], hc[1], hc[2] || Color.shade(hc[0], -55)])); }
  if (o.e != null) both('eye', [o.e, '#ffffff', o.lash || '#2b1a2e']);
  if (o.eR != null) set('eyeR', [o.eR, '#ffffff', o.lash || '#2b1a2e']);
  if (o.p != null) both('pupil', [o.p, (o.ic || [])[0] || '#6b4cff', (o.ic || [])[1] || '#c9b8ff', (o.ic || [])[2] || '#1a1030']);
  if (o.b != null) both('brow', [o.b, o.bc || Color.shade((o.hc || ['#6b4226'])[0], -30)]);
  if (o.m != null) set('mouth', [o.m, '#8a2a40', '#ff8fa3', '#3a1a22']);
  if (o.bl != null) set('blush', [o.bl, o.blc || '#ff8fa3']);
  if (o.fm) set('faceMark', o.fm);
  set('nose', [o.n == null ? 1 : o.n, Color.shade(o.s || ch.skin, -28)]);
  for (const k of ['shirt', 'jacket', 'skirt', 'neck', 'logo', 'hat', 'glasses', 'headAcc', 'headAcc2', 'faceAcc', 'cape', 'tail', 'wings', 'propL', 'propR', 'shield', 'effBack', 'effFront', 'pet']) set(k, o[k]);
  for (const k of ['sleeve', 'pants', 'sock', 'shoe', 'glove']) both(k, o[k]);
  if (o.pose != null) ch.body.pose = o.pose;
  if (o.hand) { ch.body.handL = o.hand[0]; ch.body.handR = o.hand[1]; }
  if (o.profile) Object.assign(ch.profile, o.profile);
  if (o.emote) ch.chat.emote = o.emote;
  return ch;
}

function baseChar() {
  return {
    id: newId(), name: 'Personagem', skin: '#fde0cc',
    parts: blankParts(),
    body: { size: 10, head: 10, pose: 0, headRot: 0, rot: 0, flip: 0, turn: 1, handL: 0, handR: 0, shadow: 1 },
    adj: {},
    hide: { head: 0, face: 0, hair: 0, body: 0, arms: 0, legs: 0, outline: 0 },
    anim: { blink: 1, hair: 1, wings: 1, cape: 1, tail: 1, effects: 1 },
    pet: { x: 0, y: 0, s: 1, name: 'Bichinho' },
    chat: { text: 'Olá! Bem-vindo ao Ateliê!', emote: 0, bubble: 0, font: 0, nameColor: '#ffffff', textColor: '#2b2140', bubbleColor: '#ffffff' },
    profile: { title: 0, birthday: '01/01', age: '16', bio: '', creator: '', favChar: '', club: 0, color: '', food: '', place: '', personality: '', job: '' },
  };
}

/* Personagens genéricos (como os "Default" do início do jogo de referência) */
/* Personagens genéricos (como os "Default" do início do jogo de referência) */
const DEFAULT_GIRL = () => look({ name: 'Menina Padrão', s: '#ffe8dc', h: [1, 2, 0, 1, 0], hc: ['#b4a7e6', '#8f86d8'], e: 2, p: 1, ic: ['#ff7ab8', '#ffc2dc', '#3a1030'], b: 1, m: 1, bl: 2, blc: '#ff9aa8', shirt: [1, '#ffffff', '#c9d2ff'], sleeve: [1, '#ffffff'], logo: [2, '#ff7ab8'], skirt: [6, '#4a5ad6', '#7f8cf0'], sock: [4, '#ffffff', '#4a5ad6'], shoe: [4, '#2b2140', '#ffffff'], profile: { bio: 'Olá! Eu sou a menina padrão do Ateliê.', creator: 'Ateliê', color: 'Rosa', food: 'Morango', place: 'Brasil', personality: 'Alegre', job: 'Estudante' } });
const DEFAULT_BOY = () => look({ name: 'Menino Padrão', s: '#ffe2d4', h: [0, 1, 0, 3, 0], hc: ['#8a624f', '#8a6e5e', '#3a1f17'], e: 2, p: 1, ic: ['#855944', '#b9876f', '#27170f'], b: 1, bc: '#3a1f17', m: 1, bl: 2, blc: '#ffc2c2', shirt: [1, '#ffffff', '#bbd4ff'], logo: [1, '#8589ff'], jacket: [1, '#4638ff', '#bbd4ff'], sleeve: [3, '#4638ff', '#bbd4ff'], pants: [3, '#3d3e62', '#aaa7cb'], sock: [1, '#ffffff'], shoe: [1, '#ff3f3f', '#ffffff'], profile: { bio: 'E aí! Eu sou o menino padrão do Ateliê.', creator: 'Ateliê', color: 'Azul', food: 'Arroz', place: 'Brasil', personality: 'Engraçado', job: 'Estudante' } });
/* Reserva genérica N (não é gravada no save até ser usada) */
function genericDefault(i) {
  const c = i % 2 ? DEFAULT_BOY() : DEFAULT_GIRL();
  c.name = 'Padrão ' + (i + 1); c.id = 'padrao-' + i;
  return c;
}

/* Os 10 personagens principais (originais do Ateliê Estelar) */
const MAIN_CHARS = () => [
  look({ name: 'Estela', s: '#fff0e6', h: [3, 2, 7, 11, 1], hc: ['#b9a7ff', '#ff9df2'], e: 7, p: 3, ic: ['#6b4cff', '#ff9df2', '#1b1446'], b: 2, m: 2, bl: 5, shirt: [13, '#2b2140', '#ffffff'], sleeve: [9, '#2b2140', '#ffffff'], sock: [4, '#2b2140', '#b9a7ff'], shoe: [4, '#1b1446', '#b9a7ff'], hat: [12, '#ffe66d'], headAcc: [1, '#ffe66d'], wings: [6, '#c9f1ff', '#b9a7ff'], propR: [4, '#ffe66d', '#b9a7ff'], pet: [15, '#ffe66d', '#ff9df2'], pose: 8, hand: [0, 3], profile: { title: 1, bio: 'Fada guia do Ateliê. Adora estrelas e roupas brilhantes!', personality: 'Animada', job: 'Guia estelar', color: 'Lilás' } }),
  look({ name: 'Kai', s: '#f6c9a3', h: [0, 4, 0, 4, 4], hc: ['#2f9fd8', '#7fe3e0'], e: 5, p: 1, ic: ['#00c2ff', '#7fe3e0'], b: 3, m: 11, bl: 0, shirt: [14, '#1d1838', '#00e5ff'], sleeve: [3, '#1d1838'], jacket: [5, '#2f9fd8', '#1b4f8c'], pants: [3, '#141029', '#00e5ff'], shoe: [1, '#ffffff', '#00e5ff'], hat: [10, '#1d1838', '#00e5ff'], propR: [5, '#c9f1ff', '#6b4cff'], pet: [7, '#cfd8e6', '#00e5ff'], pose: 7, hand: [0, 2], profile: { title: 2, bio: 'DJ do clube. Sempre com um fone no pescoço.', personality: 'Descolado', job: 'DJ', color: 'Azul' } }),
  look({ name: 'Mimi', s: '#fde0cc', h: [0, 8, 2, 6, 3], hc: ['#ff8fc4', '#ffd1e6'], e: 2, p: 4, ic: ['#ff4f8b', '#ffb3d1'], b: 1, m: 15, bl: 4, shirt: [6, '#ffd1e6', '#ff8fc4'], sleeve: [4, '#ffd1e6', '#ff8fc4'], sock: [7, '#ffffff', '#ff8fc4'], shoe: [4, '#ff8fc4', '#ffffff'], hat: [6, '#ff8fc4', '#ffffff'], neck: [6, '#ff4f8b', '#ffd166'], tail: [1, '#ff8fc4'], propL: [10, '#ff8fc4', '#9ee7ff'], pet: [1, '#ffffff', '#ffb3d1'], pose: 5, hand: [4, 4], profile: { title: 3, bio: 'Ama doces e gatinhos. Muito, muito fofa.', personality: 'Carinhosa', job: 'Confeiteira', color: 'Rosa' } }),
  look({ name: 'Ravi', s: '#e8b48a', h: [0, 4, 0, 10, 0], hc: ['#8a1c0e', '#ff5a1f'], e: 5, p: 5, ic: ['#ffb300', '#ff5a1f'], b: 4, m: 8, bl: 0, fm: [4, '#8a1c0e'], shirt: [10, '#8a1c0e', '#ffd23f'], sleeve: [3, '#2a0a05'], pants: [3, '#2a0a05', '#8a1c0e'], shoe: [3, '#2a0a05', '#ffd23f'], glove: [4, '#2a0a05', '#ffd23f'], hat: [11, '#2a0a05', '#ffd23f'], cape: [3, '#8a1c0e'], tail: [4, '#8a1c0e', '#ffd23f'], propR: [1, '#e0e6f0', '#ffd23f'], effBack: [2, '#ffd23f', '#ff5a1f'], pet: [8, '#ff5a1f', '#8a1c0e'], pose: 38, hand: [1, 1], profile: { title: 4, bio: 'Guerreiro com coração de dragão.', personality: 'Corajoso', job: 'Cavaleiro', color: 'Vermelho' } }),
  look({ name: 'Nina', s: '#fde0cc', h: [5, 2, 0, 3, 0], hc: ['#4f9a3a', '#c8e86b'], e: 3, p: 1, ic: ['#3fa34d', '#c8e86b'], b: 2, m: 1, bl: 1, fm: [1, '#c58b5b'], shirt: [9, '#3fa34d', '#8b5a2b'], sleeve: [5, '#3fa34d', '#c8e86b'], skirt: [4, '#2f6b3a', '#c8e86b'], shoe: [5, '#8b5a2b'], headAcc: [8, '#ff8fb1', '#ffffff'], propL: [6, '#ff8fb1', '#ffe066'], pet: [2, '#e0823a', '#3fa34d'], pose: 1, profile: { title: 5, bio: 'Conversa com as plantas da floresta encantada.', personality: 'Calma', job: 'Druida', color: 'Verde' } }),
  look({ name: 'Theo', s: '#f6c9a3', h: [0, 1, 0, 2, 5], hc: ['#f2c94c', '#ffe9a0'], e: 2, p: 1, ic: ['#2f9fd8', '#9ee7ff'], b: 1, m: 3, bl: 0, shirt: [11, '#f4e3b1', '#c58b5b'], sleeve: [3, '#f4e3b1'], pants: [3, '#6b4226', '#4a2c1a'], shoe: [1, '#8b5a2b', '#ffffff'], glasses: [1, '#3a2a22'], propR: [3, '#8e1b3a', '#ffe66d'], pet: [11, '#c58b5b', '#f4e3b1'], pose: 6, hand: [2, 1], profile: { title: 6, bio: 'Leitor voraz, sabe um pouco de tudo.', personality: 'Curioso', job: 'Bibliotecário', color: 'Amarelo' } }),
  look({ name: 'Lua', s: '#fff0e6', h: [3, 5, 0, 9, 0], hc: ['#e9e6ff', '#9ea7ff'], e: 4, p: 2, ic: ['#6b4cff', '#e9e6ff'], b: 2, m: 4, bl: 1, fm: [8, '#9ea7ff'], shirt: [6, '#1b1446', '#e9e6ff'], sleeve: [5, '#1b1446', '#e9e6ff'], sock: [5, '#1b1446'], shoe: [6, '#e9e6ff', '#6b4cff'], headAcc: [7, '#e9e6ff', '#9ea7ff'], effBack: [9, '#e9e6ff', '#ffe66d'], pet: [4, '#6b4cff', '#ff9df2'], pose: 10, profile: { title: 7, bio: 'Aparece só à noite. Dizem que veio da lua.', personality: 'Misteriosa', job: 'Astróloga', color: 'Prata' } }),
  look({ name: 'Bento', s: '#b07a4f', h: [0, 5, 0, 7, 0], hc: ['#3a2415', '#6b4226'], e: 6, p: 1, ic: ['#3a2415', '#8a5a3a'], b: 3, m: 2, bl: 3, shirt: [12, '#e84a5f', '#ffffff'], sleeve: [1, '#ffffff'], pants: [2, '#4a78c2', '#2f4f8c'], sock: [2, '#ffffff', '#e84a5f'], shoe: [1, '#2b2140', '#ffffff'], hat: [1, '#e84a5f', '#ffffff'], propR: [11, '#ffffff', '#ff8fc4'], pet: [10, '#f1d38b', '#8b5a2b'], pose: 3, hand: [0, 4], profile: { title: 8, bio: 'Faz amizade com todo mundo em cinco minutos.', personality: 'Extrovertido', job: 'Entregador', color: 'Laranja' } }),
  DEFAULT_GIRL(),
  DEFAULT_BOY(),
];

/* Predefinidos agrupados em clubes */
const CLUBS = [
  { n: 'Clube Estelar', ic: '🌟', c: '#ffe66d' }, { n: 'Clube Fogo', ic: '🔥', c: '#ff5a1f' }, { n: 'Clube Água', ic: '💧', c: '#2f9fd8' },
  { n: 'Clube Floresta', ic: '🌿', c: '#3fa34d' }, { n: 'Clube Cosmos', ic: '🪐', c: '#6b4cff' }, { n: 'Clube Doce', ic: '🍭', c: '#ff8fc4' },
  { n: 'Clube Sombra', ic: '🦇', c: '#8e1b3a' }, { n: 'Clube Neon', ic: '⚡', c: '#00e5ff' }, { n: 'Clube Sakura', ic: '🌸', c: '#ffb7c9' }, { n: 'Padrão', ic: '👤', c: '#8a94a6' },
];
const PRESETS = () => [
  { club: 1, ch: look({ name: 'Brasa', s: '#f6c9a3', h: [0, 4, 0, 4, 4], hc: ['#ff5a1f', '#ffd23f'], e: 5, p: 1, ic: ['#ffb300', '#ff5a1f'], b: 4, m: 11, shirt: [1, '#2a0a05', '#ff5a1f'], sleeve: [3, '#8a1c0e'], jacket: [5, '#8a1c0e', '#ffd23f'], pants: [3, '#2a0a05'], shoe: [2, '#2a0a05', '#ff5a1f'], effBack: [2, '#ffd23f', '#ff5a1f'], pose: 38 }) },
  { club: 1, ch: look({ name: 'Chama', s: '#fde0cc', h: [2, 3, 1, 1, 0], hc: ['#ff5a1f', '#ffd23f'], e: 2, p: 2, ic: ['#ff5a1f', '#ffd23f'], b: 1, m: 2, bl: 1, shirt: [8, '#ff5a1f', '#ffd23f'], skirt: [7, '#8a1c0e'], sock: [3, '#2a0a05'], shoe: [6, '#8a1c0e'], tail: [3, '#8a1c0e'], hat: [11, '#2a0a05', '#ff5a1f'], pose: 43 }) },
  { club: 2, ch: look({ name: 'Marina', s: '#fde0cc', h: [2, 2, 0, 5, 0], hc: ['#2f9fd8', '#7fe3e0'], e: 7, p: 2, ic: ['#2f9fd8', '#7fe3e0'], b: 2, m: 1, bl: 1, shirt: [7, '#ffffff', '#2f9fd8'], skirt: [3, '#2f9fd8', '#7fe3e0'], sock: [2, '#ffffff'], shoe: [4, '#1b4f8c'], headAcc: [2, '#7fe3e0', '#fff3c9'], tail: [6, '#2f9fd8'], pet: [3, '#ffb52e', '#ff7b2e'], pose: 3 }) },
  { club: 2, ch: look({ name: 'Onda', s: '#e8b48a', h: [0, 1, 0, 2, 1], hc: ['#1b4f8c', '#2f9fd8'], e: 1, p: 1, ic: ['#2f9fd8', '#7fe3e0'], b: 1, m: 2, shirt: [2, '#ff9f43'], pants: [1, '#2f9fd8'], shoe: [5, '#1b4f8c'], hat: [13, '#f1d38b', '#2f9fd8'], glasses: [3, '#1b4f8c'], propR: [8, '#2f9fd8', '#ffffff'], pose: 1 }) },
  { club: 3, ch: look({ name: 'Musgo', s: '#fde0cc', h: [5, 2, 0, 3, 0], hc: ['#4f9a3a', '#c8e86b'], e: 3, p: 1, ic: ['#3fa34d', '#c8e86b'], b: 2, m: 1, bl: 1, shirt: [9, '#3fa34d', '#8b5a2b'], skirt: [4, '#2f6b3a'], shoe: [5, '#8b5a2b'], headAcc: [8, '#ff8fb1'], wings: [3, '#c8e86b', '#3fa34d'], pose: 1 }) },
  { club: 3, ch: look({ name: 'Carvalho', s: '#b07a4f', h: [0, 5, 0, 7, 0], hc: ['#3a2415', '#6b4226'], e: 1, p: 1, ic: ['#3fa34d', '#8b5a2b'], b: 3, m: 1, shirt: [12, '#3d4a2a', '#f4e3b1'], sleeve: [3, '#f4e3b1'], pants: [3, '#6b4226'], shoe: [2, '#3a2415'], hat: [14, '#3d4a2a'], propR: [9, '#8b5a2b', '#6b4226'], pose: 0 }) },
  { club: 4, ch: look({ name: 'Nebulosa', s: '#fff0e6', h: [3, 5, 0, 11, 1], hc: ['#6b4cff', '#ff9df2'], e: 7, p: 3, ic: ['#6b4cff', '#ff9df2'], b: 2, m: 2, bl: 5, shirt: [6, '#1b1446', '#6b4cff'], sleeve: [5, '#1b1446'], cape: [2, '#6b4cff', '#ff9df2'], hat: [12, '#ffe66d'], effBack: [9, '#ffe66d', '#ff9df2'], shoe: [6, '#6b4cff'], pose: 41 }) },
  { club: 4, ch: look({ name: 'Órion', s: '#d19a6e', h: [0, 1, 0, 8, 0], hc: ['#1b1446', '#6b4cff'], e: 5, p: 1, ic: ['#ffe66d', '#ff9df2'], b: 1, m: 11, shirt: [14, '#e9e6ff', '#6b4cff'], sleeve: [6, '#e9e6ff', '#6b4cff'], pants: [3, '#e9e6ff'], shoe: [2, '#6b4cff'], glasses: [6, '#00e5ff', '#ff9df2'], pet: [4, '#6b4cff', '#ff9df2'], pose: 33 }) },
  { club: 5, ch: look({ name: 'Cupcake', s: '#fde0cc', h: [0, 8, 4, 6, 3], hc: ['#ff9fd0', '#9ee7ff'], e: 2, p: 4, ic: ['#ff4f8b', '#ffb3d1'], b: 1, m: 15, bl: 4, shirt: [13, '#ff8fc4', '#ffffff'], sleeve: [4, '#ff8fc4'], sock: [7, '#ffffff', '#9ee7ff'], shoe: [7, '#ffd1e6', '#ff8fc4'], hat: [7, '#ffffff', '#ffb3d1'], propR: [10, '#ff8fc4', '#9ee7ff'], pose: 46 }) },
  { club: 5, ch: look({ name: 'Algodão', s: '#fff0e6', h: [6, 3, 0, 7, 0], hc: ['#ffd1e6', '#9ee7ff'], e: 9, p: 1, ic: ['#9ee7ff', '#ffd1e6'], b: 2, m: 3, bl: 1, shirt: [5, '#9ee7ff', '#ffffff'], pants: [7, '#ffd1e6', '#ffffff'], shoe: [7, '#ffffff', '#ff8fc4'], hat: [15, '#ffd1e6', '#ff8fc4'], propL: [14, '#c58b5b', '#ffd1e6'], pose: 5 }) },
  { club: 6, ch: look({ name: 'Noturna', s: '#fff0e6', h: [1, 6, 0, 10, 0], hc: ['#241a2e', '#8e1b3a'], e: 5, p: 5, ic: ['#e0203f', '#ff4d6d'], b: 4, m: 8, shirt: [6, '#2b2233', '#8e1b3a'], sleeve: [5, '#2b2233'], sock: [5, '#120d17'], shoe: [6, '#120d17', '#8e1b3a'], neck: [4, '#120d17', '#e0203f'], wings: [2, '#2b2233', '#8e1b3a'], hat: [3, '#2b2233', '#8e1b3a'], pose: 9 }) },
  { club: 6, ch: look({ name: 'Corvo', s: '#f6c9a3', h: [0, 4, 0, 9, 0], hc: ['#120d17', '#3a2a44'], e: 8, p: 1, ic: ['#8e1b3a', '#3a2a44'], b: 3, m: 4, shirt: [4, '#d9d2e9', '#8e1b3a'], jacket: [3, '#2b2233', '#8e1b3a'], sleeve: [3, '#2b2233'], pants: [3, '#120d17'], shoe: [3, '#120d17'], glove: [2, '#120d17'], faceAcc: [3, '#120d17'], pet: [14, '#2b2233', '#8e1b3a'], pose: 9 }) },
  { club: 7, ch: look({ name: 'Pixel', s: '#fde0cc', h: [0, 3, 1, 4, 4], hc: ['#00e5ff', '#ff2bd6'], e: 5, p: 12, ic: ['#00e5ff', '#ff2bd6'], b: 1, m: 11, shirt: [8, '#141029', '#ff2bd6'], jacket: [5, '#ff2bd6', '#00e5ff'], sleeve: [3, '#ff2bd6'], skirt: [6, '#141029', '#00e5ff'], sock: [4, '#141029', '#00e5ff'], shoe: [3, '#141029', '#00e5ff'], hat: [10, '#141029', '#ff2bd6'], effBack: [6, '#00e5ff', '#ff2bd6'], pose: 45 }) },
  { club: 7, ch: look({ name: 'Volt', s: '#d19a6e', h: [0, 7, 0, 12, 0], hc: ['#faff00', '#00e5ff'], e: 5, p: 1, ic: ['#faff00', '#00e5ff'], b: 3, m: 11, shirt: [14, '#141029', '#faff00'], sleeve: [7, '#141029', '#faff00'], pants: [4, '#141029', '#00e5ff'], shoe: [1, '#faff00', '#141029'], glasses: [6, '#00e5ff', '#faff00'], effFront: [8, '#faff00', '#00e5ff'], pet: [7, '#cfd8e6', '#faff00'], pose: 40 }) },
  { club: 8, ch: look({ name: 'Sakura', s: '#fff0e6', h: [1, 2, 1, 1, 0], hc: ['#ffb7c9', '#ffffff'], e: 1, p: 1, ic: ['#d7263d', '#ffb7c9'], b: 2, m: 1, bl: 1, shirt: [9, '#ffb7c9', '#d7263d'], sleeve: [5, '#ffb7c9', '#ffffff'], skirt: [4, '#ffb7c9', '#d7263d'], shoe: [5, '#5a1a2b'], headAcc: [2, '#ffffff', '#ffd166'], propR: [12, '#d7263d', '#ffd166'], effBack: [7, '#ffb7c9', '#ffffff'], pose: 5 }) },
  { club: 8, ch: look({ name: 'Kitsune', s: '#fde0cc', h: [2, 3, 0, 2, 0], hc: ['#ffffff', '#ffb7c9'], e: 5, p: 5, ic: ['#d7263d', '#ffd166'], b: 2, m: 3, fm: [6, '#d7263d'], shirt: [9, '#ffffff', '#d7263d'], sleeve: [5, '#ffffff', '#d7263d'], pants: [4, '#d7263d'], shoe: [5, '#5a1a2b'], hat: [6, '#ffffff', '#ffb7c9'], tail: [2, '#ffffff', '#ffb7c9'], pet: [2, '#ffffff', '#d7263d'], pose: 42 }) },
  { club: 0, ch: MAIN_CHARS()[0] },
  { club: 0, ch: MAIN_CHARS()[1] },
  { club: 9, ch: DEFAULT_GIRL() },
  { club: 9, ch: DEFAULT_BOY() },
];

/* Presets de expressão (aba Cabeça > Expressões) */
const EXPRESSIONS = [
  { n: 'Normal', e: 1, b: 1, m: 1 },
  { n: 'Feliz', e: 9, b: 1, m: 2, bl: 1 },
  { n: 'Radiante', e: 9, b: 6, m: 12, bl: 5 },
  { n: 'Bravo', e: 5, b: 4, m: 14 },
  { n: 'Triste', e: 1, b: 5, m: 6 },
  { n: 'Chorando', e: 12, b: 5, m: 9 },
  { n: '> <', e: 11, b: 5, m: 15, bl: 3 },
  { n: 'Com sono', e: 4, b: 1, m: 4 },
  { n: 'Tédio', e: 8, b: 1, m: 4 },
  { n: 'Surpreso', e: 14, b: 6, m: 5 },
  { n: 'Piscadinha', e: 1, eR: 13, b: 1, m: 7 },
  { n: 'Apaixonado', e: 7, p: 4, b: 1, m: 3, bl: 4 },
  { n: 'Tonto', e: 1, p: 7, b: 5, m: 10 },
  { n: 'Convencido', e: 5, b: 6, m: 11 },
  { n: 'Assustado', e: 14, p: 11, b: 5, m: 9 },
  { n: 'Fofo', e: 9, b: 1, m: 3, bl: 1 },
];

const EMOTES = ['', '❤️', '‼️', '❓', '💢', '💧', '🎵', '💤', '✨', '💡', '💬', '⭐'];
const BUBBLES = ['Redondo', 'Pensamento', 'Grito', 'Sussurro'];
const FONTS = [
  { n: 'Padrão', f: "'Fredoka', system-ui, sans-serif" },
  { n: 'Condensada', f: "'Barlow Condensed', system-ui, sans-serif" },
  { n: 'Manuscrita', f: "'Comic Sans MS', 'Comic Neue', cursive" },
  { n: 'Serifada', f: "Georgia, 'Times New Roman', serif" },
  { n: 'Máquina', f: "'Courier New', monospace" },
];
const TITLES = ['— sem título —', '✦ Estrela Guia ✦', 'DJ do Clube', 'Doce de Coco', 'Coração de Dragão', 'Guardiã da Floresta', 'Rato de Biblioteca', 'Filha da Lua', 'Amigo de Todos', 'Lenda do Ateliê', 'Estilista Novato', 'Mestre da Moda'];
