/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};
    
window.ABCJS.parse.Transport = function ( offSet_ ) {
    
    this.reset = function(offSet_){
        this.offSet           = offSet_;
        this.currKey          = [];
        this.newKeyAcc        = [];
        this.oldKeyAcc        = [];
        this.changedLines     = [];
        this.newX             =  0;
        this.workingX         =  0;
        this.workingLine      = -1;
        this.workingLineIdx  = -1;
    };
    
    this.minNote        = 0x15; //  A0 = first note
    this.maxNote        = 0x6C; //  C8 = last note
    this.pitches       = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6, 
                            c: 7, d: 8, e: 9, f: 10, g: 11, a: 12, b: 13 };
                        
    this.key2number      = {"C":0
                            ,"C♯":1, "D♭":1
                            ,"D":2
                            ,"D♯":3, "E♭":3
                            ,"E":4 
                            ,"F":5
                            ,"F♯":6 ,"G♭":6
                            ,"G":7
                            ,"G♯":8 ,"A♭":8
                            ,"A":9
                            ,"A♯":10,"B♭":10
                            ,"B":11};
    
    this.number2key      = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
    this.number2keysharp = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    this.number2key_br  = ["Dó", "Ré♭", "Ré", "Mi♭", "Mi", "Fá", "Fá♯", "Sol", "Lá♭", "Lá", "Si♭", "Si"];
    this.number2staff   = [    
                 {note:"C", acc:""}
                ,{note:"D", acc:"flat"} 
                ,{note:"D", acc:""}
                ,{note:"E", acc:"flat"} 
                ,{note:"E", acc:""} 
                ,{note:"F", acc:""}
                ,{note:"G", acc:"flat"} 
                ,{note:"G", acc:""} 
                ,{note:"A", acc:"flat"} 
                ,{note:"A", acc:""} 
                ,{note:"B", acc:"flat"} 
                ,{note:"B", acc:""}
    ];
    
    this.number2staffSharp   = [    
                 {note:"C", acc:""}
                ,{note:"C", acc:"sharp"}
                ,{note:"D", acc:""} 
                ,{note:"D", acc:"sharp"}
                ,{note:"E", acc:""} 
                ,{note:"F", acc:""} 
                ,{note:"F", acc:"sharp"}
                ,{note:"G", acc:""} 
                ,{note:"G", acc:"sharp"} 
                ,{note:"A", acc:""} 
                ,{note:"A", acc:"sharp"} 
                ,{note:"B", acc:""} 
    ];
    
    this.reset(offSet_);
   
};

window.ABCJS.parse.Transport.prototype.numberToStaff = function(number, newKacc) {
    var s ;
    if(newKacc.length > 0 && newKacc[0].acc === 'flat')
        s = this.number2staff[number];
    else
        s = this.number2staffSharp[number];
    
    // octave can be altered below
    s.octVar = 0;
    
    if(s.acc === "" && ("EFBC").indexOf(s.note) >= 0 ) {
        var o ;
        switch(s.note) {
            case 'E':
                //procurar Fflat
                o = {note:'F',acc:'flat', octVar:0};
                break;
            case 'F':
                //procurar Esharp
                o = {note:'E',acc:'sharp', octVar:0};
                break;
            case 'B':
                //procurar Cflat
                o = {note:'C',acc:'flat', octVar:1};
                break;
            case 'C':
                //procurar Bsharp
                o = {note:'B',acc:'sharp', octVar:-1};
                break;
        }
        for( var a = 0; a < newKacc.length; a ++ ) {
            if( newKacc[a].note.toUpperCase() === o.note && newKacc[a].acc === o.acc ){
                s = o;
                break;
            }
        }
    }
    return s;
};

