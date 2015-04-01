//    abc_animation.js: handles animating the music in real time.
//    Copyright (C) 2014 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global ABCJS, console */


if (!window.ABCJS)
	window.ABCJS = {};

(function() {

    function notes2Midi() {
        var noteAdders = [2, 2, 1, 2, 2, 2, 1]
        var notes = {}
        var noteNr = -7
        var midi = 24

        for (octave = 1; octave < 5; octave++) {
            for (n = 0; n < 7; n++) {
                notes[noteNr] = midi
                noteNr = noteNr + 1
                midi = midi + noteAdders[n]
            }
        }
        return notes
    }

	function hasClass(element, cls) {
		var elClass = element.getAttribute("class");
		var rclass = /[\t\r\n\f]/g;
		var className = " " + cls + " ";
		return (element.nodeType === 1 && (" " + elClass + " ").replace(rclass, " ").indexOf(className) >= 0);
	}

	function getAllElementsByClasses(startingEl, class1, class2) {
		var els = startingEl.getElementsByClassName(class1);
		var ret = [];
		for (var i = 0; i < els.length; i++) {
			if (hasClass(els[i], class2))
				ret.push(els[i]);
		}
		return ret;
	}

	function getBeatsPerMinute(tune, options) {
		// We either want to run the timer once per measure or once per beat. If we run it once per beat we need a multiplier for the measures.
		// So, first we figure out the beats per minute and the beats per measure, then depending on the type of animation, we can
		// calculate the desired interval (ret.tick) and the number of ticks before we want to run the measure
		var bpm;
		if (options.bpm)
			bpm = options.bpm;
		else {
			if (tune && tune.metaText && tune.metaText.tempo && tune.metaText.tempo.bpm)
				bpm = tune.metaText.tempo.bpm;
			else
				bpm = 120; // Just set it to something. The user should have set this.
		}
		return bpm;
	}

	// This is a way to manipulate the written music on a timer. Their are two ways to manipulate the music: turn off each measure as it goes by,
	// and put a vertical cursor before the next note to play. The timer works at the speed of the original tempo of the music unless it is overwritten
	// in the options parameter.
	//
	// parameters:
	// paper: the output div that the music is in.
	// tune: the tune object returned by renderAbc.
	// options: a hash containing the following:
	//    showCursor: true or false [ false is the default ]
	//    bpm: number of beats per minute [ the default is whatever is in the Q: field ]
	var stopNextTime = false;
	var cursor;
	ABCJS.startAnimation = function(paper, tune, options) {

        var notes2midiMap = notes2Midi();

		if (paper.getElementsByClassName === undefined) {
			console.error("ABCJS.startAnimation: The first parameter must be a regular DOM element. (Did you pass a jQuery object or an ID?)");
			return;
		}
		if (tune.getBeatLength === undefined) {
			console.error("ABCJS.startAnimation: The second parameter must be a single tune. (Did you pass the entire array of tunes?)");
			return;
		}
		if (options.showCursor) {
			cursor = $('<div class="cursor" style="position: absolute;"></div>');
			$(paper).append(cursor);
		}

		stopNextTime = false;
		var beatsPerMinute = getBeatsPerMinute(tune, options);
		var beatsPerMillisecond = beatsPerMinute / 60000;
		var beatLength = tune.getBeatLength(); // This is the same units as the duration is stored in.

		var startTime;

		function makeSortedArray(hash) {
			var arr = [];
			for (var k in hash) {
				if (hash.hasOwnProperty(k) && hash[k].type == 'event')
					arr.push(hash[k]);
			}
			arr = arr.sort(function(a,b) {
				var diff = a.time - b.time;
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

		var timingEvents = [];
		function setupEvents(engraver) {
            tuneSharps = []
            tuneFlats = []
			var eventHash = {};
			// The time is the number of measures from the beginning of the piece.
			var time = 0;
			var isTiedState = false;
			for (var line=0;line<engraver.staffgroups.length; line++) {

				var group = engraver.staffgroups[line];
				var voices = group.voices;
				var top = group.y;
				var height = group.height;
				var maxVoiceTime = 0;
                measureSharps = []; measureFlats = []
				// Put in the notes for all voices, then sort them, then remove duplicates
				for (var v = 0; v < voices.length; v++) {
					var voiceTime = time;
					var elements = voices[v].children;
					for (var elem=0; elem<elements.length; elem++) {
						var element = elements[elem];
						if (element.duration > 0) {
							// There are 3 possibilities here: the note could stand on its own, the note could be tied to the next,
							// the note could be tied to the previous, and the note could be tied on both sides.
							var isTiedToNext = element.startTie;
							if (isTiedState) {
								if (!isTiedToNext)
									isTiedState = false;
								// If the note is tied on both sides it can just be ignored.
							} else {
								// the last note wasn't tied.
                                note = element.abcelem.averagepitch
                                if(element.abcelem.pitches){
                                    var vol = 123
                                    if (accidental = element.abcelem.pitches[0].accidental) {
                                        switch (accidental) {
                                            case "sharp":
                                                measureSharps.push(note);
                                            case "flat":
                                                measureFlats.push(note);
                                        }
                                    }
                                }else{
                                   var vol = 0
                                }

                                eventParams = { type: "event", time: voiceTime, top: top, height: height, left: element.x, width: element.w, note: note, vol: vol }

                                if(measureSharps.indexOf(note)!=-1){
                                    eventParams["accidental"] = 'sharp'
                                }else{
                                    if(measureFlats.indexOf(note)!=-1){
                                      eventParams["accidental"] = 'flat'
                                    }
                                }

								eventHash["event"+voiceTime] = eventParams;
								if (isTiedToNext)
									isTiedState = true;
							}
							voiceTime += element.duration;
						}
						if (element.type === 'bar') {
                            measureSharps = []; measureFlats = [] //when we pass a bar we reset sharps and flats for the previous meassure
							if (timingEvents.length === 0 || timingEvents[timingEvents.length-1] !== 'bar') {
								if (element.elemset && element.elemset.length > 0 && element.elemset[0].attrs) {
									var klass = element.elemset[0].attrs['class'];
									var arr = klass.split(' ');
									var lineNum;
									var measureNum;
									for (var i = 0; i < arr.length; i++) {
										var match = /m(\d+)/.exec(arr[i]);
										if (match)
											measureNum = match[1];
										match = /l(\d+)/.exec(arr[i]);
										if (match)
											lineNum = match[1];
									}
									eventHash["bar"+voiceTime] = { type: "bar", time: voiceTime, lineNum: lineNum, measureNum: measureNum };
								}
							}
						}


                        if (element.type === 'staff-extra') {
                            var children = element.children;
                            for (var c=0; c<children.length; c++) {
                                var child = children[c];
                                switch(child.c) {
                                    case "accidentals.flat":
                                        tuneFlats = tuneFlats.concat([child.pitch, child.pitch-7, child.pitch-14, child.pitch+7, child.pitch+14])
                                        break;
                                    case "accidentals.sharp":
                                        tuneSharps = tuneSharps.concat([child.pitch, child.pitch-7, child.pitch-14, child.pitch+7, child.pitch+14])
                                        break;
                                    default:
                                                                      }
                            }

                        }

					}
					maxVoiceTime = Math.max(maxVoiceTime, voiceTime);
				}
				time = maxVoiceTime;
			}
			// now we have all the events, but if there are multiple voices then there may be events out of order or duplicated, so normalize it.
			timingEvents = makeSortedArray(eventHash);
		}
		setupEvents(tune.engraver);

		function processShowCursor() {
			var currentNote = timingEvents.shift();
			if (!currentNote) {
				stopNextTime = true;
				return 0;
			}
			if (options.showCursor)
                midiNote = notes2midiMap[currentNote.note]
                if(currentNote.accidental == "sharp"){
                    midiNote += 1
                    console.log(midiNote + "sharp")
                }else{
                    if(currentNote.accidental == "flat"){
                        midiNote -= 1
                    }
                }
                if(tuneSharps.indexOf(currentNote.note)!=-1){
                    midiNote += 1
                }else{
                    if(tuneFlats.indexOf(currentNote.note)!=-1) {
                        midiNote -= 1
                    }
                }
                playnote(midiNote, currentNote.vol)
				cursor.css({ left: currentNote.left + "px", top: currentNote.top + "px", height: currentNote.height + "px" });
			if (timingEvents.length > 0)
				return timingEvents[0].time / beatLength;
			stopNextTime = true;
			return 0;
		}

		function processNext() {
			if (stopNextTime) {
				ABCJS.stopAnimation();
				return;
			}
			var nextTimeInBeats = processShowCursor();
			var nextTimeInMilliseconds = nextTimeInBeats / beatsPerMillisecond;
			var currentTime = new Date();
			currentTime = currentTime.getTime();
			var interval = startTime + nextTimeInMilliseconds - currentTime;
    		setTimeout(processNext, interval);
		}
		startTime = new Date();
		startTime = startTime.getTime();
		processNext();
	};

	ABCJS.stopAnimation = function() {
		stopNextTime = true;
		if (cursor) {
			cursor.remove();
			cursor = null;
		}
	};
})();
