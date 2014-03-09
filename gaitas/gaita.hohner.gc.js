c_close=0;
c_open=1;

KEYS_HOHNER_GC =  {
close:[[ "B2", "D3",  "G3", "B3", "D4", "G4",  "B4", "D5", "G5", "B5",  "D6"], [ "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5", "C6", "E6"]]
,open:[[ "D3", "F♯3", "A3", "C4", "E4", "F♯4", "A4", "C5", "E5", "F♯5", "A5"], [ "G3", "B3", "D4", "F4", "G4", "B4", "D5", "F5", "G5", "B5"]]
};

BASS_HOHNER_GC = {
  close:[ ["e2",   "E2", "f1", "F1"], ["g1", "G1", "c2", "C2"] ]
  ,open:[ ["a1:m", "A1", "f1", "F1"], ["d2", "D2", "g1", "G1"] ]
  };

KEYBOARD_HOHNER_GC = { keys:KEYS_HOHNER_GC, basses:BASS_HOHNER_GC, layout:[0,0.5] };

CHORDS_HOHNER_GC = [
    ["C", [
        [c_close, [[1,2],[1,3],[1,4]]],
        [c_close, [[1,5],[1,6],[1,7]]],
        [c_open, [[0,3],[0,4],[1,4]]],
        [c_open, [[0,7],[0,8],[1,8]]],
        ]],
    ["D", [
        [c_open, [[0,0],[0,1],[0,2]]],
        [c_open, [[1,2],[0,5],[0,6]]],
        [c_open, [[1,6],[0,9],[0,10]]],
        ]],
    ["D:m", [
        [c_open, [[1,2],[1,3],[0,6]]],
        [c_open, [[1,6],[1,7],[0,10]]],
        ]],
    ["E:7", [
        [c_close, [[1,3],[0,3],[0,4]]],
        [c_close, [[1,6],[0,6],[0,7]]],
        [c_close, [[1,9],[0,9],[0,10]]],
        ]],
    ["E:m", [
        [c_close, [[1,3],[1,4],[0,6]]],
        [c_open,  [[0,4],[1,4],[1,5]]],
        [c_close, [[1,6],[1,7],[0,9]]],
        [c_open,  [[0,8],[1,8],[1,9]]],
        ]],
    ["F", [
        [c_open,  [[0,2],[0,3],[1,3]]],
        [c_open,  [[0,6],[0,7],[1,7]]],
        ]],
    ["G", [
        [c_open,  [[1,0],[1,1],[1,2]]],
        [c_close, [[0,2],[0,3],[0,4]]],
        [c_open,  [[1,4],[1,5],[1,6]]],
        [c_close, [[0,5],[0,6],[0,7]]],
        [c_close, [[0,8],[0,9],[0,10]]],
        ]],
    ["A:m", [
        [c_open,  [[0,2],[0,3],[0,4]]],
        [c_open,  [[0,6],[0,7],[0,8]]],
        ]]
];

ESCALA_HOHNER_GC=[
  [ "C: em terças", [
      [c_open,[[1,0],[1,1]]],
      [c_open,[[0,2],[0,3]]],
      [c_open,[[1,1],[1,2]]],
      [c_open,[[0,3],[0,4]]],
      [c_open,[[1,2],[1,3]]],
      [c_open,[[0,4],[1,4]]],
      [c_open,[[1,3],[0,6]]],
      [c_open,[[1,4],[1,5]]],
      [c_open,[[0,6],[0,7]]],
      [c_open,[[1,5],[1,6]]],
      [c_open,[[0,7],[0,8]]],
      [c_open,[[1,6],[1,7]]],
      [c_open,[[0,8],[1,8]]],
      [c_open,[[1,7],[0,10]]],
      [c_open,[[1,8],[1,9]]]
     ]],
  [ "G: - teste com baixos", [
      [c_open,[[3,1]]],
      [c_open,[[3,0]]],
      [c_open,[[3,0]]],
      [c_close,[[3,1]]],
      [c_close,[[3,0]]],
      [c_close,[[3,0]]],
      [c_open,[[2,1]]],
      [c_open,[[2,0]]],
      [c_open,[[2,0]]],
     ]],
  [ "A:m - teste com baixos", [
      [c_close,[[2,1]]],
      [c_close,[[2,0]]],
      [c_close,[[2,1]]],
      [c_close,[[2,0]]],
      [c_open,[[2,1]]],
      [c_open,[[2,0]]],
      [c_open,[[2,1]]],
      [c_open,[[2,0]]],
     ]],
 ];

GAITA_HOHNER_GC = {
    nome:'Hohner/Hëring - 21/8 botões'
   ,afinacao: ["G","C"]
   ,pedal:[1,4] 
   ,keyboard: KEYBOARD_HOHNER_GC 
   ,chords:CHORDS_HOHNER_GC 
   ,scales:ESCALA_HOHNER_GC 
   ,image:'img/Hohner Beija-Flor.gif' 
}; 
