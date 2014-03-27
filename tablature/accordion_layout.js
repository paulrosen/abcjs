/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablature)
	window.ABCJS.tablature = {};
    
ABCJS.tablature.Layout = function( abc_layouter ) {
   this.abcLayouter = abc_layouter;
};

ABCJS.tablature.Layout.prototype.mergeNotesFromTrebleNBass = function() {
    
    if( this.abcLayouter.tune.tabStaffPos < 1 ) return; // we expect to find at least the melody line above tablature, otherwise, we cannot infer it.
    
    this.count = 0;
    this.limit = 5; // inverte o movimento do fole - deveria ser baseado no tempo das notas.
    this.lastButton = -1;
    this.closing = true;
    
    var balance = 0; // só faz sentido quando há duas vozes: baixo e melodia
    var trebDuration = 0;
    var bassDuration = 0;
    var idxTreb = this.abcLayouter.voice.children.length;
    var idxBass = this.abcLayouter.voice.children.length;
    var remainingBass = undefined;
    var remainingTreb = undefined;
    var inTieBass = false;
    var inTieTreb = false;
    
    var trebVoice  = this.abcLayouter.staffgroup.voices[0];
    var accTrebKey = this.abcLayouter.tune.lines[this.abcLayouter.tuneCurrLine].staffs[0].key.accidentals;
    
    if( this.abcLayouter.tune.tabStaffPos === 2 ) {
      var bassVoice  = this.abcLayouter.staffgroup.voices[1];
      var accBassKey = this.abcLayouter.tune.lines[this.abcLayouter.tuneCurrLine].staffs[1].key.accidentals;
    }  
   
    while (idxTreb < trebVoice.children.length || ( bassVoice && idxBass < bassVoice.children.length ) ) {
        
        var absTrebElem;
        var absBassElem;
        var leu = false;
        
        if (idxTreb < trebVoice.children.length && balance >= 0 ) {
            var yPosTreb = trebVoice.stave.clef.verticalPos;
            absTrebElem = this.printTABElement(trebVoice.children[idxTreb].abcelem, yPosTreb, true, accTrebKey);
            trebDuration += absTrebElem.duration;
            leu = true;
        }
        if (bassVoice && idxBass < bassVoice.children.length && balance <= 0 ) {
            var yPosBass = bassVoice.stave.clef.verticalPos;
            absBassElem = this.printTABElement(bassVoice.children[idxBass].abcelem, yPosBass, false, accBassKey);
            bassDuration += absBassElem.duration;
            leu = true;
        }
        if (! leu ) {
            // se chegar aqui é problema ou as linhas de melodia e baixo não são equivalentes
            idxTreb = trebVoice.children.length;
            idxBass = bassVoice? bassVoice.children.length : 0;
            continue;
        }
        if (!bassVoice || !absBassElem ) {
            idxTreb++;
            this.addTABChild(absTrebElem, inTieTreb, inTieBass);
            inTieTreb = typeof( absTrebElem.abcelem.inTie ) === "undefined"? inTieTreb : absTrebElem.abcelem.inTie; 
        } else {
            if (balance === 0) {
                idxTreb++;
                idxBass++;
                if (absBassElem.abcelem.el_type === 'bar' && absTrebElem.abcelem.el_type === 'bar') {
                    this.addTABChild(absTrebElem, inTieTreb, inTieBass);
                } else if (absBassElem.abcelem.el_type === 'bar') {
                    this.addTABChild(absTrebElem, inTieTreb, inTieBass);
                    idxBass--;
                } else if (absTrebElem.abcelem.el_type === 'bar') {
                    this.addTABChild(absBassElem, inTieTreb, inTieBass);
                    idxTreb--;
                } else if (bassDuration > trebDuration) {
                    remainingBass = this.cloneChildren(absBassElem.children);
                    for (var c = 0; c < absBassElem.children.length; c++) {
                        //absTrebElem.children.push(absBassElem.children[c]);
                        absTrebElem.children.splice( c, 0, absBassElem.children[c] );
                    }
                    this.addTABChild(absTrebElem, inTieTreb, inTieBass);
                } else if( bassDuration < trebDuration) {
                    remainingTreb = this.cloneChildren(absTrebElem.children);
                    for (var c = 0; c < absTrebElem.children.length; c++) {
                        absBassElem.children.push(absTrebElem.children[c]);
                    }
                    this.addTABChild(absBassElem, inTieTreb, inTieBass);
                } else {
                    for (var c = 0; c < absTrebElem.children.length; c++) {
                        absBassElem.children.push(absTrebElem.children[c]);
                    }
                    this.addTABChild(absBassElem, inTieTreb, inTieBass);
                }
            } else if (balance > 0) {
                if (absTrebElem.abcelem.el_type === 'bar') {
                    // encontrou nota faltando na melodia - preenche com pausas
                    trebVoice.children.splice(idxTreb, 0, this.addMissingRest(balance));
                    this.addTABChild(this.addMissingRest(balance), inTieTreb, inTieBass);
                    idxTreb++;
                    trebDuration += balance;
                } else {
                    var remaining = typeof( remainingBass ) !== "undefined";
                    if(remaining) {
                        for (var c = 0; c < remainingBass.length; c++) {
                            //absTrebElem.children.push(remainingBass[c]);
                            absTrebElem.children.splice( c, 0,  remainingBass[c] );
                        }
                    }
                    this.addTABChild(absTrebElem, inTieTreb, inTieBass || remaining );
                    delete remainingBass;
                    idxTreb++;
                }
            } else {
                if (absBassElem.abcelem.el_type === 'bar') {
                    // encontrou nota faltando no baixo - preenche com pausas
                    bassVoice.children.splice(idxBass, 0, this.addMissingRest(-balance));
                    this.addTABChild(this.addMissingRest(-balance), inTieTreb, inTieBass);
                    idxBass++;
                    bassDuration -= balance;
                } else {
                    var remaining = typeof( remainingTreb) !== "undefined";
                    if( remaining ) {
                        for (var c = 0; c < remainingTreb.length; c++) {
                            absBassElem.children.push(remainingTreb[c]);
                        }
                    }
                    this.addTABChild(absBassElem, inTieTreb || remaining, inTieBass );
                    delete remainingTreb;
                    idxBass++;
                }
            }
            balance = bassDuration - trebDuration;
            inTieBass = typeof( absBassElem.abcelem.inTie ) === "undefined"? inTieBass : absBassElem.abcelem.inTie; 
            inTieTreb = typeof( absTrebElem.abcelem.inTie ) === "undefined"? inTieTreb : absTrebElem.abcelem.inTie; 
        }
    }
    
    delete this.count;
    delete this.limit;
    delete this.lastButton;
    delete this.closing;
};

