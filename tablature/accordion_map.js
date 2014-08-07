/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablature)
	window.ABCJS.tablature = {};

ABCJS.tablature.Accordion = function( params ) {
    
    this.noteToButtonsOpen  = {}; 
    this.noteToButtonsClose  = {}; 
    
    this.transposer     = new window.ABCJS.parse.Transposer();
    this.selected        = -1;
    this.tabLines       = [];
    
    if( params.accordionMaps ) {
       this.accordions = params.accordionMaps;
    } else {
        this.accordions = [];
    }
    
    if( params.id )
        this.loadById( params.id );
    else
        this.load(0);

};

ABCJS.tablature.Accordion.prototype.loadById = function (id) {
  for( var g = 0; g < this.accordions.length; g ++)
      if(this.accordions[g].id === id ) {
        this.load(g); 
        break;
      }
};

ABCJS.tablature.Accordion.prototype.load = function (sel) {
        this.selected = sel;
        this.noteToButtonsOpen  = {}; 
        this.noteToButtonsClose  = {}; 
        
        if ( this.selected < 0 ) return;
        
        var nRows = this.accordions[this.selected].getNumKeysRows();
        
        for( var r = 0; r < nRows; r ++ ) {
        var rowOpen = this.accordions[this.selected].getKeysOpenRow(r);
        var rowClose = this.accordions[this.selected].getKeysCloseRow(r);
        
        for(var button = 0; button < rowOpen.length; button++) {
           var b = this.getNoteVal( rowOpen[button], false );
           if(! this.noteToButtonsOpen[ b ] )  this.noteToButtonsOpen[ b ] = [];
           this.noteToButtonsOpen[ b ].push( (button+1) + Array(r+1).join("'"));
           b = this.getNoteVal( rowClose[button], false );
           if(! this.noteToButtonsClose[ b ] )  this.noteToButtonsClose [ b ] = [];
           this.noteToButtonsClose[ b ].push( (button+1) + Array(r+1).join("'"));
        }
    }
     
    // as notas de baixo não se repetem em oitavas diferentes, então, para simplificar, oitavas são ignoradas
    for( var r = 0; r < this.accordions[this.selected].getNumBassesRows(); r ++ ) {
        var rowOpen = this.accordions[this.selected].getBassOpenRow(r);
        var rowClose = this.accordions[this.selected].getBassCloseRow(r);
        
        for(var button = 0; button < rowOpen.length; button++) {
           var b = this.getNoteVal( rowOpen[button], true );
           if(! this.noteToButtonsOpen[ b ] )  this.noteToButtonsOpen[ b ] = [];
           this.noteToButtonsOpen[ b ].push( (button+1) + Array(nRows+r+1).join("'"));
           b = this.getNoteVal( rowClose[button], true );
           if(! this.noteToButtonsClose[ b ] )  this.noteToButtonsClose [ b ] = [];
           this.noteToButtonsClose[ b ].push( (button+1) + Array(nRows+r+1).join("'"));
        }
    }
};

ABCJS.tablature.Accordion.prototype.getNoteVal = function (note, bass) {
//não vou tratar acordes menores e com sétima
//para os baixos, retorna o valor sem a oitava
    var n = note.split(":");
    var b = n[0].substr( 0, n[0].length-1); // nota sem a oitava - tal e qual foi escrita
    var k = this.transposer.keyToNumber(b);
    var o = parseInt(n[0].substr( n[0].length-1));
    return (bass?b:k+o*12);
};

ABCJS.tablature.Accordion.prototype.getButtons = function (note, bass) {
  // retorna a lista de botões possíveis para uma valor de nota
  var val = this.getNoteVal(note, bass);
  return {open:this.noteToButtonsOpen[val],close:this.noteToButtonsClose[val]};    
};

ABCJS.tablature.Accordion.prototype.inferTabVoice = function( line, tune, strTUne, vars ) {
    var i = new ABCJS.tablature.Infer( this, tune, strTUne, vars );
    return i.inferTabVoice( line );

};

ABCJS.tablature.Accordion.prototype.parseTabVoice = function(str, vars ) {
    var p = new ABCJS.tablature.Parse(str, vars);
    return p.parseTabVoice();
};

ABCJS.tablature.Accordion.prototype.setTabLine = function (line) {
    this.tabLines[this.tabLines.length] = line.trim();
};

ABCJS.tablature.Accordion.prototype.updateEditor = function () {
    var ret = "\n";
    if(this.tabLines.length === 0) return "";
    for(var l = 0; l < this.tabLines.length; l ++ ) {
        if(this.tabLines[l].length>0){
            ret += this.tabLines[l]+"\n";
        }
    }
    this.tabLines = [];
    return ret;
};
