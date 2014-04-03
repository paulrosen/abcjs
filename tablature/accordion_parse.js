/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 
            Definição da sintaxe para tablatura
        
           " |: G+5'2g-6>-5 | G-3'2d-5d-[678]1/2 | G+5d-5d-> | G-xd-5d-6 | +{786'}2 | +11/2 | c+ac+b |"
        
           Linha de tablatura ::= { <comentario> | <barra> | <coluna> }*
        
           comentario := "%[texto]"

           barra ::=  "|", "||", ":|", "|:", ":|:", ":||:", "::", ":||", ":||", "[|", "|]", "|[|", "|]|" 
        
           coluna ::=  [<singleBassNote>]<bellows><note>[<duration>] 
        
           singleBassNote ::=  { "abcdefgABCDEFG>xz" }
          
           bellows ::= "-"|"+" 
        
           note ::= <button>[<row>] | chord 
        
           chord ::= "[" {<button>[<row>]}* "]" 
        
           button ::=  {hexDigit} | "x" | "z" | ">"
        
           row ::= { "'" }*

           duration ::=  number|fracao 

 */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablature)
	window.ABCJS.tablature = {};

ABCJS.tablature.Parse = function( str, vars ) {
    this.invalid = false;
    this.finished = false;
    this.warnings = [];
    this.line = str;
    this.vars = vars;
    this.bassNoteSyms = "abcdefgABCDEFG>xz";
    this.trebNoteSyms = "0123456789abcdefABCDEF>xz";
    this.durSyms = "0123456789/.";
    this.belSyms = "+-";
    this.barSyms = ":]|";

    this.warn = function(str) {
        var bad_char = this.line.charAt(this.i);
        if (bad_char === ' ')
            bad_char = "SPACE";
        var clean_line = encode(this.line.substring(0, this.i)) +
                '<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">' + bad_char + '</span>' +
                encode(this.line.substring(this.i + 1));
        addWarning("Music Line:" + /*line*/ 0 + ":" + /*column*/(this.i + 1) + ': ' + str + ": " + clean_line);
    };
    
    var addWarning = function(str) {
        this.warnings.push(str);
    };
    
    var encode = function(str) {
        var ret = window.ABCJS.parse.gsub(str, '\x12', ' ');
        ret = window.ABCJS.parse.gsub(ret, '&', '&amp;');
        ret = window.ABCJS.parse.gsub(ret, '<', '&lt;');
        return window.ABCJS.parse.gsub(ret, '>', '&gt;');
    };

};

ABCJS.tablature.Parse.prototype.parse = function( ) {
    var voice  = [];
    this.i = 0;
    var token = { el_type: "unrecognized" };
    
    while (this.i < this.line.length && !this.finished) {
        token = this.getToken();
        switch (token.el_type) {
            case "bar":
                if( ! this.invalid )
                  voice[voice.length] = {type:token.type, el_type: token.el_type, startChar:0, endChar:0};
                break;
            case "note":
                if( ! this.invalid )
                  voice[voice.length] = this.formatToken(token);
                break;
            case "comment":
            case "unrecognized":
            default:
                break;
        }
    }
    return voice;
};
ABCJS.tablature.Parse.prototype.formatToken = function(token) {
  var el = {el_type: token.el_type, startChar:0, endChar:0};
  el.pitches = [];
  el.duration = token.duration * this.vars.default_length;
  if(token.bassNote) {
    el.pitches[0] = { bass:true, type: "tabText", c: token.bassNote, pitch: 17.5};
  }
  for(var b = 0; b < token.buttons.length; b ++ ) {
    var n = el.pitches.length;
    el.pitches[n] = { c: token.buttons[b], type: "tabText", pitch: token.bellows === "+"? 11.7 : 11.7-6.4  };
  }
  return el ;
};

