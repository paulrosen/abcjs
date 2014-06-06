/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.DIATONIC)
    window.DIATONIC = {close: 0, open: 1};

if (!window.DIATONIC.map)
    window.DIATONIC.map = {models: []};

window.DIATONIC.tmp = {keys: {}, basses: {}, keysLayout: [], chords: [], scales: [], songs:[] };

DIATONIC.tmp.keys = {
   close: [["B2", "D3", "G3", "B3", "D4", "G4", "B4", "D5", "G5", "B5", "D6"], ["E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5", "C6", "E6"]]
  , open: [["D3", "F♯3", "A3", "C4", "E4", "F♯4", "A4", "C5", "E5", "F♯5", "A5"], ["G3", "B3", "D4", "F4", "G4", "B4", "D5", "F5", "G5", "B5"]]
};

DIATONIC.tmp.basses = {
   close: [["e2", "E2", "f1", "F1"], ["g1", "G1", "c2", "C2"]]
  , open: [["a1:m", "A1", "f1", "F1"], ["d2", "D2", "g1", "G1"]]
};

DIATONIC.tmp.keysLayout = [0, 0.5];


DIATONIC.tmp.chords = [
    ["C", [
        [DIATONIC.close, [[1,2],[1,3],[1,4]]],
        [DIATONIC.close, [[1,5],[1,6],[1,7]]],
        [DIATONIC.open, [[0,3],[0,4],[1,4]]],
        [DIATONIC.open, [[0,7],[0,8],[1,8]]],
        ]],
    ["D", [
        [DIATONIC.open, [[0,0],[0,1],[0,2]]],
        [DIATONIC.open, [[1,2],[0,5],[0,6]]],
        [DIATONIC.open, [[1,6],[0,9],[0,10]]],
        ]],
    ["D:m", [
        [DIATONIC.open, [[1,2],[1,3],[0,6]]],
        [DIATONIC.open, [[1,6],[1,7],[0,10]]],
        ]],
    ["E:7", [
        [DIATONIC.close, [[1,3],[0,3],[0,4]]],
        [DIATONIC.close, [[1,6],[0,6],[0,7]]],
        [DIATONIC.close, [[1,9],[0,9],[0,10]]],
        ]],
    ["E:m", [
        [DIATONIC.close, [[1,3],[1,4],[0,6]]],
        [DIATONIC.open,  [[0,4],[1,4],[1,5]]],
        [DIATONIC.close, [[1,6],[1,7],[0,9]]],
        [DIATONIC.open,  [[0,8],[1,8],[1,9]]],
        ]],
    ["F", [
        [DIATONIC.open,  [[0,2],[0,3],[1,3]]],
        [DIATONIC.open,  [[0,6],[0,7],[1,7]]],
        ]],
    ["G", [
        [DIATONIC.open,  [[1,0],[1,1],[1,2]]],
        [DIATONIC.close, [[0,2],[0,3],[0,4]]],
        [DIATONIC.open,  [[1,4],[1,5],[1,6]]],
        [DIATONIC.close, [[0,5],[0,6],[0,7]]],
        [DIATONIC.close, [[0,8],[0,9],[0,10]]],
        ]],
    ["A:m", [
        [DIATONIC.open,  [[0,2],[0,3],[0,4]]],
        [DIATONIC.open,  [[0,6],[0,7],[0,8]]],
        ]]
];

DIATONIC.tmp.scales = [
  [ "C: em terças", [
      [DIATONIC.open,[[1,0],[1,1]]],
      [DIATONIC.open,[[0,2],[0,3]]],
      [DIATONIC.open,[[1,1],[1,2]]],
      [DIATONIC.open,[[0,3],[0,4]]],
      [DIATONIC.open,[[1,2],[1,3]]],
      [DIATONIC.open,[[0,4],[1,4]]],
      [DIATONIC.open,[[1,3],[0,6]]],
      [DIATONIC.open,[[1,4],[1,5]]],
      [DIATONIC.open,[[0,6],[0,7]]],
      [DIATONIC.open,[[1,5],[1,6]]],
      [DIATONIC.open,[[0,7],[0,8]]],
      [DIATONIC.open,[[1,6],[1,7]]],
      [DIATONIC.open,[[0,8],[1,8]]],
      [DIATONIC.open,[[1,7],[0,10]]],
      [DIATONIC.open,[[1,8],[1,9]]]
     ]],
  [ "G: - teste com baixos", [
      [DIATONIC.open,[[3,1]]],
      [DIATONIC.open,[[3,0]]],
      [DIATONIC.open,[[3,0]]],
      [DIATONIC.close,[[3,1]]],
      [DIATONIC.close,[[3,0]]],
      [DIATONIC.close,[[3,0]]],
      [DIATONIC.open,[[2,1]]],
      [DIATONIC.open,[[2,0]]],
      [DIATONIC.open,[[2,0]]],
     ]],
  [ "A:m - teste com baixos", [
      [DIATONIC.close,[[2,1]]],
      [DIATONIC.close,[[2,0]]],
      [DIATONIC.close,[[2,1]]],
      [DIATONIC.close,[[2,0]]],
      [DIATONIC.open,[[2,1]]],
      [DIATONIC.open,[[2,0]]],
      [DIATONIC.open,[[2,1]]],
      [DIATONIC.open,[[2,0]]],
     ]],
 ];

DIATONIC.tmp.songs = [
    'songs/jai.abcx'
   ,'songs/valsa.abcx'
   ,'songs/didatica.abcx'
   ,'songs/hg.g.abcx'
];

DIATONIC.map.models[DIATONIC.map.models.length] = new DIATONIC.map.Accordion(
        'GAITA_HOHNER_GC'
        , 'Hohner/Hëring - 21/8 botões'
        , ["G", "C"]
        , [1, 4]
        , {keys: DIATONIC.tmp.keys, basses: DIATONIC.tmp.basses, layout: DIATONIC.tmp.keysLayout}
        , DIATONIC.tmp.chords
        , DIATONIC.tmp.scales
        , DIATONIC.tmp.songs
        , 'img/Hohner Beija-Flor.gif'
        );

delete DIATONIC.tmp;

