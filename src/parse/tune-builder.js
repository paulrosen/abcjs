var parseKeyVoice = require('../parse/abc_parse_key_voice');
//var parseCommon = require('../parse/abc_common');
//var parseDirective = require('./abc_parse_directive');

var TuneBuilder = function (tune) {
	var self = this;
	var voiceDefs = {}
	var currentVoiceName = ''
	tune.reset();

	this.setVisualTranspose = function (visualTranspose) {
		if (visualTranspose)
			tune.visualTranspose = visualTranspose;
	};

	this.cleanUp = function (barsperstaff, staffnonote, currSlur) {
		closeLine(tune);	// Close the last line.
		delete tune.runningFonts;

		simplifyMetaText(tune)
		//addRichTextToAnnotationsAndLyrics(tune)

		// If the tempo was created with a string like "Allegro", then the duration of a beat needs to be set at the last moment, when it is most likely known.
		if (tune.metaText.tempo && tune.metaText.tempo.bpm && !tune.metaText.tempo.duration)
			tune.metaText.tempo.duration = [tune.getBeatLength()];

		// Remove any blank lines
		var anyDeleted = false;
		var i, s, v;
		for (i = 0; i < tune.lines.length; i++) {
			if (tune.lines[i].staff !== undefined) {
				var hasAny = false;
				for (s = 0; s < tune.lines[i].staff.length; s++) {
					if (tune.lines[i].staff[s] === undefined) {
						anyDeleted = true;
						tune.lines[i].staff[s] = null;
						//tune.lines[i].staff[s] = { voices: []};	// TODO-PER: There was a part missing in the abc music. How should we recover?
					} else {
						for (v = 0; v < tune.lines[i].staff[s].voices.length; v++) {
							if (tune.lines[i].staff[s].voices[v] === undefined)
								tune.lines[i].staff[s].voices[v] = [];	// TODO-PER: There was a part missing in the abc music. How should we recover?
							else
								if (containsNotes(tune.lines[i].staff[s].voices[v])) hasAny = true;
						}
					}
				}
				if (!hasAny) {
					tune.lines[i] = null;
					anyDeleted = true;
				}
			}
		}
		if (anyDeleted) {
			tune.lines = tune.lines.filter(function (line) { return !!line });
			tune.lines.forEach(function (line) {
				if (line.staff)
					line.staff = line.staff.filter(function (line) { return !!line });
			});
		}

		// if we exceeded the number of bars allowed on a line, then force a new line
		if (barsperstaff) {
			while (wrapMusicLines(tune.lines, barsperstaff)) {
				// This will keep wrapping until the end of the piece.
			}
		}

		// If we were passed staffnonote, then we want to get rid of all staffs that contain only rests.
		if (staffnonote) {
			anyDeleted = false;
			for (i = 0; i < tune.lines.length; i++) {
				if (tune.lines[i].staff !== undefined) {
					for (s = 0; s < tune.lines[i].staff.length; s++) {
						var keepThis = false;
						for (v = 0; v < tune.lines[i].staff[s].voices.length; v++) {
							if (containsNotesStrict(tune.lines[i].staff[s].voices[v])) {
								keepThis = true;
							}
						}
						if (!keepThis) {
							anyDeleted = true;
							tune.lines[i].staff[s] = null;
						}
					}
				}
			}
			if (anyDeleted) {
				tune.lines.forEach(function (line) {
					if (line.staff)
						line.staff = line.staff.filter(function (staff) { return !!staff });
				});
			}
		}

		fixTitles(tune.lines);

		// Remove the temporary working variables
		for (i = 0; i < tune.lines.length; i++) {
			if (tune.lines[i].staff) {
				for (s = 0; s < tune.lines[i].staff.length; s++)
					delete tune.lines[i].staff[s].workingClef;
			}
		}

		// If there are overlays, create new voices for them.
		while (resolveOverlays(tune)) {
			// keep resolving overlays as long as any are found.
		}

		for (var i = 0; i < tune.lines.length; i++) {
			var staff = tune.lines[i].staff;
			if (staff) {
				for (tune.staffNum = 0; tune.staffNum < staff.length; tune.staffNum++) {
					if (staff[tune.staffNum].clef)
						parseKeyVoice.fixClef(staff[tune.staffNum].clef);
					for (tune.voiceNum = 0; tune.voiceNum < staff[tune.staffNum].voices.length; tune.voiceNum++) {
						var voice = staff[tune.staffNum].voices[tune.voiceNum];
						cleanUpSlursInLine(voice, tune.staffNum, tune.voiceNum, currSlur);
						for (var j = 0; j < voice.length; j++) {
							if (voice[j].el_type === 'clef')
								parseKeyVoice.fixClef(voice[j]);
						}
						if (voice.length > 0 && voice[voice.length - 1].barNumber) {
							// Don't hang a bar number on the last bar line: it should go on the next line.
							var nextLine = getNextMusicLine(tune.lines, i);
							if (nextLine)
								nextLine.staff[0].barNumber = voice[voice.length - 1].barNumber;
							delete voice[voice.length - 1].barNumber;
						}
					}
				}
			}
		}

		// Remove temporary variables that the outside doesn't need to know about
		delete tune.staffNum;
		delete tune.voiceNum;
		delete tune.lineNum;
		delete tune.potentialStartBeam;
		delete tune.potentialEndBeam;
		delete tune.vskipPending;

		return currSlur;
	};

	this.addTieToLastNote = function (dottedTie) {
		// TODO-PER: if this is a chord, which note?
		var el = getLastNote(tune);
		if (el && el.pitches && el.pitches.length > 0) {
			el.pitches[0].startTie = {};
			if (dottedTie)
				el.pitches[0].startTie.style = 'dotted';
			return true;
		}
		return false;
	};

	this.appendElement = function (type, startChar, endChar, hashParams) {
		hashParams.el_type = type;
		if (startChar !== null)
			hashParams.startChar = startChar;
		if (endChar !== null)
			hashParams.endChar = endChar;
		if (type === 'note') { // && (hashParams.rest !== undefined || hashParams.end_beam === undefined)) {
			// Now, add the startBeam and endBeam where it is needed.
			// end_beam is already set on the places where there is a forced end_beam. We'll remove that here after using that info.
			// this.potentialStartBeam either points to null or the start beam.
			// this.potentialEndBeam either points to null or the start beam.
			// If we have a beam break (note is longer than a quarter, or an end_beam is on this element), then set the beam if we have one.
			// reset the variables for the next notes.
			var dur = getDuration(hashParams);
			if (dur >= 0.25) {	// The beam ends on the note before this.
				endBeamLast(tune);
			} else if (hashParams.force_end_beam_last && tune.potentialStartBeam !== undefined) {
				endBeamLast(tune);
			} else if (hashParams.end_beam && tune.potentialStartBeam !== undefined) {	// the beam is forced to end on this note, probably because of a space in the ABC
				if (hashParams.rest === undefined)
					endBeamHere(hashParams, tune);
				else
					endBeamLast(tune);
			} else if (hashParams.rest === undefined) {	// this a short note and we aren't about to end the beam
				if (tune.potentialStartBeam === undefined) {	// We aren't collecting notes for a beam, so start here.
					if (!hashParams.end_beam) {
						tune.potentialStartBeam = hashParams;
						delete tune.potentialEndBeam;
					}
				} else {
					tune.potentialEndBeam = hashParams;	// Continue the beaming, look for the end next note.
				}
			}

			//  end_beam goes on rests and notes which precede rests _except_ when a rest (or set of adjacent rests) has normal notes on both sides (no spaces)
			//			if (hashParams.rest !== undefined)
			//			{
			//				hashParams.end_beam = true;
			//				var el2 = getLastNote(tune);
			//				if (el2) el2.end_beam = true;
			//				// TODO-PER: implement exception mentioned in the comment.
			//			}
		} else {	// It's not a note, so there definitely isn't beaming after it.
			endBeamLast(tune);
		}
		delete hashParams.end_beam;	// We don't want this temporary variable hanging around.
		delete hashParams.force_end_beam_last;	// We don't want this temporary variable hanging around.
		if (hashParams.rest && hashParams.rest.type === 'invisible') {
			delete hashParams.decoration // the decorations on invisible rests should be invisible, too.
		}
		if (tune.lines.length <= tune.lineNum || tune.lines[tune.lineNum].staff.length <= tune.staffNum) {
			//console.log("pushNote IGNORED", tune.lines[tune.lineNum])
			// TODO-PER: This prevents a crash, but it drops the element. Need to figure out how to start a new line, or delay adding this.
			return false;
		}

		pushNote(self, tune, hashParams, voiceDefs, currentVoiceName);
		return true
	};

	this.appendStartingElement = function (type, startChar, endChar, hashParams2) {
		//console.log('appendStartingElement', hashParams2)
		// If we're in the middle of beaming, then end the beam.
		closeLine(tune);

		// We only ever want implied naturals the first time.
		var impliedNaturals;
		if (type === 'key') {
			impliedNaturals = hashParams2.impliedNaturals;
			delete hashParams2.impliedNaturals;
			delete hashParams2.explicitAccidentals;
		}

		// Clone the object because it will be sticking around for the next line and we don't want the extra fields in it.
		var hashParams = Object.assign({}, hashParams2);

		// be sure that we are on a music type line before doing the following.
		if (!tune.lines[tune.lineNum]) return
		var staff = tune.lines[tune.lineNum].staff
		if (!staff) return

		// If tune is the first item in tune staff, then we might have to initialize the staff, first.
		if (staff.length <= tune.staffNum) {
			staff[tune.staffNum] = {};
			staff[tune.staffNum].clef = Object.assign({}, staff[0].clef);
			staff[tune.staffNum].key = Object.assign({}, staff[0].key);
			if (staff[0].meter)
				staff[tune.staffNum].meter = Object.assign({}, staff[0].meter);
			staff[tune.staffNum].workingClef = Object.assign({}, staff[0].workingClef);
			staff[tune.staffNum].voices = [[]];
		}
		// If tune is a clef type, then we replace the working clef on the line. This is kept separate from
		// the clef in case there is an inline clef field. We need to know what the current position for
		// the note is.
		if (type === 'clef') {
			staff[tune.staffNum].workingClef = hashParams;
		}

		// These elements should not be added twice, so if the element exists on tune line without a note or bar before it, just replace the staff version.
		var voice = staff[tune.staffNum].voices[tune.voiceNum];
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' || voice[i].el_type === 'bar') {
				hashParams.el_type = type;
				hashParams.startChar = startChar;
				hashParams.endChar = endChar;
				if (impliedNaturals)
					hashParams.accidentals = impliedNaturals.concat(hashParams.accidentals);
				voice.push(hashParams);
				return;
			}
			if (voice[i].el_type === type) {
				hashParams.el_type = type;
				hashParams.startChar = startChar;
				hashParams.endChar = endChar;
				if (impliedNaturals)
					hashParams.accidentals = impliedNaturals.concat(hashParams.accidentals);
				voice[i] = hashParams;
				return;
			}
		}
		// We didn't see either that type or a note, so replace the element to the staff.
		staff[tune.staffNum][type] = hashParams2;
	};

	this.addSubtitle = function (str, info) {
		pushLine(tune, { subtitle: { text: str, startChar: info.startChar, endChar: info.endChar } });
	};

	this.addSpacing = function (num) {
		tune.vskipPending = num;
	};

	this.addNewPage = function (num) {
		pushLine(tune, { newpage: num });
	};

	this.addSeparator = function (spaceAbove, spaceBelow, lineLength, info) {
		pushLine(tune, { separator: { spaceAbove: Math.round(spaceAbove), spaceBelow: Math.round(spaceBelow), lineLength: Math.round(lineLength), startChar: info.startChar, endChar: info.endChar } });
	};

	this.addText = function (str, info) {
		pushLine(tune, { text: { text: str, startChar: info.startChar, endChar: info.endChar } });
	};

	this.addCentered = function (str) {
		pushLine(tune, { text: [{ text: str, center: true }] });
	};

	//	anyVoiceContainsNotes: function(line) {
	//		for (var i = 0; i < line.staff.voices.length; i++) {
	//			if (containsNotes(line.staff.voices[i]))
	//				return true;
	//		}
	//		return false;
	//	},
	this.changeVoiceScale = function (scale) {
		self.appendElement('scale', null, null, { size: scale });
	};
	this.changeVoiceColor = function (color) {
		self.appendElement('color', null, null, { color: color });
	};

	this.startNewLine = function (params) {
		//console.log("startNewLine", tune.lineNum, params, voiceDefs)
		// If the pointed to line doesn't exist, just create that. If the line does exist, but doesn't have any music on it, just use it.
		// If it does exist and has music, then increment the line number. If the new element doesn't exist, create it.
		closeLine(tune);	// Close the previous line.
		if (params.currentVoiceName) {
			currentVoiceName = params.currentVoiceName
			voiceDefs[params.currentVoiceName] = params
		}

		if (tune.lines[tune.lineNum] === undefined) createLine(self, tune, params);
		else if (tune.lines[tune.lineNum].staff === undefined) {
			tune.lineNum++;
			this.startNewLine(params);
		} else if (tune.lines[tune.lineNum].staff[tune.staffNum] === undefined) createStaff(self, tune, params);
		else if (tune.lines[tune.lineNum].staff[tune.staffNum].voices[tune.voiceNum] === undefined) createVoice(self, tune, params);
		else if (!containsNotes(tune.lines[tune.lineNum].staff[tune.staffNum].voices[tune.voiceNum])) {
			// We don't need a new line but we might need to update parts of it.
			if (params.part)
				self.appendElement('part', params.part.startChar, params.part.endChar, { title: params.part.title });
		} else {
			tune.lineNum++;
			this.startNewLine(params);
		}
	};

	this.setRunningFont = function (type, font) {
		// This is called at tune start to set the current default fonts so we know whether to record a change.
		tune.runningFonts[type] = font;
	};

	this.setBarNumberImmediate = function (barNumber) {
		// If tune is called right at the beginning of a line, then correct the measure number that is already written.
		// If tune is called at the beginning of a measure, then correct the measure number that was just created.
		// If tune is called in the middle of a measure, then subtract one from it, because it will be incremented before applied.
		var currentVoice = this.getCurrentVoice();
		if (currentVoice && currentVoice.length > 0) {
			var lastElement = currentVoice[currentVoice.length - 1];
			if (lastElement.el_type === 'bar') {
				if (lastElement.barNumber !== undefined) // the measure number might not be written for tune bar, don't override that.
					lastElement.barNumber = barNumber;
			} else
				return barNumber - 1;
		}
		return barNumber;
	};

	this.hasBeginMusic = function () {
		// return true if there exists at least one line that contains "staff"
		for (var i = 0; i < tune.lines.length; i++) {
			if (tune.lines[i].staff)
				return true;
		}
		return false;
	};

	this.isFirstLine = function (index) {
		for (var i = index - 1; i >= 0; i--) {
			if (tune.lines[i].staff !== undefined) return false;
		}
		return true;
	};

	this.getCurrentVoice = function () {
		//console.log("getCurrentVoice", tune.lineNum)
		var currLine = tune.lines[tune.lineNum];
		if (!currLine)
			return null;
		var currStaff = currLine.staff[tune.staffNum];
		if (!currStaff)
			return null;
		if (currStaff.voices[tune.voiceNum] !== undefined)
			return currStaff.voices[tune.voiceNum];
		else return null;
	};

	this.setCurrentVoice = function (staffNum, voiceNum, name) {
		//console.log("setCurrentVoice", tune.lineNum, staffNum, voiceNum, name, voiceDefs)
		tune.staffNum = staffNum;
		tune.voiceNum = voiceNum;
		currentVoiceName = name
		for (var i = 0; i < tune.lines.length; i++) {
			if (tune.lines[i].staff) {
				if (tune.lines[i].staff[staffNum] === undefined || tune.lines[i].staff[staffNum].voices[voiceNum] === undefined ||
					!containsNotes(tune.lines[i].staff[staffNum].voices[voiceNum])) {
					//console.log("cv2", i, tune.lines[i].staff[staffNum])
					tune.lineNum = i;
					if (!tune.lines[i].staff[staffNum] || !!tune.lines[i].staff[staffNum].voices[voiceNum]) return true
					return false;
				}
			}
		}
		//console.log("cv3", i, tune.lineNum, tune.lines[tune.lineNum])
		tune.lineNum = i;
		return false
	};

	this.addMetaText = function (key, value, info) {
		if (tune.metaText[key] === undefined) {
			tune.metaText[key] = value;
			tune.metaTextInfo[key] = info;
		} else {
			if (typeof tune.metaText[key] === 'string' && typeof value === 'string')
				tune.metaText[key] += "\n" + value;
			else {
				if (tune.metaText[key] === 'string')
					tune.metaText[key] = [{ text: tune.metaText[key] }]
				if (typeof value === 'string')
					value = [{ text: value }]
				tune.metaText[key] = tune.metaText[key].concat(value)
			}
			tune.metaTextInfo[key].endChar = info.endChar;
		}
	};

	this.addMetaTextArray = function (key, value, info) {
		if (tune.metaText[key] === undefined) {
			tune.metaText[key] = [value];
			tune.metaTextInfo[key] = info;
		} else {
			tune.metaText[key].push(value);
			tune.metaTextInfo[key].endChar = info.endChar;
		}
	};
	this.addMetaTextObj = function (key, value, info) {
		tune.metaText[key] = value;
		tune.metaTextInfo[key] = info;
	};
};

