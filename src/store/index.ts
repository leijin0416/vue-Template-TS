import Vue from 'vue';
import Vuex from 'vuex';
import { IterAdminSystemListState } from './private/StoreAdminIstrators';   // 管理员模块
import { IterInformationListState } from './private/StoreNoticeBanner';     // 资讯管理

import { IterUserListState } from './common/StorePageUsersList';            // 用户列表模块

Vue.use(Vuex)

// 暴露属性
interface IterRootState {
  adminSystemList: IterAdminSystemListState;
  informationList: IterInformationListState;
  userList: IterUserListState;
}

// 暴露所有接口，暴露所有接口的属性
export default new Vuex.Store<IterRootState>({})