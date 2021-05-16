import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminPageList, webGetAdminMenuTreeList, webGetAdminMenuRightList, webGetAdminMenuRoleList, webGetAdminPageSysJournalList, } from "@/api/index"

//暴露接口
export interface IterAdminSystemListState {
  adminPageList: any;
  adminMenuTreeList: any;
  adminMenuRightList: any;
  adminMenuRoleList: any;
  adminRoleChildrenMenuId: any;
}

export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

//这里配置仓库的一些基础配置
@Module({
  name: "adminSystemList",
  dynamic: true,
  store
})
export default class AdminSystemList extends VuexModule implements IterAdminSystemListState {
  // 这里是仓库所具有的一些属性
  adminPageList = <any>{};
  adminMenuTreeList = <any>{};
  adminMenuRightList = <any>{};
  adminMenuRoleList = <any>{};
  adminRoleChildrenMenuId = <any>{};

  // 使用get修饰，代替了以前的getters
  get getAdminSystemPageList() {
    return this.adminPageList
  }
  get getAdminSystemMenuTreeList() {
    return this.adminMenuTreeList
  }
  get getAdminSystemMenuRightList() {
    return this.adminMenuRightList
  }
  get getAdminSystemMenuRoleList() {
    return this.adminMenuRoleList
  }
  get getAdminRoleChildrenMenuId() {
    return this.adminRoleChildrenMenuId
  }
  

  @Action
  public async storeActionAdminPageList(item: object) {  // 管理员列表
    let res = await webGetAdminPageList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminPageList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }
  @Action
  public async storeActionAdminMenuTreeList(item: object) {  // 路由树列表
    let res = await webGetAdminMenuTreeList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminMenuTreeList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }
  @Action
  public async storeActionAdminMenuRightList(item: object) {  // 路由列表
    let res = await webGetAdminMenuRightList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminMenuRightList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }
  @Action
  public async webGetAdminMenuRoleList(item: object) {  // 角色列表
    let res = await webGetAdminMenuRoleList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminMenuRoleList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }
  @Action
  public async webGetAdminRoleChildrenMenuId(item: object) {  // 角色列表-勾选子路由ID
    this.SET_MutationAdminRoleChildrenMenuId(item)
    // commit('SET_MutationAdminPageList', data)
  }

  @Mutation
  private SET_MutationAdminPageList(item: any) {
    this.adminPageList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationAdminMenuTreeList(item: any) {
    this.adminMenuTreeList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationAdminMenuRightList(item: any) {
    this.adminMenuRightList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationAdminMenuRoleList(item: any) {
    this.adminMenuRoleList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationAdminRoleChildrenMenuId(item: any) {
    this.adminRoleChildrenMenuId = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  
}
//暴露仓库
export const AdminSystemStore = getModule(AdminSystemList)