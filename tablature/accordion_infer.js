/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablature)
	window.ABCJS.tablature = {};
    
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
        delete cp.rest;
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
          cp.pitches[0].chord=true;
        }
        cp.pitches[0].bass = true;
    }   
    return cp;
};

ABCJS.tablature.Infer.prototype.inferTabVoice = function(line) {
    
    if( this.tune.tabStaffPos < 1 || 
        ! this.tune.lines[line].staffs    ) return; // we expect to find at least the melody line above tablature, otherwise, we cannot infer it.
    
    this.tuneCurrLine = line;
    this.producedLine = "";
    this.count = 0;
    this.limit = 5; // inverte o movimento do fole - deveria ser baseado no tempo das notas.
    this.lastButton = -1;
    this.closing = true;
    
    this.bassBarAcc = [];
    this.trebBarAcc = [];
    
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
            if(abcTrebElem.title){
                idxTreb++;
                continue;
            }  
            trebDuration += abcTrebElem.duration|| 0;
            leu = true;
        }
        if (bassVoice && idxBass < bassVoice.length && balance <= 0 ) {
            abcBassElem = this.abcElem2TabElem(bassVoice[idxBass], true );
            if(abcBassElem.title){
                idxBass++;
                continue;
            }  
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
            if(abcTrebElem.el_type === 'bar')
                    this.trebBarAcc = [];
            inTieTreb = typeof( abcTrebElem.inTie ) === "undefined"? inTieTreb : abcTrebElem.inTie; 
        } else {
            if (balance === 0) {
                idxTreb++;
                idxBass++;
                if (abcBassElem.el_type === 'bar' && abcTrebElem.el_type === 'bar') {
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
                    this.bassBarAcc = [];
                    this.trebBarAcc = [];
//                } else if (abcBassElem.el_type === 'bar') {
//                    alert( "ABCJS.tablature.Infer.prototype.accordionTabVoice - abcBassElem.el_type === bar: não devia passar aqui... ");
//                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
//                    idxBass--;
//                } else if (abcTrebElem.el_type === 'bar') {
//                    alert( "ABCJS.tablature.Infer.prototype.accordionTabVoice - abcBassTreb.el_type === bar: não devia passar aqui... ");
//                    this.addTABChild(abcBassElem, inTieTreb, inTieBass);
//                    idxTreb--;
                } else if (bassDuration > trebDuration) {
                    remainingBass = ABCJS.parse.clone(abcBassElem);
                    remainingBass.duration = abcBassElem.duration - abcTrebElem.duration;
                    for (var c = 0; c < abcBassElem.pitches.length; c++) {
                        abcTrebElem.pitches.splice( c, 0, abcBassElem.pitches[c] );
                    }
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass);
                } else if( bassDuration < trebDuration) {
                    remainingTreb = ABCJS.parse.clone(abcTrebElem);
                    remainingTreb.duration = abcTrebElem.duration - abcBassElem.duration;
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
                var remaining = typeof(remainingBass ) !== "undefined"; // && remainingBass.pitches.length > 0;
                var dura = 0;
                if (abcTrebElem.el_type === 'bar') {
                    // encontrou nota faltando na melodia - preenche com pausas
                    var rest = this.addMissingRest(balance);
                    dura = balance;
                    trebVoice.splice(idxTreb, 0, rest);
                    var tabelem = this.abcElem2TabElem(rest, false);
                    if( remaining ) {
                        for (var c = 0; c < remainingBass.pitches.length; c++) {
                            tabelem.pitches.push(ABCJS.parse.clone(remainingBass.pitches[c]));
                        }
                    }
                    this.addTABChild(tabelem, inTieTreb, inTieBass|| remaining);
                    trebDuration += balance;
                    this.trebBarAcc = [];
                } else {
                    if(remaining) {
                        dura = abcTrebElem.duration;
                        for (var c = 0; c < remainingBass.pitches.length; c++) {
                            abcTrebElem.pitches.splice( c, 0, ABCJS.parse.clone(remainingBass.pitches[c]) );
                        }
                    }
                    //trebDuration += dura;
                    this.addTABChild(abcTrebElem, inTieTreb, inTieBass || remaining );
                }
                idxTreb++;
                if(remaining) {
                  remainingBass.duration -= dura;
                  if(remainingBass.duration <= 0 ) remainingBass = undefined;
              }  
            } else {
                var remaining = typeof(remainingTreb) !== "undefined"; // && remainingTreb.pitches.length > 0;
                var dura = 0;
                if (abcBassElem.el_type === 'bar') {
                    // encontrou nota faltando no baixo - preenche com pausas
                    var rest = this.addMissingRest(-balance);
                    dura = -balance;
                    bassVoice.splice(idxBass, 0, rest );
                    var tabelem = this.abcElem2TabElem(rest, true);
                    if( remaining ) {
                        for (var c = 0; c < remainingTreb.pitches.length; c++) {
                            tabelem.pitches.push(ABCJS.parse.clone(remainingTreb.pitches[c]));
                        }
                    }
                    this.addTABChild(tabelem, inTieTreb || remaining, inTieBass);
                    bassDuration -= balance;
                    this.bassBarAcc = [];
                } else {
                    if( remaining ) {
                        dura = abcBassElem.duration;
                        for (var c = 0; c < remainingTreb.pitches.length; c++) {
                            abcBassElem.pitches.push(ABCJS.parse.clone(remainingTreb.pitches[c]));
                        }
                    }
                    //bassDuration += dura;
                    this.addTABChild(abcBassElem, inTieTreb || remaining, inTieBass );
                }
                idxBass++;
                if(remaining) {
                  remainingTreb.duration -= dura;
                  if(remainingTreb.duration <= 0 ) remainingTreb = undefined;
                }  
            }
            balance = bassDuration - trebDuration;
            inTieBass = typeof( abcBassElem.inTie ) === "undefined"? inTieBass : abcBassElem.inTie; 
            inTieTreb = typeof( abcTrebElem.inTie ) === "undefined"? inTieTreb : abcTrebElem.inTie; 
        }
    }
    
    this.accordion.setTabLine(this.producedLine);

    delete this.count;
    delete this.limit;
    delete this.lastButton;
    delete this.closing;
    delete this.accTrebKey;
    delete this.accBassKey;
    delete this.vposTrebStave;
    delete this.vposBassStave;
    delete this.producedLine;
    delete this.bassBarAcc;
    delete this.trebBarAcc;
    
    return this.voice;
};

