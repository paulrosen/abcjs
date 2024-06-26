//
// The algorithm for chords is:
// - The chords are done in a separate track.
// - If there are notes before the first chord, then put that much silence to start the track.
// - The pattern of chord expression depends on the meter, and how many chords are in a measure.
// - There is a possibility that a measure will have an incorrect number of beats, if that is the case, then
// start the pattern anew on the next measure number.
// - If a chord root is not A-G, then ignore it as if the chord wasn't there at all.
// - If a chord modification isn't in our supported list, change it to a major triad.
//
// - There is a standard pattern of boom-chick for each time sig, or it can be overridden.
// - For any unrecognized meter, play the full chord on each beat.
//
//	- If there is a chord specified that is not on a beat, move it earlier to the previous beat, unless there is already a chord on that beat.
//	- Otherwise, move it later, unless there is already a chord on that beat.
// 	- Otherwise, ignore it. (TODO-PER: expand this as more support is added.)
//
// If there is any note in the melody that has a rhythm head, then assume the melody controls the rhythm, so there is no chord added for that entire measure.

var parseCommon = require("../parse/abc_common");

var ChordTrack = function ChordTrack(numVoices, chordsOff, midiOptions, meter) {
  
  //console.log("ChordTrack top");
  
  this.chordTrack = [];
  this.chordTrackFinished = false;
  this.chordChannel = numVoices; // first free channel for chords
  this.currentChords = [];
  this.lastChord;
  this.chordLastBar;
  this.chordsOff = !!chordsOff;
  this.gChordTacet = this.chordsOff;
  this.hasRhythmHead = false;
  this.transpose = 0;
  this.lastBarTime = 0;
  this.meter = meter;
  this.tempoChangeFactor = 1;

  // MAE - In my version, there is support for shifting the bass and chord sounds up or down by a specified number of octave, but it's done via a library global

  // I've included handling the values here in the ChordTrack object, but the values need to be added by the MIDI parser and event generator and consumed by the paramChange() method

  // MAE For octave shifted bass and chords
  this.bassOctaveShift = midiOptions.bassOctaveShift && midiOptions.bassOctaveShift.length === 1 ? midiOptions.bassOctaveShift[0] : 0;

  this.chordOctaveShift = midiOptions.chordOctaveShift && midiOptions.chordOctaveShift.length === 1 ? midiOptions.chordOctaveShift[0] : 0;

  // MAE 17 Jun 2024 - To allow for bass and chord instrument octave shifts
  this.bassInstrument = midiOptions.bassprog && ((midiOptions.bassprog.length === 1) || (midiOptions.bassprog.length === 2)) ? midiOptions.bassprog[0] : 0;
  this.chordInstrument = midiOptions.chordprog && ((midiOptions.chordprog.length === 1) || (midiOptions.chordprog.length === 2)) ? midiOptions.chordprog[0] : 0;
  
  this.boomVolume = midiOptions.bassvol && midiOptions.bassvol.length === 1 ? midiOptions.bassvol[0] : 64;
  this.chickVolume = midiOptions.chordvol && midiOptions.chordvol.length === 1 ? midiOptions.chordvol[0] : 48;

  // Pass in an optional value for scaling the gchord string
  // Zero means to derive the divider by the gchord pattern length
  this.gchordDivider = midiOptions.gchord && (midiOptions.gchord.length === 2) ? midiOptions.gchord[1] : 0;

  // MAE 23 Jun 2024 - Added gchordbars
  this.gchordbars = midiOptions.gchordbars && midiOptions.gchordbars.length === 1 ? midiOptions.gchordbars[0] : 1;

  if (this.gchordbars < 1){
    this.gchordbars = 1;
  }

  // Track measure progress through the gchord
  this.currentgchordbars = 0;
  
  //console.log("ChordTrack gchordbars: "+this.gchordbars);

  if (this.gchordDivider != 0){
    // Restrict gchord divider to 1, 2, or 4
    if ((this.gchordDivider != 1) && (this.gchordDivider != 2) && (this.gchordDivider != 4)) {
      //console.log("ChordTrack - bad divider: "+this.gchordDivider);
      this.gchordDivider = 0;
    }
    else{
      //console.log("ChordTrack - force divider: "+this.gchordDivider);
    }
    
    //console.log("ChordTrack - final divider: "+this.gchordDivider);
  }

  var defaultDurationScale = undefined;

  // This allows for an initial %%MIDI gchord with no string
  if (midiOptions.gchord && (midiOptions.gchord.length>0)){

    this.overridePattern = midiOptions.gchord ? parseGChord(midiOptions.gchord[0]) : undefined;

    defaultDurationScale = midiOptions.gchord ? generateDefaultDurationScale(midiOptions.gchord[0]) : undefined;

  }
  else{
    this.overridePattern = undefined;
    this.gchordDivider = 0;
  }

  // MAE Added 20 June 2024
  // Is there a gchord stress model?
  this.gchordstress = (midiOptions.gchordstress && (midiOptions.gchordstress.length === 1))? midiOptions.gchordstress[0] : undefined;
  
  // Is there a gchord duration scale?
  this.gchorddurationscale = (midiOptions.gchorddurationscale && (midiOptions.gchorddurationscale.length === 1))? midiOptions.gchorddurationscale[0] : defaultDurationScale;

};
ChordTrack.prototype.setMeter = function (meter) {
  //console.log("setMeter: "+meter.num+ " "+meter.den);
  this.meter = meter;
};
ChordTrack.prototype.setTempoChangeFactor = function (tempoChangeFactor) {
  this.tempoChangeFactor = tempoChangeFactor;
};
ChordTrack.prototype.setLastBarTime = function (lastBarTime) {
  this.lastBarTime = lastBarTime;
};
ChordTrack.prototype.setTranspose = function (transpose) {
  this.transpose = transpose;
};
ChordTrack.prototype.setRhythmHead = function (isRhythmHead, elem) {
  this.hasRhythmHead = isRhythmHead;
  var ePitches = [];
  if (isRhythmHead) {
    if (this.lastChord && this.lastChord.chick) {
      for (var i2 = 0; i2 < this.lastChord.chick.length; i2++) {
        var note2 = parseCommon.clone(elem.pitches[0]);
        note2.actualPitch = this.lastChord.chick[i2];
        ePitches.push(note2);
      }
    }
  }
  return ePitches;
};
ChordTrack.prototype.barEnd = function (element) {
  if (this.chordTrack.length > 0 && !this.chordTrackFinished) {
    this.resolveChords(this.lastBarTime, timeToRealTime(element.time));
    this.currentChords = [];
  }
  this.chordLastBar = this.lastChord;
};
ChordTrack.prototype.gChordOn = function (element) {
  if (!this.chordsOff) this.gChordTacet = element.tacet;
};
ChordTrack.prototype.paramChange = function (element) {
  switch (element.el_type) {
    case "gchord":
      // Skips gchord elements that don't have pattern strings
      if (element.param && element.param.length>0){

        //console.log("gchord "+element.param);

        this.overridePattern = parseGChord(element.param);

        this.gchordDivider = 0;

        // Is there also a pattern divider?
        if (element.gchordDivider){

          this.gchordDivider = element.gchordDivider;
          
          if ((this.gchordDivider != 1) && (this.gchordDivider != 2) && (this.gchordDivider != 4)) {
          
            //console.log("paramChange - bad divider: "+this.gchordDivider);
          
            this.gchordDivider = 0;
          
          }
          //console.log("paramChange - force divider: "+this.gchordDivider);

        }
        
        //console.log("paramChange - final divider: "+this.gchordDivider);

        // Generate a default duration scale based on the pattern
        this.gchorddurationscale = generateDefaultDurationScale(element.param);

      }
      break;
    // MAE 23 Jun 2024 - Added gchordbars
    case "gchordbars":
      //console.log("ChordTrack gchordbars: "+element.value);
      this.gchordbars = element.value;
      
      if (this.gchordbars < 1){
        this.gchordbars = 1; 
      }

      // Reset measure offset 
      this.currentgchordbars = 0;

      // Trigger recalc of slot divider
      this.gchordDivider = 0;

      break;
    case "gchordstress":
      this.gchordstress = element.param;
      break;
    case "gchorddurationscale":
      this.gchorddurationscale = element.param;
      break;
    case "bassprog":
      this.bassInstrument = element.param;
      if ((element.octaveShift != undefined) && (element.octaveShift != null)){
        this.bassOctaveShift = element.octaveShift;
      }  
      break;
    case "chordprog":
      this.chordInstrument = element.param;
      if ((element.octaveShift != undefined) && (element.octaveShift != null)){
        this.chordOctaveShift = element.octaveShift;
      }  

      break;
    case "bassvol":
      this.boomVolume = element.param;
      break;
    case "chordvol":
      this.chickVolume = element.param;
      break;
    default:
      console.log("unhandled midi param", element);
  }
};
ChordTrack.prototype.finish = function () {
  if (!this.chordTrackEmpty())
    // Don't do chords on more than one track, so turn off chord detection after we create it.
    this.chordTrackFinished = true;
};
ChordTrack.prototype.addTrack = function (tracks) {
  if (!this.chordTrackEmpty()) tracks.push(this.chordTrack);
};
ChordTrack.prototype.findChord = function (elem) {
  if (this.gChordTacet) return 'break';

  // TODO-PER: Just using the first chord if there are more than one.
  if (this.chordTrackFinished || !elem.chord || elem.chord.length === 0) return null;

  // Return the first annotation that is a regular chord: that is, it is in the default place or is a recognized "tacet" phrase.
  for (var i = 0; i < elem.chord.length; i++) {
    var ch = elem.chord[i];
    if (ch.position === 'default') return ch.name;
    if (this.breakSynonyms.indexOf(ch.name.toLowerCase()) >= 0) return 'break';
  }
  return null;
};
ChordTrack.prototype.interpretChord = function (name) {
  // chords have the format:
  // [root][acc][modifier][/][bass][acc]
  // (The chord might be surrounded by parens. Just ignore them.)
  // root must be present and must be from A-G.
  // acc is optional and can be # or b
  // The modifier can be a wide variety of things, like "maj7". As they are discovered, more are supported here.
  // If there is a slash, then there is a bass note, which can be from A-G, with an optional acc.
  // If the root is unrecognized, then "undefined" is returned and there is no chord.
  // If the modifier is unrecognized, a major triad is returned.
  // If the bass notes is unrecognized, it is ignored.
  if (name.length === 0) return undefined;
  if (name === 'break') return {
    chick: []
  };

  // MAE 23 May 2024 - Experimenting with chord inversions
  var chordInfo = this.processInversion(name);

  name = chordInfo.name;
  var inversion = chordInfo.inversion;

  //console.log("chord name: "+name+" inversion: "+inversion);

  var root = name.substring(0, 1);
  if (root === '(') {
    name = name.substring(1, name.length - 2);
    if (name.length === 0) return undefined;
    root = name.substring(0, 1);
  }
  var bass = this.basses[root];
  if (!bass)
    // If the bass note isn't listed, then this was an unknown root. Only A-G are accepted.
    return undefined;
  // Don't transpose the chords more than an octave.
  var chordTranspose = this.transpose;
  while (chordTranspose < -8) {
    chordTranspose += 12;
  }
  while (chordTranspose > 8) {
    chordTranspose -= 12;
  }
  bass += chordTranspose;

  // MAE 17 Jun 2024 - Supporting octave shifted bass and chords
  var unshiftedBass = bass;

  bass += this.bassOctaveShift*12;

  var bass2 = bass - 5; // The alternating bass is a 4th below
  var chick;
  // if (name.length === 1){
  //   console.log("simple case");
  //   chick = this.chordNotes(unshiftedBass, '', inversion).notes;
  // }
  var remaining = name.substring(1);
  var acc = remaining.substring(0, 1);
  if (acc === 'b' || acc === '♭') {
    unshiftedBass--;
    bass--;
    bass2--;
    remaining = remaining.substring(1);
  } else if (acc === '#' || acc === '♯') {
    unshiftedBass++;
    bass++;
    bass2++;
    remaining = remaining.substring(1);
  }
  var arr = remaining.split('/');

  // MAE 22 May 2024 - For octave shifted chords
  var invertedInfo = this.chordNotes(unshiftedBass, arr[0], inversion);

  chick = invertedInfo.notes;
  var invertedNotes = invertedInfo.invertedNotes;

  // If the 5th is altered then the bass is altered. Normally the bass is 7 from the root, so adjust if it isn't.
  if (chick.length >= 3) {
    var fifth = chick[2] - chick[0];
    bass2 = bass2 + fifth - 7;
  }
  if (arr.length === 2) {
    var explicitBass = this.basses[arr[1].substring(0, 1)];
    if (explicitBass) {
      var bassAcc = arr[1].substring(1);
      var bassShift = {
        '#': 1,
        '♯': 1,
        'b': -1,
        '♭': -1
      }[bassAcc] || 0;
      bass = this.basses[arr[1].substring(0, 1)] + bassShift + chordTranspose;

      // MAE 22 May 2024 - Supporting octave shifted bass and chords
      bass += this.bassOctaveShift*12;

      bass2 = bass;
    }
  }
  return {
    boom: bass,
    boom2: bass2,
    chick: invertedNotes
  };
};

