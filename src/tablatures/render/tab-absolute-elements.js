/**
 * Tablature Absolute elements factory
 */
var AbsoluteElement = require('../../write/creation/elements/absolute-element');
var RelativeElement = require('../../write/creation/elements/relative-element');
var glyphs = require('../../write/creation/glyphs');

function isObject(a) { return a != null && a.constructor === Object; }
function cloneObject(dest, src) {
	for (var prop in src) {
		if (src.hasOwnProperty(prop)) {
			if (!(Array.isArray(src[prop]) || isObject(src[prop]))) {
				dest[prop] = src[prop];
			}
		}
	}
}

function cloneAbsolute(absSrc) {
	var returned = new AbsoluteElement('', 0, 0, '', 0);
	cloneObject(returned, absSrc);
	returned.top = 0;
	returned.bottom = -1;
	if (absSrc.abcelem) {
		returned.abcelem = {};
		cloneObject(returned.abcelem, absSrc.abcelem);
		if (returned.abcelem.el_type === "note")
			returned.abcelem.el_type = 'tabNumber';
	}
	// TODO-PER: This fixes the classes because the element isn't created at the right time.
	absSrc.cloned = returned
	return returned;
}

function cloneAbsoluteAndRelatives(absSrc, plugin) {
	var returned = cloneAbsolute(absSrc);
	if (plugin) {
		var children = absSrc.children;
		// proceed with relative as well
		var first = true;
		for (var ii = 0; ii < children.length; ii++) {
			var child = children[ii];
			var relative = new RelativeElement('', 0, 0, 0, '');
			cloneObject(relative, child);
			first = plugin.tablature.setRelative(child, relative, first);
			returned.children.push(relative);
		}
	}
	return returned;
}

function buildTabAbsolute(plugin, absX, relX) {
	var tabIcon = 'tab.tiny';
	var tabYPos = 7.5;
	if (plugin.isTabBig) {
		tabIcon = 'tab.big';
		tabYPos = 10;
	}
	var element = {
		el_type: "tab",
		icon: tabIcon,
		Ypos: tabYPos
	};

	// Offset the TAB symbol position if specified in the tab description
	tabYPos += plugin.tabSymbolOffset;

	// For tablature like whistle tab where you want the TAB symbol hidden
	if (!plugin.hideTabSymbol) {

		var tabAbsolute = new AbsoluteElement(element, 0, 0, "symbol", 0);
		tabAbsolute.x = absX;
		var tabRelative = new RelativeElement(tabIcon, 0, 0, 7.5, "tab");
		tabRelative.x = relX;
		tabAbsolute.children.push(tabRelative);
		if (tabAbsolute.abcelem.el_type == 'tab') {
			tabRelative.pitch = tabYPos;
		}

	}
	return tabAbsolute;
}

function lyricsDim(abs) {
	if (abs.extra) {
		for (var ii = 0; ii < abs.extra.length; ii++) {
			var extra = abs.extra[ii];
			if (extra.type == 'lyric') {
				return {
					bottom: extra.bottom,
					height: extra.height
				};
			}
		}
	}
	return null;
}
function TabAbsoluteElements() {
	//console.log("RENDER TabAbsoluteElements constructor")
	this.accidentals = null;
}

function getInitialStaffSize(staffGroup) {
	var returned = 0;
	for (var ii = 0; ii < staffGroup.length; ii++) {
		if (!staffGroup[ii].tabNameInfos) returned++;
	}
	return returned;
}

function buildRelativeTabNote(plugin, relX, def, curNote, isGrace) {
	var strNote = curNote.num;
	if (curNote.note.quarter != null) {
		// add tab quarter => needs to string conversion then 
		strNote = strNote.toString();
		strNote += curNote.note.quarter;
	}
	var pitch = plugin.semantics.stringToPitch(curNote.str);
	def.notes.push({ num: strNote, str: curNote.str, pitch: curNote.note.emit() });
	var opt = {
		type: 'tabNumber'
	};
	var tabNoteRelative = new RelativeElement(
		strNote, 0, 0, pitch + 0.3, opt);
	tabNoteRelative.x = relX;
	tabNoteRelative.isGrace = isGrace;
	tabNoteRelative.isAltered = curNote.note.isAltered;
	return tabNoteRelative;
}

