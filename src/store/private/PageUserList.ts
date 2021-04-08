import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminPageUserList, webGetAdminPageUserLevelList } from "@/api/index"

//暴露接口
export interface IterUserListState {
  userPageList: any,
  userPageRowInfo: any,
  userPageLevelList: any
}
//这里配置仓库的一些基础配置
@Module({
  name: "userList",
  dynamic: true,
  store
})
export default class UserList extends VuexModule implements IterUserListState {
  // 这里是仓库所具有的一些属性
  userPageList = <any>{};
  userPageRowInfo = <any>{};
  userPageLevelList = <any>{};

  // 使用get修饰，代替了以前的getters
  get getUserPageList() {
    return this.userPageList
  }
  get getUserRowInfo() {
    return this.userPageRowInfo
  }
  get getUserLevelList() {
    return this.userPageLevelList
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
  public async storeActionPageUserRowInfo(item: object) {  // 表格 -用户详情
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

}
//暴露仓库
export const UserListStore = getModule(UserList)