// 
// Chord inversions are represented by a : and a number after the chord name
//
ChordTrack.prototype.processInversion = function(chordName){

  var theSplits = chordName.split(":");
  
  var theChordName = theSplits[0];
  var theInversion = theSplits[1];

  if (theInversion != undefined){

    switch (theInversion){
      case "0":
        theInversion = 0;
        break;
      case "1":
        theInversion = 1;
        break;
      case "2":
        theInversion = 2;
        break;
      case "3":
        theInversion = 3;
        break;
      case "4":
        theInversion = 4;
        break;
      case "5":
        theInversion = 5;
        break;
      case "6":
        theInversion = 6;
        break;
      case "7":
        theInversion = 7;
        break;
      case "8":
        theInversion = 8;
        break;
      case "9":
        theInversion = 9;
        break;
      case "10":
        theInversion = 10;
        break;
      case "11":
        theInversion = 11;
        break;
      case "12":
        theInversion = 12;
        break;
      case "13":
        theInversion = 13;
        break;
      default:
        theInversion = 0;
        break;
    }
  }
  else{
    theInversion = 0;
  }

  return {name:theChordName,inversion:theInversion};
}

ChordTrack.prototype.chordNotes = function (bass, modifier,inversion) {

  var originalInversion = inversion;

  var intervals = this.chordIntervals[modifier];
  if (!intervals) {
    if (modifier.slice(0, 2).toLowerCase() === 'ma' || modifier[0] === 'M') intervals =this.chordIntervals.M;else if (modifier[0] === 'm' || modifier[0] === '-') intervals = this.chordIntervals.m;else intervals = this.chordIntervals.M;
  }

  var finalIntervals = intervals.slice();

  if (inversion != 0){

    var rawIntervals = intervals.slice();

    if (inversion >= (intervals.length+1)){

        inversion = inversion % (rawIntervals.length + 1);

    }

    for (i=0;i<inversion;++i){

      rawIntervals.push(intervals[i]+12)

    }

    finalIntervals = [];

    for (i=0;i<intervals.length;++i){

      finalIntervals.push(rawIntervals[i+inversion]);

    }
    
  }

  // if (inversion != 0){
  //   console.log("bass: "+bass+" modified: "+modifier+" originalInversion: "+originalInversion+" inversion: "+inversion);
  //   console.log("notes: "+intervals+" inverted: "+finalIntervals);
  //   console.log("-----------");
  // }

  bass += 12; // the chord is an octave above the bass note.
  
  // MAE 22 May 2024 - For chick octave shift
  bass += (this.chordOctaveShift * 12);

  var notes = [];
  for (var i = 0; i < intervals.length; i++) {
    notes.push(bass + intervals[i]);
  }

  var invertedNotes = [];
  for (var i = 0; i < finalIntervals.length; i++) {
    invertedNotes.push(bass + finalIntervals[i]);
  }

  return {notes:notes,invertedNotes:invertedNotes};
};

