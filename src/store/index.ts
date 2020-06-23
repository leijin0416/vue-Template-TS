import Vue from 'vue';
import Vuex from 'vuex';

/**
 * @indexVUEX 导出
 */
import indexVUEX from './modules/index';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        indexVUEX
    }
});