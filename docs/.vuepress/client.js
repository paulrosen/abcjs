import { createStore } from 'vuex'
import { store } from "./store";
import { registerComponents } from './components'
import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
	enhance({ app }) {
		const vuexStore = createStore(store)
		app.use(vuexStore)
		registerComponents(app)
	}
})
