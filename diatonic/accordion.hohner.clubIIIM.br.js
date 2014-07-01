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
    close: [["F♯3", "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5", "C6", "E6", "G6"], ["F3", "A3", "C4", "F4", "A4", "C5", "F5", "A5", "C6", "F6", "A6"], ["E♭4", "B♭4", "F♯4", "E♭5", "D5", "F♯5", "E♭6"]]
    , open: [["G♯3", "G3", "B3", "D4", "F4", "A4", "B4", "D5", "F5", "A5", "B5", "D6"], ["B♭3", "C4", "E4", "G4", "B♭4", "C5", "E5", "G5", "B♭5", "C6", "E6"], ["C♯4", "F♯4", "G♯4", "C♯5", "E♭5", "G♯5", "C♯6"]]
};

DIATONIC.tmp.basses = {
    close: [["a1", "A1", "e♭1", "E♭1"], ["c2", "C2", "f1", "F1"]]
    , open: [["d2:m", "D2", "b♭1", "B♭1"], ["g1", "G1", "c2", "C2"]]
};

DIATONIC.tmp.keysLayout = [0, 0.5, 3];

DIATONIC.tmp.chords = [
        ["F", [
            [DIATONIC.close, [[1,0],[1,1],[1,2]]],
            [DIATONIC.close, [[1,3],[1,4],[1,5]]],
            [DIATONIC.close, [[1,6],[1,7],[1,8]]],
            [DIATONIC.open, [[0,4],[0,5],[1,5]]],
            [DIATONIC.open, [[0,8],[0,9],[1,9]]],
            ]],
        ["G", [
            [DIATONIC.open, [[0,1],[0,2],[0,3]]],
            [DIATONIC.open, [[1,3],[0,6],[0,7]]],
            [DIATONIC.open, [[1,3],[0,2],[0,3]]],
            [DIATONIC.open, [[1,7],[0,10],[0,11]]],
            [DIATONIC.open, [[1,7],[0,6],[0,7]]],
            ]],
        ["G:m", [
            [DIATONIC.open, [[1,3],[1,4],[0,7]]],
            [DIATONIC.open, [[1,7],[1,8],[0,11]]],
            [DIATONIC.close, [[0,2],[2,1],[2,4]]],
            ]],
        ["A", [
            [DIATONIC.open, [[0,5],[1,6],[2,3]]],
            [DIATONIC.open, [[0,9],[1,10],[2,6]]],
            ]],
        ["A:7", [
            [DIATONIC.close, [[1,4],[0,4],[0,5]]],
            [DIATONIC.close, [[1,7],[0,7],[0,8]]],
            [DIATONIC.close, [[1,10],[0,10],[0,11]]],
            ]],
        ["A:m", [
            [DIATONIC.close, [[1,1],[1,2],[0,4]]],
            [DIATONIC.close, [[1,4],[1,5],[0,7]]],
            [DIATONIC.open,  [[0,5],[1,5],[1,6]]],
            [DIATONIC.close, [[1,7],[1,8],[0,10]]],
            ]],
        ["B♭", [
            [DIATONIC.open,  [[0,3],[0,4],[1,0]]],
            [DIATONIC.open,  [[0,3],[0,4],[1,4]]],
            [DIATONIC.open,  [[0,7],[0,8],[1,8]]],
            [DIATONIC.close,  [[2,1],[2,4],[1,3]]],
            ]],
        ["B", [
            [DIATONIC.open,  [[0,2],[2,1],[2,4]]],
            [DIATONIC.open,  [[0,6],[2,1],[2,4]]],
            ]],
        ["C", [
            [DIATONIC.open,  [[1,1],[1,2],[1,3]]],
            [DIATONIC.close, [[0,3],[0,4],[0,5]]],
            [DIATONIC.open,  [[1,5],[1,6],[1,7]]],
            [DIATONIC.close, [[0,6],[0,7],[0,8]]],
            [DIATONIC.close, [[0,9],[0,10],[0,11]]],
            ]],
        ["D", [
            [DIATONIC.close,  [[2,4],[2,2],[1,4]]],
            [DIATONIC.open,  [[0,3],[2,1],[0,5]]],
            [DIATONIC.close,  [[2,4],[2,5],[1,7]]],
            [DIATONIC.close,  [[2,4],[2,5],[1,10]]],
            ]],
        ["D:m", [
            [DIATONIC.open,  [[0,3],[0,4],[0,5]]],
            [DIATONIC.open,  [[0,7],[0,8],[0,9]]],
            [DIATONIC.close, [[2,4],[1,6],[1,7]]],
            ]],
        ["E", [
            [DIATONIC.open,  [[0,0],[0,2],[1,2]]],
            [DIATONIC.open,  [[0,2],[1,2],[2,2]]],
            [DIATONIC.open,  [[0,6],[1,6],[2,5]]],
            ]],
        ["E:m", [
            [DIATONIC.open,  [[0,1],[0,2],[1,2]]],
            [DIATONIC.open,  [[0,2],[1,2],[1,3]]],
            [DIATONIC.open,  [[0,6],[1,6],[1,7]]],
            ]]
    ];