ChordTrack.prototype.writeNote = function (note, beatLength, volume, beat, noteLength, instrument) {
  // undefined means there is a stop time.

  //console.log("note: "+note+" beatLength: "+beatLength+" beat: "+beat+" noteLength: "+noteLength);

  // MAE 22 Jun 2024 - If the melody voice has tuning adjustment, apply it to the note 
  if (gVoiceTuning && (gVoiceTuning.length > 0)){
    if (note !== undefined) this.chordTrack.push({
      cmd: 'note',
      pitch: note,
      volume: volume,
      start: this.lastBarTime + beat * durationRounded(beatLength, this.tempoChangeFactor),
      duration: durationRounded(noteLength, this.tempoChangeFactor),
      gap: 0,
      instrument: instrument,
      cents: gVoiceTuning[0]
    });
  }
  else{ // Do no harm, original code!
    if (note !== undefined) this.chordTrack.push({
      cmd: 'note',
      pitch: note,
      volume: volume,
      start: this.lastBarTime + beat * durationRounded(beatLength, this.tempoChangeFactor),
      duration: durationRounded(noteLength, this.tempoChangeFactor),
      gap: 0,
      instrument: instrument
    });
  }
};
ChordTrack.prototype.chordTrackEmpty = function () {
  var isEmpty = true;
  for (var i = 0; i < this.chordTrack.length && isEmpty; i++) {
    if (this.chordTrack[i].cmd === 'note') isEmpty = false;
  }
  return isEmpty;
};
ChordTrack.prototype.resolveChords = function (startTime, endTime) {	

  //debugger;
  //console.log("resolveChords gchordbars: "+this.gchordbars);

  // If there is a rhythm head anywhere in the measure then don't add a separate rhythm track
  if (this.hasRhythmHead) return;
  var num = this.meter.num;
  var den = this.meter.den;
  var beatLength = 1 / den;

  // Auto determine the gchord divider if none specified with the gchord
  if (this.overridePattern){
    
    //console.log("resolveChords overridePattern: ["+this.overridePattern.join("][")+"]");
    
    var nSlots;

    if (den == 8){
      nSlots = num;
    }
    else if (den == 4){
      nSlots = num*2;
    }

    // Save this for later gchordbars slicing
    var originalNSlots = nSlots;

    // Scale the slot count by the bars the pattern extends over
    nSlots *= this.gchordbars;

    //console.log("resolveChords - nSlots: "+nSlots);

    if (this.gchordDivider == 0){

      var len = this.overridePattern.length;
      
      if (len <= nSlots){
      
        //console.log("resolveChords - auto divider: 1");
        this.gchordDivider = 1;
      
      }
      else if (len <= (nSlots*2)){
      
        //console.log("resolveChords - auto divider: 2");
        this.gchordDivider = 2;
      
      }
      else{
      
        //console.log("resolveChords - auto divider: 4");
        this.gchordDivider = 4;
      
      }
    }
    else{

      //console.log("resolveChords - force divider: "+this.gchordDivider);

    }

    //console.log("resolveChords - final divider: "+this.gchordDivider);
   
  }
  else{
    // No pattern after parse, shouldn't happen
    this.gchordDivider = 1;
  }

  //console.log("resolveChords - final divider: "+this.gchordDivider);

  // Scale the slot count by the chord divider
  originalNSlots *= this.gchordDivider;

  // Is there a gchord timing divider?
  if (this.gchordDivider > 1){
      beatLength /= this.gchordDivider;
  }

  // MAE 16 Jun 2024 - For beat length extension
  var noteLength = beatLength / 2;

  var thisMeasureLength = parseInt(num, 10) / parseInt(den, 10);
  var portionOfAMeasure = thisMeasureLength - (endTime - startTime) / this.tempoChangeFactor;

  if (Math.abs(portionOfAMeasure) < 0.00001) portionOfAMeasure = 0;

  // there wasn't a new chord this measure, so use the last chord declared.
  // also the case where there is a chord declared in the measure, but not on its first beat.
  if (this.currentChords.length === 0 || this.currentChords[0].beat !== 0) {
    this.currentChords.unshift({
      beat: 0,
      chord: this.chordLastBar
    });
  }

  //console.log(this.currentChords)
  var currentChordsExpanded = expandCurrentChords(this.currentChords, 8 * num / den, beatLength, this.gchordDivider);
  //console.log(currentChordsExpanded)
  
  var thisPattern = this.overridePattern ? this.overridePattern : this.rhythmPatterns[num + '/' + den];

  var thisGChordStressPattern = this.gchordstress;

  var thisGChordDurationScale  = this.gchorddurationscale;

  // No stress pattern? Create a unity gain version
  if (!thisGChordStressPattern){
    arr = [];
    for (var i=0;i<thisPattern.length;++i){
      arr.push(1.0);
    }
    thisGChordStressPattern = arr;
  }

  // Stress pattern too short? Fill it out.
  if (thisGChordStressPattern.length < thisPattern.length){

    thisGChordStressPattern = extendArray(thisGChordStressPattern,thisPattern.length);
  
  }

  // No duration scale pattern? Create a unity version
  if (!thisGChordDurationScale){
    arr = [];
    for (var i=0;i<thisPattern.length;++i){
      arr.push(1.0);
    }
    thisGChordDurationScale = arr;
  }

  // Duration scale too short? Fill it out.
  if (thisGChordDurationScale.length < thisPattern.length){

    thisGChordDurationScale = extendArray(thisGChordDurationScale,thisPattern.length);

  }

  // // Debug - Show the pattern, duration, and stress
  // var acc = "pattern: "
  // for (var i=0;i<thisPattern.length;++i){
  //   if (thisPattern[i] != ""){
  //     acc += thisPattern[i]+" ";
  //   }
  //   else{
  //     acc += "z ";
  //   }
  // }
  // console.log(acc);
  // console.log("duration: "+thisGChordDurationScale.join(" "));
  // //console.log("stress:   "+thisGChordStressPattern.join(" "));
  
  if (this.overridePattern){

    // console.log("resolveChords - gchordbars: "+this.gchordbars+" currentgchordbars: "+this.currentgchordbars);
    // console.log("before slice thisPattern: "+thisPattern.join(":"));
    // console.log("before slice thisGChordStressPattern: "+thisGChordStressPattern.join(":"));
    // console.log("before slice thisGChordDurationScale: "+thisGChordDurationScale.join(":"));

    // Now offset for any gchordbars offset
    var theStart = this.currentgchordbars * originalNSlots;
    var theEnd = theStart + originalNSlots;
    thisPattern = thisPattern.slice(theStart,theEnd);
    thisGChordStressPattern = thisGChordStressPattern.slice(theStart,theEnd);
    thisGChordDurationScale = thisGChordDurationScale.slice(theStart,theEnd);   

    this.currentgchordbars++;
    if (this.currentgchordbars == this.gchordbars){
      this.currentgchordbars = 0;
    }

    // console.log("after slice thisPattern: "+thisPattern.join(":"));
    // console.log("after slice thisGChordStressPattern: "+thisGChordStressPattern.join(":"));
    // console.log("after slice thisGChordDurationScale: "+thisGChordDurationScale.join(":"));

  }

  if (portionOfAMeasure) {

    var originalPattern = thisPattern.slice();

    var originalStressPattern = thisGChordStressPattern.slice();

    var originalDurationScalePattern = thisGChordDurationScale.slice();

    var originalPatternLength = originalPattern.length;

    //console.log("portionOfAMeasure true, patternLength: "+originalPatternLength);

    thisPattern = [];
    thisGChordStressPattern = [];
    thisGChordDurationScale = [];

    var beatsPresent = ((endTime - startTime) / this.tempoChangeFactor * 8) * this.gchordDivider;

    // Don't use a pattern during pickup lines
    if (beatsPresent > (2 * this.gchordDivider)){

      for (var p = 0; p < beatsPresent; p++) {

        if (p<originalPatternLength){

          thisPattern.push(originalPattern[p]);
          thisGChordStressPattern.push(originalStressPattern[p]);
          thisGChordDurationScale.push(originalDurationScalePattern[p]);

        }
        else{

           thisPattern.push("");
           thisGChordStressPattern.push(1.0);
           thisGChordDurationScale.push(1.0);
        }
      }

    }
    else{

      for (var p = 0; p < beatsPresent; p++) {

         thisPattern.push("");
         thisGChordStressPattern.push(1.0);
         thisGChordDurationScale.push(1.0);

      }
    }
  }

  // If no pattern, just push silence for the remaining beats
  if (!thisPattern) {
    thisPattern = [];
    for (var p = 0; (8 * num / den / 2); p++) {
      switch (this.gchordDivider){
        case 1:
          thisPattern.push("");
          thisPattern.push("");
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          break;
        case 2:
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          break;
        case 4:
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisPattern.push("");
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordStressPattern.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          thisGChordDurationScale.push(1.0);
          break;
      }
    }
  }

  var firstBoom = true;

  // If the pattern is overridden, it might be longer than the length of a measure. If so, then ignore the rest of it
  var minLength = Math.min(thisPattern.length, currentChordsExpanded.length);

  for (var p = 0; p < minLength; p++) {

    if (p > 0 && currentChordsExpanded[p - 1] && currentChordsExpanded[p] && currentChordsExpanded[p - 1].boom !== currentChordsExpanded[p].boom){
      firstBoom = true; 
    }
    var type = thisPattern[p];

    var stress = thisGChordStressPattern[p];

    // Range check the stress, can't be negative
    if (stress < 0){
      stress = 0;
    }

    var durationScale = thisGChordDurationScale[p];

    if (durationScale < 0){
      durationScale = 0;
    }

    //console.log('type: '+type+" stress: "+stress);

    var isBoom = type.indexOf('boom') >= 0;

    // If we changed chords at a time when we're not expecting a bass note, then add an extra bass note in.
   	var newBass = !isBoom && p !== 0 && thisPattern[0].indexOf('boom') >= 0 && (!currentChordsExpanded[p - 1] || currentChordsExpanded[p - 1].boom !== currentChordsExpanded[p].boom);
    
    if (!isBoom){
      firstBoom = false;
    }

    var pitches = resolvePitch(currentChordsExpanded[p], type, firstBoom, newBass);
    
    for (var oo = 0; oo < pitches.length; oo++) {

      // Allow for control of boom and chick lengths
      var thisNoteLength = noteLength*durationScale;

      if (thisNoteLength < 0){
        thisNoteLength = 0;
      }

      // Limit range of stressed notes to 0 - 127
      var boomVolume = Math.floor(this.boomVolume * stress);

      if (boomVolume < 0){
        boomVolume = 0;
      }

      if (boomVolume > 127){
        boomVolume = 127;
      }

      var chickVolume = Math.floor(this.chickVolume * stress);

      if (chickVolume < 0){
        chickVolume = 0;
      }
      
      if (chickVolume > 127){
        chickVolume = 127;
      }

      // Make sure not writing a bad pitch
      if (pitches[oo]){

        this.writeNote(pitches[oo], 0.125/this.gchordDivider, isBoom || newBass ? boomVolume  : chickVolume, p, thisNoteLength, isBoom || newBass ? this.bassInstrument : this.chordInstrument);

      }
 
      if (newBass) newBass = false;else isBoom = false; // only the first note in a chord is a bass note. This handles the case where bass and chord are played at the same time.

    }
  }

  return;
};
ChordTrack.prototype.processChord = function (elem) {
  if (this.chordTrackFinished) return;
  var chord = this.findChord(elem);
  if (chord) {
    var c = this.interpretChord(chord);
    // If this isn't a recognized chord, just completely ignore it.
    if (c) {
      // If we ever have a chord in this voice, then we add the chord track.
      // However, if there are chords on more than one voice, then just use the first voice.
      if (this.chordTrack.length === 0) {
        this.chordTrack.push({
          cmd: 'program',
          channel: this.chordChannel,
          instrument: this.chordInstrument
        });
      }
      this.lastChord = c;
      var barBeat = calcBeat(this.lastBarTime, timeToRealTime(elem.time));
      this.currentChords.push({
        chord: this.lastChord,
        beat: barBeat,
        start: timeToRealTime(elem.time)
      });
    }
  }
};

