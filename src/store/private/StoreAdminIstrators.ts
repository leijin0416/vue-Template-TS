import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { 
  webGetAdminPageList, 
  webGetAdminMenuTreeList, 
  webGetAdminMenuRightList, 
  webGetAdminMenuRoleList, 
  webGetAdminPageSysJournalList, 
  webGetAdminEditionList
} from "@/api/index"

// 暴露接口
export interface IterAdminSystemListState {
  adminPageList: any;
  adminMenuTreeList: any;
  adminMenuRightList: any;
  adminMenuRoleList: any;
  adminRoleChildrenMenuId: any;
  adminSysJournalList: object;
  adminSysEditionList: object
}

export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

@Module({
  name: "adminSystemList",
  dynamic: true,
  store
})
export default class AdminSystemList extends VuexModule implements IterAdminSystemListState {
  adminPageList = <any>{};
  adminMenuTreeList = <any>{};
  adminMenuRightList = <any>{};
  adminMenuRoleList = <any>{};
  adminRoleChildrenMenuId = <any>{};
  adminSysJournalList = <ResponseData>{};
  adminSysEditionList = <ResponseData>{};

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
  
  get getAdminSysJournalList() {
    return this.adminSysJournalList
  }
  get getAdminSysEditionList() {
    return this.adminSysEditionList
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
  }
  @Action
  public async storeActionAdminMenuRightList(item: object) {  // 路由列表
    let res = await webGetAdminMenuRightList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminMenuRightList(data)
      // console.log(res);
      
    } else console.log(res);
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
  }
  
  @Action
  public async storeActionAdminSysJournalList(item: object) {  // 系统日志列表
    let res = await webGetAdminPageSysJournalList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminSysJournalList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }
  @Action
  public async storeActionAdminSysEditionList(item: object) {  // 版本升级列表
    let res = await webGetAdminEditionList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminSysEditionList(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Mutation
  private SET_MutationAdminPageList(item: any) {
    this.adminPageList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationAdminMenuTreeList(item: any) {
    this.adminMenuTreeList = item;
  }
  @Mutation
  private SET_MutationAdminMenuRightList(item: any) {
    this.adminMenuRightList = item;
  }
  @Mutation
  private SET_MutationAdminMenuRoleList(item: any) {
    this.adminMenuRoleList = item;
  }
  @Mutation
  private SET_MutationAdminRoleChildrenMenuId(item: any) {
    this.adminRoleChildrenMenuId = item;
  }

  @Mutation
  private SET_MutationAdminSysJournalList(item: ResponseData) {
    this.adminSysJournalList = item;
  }
  @Mutation
  private SET_MutationAdminSysEditionList(item: ResponseData) {
    this.adminSysEditionList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  
}
//暴露仓库
export const AdminSystemStore = getModule(AdminSystemList)