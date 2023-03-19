function drawSeparator(renderer, width) {
	var fill = "rgba(0,0,0,255)";
	var stroke = "rgba(0,0,0,0)";
	var y = Math.round(renderer.y);
	var staffWidth = renderer.controller.width;
	var x1 = (staffWidth - width) / 2;
	var x2 = x1 + width;
	var pathString = 'M ' + x1 + ' ' + y +
		' L ' + x2 + ' ' + y +
		' L ' + x2 + ' ' + (y + 1) +
		' L ' + x1 + ' ' + (y + 1) +
		' L ' + x1 + ' ' + y + ' z';
	renderer.paper.pathToBack({ path: pathString, stroke: stroke, fill: fill, 'class': renderer.controller.classes.generate('defined-text') });
}

module.exports = drawSeparator;