// Stems hang from just below the bottom string, so this is how far the staff must extend below it.
function getStemDepth(plugin) {
	if (!plugin || !plugin.params || !plugin.params.stems) return 0;
	return (plugin.linePitch || 3) * 3;
}

// Duration flags for the tab stem, keyed by the number of tails (3 = quaver).
var stemFlags = { 3: 'flags.d8th', 4: 'flags.d16th', 5: 'flags.d32nd', 6: 'flags.d64th' };

// Number of augmentation dots, from the ratio of the duration to its base (power of two) value.
function getDotCount(duration, durlog) {
	var ratio = duration / Math.pow(2, durlog);
	if (ratio >= 1.75) return 2;
	if (ratio >= 1.5) return 1;
	return 0;
}

// Stems start just below the lowest fret number in the column, as if that number were the notehead.
function getStemTop(plugin, abs) {
	var lowest = null;
	for (var i = 0; i < abs.children.length; i++) {
		var child = abs.children[i];
		if (child.type !== 'tabNumber' || child.isGrace || child.pitch === undefined) continue;
		if (lowest === null || child.pitch < lowest) lowest = child.pitch;
	}
	return lowest - (plugin.linePitch || 3) * 1.5;
}

// Number of beams a note needs: a quaver has one, a semiquaver two, and so on. Zero or less means no beam.
function getBeamCount(abs) {
	var durlog = Math.floor(Math.log(abs.abcelem.duration) / Math.LN2 + 1e-9);
	return Math.min(-durlog, 6) - 2;
}

function addStemLine(abs, top, bottom) {
	var stem = new RelativeElement(null, 0, 0, bottom, { type: 'stem', pitch2: top, linewidth: 0.6 });
	stem.x = abs.x;
	abs.addExtra(stem);
}

// Dots sit to the right of each (non-grace) tab number, on the number's line.
function addTabDots(abs, duration, durlog) {
	var dots = getDotCount(duration, durlog);
	for (var i = 0; i < abs.children.length && dots > 0; i++) {
		var child = abs.children[i];
		if (child.type !== 'tabNumber' || child.isGrace || child.pitch === undefined) continue;
		for (var d = 0; d < dots; d++) {
			var dot = new RelativeElement('dots.dot', 0, glyphs.getSymbolWidth('dots.dot'), child.pitch + 1.5, { type: 'symbol' });
			dot.x = child.x + 3 + d * 3;
			abs.addExtra(dot);
		}
	}
}

// Draws one beam line (a filled bar from x1 to x2) hung from the given stem.
function addBeamLine(abs, x1, x2, bottom, thickness) {
	var beam = new RelativeElement(null, 0, x2 - x1, bottom, { type: 'tabbeam', pitch2: bottom + thickness });
	beam.x = x1;
	abs.addExtra(beam);
}

// Beams the group of notes together, like quavers and semiquavers in standard notation.
// Every beam sits on the same line below the staff; each extra beam level is stacked up toward the numbers.
function addTabBeams(plugin, group, beamBase) {
	var thickness = 0.5;
	var step = 1;
	var stub = 6;
	var levels = group.map(getBeamCount);
	var maxLevel = Math.max.apply(null, levels);
	for (var lvl = 1; lvl <= maxLevel; lvl++) {
		var bottom = beamBase - thickness + (lvl - 1) * step;
		for (var a = 0; a < group.length; a++) {
			if (levels[a] < lvl) continue;
			var b = a;
			while (b + 1 < group.length && levels[b + 1] >= lvl) b++;
			var x1 = group[a].x;
			var x2 = group[b].x;
			if (a === b) {
				// A lone note at this beam level gets a short stub pointing toward its neighbour.
				x2 = x1 + (a + 1 < group.length ? stub : -stub);
			}
			addBeamLine(group[a], Math.min(x1, x2), Math.max(x1, x2), bottom, thickness);
			a = b;
		}
	}
}