ABCJS.tablature.Parse.prototype.getToken = function() {
    this.invalid = false;
    this.parseMultiCharToken( ' \t' );
    switch(this.line.charAt(this.i)) {
        case '%':
          this.finished = true;  
          return { el_type:"comment",  token: this.line.substr( this.i+1 ) };
        case '|':
        case ':':
          return this.getBarLine();
        case '[': // se o proximo caracter não for um pipe, deve ser tratado como uma coluna de notas
          if( this.line.charAt(this.i+1) === '|' ) {
            return this.getBarLine();
          }
        default:    
          return this.getColumn();
    }
   
};

ABCJS.tablature.Parse.prototype.parseMultiCharToken = function( syms ) {
    while (this.i < this.line.length && syms.indexOf(this.line.charAt(this.i)) >= 0) {
        this.i++;
    }
};

ABCJS.tablature.Parse.prototype.getBarLine = function() {
  var validBars = { 
        "|"   : "bar_thin"
      , "||"  : "bar_thin_thin"
      , "[|"  : "bar_thick_thin"
      , "|]"  : "bar_thin_thick"
      , ":|:" : "bar_dbl_repeat"
      , ":||:": "bar_dbl_repeat"
      , "::"  : "bar_dbl_repeat" 
      , "|:"  : "bar_left_repeat"
      , "||:" : "bar_left_repeat"
      , "[|:" : "bar_left_repeat"
      , ":|"  : "bar_right_repeat"
      , ":||" : "bar_right_repeat"
      , ":|]" : "bar_right_repeat"
  };
  
  var token = { el_type:"bar", type:"bar", token: undefined };
  var p = this.i;
  
  this.parseMultiCharToken(this.barSyms);
  
  token.token = this.line.substr( p, this.i-p );
  this.finished =  this.i >= this.line.length;
  
  // validar o tipo de barra
  token.type = validBars[token.token];
  this.invalid = !token.type;
  return token;
};

ABCJS.tablature.Parse.prototype.getColumn = function() {
    var token = {el_type: "note", type: "note", bassNote: undefined, bellows: "", buttons: [], duration: 1};

    if (this.belSyms.indexOf(this.line.charAt(this.i)) < 0) {
        token.bassNote = this.getSingleBassNote();
    }
    token.bellows = this.getBelows();
    token.buttons = this.getNote();
    token.duration = this.getDuration();
    this.finished = this.i >= this.line.length;
    return token;

};

ABCJS.tablature.Parse.prototype.getSingleBassNote = function() {
  var note = "";
  if( this.bassNoteSyms.indexOf(this.line.charAt(this.i)) < 0 ) {
    this.warn( "Expected Bass Note but found " + this.line.charAt(this.i) );
  } else {
    note = this.line.charAt(this.i);
    this.i++;
  }
  return note;
};

ABCJS.tablature.Parse.prototype.getDuration = function() {
    var dur = 1;
    var p = this.i;

    this.parseMultiCharToken(this.durSyms);
    
    if (p !== this.i) {
        dur = this.line.substr(p, this.i - p);
        if (isNaN(eval(dur))) {
          this.warn( "Expected numeric or fractional note duration, but found " + dur);
        } else {
            dur = eval(dur);
        }
    }
    return dur;
};

ABCJS.tablature.Parse.prototype.getBelows = function() {
    if(this.belSyms.indexOf(this.line.charAt(this.i)) < 0 ) {
       this.warn( "Expected belows information, but found " + this.line.charAt(this.i) );
       this.invalid = true;
       return '+';
    } else {
        this.i++;
        return this.line.charAt(this.i-1);
    }
};

ABCJS.tablature.Parse.prototype.getNote = function() {
  var b = [];
  switch( this.line.charAt(this.i) ) {
      case '[':
         this.i++;
         b = this.getChord();
         break;
      default: 
         b[b.length] = this.getButton();
  }
  return b;
};

ABCJS.tablature.Parse.prototype.getChord = function( token ) {
    var b = [];
    while (this.i < this.line.length && this.line.charAt(this.i) !== ']' ) {
        b[b.length] = this.getButton();
    }
    if( this.line.charAt(this.i) !== ']' ) {
       this.warn( "Expected end of chord - ']'");
       this.invalid = true;
    } else {
        this.i++;
    }
    return b;
};

