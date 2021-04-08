import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminContractList, webGetAdminContractTaskList, webGetAdminContractActivityList, webGetAdminContractActivityId, webGetAdminCouponList, webGetAdminPageUserOpenTaskList } from "@/api/index"

//暴露接口
export interface IterContractListState {
  contractList: any,
  contractTaskList: any,
  contractActivityList: any,
  contractActivityId: any,
  couponList: any,
  userOpenTaskList: any
}
//这里配置仓库的一些基础配置
@Module({
  name: "contractList",
  dynamic: true,
  store
})
export default class ContractList extends VuexModule implements IterContractListState {
  // 这里是仓库所具有的一些属性
  contractList = <any>{};
  contractTaskList = <any>{};
  contractActivityList = <any>{};
  contractActivityId = <any>{};
  userOpenTaskList = <any>{};

  couponList = <any>{};

  // 使用get修饰，代替了以前的getters
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
  get getUserOpenTaskList() {
    return this.userOpenTaskList
  }

  get getCouponList() {
    return this.couponList
  }
  
  // 列表
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

}
//暴露仓库
export const ContractListStore = getModule(ContractList)