function extendArray(arr, size) {

    // Check if the desired size is smaller than or equal to the current array size
    if (size <= arr.length) {
        return arr.slice(0, size);
    }
    
    // Calculate how many times the array needs to be repeated
    let repeatCount = Math.floor(size / arr.length);
    let remainder = size % arr.length;
    
    // Create the new extended array by repeating the original array
    let extendedArray = [];
    for (let i = 0; i < repeatCount; i++) {
        extendedArray = extendedArray.concat(arr);
    }
    
    // Add the remaining elements to reach the desired size
    extendedArray = extendedArray.concat(arr.slice(0, remainder));
    
    return extendedArray;
}

function resolvePitch(currentChord, type, firstBoom, newBass) {
  var ret = [];
  if (!currentChord) return ret;

  if (type.indexOf('boom') >= 0){

    // Testing for breaks
    if (!currentChord.boom){
      //console.log("Got break, early return 1")
      return ret;
    }

    ret.push(firstBoom ? currentChord.boom : currentChord.boom2) 
  } 
  else
  if (newBass){

      // Testing for breaks
      if (!currentChord.boom){
        //console.log("Got break, early return 2")
        return ret;
      }

      ret.push(currentChord.boom);
  }

  if (type.indexOf('chick') >= 0) {
    for (var i = 0; i < currentChord.chick.length; i++) {
      ret.push(currentChord.chick[i]);
    }
  }

  // Added 21 Jun 2024 for power chords
  var isPowerChord = currentChord.chick.length == 2;

  if (!isPowerChord){
    switch (type) {
      case 'DO':
        ret.push(currentChord.chick[0]);
        break;
      case 'MI':
        ret.push(currentChord.chick[1]);
        break;
      case 'SOL':
        ret.push(currentChord.chick[2]);
        break;
      case 'TI':
        currentChord.chick.length > 3 ? ret.push(currentChord.chick[3]) : ret.push(currentChord.chick[0] + 12);
        break;
      case 'TOP':
        currentChord.chick.length > 4 ? ret.push(currentChord.chick[4]) : ret.push(currentChord.chick[1] + 12);
        break;
      case 'do':
        ret.push(currentChord.chick[0] + 12);
        break;
      case 'mi':
        ret.push(currentChord.chick[1] + 12);
        break;
      case 'sol':
        ret.push(currentChord.chick[2] + 12);
        break;
      case 'ti':
        currentChord.chick.length > 3 ? ret.push(currentChord.chick[3] + 12) : ret.push(currentChord.chick[0] + 24);
        break;
      case 'top':
        currentChord.chick.length > 4 ? ret.push(currentChord.chick[4] + 12) : ret.push(currentChord.chick[1] + 24);
        break;
    }
  }
  else{
    //console.log("Power chord");
    switch (type) {
      case 'DO':
        ret.push(currentChord.chick[0]);
        break;
      case 'MI':
        ret.push(currentChord.chick[1]);
        break;
      case 'SOL':
        ret.push(currentChord.chick[0] + 12);
        break;
      case 'TI':
        ret.push(currentChord.chick[1] + 12);
        break;
      case 'TOP':
        ret.push(currentChord.chick[0] + 24);
        break;
      case 'do':
        ret.push(currentChord.chick[0] + 12);
        break;
      case 'mi':
        ret.push(currentChord.chick[1] + 12);
        break;
      case 'sol':
        ret.push(currentChord.chick[0] + 24);
        break;
      case 'ti':
        ret.push(currentChord.chick[1] + 24);
        break;
      case 'top':
        ret.push(currentChord.chick[0] + 36);
        break;
    }    
  }
  return ret;
}

