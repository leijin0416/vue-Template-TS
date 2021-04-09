import Vue from 'vue';
import Vuex from 'vuex';
import { IterUserListState } from './private/PageUserList';    // 用户列表模块
import { IterContractListState } from './private/PageContractList';   // 合约模块
import { IterAdminSystemListState } from './private/AdminIstrators';  // 管理员模块
import { IterUserAssetsListState } from './private/PageUserAssets';       // 用户资产模块

Vue.use(Vuex);

// 接受about的接口，暴露它应有的属性
interface IterRootSate {
  userList: IterUserListState,
  contractList: IterContractListState,
  adminSystemList: IterAdminSystemListState,
  userAssets: IterUserAssetsListState
}

// 暴露所有接口，暴露所有接口的属性
export default new Vuex.Store<IterRootSate>({})