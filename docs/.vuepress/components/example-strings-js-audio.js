export const soundJsString = ((usingNode, getters) => {
	if (!getters.hasSound)
		return "";
	const abcjs = usingNode ? "abcjs" : "ABCJS";

	let output = `document.querySelector(".activate-audio").addEventListener("click", activate);
function activate() {	
	if (${abcjs}.synth.supportsAudio()) {
`;

	if (getters.playbackWidget) {
		let controlOptions = []
		if (getters.loop) controlOptions.push("\t\t\tdisplayLoop: true");
		if (getters.restart) controlOptions.push("\t\t\tdisplayRestart: true");
		if (getters.play) controlOptions.push("\t\t\tdisplayPlay: true");
		if (getters.progress) controlOptions.push("\t\t\tdisplayProgress: true");
		if (getters.warp) controlOptions.push("\t\t\tdisplayWarp: true");
		if (getters.clock) controlOptions.push("\t\t\tdisplayClock: true");
		output += `\t\tvar controlOptions = {\n${controlOptions.join(",\n")}\n\t\t};\n`
	}
	let options = [];
	let optionsOptions = [];
	if (getters.tempo) options.push("millisecondsPerMeasure: 800");
	if (getters.stereo) optionsOptions.push("pan: [-.5,.5]");
//	if (getters.instrument) options.push("instrument");
//	if (getters.transpose) options.push("transpose");
	if (getters.noChords) options.push("chordsOff: true");
	if (getters.noVoice) options.push("voicesOff: true");
//	if (getters.tweak) options.push("tweak");
	if (getters.midi) options.push("midi");
//	if (getters.playImmediate) options.push("immediate");
//	if (getters.switchTunes) options.push("switchtunes");
//	if (getters.hideVoice) options.push("hideVoice");
//	if (getters.preload) options.push("preload");
//	if (getters.loopMeasures) options.push("loopmeasures");
	if (getters.swingFeel) options.push("swing");
	if (getters.soundfont) optionsOptions.push("soundfont: '/path/to/soundfont/'");
	options.push("options: {\n\t\t\t\t"+optionsOptions.join(",\n\t\t\t\t") + "\n\t\t\t}\n")

	output += `\t\tvar synthControl = new ${abcjs}.synth.SynthController();\n`;
	var cursorControl = getters.cursor ? "cursorControl" : "null";
	output += `\t\tsynthControl.load("#audio", ${cursorControl}, controlOptions);\n`;

	output += `		synthControl.disable(true);
		var midiBuffer = new ${abcjs}.synth.CreateSynth();
		midiBuffer.init({
			visualObj: visualObj[0],
			${options.join(",\n\t\t\t")}
		}).then(function () {
			synthControl.setTune(visualObj[0], true).then(function (response) {
			document.querySelector(".abcjs-inline-audio").classList.remove("disabled");
\t\t\t})
		});
`;

	output += `\t} else {
		console.log("audio is not supported on this browser");
	};
}	
`
	return output
})

const str = `
if (ABCJS.synth.supportsAudio()) {
\tvar synthControl = new ABCJS.synth.SynthController();
\tsynthControl.load("#audio", 
        cursorControl, 
        {
            displayLoop: true, 
            displayRestart: true, 
            displayPlay: true, 
            displayProgress: true, 
            displayWarp: true
        }
    );

var audioParams = { chordsOff: true };

\tvar createSynth = new ABCJS.synth.CreateSynth();
\tcreateSynth.init({ visualObj: visualObj[0] }).then(function () {
\t\tsynthControl.setTune(visualObj[0], false, audioParams).then(function () {
\t\t\tconsole.log("Audio successfully loaded.")
\t\t}).catch(function (error) {
\t\t\tconsole.warn("Audio problem:", error);
\t\t});
\t}).catch(function (error) {
\t\tconsole.warn("Audio problem:", error);
\t});
} else {
\tdocument.querySelector("#audio").innerHTML = 
        "Audio is not supported in this browser.";
\t}
}`
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

// const audioControlCode = (sandbox) => {
// 	if (!sandbox.playbackWidget) {
// 		return `var mySynth = new ABCJS.synth.CreateSynth();
// mySynth.init(synthOptions).then(() => {
//   synth.prime().then(() => {
//     start();
//   });
// });`;
// 	}
//
// 	return `var mySynth = new ABCJS.synth.CreateSynth();
// var synthControl = new synth.SynthController();
// var mySynth = new ABCJS.synth.CreateSynth();
//
// mySynth.init(synthOptions).then(function() {
//   synthControl.setTune(visualObj[0], true, audioParams)
//   .then(function(){
//     console.log('Audio successfully loaded.')
//   }).catch(function(error) {
//     console.warn('Audio problem: ', error);
//   })
// });
//
// synthControl.load('#audio', cursorControl, {
//   displayLoop: ${sandbox.loop},
//   displayRestart: ${sandbox.restart},
//   displayPlay: ${sandbox.play},
//   displayProgress: ${sandbox.progress},
//   displayWarp: ${sandbox.warp},
//   displayClock: ${sandbox.clock}
// });`
// }
//
// const soundCode = (sandbox, animationOptions, visualOptions, audioParams) => {
// 	// TODO: How should a dev use these parameters if they do not have a playback widget to pass audioParams to?
// 	if(sandbox.metronome) console.log('metronome')   // TODO
// 	if(sandbox.tempo) {
// 		animationOptions.bpm = 120;
// 		audioParams.qpm = 120;
// 	}
// 	if(sandbox.stereo) console.log('stereo')   // TODO
// 	if(sandbox.instrument) audioParams.program = 0;
// 	if(sandbox.transpose) {
// 		visualOptions.visualTranspose = 0;
// 		audioParams.midiTranspose = 0;
// 	}
// 	if(sandbox.noChords) audioParams.chordsOff = true;
// 	if(sandbox.noVoice) audioParams.voicesOff = true;
// }
//
// const timingCode = (sandbox) => {
// 	if (!sandbox.usingCallbacks) return '';
//
// 	// TODO: Currently, both objects will be instantiated if user selects "Listen for callbacks". Suggestion to present TimingCallbacks and CursorControl as separate options in the sandbox.
// 	return `
// var timingCallbacks = new abcjs.TimingCallbacks(visualObj, {});
// cursorControl = new synth.CursorControl();`
// }
//
// const otherCode = (sandbox, synthOptions, audioParams) => {
// 	if(sandbox.tweak) {
// 		synthOptions.sequenceCallback = 'callback to change audio before it is buffered';
// 		audioParams.sequenceCallback = 'callback to change audio before it is buffered';
// 	}
// 	// TODO
// 	if(sandbox.playImmediate) {
// 		console.log('playImmediate')
// 	}
//
// 	// TODO: Midi is deprecated.
// 	return sandbox.midi ? `ABCJS.renderMidi("midi-download", abc, { generateDownload: true, generateInline: false });` : '';
// }
