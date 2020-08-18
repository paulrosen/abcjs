//    abc_tune.js: a computer usable internal structure representing one tune.
//    Copyright (C) 2010-2020 Paul Rosen (paul at paulrosen dot net)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import parseCommon from '../parse/abc_common';
import spacing from '../write/abc_spacing';
import sequence from '../synth/abc_midi_sequencer';
import flatten from '../synth/abc_midi_flattener';

/**
 * This is the data for a single ABC tune. It is created and populated by the window.ABCJS.parse.Parse class.
 * Also known as the ABCJS Abstract Syntax Tree
 * @alternateClassName ABCJS.Tune
 */
var Tune = function() {
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
	//		accidentals[]: { acc:sharp|dblsharp|natural|flat|dblflat,  note:a|b|c|d|e|f|g }
	// METER: type: common_time,cut_time,specified
	//		if specified, { num: 99, den: 99 }

	this.getBeatLength = function() {
		// This returns a fraction: for instance 1/4 for a quarter
		// There are two types of meters: compound and regular. Compound meter has 3 beats counted as one.
		var meter = this.getMeterFraction();
		var multiplier = 1;
		if (meter.num === 6 || meter.num === 9 || meter.num === 12)
			multiplier = 3;

		return multiplier / meter.den;
	};

	function computePickupLength(lines, barLength) {
		var pickupLength = 0;
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].staff) {
				for (var j = 0; j < lines[i].staff.length; j++) {
					for (var v = 0; v < lines[i].staff[j].voices.length; v++) {
						var voice = lines[i].staff[j].voices[v];
						var tripletMultiplier = 1;
						for (var el = 0; el < voice.length; el++) {
							var isSpacer = voice[el].rest && voice[el].rest.type === "spacer";
							if (voice[el].startTriplet)
								tripletMultiplier = voice[el].tripletMultiplier;
							if (voice[el].duration && !isSpacer)
								pickupLength += voice[el].duration * tripletMultiplier;
							if (voice[el].endTriplet)
								tripletMultiplier = 1;
							if (pickupLength >= barLength)
								pickupLength -= barLength;
							if (voice[el].el_type === 'bar')
								return pickupLength;
						}
					}
				}
			}
		}

		return pickupLength;
	}
	this.getPickupLength = function() {
		var barLength = this.getBarLength();
		var pickupLength = computePickupLength(this.lines, barLength);

		// If computed pickup length is very close to 0 or the bar length, we assume
		// that we actually have a full bar and hence no pickup.
		return (pickupLength < 1e-8 || barLength-pickupLength < 1e-8) ? 0 : pickupLength;
	};

	this.getBarLength = function() {
		var meter = this.getMeterFraction();
		return meter.num / meter.den;
	};

	this.millisecondsPerMeasure = function(bpmOverride) {
		var bpm;
		if (bpmOverride) {
			bpm = bpmOverride;
		} else {
			var tempo = this.metaText ? this.metaText.tempo : null;
			bpm = this.getBpm(tempo);
		}
		if (bpm <= 0)
			bpm = 1; // I don't think this can happen, but we don't want a possibility of dividing by zero.

		var beatsPerMeasure = this.getBeatsPerMeasure();

		var minutesPerMeasure = beatsPerMeasure / bpm;
		return minutesPerMeasure * 60000;
	};

	this.getBeatsPerMeasure = function() {
		var beatLen = this.getBeatLength();
		var barLen = this.getBarLength();
		return barLen / beatLen;
	};

	this.getMeter = function() {
		for (var i = 0; i < this.lines.length; i++) {
			var line = this.lines[i];
			if (line.staff) {
				for (var j = 0; j < line.staff.length; j++) {
					var meter = line.staff[j].meter;
					if (meter) {
						return meter;
					}
				}
			}
		}
		return { type: "common_time" };
	};

	this.getMeterFraction = function() {
		var meter = this.getMeter();
		var num = 4;
		var den = 4;
		if (meter) {
			if (meter.type === 'specified') {
				num = parseInt(meter.value[0].num, 10);
				den = parseInt(meter.value[0].den,10);
			} else if (meter.type === 'cut_time') {
				num = 2;
				den = 2;
			} else if (meter.type === 'common_time') {
				num = 4;
				den = 4;
			}
		}
		this.meter = { num: num, den: den };
		return this.meter; // TODO-PER: is this saved value used anywhere? A get function shouldn't change state.
	};

	this.getKeySignature = function() {
		for (var i = 0; i < this.lines.length; i++) {
			var line = this.lines[i];
			if (line.staff) {
				for (var j = 0; j < line.staff.length; j++) {
					if (line.staff[j].key)
						return line.staff[j].key;
				}
			}
		}
		return {  };
	};

	function addVerticalInfo(timingEvents) {
		// Add vertical info to the bar events: put the next event's top, and the event after the next measure's top.
		var lastBarTop;
		var lastBarBottom;
		var lastEventTop;
		var lastEventBottom;
		for (var e = timingEvents.length - 1; e >= 0; e--) {
			var ev = timingEvents[e];
			if (ev.type === 'bar') {
				ev.top = lastEventTop;
				ev.nextTop = lastBarTop;
				lastBarTop = lastEventTop;

				ev.bottom = lastEventBottom;
				ev.nextBottom = lastBarBottom;
				lastBarBottom = lastEventBottom;
			} else if (ev.type === 'event') {
				lastEventTop = ev.top;
				lastEventBottom = ev.top + ev.height;
			}
		}
	}

	function makeSortedArray(hash) {
		var arr = [];
		for (var k in hash) {
			if (hash.hasOwnProperty(k))
				arr.push(hash[k]);
		}
		arr = arr.sort(function (a, b) {
			var diff = a.milliseconds - b.milliseconds;
			// if the events have the same time, make sure a bar comes before a note
			if (diff !== 0) {
				return diff;
			}
			else {
				return a.type === "bar" ? -1 : 1;
			}
		});
		return arr;
	}

	this.addElementToEvents = function(eventHash, element, voiceTimeMilliseconds, top, height, line, measureNumber, timeDivider, isTiedState, nextIsBar) {
		if (element.hint)
			return { isTiedState: undefined, duration: 0 };
		var realDuration = element.durationClass ? element.durationClass : element.duration;
		if (element.abcelem.rest && element.abcelem.rest.type === "spacer")
			realDuration = 0;
		if (realDuration > 0) {
			var es = [];
			// If there is an invisible rest, then there are not elements, so don't push a null one.
			for (var i = 0; i < element.elemset.length; i++) {
				if (element.elemset[i] !== null)
					es.push(element.elemset[i]);
			}
			var isTiedToNext = element.startTie;
			if (isTiedState !== undefined) {
				eventHash["event" + isTiedState].elements.push(es); // Add the tied note to the first note that it is tied to
				if (nextIsBar) {
					if (!eventHash["event" + voiceTimeMilliseconds]) {
						eventHash["event" + voiceTimeMilliseconds] = {
							type: "event",
							milliseconds: voiceTimeMilliseconds,
							line: line,
							measureNumber: measureNumber,
							top: top,
							height: height,
							left: null,
							width: 0,
							elements: [],
							startChar: null,
							endChar: null,
							startCharArray: [],
							endCharArray: []
						};
					}
					eventHash["event" + voiceTimeMilliseconds].measureStart = true;
					nextIsBar = false;
				}
				if (!isTiedToNext)
					isTiedState = undefined;
			} else {
				// the last note wasn't tied.
				if (!eventHash["event" + voiceTimeMilliseconds]) {
					eventHash["event" + voiceTimeMilliseconds] = {
						type: "event",
						milliseconds: voiceTimeMilliseconds,
						line: line,
						measureNumber: measureNumber,
						top: top,
						height: height,
						left: element.x,
						width: element.w,
						elements: [es],
						startChar: element.abcelem.startChar,
						endChar: element.abcelem.endChar,
						startCharArray: [element.abcelem.startChar],
						endCharArray: [element.abcelem.endChar],
						midiPitches: element.abcelem.midiPitches ? parseCommon.cloneArray(element.abcelem.midiPitches) : []
					};
					if (element.abcelem.midiGraceNotePitches)
						eventHash["event" + voiceTimeMilliseconds].midiGraceNotePitches = parseCommon.cloneArray(element.abcelem.midiGraceNotePitches);
				} else {
					// If there is more than one voice then two notes can fall at the same time. Usually they would be lined up in the same place, but if it is a whole rest, then it is placed funny. In any case, the left most element wins.
					if (eventHash["event" + voiceTimeMilliseconds].left)
						eventHash["event" + voiceTimeMilliseconds].left = Math.min(eventHash["event" + voiceTimeMilliseconds].left, element.x);
					else
						eventHash["event" + voiceTimeMilliseconds].left = element.x;
					eventHash["event" + voiceTimeMilliseconds].elements.push(es);
					eventHash["event" + voiceTimeMilliseconds].startCharArray.push(element.abcelem.startChar);
					eventHash["event" + voiceTimeMilliseconds].endCharArray.push(element.abcelem.endChar);
					if (eventHash["event" + voiceTimeMilliseconds].startChar === null)
						eventHash["event" + voiceTimeMilliseconds].startChar =element.abcelem.startChar;
					if (eventHash["event" + voiceTimeMilliseconds].endChar === null)
						eventHash["event" + voiceTimeMilliseconds].endChar =element.abcelem.endChar;
					if (element.abcelem.midiPitches && element.abcelem.midiPitches.length) {
						if (!eventHash["event" + voiceTimeMilliseconds].midiPitches)
							eventHash["event" + voiceTimeMilliseconds].midiPitches = [];
						for (var i = 0; i < element.abcelem.midiPitches.length; i++)
							eventHash["event" + voiceTimeMilliseconds].midiPitches.push(element.abcelem.midiPitches[i]);
					}
					if (element.abcelem.midiGraceNotePitches && element.abcelem.midiGraceNotePitches.length) {
						if (!eventHash["event" + voiceTimeMilliseconds].midiGraceNotePitches)
							eventHash["event" + voiceTimeMilliseconds].midiGraceNotePitches = [];
						for (var j = 0; j < element.abcelem.midiGraceNotePitches.length; j++)
							eventHash["event" + voiceTimeMilliseconds].midiGraceNotePitches.push(element.abcelem.midiGraceNotePitches[j]);
					}
				}
				if (nextIsBar) {
					eventHash["event" + voiceTimeMilliseconds].measureStart = true;
					nextIsBar = false;
				}
				if (isTiedToNext)
					isTiedState = voiceTimeMilliseconds;
			}
		}
		return { isTiedState: isTiedState, duration: realDuration / timeDivider, nextIsBar: nextIsBar || element.type === 'bar' };
	};

	this.makeVoicesArray = function() {
		// First make a new array that is arranged by voice so that the repeats that span different lines are handled correctly.
		var voicesArr = [];
		for (var line = 0; line < this.engraver.staffgroups.length; line++) {
			var group = this.engraver.staffgroups[line];
			var firstStaff = group.staffs[0];
			var middleC = firstStaff.absoluteY;
			var top = middleC - firstStaff.top * spacing.STEP;
			var lastStaff = group.staffs[group.staffs.length - 1];
			middleC = lastStaff.absoluteY;
			var bottom = middleC - lastStaff.bottom * spacing.STEP;
			var height = bottom - top;

			var voices = group.voices;
			for (var v = 0; v < voices.length; v++) {
				var measureNumber = 0;
				var noteFound = false;
				if (!voicesArr[v])
					voicesArr[v] = [];
				var elements = voices[v].children;
				for (var elem = 0; elem < elements.length; elem++) {
					voicesArr[v].push({top: top, height: height, line: line, measureNumber: measureNumber, elem: elements[elem]});
					if (elements[elem].type === 'bar' && noteFound) // Count the measures by counting the bar lines, but skip a bar line that appears at the left of the music, before any notes.
						measureNumber++;
					if (elements[elem].type === 'note' || elements[elem].type === 'rest')
						noteFound = true;
				}
			}
		}
		return voicesArr;
	};

	this.setupEvents = function(startingDelay, timeDivider, bpm) {
		var timingEvents = [];

		var eventHash = {};
		// The time is the number of seconds from the beginning of the piece.
		// The units we are scanning are in notation units (i.e. 0.25 is a quarter note)
		var time = startingDelay;
		var isTiedState;
		var nextIsBar = true;
		var voices = this.makeVoicesArray();
		for (var v = 0; v < voices.length; v++) {
			var voiceTime = time;
			var voiceTimeMilliseconds = Math.round(voiceTime * 1000);
			var startingRepeatElem = 0;
			var endingRepeatElem = -1;
			var elements = voices[v];
			for (var elem = 0; elem < elements.length; elem++) {
				var element = elements[elem].elem;
				if (!bpm && element.abcelem.el_type === "tempo") {
					bpm = this.getBpm(element.abcelem);
					var beatLength = this.getBeatLength();
					var beatsPerSecond = bpm / 60;
					timeDivider = beatLength * beatsPerSecond;
				}
				var ret = this.addElementToEvents(eventHash, element, voiceTimeMilliseconds, elements[elem].top, elements[elem].height, elements[elem].line, elements[elem].measureNumber, timeDivider, isTiedState, nextIsBar);
				isTiedState = ret.isTiedState;
				nextIsBar = ret.nextIsBar;
				voiceTime += ret.duration;
				voiceTimeMilliseconds = Math.round(voiceTime * 1000);
				if (element.type === 'bar') {
					var barType = element.abcelem.type;
					var endRepeat = (barType === "bar_right_repeat" || barType === "bar_dbl_repeat");
					var startEnding = (element.abcelem.startEnding === '1');
					var startRepeat = (barType === "bar_left_repeat" || barType === "bar_dbl_repeat" || barType === "bar_right_repeat");
					if (endRepeat) {
						if (endingRepeatElem === -1)
							endingRepeatElem = elem;
						for (var el2 = startingRepeatElem; el2 < endingRepeatElem; el2++) {
							var element2 = elements[el2].elem;
							ret = this.addElementToEvents(eventHash, element2, voiceTimeMilliseconds, elements[el2].top, elements[el2].height, elements[el2].line, elements[el2].measureNumber, timeDivider, isTiedState, nextIsBar);
							isTiedState = ret.isTiedState;
							nextIsBar = ret.nextIsBar;
							voiceTime += ret.duration;
							voiceTimeMilliseconds = Math.round(voiceTime * 1000);
						}
						nextIsBar = true;
						endingRepeatElem = -1;
					}
					if (startEnding)
						endingRepeatElem = elem;
					if (startRepeat)
						startingRepeatElem = elem;
				}
			}
		}
		// now we have all the events, but if there are multiple voices then there may be events out of order or duplicated, so normalize it.
		timingEvents = makeSortedArray(eventHash);
		addVerticalInfo(timingEvents);
		timingEvents.push({ type: "end", milliseconds: voiceTimeMilliseconds });
		this.addUsefulCallbackInfo(timingEvents, bpm);
		return timingEvents;
	};

	this.addUsefulCallbackInfo = function(timingEvents, bpm) {
		var millisecondsPerMeasure = this.millisecondsPerMeasure(bpm);
		for (var i = 0; i < timingEvents.length; i++) {
			var ev = timingEvents[i];
			ev.millisecondsPerMeasure = millisecondsPerMeasure;
		}
	};

	// function getVertical(group) {
	// 	var voices = group.voices;
	// 	var firstStaff = group.staffs[0];
	// 	var middleC = firstStaff.absoluteY;
	// 	var top = middleC - firstStaff.top*spacing.STEP;
	// 	var lastStaff = group.staffs[group.staffs.length-1];
	// 	middleC = lastStaff.absoluteY;
	// 	var bottom = middleC - lastStaff.bottom*spacing.STEP;
	// 	var height = bottom - top;
	// 	return { top: top, height: height };
	// }

	this.getBpm = function(tempo) {
		var bpm;
		if (tempo) {
			bpm = tempo.bpm;
			var beatLength = this.getBeatLength();
			var statedBeatLength = tempo.duration && tempo.duration.length > 0 ? tempo.duration[0] : beatLength;
			bpm = bpm * statedBeatLength / beatLength;
		}
		if (!bpm) {
			bpm = 180;
			// Compensate for compound meter, where the beat isn't a beat.
			var meter = this.getMeterFraction();
			if (meter && meter.num !== 3 && (meter.num % 3 === 0)) {
				bpm = 120;
			}
		}
		return bpm;
	};

	this.setTiming = function (bpm, measuresOfDelay) {
		if (!this.engraver || !this.engraver.staffgroups) {
			console.log("setTiming cannot be called before the tune is drawn.");
			this.noteTimings = [];
			return;
		}

		if (!bpm) {
			var tempo = this.metaText ? this.metaText.tempo : null;
			bpm = this.getBpm(tempo);
		}
		// Calculate the basic midi data. We only care about the qpm variable here.
		//this.setUpAudio({qpm: bpm});

		var beatLength = this.getBeatLength();
		var beatsPerSecond = bpm / 60;

		var measureLength = this.getBarLength();

		var startingDelay = measureLength / beatLength * measuresOfDelay / beatsPerSecond;
		if (startingDelay)
			startingDelay -= this.getPickupLength() / beatLength / beatsPerSecond;
		var timeDivider = beatLength * beatsPerSecond;

		this.noteTimings = this.setupEvents(startingDelay, timeDivider, bpm);
	};

	this.setUpAudio = function(options) {
		if (!options) options = {};
		var seq = sequence(this, options);
		return flatten(seq, options);
	};
};

export default Tune;
