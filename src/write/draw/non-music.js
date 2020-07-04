var drawSeparator = require('./separator');
var renderText = require('./text');

function nonMusic(renderer, obj) {
	for (var i = 0; i < obj.rows.length; i++) {
		var row = obj.rows[i];
		if (row.move) {
			renderer.moveY(row.move);
		} else if (row.text) {
			var x = row.left ? row.left : 0;
			renderText(renderer, {x: x, y: renderer.y, text: row.text, type: row.font, klass: row.klass, anchor: row.anchor});
		} else if (row.separator) {
			drawSeparator(renderer, row.separator)
		}
	}
}

module.exports = nonMusic;
