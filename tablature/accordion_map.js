/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablature)
	window.ABCJS.tablature = {};

ABCJS.tablature.Accordion = function( selector ) {
    
    this.noteToButtonsOpen  = {}; 
    this.noteToButtonsClose  = {}; 
    
    this.transporter     = new window.ABCJS.parse.Transport();
    this.accordions      = [GAITA_HOHNER_GC, GAITA_HOHNER_CLUB_IIIM_BR];
    this.selected        = 0;
    this.tabLines       = [];
    
    if( selector ) {
        for(var i = 0; i < this.accordions.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = this.accordions[i].nome;
            opt.value = i;
            selector.appendChild(opt);
        }   
    }
    
    this.load(this.selected);

};


ABCJS.tablature.Accordion.prototype.inferTabVoice = function( line, tune, strTUne, vars ) {
    var infer = new ABCJS.tablature.Infer( this, tune, strTUne, vars );
    
    return infer.accordionTabVoice( line );

};

ABCJS.tablature.Accordion.prototype.updateEditor = function () {
    var ret = "";
    for(var l = 0; l < this.tabLines.length; l ++ ) {
        if(this.tabLines[l].length>0){
            ret = this.tabLines[l]+"\n";
        }
    }
    this.tabLines = [];
    return ret;
};

ABCJS.tablature.Accordion.prototype.setTabLine = function (line) {
    this.tabLines[this.tabLines.length] = line.trim();
};


ABCJS.tablature.Accordion.prototype.load = function (sel) {
        this.selected = sel;
        this.noteToButtonsOpen  = {}; 
        this.noteToButtonsClose  = {}; 
        
        for( var r = 0; r < this.accordions[this.selected].keyboard.keys.open.length; r ++ ) {
        var rowOpen = this.accordions[this.selected].keyboard.keys.open[r];
        var rowClose = this.accordions[this.selected].keyboard.keys.close[r];
        
        for(var button = 0; button < rowOpen.length; button++) {
           if(! this.noteToButtonsOpen[ rowOpen[button]] )  this.noteToButtonsOpen[rowOpen[button]] = [];
           this.noteToButtonsOpen[rowOpen[button]].push( (button+1) + Array(r+1).join("'"));
           if(! this.noteToButtonsClose[ rowClose[button]] )  this.noteToButtonsClose[rowClose[button]] = [];
           this.noteToButtonsClose[rowClose[button]].push( (button+1) + Array(r+1).join("'"));
        }
    }
    
    var nRows = this.accordions[this.selected].keyboard.keys.close.length;
     
    // as notas de baixo não se repetem em oitavas diferentes, então, para simplificar, são ignoradas
    for( var r = 0; r < this.accordions[this.selected].keyboard.basses.open.length; r ++ ) {
        var rowOpen = this.accordions[this.selected].keyboard.basses.open[r];
        var rowClose = this.accordions[this.selected].keyboard.basses.close[r];
        
        for(var button = 0; button < rowOpen.length; button++) {
           var b = this.getBassNote( rowOpen[button] );
           if(! this.noteToButtonsOpen[ b ] )  this.noteToButtonsOpen[ b ] = [];
           this.noteToButtonsOpen[ b ].push( (button+1) + Array(nRows+r+1).join("'"));
           b = this.getBassNote( rowClose[button] );
           if(! this.noteToButtonsClose[ b ] )  this.noteToButtonsClose [ b ] = [];
           this.noteToButtonsClose[ b ].push( (button+1) + Array(nRows+r+1).join("'"));
        }
    }

};

ABCJS.tablature.Accordion.prototype.getBassNote = function (note) {
    var n = note.split(":");
    return n[0].substr( 0, n[0].length-1);
};

ABCJS.tablature.Accordion.prototype.getButtons = function (note) {
// retorna a lista de botões possíveis para uma nota cromatica
  return {open:this.noteToButtonsOpen[note],close:this.noteToButtonsClose[note]};    
};

ABCJS.tablature.Accordion.prototype.identifyChord = function (children, aNotes, verticalPos, acc, keyAcc, transpose) {
//TODO: tratar adequadamente os acordes (de baixo)      
    var note = this.extractCromaticNote(children[aNotes[0]].pitch, verticalPos, acc, keyAcc, transpose );
    return children.length > 1 ? note.toLowerCase() : note;
};

ABCJS.tablature.Accordion.prototype.extractCromaticNote = function(pitch, deltapitch, acc, keyAcc, transpose) {
// mapeia 
//  de: nota da pauta + acidentes (tanto da clave, quanto locais)
//  para: nota nomeada no modelo cromatico com oitava
    var p = pitch + deltapitch + (transpose?transpose:0);
    var n = this.transporter.staffNoteToCromatic(this.transporter.extractStaffNote(p));
    var staffNote = this.transporter.numberToKey(n);
    var oitava = this.transporter.extractStaffOctave(p);
    var a = acc[pitch];
    var ka = this.transporter.getKeyAccOffset(staffNote, keyAcc);
    if (typeof(ka) !== "undefined")
        n += ka;
    if (typeof(a) !== "undefined") {
        if (a === 0) {
            if (typeof(ka) !== "undefined")
                n -= ka;
        } else {
            n += a;
        }
    }
    oitava += (n < 0 ? -1 : (n > 11 ? 1 : 0 ));
    n       = (n < 0 ? 12+n : (n > 11 ? n%12 : n ) );
    return this.transporter.numberToKey(n) + oitava;
};
