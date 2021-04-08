import Vue from 'vue';
import Vuex from 'vuex';
import { IterUserListState } from './private/PageUserList';  // @namespaced -导出
import { IterContractListState } from './private/PageContractList';
import { IterAdminSystemListState } from './private/AdminIstrators';

Vue.use(Vuex);

// 接受about的接口，暴露它应有的属性
interface IterRootSate {
  userList: IterUserListState,
  contractList: IterContractListState,
  adminSystemList: IterAdminSystemListState
}

// 暴露所有接口，暴露所有接口的属性
export default new Vuex.Store<IterRootSate>({})