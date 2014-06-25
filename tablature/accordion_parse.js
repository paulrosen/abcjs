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

           barra ::=  "|", "||", ":|", "|:", ":|:", ":||:", "::", ":||", ":||", "[|", "|]", "|[|", "|]|" [endings]
        
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
    this.i = 0;
    this.xi = 0;

    this.warn = function(str) {
        var bad_char = this.line.charAt(this.i);
        if (bad_char === ' ')
            bad_char = "SPACE";
        var clean_line = this.encode(this.line.substring(0, this.i)) +
                '<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">' + bad_char + '</span>' +
                this.encode(this.line.substring(this.i + 1));
        this.addWarning("Music Line:" + /*line*/ 0 + ":" + /*column*/(this.i + 1) + ': ' + str + ": " + clean_line);
    };
    
    this.addWarning = function(str) {
        this.warnings.push(str);
    };
    
    this.encode = function(str) {
        var ret = window.ABCJS.parse.gsub(str, '\x12', ' ');
        ret = window.ABCJS.parse.gsub(ret, '&', '&amp;');
        ret = window.ABCJS.parse.gsub(ret, '<', '&lt;');
        return window.ABCJS.parse.gsub(ret, '>', '&gt;');
    };

};

ABCJS.tablature.Parse.prototype.parseTabVoice = function( ) {
    var voice  = [];
    this.i = 0;
    var token = { el_type: "unrecognized" };
    
    while (this.i < this.line.length && !this.finished) {
        token = this.getToken();
        switch (token.el_type) {
            case "bar":
                token.startChar = this.xi;
                token.endChar = this.i;
                if( ! this.invalid )
                  voice[voice.length] = token;
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
  var el = {el_type: token.el_type, startChar:this.xi, endChar:this.i};
  el.pitches = [];
  el.duration = token.duration * this.vars.default_length;
  el.bellows = token.bellows;
  if(token.bassNote) {
    if(token.bassNote === "z")
      el.pitches[0] = { bass:true, type: "rest", c: '', pitch: 18};
    else
      el.pitches[0] = { bass:true, type: "tabText", c: this.getTabSymbol(token.bassNote), pitch: 17.5};
  }
  var qtd = token.buttons.length;
  var d = qtd;

  for(var i = 0; i < token.buttons.length; i ++ ) {
    d--;
    var n = el.pitches.length;
    if(token.buttons[i] === "z")
      el.pitches[n] = { c: "", type: "rest", pitch: token.bellows === "+"? 12.2 : 12.2-6.4 };
    else {
      var p = (qtd === 1 ? 11.7 : (qtd === 2 ? 10.6 + d * 2.5 : 9.7 + d * 2.1)) + (token.bellows === "+"? 0 : -6.4 );
      el.pitches[n] = { c: this.getTabSymbol(token.buttons[i]), type: "tabText"+(qtd>1?qtd:""), pitch: p };
    } 
    if(token.buttons[i] === ">" ) el.inTieTreb = true;
    if(token.bassNote  === ">" )  el.inTieBass = true;
  }
  return el ;
};

ABCJS.tablature.Parse.prototype.getTabSymbol = function(text) {
    switch(text) {
        case '>': return '--->';
        default: return text;
    }
};

ABCJS.tablature.Parse.prototype.getToken = function() {
    this.invalid = false;
    this.parseMultiCharToken( ' \t' );
    this.xi = this.i;
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
  var endings  =   '1234567890-,';
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

  if(! this.invalid) {
    this.parseMultiCharToken( ' \t' );
    if (this.vars.inEnding && token.type !== 'bar_thin') {
        token.endEnding = true;
        this.vars.inEnding = false;
    }
    if(endings.indexOf(this.line.charAt(this.i))>=0) {
        token.startEnding = this.line.charAt(this.i);
        if (this.vars.inEnding)
            token.endEnding = true;
        this.vars.inEnding = true;
        this.i++;
    }
  }
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

