import {audioString, clickListenerHtmlString, dragExplanationHtmlString, dragHtmlString, editorString, middleString, midiString, paperString, postAmbleString, preamble2String, preambleString, setupString, startTimerHtmlString} from "./components/example-strings";
import {cssString} from "./components/example-strings-css";
import {clickListenerJsString, editorJsString, renderAbcString, visualOptionsString} from "./components/example-strings-js";
import {cursorJsString} from "./components/example-strings-js-cursor";
import {dragJsString} from "./components/example-strings-js-drag";
import {soundJsString} from "./components/example-strings-js-audio";

const state = {
	examples: {
		usingNode: true,
		soundfont: false,

		sheetMusic: true,
		cursor: false,
		hideMeasures: false,
		jazzChords: false,
		responsive: false,
		changes: 'programmatic',
		hideVoice: false,
		preload: false,
		loopMeasures: false,
		swingFeel: false,

		hasSound: false,
		playbackWidget: true,
		large: false,
		loop: false,
		restart: true,
		play: true,
		progress: true,
		warp: false,
		clock: true,

		usingCallbacks: false,
		metronome: false,
		tempo: false,
		stereo: false,
		instrument: false,
		transpose: false,
		noChords: false,
		noVoice: false,

		tweak: false,
		midi: false,
		playImmediate: false,
		switchTunes: false,

		isDownloading: false,
	}
}

const getters = {
	usingNode(state) { return state.examples.usingNode },
	soundfont(state) { return state.examples.soundfont },
	sheetMusic(state) { return state.examples.sheetMusic },
	cursor(state) { return state.examples.cursor },
	hideMeasures(state) { return state.examples.hideMeasures },
	jazzChords(state) { return state.examples.jazzChords },
	hideVoice(state) { return state.examples.hideVoice },
	preload(state) { return state.examples.preload },
	loopMeasures(state) { return state.examples.loopMeasures },
	swingFeel(state) { return state.examples.swingFeel },
	responsive(state) { return state.examples.responsive },
	changes(state) { return state.examples.changes },
	hasSound(state) { return state.examples.hasSound },
	playbackWidget(state) { return state.examples.playbackWidget },
	large(state) { return state.examples.large },
	loop(state) { return state.examples.loop },
	restart(state) { return state.examples.restart },
	play(state) { return state.examples.play },
	progress(state) { return state.examples.progress },
	warp(state) { return state.examples.warp },
	clock(state) { return state.examples.clock },
	usingCallbacks(state) { return state.examples.usingCallbacks },
	metronome(state) { return state.examples.metronome },
	tempo(state) { return state.examples.tempo },
	stereo(state) { return state.examples.stereo },
	instrument(state) { return state.examples.instrument },
	transpose(state) { return state.examples.transpose },
	noChords(state) { return state.examples.noChords },
	noVoice(state) { return state.examples.noVoice },
	tweak(state) { return state.examples.tweak },
	midi(state) { return state.examples.midi },
	playImmediate(state) { return state.examples.playImmediate },
	switchTunes(state) { return state.examples.switchTunes },
	isDownloading(state) { return state.examples.isDownloading },

	declaration(state, getters) {
		return setupString(getters.usingNode)
	},
	sheetMusicHtml(state, getters) {
		return `${dragExplanationHtmlString(getters.changes === 'drag')}
${editorString(getters.hasEditor)}
${paperString(getters.sheetMusic)}
${audioString(getters.playbackWidget && getters.hasSound, getters.large)}
${midiString(getters.midi)}
${clickListenerHtmlString(getters.sheetMusic && getters.usingCallbacks)}
${dragHtmlString(getters.changes === 'drag')}
${startTimerHtmlString(getters.sheetMusic && (getters.cursor || getters.hideMeasures))}
`;
	},

	sheetMusicCss(state, getters) {
		return cssString(
			getters.playbackWidget && getters.hasSound,
			getters.sheetMusic && getters.cursor,
			getters.sheetMusic && getters.hideMeasures,
			getters.sheetMusic && getters.changes === 'drag',
			getters.sheetMusic && getters.usingCallbacks
		);
	},

	sheetMusicJs(state, getters) {
		var usingNode = getters.isDownloading ? false : getters.usingNode;
		return sheetMusicJsBuilder(getters, usingNode);
	},
	sheetMusicJsNode(state, getters) {
		return sheetMusicJsBuilder(getters, true);
	},
	hasEditor(state, getters) {
		return getters.changes === 'editor';
	},
	title(state, getters) {
		let options = [];
		if (getters.sheetMusic) options.push("visual");
		if (getters.sheetMusic && getters.responsive) options.push("responsive");
		if (getters.sheetMusic && getters.cursor) options.push("cursor");
		if (getters.sheetMusic && getters.hideMeasures) options.push("hide");
		if (getters.sheetMusic && getters.jazzChords) options.push("jazz");
		options.push(getters.changes);
		if (getters.sheetMusic && getters.usingCallbacks) options.push("callback");
		if (getters.hasSound) options.push("sound");
		if (getters.hasSound && getters.playbackWidget) options.push("playback");
		if (getters.hasSound && getters.playbackWidget && getters.large) options.push("large");
		if (getters.hasSound && getters.playbackWidget && getters.loop) options.push("loop");
		if (getters.hasSound && getters.playbackWidget && getters.restart) options.push("restart");
		if (getters.hasSound && getters.playbackWidget && getters.play) options.push("play");
		if (getters.hasSound && getters.playbackWidget && getters.progress) options.push("progress");
		if (getters.hasSound && getters.playbackWidget && getters.warp) options.push("warp");
		if (getters.hasSound && getters.playbackWidget && getters.clock) options.push("clock");
		if (getters.hasSound && getters.metronome) options.push("metronome");
		if (getters.hasSound && getters.tempo) options.push("tempo");
		if (getters.hasSound && getters.stereo) options.push("stereo");
		if (getters.hasSound && getters.instrument) options.push("instrument");
		if (getters.hasSound && getters.transpose) options.push("transpose");
		if (getters.hasSound && getters.noChords) options.push("nochords");
		if (getters.hasSound && getters.noVoice) options.push("novoice");
		if (getters.hasSound && getters.tweak) options.push("tweak");
		if (getters.hasSound && getters.midi) options.push("midi");
		if (getters.hasSound && getters.playImmediate) options.push("immediate");
		if (getters.hasSound && getters.switchTunes) options.push("switchtunes");
		if (getters.hasSound && getters.hideVoice) options.push("hideVoice");
		if (getters.hasSound && getters.preload) options.push("preload");
		if (getters.hasSound && getters.loopMeasures) options.push("loopmeasures");
		if (getters.hasSound && getters.swingFeel) options.push("swing");
		if (getters.hasSound && getters.soundfont) options.push("soundfont");

		return options.join(' ');
	},
	filename(state, getters) {
		return getters.title.replace(/ /g,'-') + ".html";
	},
	fullDemo(state, getters) {
		return `${preambleString(getters.title)}${getters.sheetMusicCss}${preamble2String(getters.hasEditor)}${getters.sheetMusicJs}${middleString(getters.title)}${getters.sheetMusicHtml}${postAmbleString()}`;
	}

}