//ABCJS.tablature.Infer.prototype.identifyChord = function (children, aNotes, verticalPos, acc, keyAcc, transpose) {
//TODO: tratar adequadamente os acordes (de baixo)      
//    var note = this.onvertToCromaticNote(children[aNotes[0]].pitch, verticalPos, acc, keyAcc, transpose );
//    return children.length > 1 ? note.toLowerCase() : note;
//};

ABCJS.tablature.Infer.prototype.getNoteName = function(item, deltapitch, keyAcc, barAcc ) {
// mapeia 
//  de: nota da pauta + acidentes (tanto da clave, quanto locais)
//  para: valor da nota cromatica (com oitava)

    var p = item.pitch + deltapitch;
    var n = this.accordion.transposer.staffNoteToCromatic(this.accordion.transposer.extractStaffNote(p));
    var oitava = this.accordion.transposer.extractStaffOctave(p);
    var staffNote = this.accordion.transposer.numberToKey(n);
    
    if(item.accidental) {
        barAcc[item.pitch] = this.accordion.transposer.getAccOffset(item.accidental);
        n += barAcc[item.pitch];
    } else {
        if(typeof(barAcc[item.pitch]) !== "undefined") {
          n += barAcc[item.pitch];
        } else {
          n += this.accordion.transposer.getKeyAccOffset(staffNote, keyAcc);
        }
    }
    
    oitava += (n < 0 ? -1 : (n > 11 ? 1 : 0 ));
    n       = (n < 0 ? 12+n : (n > 11 ? n%12 : n ) );
    
    //return n + oitava;
    return this.accordion.transposer.numberToKey(n) + oitava;
};

ABCJS.tablature.Infer.prototype.getXi = function() {
  return this.producedLine.length;
};

ABCJS.tablature.Infer.prototype.registerLine = function(appendStr) {
  this.producedLine += appendStr;
  return this.producedLine.length;
};

ABCJS.tablature.Infer.prototype.add = function(child, xi, xf) {
  child.startChar = this.vars.iChar+xi;
  child.endChar = this.vars.iChar+xf;
  this.voice.push(child);
};

