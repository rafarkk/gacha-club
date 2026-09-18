/* ============ POSES ============
   a: [ombroE, cotoveloE, ombroD, cotoveloD]  l: [quadrilE, joelhoE, quadrilD, joelhoD]
   Ângulos em graus; positivo = para fora do corpo (espelhado automaticamente no lado direito).
   t: inclinação do tronco · h: inclinação da cabeça · y: deslocamento vertical · r: rotação do corpo
   ls: encurtamento [coxaE, canelaE, coxaD, canelaD] (perspectiva) · hd: mãos [E, D] (opcional) */

const POSES = [
  // ---------- Em pé ----------
  { n: 'Em pé', c: 'Em pé', a: [10, 0, 10, 0], l: [3, 0, 3, 0] },
  { n: 'Relaxado', c: 'Em pé', a: [6, -10, 14, 6], l: [6, -2, 1, 0], t: -2, h: 4 },
  { n: 'Mãos na cintura', c: 'Em pé', a: [40, -64, 40, -64], l: [7, 0, 7, 0], hd: [1, 1] },
  { n: 'Acenando', c: 'Em pé', a: [10, 0, 112, 40], l: [3, 0, 3, 0], h: -5, hd: [0, 4] },
  { n: 'Viva!', c: 'Em pé', a: [122, 12, 122, 12], l: [8, 0, 8, 0], hd: [4, 4] },
  { n: 'Tímido', c: 'Em pé', a: [-6, -40, -6, -40], l: [-2, 4, -2, 4], h: 8, t: 2 },
  { n: 'Pensando', c: 'Em pé', a: [18, -130, -12, -40], l: [4, 0, 2, 0], h: -8, hd: [2, 1] },
  { n: 'Apontando', c: 'Em pé', a: [10, 0, 95, 0], l: [5, 0, 3, 0], hd: [0, 2] },
  { n: 'Paz e amor', c: 'Em pé', a: [10, 0, 108, 32], l: [4, 0, 6, 0], h: -6, hd: [0, 3] },
  { n: 'Braços cruzados', c: 'Em pé', a: [-4, -118, -4, -104], l: [5, 0, 5, 0], hd: [1, 1] },
  { n: 'Sorriso tímido', c: 'Em pé', a: [4, -30, 4, -30], l: [10, -14, 2, 0], h: 6 },
  { n: 'Espreguiçando', c: 'Em pé', a: [124, 8, 124, 8], l: [4, 0, 4, 0], h: 0, hd: [1, 1] },
  // ---------- Andando ----------
  { n: 'Andando 1', c: 'Andando', a: [-8, -14, 22, -6], l: [14, -8, -8, 6], t: 1 },
  { n: 'Andando 2', c: 'Andando', a: [22, -6, -8, -14], l: [-8, 6, 14, -8], t: -1 },
  { n: 'Passeando', c: 'Andando', a: [8, -24, 24, -10], l: [10, -4, -4, 8], h: 3 },
  // ---------- Correndo ----------
  { n: 'Correndo 1', c: 'Correndo', a: [40, -80, -20, -60], l: [30, -40, -18, 30], t: 4, y: -6 },
  { n: 'Correndo 2', c: 'Correndo', a: [-20, -60, 40, -80], l: [-18, 30, 30, -40], t: -4, y: -6 },
  { n: 'Disparada', c: 'Correndo', a: [60, -50, 60, -50], l: [40, -50, -30, 20], t: 8, y: -10, h: 4 },
  // ---------- Agachado ----------
  { n: 'Agachado', c: 'Agachado', a: [30, -80, 30, -80], l: [40, -70, 40, -70], ls: [.7, .8, .7, .8], y: 26 },
  { n: 'De cócoras', c: 'Agachado', a: [20, -110, 20, -110], l: [52, -100, 52, -100], ls: [.55, .7, .55, .7], y: 38, hd: [1, 1] },
  { n: 'Ajoelhado', c: 'Agachado', a: [14, -30, 14, -30], l: [6, 0, 6, 0], ls: [1, .25, 1, .25], y: 32 },
  { n: 'Um joelho', c: 'Agachado', a: [26, -60, 12, -10], l: [30, -70, 4, 0], ls: [.8, .9, 1, .3], y: 22 },
  // ---------- Sentado ----------
  { n: 'Sentado no chão', c: 'Sentado', a: [26, -10, 26, -10], l: [40, 30, 40, 30], ls: [.3, .8, .3, .8], y: 34 },
  { n: 'Pernas cruzadas', c: 'Sentado', a: [30, -70, 30, -70], l: [70, -120, 70, -120], ls: [.35, .6, .35, .6], y: 50 },
  { n: 'Sentado na cadeira', c: 'Sentado', a: [20, -50, 20, -50], l: [4, 0, 4, 0], ls: [.3, 1, .3, 1], y: 30 },
  { n: 'Abraçando joelhos', c: 'Sentado', a: [-10, -60, -10, -60], l: [18, -30, 18, -30], ls: [.3, .5, .3, .5], y: 46, h: 8 },
  { n: 'Balançando pés', c: 'Sentado', a: [30, -20, 30, -20], l: [8, 16, 0, -12], ls: [.3, 1, .3, 1], y: 30, h: -4 },
  // ---------- Deitado ----------
  { n: 'Dormindo', c: 'Deitado', a: [10, 0, 30, -20], l: [3, 0, 8, -6], r: -90, y: 100, x: 46 },
  { n: 'Deitado de bruços', c: 'Deitado', a: [120, 60, 120, 60], l: [6, 20, 6, 30], r: 90, y: 100, x: -46 },
  { n: 'Esparramado', c: 'Deitado', a: [90, 0, 90, 0], l: [30, 0, 30, 0], r: -90, y: 100, x: 46 },
  // ---------- Pulando / Voando ----------
  { n: 'Pulando', c: 'Pulando', a: [118, 20, 118, 20], l: [26, -50, 26, -50], y: -30, hd: [4, 4] },
  { n: 'Estrela', c: 'Pulando', a: [120, 0, 120, 0], l: [34, 0, 34, 0], y: -26, hd: [4, 4] },
  { n: 'Voando', c: 'Pulando', a: [60, 0, 60, 0], l: [8, 16, -6, 28], y: -40, t: 6, h: -4 },
  { n: 'Super-herói', c: 'Pulando', a: [124, 0, 20, -10], l: [4, 0, 14, -30], y: -36, hd: [1, 1] },
  // ---------- Caindo ----------
  { n: 'Tropeçando', c: 'Caindo', a: [112, -20, 96, 30], l: [30, -20, -20, 50], t: 18, h: 14, y: -10 },
  { n: 'Caindo', c: 'Caindo', a: [120, 30, 120, 30], l: [40, 30, 40, 30], r: 160, y: -60, hd: [4, 4] },
  // ---------- Combate ----------
  { n: 'Guarda', c: 'Combate', a: [40, -130, 30, -120], l: [18, -4, 14, -4], hd: [1, 1], y: 4 },
  { n: 'Golpe', c: 'Combate', a: [30, -120, 90, 0], l: [22, -10, 10, 0], t: -6, hd: [1, 1] },
  { n: 'Espadachim', c: 'Combate', a: [30, -80, 60, -20], l: [24, -8, 12, 0], t: -4, y: 6, hd: [1, 1] },
  { n: 'Chute', c: 'Combate', a: [60, -40, 50, -30], l: [4, 0, 80, 0], t: 10, hd: [1, 1] },
  { n: 'Magia', c: 'Combate', a: [70, 20, 70, 20], l: [10, 0, 10, 0], h: -4, hd: [4, 4] },
  // ---------- Dança ----------
  { n: 'Dança 1', c: 'Dança', a: [120, 20, 30, -70], l: [20, -30, 4, 0], t: 6, h: 6, hd: [3, 1] },
  { n: 'Dança 2', c: 'Dança', a: [30, -70, 120, 20], l: [4, 0, 20, -30], t: -6, h: -6, hd: [1, 3] },
  { n: 'Disco', c: 'Dança', a: [10, 0, 126, 0], l: [16, -20, 4, 0], t: -6, hd: [0, 2] },
  { n: 'Bailarina', c: 'Dança', a: [118, -30, 118, -30], l: [2, 0, 50, -90], ls: [1, 1, .8, .8], h: -6 },
  { n: 'Ídolo', c: 'Dança', a: [20, -120, 110, 50], l: [14, -20, 4, 0], h: -8, hd: [1, 3] },
  // ---------- Extra ----------
  { n: 'Coração', c: 'Extra', a: [8, -118, 8, -118], l: [4, 0, 4, 0], hd: [1, 1] },
  { n: 'Chorando', c: 'Extra', a: [50, -140, 50, -140], l: [2, 4, 2, 4], h: 10, hd: [1, 1] },
  { n: 'Surpreso', c: 'Extra', a: [60, -150, 60, -150], l: [10, 0, 10, 0], h: -4, hd: [4, 4] },
  { n: 'Bocejando', c: 'Extra', a: [10, 0, 60, -150], l: [4, 0, 4, 0], h: -10, hd: [0, 1] },
  { n: 'Selfie', c: 'Extra', a: [10, 0, 130, -40], l: [10, -10, 4, 0], h: -10, hd: [0, 3] },
];
const POSE_CATS = [...new Set(POSES.map(p => p.c))];