const mutations = {
	usingNode(state, payload) { state.examples.usingNode = payload },
	soundfont(state, payload) { state.examples.soundfont = payload },
	sheetMusic(state, payload) { state.examples.sheetMusic = payload },
	cursor(state, payload) { state.examples.cursor = payload },
	hideMeasures(state, payload) { state.examples.hideMeasures = payload },
	jazzChords(state, payload) { state.examples.jazzChords = payload },
	hideVoice(state, payload) { state.examples.hideVoice = payload },
	preload(state, payload) { state.examples.preload = payload },
	loopMeasures(state, payload) { state.examples.loopMeasures = payload },
	swingFeel(state, payload) { state.examples.swingFeel = payload },
	responsive(state, payload) { state.examples.responsive = payload },
	changes(state, payload) { state.examples.changes = payload },
	hasSound(state, payload) { state.examples.hasSound = payload },
	playbackWidget(state, payload) { state.examples.playbackWidget = payload },
	large(state, payload) { state.examples.large = payload },
	loop(state, payload) { state.examples.loop = payload },
	restart(state, payload) { state.examples.restart = payload },
	play(state, payload) { state.examples.play = payload },
	progress(state, payload) { state.examples.progress = payload },
	warp(state, payload) { state.examples.warp = payload },
	clock(state, payload) { state.examples.clock = payload },
	usingCallbacks(state, payload) { state.examples.usingCallbacks = payload },
	metronome(state, payload) { state.examples.metronome = payload },
	tempo(state, payload) { state.examples.tempo = payload },
	stereo(state, payload) { state.examples.stereo = payload },
	instrument(state, payload) { state.examples.instrument = payload },
	transpose(state, payload) { state.examples.transpose = payload },
	noChords(state, payload) { state.examples.noChords = payload },
	noVoice(state, payload) { state.examples.noVoice = payload },
	tweak(state, payload) { state.examples.tweak = payload },
	midi(state, payload) { state.examples.midi = payload },
	playImmediate(state, payload) { state.examples.playImmediate = payload },
	switchTunes(state, payload) { state.examples.switchTunes = payload },
	isDownloading(state, payload) { state.examples.isDownloading = payload },
}

const actions = {
}

export const store = {
	state,
	getters,
	mutations,
	actions,
}

function sheetMusicJsBuilder(getters, usingNode) {

	const visualOptions = visualOptionsString(
		getters.responsive,
		getters.sheetMusic && getters.usingCallbacks,
		getters.hasSound && getters.metronome,
		getters.hideMeasures,
		getters.jazzChords,
	);
	const str =`${renderAbcString(usingNode, !getters.hasEditor, getters.sheetMusic, visualOptions)}
${editorJsString(usingNode, getters.hasEditor, getters.sheetMusic)}
${soundJsString(usingNode, getters)}
${clickListenerJsString(getters.sheetMusic && getters.usingCallbacks)}
${cursorJsString(usingNode, getters.sheetMusic && getters.cursor, getters.sheetMusic && getters.hideMeasures)}
${dragJsString(usingNode, getters.changes === 'drag')}
`;
	return str.replace(/\t/g,"    ");
}