ABCJS.tablature.Parse.prototype.getButton = function() {
    var c = "x";
    var row = "";
    
    if(this.trebNoteSyms.indexOf(this.line.charAt(this.i)) < 0 ) {
       this.warn( "Expected button number, but found " + this.line.charAt(this.i));
    } else {
        c = this.line.charAt(this.i);
        switch(c) {
            case '>':
            case 'x':
            case 'z':
               break;
            default:   
                c = isNaN(parseInt(c, 16))? 'x': parseInt(c, 16).toString();
        }
    }
    this.i++;
    
    var p = this.i;

    this.parseMultiCharToken("'");
    
    if (p !== this.i) 
        row = this.line.substr(p, this.i - p);
        
    return c + row;
};

ABCJS.tablature.Infer = function( accordion, tune, strTune, vars ) {
    this.accordion = accordion;
    this.abcText = strTune;
    this.vars = vars;
    this.tune = tune;
    this.tuneCurrLine = 0;
    this.voice = [];
};

ABCJS.tablature.Infer.prototype.abcElem2TabElem = function(elem, bass) {
    var cp = ABCJS.parse.clone(elem);
    if (cp.rest ) {
        if(!cp.pitches) {
            cp.pitches =  [];
        }
        cp.rest.pitch = 0;
        cp.rest.verticalPos = 0;
        cp.rest.type="rest";
        cp.pitches[cp.pitches.length] = ABCJS.parse.clone(cp.rest);
        delete clone.rest;
    }
    
    if(! cp.pitches ) return cp;
    
    for(var e = 0; e < cp.pitches.length; e ++ ){
      cp.inTie = cp.pitches[e].startTie?true:cp.pitches[e].endTie?false:undefined;
      delete cp.pitches[e].startTie;
      delete cp.pitches[e].endTie;
    }
    if(bass) {
        if( cp.pitches.length > 1 ) {
          // TODO: keep track of minor chords (and 7th)
          // note = this.accordion.identifyChord(abselem.children, aNotes, verticalPos, acc, keyAcc, -7); /*transpose -1 octave for better apresentation */
          ABCJS.write.sortPitch(cp);
          cp.pitches.splice(1, cp.pitches.length - 1);
        }
        cp.pitches[0].bass = true;
    }   
    return cp;
};