window.ABCJS.parse.Transport.prototype.transposeRegularMusicLine = function(str, line, lineNumber) {

    if( str.trim() !== line.trim() ) 
        alert( "window.ABCJS.parse.Transport.prototype.TransposeRegularMusicLine: isto não devia acontecer!\nstr.:"+str+".\nline:"+line+".");
    
    var index = 0;
    var found = false;
    var inside = false;
    var state = 0;
    var lastState = 0;
    var xi = -1;
    var xf = -1;
    var accSyms = "^_=";  // state 1
    var pitSyms = "ABCDEFGabcdefg"; // state 2
    var octSyms = ",\'"; // state 3
    var exclusionSyms = '"!+'; 
    
    this.workingLine = line;
    this.workingLineIdx = this.changedLines.length;
    this.changedLines[ this.workingLineIdx ] = { line:lineNumber, text: line };
    this.workingX = 0;
    this.newX =0;
    this.baraccidentals = [];
    this.baraccidentalsNew = [];
    
    
    while (index < line.length) {
        found = false;
        inside = false;
        lastState = 0;
        while (index < line.length && !found) {
            
            // ignora o conteúdo de accents
            if( exclusionSyms.indexOf(line.charAt(index)) >= 0 ) {
                var nextPos = line.substr( index+1 ).indexOf(line.charAt(index));
                if( nextPos < 0 ) {
                    index = line.length;
                } else {
                    if(line.charAt(index)==='"') {
                        //transpor acorde textual - aqui não está tratando bemois e sustenidos...
                        //alem disso, trata com abc note, ou seja, tem maiusculas e minusculas
                        this.transposeNote(index+1, 1);
                    }
                    index += nextPos + 2;
                }
                continue;
            }
            
            if(line.charAt(index) === '|'){
                this.baraccidentals = [];
                this.baraccidentalsNew = [];
            }
            
            state = 
              accSyms.indexOf(line.charAt(index)) >= 0 ? 1 : 
              pitSyms.indexOf(line.charAt(index)) >= 0 ? 2 :
              octSyms.indexOf(line.charAt(index)) >= 0 ? 3 : 0;
            
            if( ( state < lastState && inside ) || (lastState === 2 && state === 2 && inside ) ) {
               found = true;
               xf = index;
            } else if( state > lastState && !inside) {
              inside = true;
              xi = index;
            }
            
            lastState = state;
            state = 0;
            
            if (found) {
                this.transposeNote(xi, xf - xi);
            } else {
              index++;
            }   
        }
        if(inside && !found)
          this.transposeNote(xi, index - xi);
    }
    return this.changedLines[ this.workingLineIdx ].text;
};

window.ABCJS.parse.Transport.prototype.transposeNote = function(xi, size )
{
    var abcNote = this.workingLine.substr(xi, size);
    var elem = this.makeElem(abcNote);
    var pitch = elem.pitch;
    var oct = this.extractStaffOctave(pitch);
    var crom = this.staffNoteToCromatic(this.extractStaffNote(pitch));

    var txtAcc = elem.accidental;
    var dAcc = this.getAccOffset(txtAcc);
    
    if(elem.accidental) {
        this.baraccidentals[pitch] = dAcc;
    }

    var dKi = this.getKeyAccOffset(this.numberToKey(crom), this.oldKeyAcc);

    var newNote = 0;
    if (this.baraccidentals[pitch] !== undefined) {
        newNote = crom + this.baraccidentals[pitch] + this.offSet;
    } else { // use normal accidentals
        newNote = crom + dKi + this.offSet;
    }

    var newOct = this.extractCromaticOctave(newNote);
    var newNote = this.extractCromaticNote(newNote);

    var newStaff = this.numberToStaff(newNote, this.newKeyAcc);
    var dKf = this.getKeyAccOffset(newStaff.note, this.newKeyAcc);

    pitch = this.getPitch(newStaff.note, oct + newOct + newStaff.octVar );
    dAcc = this.getAccOffset(newStaff.acc);

    var newElem = {};
    newElem.pitch = pitch;
    if(newStaff.acc !== '' ) newElem.accidental = newStaff.acc;
    
    // se a nota sair com um acidente (inclusive natural) registrar acidente na barra para o pitch.
    var dBarAcc = this.baraccidentalsNew[newElem.pitch] ;
    if(dAcc === 0) {
        if( dBarAcc && dBarAcc !==0 || dKf !== 0) {
          newElem.accidental = 'natural';
        }
    } else {
        if( dBarAcc && dBarAcc !== 0 ) {
           if(dBarAcc === dAcc ) delete newElem.accidental;
        } else if(dKf !== 0) {
           if(dKf === dAcc ) delete newElem.accidental;
        }
    }
    
    if( newElem.accidental ) {
      this.baraccidentalsNew[newElem.pitch] = newElem.accidental;
    }
    

    oct = this.extractStaffOctave(pitch);
    var key = this.numberToKey(this.staffNoteToCromatic(this.extractStaffNote(pitch)));
    txtAcc = newElem.accidental;
    abcNote = this.getAbcNote(key, txtAcc, oct);
    var p0 = this.changedLines[this.workingLineIdx].text.substr(0, this.newX);
    var p1 = this.workingLine.substr(this.workingX, xi - this.workingX);
    var p2 = this.workingLine.substr(xi + size);
    this.workingX = xi + size;
    this.changedLines[this.workingLineIdx].text = p0 + p1 + abcNote;
    this.newX = this.changedLines[this.workingLineIdx].text.length;
    this.changedLines[this.workingLineIdx].text += p2;
    return newElem;

};

