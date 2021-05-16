import Vue from 'vue';
import Vuex from 'vuex';
import { IterUserListState } from './private/PageUserList';                  // 用户列表模块
import { IterAdminSystemListState } from './private/AdminIstrators';         // 管理员模块
import { IterInformationListState } from './private/PageInformation';       // 资讯管理

Vue.use(Vuex);

// 接受about的接口，暴露它应有的属性
interface IterRootSate {
  userList: IterUserListState;
  adminSystemList: IterAdminSystemListState;
  informationList: IterInformationListState;
}

// 暴露所有接口，暴露所有接口的属性
export default new Vuex.Store<IterRootSate>({})