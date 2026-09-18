/* ============ DADOS DO JOGO: raridades, temas, slots, itens, banners ============ */

const RARITIES = [
  { id: 0, key: 'C', name: 'Comum',    color: '#a9b3c4', weight: 55,  pts: 1,  dust: 5,   craft: 40 },
  { id: 1, key: 'R', name: 'Raro',     color: '#4fa8ff', weight: 30,  pts: 3,  dust: 15,  craft: 120 },
  { id: 2, key: 'E', name: 'Épico',    color: '#b56cff', weight: 12,  pts: 8,  dust: 40,  craft: 400 },
  { id: 3, key: 'L', name: 'Lendário', color: '#ffc93c', weight: 2.4, pts: 20, dust: 120, craft: 1500 },
  { id: 4, key: 'M', name: 'Mítico',   color: '#ff5fa2', weight: 0.6, pts: 50, dust: 300, craft: 0 },
];

const GACHA_RULES = {
  costGems: 100,       // custo por invocação
  softPity: 50,        // a partir daqui a chance de Lendário+ sobe
  hardPity: 70,        // Lendário+ garantido
  softStep: 6,         // +% por invocação após soft pity
  epicEvery: 10,       // Épico+ garantido a cada 10
  mythicShare: 0.2,    // 20% dos Lendário+ viram Mítico
  featuredShare: 0.5,  // 50/50 do banner em destaque
  wishShare: 0.4,      // chance do Desejo quando a raridade bate
  maxStars: 5,
};

const THEMES = {
  base:     { name: 'Básico',            icon: '⚪', c: { a: '#8a94a6', b: '#4b5563', c: '#e5e7eb', d: '#1f2937', e: '#ffffff' } },
  floresta: { name: 'Floresta Encantada', icon: '🌿', c: { a: '#3fa34d', b: '#8b5a2b', c: '#c8e86b', d: '#1f4d2b', e: '#f4e3b1' } },
  oceano:   { name: 'Maré Azul',          icon: '🌊', c: { a: '#2f9fd8', b: '#1b4f8c', c: '#7fe3e0', d: '#0e2a4a', e: '#fff3c9' } },
  cosmos:   { name: 'Poeira Cósmica',     icon: '🌌', c: { a: '#6b4cff', b: '#1b1446', c: '#ff9df2', d: '#0b0822', e: '#ffffff' } },
  doce:     { name: 'Confeitaria',        icon: '🍭', c: { a: '#ff8fc4', b: '#ffd1e6', c: '#9ee7ff', d: '#b0457a', e: '#fff7d6' } },
  sombra:   { name: 'Noite Gótica',       icon: '🦇', c: { a: '#2b2233', b: '#8e1b3a', c: '#d9d2e9', d: '#120d17', e: '#ff4d6d' } },
  neon:     { name: 'Neon City',          icon: '⚡', c: { a: '#00e5ff', b: '#ff2bd6', c: '#faff00', d: '#141029', e: '#ffffff' } },
  sakura:   { name: 'Festival Sakura',    icon: '🌸', c: { a: '#ffb7c9', b: '#d7263d', c: '#ffffff', d: '#5a1a2b', e: '#ffd166' } },
  fogo:     { name: 'Coração de Dragão',  icon: '🔥', c: { a: '#ff5a1f', b: '#8a1c0e', c: '#ffd23f', d: '#2a0a05', e: '#ffe9b0' } },
};
const THEME_KEYS = Object.keys(THEMES).filter(k => k !== 'base');

const SLOTS = {
  hair:    { name: 'Cabelo',  icon: '💇', kind: 'char' },
  eyes:    { name: 'Olhos',   icon: '👀', kind: 'char' },
  outfit:  { name: 'Roupa',   icon: '👗', kind: 'char' },
  hat:     { name: 'Cabeça',  icon: '👒', kind: 'char' },
  face:    { name: 'Rosto',   icon: '🕶️', kind: 'char' },
  aura:    { name: 'Aura',    icon: '✨', kind: 'char' },
  pet:     { name: 'Mascote', icon: '🐾', kind: 'char' },
  bg:      { name: 'Fundo',   icon: '🏞️', kind: 'scene' },
  prop:    { name: 'Objeto',  icon: '🪴', kind: 'scene' },
  weather: { name: 'Clima',   icon: '🌦️', kind: 'scene' },
};
const CHAR_SLOTS = ['hair', 'eyes', 'outfit', 'hat', 'face', 'aura', 'pet'];

