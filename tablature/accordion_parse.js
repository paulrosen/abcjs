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
        
           coluna ::=  { [<baixo>]<melodia> }*
        
           baixo ::=  <singleBassNote>[<duration>] 
        
           singleBassNote ::=  { "abcdefgABCDEFG>x" }
        
           duration ::=  number|fracao 
        
           melodia ::= <bellows><note>[<duration>]
          
           bellows ::= "-"|"+" 
        
           note ::= <button>[<row>] | chord | groupedNotes 
        
           chord ::= "[" {<note>}* "]" 
        
           groupedNotes ::= "{" {<note>}* "}"
        
           button ::=  {hexDigit} | "x" | ">"
        
           row ::= { "'" }*

 */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.tablature)
	window.ABCJS.tablature = {};

ABCJS.tablature.Parse = function( ) {
  this.line =  "| G1/2-{67[54]8}1/2 |: G1/2 +5'2g-6>-5 | G+5d-5d-> | G-xd-5d-6 | +{786'}2 | +11/2 | c+ac+b |";
  this.bassNoteSyms = "abcdefgABCDEFG>x";
  this.trebNoteSyms = "0123456789abcdefABCDEF>x";
  this.durSyms = "0123456789/.";
  this.belSyms = "+-";
  this.barSyms = ":]|";
  
   this.warn = function( str ) {
     // registrar o warning
   };
  
};

ABCJS.tablature.Parse.prototype.parse = function( ) {
    this.i = 0;
    var token = { type: "unrecognized", finished: false };
    
    while (this.i < this.line.length && !token.finished) {
        token = this.getToken();
        switch (token.type) {
            case "bar":
            case "bassNote":
            case "melodyNote":
            case "comment":
            case "unrecognized":
            default:
                break;
        }
    }
};

ABCJS.tablature.Parse.prototype.getToken = function() {
    this.parseMultiCharToken( ' \t' );
    switch(this.line.charAt(this.i)) {
        case '%':
          return { type:"comment",  token: this.line.substr( this.i+1 ), finished: true };
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
  //  barra ::= { |, ||, :|, |:, :|:, :||:, ::, :||, :|| [|, |], |[|, |]| }
  var token = { type:"bar",  token: undefined, finished: false };
  var p = this.i;
  
  this.parseMultiCharToken(this.barSyms);
  
  token.token = this.line.substr( p, this.i-p );
  token.finished =  this.i >= this.line.length;
  
  // validar o tipo de barra
  return token;
};

ABCJS.tablature.Parse.prototype.getColumn = function() {
  switch( this.line.charAt(this.i) ) {
      case '+':
      case '-':
          return this.getMelodyNotes();
      default:    
          return this.getBass();
          
  }
};

ABCJS.tablature.Parse.prototype.getBass = function() {
  var token = { type:"bassNote",  note: undefined, duration: 1, finished: false };
  if( this.bassNoteSyms.indexOf(this.line.charAt(this.i)) === -1 ) {
    this.warn( "Expected Bass Note but found " + this.line.charAt(this.i) );
    token.type = "unrecognized";
    token.finished =  this.i >= this.line.length;
  } else {
    token.note = this.getSingleBassNote();
    token.duration = this.getDuration();
    token.finished =  this.i >= this.line.length;
  }
  return token;
};

ABCJS.tablature.Parse.prototype.getSingleBassNote = function() {
    this.i++;
    return this.line.charAt(this.i-1);
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

ABCJS.tablature.Parse.prototype.getMelodyNotes = function() {
  var token = { type:"melodyNote",  bellows: "", buttons: [], duration: 1, finished: false };
  token.bellows  = this.getBelows();
  this.getNote( token );
  token.duration = this.getDuration();
  token.finished =  this.i >= this.line.length;
  return token;
};

ABCJS.tablature.Parse.prototype.getBelows = function() {
    if(this.belSyms.indexOf(this.line.charAt(this.i)) < 0 ) {
       this.warn( "Expected belows information, but found " + this.line.charAt(this.i) );
       return '+';
    } else {
        this.i++;
        return this.line.charAt(this.i-1);
    }
};

ABCJS.tablature.Parse.prototype.getNote = function(token) {
  switch( this.line.charAt(this.i) ) {
      case '[':
         this.i++;
         token.chord = true;
         this.getChord( token );
         break;
      case '{':
         this.i++;
         this.getGroupedNotes( token );
         token.group = true;
         break;
      default: 
         token.buttons[token.buttons.length] = this.getButton() + this.getRow() ;
  }
};

ABCJS.tablature.Parse.prototype.getChord = function( token ) {
    while (this.i < this.line.length && this.line.charAt(this.i) !== ']' ) {
        this.getNote( token );
    }
    if( this.line.charAt(this.i) !== ']' ) {
       this.warn( "Expected end of chord - ']'");
    } else {
        this.i++;
    }
};

ABCJS.tablature.Parse.prototype.getGroupedNotes = function(token) {
    while (this.i < this.line.length && this.line.charAt(this.i) !== '}' ) {
        this.getNote( token );
    }
    if( this.line.charAt(this.i) !== '}' ) {
       this.warn( "Expected end of group - '}'");
    } else {
        this.i++;
    }
};

ABCJS.tablature.Parse.prototype.getButton = function() {
    var c = "x";
    if(this.trebNoteSyms.indexOf(this.line.charAt(this.i)) < 0 ) {
       this.warn( "Expected button number, but found " + this.line.charAt(this.i));
    } else {
        c = this.line.charAt(this.i);
        switch(c) {
            case '>':
            case 'x':
               break;
            default:   
                c = isNaN(parseInt(c, 16))? 'x': parseInt(c, 16).toString();
        }
    }
    this.i++;
    return c;
};

ABCJS.tablature.Parse.prototype.getRow = function() {
    var row = "";
    var p = this.i;

    this.parseMultiCharToken("'");
    
    if (p !== this.i) 
        row = this.line.substr(p, this.i - p);
        
    return row;
};
