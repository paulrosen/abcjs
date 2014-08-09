//    abc_renderer.js: API to render to SVG/Raphael/whatever rendering engine
//    Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.


/*global window, ABCJS, Math */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

/**
 * Implements the API for rendering ABCJS Abstract Rendering Structure to a canvas/paper (e.g. SVG, Raphael, etc)
 * @param {Object} paper
 * @param {ABCJS.write.Glyphs} glyphs
 */
ABCJS.write.Renderer = function(paper, glyphs) {
  this.paper = paper;
  this.glyphs = glyphs;
  this.controller = null; //TODO-GD only used when drawing the ABCJS ARS to connect the controller with the elements for highlighting

  this.y = null; // renderer's y is managed by the controller
  this.minY = null; // set at each drawing of a stave by the controller - place for lyrics, crescendo and other dynamics
  this.scale = null; // renderer's scale is managed by the controller
  this.padding = null; // renderer's padding is managed by the controller
};


/**
 * Begin a group of glyphs that will always be moved, scaled and higlighted together
 */
ABCJS.write.Renderer.prototype.beginGroup = function () {
  this.path = [];
  this.lastM = [0,0];
  this.ingroup = true;
};

/**
 * Add a path to the current group
 * @param {Array} path
 * @private
 */
ABCJS.write.Renderer.prototype.addPath = function (path) {
  path = path || [];
  if (path.length===0) return;
  path[0][0]="m";
  path[0][1]-=this.lastM[0];
  path[0][2]-=this.lastM[1];
  this.lastM[0]+=path[0][1];
  this.lastM[1]+=path[0][2];
  this.path.push(path[0]);
  for (var i=1,ii=path.length;i<ii;i++) {
    if (path[i][0]==="m") {
      this.lastM[0]+=path[i][1];
      this.lastM[1]+=path[i][2];
    }
    this.path.push(path[i]);
  }
};

/**
 * End a group of glyphs that will always be moved, scaled and higlighted together
 */
ABCJS.write.Renderer.prototype.endGroup = function (klass) {
  this.ingroup = false;
  if (this.path.length===0) return null;
  var ret = this.paper.path().attr({path:this.path, stroke:"none", fill:"#000000", 'class': this.addClasses(klass)});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

/**
 * gets scaled
 * @param {number} x1 start x
 * @param {number} x2 end x
 * @param {number} pitch pitch the stave line is drawn at
 */
ABCJS.write.Renderer.prototype.printStaveLine = function (x1,x2, pitch) {
  var isIE=/*@cc_on!@*/false;//IE detector
  var dy = 0.35;
  var fill = "#000000";
  if (isIE) {
    dy = 1;
    fill = "#666666";
  }
  var y = this.calcY(pitch);
  var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy,
     x2, y+dy, x1, y+dy);
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses('staff')}).toBack();
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

/**
 * gets scaled if not in a group
 * @param {number} x1 x coordinate of the stem
 * @param {number} dx stem width
 * @param {number} y1 y coordinate of the stem bottom
 * @param {number} y2 y coordinate of the stem top
 */
ABCJS.write.Renderer.prototype.printStem = function (x, dx, y1, y2) {
  if (dx<0) { // correct path "handedness" for intersection with other elements
    var tmp = y2;
    y2 = y1;
    y1 = tmp;
  }
  var isIE=/*@cc_on!@*/false;//IE detector
  var fill = "#000000";
  if (isIE && dx<1) {
    dx = 1;
    fill = "#666666";
  }
  if (~~x === x) x+=0.05; // raphael does weird rounding (for VML)
  var pathArray = [["M",x,y1],["L", x, y2],["L", x+dx, y2],["L",x+dx,y1],["z"]];
  if (!isIE && this.ingroup) {
    this.addPath(pathArray);
  } else {
    var ret = this.paper.path().attr({path:pathArray, stroke:"none", fill:fill, 'class': this.addClasses('stem')}).toBack();
    if (this.scale!==1) {
      ret.scale(this.scale, this.scale, 0, 0);
    }
    return ret;
  }
};

/** 
 * assumes this.y is set appropriately
 * if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
 * not scaled if not in printgroup
 */
ABCJS.write.Renderer.prototype.printSymbol = function(x, offset, symbol, scalex, scaley, klass) {
	var el;
    var ycorr;
  if (!symbol) return null;
  if (symbol.length>0 && symbol.indexOf(".")<0) {
    var elemset = this.paper.set();
    var dx =0;
    for (var i=0; i<symbol.length; i++) {
      ycorr = this.glyphs.getYCorr(symbol.charAt(i));
      el = this.glyphs.printSymbol(x+dx, this.calcY(offset+ycorr), symbol.charAt(i), this.paper, klass);
      if (el) {
	elemset.push(el);
	dx+=this.glyphs.getSymbolWidth(symbol.charAt(i));
      } else {
				this.renderText(x, this.y, "no symbol:" +symbol, "debugfont", 'debug-msg', 'start');
      }
    }
    if (this.scale!==1) {
      elemset.scale(this.scale, this.scale, 0, 0);
    }
    return elemset;
  } else {
    ycorr = this.glyphs.getYCorr(symbol);
    if (this.ingroup) {
      this.addPath(this.glyphs.getPathForSymbol(x, this.calcY(offset+ycorr), symbol, scalex, scaley));
    } else {
      el = this.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol, this.paper, klass);
      if (el) {
	if (this.scale!==1) {
      el.scale(this.scale, this.scale, 0, 0);
	}
	return el;
      } else
				this.renderText(x, this.y, "no symbol:" +symbol, "debugfont", 'debug-msg', 'start');
    }
    return null;    
  }
};


