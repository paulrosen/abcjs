var drawSeparator = require('./separator');
var renderText = require('./text');

function nonMusic(renderer, obj) {
	for (var i = 0; i < obj.rows.length; i++) {
		var row = obj.rows[i];
		if (row.move) {
			renderer.moveY(row.move);
		} else if (row.text) {
			var x = row.left ? row.left : 0;
			if (obj.absElemType) {
				renderer.wrapInAbsElem({
					el_type: obj.absElemType,
					startChar: -1,
					endChar: -1,
					text: row.text
				}, row.klass, function () {
					return renderText(renderer, {
						x: x,
						y: renderer.y,
						text: row.text,
						type: row.font,
						klass: row.klass,
						anchor: row.anchor
					});
				});
			} else {
				renderText(renderer, {
					x: x,
					y: renderer.y,
					text: row.text,
					type: row.font,
					klass: row.klass,
					anchor: row.anchor,
					history: true
				});
			}
		} else if (row.separator) {
			drawSeparator(renderer, row.separator)
		}
	}
}

module.exports = nonMusic;