function isArrayOfStrings(arr) {
	if (!arr) return false
	if (typeof arr === "string") return false
	//var str = ''
	for (var i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== 'string')
			return false
	}
	return true
}

function simplifyMetaText(tune) {
	if (isArrayOfStrings(tune.metaText.notes))
		tune.metaText.notes = tune.metaText.notes.join("\n")
	if (isArrayOfStrings(tune.metaText.history))
		tune.metaText.history = tune.metaText.history.join("\n")
}

// function addRichTextToAnnotationsAndLyrics(tune) {
// 	var lines = tune.lines
// 	for (var i = 0; i < lines.length; i++) {
// 		if (lines[i].staff !== undefined) {
// 			for (var s = 0; s < lines[i].staff.length; s++) {
// 				for (var v = 0; v < lines[i].staff[s].voices.length; v++) {
// 					var voice = lines[i].staff[s].voices[v];
// 					for (var n = 0; n < voice.length; n++) {
// 						var element = voice[n]
// 						if (element.chord) {
// 							for (var c = 0; c < element.chord.length; c++) {
// 								element.chord[c].name = parseDirective.parseFontChangeLine(element.chord[c].name)
// 								console.log(element.chord[c].name)
// 							}
// 						}
// 						if (element.lyric) {
// 							for (var l = 0; l < element.lyric.length; l++) {
// 								element.lyric[l].syllable = parseDirective.parseFontChangeLine(element.lyric[l].syllable)
// 								console.log(element.lyric[l].syllable)
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}

