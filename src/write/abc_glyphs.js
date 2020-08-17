var spacing = require('./abc_spacing');

/**
 * Glyphs and some methods to adjust for their x and y baseline
 */
var glyphs = {
	'0': { d: '\uE080', w: 10.78,  h: 14.959 },
	'1': { d: '\uE081', w: 8.94,   h: 15.058 },
	'2': { d: '\uE082', w: 10.764, h: 14.97  },
	'3': { d: '\uE083', w: 9.735,  h: 14.967 },
	'4': { d: '\uE084', w: 11.795, h: 14.994 },
	'5': { d: '\uE085', w: 10.212, h: 14.997 },
	'6': { d: '\uE086', w: 9.956,  h: 14.982 },
	'7': { d: '\uE087', w: 10.561, h: 15.093 },
	'8': { d: '\uE088', w: 10.926, h: 14.989 },
	'9': { d: '\uE089', w: 9.959,  h: 14.986 },

	'rests.multimeasure': { d: '\uE4EE', w: 42,     h: 18     },
	'rests.whole':        { d: '\uE4E3', w: 11.25,  h: 4.68   },
	'rests.half':         { d: '\uE4E4', w: 11.25,  h: 4.68   },
	'rests.quarter':      { d: '\uE4E5', w: 7.888,  h: 21.435 },
	'rests.8th':          { d: '\uE4E6', w: 7.534,  h: 13.883 },
	'rests.16th':         { d: '\uE4E7', w: 9.724,  h: 21.383 },
	'rests.32nd':         { d: '\uE4E8', w: 11.373, h: 28.883 },
	'rests.64th':         { d: '\uE4E9', w: 12.453, h: 36.383 },
	'rests.128th':        { d: '\uE4EA', w: 12.992, h: 43.883 },

	'accidentals.sharp':     { d: '\uE262', w: 8.25,  h: 22.462 },
	'accidentals.halfsharp': { d: '\uE282', w: 5.25,  h: 20.174 },
	'accidentals.nat':       { d: '\uE261', w: 5.4,   h: 22.8   },
	'accidentals.flat':      { d: '\uE260', w: 6.75,  h: 18.801 },
	'accidentals.halfflat':  { d: '\uE280', w: 6.728, h: 18.801 },
	'accidentals.dblflat':   { d: '\uE264', w: 12.1,  h: 18.804 },
	'accidentals.dblsharp':  { d: '\uE263', w: 7.95,  h: 7.977  },

	'dots.dot':                   { d: '\uE044', w:3.45,   h: 3.45  },
	'noteheads.dbl':              { d: '\uE0A0', w:16.83,  h: 8.145 },
	'noteheads.whole':            { d: '\uE0A2', w:14.985, h: 8.097 },
	'noteheads.half':             { d: '\uE0A3', w:10.37,  h: 8.132 },
	'noteheads.quarter':          { d: '\uE0A4', w:9.81,   h: 8.094 },
	'noteheads.slash.nostem':     { d: '\uE0CF', w:12.81,  h: 15.63 },
	'noteheads.indeterminate':    { d: '\uE0A9', w:9.843,  h: 8.139 },
	'noteheads.slash.whole':      { d: '\uE102', w:10.81,  h:15.63  },
	'noteheads.slash.quarter':    { d: '\uE100', w:9,      h:9      },
	'noteheads.harmonic.quarter': { d: '\uE0DB', w:7.5,    h:8.165  },

	'scripts.ufermata':      { d: '\uE4C0', w: 19.748, h: 11.289 },
	'scripts.dfermata':      { d: '\uE4C1', w: 19.744, h: 11.274 },
	'scripts.sforzato':      { d: '\uE539', w: 13.5,   h: 7.5    },
	'scripts.accent':        { d: '\uE4A0', w: 2.989,  h: 3.004  },
	// 'scripts.daccent':       { d: '\uE4A1', w: 2.989,  h: 3.004  },
	'scripts.staccato':      { d: '\uE4A2', w: 2.989,  h: 3.004  },
	// 'scripts.dstaccato':     { d: '\uE4A3', w: 2.989,  h: 3.004  },
	'scripts.tenuto':        { d: '\uE4A4', w: 8.985,  h: 1.08   },
	// 'scripts.dtenuto':       { d: '\uE4A5', w: 8.985,  h: 1.08   },
	'scripts.umarcato':      { d: '\uE4AC', w: 7.5,    h: 8.245  },
	'scripts.dmarcato':      { d: '\uE4AD', w: 7.5,    h: 8.25   },
	'scripts.stopped':       { d: '\uE08D', w: 8.295,  h: 8.295  },
	'scripts.downbow':       { d: '\uE610', w: 11.22,  h: 9.992  },
	'scripts.upbow':         { d: '\uE612', w: 9.73,   h: 15.608 },
	'scripts.turn':          { d: '\uE567', w: 16.366, h: 7.893  },
	'scripts.invertedturn':  { d: '\uE568', w: 16.366, h: 7.893  },
	'scripts.turnx':         { d: '\uE569', w: 16.366, h: 7.893  },
	'scripts.invertedturnx': { d: '\uE569', w: 16.366, h: 7.893  },
	'scripts.trill':         { d: '\uE566', w: 17.963, h: 16.49  },
	'scripts.segno':         { d: '\uE047', w: 15,     h: 22.504 },
	'scripts.coda':          { d: '\uE048', w: 16.035, h: 21.062 },
	'scripts.comma':         { d: '\uE581', w: 3.042,  h: 9.237  },
	'scripts.roll':          { d: '\uE59E', w: 10.817, h: 6.125  },
	'scripts.prall':         { d: '\uE56C', w: 15.011, h: 7.5    },
	'scripts.arpeggio':      { d: '', w: 5,      h: 10     },
	'scripts.mordent':       { d: '\uE56D', w: 15.011, h: 10.012 },

	'flags.u8th':   { d: '\uE240', w: 6.692,  h:22.59  },
	'flags.d8th':   { d: '\uE241', w: 8.492,  h:21.691 },
	'flags.u16th':  { d: '\uE242', w: 6.693,  h:26.337 },
	'flags.d16th':  { d: '\uE243', w: 8.475,  h:22.591 },
	'flags.u32nd':  { d: '\uE244', w: 6.697,  h:32.145 },
	'flags.d32nd':  { d: '\uE245', w: 8.385,  h:29.191 },
	'flags.u64th':  { d: '\uE246', w: 6.682,  h:39.694 },
	'flags.d64th':  { d: '\uE247', w: 8.485,  h:32.932 },
	'flags.ugrace': { d: '\uE564', w: 12.019, h:9.954  },
	'flags.dgrace': { d: '\uE565', w: 15.12,  h:9.212  },

	'clefs.C':    { d: '\uE05C', w: 20.31,  h:29.97  },
	'clefs.F':    { d: '\uE062', w: 20.153, h:23.142 },
	'clefs.G':    { d: '\uE050', w: 19.051, h:57.057 },
	'clefs.perc': { d: '\uE069', w: 21,     h:14.97  },

	'timesig.common':       { d:'\uE08A', w:13.038, h:15.689 },
	'timesig.cut':          { d:'\uE08B', w:13.038, h:20.97  },
	'timesig.perfectum':    { d:'\uE911', w:13.038, h:20.97  },
	'timesig.perfectum2':   { d:'\uE912', w:13.038, h:20.97  },
	'timesig.imperfectum':  { d:'\uE915', w:13.038, h:20.97  },
	'timesig.imperfectum2': { d:'\uE918', w:13.038, h:20.97  },

	'f': { d: '\uE522', w: 16.155, h: 19.445 },
	'm': { d: '\uE521', w: 14.687, h: 9.126  },
	'p': { d: '\uE520', w: 14.689, h: 13.127 },
	'r': { d: '\uE523', w: 9.41,   h: 9.132  },
	's': { d: '\uE524', w: 6.632,  h: 8.758  },
	'z': { d: '\uE525', w: 8.573,  h: 8.743  },
	'+': { d: '\uE08C', w: 7.507,  h: 7.515  },
	',': { d: '\uE4CE', w: 3.452,  h: 8.143  },
	'-': { d: '\uE090', w: 5.001,  h: 0.81   },
	'.': { d: '.', w:3.413,   h: 3.402  },

	'scripts.wedge':        { d: '\uE4A6', w: 7.49,  h:7.752 },
	'scripts.thumb':        { d: '\uE624', w: 5.955, h:9.75  },
	'scripts.open':         { d: '\uE7F8', w: 5.955, h:7.5   },
	'scripts.longphrase':   { d: '', w: 2.16,  h:23.04 },
	'scripts.mediumphrase': { d: '', w: 2.16,  h:15.54 },
	'scripts.shortphrase':  { d: '', w: 2.16,  h:8.04  },
	'scripts.snap':         { d: '\uE631', w: 10.38, h:6.84 }
};