// Adds the stems for one beam group (a single note is a group of one) and its beams, flags or dots.
function addTabStemGroup(plugin, group) {
	var stemLength = (plugin.linePitch || 3) * 1;
	var beamed = group.length > 1;
	var tops = group.map(function (abs) { return getStemTop(plugin, abs); });
	// A beamed group shares one beam line below its lowest stem; a single note hangs its own stem.
	var beamBase = Math.min.apply(null, tops) - stemLength;
	for (var i = 0; i < group.length; i++) {
		var abs = group[i];
		var duration = abs.abcelem.duration;
		var durlog = Math.floor(Math.log(duration) / Math.LN2 + 1e-9);
		addStemLine(abs, tops[i], beamed ? beamBase : tops[i] - stemLength);
		addTabDots(abs, duration, durlog);
	}
	if (beamed) {
		addTabBeams(plugin, group, beamBase);
	} else {
		var beamCount = getBeamCount(group[0]);
		if (beamCount >= 1) {
			var flagSymbol = stemFlags[beamCount + 2];
			var flag = new RelativeElement(flagSymbol, 0, glyphs.getSymbolWidth(flagSymbol), beamBase, { type: 'symbol' });
			flag.x = group[0].x;
			group[0].addExtra(flag);
		}
	}
}

function wantsTabStem(plugin, abs) {
	var duration = abs.abcelem && abs.abcelem.duration;
	return !!(plugin && plugin.params && plugin.params.stems && duration && duration < 1); // whole notes have no stem
}

// Adds stems to the notes of a tab voice. Notes that the ABC beams together (startBeam..endBeam) form one group.
function addTabStems(plugin, abss) {
	var i = 0;
	while (i < abss.length) {
		var end = i;
		if (abss[i].abcelem.startBeam) {
			while (end + 1 < abss.length && !abss[end].abcelem.endBeam) end++;
		}
		addTabStemGroup(plugin, abss.slice(i, end + 1));
		i = end + 1;
	}
}

function getXGrace(abs, index) {
	var found = 0;
	if (abs.extra) {
		for (var ii = 0; ii < abs.extra.length; ii++) {
			if (abs.extra[ii].c.indexOf('noteheads') >= 0) {
				if (found === index) {
					return abs.extra[ii].x + abs.extra[ii].w / 2;
				} else {
					found++;
				}
			}
		}
	}
	return -1;
}

function graceInRest(absElem) {
	if (absElem.abcelem) {
		var elem = absElem.abcelem;
		if (elem.rest) {
			return elem.gracenotes;
		}
	}
	return null;
}

function convertToNumber(plugin, pitches, graceNotes) {
	var tabPos = plugin.semantics.notesToNumber(pitches, graceNotes);
	if (tabPos.error) {
		plugin.setError(tabPos.error);
		return tabPos; // give up on error here
	}
	if (tabPos.graces && tabPos.notes) {
		// add graces to last note in notes
		var posNote = tabPos.notes.length - 1;
		tabPos.notes[posNote].graces = tabPos.graces;
	}
	return tabPos;
}

function buildGraceRelativesForRest(plugin, abs, absChild, graceNotes, tabVoice) {
	for (var mm = 0; mm < graceNotes.length; mm++) {
		var defGrace = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [], grace: true };
		var graceX = getXGrace(absChild, mm);
		var curGrace = graceNotes[mm];
		var tabGraceRelative = buildRelativeTabNote(plugin, graceX, defGrace, curGrace, true);
		abs.children.push(tabGraceRelative);
		tabVoice.push(defGrace);
	}
}

/**
 * Build tab absolutes by scanning current staff line absolute array
 * @param {*} staffAbsolute
 */
