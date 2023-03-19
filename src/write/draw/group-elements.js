/**
 * Begin a group of glyphs that will always be moved, scaled and highlighted together
 */

var roundNumber = require("./round-number");

function Group() {
	this.ingroup = false;
}

Group.prototype.beginGroup = function (paper, controller) {
	this.paper = paper;
	this.controller = controller;
	this.path = [];
	this.lastM = [0, 0];
	this.ingroup = true;
	this.paper.openGroup();
};

Group.prototype.isInGroup = function () {
	return this.ingroup;
}

Group.prototype.addPath = function (path) {
	path = path || [];
	if (path.length === 0) return;
	path[0][0] = "m";
	path[0][1] = roundNumber(path[0][1] - this.lastM[0]);
	path[0][2] = roundNumber(path[0][2] - this.lastM[1]);
	this.lastM[0] += path[0][1];
	this.lastM[1] += path[0][2];
	this.path.push(path[0]);
	for (var i = 1, ii = path.length; i < ii; i++) {
		if (path[i][0] === "m") {
			this.lastM[0] += path[i][1];
			this.lastM[1] += path[i][2];
		}
		this.path.push(path[i]);
	}
};

/**
 * End a group of glyphs that will always be moved, scaled and highlighted together
 */
Group.prototype.endGroup = function (klass, name) {
	this.ingroup = false;
	//if (this.path.length === 0) return null;
	var path = "";
	for (var i = 0; i < this.path.length; i++)
		path += this.path[i].join(" ");
	this.path = [];

	var ret = this.paper.closeGroup();
	if (ret) {
		ret.setAttribute("class", this.controller.classes.generate(klass))
		ret.setAttribute("fill", this.controller.renderer.foregroundColor)
		ret.setAttribute("stroke", "none")
		ret.setAttribute("data-name", name)
	}
	return ret;
};

// There is just a singleton of this object.
var elementGroup = new Group();

module.exports = elementGroup;