// Personalização livre (não gacha)
const SKINS = ['#ffe0c7', '#f6c9a3', '#e0a878', '#b97a4f', '#8a5634', '#5b3522', '#cfe8ff', '#d9ffd6'];
const MOUTHS = { smile: 'Sorriso', open: 'Alegre', cat: 'Gatinho', flat: 'Sério', tongue: 'Língua', o: 'Surpresa' };

/* Itens: [id, slot, tema, raridade, nome, template, cores?]
   Para objetos (prop) o template é o emoji. */
const ITEM_TABLE = [
  // ---------- Básico (Comuns) ----------
  ['h_cast', 'hair', 'base', 0, 'Chanel Castanho', 'bob', { a: '#6b4226' }],
  ['h_preto', 'hair', 'base', 0, 'Liso Noturno', 'long', { a: '#26222b' }],
  ['h_loiro', 'hair', 'base', 0, 'Rabo Dourado', 'pony', { a: '#f2c94c' }],
  ['h_ruivo', 'hair', 'base', 0, 'Espetado Ruivo', 'spiky', { a: '#c8502a' }],
  ['h_cacho', 'hair', 'base', 0, 'Cachinhos', 'curly', { a: '#4a2c1a' }],
  ['e_basic', 'eyes', 'base', 0, 'Olhos Curiosos', 'round', { a: '#6b4226' }],
  ['e_happy', 'eyes', 'base', 0, 'Olhos Sorridentes', 'happy', {}],
  ['e_sleepy', 'eyes', 'base', 0, 'Olhos Sonolentos', 'sleepy', { a: '#3b6ea5' }],
  ['o_tee', 'outfit', 'base', 0, 'Camiseta Básica', 'tee', { a: '#f4f4f4', b: '#3b5b92', c: '#cfd6e4' }],
  ['o_listra', 'outfit', 'base', 0, 'Listrada', 'tee', { a: '#f4f4f4', b: '#2a363b', c: '#e84a5f', p: 'stripes' }],
  ['o_moletom', 'outfit', 'base', 0, 'Moletom Cinza', 'hoodie', { a: '#9aa3ad', b: '#4b5563', c: '#e5e7eb' }],
  ['o_jardin', 'outfit', 'base', 0, 'Jardineira', 'overall', { a: '#4a78c2', b: '#f7e27c', c: '#f7e27c' }],
  ['t_bone', 'hat', 'base', 0, 'Boné Vermelho', 'cap', { a: '#d64545', b: '#ffffff' }],
  ['t_laco', 'hat', 'base', 0, 'Laço Simples', 'bow', { a: '#ff6b8b' }],
  ['f_oculos', 'face', 'base', 0, 'Óculos Redondos', 'glasses', { a: '#3a3a3a' }],
  ['f_curativo', 'face', 'base', 0, 'Curativo', 'bandaid', {}],
  ['b_quarto', 'bg', 'base', 0, 'Quarto Aconchegante', 'room', { a: '#f3d9b1', b: '#c58b5b', c: '#8fd3ff' }],
  ['b_campo', 'bg', 'base', 0, 'Campo Aberto', 'hills', { a: '#8fd3ff', b: '#7cc36a', c: '#5aa24c' }],
  ['p_vaso', 'prop', 'base', 0, 'Vaso de Planta', '🪴'],
  ['p_cadeira', 'prop', 'base', 0, 'Cadeira', '🪑'],
  ['p_flor', 'prop', 'base', 0, 'Margarida', '🌼'],
  ['p_pedra', 'prop', 'base', 0, 'Pedra', '🪨'],
  ['p_balao', 'prop', 'base', 0, 'Balão', '🎈'],
  ['p_nuvem', 'prop', 'base', 0, 'Nuvem', '☁️'],
  ['p_livros', 'prop', 'base', 0, 'Livros', '📚'],
  ['p_sofa', 'prop', 'base', 0, 'Sofá', '🛋️'],
  ['w_folhas', 'weather', 'base', 0, 'Brisa de Folhas', 'leaves', { a: '#9bd46a' }],

  // ---------- Floresta Encantada ----------
  ['h_musgo', 'hair', 'floresta', 2, 'Tranças de Musgo', 'twintails', { a: '#4f9a3a', b: '#c8e86b' }],
  ['e_folha', 'eyes', 'floresta', 1, 'Olhos de Folha', 'round', { a: '#3fa34d' }],
  ['o_druida', 'outfit', 'floresta', 2, 'Túnica do Druida', 'tunic', {}],
  ['o_explor', 'outfit', 'floresta', 1, 'Colete Explorador', 'vest', { a: '#8b5a2b', b: '#3d4a2a', c: '#f4e3b1' }],
  ['t_flores', 'hat', 'floresta', 1, 'Coroa de Flores', 'flowercrown', {}],
  ['f_folha', 'face', 'floresta', 1, 'Pintura de Folha', 'facepaint', {}],
  ['a_vagalume', 'aura', 'floresta', 3, 'Vaga-lumes Dançantes', 'fireflies', { a: '#e9ff70' }],
  ['pt_raposa', 'pet', 'floresta', 2, 'Raposa Musgo', 'fox', { a: '#e0823a', b: '#3fa34d' }],
  ['b_bosque', 'bg', 'floresta', 3, 'Bosque Encantado', 'forest', {}],
  ['p_carvalho', 'prop', 'floresta', 1, 'Carvalho', '🌳'],
  ['p_cogumelo', 'prop', 'floresta', 1, 'Cogumelo', '🍄'],
  ['p_cervo', 'prop', 'floresta', 2, 'Cervo Sagrado', '🦌'],
  ['w_vagalume', 'weather', 'floresta', 2, 'Noite de Vaga-lumes', 'fireflies', { a: '#e9ff70' }],

  // ---------- Maré Azul ----------
  ['h_ondas', 'hair', 'oceano', 2, 'Ondas do Mar', 'long', { a: '#2f9fd8', c: '#7fe3e0', fx: 'grad' }],
  ['e_perola', 'eyes', 'oceano', 1, 'Olhos de Pérola', 'sparkle', { a: '#2f9fd8' }],
  ['o_sereia', 'outfit', 'oceano', 2, 'Vestido de Sereia', 'dress', { a: '#2f9fd8', b: '#7fe3e0', c: '#fff3c9' }],
  ['o_havai', 'outfit', 'oceano', 1, 'Camisa Havaiana', 'tee', { a: '#ff9f43', b: '#1b4f8c', c: '#fff3c9', p: 'dots' }],
  ['t_palha', 'hat', 'oceano', 1, 'Chapéu de Palha', 'straw', { a: '#f1d38b', b: '#2f9fd8' }],
  ['f_mergulho', 'face', 'oceano', 1, 'Óculos de Mergulho', 'goggles', {}],
  ['a_bolhas', 'aura', 'oceano', 3, 'Bolhas Mágicas', 'bubbles', {}],
  ['pt_peixe', 'pet', 'oceano', 2, 'Peixinho Dourado', 'fish', { a: '#ffb52e', b: '#ff7b2e' }],
  ['b_praia', 'bg', 'oceano', 3, 'Praia Tropical', 'beach', {}],
  ['p_concha', 'prop', 'oceano', 1, 'Concha', '🐚'],
  ['p_veleiro', 'prop', 'oceano', 1, 'Veleiro', '⛵'],
  ['p_golfinho', 'prop', 'oceano', 2, 'Golfinho', '🐬'],
  ['w_chuva', 'weather', 'oceano', 2, 'Chuva de Verão', 'rain', { a: '#bfe9ff' }],
  ['b_palacio', 'bg', 'oceano', 4, 'Palácio Submerso', 'underwater', {}],

  // ---------- Poeira Cósmica ----------
  ['h_nebulosa', 'hair', 'cosmos', 2, 'Nebulosa', 'long', { a: '#6b4cff', c: '#ff9df2', fx: 'grad' }],
  ['e_estrela', 'eyes', 'cosmos', 1, 'Olhos Estelares', 'star', { a: '#6b4cff', b: '#ffe66d' }],
  ['o_galaxia', 'outfit', 'cosmos', 2, 'Manto Galáctico', 'cloak', {}],
  ['o_astro', 'outfit', 'cosmos', 1, 'Jaqueta Espacial', 'hoodie', { a: '#e9e6ff', b: '#1b1446', c: '#6b4cff' }],
  ['t_aureola', 'hat', 'cosmos', 1, 'Auréola Lunar', 'halo', { a: '#ffe66d' }],
  ['f_estrela', 'face', 'cosmos', 1, 'Marcas Estelares', 'starmark', { a: '#ffe66d' }],
  ['a_anel', 'aura', 'cosmos', 3, 'Anel Planetário', 'ring', {}],
  ['pt_slime', 'pet', 'cosmos', 3, 'Slime Cósmico', 'slime', {}],
  ['b_estrelas', 'bg', 'cosmos', 3, 'Mar de Estrelas', 'space', {}],
  ['p_planeta', 'prop', 'cosmos', 1, 'Planeta', '🪐'],
  ['p_foguete', 'prop', 'cosmos', 1, 'Foguete', '🚀'],
  ['p_lua', 'prop', 'cosmos', 2, 'Lua Crescente', '🌙'],
  ['w_meteoro', 'weather', 'cosmos', 2, 'Estrelas Cadentes', 'meteors', {}],
  ['a_asas', 'aura', 'cosmos', 4, 'Asas Celestiais', 'angelwings', {}],

  // ---------- Confeitaria ----------
  ['h_algodao', 'hair', 'doce', 2, 'Coques de Algodão-doce', 'buns', { a: '#ff9fd0', c: '#9ee7ff', fx: 'grad' }],
  ['e_coracao', 'eyes', 'doce', 1, 'Olhos de Coração', 'heart', { a: '#ff4f8b' }],
  ['o_cupcake', 'outfit', 'doce', 2, 'Vestido Cupcake', 'dress', { a: '#ff8fc4', b: '#fff7d6', c: '#9ee7ff' }],
  ['o_avental', 'outfit', 'doce', 1, 'Avental Doceiro', 'overall', { a: '#ffd1e6', b: '#9ee7ff', c: '#ff8fc4' }],
  ['t_coelho', 'hat', 'doce', 1, 'Orelhas de Coelho', 'bunnyears', { a: '#ffffff', b: '#ffb3d1' }],
  ['f_bochecha', 'face', 'doce', 1, 'Bochechas Brilhantes', 'blush', {}],
  ['a_arcoiris', 'aura', 'doce', 3, 'Arco-íris Doce', 'rainbow', {}],
  ['pt_coelho', 'pet', 'doce', 2, 'Coelhinho Marshmallow', 'bunny', { a: '#fff6fb', b: '#ffb3d1' }],
  ['b_doces', 'bg', 'doce', 3, 'Reino dos Doces', 'candy', {}],
  ['p_cupcake', 'prop', 'doce', 1, 'Cupcake', '🧁'],
  ['p_pirulito', 'prop', 'doce', 1, 'Pirulito', '🍭'],
  ['p_bolo', 'prop', 'doce', 2, 'Bolo Real', '🎂'],
  ['w_confete', 'weather', 'doce', 2, 'Chuva de Confete', 'confetti', {}],

  // ---------- Noite Gótica ----------
  ['h_veu', 'hair', 'sombra', 2, 'Véu da Meia-noite', 'long', { a: '#241a2e', c: '#8e1b3a', fx: 'grad' }],
  ['e_carmesim', 'eyes', 'sombra', 1, 'Olhos Carmesim', 'cat', { a: '#e0203f' }],
  ['o_gotico', 'outfit', 'sombra', 2, 'Vestido Gótico', 'dress', { a: '#2b2233', b: '#8e1b3a', c: '#d9d2e9' }],
  ['o_vitoriano', 'outfit', 'sombra', 1, 'Casaco Vitoriano', 'suit', { a: '#3a2a44', b: '#8e1b3a', c: '#d9d2e9' }],
  ['t_bruxa', 'hat', 'sombra', 1, 'Chapéu de Bruxa', 'witch', { a: '#2b2233', b: '#8e1b3a' }],
  ['f_tapaolho', 'face', 'sombra', 1, 'Tapa-olho', 'eyepatch', {}],
  ['a_morcego', 'aura', 'sombra', 3, 'Asas de Morcego', 'batwings', {}],
  ['pt_fantasma', 'pet', 'sombra', 2, 'Fantasminha', 'ghost', {}],
  ['b_castelo', 'bg', 'sombra', 3, 'Castelo Assombrado', 'castle', {}],
  ['p_rosa', 'prop', 'sombra', 1, 'Rosa Murcha', '🥀'],
  ['p_vela', 'prop', 'sombra', 1, 'Vela', '🕯️'],
  ['p_morcego', 'prop', 'sombra', 2, 'Morcego', '🦇'],
  ['w_nevoa', 'weather', 'sombra', 2, 'Névoa Sombria', 'fog', {}],

  // ---------- Neon City ----------
  ['h_moicano', 'hair', 'neon', 2, 'Moicano Neon', 'spiky', { a: '#00e5ff', c: '#ff2bd6', fx: 'grad' }],
  ['e_led', 'eyes', 'neon', 1, 'Olhos LED', 'glow', { a: '#00e5ff' }],
  ['o_cyber', 'outfit', 'neon', 2, 'Jaqueta Cyber', 'jacket', {}],
  ['o_glitch', 'outfit', 'neon', 1, 'Camiseta Glitch', 'tee', { a: '#141029', b: '#2d2a4a', c: '#ff2bd6', p: 'stripes' }],
  ['t_fones', 'hat', 'neon', 1, 'Fones Neon', 'headphones', {}],
  ['f_visor', 'face', 'neon', 1, 'Visor Holográfico', 'visor', {}],
  ['a_circuito', 'aura', 'neon', 3, 'Circuito Pulsante', 'circuit', {}],
  ['pt_robo', 'pet', 'neon', 2, 'Robozinho', 'robot', {}],
  ['b_cidade', 'bg', 'neon', 3, 'Metrópole Neon', 'city', {}],
  ['p_fones', 'prop', 'neon', 1, 'Headphone', '🎧'],
  ['p_moto', 'prop', 'neon', 1, 'Moto', '🏍️'],
  ['p_fliper', 'prop', 'neon', 2, 'Fliperama', '🕹️'],
  ['w_neon', 'weather', 'neon', 2, 'Chuva Neon', 'rain', { a: '#ff2bd6' }],

  // ---------- Festival Sakura ----------
  ['h_florido', 'hair', 'sakura', 2, 'Rabo Florido', 'pony', { a: '#ffb7c9', c: '#ffffff', fx: 'grad' }],
  ['e_petala', 'eyes', 'sakura', 1, 'Olhos de Pétala', 'sparkle', { a: '#d7263d' }],
  ['o_kimono', 'outfit', 'sakura', 2, 'Kimono Sakura', 'kimono', {}],
  ['o_yukata', 'outfit', 'sakura', 1, 'Yukata Festiva', 'kimono', { a: '#3b5ba5', b: '#ffd166', c: '#ffffff' }],
  ['t_kitsune', 'hat', 'sakura', 1, 'Máscara Kitsune', 'kitsune', {}],
  ['f_festa', 'face', 'sakura', 1, 'Pintura Festiva', 'facepaint', { a: '#d7263d' }],
  ['a_petalas', 'aura', 'sakura', 3, 'Tempestade de Pétalas', 'petals', {}],
  ['pt_gato', 'pet', 'sakura', 2, 'Gatinho da Sorte', 'cat', {}],
  ['b_templo', 'bg', 'sakura', 3, 'Templo Sakura', 'temple', {}],
  ['p_lanterna', 'prop', 'sakura', 1, 'Lanterna', '🏮'],
  ['p_cerejeira', 'prop', 'sakura', 1, 'Flor de Cerejeira', '🌸'],
  ['p_torii', 'prop', 'sakura', 2, 'Portal Torii', '⛩️'],
  ['w_petalas', 'weather', 'sakura', 2, 'Pétalas ao Vento', 'petals', {}],
  ['t_coroa', 'hat', 'sakura', 4, 'Coroa da Imperatriz', 'crown', {}],

  // ---------- Coração de Dragão ----------
  ['h_juba', 'hair', 'fogo', 2, 'Juba Flamejante', 'spiky', { a: '#ff5a1f', c: '#ffd23f', fx: 'grad' }],
  ['e_dragao', 'eyes', 'fogo', 1, 'Olhos de Dragão', 'cat', { a: '#ffb300' }],
  ['o_armadura', 'outfit', 'fogo', 2, 'Armadura Rubra', 'armor', {}],
  ['o_guerreiro', 'outfit', 'fogo', 1, 'Túnica de Guerreiro', 'tunic', { a: '#8a1c0e', b: '#3a2415', c: '#ffd23f' }],
  ['t_chifres', 'hat', 'fogo', 1, 'Chifres de Dragão', 'horns', {}],
  ['f_escamas', 'face', 'fogo', 1, 'Escamas', 'scales', {}],
  ['a_chamas', 'aura', 'fogo', 3, 'Chamas Eternas', 'flames', {}],
  ['pt_dragao', 'pet', 'fogo', 3, 'Dragãozinho', 'dragon', {}],
  ['b_vulcao', 'bg', 'fogo', 3, 'Vulcão Ardente', 'volcano', {}],
  ['p_fogueira', 'prop', 'fogo', 1, 'Fogueira', '🔥'],
  ['p_vulcao', 'prop', 'fogo', 1, 'Mini Vulcão', '🌋'],
  ['p_dragao', 'prop', 'fogo', 2, 'Estátua de Dragão', '🐉'],
  ['w_brasas', 'weather', 'fogo', 2, 'Brasas', 'embers', {}],
  ['pt_fenix', 'pet', 'fogo', 4, 'Fênix Solar', 'phoenix', {}],
];