// Parse the gchord pattern and generate a default duration scale
function generateDefaultDurationScale(pattern){

  var result = [];
  var i = 0;

  while (i < pattern.length) {

    let char = pattern[i];
    let digits = '';

    // Move to the next character
    i++;

    // Collect all digits following the character
    while (i < pattern.length && /\d/.test(pattern[i])) {

        digits += pattern[i];
        i++;
    
    }

    var thisValue = digits.length > 0 ? parseInt(digits, 10) : 1

    // If there are digits, parse them as an integer, otherwise default to 1
    result.push(thisValue);

    // If value is not 1, pad to the full duration
    if (thisValue > 1){

      thisValue--;
      
      for (j=0;j<thisValue;++j){
        result.push(1);
      }

    }
  }
  
  // console.log("pattern: "+pattern);
  // console.log("result: "+result.join(" "));

  return result;

}

function parseGChord(gchord) {
  // TODO-PER: The spec is more complicated than this but for now this will not try to do anything with error cases like the wrong number of beats.


  // Find all the numbers in the string
  const regex = /\d+|\D/g;
  var result = [];
  var match;

  while ((match = regex.exec(gchord)) !== null) {
    result.push(match[0]);
  }

  // console.log("gchord: "+gchord);
  // console.log("result: "+result.join(" "));

  var pattern = [];

  for (var i = 0; i < result.length; i++) {

    // Special handling for digits found in the string
    var testInt = parseInt(result[i]);

    if (!isNaN(testInt)){
      if (testInt > 1){
        testInt--;
        for (var j=0;j<testInt;++j){
          pattern.push('');
        }
      }
    }
    else{
      var ch = result[i];
      switch (ch) {
        case 'z':
          pattern.push('');
          break;
        case 'c':
          pattern.push('chick');
          break;
        case 'b':
          pattern.push('boom&chick');
          break;
        case 'f':
          pattern.push('boom');
          break;
        case 'G':
          pattern.push('DO');
          break;
        case 'H':
          pattern.push('MI');
          break;
        case 'I':
          pattern.push('SOL');
          break;
        case 'J':
          pattern.push('TI');
          break;
        case 'K':
          pattern.push('TOP');
          break;
        case 'g':
          pattern.push('do');
          break;
        case 'h':
          pattern.push('mi');
          break;
        case 'i':
          pattern.push('sol');
          break;
        case 'j':
          pattern.push('ti');
          break;
        case 'k':
          pattern.push('top');
          break;
      }
    }
  }
  return pattern;
}