ABCJS.tablature.Infer.prototype.addTABChild = function(child, inTieTreb, inTieBass) {

    if (child.el_type !== "note") {
        var xi = this.getXi();
        var xf = this.registerLine(this.abcText.substr(child.startChar, child.endChar - child.startChar) + " ");
        this.add(child, xi, xf - 1);
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

    child.inTieTreb = inTieTreb;
    child.inTieBass = inTieBass;

    var qtdBass = 0;
    
    for (var c = 0; c < column.length; c++) {
        qtdBass += column[c].bass ? 1 : 0;
    }

    var qtd = column.length - qtdBass;

    var d = qtd; // pela organização da accordion as notas graves ficam melhor se impressas antes, admitindo que foi escrito em ordem crescente no arquivo abc
    var xi = this.getXi();
    for (var c = 0; c < column.length; c++) {
        item = column[c];
        bass = bass ? bass : item.bass;
        if (item.type === "rest") {
            item.pitch = item.bass ? 18 : 12.2;
        } else {
            if (item.bass) {
                //merda...preciso do valor e também da letra
                var note = this.getNoteName(item, this.vposBassStave, this.accBassKey, this.bassBarAcc);
                if (item.chord)
                    note = note.toLowerCase();
                // retira a oitava, mas deveria incluir complementos, tais como menor, 7th, etc.
                item.buttons = this.accordion.getButtons(note, true);
                note = note.substr(0, note.length - 1);
                item.note = note;
                item.c = note;
                item.pitch = 17.5;
                item.type = 'tabText';
            } else {
                var note = this.getNoteName(item, this.vposTrebStave, this.accTrebKey, this.trebBarAcc);
                d--;
                item.buttons = this.accordion.getButtons(note, false);
                item.note = note;
                item.c = note;
                item.pitch = ((qtd === 1 ? 11.7 : (qtd === 2 ? 10.6 + d * 2.5 : 9.7 + d * 2.1)));
                item.type = "tabText" + (qtd > 1 ? qtd : "");
            }
        }

        if (item.type === "rest") {
            if (item.bass) {
                bass = item;
                this.registerLine('z');
            }
        } else if (item.type.indexOf("tabText") >=0) {
            if (item.bass) {
                bass = item;
                if (inTieBass)
                    item.c = '--->';
                this.registerLine(item.c === '--->' ? '>' : item.c);
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

    var qtNotes = bass ? column.length - 1 : column.length;
    this.registerLine(this.closing ? "+" : "-");
    this.registerLine(qtNotes > 1 ? "[" : "");
    child.bellows = this.closing ? "+" : "-";

    // segunda passada: altera o que será exibido, conforme definições da primeira passada
    for (var c = 0; c < column.length; c++) {
        item = column[c];
        if (!item.bass) {
            if (!this.closing)
                item.pitch += offset;
            if (/*item.c.substr(0, 4) === "dots" ||*/ item.type === "rest") {
                this.registerLine('z');
            } else {
                if (!inTieTreb) {
                    item.c = this.elegeBotao(this.closing ? item.buttons.close : item.buttons.open);
                    this.registerLine(this.button2Hex(item.c));
                } else {
                    this.registerLine('>');
                }
            }
        }
    }
    var dur = child.duration / this.vars.default_length;
    var xf = this.registerLine((qtNotes > 1 ? "]" : "") + (dur !== 1 ? dur.toString() : "") + " ");
    this.add(child, xi, xf-1);
};

ABCJS.tablature.Infer.prototype.button2Hex = function( b ) {
    if(b === 'x') return b;
    var p = parseInt( isNaN(b.substr(0,2)) || b.length === 1 ? 1 : 2 );
    var n = b.substr(0, p);
    return (+n).toString(16) + b.substr(p);
};
// tenta encontrar o botão mais próximo do último
ABCJS.tablature.Infer.prototype.elegeBotao = function( array ) {
    if(typeof(array) === "undefined" ) return "x";

    var b     = array[0];
    var v,l,i = b.indexOf("'");
    
    if( i >= 0 ) {
        v = b.substr(0, i);
        l = b.length - i;
    } else {
        v = parseInt(b);
        l = 0;
    }
    
    var min  = Math.abs((l>1?v+12:v)-this.lastButton);
    
    for( var a = 1; a < array.length; a ++ ) {
        i = array[a].indexOf("'");

        if( i >= 0 ) {
            v = array[a].substr(0, i);
            l = array[a].length - i;
        } else {
            v = parseInt(array[a]);
            l = 0;
        }
        
        if( Math.abs((l>1?v+12:v)-this.lastButton) < min ) {
           b = array[a];
           min = Math.abs((l>1?v+12:v)-this.lastButton);
        }
    }
    this.lastButton = parseInt(isNaN(b.substr(0,2))? b.substr(0,1): b.substr(0,2));
    return b;
};

// tentativa de tornar iguais os compassos da melodia e do baixo, para a tablatura ficar melhor
ABCJS.tablature.Infer.prototype.addMissingRest = function(p_duration)
{
    var the_elem = {
        duration: p_duration,
        el_type: 'note',
        endChar: 0,
        rest: {type: 'rest'},
        startChar: 0
    };

    return the_elem;
};