const ITEMS = {};
const ITEM_LIST = [];
ITEM_TABLE.forEach(([id, slot, theme, rarity, name, tpl, col]) => {
  const colors = Object.assign({}, THEMES[theme].c, col || {});
  const it = { id, slot, theme, rarity, name, tpl, colors, kind: SLOTS[slot].kind };
  ITEMS[id] = it;
  ITEM_LIST.push(it);
});

const STARTER_ITEMS = ['h_cast', 'e_basic', 'o_tee', 'b_campo', 'p_vaso', 'p_flor'];

/* Banners */
const BANNERS = [
  { id: 'std',   name: 'Estrelas Eternas', kind: 'char',  desc: 'Visuais para personagens. Escolha um Desejo para aumentar suas chances!', wish: true, free: true },
  { id: 'feat',  name: 'Destaque',          kind: 'all',   desc: 'Itens do tema em destaque têm 50% de chance garantida. Muda a cada 2 dias!', featured: true },
  { id: 'world', name: 'Mundos Oníricos',   kind: 'scene', desc: 'Fundos, objetos e climas para seus cenários.' },
];

const MISSIONS = [
  { id: 'pull',    name: 'Invoque 10 vezes',            goal: 10, reward: { gems: 120 } },
  { id: 'char',    name: 'Salve um personagem',         goal: 1,  reward: { gems: 50, coins: 500 } },
  { id: 'scene',   name: 'Salve um cenário',            goal: 1,  reward: { gems: 50 } },
  { id: 'collect', name: 'Colete a exposição',          goal: 1,  reward: { gems: 40, coins: 300 } },
  { id: 'contest', name: 'Participe do desfile',        goal: 1,  reward: { gems: 60 } },
  { id: 'craft',   name: 'Use poeira estelar ou a loja', goal: 1, reward: { coins: 800 } },
];
const MISSION_BONUS = { tickets: 1, gems: 100 };