ABCJS.tablature.Layout.prototype.addTABChild = function(child, inTieTreb, inTieBass) {

    if (child.abcelem.el_type !== "note") {
        this.abcLayouter.voice.addChild(child);
        return;
    }

    var offset = -6.4; // inicialmente as notas estão na posição "fechando". Se precisar alterar para "abrindo" este é offset da altura

    var bass;
    var item;
    var column = child.children;
    var allOpen = true;
    var allClose = true;
    var baixoClose = true;
    var baixoOpen = true;

    if (inTieTreb) {
        child.inTieTreb = true;
    }
    if (inTieBass) {
        child.inTieBass = true;
    }

    for (var c = 0; c < column.length; c++) {
        item = column[c];
        if (item.type === "tabText") {
            if (item.bass) {
                if (inTieBass)
                    item.c = '--->';
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

    // segunda passada: altera o que será exibido, conforme definições da primeira passada
    for (var c = 0; c < column.length; c++) {
        item = column[c];
        if (item.c.substr(0, 4) === "dots" || item.c.substr(0, 5) === "rests") {
            if (!this.closing && !item.bass)
                item.pitch += offset;
        } else if (!item.bass) {
            if (!this.closing)
                item.pitch += offset;
            if (!inTieTreb)
                item.c = this.elegeBotao(this.closing ? item.buttons.close : item.buttons.open);
        }
    }

    this.abcLayouter.voice.addChild(child);
};


//retorna um elemento absoluto para a tablatura
ABCJS.tablature.Layout.prototype.printTABElement = function(the_elem, verticalPos, isTreble, keyAcc) {

    var abselem = new ABCJS.write.AbsoluteElement(the_elem, 0, 0);
    var acc = {};

    //tablatura não possui varios elementos - por hora estou eliminando
    delete abselem.abcelem.decoration;
    
    if (abselem.abcelem.pitches) {
        for (var i = 0; i < abselem.abcelem.pitches.length; i++) {
            if(abselem.abcelem.pitches[i].startTie) {
              delete abselem.abcelem.pitches[i].startTie;
              abselem.abcelem.inTie = true;
            }  
            if(abselem.abcelem.pitches[i].endTie) {
              delete abselem.abcelem.pitches[i].endTie;
              abselem.abcelem.inTie = false;
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
                        abselem.children.splice(1, qtd - 1);
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
            if (this.abcLayouter.voice.duplicate)
                abselem.invisible = true;
            break;
        default:
            abselem.addChild(new ABCJS.write.RelativeElement("element type " + the_elem.el_type, 0, 0, 0, {type: "debug"}));
    }
    return abselem;
};

// tenta encontrar o botão mais próximo do último
ABCJS.tablature.Layout.prototype.elegeBotao = function( array ) {
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

ABCJS.tablature.Layout.prototype.cloneChildren = function(source) {

    var destination = [];
    for(var r = 0; r<source.length;r++) {
       var o = source[r];
       var cp = new ABCJS.write.RelativeElement(o.c, o.dx, o.w, o.pitch, {type:o.type, pitch2:o.pitch2, linewidth:o.linewidth, attributes:o.attributes});
       cp.note = o.note;
       cp.buttons = o.buttons;
       if(o.bass) cp.bass = o.bass;
       destination[destination.length] =  cp;
    }   
    return destination;
};



// tentativa de tornar iguais os compassos da melodia e do baixo, para a tablatura ficar melhor
ABCJS.tablature.Layout.prototype.addMissingRest = function(p_duration)
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
