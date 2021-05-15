import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { 
  webGetAdminContractList, 
  webGetAdminContractTaskList, 
  webGetAdminContractActivityList, 
  webGetAdminContractActivityId, 
  webGetAdminCouponList, 
  webGetAdminPageUserOpenTaskList, 
  webGetAdminContractOpenTask, 
  webGetAdminPageContractStatisticsList, 
  webGetAdminPageContractStatisticsUserList,
  webGetAdminPageUserContractTaskList
} from "@/api/index"

export interface IterContractListState {
  contractList: any;
  contractTaskList: any;
  contractActivityList: any;
  contractActivityId: any,
  couponList: any;
  userOpenTaskList: any;
  contractOpenTask: any;
  contractStatisticsList: any;
  contractStatisticsUserList: any,
  userContractTaskList: any
}
@Module({
  name: "contractList",
  dynamic: true,
  store
})
export default class ContractList extends VuexModule implements IterContractListState {
  contractList = <any>{};
  contractTaskList = <any>{};
  contractActivityList = <any>{};
  contractActivityId = <any>{};
  contractOpenTask = <any>{};

  contractStatisticsList = <any>{};
  contractStatisticsUserList = <any>{};

  userOpenTaskList = <any>{};
  couponList = <any>{};

  userContractTaskList = <any>{};

  get getContractList() {
    return this.contractList
  }
  get getContractTaskList() {
    return this.contractTaskList
  }
  get getContractActivityList() {
    return this.contractActivityList
  }
  get getContractActivityId() {
    return this.contractActivityId
  }
  get getContractOpenTask() {
    return this.contractOpenTask
  }

  get getUserOpenTaskList() {
    return this.userOpenTaskList
  }
  get getCouponList() {
    return this.couponList
  }

  get getCouponStatisticsList() {
    return this.contractStatisticsList
  }
  get getCouponStatisticsUserList() {
    return this.contractStatisticsUserList
  }
  
  get getUserContractTaskList() {
    return this.userContractTaskList
  }
  
  @Action
  public async storeActionContractList(item: object) {
    let res: any = await webGetAdminContractList(item)  // 合约列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationContractList', data)
  }
  @Action
  public async storeActionContractTaskList(item: object) {
    let res: any = await webGetAdminContractTaskList(item)  // 合约任务
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractTaskList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationContractList', data)
  }
  @Action
  public async storeActionContractActivityList(item: object) {
    let res: any = await webGetAdminContractActivityList(item) // 折扣活动
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractActivityList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionContractActivityId(item: object) {
    let res: any = await webGetAdminContractActivityId(item)  // 折扣活动ID列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractActivityId(data)
      
    } else console.log(res);
  }
  @Action
  public async storeActionUserOpenTaskList(item: object) {
    let res: any = await webGetAdminPageUserOpenTaskList(item)  // 用户- 合约任务列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationUserOpenTaskList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionContractOpenTask(item: object) {
    let res: any = await webGetAdminContractOpenTask(item)  // 开启合约任务列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractOpenTask(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Action
  public async storeActionContractStatisticsList(item: object) {
    let res: any = await webGetAdminPageContractStatisticsList(item)  // 合约任务统计列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractStatisticsList(data)
      // console.log(res);
      
    } else console.log(res);
  }
  @Action
  public async storeActionContractStatisticsUserList(item: object) {
    let res: any = await webGetAdminPageContractStatisticsUserList(item)  // 任务统计列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationContractStatisticsUserList(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Action
  public async storeActionUserContractTaskList(item: object) {
    let res: any = await webGetAdminPageUserContractTaskList(item)  // 用户任务统计列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationUserContractTaskList(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Action
  public async storeActionCouponList(item: object) {
    let res: any = await webGetAdminCouponList(item)  // 优惠券列表
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationCouponList(data)
      // console.log(res);
      
    } else console.log(res);
  }

  @Mutation
  private SET_MutationContractList(item: any) {
    this.contractList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_MutationContractTaskList(item: any) {
    this.contractTaskList = item;
  }
  @Mutation
  private SET_MutationContractActivityList(item: any) {
    this.contractActivityList = item;
  }
  @Mutation
  private SET_MutationContractActivityId(item: any) {
    this.contractActivityId = item;
  }
  @Mutation
  private SET_MutationUserOpenTaskList(item: any) {
    this.userOpenTaskList = item;
  }

  @Mutation
  private SET_MutationCouponList(item: any) {
    this.couponList = item;
  }
  @Mutation
  private SET_MutationContractOpenTask(item: any) {
    this.contractOpenTask = item;
  }
  @Mutation
  private SET_MutationContractStatisticsList(item: any) {
    this.contractStatisticsList = item;
  }
  @Mutation
  private SET_MutationContractStatisticsUserList(item: any) {
    this.contractStatisticsUserList = item;
  }
  
  @Mutation
  private SET_MutationUserContractTaskList(item: any) {
    this.userContractTaskList = item;
  }

}

export const ContractListStore = getModule(ContractList)