// }

function resolveOverlays(tune) {
	var madeChanges = false;
	var durationsPerLines = [];
	for (var i = 0; i < tune.lines.length; i++) {
		var line = tune.lines[i];
		if (line.staff) {
			for (var j = 0; j < line.staff.length; j++) {
				var staff = line.staff[j];
				var overlayVoice = [];
				for (var k = 0; k < staff.voices.length; k++) {
					var voice = staff.voices[k];
					overlayVoice.push({ hasOverlay: false, voice: [], snip: [] });
					durationsPerLines[i] = 0;
					var durationThisBar = 0;
					var inOverlay = false;
					var overlayDuration = 0;
					var snipStart = -1;
					for (var kk = 0; kk < voice.length; kk++) {
						var event = voice[kk];
						if (event.el_type === "overlay" && !inOverlay) {
							madeChanges = true;
							inOverlay = true;
							snipStart = kk;
							overlayVoice[k].hasOverlay = true;
							if (overlayDuration === 0)
								overlayDuration = durationsPerLines[i];
							// If this isn't the first line, we also need invisible rests on the previous lines.
							// So, if the next voice doesn't appear in a previous line, create it
							for (var ii = 0; ii < i; ii++) {
								if (durationsPerLines[ii] && tune.lines[ii].staff && staff.voices.length >= tune.lines[ii].staff[0].voices.length) {
									tune.lines[ii].staff[0].voices.push([{
										el_type: "note",
										duration: durationsPerLines[ii],
										rest: { type: "invisible" },
										startChar: event.startChar,
										endChar: event.endChar
									}]);
								}
							}
						} else if (event.el_type === "bar") {
							if (inOverlay) {
								// delete the overlay events from this array without messing up this loop.
								inOverlay = false;
								overlayVoice[k].snip.push({ start: snipStart, len: kk - snipStart });
								overlayVoice[k].voice.push(event); // Also end the overlay with the barline.
							} else {
								// This keeps the voices lined up: if the overlay isn't in the first measure then we need a bunch of invisible rests.
								if (durationThisBar > 0)
									overlayVoice[k].voice.push({ el_type: "note", duration: durationThisBar, rest: { type: "invisible" }, startChar: event.startChar, endChar: event.endChar });
								overlayVoice[k].voice.push(event);
							}
							durationThisBar = 0;
						} else if (event.el_type === "note") {
							if (inOverlay) {
								overlayVoice[k].voice.push(event);
							} else {
								durationThisBar += event.duration;
								durationsPerLines[i] += event.duration;
							}
						} else if (event.el_type === "scale" || event.el_type === "stem" || event.el_type === "overlay" || event.el_type === "style" || event.el_type === "transpose" || event.el_type === "color") {
							// These types of events are duplicated on the overlay layer.
							overlayVoice[k].voice.push(event);
						}
					}
					if (overlayVoice[k].hasOverlay && overlayVoice[k].snip.length === 0) {
						// there was no closing bar, so we didn't set the snip amount.
						overlayVoice[k].snip.push({ start: snipStart, len: voice.length - snipStart });
					}
				}
				for (k = 0; k < overlayVoice.length; k++) {
					var ov = overlayVoice[k];
					if (ov.hasOverlay) {
						ov.voice.splice(0, 0, { el_type: "stem", direction: "down" })
						staff.voices.push(ov.voice);
						for (var kkk = ov.snip.length - 1; kkk >= 0; kkk--) {
							var snip = ov.snip[kkk];
							staff.voices[k].splice(snip.start, snip.len);
							staff.voices[k].splice(snip.start + 1, 0, { el_type: "stem", direction: "auto" });
							var indexOfLastBar = findLastBar(staff.voices[k], snip.start);
							staff.voices[k].splice(indexOfLastBar, 0, { el_type: "stem", direction: "up" });
						}
						// remove ending marks from the overlay voice so they are not repeated
						for (kkk = 0; kkk < staff.voices[staff.voices.length - 1].length; kkk++) {
							staff.voices[staff.voices.length - 1][kkk] = Object.assign({}, staff.voices[staff.voices.length - 1][kkk]);
							var el = staff.voices[staff.voices.length - 1][kkk];
							if (el.el_type === 'bar' && el.startEnding) {
								delete el.startEnding;
							}
							if (el.el_type === 'bar' && el.endEnding)
								delete el.endEnding;
						}
					}
				}
			}
		}
	}
	return madeChanges;
};