ABCJS.tablature.Infer.prototype.accordionTabVoice = function(line) {
    
    if( this.tune.tabStaffPos < 1 ) return; // we expect to find at least the melody line above tablature, otherwise, we cannot infer it.
    
    this.tuneCurrLine = line;
    this.producedLine = "";
    this.count = 0;
    this.limit = 5; // inverte o movimento do fole - deveria ser baseado no tempo das notas.
    this.lastButton = -1;
    this.closing = true;
    
    var balance = 0; // só faz sentido quando há duas vozes: baixo e melodia
    var trebDuration  = 0;
    var bassDuration  = 0;
    var idxTreb       = this.voice.length;
    var idxBass       = this.voice.length;
    var remainingBass = undefined;
    var remainingTreb = undefined;
    var inTieBass     = false;
    var inTieTreb     = false;
    
    var trebVoice  = this.tune.lines[this.tuneCurrLine].staffs[0].voices[0];
    this.accTrebKey = this.tune.lines[this.tuneCurrLine].staffs[0].key.accidentals;
    this.vposTrebStave = this.tune.lines[this.tuneCurrLine].staffs[0].clef.verticalPos;
    
    if( this.tune.tabStaffPos === 2 ) {
      var bassVoice  = this.tune.lines[this.tuneCurrLine].staffs[1].voices[0];
      this.accBassKey = this.tune.lines[this.tuneCurrLine].staffs[1].key.accidentals;
      this.vposBassStave = this.tune.lines[this.tuneCurrLine].staffs[0].clef.verticalPos;
    }  
   
    while (idxTreb < trebVoice.length || ( bassVoice && idxBass < bassVoice.length ) ) {
        
        var abcTrebElem = {};
        var abcBassElem = {};
        var leu = false;
        
        if (idxTreb < trebVoice.length && balance >= 0 ) {
            abcTrebElem = this.abcElem2TabElem(trebVoice[idxTreb], false);
            trebDuration += abcTrebElem.duration|| 0;
            leu = true;
        }
        if (bassVoice && idxBass < bassVoice.length && balance <= 0 ) {
            abcBassElem = this.abcElem2TabElem(bassVoice[idxBass], true );
            bassDuration += abcBassElem.duration||0;
            leu = true;
        }
        if (! leu ) {
            // se chegar aqui é problema ou as linhas de melodia e baixo não são equivalentes
            idxTreb = trebVoice.length;
            idxBass = bassVoice? bassVoice.length : 0;
            continue;
        }
        if (!bassVoice || !abcBassElem ) {
            idxTreb++;
            this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
            inTieTreb = typeof( abcTrebElem.inTie ) === "undefined"? inTieTreb : abcTrebElem.inTie; 
        } else {
            if (balance === 0) {
                idxTreb++;
                idxBass++;
                if (abcBassElem.el_type === 'bar' && abcTrebElem.el_type === 'bar') {
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
                } else if (abcBassElem.el_type === 'bar') {
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
                    idxBass--;
                } else if (abcTrebElem.el_type === 'bar') {
                    this.addTABChild(abcBassElem, inTieTreb, inTieBass);
                    idxTreb--;
                } else if (bassDuration > trebDuration) {
                    remainingBass = ABCJS.parse.clone(abcBassElem.pitches);
                    for (var c = 0; c < abcBassElem.pitches.length; c++) {
                        //abcTrebElem.pitches.push(abcBassElem.pitches[c]);
                        abcTrebElem.pitches.splice( c, 0, abcBassElem.pitches[c] );
                    }
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
                } else if( bassDuration < trebDuration) {
                    remainingTreb = ABCJS.parse.clone(abcTrebElem.pitches);
                    for (var c = 0; c < abcTrebElem.pitches.length; c++) {
                        abcBassElem.pitches.push(abcTrebElem.pitches[c]);
                    }
                    this.addTABChild(abcBassElem, inTieTreb, inTieBass);
                } else {
                    for (var c = 0; c < abcTrebElem.pitches.length; c++) {
                        abcBassElem.pitches.push(abcTrebElem.pitches[c]);
                    }
                    this.addTABChild(abcBassElem, inTieTreb, inTieBass);
                }
            } else if (balance > 0) {
                if (abcTrebElem.el_type === 'bar') {
                    // encontrou nota faltando na melodia - preenche com pausas
                    //trebVoice.splice(idxTreb, 0, this.addMissingRest(balance));
                    //this.addTABChild(this.addMissingRest(balance), inTieTreb, inTieBass);
                    idxTreb++;
                    trebDuration += balance;
                } else {
                    var remaining = typeof( remainingBass ) !== "undefined";
                    if(remaining) {
                        for (var c = 0; c < remainingBass.length; c++) {
                            //abcTrebElem.pitches.push(remainingBass[c]);
                            abcTrebElem.pitches.splice( c, 0,  remainingBass[c] );
                        }
                    }
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass || remaining );
                    delete remainingBass;
                    idxTreb++;
                }
            } else {
                if (abcBassElem.el_type === 'bar') {
                    // encontrou nota faltando no baixo - preenche com pausas
                    //bassVoice.splice(idxBass, 0, this.addMissingRest(-balance));
                    //this.addTABChild(this.addMissingRest(-balance), inTieTreb, inTieBass);
                    idxBass++;
                    bassDuration -= balance;
                } else {
                    var remaining = typeof( remainingTreb) !== "undefined";
                    if( remaining ) {
                        for (var c = 0; c < remainingTreb.length; c++) {
                            abcBassElem.pitches.push(remainingTreb[c]);
                        }
                    }
                    this.addTABChild(abcBassElem, inTieTreb || remaining, inTieBass );
                    delete remainingTreb;
                    idxBass++;
                }
            }
            balance = bassDuration - trebDuration;
            inTieBass = typeof( abcBassElem.inTie ) === "undefined"? inTieBass : abcBassElem.inTie; 
            inTieTreb = typeof( abcTrebElem.inTie ) === "undefined"? inTieTreb : abcTrebElem.inTie; 
        }
    }
    
    this.accordion.setTabLine(this.producedLine);
    this.tune.lines[this.tuneCurrLine].staffs[this.tune.tabStaffPos].inferTablature = false;

    delete this.count;
    delete this.limit;
    delete this.lastButton;
    delete this.closing;
    delete this.accTrebKey;
    delete this.accBassKey;
    delete this.vposTrebStave;
    delete this.vposBassStave;
    delete this.producedLine;
    
    return this.voice;
};

