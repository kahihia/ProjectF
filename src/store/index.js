import Vue from 'vue'
import Vuex from 'vuex'
import remix from './modules/remix'
import tabbar from './modules/tabbar'
import chat from './modules/chat'
import createLogger from '@/plugins/logger'
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  modules: {
    remix,
    tabbar,
    chat
  },
  // strict: debug,
  plugins: debug ? [createLogger()] : []
  // plugins:[debug ? createLogger():'',createPersistedState()]
});
export default store
