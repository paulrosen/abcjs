/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.DIATONIC)
	window.DIATONIC = {close:0, open:1};

if (!window.DIATONIC.map)
	window.DIATONIC.map = { models: [] };

DIATONIC.map.Accordion = function (id, nome, afinacao, pedal, keyboard, chords, scales, songPathList, image) {
    this.id = id;
    this.name = nome;
    this.afinacao = afinacao;
    this.pedal = pedal;
    this.keyboard = keyboard;
    this.chords = chords;
    this.scales = scales;
    this.songPathList = songPathList;
    this.image = image;
    this.songs = {};
    
    this.loadSongs();
};

DIATONIC.map.Accordion.prototype.getId = function () {
    return this.id;
};

DIATONIC.map.Accordion.prototype.getName = function () {
    return this.name;
};

DIATONIC.map.Accordion.prototype.getAfinacao = function () {
    return this.afinacao;
};

DIATONIC.map.Accordion.prototype.getKeyboard = function () {
    return this.keyboard;
};

DIATONIC.map.Accordion.prototype.getChords = function () {
    return this.chords;
};

DIATONIC.map.Accordion.prototype.getChordSymbol = function (n) {
    return this.chords[n][0];
};
DIATONIC.map.Accordion.prototype.getChordVariations = function (n) {
    return this.chords[n][1];
};

DIATONIC.map.Accordion.prototype.getScales = function () {
    return this.scales;
};

DIATONIC.map.Accordion.prototype.getSong = function (name) {
    return this.songs[name];
};

DIATONIC.map.Accordion.prototype.getFirstSong = function () {
    for(var s in this.songs ) {
        return s;
    }
    return "";
};


DIATONIC.map.Accordion.prototype.getPathToImage = function () {
    return this.image;
};

DIATONIC.map.Accordion.prototype.getNumKeysRows = function () {
    return this.keyboard.keys.open.length;
};

DIATONIC.map.Accordion.prototype.getNumBassesRows = function () {
    return this.keyboard.basses.open.length;
};

DIATONIC.map.Accordion.prototype.getKeysOpenRow = function (r) {
    return this.keyboard.keys.open[r];
};

DIATONIC.map.Accordion.prototype.getKeysCloseRow = function (r) {
    return this.keyboard.keys.close[r];
};

DIATONIC.map.Accordion.prototype.getBassOpenRow = function (r) {
    return this.keyboard.basses.open[r];
};
DIATONIC.map.Accordion.prototype.getBassCloseRow = function (r) {
    return this.keyboard.basses.close[r];
};

DIATONIC.map.Accordion.prototype.getKeysLayout = function (r) {
    return this.keyboard.layout[r] || 0;
};

DIATONIC.map.Accordion.prototype.isPedal = function (i,j) {
    return this.pedal[1] === i && this.pedal[0] === j;
};

DIATONIC.map.Accordion.prototype.loadSongs = function() {
   var that = this;
    for (var s = 0; s < this.songPathList.length; s++) {
        $.get( this.songPathList[s], function(r) {
            var tunebook = new ABCJS.TuneBook(r);
            for(var t = 0; t < tunebook.tunes.length; t ++ )
              that.songs[tunebook.tunes[t].title] = tunebook.tunes[t].abc;
            
        });
    }
};
