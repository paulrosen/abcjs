/**
 * @author paulrosen
 */

/*global Class */
/*extern AbcTune */

// This is the data for a single ABC tune. It is created and populated by the AbcParse class.
var AbcTune = Class.create({
	// The structure consists of a hash with the following two items:
	// metaText: a hash of {key, value}, where key is one of: title, author, rhythm, source, transcription, unalignedWords, etc...
	// tempo: { noteLength: number (e.g. .125), bpm: number }
	// lines: an array of elements, or one of the following:
	//
	// STAFF: array of elements
	// SUBTITLE: string
	//
	// TODO: actually, the start and end char should modify each part of the note type
	// The elements all have a type field and a start and end char
	// field. The rest of the fields depend on the type and are listed below:
	// REST: duration=1,2,4,8; chord: string
	// NOTE: accidental=none,dbl_flat,flat,natural,sharp,dbl_sharp
	//		pitch: "C" is 0. The numbers refer to the pitch letter.
	//		duration: .5 (sixteenth), .75 (dotted sixteenth), 1 (eighth), 1.5 (dotted eighth)
	//			2 (quarter), 3 (dotted quarter), 4 (half), 6 (dotted half) 8 (whole)
	//		chord: { name:chord, position: one of 'default', 'above', 'below' }
	//		end_beam = true or undefined if this is the last note in a beam.
	//		lyric: array of { syllable: xxx, divider: one of " -_" }
	//		startTie = true|undefined
	//		endTie = true|undefined
	//		startTriplet = num <- that is the number to print
	//		endTriplet = true|undefined (the last note of the triplet)
	// TODO: actually, decoration should be an array.
	//		decoration: upbow, downbow, accent
	// BAR: type=bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat
	//	number: 1 or 2: if it is the start of a first or second ending
	// CLEF: type=treble,bass
	// KEY-SIG:
	//		regularKey: { num:0-7 dir:sharp,flat }
	//		extraAccidentals[]: { acc:sharp|dblsharp|natural|flat|dblflat,  note:a|b|c|d|e|f|g }
	// METER: type: common_time,cut_time,specified
	//		if specified, { num: 99, den: 99 }
	reset: function () {
		this.metaText = {};
		this.formatting = {};
		this.lines = [];
		this.staffNum = 0;
		this.voiceNum = 0;
		this.lineNum = 0;
	},

	cleanUp: function() {
		// Remove temporary variables that the outside doesn't need to know about
		delete this.staffNum;
		delete this.voiceNum;
		delete this.lineNum;
		// Remove any blank lines
		var anyDeleted = false;
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff !== undefined) {
				var hasAny = false;
				for (var s = 0; s < this.lines[i].staff.length; s++) {
					if (this.lines[i].staff[s] === undefined)
						this.lines[i].staff[s] = { voices: []};	// TODO-PER: There was a part missing in the abc music. How should we recover?
					else {
						for (var v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							if (this.lines[i].staff[s].voices[v] === undefined)
								this.lines[i].staff[s].voices[v] = [];	// TODO-PER: There was a part missing in the abc music. How should we recover?
							else
								if (this.containsNotes(this.lines[i].staff[s].voices[v])) hasAny = true;
						}
					}
				}
				if (!hasAny) {
					this.lines[i] = null;
					anyDeleted = true;
				}
			}
		}
		if (anyDeleted)
			this.lines = this.lines.compact();
	},

	initialize: function () {
		this.reset();
	},

	addTieToLastNote: function() {
		if (this.lines[this.lineNum] && this.lines[this.lineNum].staff && this.lines[this.lineNum].staff[this.staffNum] &&
			this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum]) {
			for (var i = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum].length-1; i >= 0; i--) {
				var el = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum][i];
				if (el.el_type === 'note') {
					el.startTie = true;
					return true;
				}
			}
		}
		return false;
	},

	appendElement: function(type, startChar, endChar, hashParams)
	{
		hashParams.el_type = type;
		hashParams.startChar = startChar;
		hashParams.endChar = endChar;
		this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum].push(hashParams);
	},

	appendStartingElement: function(type, startChar, endChar, hashParams)
	{
		hashParams.el_type = type;
		hashParams.startChar = startChar;
		hashParams.endChar = endChar;

		// These elements should not be added twice, so if the element exists on this line without a note or bar between them, just replace it.
		var voice = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum];
		for (var i = voice.length-1; i >= 0; i--) {
			if (voice[i].el_type === 'note' || voice[i].el_type === 'bar') {
				voice.push(hashParams);
				return;
			}
			if (voice[i].el_type === type) {
				voice[i] = hashParams;
				return;
			}
		}
		// We didn't see either that type or a note, so add the element
		voice.push(hashParams);
	},

	getNumLines: function() {
		return this.lines.length;
	},

	addSubtitle: function(str) {
		this.lines.push({subtitle: str});
	},

	addText: function(str) {
		this.lines.push({text: str});
	},

	containsNotes: function(voice) {
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' || voice[i].el_type === 'bar')
				return true;
		}
		return false;
	},

