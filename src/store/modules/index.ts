/**
 *  @param `vuex-class`  
 *  @namespaced 为false的时候，state,mutations,actions 全局可以调用，为true，生成作用域，引用时要声明模块名称
 */
import { IndexState } from '@/types/views/index.interface';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

/**
 * @IndexState 校验
 */
const state: IndexState = {
  author: '三毛'
};

// 强制使用getter获取state
const getters: GetterTree<IndexState, any> = {
  author: (state: IndexState) => state.author
};

// 更新state
const mutations: MutationTree<IndexState> = {};

const actions: ActionTree<IndexState, any> = {};

/**
 *  namespaced
 */
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