DIATONIC.tmp.scales =[
      [ "F: em terças", [ 
          [DIATONIC.open,[[1,0],[0,3]]],
          [DIATONIC.open,[[1,1],[1,2]]],
          [DIATONIC.open,[[0,3],[0,4]]],
          [DIATONIC.open,[[1,2],[1,3]]],
          [DIATONIC.open,[[0,4],[0,5]]],
          [DIATONIC.open,[[1,3],[1,4]]],
          [DIATONIC.open,[[0,5],[1,5]]],
          [DIATONIC.open,[[1,4],[0,7]]],
          [DIATONIC.open,[[1,5],[1,6]]],
          [DIATONIC.open,[[0,7],[0,8]]],
          [DIATONIC.open,[[1,6],[1,7]]],
          [DIATONIC.open,[[0,8],[0,9]]],
          [DIATONIC.open,[[1,7],[1,8]]],
          [DIATONIC.open,[[0,9],[1,9]]],
          [DIATONIC.open,[[1,8],[0,11]]],
          [DIATONIC.open,[[1,9],[1,10]]]
         ]],
      [ "F: chula", [ 
          [DIATONIC.close,[[0,7],[0,8]]],
          [DIATONIC.close,[[0,7],[0,9]]],
          [DIATONIC.open,[[1,7],[0,10]]],
          [DIATONIC.open,[[0,8],[0,9]]],  
          [DIATONIC.open,[[1,7],[0,10]]],
          [DIATONIC.close,[[1,6],[1,7]]],
          [DIATONIC.close,[[0,7],[0,8]]],
          [DIATONIC.close,[[1,6],[1,7]]],
          [DIATONIC.open,[[1,6],[1,7]]],
          [DIATONIC.open,[[0,7],[0,8]]],
          [DIATONIC.open,[[1,6],[1,7]]],
          [DIATONIC.open,[[0,7],[0,8]]],
          [DIATONIC.close,[[0,6],[0,7]]]
         ]],
      [ "F: redomona", [ 
           [DIATONIC.open,[[1,10]]],[DIATONIC.open,[[0,11]]],[DIATONIC.open,[[1, 9]]],[DIATONIC.open,[[1, 9]]]
          ,[DIATONIC.open,[[0,11]]],[DIATONIC.open,[[1, 9]]],[DIATONIC.open,[[1, 8]]],[DIATONIC.open,[[1, 8]]]
          ,[DIATONIC.open,[[1, 9]]],[DIATONIC.open,[[1, 8]]],[DIATONIC.open,[[0, 9]]],[DIATONIC.open,[[0, 9]]]
          ,[DIATONIC.open,[[1, 8]]],[DIATONIC.open,[[0, 9]]],[DIATONIC.open,[[1, 7]]],[DIATONIC.open,[[1, 7]]]
          ,[DIATONIC.open,[[0, 9]]],[DIATONIC.open,[[1, 7]]],[DIATONIC.open,[[0, 8]]],[DIATONIC.open,[[0, 8]]]
          ,[DIATONIC.open,[[1, 7]]],[DIATONIC.open,[[0, 8]]],[DIATONIC.open,[[1, 6]]],[DIATONIC.open,[[1, 6]]]
          ,[DIATONIC.open,[[0, 8]]],[DIATONIC.open,[[1, 6]]],[DIATONIC.open,[[0, 7]]],[DIATONIC.open,[[0, 7]]]
          ,[DIATONIC.open,[[1, 6]]],[DIATONIC.open,[[0, 7]]],[DIATONIC.open,[[1, 5]]],[DIATONIC.open,[[1, 5]]]
         ]],
      [ "G: em terças", [ 
          [DIATONIC.close,[[0,0],[1,1]]],
          [DIATONIC.open,[[0,1],[0,2]]],
          [DIATONIC.close,[[1,1],[1,2]]],
          [DIATONIC.open,[[0,2],[0,3]]],  // 4
          [DIATONIC.open,[[1,1],[1,2]]], 
          [DIATONIC.open,[[0,3],[2,1]]],
          [DIATONIC.open,[[1,2],[1,3]]],
          [DIATONIC.open,[[2,1],[0,5]]], // 8
          [DIATONIC.open,[[1,3],[0,6]]],
          [DIATONIC.open,[[0,5],[1,5]]],
          [DIATONIC.open,[[0,6],[0,7]]],
          [DIATONIC.open,[[1,5],[1,6]]], // 12
          [DIATONIC.close,[[2,4],[2,5]]],
          [DIATONIC.open,[[1,6],[1,7]]],
          [DIATONIC.close,[[2,5],[1,7]]],
          [DIATONIC.open,[[1,7],[0,10]]],
          [DIATONIC.close,[[1,7],[1,8]]],
          [DIATONIC.open,[[0,10],[0,11]]],
          [DIATONIC.open,[[1,9],[1,10]]],
         ]]
     ];
     
DIATONIC.tmp.songs = [
     'songs/jai.c.abcx'
    ,'songs/maitia.c.abcx'
    ,'songs/valsa.f.abcx'
    ,'songs/hg.club.abcx'
];

DIATONIC.map.models[DIATONIC.map.models.length] = new DIATONIC.map.Accordion(
        "GAITA_HOHNER_CLUB_IIIM_BR"
        , 'Hohner Club IIIM - 30/8 botões (BR)'
        , ["C", "F"]
        , [1, 5]
        , {keys: DIATONIC.tmp.keys, basses: DIATONIC.tmp.basses, layout: DIATONIC.tmp.keysLayout}
        , DIATONIC.tmp.chords
        , DIATONIC.tmp.scales
        , DIATONIC.tmp.songs
        , 'img/Hohner.Club IIIM.gif'
        );

delete DIATONIC.tmp;