function findLastBar(voice, start) {
	for (var i = start - 1; i > 0 && voice[i].el_type !== "bar"; i--) {

	}
	return i;
}

function fixTitles(lines) {
	// We might have name and subname defined. We now know what line everything is on, so we can determine which to use.
	var firstMusicLine = true;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.staff) {
			for (var j = 0; j < line.staff.length; j++) {
				var staff = line.staff[j];
				if (staff.title) {
					var hasATitle = false;
					for (var k = 0; k < staff.title.length; k++) {
						if (staff.title[k]) {
							staff.title[k] = (firstMusicLine) ? staff.title[k].name : staff.title[k].subname;
							if (staff.title[k])
								hasATitle = true;
							else
								staff.title[k] = '';
						} else
							staff.title[k] = '';
					}
					if (!hasATitle)
						delete staff.title;
				}
			}
			firstMusicLine = false;
		}
	}
}

function cleanUpSlursInLine(line, staffNum, voiceNum, currSlur) {
	if (!currSlur[staffNum])
		currSlur[staffNum] = [];
	if (!currSlur[staffNum][voiceNum])
		currSlur[staffNum][voiceNum] = [];
	var x;
	//			var lyr = null;	// TODO-PER: debugging.

	var addEndSlur = function (obj, num, chordPos) {
		if (currSlur[staffNum][voiceNum][chordPos] === undefined) {
			// There isn't an exact match for note position, but we'll take any other open slur.
			for (x = 0; x < currSlur[staffNum][voiceNum].length; x++) {
				if (currSlur[staffNum][voiceNum][x] !== undefined) {
					chordPos = x;
					break;
				}
			}
			if (currSlur[staffNum][voiceNum][chordPos] === undefined) {
				var offNum = chordPos * 100 + 1;
				obj.endSlur.forEach(function (x) { if (offNum === x) --offNum; });
				currSlur[staffNum][voiceNum][chordPos] = [offNum];
			}
		}
		var slurNum;
		for (var i = 0; i < num; i++) {
			slurNum = currSlur[staffNum][voiceNum][chordPos].pop();
			obj.endSlur.push(slurNum);
			//					lyr.syllable += '<' + slurNum;	// TODO-PER: debugging
		}
		if (currSlur[staffNum][voiceNum][chordPos].length === 0)
			delete currSlur[staffNum][voiceNum][chordPos];
		return slurNum;
	};

	var addStartSlur = function (obj, num, chordPos, usedNums) {
		obj.startSlur = [];
		if (currSlur[staffNum][voiceNum][chordPos] === undefined) {
			currSlur[staffNum][voiceNum][chordPos] = [];
		}
		var nextNum = chordPos * 100 + 1;
		for (var i = 0; i < num; i++) {
			if (usedNums) {
				usedNums.forEach(function (x) { if (nextNum === x) ++nextNum; });
				usedNums.forEach(function (x) { if (nextNum === x) ++nextNum; });
				usedNums.forEach(function (x) { if (nextNum === x) ++nextNum; });
			}
			currSlur[staffNum][voiceNum][chordPos].forEach(function (x) { if (nextNum === x) ++nextNum; });
			currSlur[staffNum][voiceNum][chordPos].forEach(function (x) { if (nextNum === x) ++nextNum; });

			currSlur[staffNum][voiceNum][chordPos].push(nextNum);
			obj.startSlur.push({ label: nextNum });
			if (obj.dottedSlur) {
				obj.startSlur[obj.startSlur.length - 1].style = 'dotted';
				delete obj.dottedSlur;
			}
			//					lyr.syllable += ' ' + nextNum + '>';	// TODO-PER:debugging
			nextNum++;
		}
	};

	for (var i = 0; i < line.length; i++) {
		var el = line[i];
		//				if (el.lyric === undefined)	// TODO-PER: debugging
		//					el.lyric = [{ divider: '-' }];	// TODO-PER: debugging
		//				lyr = el.lyric[0];	// TODO-PER: debugging
		//				lyr.syllable = '';	// TODO-PER: debugging
		if (el.el_type === 'note') {
			if (el.gracenotes) {
				for (var g = 0; g < el.gracenotes.length; g++) {
					if (el.gracenotes[g].endSlur) {
						var gg = el.gracenotes[g].endSlur;
						el.gracenotes[g].endSlur = [];
						for (var ggg = 0; ggg < gg; ggg++)
							addEndSlur(el.gracenotes[g], 1, 20);
					}
					if (el.gracenotes[g].startSlur) {
						x = el.gracenotes[g].startSlur;
						addStartSlur(el.gracenotes[g], x, 20);
					}
				}
			}
			if (el.endSlur) {
				x = el.endSlur;
				el.endSlur = [];
				addEndSlur(el, x, 0);
			}
			if (el.startSlur) {
				x = el.startSlur;
				addStartSlur(el, x, 0);
			}
			if (el.pitches) {
				var usedNums = [];
				for (var p = 0; p < el.pitches.length; p++) {
					if (el.pitches[p].endSlur) {
						var k = el.pitches[p].endSlur;
						el.pitches[p].endSlur = [];
						for (var j = 0; j < k; j++) {
							var slurNum = addEndSlur(el.pitches[p], 1, p + 1);
							usedNums.push(slurNum);
						}
					}
				}
				for (p = 0; p < el.pitches.length; p++) {
					if (el.pitches[p].startSlur) {
						x = el.pitches[p].startSlur;
						addStartSlur(el.pitches[p], x, p + 1, usedNums);
					}
				}
				// Correct for the weird gracenote case where ({g}a) should match.
				// The end slur was already assigned to the note, and needs to be moved to the first note of the graces.
				if (el.gracenotes && el.pitches[0].endSlur && el.pitches[0].endSlur[0] === 100 && el.pitches[0].startSlur) {
					if (el.gracenotes[0].endSlur)
						el.gracenotes[0].endSlur.push(el.pitches[0].startSlur[0].label);
					else
						el.gracenotes[0].endSlur = [el.pitches[0].startSlur[0].label];
					if (el.pitches[0].endSlur.length === 1)
						delete el.pitches[0].endSlur;
					else if (el.pitches[0].endSlur[0] === 100)
						el.pitches[0].endSlur.shift();
					else if (el.pitches[0].endSlur[el.pitches[0].endSlur.length - 1] === 100)
						el.pitches[0].endSlur.pop();
					if (currSlur[staffNum][voiceNum][1].length === 1)
						delete currSlur[staffNum][voiceNum][1];
					else
						currSlur[staffNum][voiceNum][1].pop();
				}
			}
		}
	}
}

