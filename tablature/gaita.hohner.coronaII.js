c_close=0;
c_open=1;

KEYS_HOHNER_CORONA = [
  [["E♭3", "A3", "C♯4", "E4", "A4", "C♯5", "E5", "A5", "C♯6", "E6"], ["G♯3", "A3", "D4", "F♯4", "A4", "D5", "F♯5", "A5", "D6", "F♯6", "A6"], ["F4", "D4", "G4", "B4", "D5", "G5", "B5", "D6", "G6", "B6"]]
 ,[["F3", "B3", "D4", "F♯4", "G♯4", "B4", "D5", "F♯5", "G♯5", "B5"], ["B♭3", "C♯4", "E4", "G4", "B4", "C♯5", "E5", "G5", "B5", "C♯6", "E6"], ["E♭4", "F♯4", "A4", "C5", "E5", "F♯5", "A5", "C6", "E6", "F♯6"]]
]; 

BASS_CORONA = [
   [["f♯2",  "F♯2", "b2",   "B2", "c2", "C2"], ["a2", "A2", "d2", "D2", "g2", "G2"]] // close
  ,[["b2:m", "B2",  "e2:m", "E2", "c2", "C2"], ["e2", "E2", "a2", "A2", "d2", "D2"]] // open
]; 

KEYBOARD_HOHNER_CORONA = [KEYS_HOHNER_CORONA, BASS_CORONA, [ 0.5, 0, 0.5]]

GAITA_HOHNER_CORONA = ['Hohner Corona II - 31/8 botões', ["A","D","G"], [], KEYBOARD_HOHNER_CORONA, [], [], 'img/Hohner.Corona.gif' ]