var pathClone = function (pathArray) {
	var res = [];
	for (var i = 0, ii = pathArray.length; i < ii; i++) {
		res[i] = [];
		for (var j = 0, jj = pathArray[i].length; j < jj; j++) {
			res[i][j] = pathArray[i][j];
		}
	}
	return res;
};

var pathScale = function (pathArray, kx, ky) {
	for (var i = 0, ii = pathArray.length; i < ii; i++) {
		var p = pathArray[i];
		var j, jj;
		for (j = 1, jj = p.length; j < jj; j++) {
			p[j] *= (j % 2) ? kx : ky;
		}
	}
};

var Glyphs = {
	printSymbol: function (x,y,symb,paper, klass, stroke, fill) {
		if (!glyphs[symb]) return null;
		return paper.text(glyphs[symb].d, {x:x, y:y, stroke:stroke, fill:fill, 'class': klass });
	},

	getPathForSymbol: function (x,y,symb,scalex, scaley) {
		scalex = scalex || 1;
		scaley = scaley || 1;
		if (!glyphs[symb]) return null;
		var pathArray = pathClone(glyphs[symb].d);
		if (scalex!==1 || scaley!==1) pathScale(pathArray,scalex,scaley);
		pathArray[0][1] +=x;
		pathArray[0][2] +=y;

		return pathArray;
	},

	getSymbolWidth: function (symbol) {
		if (glyphs[symbol]) return glyphs[symbol].w;
		return 0;
	},

	symbolHeightInPitches: function(symbol) {
		var height = glyphs[symbol] ? glyphs[symbol].h : 0;
		return height / spacing.STEP;
	},

	getSymbolAlign: function (symbol) {
		if (symbol.substring(0,7)==="scripts" &&
			symbol!=="scripts.roll") {
			return "center";
		}
		return "left";
	},

	getYCorr: function (symbol) {
		switch(symbol) {
			case "flags.d32nd": return -1;
			case "flags.d64th": return -2;
			case "flags.u32nd": return 1;
			case "flags.u64th": return 3;
			case "rests.whole": return 1;
			case "rests.half": return -1;
			case "rests.8th": return -1;
			case "rests.quarter": return -1;
			case "rests.16th": return -1;
			case "rests.32nd": return -1;
			case "rests.64th": return -1;
			case "f":
			case "m":
			case "p":
			case "s":
			case "z":
				return -4;
			case "scripts.trill":
			case "scripts.upbow":
			case "scripts.downbow":
				return -2;
			case "scripts.ufermata":
			case "scripts.wedge":
			case "scripts.roll":
			case "scripts.shortphrase":
			case "scripts.longphrase":
				return -1;
			case "scripts.dfermata":
				return 1;
			default: return 0;
		}
	},
	setSymbol: function(name, path) {
		glyphs[name] = path;
	}
};

module.exports = Glyphs; // we need the glyphs for layout information
