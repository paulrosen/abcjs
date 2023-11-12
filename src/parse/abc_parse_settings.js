module.exports.legalAccents = [
  'trill',
  'lowermordent',
  'uppermordent',
  'mordent',
  'pralltriller',
  'accent',
  'fermata',
  'invertedfermata',
  'tenuto',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '+',
  'wedge',
  'open',
  'thumb',
  'snap',
  'turn',
  'roll',
  'breath',
  'shortphrase',
  'mediumphrase',
  'longphrase',
  'segno',
  'coda',
  'D.S.',
  'D.C.',
  'fine',
  'beambr1',
  'beambr2',
  'slide',
  'marcato',
  'upbow',
  'downbow',
  '/',
  '//',
  '///',
  '////',
  'trem1',
  'trem2',
  'trem3',
  'trem4',
  'turnx',
  'invertedturn',
  'invertedturnx',
  'trill(',
  'trill)',
  'arpeggio',
  'xstem',
  'mark',
  'umarcato',
  'style=normal',
  'style=harmonic',
  'style=rhythm',
  'style=x',
  'style=triangle',
  'D.C.alcoda',
  'D.C.alfine',
  'D.S.alcoda',
  'D.S.alfine',
  'editorial',
  'courtesy'
];

module.exports.volumeDecorations = [
  'p',
  'pp',
  'f',
  'ff',
  'mf',
  'mp',
  'ppp',
  'pppp',
  'fff',
  'ffff',
  'sfz'
];

module.exports.dynamicDecorations = [
  'crescendo(',
  'crescendo)',
  'diminuendo(',
  'diminuendo)',
  'glissando(',
  'glissando)',
  '~(',
  '~)'
];

module.exports.accentPseudonyms = [
  ['<', 'accent'],
  ['>', 'accent'],
  ['tr', 'trill'],
  ['plus', '+'],
  ['emphasis', 'accent'],
  ['^', 'umarcato'],
  ['marcato', 'umarcato']
];

module.exports.accentDynamicPseudonyms = [
  ['<(', 'crescendo('],
  ['<)', 'crescendo)'],
  ['>(', 'diminuendo('],
  ['>)', 'diminuendo)']
];

module.exports.nonDecorations = 'ABCDEFGabcdefgxyzZ[]|^_{'; // use this to prescreen so we don't have to look for a decoration at every note.

module.exports.durations = [
  0.5, 0.75, 0.875, 0.9375, 0.96875, 0.984375, 0.25, 0.375, 0.4375, 0.46875,
  0.484375, 0.4921875, 0.125, 0.1875, 0.21875, 0.234375, 0.2421875, 0.24609375,
  0.0625, 0.09375, 0.109375, 0.1171875, 0.12109375, 0.123046875, 0.03125,
  0.046875, 0.0546875, 0.05859375, 0.060546875, 0.0615234375, 0.015625,
  0.0234375, 0.02734375, 0.029296875, 0.0302734375, 0.03076171875
];

module.exports.pitches = {
  A: 5,
  B: 6,
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  a: 12,
  b: 13,
  c: 7,
  d: 8,
  e: 9,
  f: 10,
  g: 11
};

module.exports.rests = {
  x: 'invisible',
  X: 'invisible-multimeasure',
  y: 'spacer',
  z: 'rest',
  Z: 'multimeasure'
};

module.exports.accMap = {
  dblflat: '__',
  flat: '_',
  natural: '=',
  sharp: '^',
  dblsharp: '^^',
  quarterflat: '_/',
  quartersharp: '^/'
};

module.exports.tripletQ = {
  2: 3,
  3: 2,
  4: 3,
  5: 2, // TODO-PER: not handling 6/8 rhythm yet
  6: 2,
  7: 2, // TODO-PER: not handling 6/8 rhythm yet
  8: 3,
  9: 2 // TODO-PER: not handling 6/8 rhythm yet
};
