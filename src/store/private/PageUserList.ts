import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminPageUserList, webGetAdminPageUserLevelList, webGetAdminPageUserAuditList, webGetAdminPageUserBehaviorList, webGetAdminUserOrganisationChartList, webGetAdminUserBusinessList, webGetAdminUserBusinessOrderCheckList, webGetAdminUserBusinessRecordsList, webGetAdminUserBusinessAuditList, webGetAdminUserBusinessSubordinateList, webGetAdminUserBusinessCommissionRecordList } from "@/api/index"

export interface IterUserListState {
  userPageList: any;
  userPageRowInfo: any;
  userPageLevelList: any;
  userPageAuditList: any;
  userPageBehaviorList: object;
  userPageOrganisationChartList: any;
  userPageBusinessList: any;
  userPageBusinessOrderCheckList: any;
  userBusinessRecordsAuditList: any;
  userBusinessSubordinateList: any;
  userBusinessCommissionRecordList: any
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
  userPageBehaviorList = <any>{};
  userPageOrganisationChartList = <any>{};
  // 商家
  userPageBusinessList = <any>{};
  userPageBusinessOrderCheckList = <any>{};
  userPageBusinessRecordsList = <any>{};
  userBusinessRecordsAuditList = <any>{};
  userBusinessSubordinateList = <any>{};
  userBusinessCommissionRecordList = <any>{};

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

  // 商家
  get getUserBusinessList() {
    return this.userPageBusinessList
  }
  get getUserBusinessOrderCheckList() {
    return this.userPageBusinessOrderCheckList
  }
  get getUserBusinessRecordsList() {
    return this.userPageBusinessRecordsList
  }
  get getUserBusinessAuditList() {
    return this.userBusinessRecordsAuditList
  }
  get getUserBusinessSubordinateList() {
    return this.userBusinessSubordinateList
  }
  get getUserBusinessCommissionRecordList() {
    return this.userBusinessCommissionRecordList
  }
  
  get getUserBehaviorList() {
    return this.userPageBehaviorList
  }
  get getUserOrganisationChartList() {
    return this.userPageOrganisationChartList
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

  @Action
  public async webGetAdminUserBusinessList(item: object) {  // 商家列表
    let res = await webGetAdminUserBusinessList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserBusinessList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionUserBusinessOrderCheckList(item: object) {  // 商家审核列表
    let res = await webGetAdminUserBusinessOrderCheckList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserBusinessOrderCheckList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionUserBusinessRecordsList(item: object) {  // 商家流水记录列表
    let res = await webGetAdminUserBusinessRecordsList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserBusinessRecordsList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionUserBusinessAuditList(item: object) {  // 商家认证审核列表
    let res = await webGetAdminUserBusinessAuditList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationUserBusinessAuditList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionUserBusinessSubordinateList(item: object) {  // 商家推广图列表
    let res = await webGetAdminUserBusinessSubordinateList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationUserBusinessSubordinateList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionUserBusinessCommissionRecordList(item: object) {  // 商家佣金记录列表
    let res = await webGetAdminUserBusinessCommissionRecordList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationUserBusinessCommissionRecordList(data)
      // console.log(res);
      
    } else console.log(res);
  }


  @Action
  public async storeActionPageUserBehaviorList(item: object) {  // 用户限制行为列表
    let res = await webGetAdminPageUserBehaviorList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserBehaviorList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async webGetAdminUserOrganisationChartList(item: object) {  // 推广图列表
    let res = await webGetAdminUserOrganisationChartList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageUserOrganisationChartList(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Mutation
  private SET_MutationPageUserList(item: object) {
    this.userPageList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationPageUserRowInfo(item: object) {
    this.userPageRowInfo = item;
  }
  @Mutation
  private SET_MutationPageUserLevelList(item: object) {
    this.userPageLevelList = item;
  }
  @Mutation
  private SET_MutationPageUserAuditList(item: object) {
    this.userPageAuditList = item;
  }

  @Mutation
  private SET_MutationPageUserBusinessList(item: object) {
    this.userPageBusinessList = item;
  }
  @Mutation
  private SET_MutationPageUserBusinessOrderCheckList(item: object) {
    this.userPageBusinessOrderCheckList = item;
  }
  @Mutation
  private SET_MutationPageUserBusinessRecordsList(item: object) {
    this.userPageBusinessRecordsList = item;
  }
  @Mutation
  private SET_MutationUserBusinessAuditList(item: object) {
    this.userBusinessRecordsAuditList = item;
  }
  @Mutation
  private SET_MutationUserBusinessSubordinateList(item: object) {
    this.userBusinessSubordinateList = item;
  }
  @Mutation
  private SET_MutationUserBusinessCommissionRecordList(item: object) {
    this.userBusinessCommissionRecordList = item;
  }

  
  @Mutation
  private SET_MutationPageUserBehaviorList(item: object) {
    this.userPageBehaviorList = item;
  }
  @Mutation
  private SET_MutationPageUserOrganisationChartList(item: object) {
    this.userPageOrganisationChartList = item;
  }

}

export const UserListStore = getModule(UserList)