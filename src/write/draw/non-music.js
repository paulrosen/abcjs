var drawSeparator = require('./separator');
var renderText = require('./text');

function nonMusic(renderer, obj, selectables) {
	for (var i = 0; i < obj.rows.length; i++) {
		var row = obj.rows[i];
		if (row.absmove) {
			renderer.absolutemoveY(row.absmove);
		} else if (row.move) {
			renderer.moveY(row.move);
		} else if (row.text) {
			var x = row.left ? row.left : 0;
			var el = renderText(renderer, {
				x: x,
				y: renderer.y,
				text: row.text,
				type: row.font,
				klass: row.klass,
				name: row.name,
				anchor: row.anchor
			});
			if (row.absElemType) {
				selectables.wrapSvgEl({
					el_type: row.absElemType,
					name: row.name,
					startChar: row.startChar,
					endChar: row.endChar,
					text: row.text
				}, el);
			}
		} else if (row.separator) {
			drawSeparator(renderer, row.separator)
		} else if (row.startGroup) {
			renderer.paper.openGroup({ klass: row.klass, "data-name": row.name });
		} else if (row.endGroup) {
			// TODO-PER: also create a history element with the title "row.endGroup"
			var g = renderer.paper.closeGroup();
			if (row.absElemType)
				selectables.wrapSvgEl({
					el_type: row.absElemType,
					name: row.name,
					startChar: row.startChar,
					endChar: row.endChar,
					text: ""
				}, g);
		}
	}
}

module.exports = nonMusic;