//TODO: tratar startChar e endChar
ABCJS.tablature.Infer.prototype.addTABChild = function(child, inTieTreb, inTieBass) {

    if (child.el_type !== "note") {
        this.voice.push(child);
        this.producedLine += this.abcText.substr(child.startChar,child.endChar-child.startChar) + " ";
        return;
    }

    var offset = -6.4; // inicialmente as notas estão na posição "fechando". Se precisar alterar para "abrindo" este é offset da altura

    var bass;
    var item;
    var column = child.pitches;
    var allOpen = true;
    var allClose = true;
    var baixoClose = true;
    var baixoOpen = true;
    var acc = {};

    if (inTieTreb) {
        child.inTieTreb = true;
    }
    if (inTieBass) {
        child.inTieBass = true;
    }

    var qtdBass = 0;
    for (var c = 0; c < column.length; c++) {
        qtdBass += column[c].bass ? 1 : 0;
    }
    
    var qtd = column.length - qtdBass;
    
    var d = qtd; // pela organização da accordion as notas graves ficam melhor se impressas antes, admitindo que foi escrito em ordem crescente no arquivo abc
    for (var c = 0; c < column.length; c++) {
        item = column[c];
        acc[item.pitch] = this.accordion.transporter.getAccOffset(item.accidental);
        if (item.type === "rest" ) {
                item.pitch = item.bass? 17.5 : 11.7;
        } else {
            if (item.bass) {
                var note = this.accordion.extractCromaticNote(item.pitch, this.vposBassStave, acc, this.accBassKey );
                item.buttons = this.accordion.getButtons(this.accordion.getBassNote(note));
                item.note = note;
                // retira a oitava, mas deveria incluir complementos, tais como menor, 7th, etc.
                item.c = note.substr(0, note.length - 1);
                item.pitch = 17.5;
                item.type = 'tabText';
            } else {
                var note = this.accordion.extractCromaticNote(item.pitch, this.vposTrebStave, acc, this.accTrebKey);
                d--;
                item.buttons = this.accordion.getButtons(note);
                item.note = note;
                item.c = note;
                item.pitch = (qtd === 1 ? 11.7 : qtd === 2 ? 10.6 + d * 2.5 : 9.7 + d * 2.1);
                item.type = "tabText" + (qtd > 1 ? qtd : "");
            }
        }
        
        if (item.type === "tabText") {
            if (item.bass) {
                bass = item;
                if (inTieBass)
                    item.c = '--->';
                this.producedLine += item.c==='--->'?'>':item.c;
                baixoOpen = typeof (item.buttons.open) !== "undefined";
                baixoClose = typeof (item.buttons.close) !== "undefined";
            } else {
                if (inTieTreb)
                    item.c = '--->';
                allOpen = allOpen ? typeof (item.buttons.open) !== "undefined" : false;
                allClose = allClose ? typeof (item.buttons.close) !== "undefined" : false;
            }
        }
    }

    // verifica tudo: baixo e melodia
    if ((this.closing && baixoClose && allClose) || (!this.closing && baixoOpen && allOpen)) {
        // manteve o rumo, mas verifica o fole, virando se necessario (e possivel)
        if (inTieTreb || inTieBass || this.count < this.limit) {
            this.count++;
        } else {
            // neste caso só muda se é possível manter baixo e melodia    
            if ((!this.closing && baixoClose && allClose) || (this.closing && baixoOpen && allOpen)) {
                this.count = 1;
                this.closing = !this.closing;
            }
        }
    } else if ((!this.closing && baixoClose && allClose) || (this.closing && baixoOpen && allOpen)) {
        //mudou o rumo, mantendo baixo e melodia
        this.count = 1;
        this.closing = !this.closing;
    } else {
        // não tem teclas de melodia e baixo simultaneamente: privilegia o baixo, se houver.
        if ((this.closing && ((bass && baixoClose) || allClose)) || (!this.closing && ((bass && baixoOpen) || allOpen))) {
            this.count++;
        } else if ((!this.closing && ((bass && baixoClose) || allClose)) || (this.closing && ((bass && baixoOpen) || allOpen))) {
            if (inTieTreb || (bass && inTieBass) || this.count < this.limit) {
                this.count++;
            } else {
                // neste caso só muda se é possível manter baixo ou melodia    
                if ((!this.closing && (bass && baixoClose) && allClose) || (this.closing && (bass && baixoOpen) && allOpen)) {
                    this.count = 1;
                    this.closing = !this.closing;
                }
            }
        }
    }

    var qtNotes = bass? column.length-1:column.length;
    this.producedLine += this.closing?"+":"-";
    this.producedLine += qtNotes>1?"[":"";
    // segunda passada: altera o que será exibido, conforme definições da primeira passada
    for (var c = 0; c < column.length; c++) {
        item = column[c];
        if (/*item.c.substr(0, 4) === "dots" ||*/ item.type === "rest" ) {
            if (!this.closing && !item.bass)
                item.pitch += offset;
        } else if (!item.bass) {
            if (!this.closing)
                item.pitch += offset;
            if (!inTieTreb)
                item.c = this.elegeBotao(this.closing ? item.buttons.close : item.buttons.open);
        }
        if (!item.bass) {
           this.producedLine += item.c==='--->'?'>':item.c;
        }
    }
    this.producedLine += qtNotes>1?"]":"";
    var dur = child.duration / this.vars.default_length;
    this.producedLine += dur===1?" ":dur.toString() + " ";
    
    this.voice.push(child);
    
};