//	anyVoiceContainsNotes: function(line) {
//		for (var i = 0; i < line.staff.voices.length; i++) {
//			if (this.containsNotes(line.staff.voices[i]))
//				return true;
//		}
//		return false;
//	},

	startNewLine: function(params) {
		// If the pointed to line doesn't exist, just create that. If the line does exist, but doesn't have any music on it, just use it.
		// If it does exist and has music, then increment the line number. If the new element doesn't exist, create it.
		var This = this;
		var createVoice = function(params) {
			This.lines[This.lineNum].staff[This.staffNum].voices[This.voiceNum] = [];
			if (params.part)
				This.appendElement('part', params.startChar, params.endChar, {title: params.part});
			This.appendStartingElement('clef', params.startChar, params.endChar, params.clef );
			This.appendStartingElement('key', params.startChar, params.endChar, params.key);
			if (params.meter !== undefined)
				This.appendStartingElement('meter', params.startChar, params.endChar, params.meter);
		};
		var createStaff = function(params) {
			This.lines[This.lineNum].staff[This.staffNum] = { voices: [ ]};
			if (params.name) This.lines[This.lineNum].staff[This.staffNum].title = params.name;
			if (params.fontVocal) This.lines[This.lineNum].staff[This.staffNum].fontVocal = params.fontVocal;
			createVoice(params);
		};
		var createLine = function(params) {
			This.lines[This.lineNum] = { staff: [] };
			createStaff(params);
		};
		if (this.lines[this.lineNum] === undefined) createLine(params);
		else if (this.lines[this.lineNum].staff === undefined) {
			this.lineNum++;
			this.startNewLine(params);
		} else if (this.lines[this.lineNum].staff[this.staffNum] === undefined) createStaff(params);
		else if (this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum] === undefined) createVoice(params);
		else if (!this.containsNotes(this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum])) return;
		else {
			this.lineNum++;
			this.startNewLine(params);
		}
	},

	hasBeginMusic: function() {
		return this.lines.length > 0;
	},

//	getLastStaff: function(index) {
//		for (var i = this.lines.length-1; i >= 0; i--) {
//			if (this.lines[i].staff && this.lines[i].staff.index === index)
//				return this.lines[i];
//		}
//		return null;
//	},

	getCurrentVoice: function() {
		if (this.lines[this.lineNum] !== undefined && this.lines[this.lineNum].staff[this.staffNum] !== undefined && this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum] !== undefined)
			return this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum];
		else return null;
	},

	setCurrentVoice: function(staffNum, voiceNum) {
		this.staffNum = staffNum;
		this.voiceNum = voiceNum;
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff) {
				if (this.lines[i].staff[staffNum] === undefined || this.lines[i].staff[staffNum].voices[voiceNum] === undefined ||
					!this.containsNotes(this.lines[i].staff[staffNum].voices[voiceNum] )) {
					this.lineNum =  i;
					return;
				}
			}
		}
		this.lineNum =  i;
	},

	addMetaText: function(key, value) {
		if (this.metaText[key] === undefined)
			this.metaText[key] = value;
		else
			this.metaText[key] += "\n" + value;
	}
});