const LOGIN_REWARDS = [
  { gems: 200 }, { coins: 2000 }, { tickets: 1 }, { gems: 300 },
  { dust: 200 }, { tickets: 2 }, { gems: 600, tickets: 1 },
];

const ALBUM_MILESTONES = [
  { pct: 10,  reward: { gems: 300 } },
  { pct: 25,  reward: { gems: 600, tickets: 2 } },
  { pct: 50,  reward: { gems: 1000, tickets: 3 } },
  { pct: 75,  reward: { gems: 1500, tickets: 5 } },
  { pct: 100, reward: { gems: 3000, tickets: 10 } },
];
const THEME_COMPLETE_REWARD = { gems: 500, tickets: 2 };

const SHOP = [
  { id: 'ticket', name: 'Bilhete de Invocação', icon: '🎟️', give: { tickets: 1 }, cost: { coins: 1500 }, limit: 5 },
  { id: 'gems',   name: '100 Gemas',            icon: '💎', give: { gems: 100 },  cost: { coins: 2500 }, limit: 3 },
  { id: 'dust',   name: '50 Poeira Estelar',    icon: '✨', give: { dust: 50 },   cost: { coins: 2000 }, limit: 3 },
  { id: 'coins',  name: '3000 Moedas',          icon: '🪙', give: { coins: 3000 }, cost: { dust: 150 }, limit: 2 },
];

const RIVAL_NAMES = ['Lumi', 'Kaito', 'Mirela', 'Zeca', 'Aurora', 'Nox', 'Pipoca', 'Yuki', 'Bento', 'Solara', 'Tatá', 'Orion', 'Vivi', 'Rubi'];

const CURRENCY = {
  gems:    { icon: '💎', name: 'Gemas' },
  tickets: { icon: '🎟️', name: 'Bilhetes' },
  coins:   { icon: '🪙', name: 'Moedas' },
  dust:    { icon: '✨', name: 'Poeira' },
};
