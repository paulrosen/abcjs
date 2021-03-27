import abcjsEditor from './components/AbcjsEditor'
import checkBox from './components/CheckBox'
import exampleTuneBook from './components/ExampleTuneBook'
import fieldSet from './components/FieldSet'
import foundClasses from './components/FoundClasses'
import numTunes from './components/NumTunes'
import radioGroup from './components/RadioGroup'
import renderAbc from './components/RenderAbc'
import renderAudio from './components/RenderAudio'
import sandboxCode from './components/SandboxCode'
import sandboxContainer from './components/SandboxContainer'
import sandboxInput from './components/SandboxInput'
import sandboxOutput from './components/SandboxOutput'
import showAndRenderAbc from './components/ShowAndRenderAbc'
import timingCallbacks from './components/TimingCallbacks'
import tuneBookInfo from './components/TuneBookInfo'

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