//retorna um elemento absoluto para a tablatura
ABCJS.tablature.Infer.prototype.UNUSEDprintTABElement = function(the_elem, verticalPos, isTreble, keyAcc) {

    var abselem = new ABCJS.write.AbsoluteElement(the_elem, 0, 0);
    var acc = {};

    //tablatura não possui varios elementos - por hora estou eliminando
    delete abselem.decoration;
    
    if (abselem.pitches) {
        for (var i = 0; i < abselem.pitches.length; i++) {
            if(abselem.pitches[i].startTie) {
              delete abselem.pitches[i].startTie;
              abselem.inTie = true;
            }  
            if(abselem.pitches[i].endTie) {
              delete abselem.pitches[i].endTie;
              abselem.inTie = false;
            }  
        }
    }
    switch (the_elem.el_type) {
        case "note":

            abselem = this.abcLayouter.printNote(the_elem, true, false);
            r = 0;
            var note = "";
            var aNotes = [];
            
            while (r < abselem.children.length) {
                ch = abselem.children[r];
                if (!ch.c || (ch.c.substr(0, 9) !== 'noteheads' && ch.c.substr(0, 5) !== 'rests' && ch.c.substr(0, 4) !== 'dots')) {
                    abselem.children.splice(r, 1);
                    continue;
                }
                if (ch.c.substr(0, 4) === "dots" ) {  
                    if( abselem.children[r+1].c.substr(0,5) === "rests" ) {
                        abselem.children[r].pitch = isTreble ? 13.5 : 19;
                    } else {
                        abselem.children.splice(r, 1);
                        continue;
                    }
                }
                if (ch.c.substr(0, 5) === "rests") {
                    abselem.children[r].pitch = isTreble ? 13.5 : 19;
                }
                
                if (ch.c.substr(0, 9) === 'noteheads') {
                    aNotes[aNotes.length] = r;
                }

                if (ch.c.substr(0, 11) === "accidentals") {
                    acc[ch.pitch] = this.abcLayouter.accordion.transporter.getAccOffset(ch.c);
                }
                r++;
            }
            
            var qtd = aNotes.length;
            if (isTreble) {
                for (var c = 0; c < qtd; c++) {
                    var d = (qtd - 1) - c; // pela organização da accordion as notas graves ficam melhor se impressas antes, admitindo que foi escrito em ordem crescente no arquivo abc
                    note = this.abcLayouter.accordion.extractCromaticNote(abselem.children[aNotes[c]].pitch, verticalPos, acc, keyAcc);
                    abselem.children[aNotes[c]].buttons = this.abcLayouter.accordion.getButtons(note);
                    abselem.children[aNotes[c]].note = note;
                    abselem.children[aNotes[c]].c = note;
                    abselem.children[aNotes[c]].pitch = (qtd === 1 ? 11.7 : qtd === 2 ? 10.6 + d * 2.5 : 9.7 + d * 2.1);
                    abselem.children[aNotes[c]].type = "tabText" + (qtd > 1 ? qtd : "");
                }
            } else {
                if(qtd > 0 ) {
                    if (qtd > 1) {
                        // TODO: keep track of minor chords (and 7th)
                        note = this.abcLayouter.accordion.identifyChord(abselem.children, aNotes, verticalPos, acc, keyAcc, -7); /*transpose -1 octave for better apresentation */
                        abselem.children.splice(1, qtd - live1);
                    } else {
                      note = this.abcLayouter.accordion.extractCromaticNote(abselem.children[aNotes[0]].pitch, verticalPos, acc, keyAcc, -7); /*transpose -1 octave for better apresentation */
                    }
                    abselem.children[0].buttons = this.abcLayouter.accordion.getButtons(this.abcLayouter.accordion.getBassNote(note));
                    abselem.children[0].note = note;
                    // retira a oitava, mas deveria incluir complementos, tais como menor, 7th, etc.
                    abselem.children[0].c = note.substr(0, note.length - 1);
                    abselem.children[0].pitch = 17.5;
                    abselem.children[0].type = 'tabText';
                    abselem.children[0].bass = true;
                }
            }
            break;
        case "bar":
            if (!isTreble)  break;
            abselem = this.abcLayouter.printBarLine(the_elem);
            if (this.voice.duplicate)
                abselem.invisible = true;
            break;
        default:
            abselem.addChild(new ABCJS.write.RelativeElement("element type " + the_elem.el_type, 0, 0, 0, {type: "debug"}));
    }
    return abselem;
};

