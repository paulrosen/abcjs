/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablatura)
	window.ABCJS.tablatura = {};

ABCJS.tablatura.Gaita = function(selector) {
    this.transporter = new window.ABCJS.parse.Transport();
    
    this.noteToButtonsOpen  = {}; 
    this.noteToButtonsClose  = {}; 
    this.minNote         = 0x15; //  A0 = first note
    this.maxNote         = 0x6C; //  C8 = last note
    this.number2key      = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
    this.number2keyflat  = ["C", "D♭", "D", "D♯", "E", "F", "G♭", "G", "A♭", "A", "A♯", "B"];
    this.number2key_br   = ["Dó", "Dó♯", "Ré", "Mi♭", "Mi", "Fá", "Fá♯", "Sol", "Sol♯", "Lá", "Si♭", "Si"];
    this.gaitas          = [GAITA_HOHNER_GC, GAITA_HOHNER_CLUB_IIIM_BR];
    this.selected        = 0;
    
    if( selector ) {
        for(var i = 0; i < this.gaitas.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = this.gaitas[i].nome;
            opt.value = i;
            selector.appendChild(opt);
        }   
    }
    
    this.load(0);

};

ABCJS.tablatura.Gaita.prototype.load = function (sel) {
        this.selected = sel;
        this.noteToButtonsOpen  = {}; 
        this.noteToButtonsClose  = {}; 
        
        for( var r = 0; r < this.gaitas[this.selected].keyboard.keys.open.length; r ++ ) {
        var rowOpen = this.gaitas[this.selected].keyboard.keys.open[r];
        var rowClose = this.gaitas[this.selected].keyboard.keys.close[r];
        
        for(var button = 0; button < rowOpen.length; button++) {
           if(! this.noteToButtonsOpen[ rowOpen[button]] )  this.noteToButtonsOpen[rowOpen[button]] = [];
           this.noteToButtonsOpen[rowOpen[button]].push( (button+1) + Array(r+1).join("'"));
           if(! this.noteToButtonsClose[ rowClose[button]] )  this.noteToButtonsClose[rowClose[button]] = [];
           this.noteToButtonsClose[rowClose[button]].push( (button+1) + Array(r+1).join("'"));
        }
    }
    
    var nRows = this.gaitas[this.selected].keyboard.keys.close.length;
       
    for( var r = 0; r < this.gaitas[this.selected].keyboard.basses.open.length; r ++ ) {
        var rowOpen = this.gaitas[this.selected].keyboard.basses.open[r];
        var rowClose = this.gaitas[this.selected].keyboard.basses.close[r];
        
        for(var button = 0; button < rowOpen.length; button++) {
           if(! this.noteToButtonsOpen[ rowOpen[button]] )  this.noteToButtonsOpen[rowOpen[button]] = [];
           this.noteToButtonsOpen[rowOpen[button]].push( (button+1) + Array(nRows+r+1).join("'"));
           if(! this.noteToButtonsClose[ rowClose[button]] )  this.noteToButtonsClose[rowClose[button]] = [];
           this.noteToButtonsClose[rowClose[button]].push( (button+1) + Array(nRows+r+1).join("'"));
        }
    }

};

ABCJS.tablatura.Gaita.prototype.getButtons = function (note) {
// retorna a lista de botões possíveis para uma nota cromatica
  return {open:this.noteToButtonsOpen[note],close:this.noteToButtonsClose[note]};    
};

ABCJS.tablatura.Gaita.prototype.identifyChord = function (children, verticalPos, acc, keyAcc, transpose) {
    //TODO: tratar adequadamente os acordes (de baixo)      
    var note = this.extractCromaticNote(children[0].pitch, verticalPos, acc, keyAcc, transpose );
    return children.length > 1 ? note.toLowerCase() : note;
};

ABCJS.tablatura.Gaita.prototype.extractCromaticNote = function(pitch, deltapitch, acc, keyAcc, transpose) {
// mapeia 
//  de: nota da pauta + acidentes (tanto da clave, quanto locais)
//  para: nota nomeada no modelo cromatico com oitava
    var p = pitch + deltapitch + (transpose?transpose:0);
    var n = this.transporter.staffNoteToCromatic(this.transporter.extractStaffNote(p));
    var staffNote = this.number2key[n];
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
    return this.number2key[n] + oitava;
};