TabAbsoluteElements.prototype.build = function (plugin,
	staffAbsolute,
	tabVoice,
	voiceIndex,
	staffIndex,
	keySig,
	tabVoiceIndex) {
	//console.log("RENDER TabAbsoluteElements build")
	var staffSize = getInitialStaffSize(staffAbsolute);
	var source = staffAbsolute[staffIndex + voiceIndex];
	var dest = staffAbsolute[tabVoiceIndex];
	var tabPos = null;
	var defNote = null;
	var stemNotes = [];
	if (source.children[0].abcelem.el_type != 'clef') {
		// keysig missing => provide one for tabs
		if (keySig != 'none') {
			source.children.splice(0, 0, keySig);
		}
	}
	for (var ii = 0; ii < source.children.length; ii++) {
		var absChild = source.children[ii];
		var absX = absChild.x;
		var relX = absX;
		// if (absChild.children.length > 0) {
		//   relX = absChild.children[0].x;
		// }
		if ((absChild.isClef)) {
			dest.children.push(buildTabAbsolute(plugin, absX, relX));
			if (absChild.abcelem.type.indexOf('-8') >= 0) plugin.semantics.clefTranspose = -12
			if (absChild.abcelem.type.indexOf('+8') >= 0) plugin.semantics.clefTranspose = 12
		}
		switch (absChild.type) {
			case 'staff-extra key-signature':
				// refresh key accidentals
				this.accidentals = absChild.abcelem.accidentals;
				plugin.semantics.accidentals = this.accidentals;
				break;
			case 'bar':
				plugin.semantics.measureAccidentals = {}
				var lastBar = false;
				if (ii === source.children.length - 1) {
					// used for final line bar drawing
					// for multi tabs / multi staves
					lastBar = true;
				}
				var cloned = cloneAbsoluteAndRelatives(absChild, plugin);
				if (cloned.abcelem.barNumber) {
					delete cloned.abcelem.barNumber;
					for (var bn = 0; bn < cloned.children.length; bn++) {
						if (cloned.children[bn].type === "barNumber") {
							cloned.children.splice(bn, 1);
							break;
						}
					}
				}
				cloned.abcelem.lastBar = lastBar;
				dest.children.push(cloned);
				tabVoice.push({
					el_type: absChild.abcelem.el_type,
					type: absChild.abcelem.type,
					endChar: absChild.abcelem.endChar,
					startChar: absChild.abcelem.startChar,
					abselem: cloned
				});
				break;
			case 'rest':
				var restGraces = graceInRest(absChild);
				if (restGraces) {
					// to number conversion 
					tabPos = convertToNumber(plugin, null, restGraces);
					if (tabPos.error) return;
					// build relative for grace
					defGrace = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [], grace: true };
					buildGraceRelativesForRest(plugin, abs, absChild, tabPos.graces, tabVoice);
				}
				break;
			case 'note':
				var abs = cloneAbsolute(absChild);
				abs.x = absChild.heads[0].x + absChild.heads[0].w / 2; // center the number
				abs.lyricDim = lyricsDim(absChild);
				var pitches = absChild.abcelem.pitches;
				var graceNotes = absChild.abcelem.gracenotes;
				abs.type = 'tabNumber';
				// to number conversion 
				tabPos = convertToNumber(plugin, pitches, graceNotes);
				if (tabPos.error) return;
				if (tabPos.graces) {
					// add graces to last note in notes
					var posNote = tabPos.notes.length - 1;
					tabPos.notes[posNote].graces = tabPos.graces;
				}
				// build relative
				defNote = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [] };
				for (var ll = 0; ll < tabPos.notes.length; ll++) {
					var curNote = tabPos.notes[ll];
					if (curNote.graces) {
						for (var mm = 0; mm < curNote.graces.length; mm++) {
							var defGrace = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [], grace: true };
							var graceX = getXGrace(absChild, mm);
							var curGrace = curNote.graces[mm];
							var tabGraceRelative = buildRelativeTabNote(plugin, graceX, defGrace, curGrace, true);
							abs.children.push(tabGraceRelative);
							tabVoice.push(defGrace);
						}
					}
					var tabNoteRelative = buildRelativeTabNote(plugin, abs.x + absChild.heads[ll].dx, defNote, curNote, false);
					abs.children.push(tabNoteRelative);
				}
				if (defNote.notes.length > 0) {
					defNote.abselem = abs;
					tabVoice.push(defNote);
					dest.children.push(abs);
					if (wantsTabStem(plugin, abs)) stemNotes.push(abs);
				}
				break;
		}
	}
	addTabStems(plugin, stemNotes);
};

TabAbsoluteElements.getStemDepth = getStemDepth;

module.exports = TabAbsoluteElements;
