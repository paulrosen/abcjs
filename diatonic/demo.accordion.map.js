c_close=0;
c_open=1;

// ARRAYS usados para configurar aspectos do acordeon

// KEYS - mapa para teclado (mao direita)
// keys := { 
//   { {linha0close}, {linha1close}, {linhaNclose} }
//  ,{ {linha0open},  {linha1open},  {linhaNopen}  }
// }
// linha := { nota, nota, ... }; linha0 é a linha mais externa
// nota -> representa a nota indicada pelo padrão internacional
// nota := {[L|l][♭|♯][n][:m]}
//   L,l -> caracter que indica nota (maiúsculo) ou acorde (minúsculo). As letras seguem o padrão internacional C,D,E,F,G,A,B.
//   ♭,♯ -> indica bemol ou sustenido
//   n -> numero que indica a oitava
//   :m -> complemento que indica acorde menor "m", acorde com "7", escala em "terças", etc.
KEYS_DEMO_GC =  [
  [[ "B2", "D3",  "G3", "B3", "D4", "G4",  "B4", "D5", "G5", "B5",  "D6"], [ "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5", "C6", "E6"]]
, [[ "D3", "F♯3", "A3", "C4", "E4", "F♯4", "A4", "C5", "E5", "F♯5", "A5"], [ "G3", "B3", "D4", "F4", "G4", "B4", "D5", "F5", "G5", "B5"]]
];

// BASS - mapa para os baixos (mao esquerda)
// BASS := { 
//   { {linhaNclose}, {linha1close}, {linha0close} }
//  ,{ {linhaNopen},  {linha1open},  {linha0open}  }
// }
// linha := { nota, nota, ... }; linhaN é a linha mais interna; atentar para o mapeamento invertido das linhas, N até 0.
// nota -> representa a nota indicada pelo padrão internacional; ver descrição em KEYS.
BASS_DEMO_GC = [
   [ ["e2",  "E2", "f2", "F2"],["g2", "G2", "c2", "C2"] ]
  ,[ ["a2:m", "A2", "f2", "F2"],["d2", "D2", "g2", "G2"] ]
];

// KEYBOARD - teclado inteiro da gaita, inclusive com indicação do layout.
// keyboard := { keys, basses, { layout } }
// keys -> array com os as notas do teclado da mão direita
// basses -> array com o teclado dos baixo
// layout := { n, n, ... }
// n -> indica a deslocamento inicial, sendo 0 a lateral esquerda da tela. A unidade de deslocamento é a largura de um botão, logo, 0.5 indica que a linha inicia 
//      com recuo para direita de 1/2 botão. Deve ser informado um valor para cada linha de teclas. Aplica-se ao teclado da mão direita.
KEYBOARD_DEMO_GC = [ KEYS_DEMO_GC, BASS_DEMO_GC, [0,0.5] ]

// ACORDES
// acorde := { simbolo, { variacoes } }
// variacoes := { fole, { botoes } }
// fole -> indica se o fole está abrindo ou fechando
// botoes := { {x,y}, {x,y}, ... }
// x,y -> par indicando posição o botão (linha, coluna)
CHORDS_DEMO_GC = [
    ["c", [
        [c_close, [[1,2],[1,3],[1,4]]],
        [c_close, [[1,5],[1,6],[1,7]]],
        [c_open, [[0,3],[0,4],[1,4]]],
        [c_open, [[0,7],[0,8],[1,8]]],
        ]],
    ["d", [
        [c_open, [[0,0],[0,1],[0,2]]],
        [c_open, [[1,2],[0,5],[0,6]]],
        [c_open, [[1,6],[0,9],[0,10]]],
        ]],
    ["d:m", [
        [c_open, [[1,2],[1,3],[0,6]]],
        [c_open, [[1,6],[1,7],[0,10]]],
        ]],
    ["e:7", [
        [c_close, [[1,3],[0,3],[0,4]]],
        [c_close, [[1,6],[0,6],[0,7]]],
        [c_close, [[1,9],[0,9],[0,10]]],
        ]],
    ["f:m", [
        [c_close, [[1,3],[1,4],[0,6]]],
        [c_open,  [[0,4],[1,4],[1,5]]],
        [c_close, [[1,6],[1,7],[0,9]]],
        [c_open,  [[0,8],[1,8],[1,9]]],
        ]],
    ["f", [
        [c_open,  [[0,2],[0,3],[1,3]]],
        [c_open,  [[0,6],[0,7],[1,7]]],
        ]],
    ["g", [
        [c_open,  [[1,0],[1,1],[1,2]]],
        [c_close, [[0,2],[0,3],[0,4]]],
        [c_open,  [[1,4],[1,5],[1,6]]],
        [c_close, [[0,5],[0,6],[0,7]]],
        [c_close, [[0,8],[0,9],[0,10]]],
        ]],
    ["a:m", [
        [c_open,  [[0,2],[0,3],[0,4]]],
        [c_open,  [[0,6],[0,7],[0,8]]],
        ]]
];

// ESCALAS
// escala := { simbolo, complemento, { notas } }
// notas := { fole, { botoes } }
// fole -> indica se o fole está abrindo ou fechando
// botoes := { {x,y}, {x,y}, ... }
// x,y -> par indicando posição o botão (linha, coluna)
ESCALA_DEMO_GC=[
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
 ];

// GAITA
// gaita := { nome, {afinação}, {pedal}, teclado, acordes, escalas, imagem }
// nome := nome descritivo para identificação do modelo de gaita
// teclado := array com as teclas do instrumento (ver KEYBOARD)
// acordes := array com acordes para o teclado do instrumento (ver ACORDES)
// escalas := array com escalas para o teclado do instrumento (ver ESCALAS)
// imagem := imagem ilustrativa do modelo de gaita
GAITA_DEMO = ['Demonstração - 21/8 botões', ["G","C"], [1,4], KEYBOARD_DEMO_GC, CHORDS_DEMO_GC, ESCALA_DEMO_GC, 'img/demo.gif' ]

