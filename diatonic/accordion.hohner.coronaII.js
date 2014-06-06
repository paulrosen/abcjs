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
    close: [["E♭3", "A3", "C♯4", "E4", "A4", "C♯5", "E5", "A5", "C♯6", "E6"], ["G♯3", "A3", "D4", "F♯4", "A4", "D5", "F♯5", "A5", "D6", "F♯6", "A6"], ["F4", "D4", "G4", "B4", "D5", "G5", "B5", "D6", "G6", "B6"]]
   , open: [["F3", "B3", "D4", "F♯4", "G♯4", "B4", "D5", "F♯5", "G♯5", "B5"], ["B♭3", "C♯4", "E4", "G4", "B4", "C♯5", "E5", "G5", "B5", "C♯6", "E6"], ["E♭4", "F♯4", "A4", "C5", "E5", "F♯5", "A5", "C6", "E6", "F♯6"]]
};

DIATONIC.tmp.basses = {
    close: [["f♯2", "F♯2", "b2", "B2", "c2", "C2"], ["a2", "A2", "d2", "D2", "g2", "G2"]]
   , open: [["b2:m", "B2", "e2:m", "E2", "c2", "C2"], ["e2", "E2", "a2", "A2", "d2", "D2"]]
};

DIATONIC.tmp.keysLayout = [0.5, 0, 0.5];

DIATONIC.map.models[DIATONIC.map.models.length] = new DIATONIC.map.Accordion(
        "GAITA_HOHNER_CORONA_II"
        , 'Hohner Corona II - 31/8 botões'
        , ["A", "D", "G"]
        , []
        , {keys: DIATONIC.tmp.keys, basses: DIATONIC.tmp.basses, layout: DIATONIC.tmp.keysLayout}
        , DIATONIC.tmp.chords
        , DIATONIC.tmp.scales
        , DIATONIC.tmp.songs
        , 'img/Hohner.Corona.gif'
        );

delete DIATONIC.tmp;

