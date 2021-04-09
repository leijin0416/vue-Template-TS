import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminAssetsCarryList, } from "@/api/index"

export interface IterUserAssetsListState {
  assetsCarryList: any,
}
@Module({
  name: "userAssets",
  dynamic: true,
  store
})
export default class UserAssets extends VuexModule implements IterUserAssetsListState {
  assetsCarryList = <any>{};

  get getAssetsCarryList() {
    return this.assetsCarryList
  }
  
  @Action
  public async storeActionPageAssetsCarryList(item: object) {  // 用户提币列表
    let res: any = await webGetAdminAssetsCarryList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationPageAssetsCarryList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationPageUserList', data)
  }

  @Mutation
  private SET_MutationPageAssetsCarryList(item: any) {
    this.assetsCarryList = item;
    // sessionData('set', 'HasSessionToken', item);
  }
}

export const UserAssetsListStore = getModule(UserAssets)