function wrapMusicLines(lines, barsperstaff) {
	for (i = 0; i < lines.length; i++) {
		if (lines[i].staff !== undefined) {
			for (s = 0; s < lines[i].staff.length; s++) {
				var permanentItems = [];
				for (v = 0; v < lines[i].staff[s].voices.length; v++) {
					var voice = lines[i].staff[s].voices[v];
					var barNumThisLine = 0;
					for (var n = 0; n < voice.length; n++) {
						if (voice[n].el_type === 'bar') {
							barNumThisLine++;
							if (barNumThisLine >= barsperstaff) {
								// push everything else to the next line, if there is anything else,
								// and there is a next line. If there isn't a next line, create one.
								if (n < voice.length - 1) {
									var nextLine = getNextMusicLine(lines, i);
									if (!nextLine) {
										var cp = JSON.parse(JSON.stringify(lines[i]));
										lines.push(Object.assign({}, cp));
										nextLine = lines[lines.length - 1];
										for (var ss = 0; ss < nextLine.staff.length; ss++) {
											for (var vv = 0; vv < nextLine.staff[ss].voices.length; vv++)
												nextLine.staff[ss].voices[vv] = [];
										}
									}
									var startElement = n + 1;
									var section = lines[i].staff[s].voices[v].slice(startElement);
									lines[i].staff[s].voices[v] = lines[i].staff[s].voices[v].slice(0, startElement);
									nextLine.staff[s].voices[v] = permanentItems.concat(section.concat(nextLine.staff[s].voices[v]));
									return true;
								}
							}
						} else if (!voice[n].duration) {
							permanentItems.push(voice[n]);
						}
					}
				}
			}
		}
	}
	return false;
}

