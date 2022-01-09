const fs = require('fs');

async function compress() {
	var scrPath = "./src/write/abc_glyphs.js"
	var outputPath = "./glyphs.json"
	console.log("Compressing " + scrPath + "...")

	var originalGlyphs = await fs.readFileSync(scrPath, 'utf8');

	originalGlyphs = originalGlyphs.split("glyphs =")[1]
	originalGlyphs = originalGlyphs.split(";")[0]
	originalGlyphs = originalGlyphs.trim()
	originalGlyphs = originalGlyphs.replace(/'/g, '"')
	originalGlyphs = originalGlyphs.replace(/d:/g, '"d":')
	originalGlyphs = originalGlyphs.replace(/w:/g, '"w":')
	originalGlyphs = originalGlyphs.replace(/h:/g, '"h":')
	originalGlyphs = JSON.parse(originalGlyphs)

	var keys = Object.keys(originalGlyphs)
	keys.forEach(key => {
		const glyph = originalGlyphs[key]
		const d = glyph.d
		d.forEach(move => {
			for (var i = 1; i < move.length; i++)
				move[i] = Math.round(move[i]*10)/10
		})
	})

	fs.writeFile(outputPath, JSON.stringify(originalGlyphs), function (err) {
		if (err) {
			return console.log(err);
		}
		console.log(outputPath + " saved");
	});
}

compress()