ABCJS.write.Renderer.prototype.printPath = function (attrs) {
  var ret = this.paper.path().attr(attrs);
  if (this.scale!==1) ret.scale(this.scale, this.scale, 0, 0);
  return ret;
};

ABCJS.write.Renderer.prototype.drawArc = function(x1, x2, pitch1, pitch2, above) {


  x1 = x1 + 6;
  x2 = x2 + 4;
  pitch1 = pitch1 + ((above)?1.5:-1.5);
  pitch2 = pitch2 + ((above)?1.5:-1.5);
  var y1 = this.calcY(pitch1);
  var y2 = this.calcY(pitch2);

  //unit direction vector
  var dx = x2-x1;
  var dy = y2-y1;
  var norm= Math.sqrt(dx*dx+dy*dy);
  var ux = dx/norm;
  var uy = dy/norm;

  var flatten = norm/3.5;
  var curve = ((above)?-1:1)*Math.min(25, Math.max(4, flatten));

  var controlx1 = x1+flatten*ux-curve*uy;
  var controly1 = y1+flatten*uy+curve*ux;
  var controlx2 = x2-flatten*ux-curve*uy;
  var controly2 = y2-flatten*uy+curve*ux;
  var thickness = 2;
  var pathString = ABCJS.write.sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x1, y1,
     controlx1, controly1, controlx2, controly2, x2, y2,
     controlx2-thickness*uy, controly2+thickness*ux, controlx1-thickness*uy, controly1+thickness*ux, x1, y1);
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:"#000000", 'class': this.addClasses('slur')});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};
/**
 * Calculates the y for a given pitch value (relative to the stave the renderer is currently printing)
 * @param {number} ofs pitch value (bottom C on a G clef = 0, D=1, etc.)
 */
ABCJS.write.Renderer.prototype.calcY = function(ofs) {
  return this.y+((ABCJS.write.spacing.TOPNOTE-ofs)*ABCJS.write.spacing.STEP);
};

/**
 * Print @param {number} numLines. If there is 1 line it is the B line. Otherwise the bottom line is the E line.
 */
ABCJS.write.Renderer.prototype.printStave = function (startx, endx, numLines) {
	// If there is one line, it is the B line. Otherwise, the bottom line is the E line.
	if (numLines === 1) {
		this.printStaveLine(startx,endx,6);
		return;
	}
	for (var i = 0; i < numLines; i++) {
		this.printStaveLine(startx,endx,(i+1)*2);
	}
};

/**
 *
 * @private
 */
ABCJS.write.Renderer.prototype.addClasses = function (c) {
	var ret = [];
	if (c.length > 0) ret.push(c);
	if (this.lineNumber !== null) ret.push("l"+this.lineNumber);
	if (this.measureNumber !== null) ret.push("m"+this.measureNumber);
	return ret.join(' ');
};

ABCJS.write.Renderer.prototype.getFontAndAttr = function(type, klass, scale) {
	var font = this.abctune.formatting[type];
	if (!font)
		font = { face: "Arial", size: 12, decoration: "underline", style: "normal", weight: "normal" };
	var attr = {"font-size": font.size*scale,
		"font-family": font.face, 'font-weight': font.weight, 'text-decoration': font.decoration,
		'class': this.addClasses(klass) };
	return { font: font, attr: attr };
};

ABCJS.write.Renderer.prototype.getTextSize = function(text, type, klass) {
	var hash = this.getFontAndAttr(type, klass, this.scale);
	var el = this.paper.text(0,0, text).attr(hash.attr);
	var size = el.getBBox();
	el.remove();
	return size;
};

ABCJS.write.Renderer.prototype.renderText = function(x, y, text, type, klass, anchor) {
	var hash = this.getFontAndAttr(type, klass, this.scale);
	if (anchor)
		hash.attr["text-anchor"] = anchor;
	var el = this.paper.text(x, y*this.scale, text).attr(hash.attr);
	if (hash.font.box) {
		var size = el.getBBox();
		this.paper.rect(size.x-1,size.y-1,size.width+2,size.height+2).attr({"stroke":"#cccccc"});
	}
	return el;
};

ABCJS.write.Renderer.prototype.moveY = function (em, numLines) {
	this.y += em*numLines;
};

ABCJS.write.Renderer.prototype.skipSpaceY = function () {
	this.y += this.space*this.scale;
};

// Call with 'kind' being the font type to use,
// if margin === null then don't increment the Y after printing, otherwise that is the extra number of em's to leave below the line.
// and alignment being "start", "middle", or "end".
ABCJS.write.Renderer.prototype.outputTextIf = function(x, str, kind, klass, margin, alignment) {
	if (str) {
		var el = this.renderText(x, this.y, str, kind, klass, alignment);
		if (margin !== null) {
			var numLines = str.split("\n").length;
			this.moveY(el.getBBox().height/numLines, (numLines + margin));
		}
		return [el.getBBox().width, el.getBBox().height];
	}
	return [0,0];
};