function getNextMusicLine(lines, currentLine) {
	currentLine++;
	while (lines.length > currentLine) {
		if (lines[currentLine].staff)
			return lines[currentLine];
		currentLine++;
	}
	return null;
}

function getLastNote(tune) {
	if (!tune.lines[tune.lineNum]) return null
	if (!tune.lines[tune.lineNum].staff) return null
	if (!tune.lines[tune.lineNum].staff[tune.staffNum]) return null
	var voice = tune.lines[tune.lineNum].staff[tune.staffNum].voices[tune.voiceNum]
	if (!voice) return null
	for (var i = voice.length - 1; i >= 0; i--) {
		var el = voice[i];
		if (el.el_type === 'note') {
			return el;
		}
	}
	return null;
};

function getDuration(el) {
	if (el.duration) return el.duration;
	return 0;
};

function closeLine(tune) {
	if (tune.potentialStartBeam && tune.potentialEndBeam) {
		tune.potentialStartBeam.startBeam = true;
		tune.potentialEndBeam.endBeam = true;
	}
	delete tune.potentialStartBeam;
	delete tune.potentialEndBeam;
};

function containsNotes(voice) {
	for (var i = 0; i < voice.length; i++) {
		if (voice[i].el_type === 'note' || voice[i].el_type === 'bar')
			return true;
	}
	return false;
};

