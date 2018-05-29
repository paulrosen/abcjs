function addPositioning(el, type, value) {
	if (!el.positioning) el.positioning = {};
	el.positioning[type] = value;
}

function addFont(el, type, value) {
	if (!el.fonts) el.fonts = {};
	el.fonts[type] = value;
}

var multilineVars = {
	reset: function() {
		for (var property in this) {
			if (this.hasOwnProperty(property) && typeof this[property] !== "function") {
				delete this[property];
			}
		}
		this.iChar = 0;
		this.key = {accidentals: [], root: 'none', acc: '', mode: '' };
		this.meter = null; // if no meter is specified, free meter is assumed
		this.origMeter = null;	// this is for new voices that are created after we set the meter.
		this.hasMainTitle = false;
		this.default_length = 0.125;
		this.clef = { type: 'treble', verticalPos: 0 };
		this.next_note_duration = 0;
		this.start_new_line = true;
		this.is_in_header = true;
		this.is_in_history = false;
		this.partForNextLine = "";
		this.havent_set_length = true;
		this.voices = {};
		this.staves = [];
		this.macros = {};
		this.currBarNumber = 1;
		this.inTextBlock = false;
		this.inPsBlock = false;
		this.ignoredDecorations = [];
		this.textBlock = "";
		this.score_is_present = false;	// Can't have original V: lines when there is the score directive
		this.inEnding = false;
		this.inTie = false;
		this.inTieChord = {};
		this.vocalPosition = "auto";
		this.dynamicPosition = "auto";
		this.chordPosition = "auto";
		this.ornamentPosition = "auto";
		this.volumePosition = "auto";
		this.openSlurs = [];
	},
	differentFont: function(type, defaultFonts) {
		if (this[type].decoration !== defaultFonts[type].decoration) return true;
		if (this[type].face !== defaultFonts[type].face) return true;
		if (this[type].size !== defaultFonts[type].size) return true;
		if (this[type].style !== defaultFonts[type].style) return true;
		if (this[type].weight !== defaultFonts[type].weight) return true;
		return false;
	},
	addFormattingOptions: function(el, defaultFonts, elType) {
		if (elType === 'note') {
			if (this.vocalPosition !== 'auto') addPositioning(el, 'vocalPosition', this.vocalPosition);
			if (this.dynamicPosition !== 'auto') addPositioning(el, 'dynamicPosition', this.dynamicPosition);
			if (this.chordPosition !== 'auto') addPositioning(el, 'chordPosition', this.chordPosition);
			if (this.ornamentPosition !== 'auto') addPositioning(el, 'ornamentPosition', this.ornamentPosition);
			if (this.volumePosition !== 'auto') addPositioning(el, 'volumePosition', this.volumePosition);
			if (this.differentFont("annotationfont", defaultFonts)) addFont(el, 'annotationfont', this.annotationfont);
			if (this.differentFont("gchordfont", defaultFonts)) addFont(el, 'gchordfont', this.gchordfont);
			if (this.differentFont("vocalfont", defaultFonts)) addFont(el, 'vocalfont', this.vocalfont);
		} else if (elType === 'bar') {
			if (this.dynamicPosition !== 'auto') addPositioning(el, 'dynamicPosition', this.dynamicPosition);
			if (this.chordPosition !== 'auto') addPositioning(el, 'chordPosition', this.chordPosition);
			if (this.ornamentPosition !== 'auto') addPositioning(el, 'ornamentPosition', this.ornamentPosition);
			if (this.volumePosition !== 'auto') addPositioning(el, 'volumePosition', this.volumePosition);
			if (this.differentFont("measurefont", defaultFonts)) addFont(el, 'measurefont', this.measurefont);
			if (this.differentFont("repeatfont", defaultFonts)) addFont(el, 'repeatfont', this.repeatfont);
		}
	}
};

module.exports = multilineVars;