window.ABCJS.parse.Transport.prototype.getAbcNote = function( key, txtAcc, oct) {
   var cOct = "";
   if( oct >= 5 ) {
       key = key.toLowerCase();  
       cOct = Array(oct-4).join("'");
   }  else {
       key = key.toUpperCase();  
       cOct = Array(4-(oct-1)).join(",");
   }
   return this.accNameToABC(txtAcc) + key + cOct;
};

window.ABCJS.parse.Transport.prototype.registerKey = function ( tokenizer, str ) {
    var cKey = "C";
    var tokens = tokenizer.tokenize(str, 0, str.length);
    var retPitch = tokenizer.getKeyPitch(tokens[0].token);

    if (retPitch.len > 0) {
        // The accidental and mode might be attached to the pitch, so we might want to just remove the first character.
        cKey = retPitch.token;
        if (tokens[0].token.length > 1)
            tokens[0].token = tokens[0].token.substring(1);
        else
            tokens.shift();
        // We got a pitch to start with, so we might also have an accidental and a mode
        if (tokens.length > 0) {
            var retAcc = tokenizer.getSharpFlat(tokens[0].token);
            if (retAcc.len > 0) {
                cKey += retAcc.token;
            }
        }
    }
    
    this.currKey[this.currKey.length] = cKey;
    
    return cKey;
};

window.ABCJS.parse.Transport.prototype.transposeKey = function ( tokenizer, str, line, lineNumber ) {
    
    var cKey = this.registerKey( tokenizer, str );
    var newKey = this.keyToNumber( cKey );
    var cNewKey = this.denormalizeAcc( this.numberToKey(newKey + this.offSet ));
    
    this.currKey[this.currKey.length-1] = cNewKey;

    var newStr  = str.replace(cKey, cNewKey );
    var newLine = line.substr( 0, line.indexOf(str) ) + newStr;
    
    this.changedLines[ this.changedLines.length ] = { line:lineNumber, text: newLine };

    this.oldKeyAcc = window.ABCJS.parse.parseKeyVoice.standardKey(cKey);
    this.newKeyAcc = window.ABCJS.parse.parseKeyVoice.standardKey(cNewKey);
    
    return tokenizer.tokenize(newStr, 0, newStr.length);
};

window.ABCJS.parse.Transport.prototype.updateEditor = function ( lines ) {
    for( i = 0; i < this.changedLines.length; i++ ){
        lines[this.changedLines[i].line] = this.changedLines[i].text;
    }
    var newStr = lines[0];
    for( i = 1; i < lines.length; i++ ){
        newStr += '\n' + lines[i];
    }
    this.changedLines = [];
    return newStr;
};

window.ABCJS.parse.Transport.prototype.getKeyVoice = function ( idx ) {
return (this.currKey[idx]?this.currKey[idx]:"C");
};