function containsNotesStrict(voice) {
	for (var i = 0; i < voice.length; i++) {
		if (voice[i].el_type === 'note' && (voice[i].rest === undefined || voice[i].chord !== undefined))
			return true;
	}
	return false;
};

function pushLine(tune, hash) {
	if (tune.vskipPending) {
		hash.vskip = tune.vskipPending;
		delete tune.vskipPending;
	}
	tune.lines.push(hash);
};

function pushNote(self, tune, hp, voiceDefs, currentVoiceName) {
	//console.log("pushNote", tune.lineNum, tune.staffNum, hp.pitches ? JSON.stringify(hp.pitches) : hp.pitches)
	var currStaff = tune.lines[tune.lineNum].staff[tune.staffNum];

	if (hp.pitches !== undefined) {
		var mid = currStaff.workingClef.verticalPos;
		hp.pitches.forEach(function (p) { p.verticalPos = p.pitch - mid; });
	}
	if (hp.gracenotes !== undefined) {
		var mid2 = currStaff.workingClef.verticalPos;
		hp.gracenotes.forEach(function (p) { p.verticalPos = p.pitch - mid2; });
	}
	if (currStaff.voices.length <= tune.voiceNum) {
		//console.log("should create?", currentVoiceName, voiceDefs)
		if (!voiceDefs[currentVoiceName])
			voiceDefs[currentVoiceName] = {}
		createVoice(self, tune, voiceDefs[currentVoiceName])
	}
	currStaff.voices[tune.voiceNum].push(hp);
}

