var sprintf = require('./sprintf');
var roundNumber = require('./round-number');
var printStem = require('./print-stem');

function TabLine(renderer, klass, dx, name) {
	this.renderer = renderer;
	if (!dx) dx = 0.35; // default
	this.dx = dx;
	this.klass = klass;
	this.name = name;
	var fill = renderer.foregroundColor;
	this.options = { stroke: "none", fill: fill };
	if (name)
		this.options['data-name'] = name;
	if (klass)
		this.options['class'] = klass;
}

TabLine.prototype.printVertical = function (y1, y2, x) {
	return printStem(this.renderer,
		x,
		this.dx,
		y1,
		y2,
		this.options.klass,
		this.options.name);
}

TabLine.prototype.printHorizontal = function (x1, x2, y) {
	x1 = roundNumber(x1);
	x2 = roundNumber(x2);
	var y1 = roundNumber(y - this.dx);
	var y2 = roundNumber(y + this.dx);
	this.options.path = sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y1, x2, y1,
		x2, y2, x1, y2);
	return this.renderer.paper.pathToBack(this.options);
}

module.exports = TabLine;

