import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import {  webGetAdminUserNoticeList, webGetAdminUserBannerList } from "@/api/index"

// 暴露接口
export interface ResponseData {
  code?: number;
  data?: any;
  message?: string;
}

export interface IterInformationListState {
  informationNoticeList: ResponseData;
  informationBannerList: ResponseData;
}

function returnSelf<T extends ResponseData>(sth: T): T {
  return sth
}

//这里配置仓库的一些基础配置
@Module({
  name: "informationList",
  dynamic: true,
  store
})
export default class InformationList extends VuexModule implements IterInformationListState {
  /** 断言类型（ts的另外一种断言是as 关键字）
   *  强制类型转换, 尖括号内是泛型(参数类型化),在文中是"断言类型"，<类型>值
   */
  public informationNoticeList: ResponseData = {};
  public informationBannerList: ResponseData = {};

  // 使用get修饰，代替了以前的getters
  get getInformationNoticeList() {
    return this.informationNoticeList
  }
  get getInformationBannerList() {
    return this.informationBannerList
  }
  
  @Action
  public async storeActionInformationNoticeList(item: object) {  // 公告列表
    let res = await webGetAdminUserNoticeList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationInformationNoticeList(data)
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }
  @Action
  public async storeActionInformationBannerList(item: object) {  // 轮播图列表
    let res = await webGetAdminUserBannerList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationInformationBannerList(data)
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }

  
  @Mutation
  private SET_MutationInformationNoticeList(item: ResponseData) {
    this.informationNoticeList = item;
  }
  @Mutation
  private SET_MutationInformationBannerList(item: ResponseData) {
    this.informationBannerList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
  
}
//暴露仓库
export const InformationStore = getModule(InformationList)