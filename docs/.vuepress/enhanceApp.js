import Vuex from 'vuex'

export default ({
					Vue,
				}) => {


	Vue.use(Vuex);

	const state = {
		synth: {
			usingNode: true,
			soundfont: false,

			sheetMusic: true,
			cursor: false,
			changes: 'editor',

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
		}
	}

	const getters = {
		usingNode(state) { return state.synth.usingNode },
		soundfont(state) { return state.synth.soundfont },
		sheetMusic(state) { return state.synth.sheetMusic },
		cursor(state) { return state.synth.cursor },
		changes(state) { return state.synth.changes },
		playbackWidget(state) { return state.synth.playbackWidget },
		large(state) { return state.synth.large },
		loop(state) { return state.synth.loop },
		restart(state) { return state.synth.restart },
		play(state) { return state.synth.play },
		progress(state) { return state.synth.progress },
		warp(state) { return state.synth.warp },
		clock(state) { return state.synth.clock },
		usingCallbacks(state) { return state.synth.usingCallbacks },
		metronome(state) { return state.synth.metronome },
		tempo(state) { return state.synth.tempo },
		stereo(state) { return state.synth.stereo },
		instrument(state) { return state.synth.instrument },
		transpose(state) { return state.synth.transpose },
		noChords(state) { return state.synth.noChords },
		noVoice(state) { return state.synth.noVoice },
		tweak(state) { return state.synth.tweak },
		midi(state) { return state.synth.midi },
		playImmediate(state) { return state.synth.playImmediate },
	}

	const mutations = {
		usingNode(state, payload) { state.synth.usingNode = payload },
		soundfont(state, payload) { state.synth.soundfont = payload },
		sheetMusic(state, payload) { state.synth.sheetMusic = payload },
		cursor(state, payload) { state.synth.cursor = payload },
		changes(state, payload) { state.synth.changes = payload },
		playbackWidget(state, payload) { state.synth.playbackWidget = payload },
		large(state, payload) { state.synth.large = payload },
		loop(state, payload) { state.synth.loop = payload },
		restart(state, payload) { state.synth.restart = payload },
		play(state, payload) { state.synth.play = payload },
		progress(state, payload) { state.synth.progress = payload },
		warp(state, payload) { state.synth.warp = payload },
		clock(state, payload) { state.synth.clock = payload },
		usingCallbacks(state, payload) { state.synth.usingCallbacks = payload },
		metronome(state, payload) { state.synth.metronome = payload },
		tempo(state, payload) { state.synth.tempo = payload },
		stereo(state, payload) { state.synth.stereo = payload },
		instrument(state, payload) { state.synth.instrument = payload },
		transpose(state, payload) { state.synth.transpose = payload },
		noChords(state, payload) { state.synth.noChords = payload },
		noVoice(state, payload) { state.synth.noVoice = payload },
		tweak(state, payload) { state.synth.tweak = payload },
		midi(state, payload) { state.synth.midi = payload },
		playImmediate(state, payload) { state.synth.playImmediate = payload },
	}

	const actions = {
	}

	const store = new Vuex.Store({
		state,
		getters,
		mutations,
		actions,
	})
	Vue.mixin({store: store})
}
