import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { webGetAdminPageList } from "@/api/index"

//暴露接口
export interface IterAdminSystemListState {
  adminPageList: any,
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

  // 使用get修饰，代替了以前的getters
  get getAdminSystemPageList() {
    return this.adminPageList
  }

  // 用户列表
  @Action
  public async storeActionAdminPageList(item: object) {
    let res: any = await webGetAdminPageList(item)
    if (res.data.code === 200) {
      let data = res.data
      this.SET_MutationAdminPageList(data)
      // console.log(res);
      
    } else console.log(res);
    // commit('SET_MutationAdminPageList', data)
  }

  @Mutation
  private SET_MutationAdminPageList(item: any) {
    this.adminPageList = item;
    // sessionData('set', 'HasSessionToken', item);
  }

}
//暴露仓库
export const AdminSystemStore = getModule(AdminSystemList)