// This returns an array that has a chord for each 1/8th note position in the current measure
function expandCurrentChords(currentChords, num8thNotes, beatLength, divider) {
  num8thNotes*=divider;
  beatLength = beatLength * 8; // this is expressed as a fraction, so that 0.25 is a quarter notes. We want it to be the number of 8th notes
  var chords = [];
  if (currentChords.length === 0) return chords;
  var currentChord = currentChords[0].chord;
  for (var i = 1; i < currentChords.length; i++) {
    var current = currentChords[i];
    while (chords.length < (current.beat * divider)) {
      chords.push(currentChord);
    }
    currentChord = current.chord;
  }
  while (chords.length < num8thNotes) {
    chords.push(currentChord);
  }
  return chords;
}
function calcBeat(measureStart, currTime) {
  var distanceFromStart = currTime - measureStart;
  return distanceFromStart * 8;
}
ChordTrack.prototype.breakSynonyms = ['break', '(break)', 'no chord', 'n.c.', 'tacet'];
ChordTrack.prototype.basses = {
  'A': 33,
  'B': 35,
  'C': 36,
  'D': 38,
  'E': 40,
  'F': 41,
  'G': 43
}

ChordTrack.prototype.chordIntervals = {
	// diminished (all flat 5 chords)
	'dim': [0, 3, 6],
	'°': [0, 3, 6],
	'˚': [0, 3, 6],

	'dim7': [0, 3, 6, 9],
	'°7': [0, 3, 6, 9],
	'˚7': [0, 3, 6, 9],

	'ø7': [0, 3, 6, 10],
	'm7(b5)': [0, 3, 6, 10],
	'm7b5': [0, 3, 6, 10],
	'm7♭5': [0, 3, 6, 10],
	'-7(b5)': [0, 3, 6, 10],
	'-7b5': [0, 3, 6, 10],

	'7b5': [0, 4, 6, 10],
	'7(b5)': [0, 4, 6, 10],
	'7♭5': [0, 4, 6, 10],

	'7(b9,b5)': [0, 4, 6, 10, 13],
	'7b9,b5': [0, 4, 6, 10, 13],
	'7(#9,b5)': [0, 4, 6, 10, 15],
	'7#9b5': [0, 4, 6, 10, 15],
	'maj7(b5)': [0, 4, 6, 11],
	'maj7b5': [0, 4, 6, 11],
	'13(b5)': [0, 4, 6, 10, 14, 21],
	'13b5': [0, 4, 6, 10, 14, 21],

	// minor (all normal 5, minor 3 chords)
	'm': [0, 3, 7],
	'-': [0, 3, 7],
	'm6': [0, 3, 7, 9],
	'-6': [0, 3, 7, 9],
	'm7': [0, 3, 7, 10],
	'-7': [0, 3, 7, 10],

	'-(b6)': [0, 3, 7, 8],
	'-b6': [0, 3, 7, 8],
	'-6/9': [0, 3, 7, 9, 14],
	'-7(b9)': [0, 3, 7, 10, 13],
	'-7b9': [0, 3, 7, 10, 13],
	'-maj7': [0, 3, 7, 11],
	'-9+7': [0, 3, 7, 11, 13],
	'-11': [0, 3, 7, 11, 14, 17],
	'm11': [0, 3, 7, 11, 14, 17],
	'-maj9': [0, 3, 7, 11, 14],
	'-∆9': [0, 3, 7, 11, 14],
	'mM9': [0, 3, 7, 11, 14],

	// major (all normal 5, major 3 chords)
	'M': [0, 4, 7],
	'6': [0, 4, 7, 9],
	'6/9': [0, 4, 7, 9, 14],
	'6add9': [0, 4, 7, 9, 14],
	'69': [0, 4, 7, 9, 14],

	'7': [0, 4, 7, 10],
	'9': [0, 4, 7, 10, 14],
	'11': [0, 7, 10, 14, 17],
	'13': [0, 4, 7, 10, 14, 21],
	'7b9': [0, 4, 7, 10, 13],
	'7♭9': [0, 4, 7, 10, 13],
	'7(b9)': [0, 4, 7, 10, 13],
	'7(#9)': [0, 4, 7, 10, 15],
	'7#9': [0, 4, 7, 10, 15],
	'(13)': [0, 4, 7, 10, 14, 21],
	'7(9,13)': [0, 4, 7, 10, 14, 21],
	'7(#9,b13)': [0, 4, 7, 10, 15, 20],
	'7(#11)': [0, 4, 7, 10, 14, 18],
	'7#11': [0, 4, 7, 10, 14, 18],
	'7(b13)': [0, 4, 7, 10, 20],
	'7b13': [0, 4, 7, 10, 20],
	'9(#11)': [0, 4, 7, 10, 14, 18],
	'9#11': [0, 4, 7, 10, 14, 18],
	'13(#11)': [0, 4, 7, 10, 18, 21],
	'13#11': [0, 4, 7, 10, 18, 21],

	'maj7': [0, 4, 7, 11],
	'∆7': [0, 4, 7, 11],
	'Δ7': [0, 4, 7, 11],
	'maj9': [0, 4, 7, 11, 14],
	'maj7(9)': [0, 4, 7, 11, 14],
	'maj7(11)': [0, 4, 7, 11, 17],
	'maj7(#11)': [0, 4, 7, 11, 18],
	'maj7(13)': [0, 4, 7, 14, 21],
	'maj7(9,13)': [0, 4, 7, 11, 14, 21],

	'7sus4': [0, 5, 7, 10],
	'm7sus4': [0, 3, 7, 10, 17],
	'sus4': [0, 5, 7],
	'sus2': [0, 2, 7],
	'7sus2': [0, 2, 7, 10],
	'9sus4': [0, 5, 7, 10, 14],
	'13sus4': [0, 5, 7, 10, 14, 21],

	// augmented (all sharp 5 chords)
	'aug7': [0, 4, 8, 10],
	'+7': [0, 4, 8, 10],
	'+': [0, 4, 8],
	'7#5': [0, 4, 8, 10],
	'7♯5': [0, 4, 8, 10],
	'7+5': [0, 4, 8, 10],
	'9#5': [0, 4, 8, 10, 14],
	'9♯5': [0, 4, 8, 10, 14],
	'9+5': [0, 4, 8, 10, 14],
	'-7(#5)': [0, 3, 8, 10],
	'-7#5': [0, 3, 8, 10],
	'7(#5)': [0, 4, 8, 10],
	'7(b9,#5)': [0, 4, 8, 10, 13],
	'7b9#5': [0, 4, 8, 10, 13],
	'maj7(#5)': [0, 4, 8, 11],
	'maj7#5': [0, 4, 8, 11],
	'maj7(#5,#11)': [0, 4, 8, 11, 18],
	'maj7#5#11': [0, 4, 8, 11, 18],
	'9(#5)': [0, 4, 8, 10, 14],
	'13(#5)': [0, 4, 8, 10, 14, 21],
	'13#5': [0, 4, 8, 10, 14, 21],
	 // MAE Power chords added 10 April 2024
    '5': [0, 7],
    '5(8)':[0, 7, 12],
    '5add8': [0, 7, 12]

};