// tenta encontrar o botão mais próximo do último
ABCJS.tablature.Infer.prototype.elegeBotao = function( array ) {
    if(typeof(array) === "undefined" ) return "x";

    var b    = array[0];
    var v    = parseInt(isNaN(b.substr(0,2))? b.substr(0,1): b.substr(0,2));
    var min  = Math.abs(v-this.lastButton);
    
    for( var a = 1; a < array.length; a ++ ) {
        v    = parseInt(isNaN(array[a].substr(0,2))? array[a].substr(0,1): array[a].substr(0,2));
        if( Math.abs(v-this.lastButton) < min ) {
           b = array[a];
           min  = Math.abs(v-this.lastButton);
        }
    }
    this.lastButton = parseInt( isNaN(b.substr(0,2))? b.substr(0,1): b.substr(0,2) );
    return b;
};

// tentativa de tornar iguais os compassos da melodia e do baixo, para a tablatura ficar melhor
ABCJS.tablature.Infer.prototype.addMissingRest = function(p_duration)
{
    var the_elem = {
        averagepitch: 7,
        duration: p_duration,
        el_type: 'note',
        endChar: 0,
        maxpitch: 7,
        minpitch: 7,
        rest: {type: 'rest'},
        startChar: 0
    };

    return this.abcLayouter.printNote(the_elem, true, false);

};
