import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

// 参数一：module名称，开启命名空间后会以name为命名空间
// 参数二：是否使用动态加载，简而言之只有在用到当前的module才会加载，详细可以看vuex官网。本篇博客必须选择true，
//        这也是为什么index.ts一直不用修改的原因，如果设置为false会有很大的变动，如果您真的需要这么做，可以自己研究一下，
//        或者私信我。
// 参数三：是否开启命名空间，如果你的模块很多，强烈建议开启 是否私有化
// 参数四：挂载的store目标
@Module({ name: 'main', dynamic: true, namespaced: false, store })
export default class Main extends VuexModule {
  get getMessage() {
    return `当前时间${new Date()}：${this.message}`;
  }
  public name: string = '';
  public message: string = '未知';

  @Action
  public getUser(name: string) {
    if (name === 'admin') {
      this.SET_NAME('admin');
      this.SET_MESSAGE('测试成功');
    } else {
      this.SET_MESSAGE('测试失败');
    }
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name;
  }

  @Mutation
  private SET_MESSAGE(message: string) {
    this.message = message;
  }
}

export const UserModule = getModule(Main);