window.ABCJS.parse.Transport.prototype.normalizeAcc = function ( cKey ) {
    return cKey.replace(/#/g,'♯').replace(/b/g,'♭');
};

window.ABCJS.parse.Transport.prototype.denormalizeAcc = function ( cKey ) {
    return cKey.replace(/♯/g,'#').replace(/♭/g,'b');
};

window.ABCJS.parse.Transport.prototype.getKeyAccOffset = function(note, keyAcc)
// recupera os acidentes da clave e retorna um offset no modelo cromatico
{
  for( var a = 0; a < keyAcc.length; a ++) {
      if( keyAcc[a].note.toLowerCase() === note.toLowerCase() ) {
          return this.getAccOffset(keyAcc[a].acc);
      }
  }
  return 0;    
};
               
window.ABCJS.parse.Transport.prototype.staffNoteToCromatic = function (note) {
  return note*2 + (note>2?-1:0);
};

//window.ABCJS.parse.Transport.prototype.cromaticToStaffNote = function (note) {
//  return (note>5?note+1:note)/2;
//};

window.ABCJS.parse.Transport.prototype.extractStaffNote = function(pitch) {
    pitch = pitch % 7;
    return pitch<0? pitch+=7:pitch;
};

window.ABCJS.parse.Transport.prototype.extractCromaticOctave = function(pitch) {
    return Math.floor(pitch/12) ;
};

window.ABCJS.parse.Transport.prototype.extractCromaticNote = function(pitch) {
    pitch = pitch % 12;
    return pitch<0? pitch+=12:pitch;
};

window.ABCJS.parse.Transport.prototype.extractStaffOctave = function(pitch) {
    return Math.floor((28 + pitch) / 7);
};

window.ABCJS.parse.Transport.prototype.numberToKey = function(number) {
    number %= this.number2key.length;
    if( number < 0 ) number += this.number2key.length;
    return this.number2key[number];
};

window.ABCJS.parse.Transport.prototype.keyToNumber = function(key) {
    key = this.normalizeAcc(key);
    return this.key2number[key];
};

window.ABCJS.parse.Transport.prototype.getAccOffset = function(txtAcc)
// a partir do nome do acidente, retorna o offset no modelo cromatico
{
    var ret = 0;

    switch (txtAcc) {
        case 'accidentals.dblsharp':
        case 'dblsharp':
            ret = 2;
            break;
        case 'accidentals.sharp':
        case 'sharp':
            ret = 1;
            break;
        case 'accidentals.nat':
        case 'nat':
        case 'natural':
            ret = 0;
            break;
        case 'accidentals.flat':
        case 'flat':
            ret = -1;
            break;
        case 'accidentals.dblflat':
        case 'dblflat':
            ret = -2;
            break;
    }
    return ret;
};

window.ABCJS.parse.Transport.prototype.accNameToABC = function(txtAcc)
// a partir do nome do acidente, retorna o offset no modelo cromatico
{
    var ret = "";

    switch (txtAcc) {
        case 'accidentals.dblsharp':
        case 'dblsharp':
            ret = "^^";
            break;
        case 'accidentals.sharp':
        case 'sharp':
            ret = '^';
            break;
        case 'accidentals.nat':
        case 'nat':
        case 'natural':
            ret = "=";
            break;
        case 'accidentals.flat':
        case 'flat':
            ret = '_';
            break;
        case 'accidentals.dblflat':
        case 'dblflat':
            ret = '__';
            break;
    }
    return ret;
};

window.ABCJS.parse.Transport.prototype.accAbcToName = function(abc)
// a partir do nome do acidente, retorna o offset no modelo cromatico
{
    var ret = "";

    switch (abc) {
        case '^^':
            ret = "dblsharp";
            break;
        case '^':
            ret = 'sharp';
            break;
        case '=':
            ret = "natural";
            break;
        case '_':
            ret = 'flat';
            break;
        case '__':
            ret = 'dblflat';
            break;
    }
    return ret;
};

window.ABCJS.parse.Transport.prototype.getAccName = function(offset)
{
    var names = ['dblflat','flat','natural','sharp','dblsharp'];
    return names[offset+2];
};

window.ABCJS.parse.Transport.prototype.getPitch = function( staff, octave) {
   return this.pitches[staff] + (octave - 4) * 7; 
};

window.ABCJS.parse.Transport.prototype.makeElem = function(abcNote){
   var pitSyms = "ABCDEFGabcdefg"; // 2
   var i = 0;
   while( pitSyms.indexOf(abcNote.charAt(i)) === -1 ) {
       i++;
   }
   var acc = this.accAbcToName(abcNote.substr(0,i));
   var pitch = this.pitches[abcNote.charAt(i)];
   while( i < abcNote.length ) {
      switch ( abcNote.charAt(i) ) {
          case "'": pitch +=7; break;
          case "," : pitch -=7; break;
      }
      i++;
   }
   return ( acc ? { pitch: pitch, accidental: acc } : { pitch: pitch } );
};
