import Vuex from 'vuex'
import {store} from "./store";

export default ({
					Vue,
				}) => {


	Vue.use(Vuex);

	const vuexStore = new Vuex.Store(store)
	Vue.mixin({store: vuexStore})
}
