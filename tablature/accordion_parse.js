/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 
            Definição da sintaxe para tablatura
        
           " |: G1/2 +5'2g-6>-5 | G-3'2d-5d-[678]1/2 | G+5d-5d-> | G-xd-5d-6 | +{786'}2 | +11/2 | c+ac+b |"
        
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

ABCJS.tablature.Parse = function( str ) {
    this.invalid = false;
    this.finished = false;
    this.warnings = [];
    this.line = str;
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
        //addWarning("Music Line:" + tune.getNumLines() + ":" + (this.i + 1) + ': ' + str + ": " + clean_line);
        addWarning("Music Line:" + 0 + ":" + (this.i + 1) + ': ' + str + ": " + clean_line);
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
    var tab  = { children: [] };
    this.i = 0;
    var token = { type: "unrecognized" };
    
    while (this.i < this.line.length && !this.finished) {
        token = this.getToken();
        switch (token.type) {
            case "bar":
            case "column":
            case "comment":
            case "unrecognized":
            default:
                if( ! this.invalid )
                  tab.children[tab.children.length] = token;
                break;
        }
    }
    return tab;
};

ABCJS.tablature.Parse.prototype.getToken = function() {
    this.invalid = false;
    this.parseMultiCharToken( ' \t' );
    switch(this.line.charAt(this.i)) {
        case '%':
          this.finished = true;  
          return { type:"comment",  token: this.line.substr( this.i+1 ) };
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
  
  var token = { type:"bar",  token: undefined };
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
    var token = {type: "column", bassNote: undefined, bellows: "", buttons: [], duration: 1};

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

    var warn = function(str, line, col_num) {
        var bad_char = line.charAt(col_num);
        if (bad_char === ' ')
            bad_char = "SPACE";
        var clean_line = encode(line.substring(0, col_num)) +
                '<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">' + bad_char + '</span>' +
                encode(line.substring(col_num + 1));
        addWarning("Music Line:" + tune.getNumLines() + ":" + (col_num + 1) + ': ' + str + ":  " + clean_line);
    };
