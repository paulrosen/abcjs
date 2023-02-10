import abcjsEditor from './components/AbcjsEditor.vue'
import checkBox from './components/CheckBox.vue'
import exampleTuneBook from './components/ExampleTuneBook.vue'
import fieldSet from './components/FieldSet.vue'
import foundClasses from './components/FoundClasses.vue'
import numTunes from './components/NumTunes.vue'
import radioGroup from './components/RadioGroup.vue'
import renderAbc from './components/RenderAbc.vue'
import renderAudio from './components/RenderAudio.vue'
import sandboxCode from './components/SandboxCode.vue'
import sandboxContainer from './components/SandboxContainer.vue'
import sandboxInput from './components/SandboxInput.vue'
import sandboxOutput from './components/SandboxOutput.vue'
import showAndRenderAbc from './components/ShowAndRenderAbc.vue'
import timingCallbacks from './components/TimingCallbacks.vue'
import tuneBookInfo from './components/TuneBookInfo.vue'

const registerComponents = (app) => {
	app.component('abcjsEditor', abcjsEditor)
	app.component('checkBox', checkBox)
	app.component('exampleTuneBook', exampleTuneBook)
	app.component('fieldSet', fieldSet)
	app.component('foundClasses', foundClasses)
	app.component('numTunes', numTunes)
	app.component('radioGroup', radioGroup)
	app.component('renderAbc', renderAbc)
	app.component('renderAudio', renderAudio)
	app.component('sandboxCode', sandboxCode)
	app.component('sandboxContainer', sandboxContainer)
	app.component('sandboxInput', sandboxInput)
	app.component('sandboxOutput', sandboxOutput)
	app.component('showAndRenderAbc', showAndRenderAbc)
	app.component('timingCallbacks', timingCallbacks)
	app.component('tuneBookInfo', tuneBookInfo)
}

export { registerComponents }
