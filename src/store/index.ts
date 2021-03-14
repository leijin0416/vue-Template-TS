import Vue from 'vue';
import Vuex from 'vuex';
import namespacedOther from './modules/index';  // @namespaced -导出

Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    namespacedOther
  }
});