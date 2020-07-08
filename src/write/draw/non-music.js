var drawSeparator = require('./separator');
var renderText = require('./text');

function nonMusic(renderer, obj, selectables) {
	for (var i = 0; i < obj.rows.length; i++) {
		var row = obj.rows[i];
		if (row.move) {
			renderer.moveY(row.move);
		} else if (row.text) {
			var x = row.left ? row.left : 0;
			var el = renderText(renderer, {
				x: x,
				y: renderer.y,
				text: row.text,
				type: row.font,
				klass: row.klass,
				anchor: row.anchor
			});
			if (row.absElemType) {
				selectables.wrapSvgEl({
					el_type: row.absElemType,
					startChar: -1,
					endChar: -1,
					text: row.text
				}, el);
			}
		} else if (row.separator) {
			drawSeparator(renderer, row.separator)
		} else if (row.startGroup) {
			renderer.paper.openGroup({klass: row.klass});
		} else if (row.endGroup) {
			// TODO-PER: also create a history element with the title "row.endGroup"
			var g = renderer.paper.closeGroup();
			if (row.absElemType)
				selectables.wrapSvgEl({
					el_type: row.absElemType,
					startChar: -1,
					endChar: -1,
					text: ""
				}, g);
		}
	}
}

module.exports = nonMusic;