ChordTrack.prototype.rhythmPatterns = {
	"2/2": ['boom', '', '', '', 'chick', '', '', ''],
	"3/2": ['boom', '', '', '', 'chick', '', '', '', 'chick', '', '', ''],
	"4/2": ['boom', '', '', '', 'chick', '', '', '', 'boom', '', '', '', 'chick', '', '', ''],

	"2/4": ['boom', '', 'chick', ''],
	"3/4": ['boom', '', 'chick', '', 'chick', ''],
	"4/4": ['boom', '', 'chick', '', 'boom', '', 'chick', ''],
	"5/4": ['boom', '', 'chick', '', 'chick', '', 'boom', '', 'chick', ''],
	"6/4": ['boom', '', 'chick', '', 'boom', '', 'chick', '', 'boom', '', 'chick', ''],
	"3/8": ['boom', '', 'chick'],
  	"5/8": ['boom', 'chick', 'chick', 'boom', 'chick'],
	"6/8": ['boom', '', 'chick', 'boom', '', 'chick'],
	"7/8": ['boom', 'chick', 'chick', 'boom', 'chick', 'boom', 'chick'],
	"9/8": ['boom', '', 'chick', 'boom', '', 'chick', 'boom', '', 'chick'],
  	"10/8": ['boom', 'chick', 'chick', 'boom', 'chick', 'chick', 'boom', 'chick', 'boom', 'chick'],
  	"11/8": ['boom', 'chick', 'chick', 'boom', 'chick', 'chick', 'boom', 'chick', 'boom', 'chick', 'chick'],
	"12/8": ['boom', '', 'chick', 'boom', '', 'chick', 'boom', '', 'chick', 'boom', '', 'chick'],
};

// TODO-PER: these are repeated in flattener. Can it be shared?

function timeToRealTime(time) {
	return time / 1000000;
}

function durationRounded(duration, tempoChangeFactor) {
	return Math.round(duration * tempoChangeFactor * 1000000) / 1000000;
}

module.exports = ChordTrack;
