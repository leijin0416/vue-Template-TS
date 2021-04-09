import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminPageUserList, webGetAdminPageUserLevelList, webGetAdminPageUserAuditList } from "@/api/index"

export interface IterUserListState {
  userPageList: any,
  userPageRowInfo: any,
  userPageLevelList: any,
  userPageAuditList: any
}
@Module({
  name: "userList",
  dynamic: true,
  store
})
export default class UserList extends VuexModule implements IterUserListState {
  userPageList = <any>{};
  userPageRowInfo = <any>{};
  userPageLevelList = <any>{};
  userPageAuditList = <any>{};

  get getUserPageList() {
    return this.userPageList
  }
  get getUserRowInfo() {
    return this.userPageRowInfo
  }
  get getUserLevelList() {
    return this.userPageLevelList
  }
  get getUserAuditList() {
    return this.userPageAuditList
  }

  
  @Action
  public async storeActionPageUserList(item: object) {  // 用户注册列表
    let res: any = await webGetAdminPageUserList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationPageUserList', data)
  }
  @Action
  public async storeActionPageUserRowInfo(item: object) {  // 用户注册表格 -详情
    this.SET_MutationPageUserRowInfo(item)
  }
  @Action
  public async storeActionPageUserLevelList(item: object) {  // 用户等级列表
    let res: any = await webGetAdminPageUserLevelList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserLevelList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionPageUserAuditList(item: object) {  // 用户审核列表
    let res: any = await webGetAdminPageUserAuditList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserAuditList(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Mutation
  private SET_MutationPageUserList(item: any) {
    this.userPageList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationPageUserRowInfo(item: any) {
    this.userPageRowInfo = item;
  }
  @Mutation
  private SET_MutationPageUserLevelList(item: any) {
    this.userPageLevelList = item;
  }
  @Mutation
  private SET_MutationPageUserAuditList(item: any) {
    this.userPageAuditList = item;
  }

}

export const UserListStore = getModule(UserList)