import { createStore } from 'vuex'
import { store } from "./store";
import { registerComponents } from './components'

export default ({ app }) => {
	const vuexStore = createStore(store)
	app.use(vuexStore)
	registerComponents(app)
}
