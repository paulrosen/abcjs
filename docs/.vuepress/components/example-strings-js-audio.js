////////////////////////////////////////////

// TODO-PER: from sheetMusicJs. To be integrated:

//       const synthOptions = {};  // will be passed to mySynth.init
//       const audioParams = {};   // will be passed to synthControl.setTune()
//       const animationOptions = {};    // will be passed to startAnimation()
//
//       if (getters.soundfont) {
//         synthOptions.soundFontURL = 'URL';
//         audioParams.soundFontURL = 'URL';
//       }
//
//       // VISUAL
//       const animation = animationCode(getters, animationOptions);
//
//       // AUDIO CONTROL
//       const widget = audioControlCode(getters);
//
//       // SOUND
//       soundCode(getters, animationOptions, visualOptions, audioParams);
//
//       // OTHER
//       const other = otherCode(getters, synthOptions, audioParams);
//
//       // RETURNED CODE
//       return `
// var visualOptions = ${replaceFunctionPlaceholders(JSON.stringify(visualOptions))};
// var audioParams = ${JSON.stringify(audioParams)};
// var cursorControl = null;
// var synthOptions = { visualObj: visualObj[0], ...${JSON.stringify(synthOptions)} };
//
// ${changes}
//
// // trigger these on a user gesture:
// ${widget}
//
// ${animation} ${timing} ${other}`;

////////////////////////////////////////////
// TODO-PER: to be integrated

const audioControlCode = (sandbox) => {
	if (!sandbox.playbackWidget) {
		return `var mySynth = new ABCJS.synth.CreateSynth();
mySynth.init(synthOptions).then(() => { 
  synth.prime().then(() => {
    start();
  });
});`;
	}

	return `var mySynth = new ABCJS.synth.CreateSynth();
var synthControl = new synth.SynthController();
var mySynth = new ABCJS.synth.CreateSynth();

mySynth.init(synthOptions).then(function() {
  synthControl.setTune(visualObj[0], true, audioParams)
  .then(function(){
    console.log('Audio successfully loaded.')
  }).catch(function(error) {
    console.warn('Audio problem: ', error);
  })
});

synthControl.load('#audio', cursorControl, {
  displayLoop: ${sandbox.loop},
  displayRestart: ${sandbox.restart},
  displayPlay: ${sandbox.play},
  displayProgress: ${sandbox.progress},
  displayWarp: ${sandbox.warp},
  displayClock: ${sandbox.clock} 
});`
}

const soundCode = (sandbox, animationOptions, visualOptions, audioParams) => {
	// TODO: How should a dev use these parameters if they do not have a playback widget to pass audioParams to?
	if(sandbox.metronome) console.log('metronome')   // TODO
	if(sandbox.tempo) {
		animationOptions.bpm = 120;
		audioParams.qpm = 120;
	}
	if(sandbox.stereo) console.log('stereo')   // TODO
	if(sandbox.instrument) audioParams.program = 0;
	if(sandbox.transpose) {
		visualOptions.visualTranspose = 0;
		audioParams.midiTranspose = 0;
	}
	if(sandbox.noChords) audioParams.chordsOff = true;
	if(sandbox.noVoice) audioParams.voicesOff = true;
}

const timingCode = (sandbox) => {
	if (!sandbox.usingCallbacks) return '';

	// TODO: Currently, both objects will be instantiated if user selects "Listen for callbacks". Suggestion to present TimingCallbacks and CursorControl as separate options in the sandbox.
	return `
var timingCallbacks = new abcjs.TimingCallbacks(visualObj, {});
cursorControl = new synth.CursorControl();`
}

const otherCode = (sandbox, synthOptions, audioParams) => {
	if(sandbox.tweak) {
		synthOptions.sequenceCallback = 'callback to change audio before it is buffered';
		audioParams.sequenceCallback = 'callback to change audio before it is buffered';
	}
	// TODO
	if(sandbox.playImmediate) {
		console.log('playImmediate')
	}

	// TODO: Midi is deprecated.
	return sandbox.midi ? `ABCJS.renderMidi("midi-download", abc, { generateDownload: true, generateInline: false });` : '';
}
