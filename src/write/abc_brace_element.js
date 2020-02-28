//    abc_brace_element.js: Definition of the BraceElement class.
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var sprintf = require('./sprintf');
var spacing = require('./abc_spacing');

var BraceElem = function BraceElem(staff, type) {
    this.startStaff = staff;
    this.type = type;
};

BraceElem.prototype.setBottomStaff = function(staff) {
	this.endStaff = staff;
};

BraceElem.prototype.continuing = function(staff) {
	// If the final staff isn't present, then use the last one we saw.
	this.lastContinuedStaff = staff;
};

BraceElem.prototype.setLocation = function(x) {
	this.x = x;
};

BraceElem.prototype.getWidth = function() {
	return 10; // TODO-PER: right now the drawing function doesn't vary the width at all. If it does in the future then this will change.
};

BraceElem.prototype.isStartVoice = function (voice) {
	if (this.startStaff && this.startStaff.voices.length > 0 && this.startStaff.voices[0] === voice)
		return true;
	return false;
};

BraceElem.prototype.draw = function (renderer, top, bottom) {
	// The absoluteY number is the spot where the note on the first ledger line is drawn (i.e. middle C if treble clef)
	// The STEP offset here moves it to the top and bottom lines
	this.startY = this.startStaff.absoluteY - spacing.STEP*10;
	if (this.endStaff)
		this.endY = this.endStaff.absoluteY - spacing.STEP*2;
	else if (this.lastContinuedStaff)
		this.endY = this.lastContinuedStaff.absoluteY - spacing.STEP*2;
	else
		this.endY = this.startStaff.absoluteY - spacing.STEP*2;
    this.drawBrace(renderer, this.x,this.startY, this.endY);
};

function straightPath(renderer, xLeft, yTop, yBottom, type) {
	xLeft += spacing.STEP;
	var xLineWidth = spacing.STEP*0.75;
	var yOverlap = spacing.STEP*0.75;
	var height = yBottom - yTop;
	// Straight line
	var pathString = sprintf("M %f %f l %f %f l %f %f l %f %f z",
		xLeft, yTop-yOverlap, // top left line
		0, height+yOverlap*2, // bottom left line
		xLineWidth, 0, // bottom right line
		0, - (height+yOverlap*2) // top right line
	);
	// Top arm
	var wCurve = spacing.STEP*2;
	var hCurve = spacing.STEP;
	pathString += sprintf("M %f %f q %f %f %f %f q %f %f %f %f z",
		xLeft+xLineWidth, yTop-yOverlap, // top left arm
		wCurve*0.6, hCurve*0.2,
		wCurve, -hCurve, // right point
		-wCurve*0.1, hCurve*0.3,
		-wCurve, hCurve+spacing.STEP // left bottom
	);
	// Bottom arm
	pathString += sprintf("M %f %f q %f %f %f %f q %f %f %f %f z",
		xLeft+xLineWidth, yTop+yOverlap+height, // bottom left arm
		wCurve*0.6, -hCurve*0.2,
		wCurve, hCurve, // right point
		-wCurve*0.1, -hCurve*0.3,
		-wCurve, -hCurve-spacing.STEP // left bottom
	);
	return renderer.paper.path({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses(type)});
}

function curvyPath(renderer, xLeft, yTop, yBottom, type) {
	var yHeight = yBottom - yTop;

	var xCurve = [7.5, -8, 21, 0, 18.5, -10.5, 7.5];
	var yCurve = [0, yHeight/5.5, yHeight/3.14, yHeight/2, yHeight/2.93, yHeight/4.88, 0];

	var pathString = sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z",
		xLeft+xCurve[0], yTop+yCurve[0],
		xLeft+xCurve[1], yTop+yCurve[1],
		xLeft+xCurve[2], yTop+yCurve[2],
		xLeft+xCurve[3], yTop+yCurve[3],
		xLeft+xCurve[4], yTop+yCurve[4],
		xLeft+xCurve[5], yTop+yCurve[5],
		xLeft+xCurve[6], yTop+yCurve[6]);

	xCurve = [0, 17.5, -7.5, 6.6, -5, 20, 0];
	yCurve = [yHeight/2, yHeight/1.46, yHeight/1.22, yHeight, yHeight/1.19, yHeight/1.42, yHeight/2];

	pathString += sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z",
		xLeft+xCurve[0], yTop+yCurve[0],
		xLeft+xCurve[1], yTop+yCurve[1],
		xLeft+xCurve[2], yTop+yCurve[2],
		xLeft+xCurve[3], yTop+yCurve[3],
		xLeft+xCurve[4], yTop+yCurve[4],
		xLeft+xCurve[5], yTop+yCurve[5],
		xLeft+xCurve[6], yTop+yCurve[6]);
	return renderer.paper.path({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses(type)});
}

BraceElem.prototype.drawBrace = function(renderer, xLeft, yTop, yBottom) {//Tony
	var type = this.type;
	var ret = renderer.wrapInAbsElem({ el_type: type, startChar: -1, endChar: -1 }, 'abcjs-'+type, function() {
		var ret;
		if (type === "brace")
			ret = curvyPath(renderer, xLeft, yTop, yBottom, type);
		else if (type === "bracket")
			ret = straightPath(renderer, xLeft, yTop, yBottom, type);
		renderer.controller.recordHistory(ret, true);
		return ret;
	});

	if (renderer.doRegression){
		renderer.addToRegression(ret);
	}
	return ret;
};

module.exports = BraceElem;