function endBeamHere(hashParams, tune) {
	tune.potentialStartBeam.startBeam = true;
	hashParams.endBeam = true;
	delete tune.potentialStartBeam;
	delete tune.potentialEndBeam;
}
function endBeamLast(tune) {
	if (tune.potentialStartBeam !== undefined && tune.potentialEndBeam !== undefined) {	// Do we have a set of notes to beam?
		tune.potentialStartBeam.startBeam = true;
		tune.potentialEndBeam.endBeam = true;
	}
	delete tune.potentialStartBeam;
	delete tune.potentialEndBeam;
}

function setLineFont(tune, type, font) {
	// If we haven't encountered the font type yet then we are using the default font so it doesn't
	// need to be noted. If we have encountered it, then only record it if it is different from the last time.
	if (tune.runningFonts[type]) {
		var isDifferent = false;
		var keys = Object.keys(font);
		for (var i = 0; i < keys.length; i++) {
			if (tune.runningFonts[type][keys[i]] !== font[keys[i]])
				isDifferent = true;
		}
		if (isDifferent) {
			tune.lines[tune.lineNum].staff[tune.staffNum][type] = font;
		}
	}
	tune.runningFonts[type] = font;
}

function createVoice(self, tune, params) {
	//console.log("createVoice", params)
	var thisStaff = tune.lines[tune.lineNum].staff[tune.staffNum];
	thisStaff.voices[tune.voiceNum] = [];
	if (!thisStaff.title)
		thisStaff.title = [];
	thisStaff.title[tune.voiceNum] = { name: params.name, subname: params.subname };
	if (params.style)
		self.appendElement('style', null, null, { head: params.style });
	if (params.stem)
		self.appendElement('stem', null, null, { direction: params.stem });
	else if (tune.voiceNum > 0) {
		if (thisStaff.voices[0] !== undefined) {
			var found = false;
			for (var i = 0; i < thisStaff.voices[0].length; i++) {
				if (thisStaff.voices[0].el_type === 'stem')
					found = true;
			}
			if (!found) {
				var stem = { el_type: 'stem', direction: 'up' };
				thisStaff.voices[0].splice(0, 0, stem);
			}
		}
		self.appendElement('stem', null, null, { direction: 'down' });
	}
	if (params.scale)
		self.appendElement('scale', null, null, { size: params.scale });
	if (params.color)
		self.appendElement('color', null, null, { color: params.color });
}

function createStaff(self, tune, params) {
	if (params.key && params.key.impliedNaturals) {
		params.key.accidentals = params.key.accidentals.concat(params.key.impliedNaturals);
		delete params.key.impliedNaturals;
	}

	tune.lines[tune.lineNum].staff[tune.staffNum] = { voices: [], clef: params.clef, key: params.key, workingClef: params.clef };
	var staff = tune.lines[tune.lineNum].staff[tune.staffNum]
	if (params.stafflines !== undefined) {
		staff.clef.stafflines = params.stafflines;
		staff.workingClef.stafflines = params.stafflines;
	}
	if (params.staffscale) {
		staff.staffscale = params.staffscale;
	}
	if (params.annotationfont) setLineFont(tune, "annotationfont", params.annotationfont);
	if (params.gchordfont) setLineFont(tune, "gchordfont", params.gchordfont);
	if (params.tripletfont) setLineFont(tune, "tripletfont", params.tripletfont);
	if (params.vocalfont) setLineFont(tune, "vocalfont", params.vocalfont);
	if (params.bracket) staff.bracket = params.bracket;
	if (params.brace) staff.brace = params.brace;
	if (params.connectBarLines) staff.connectBarLines = params.connectBarLines;
	if (params.barNumber) staff.barNumber = params.barNumber;
	createVoice(self, tune, params);
	// Some stuff just happens for the first voice
	if (params.part)
		self.appendElement('part', params.part.startChar, params.part.endChar, { title: params.part.title });
	if (params.meter !== undefined) staff.meter = params.meter;
	if (tune.vskipPending) {
		tune.lines[tune.lineNum].vskip = tune.vskipPending;
		delete tune.vskipPending;
	}
}

function createLine(self, tune, params) {
	tune.lines[tune.lineNum] = { staff: [] };
	createStaff(self, tune, params);
}

module.exports = TuneBuilder;
