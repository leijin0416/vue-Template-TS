# VUEX 私有化

在 vuex 中是要通过 commit 来更改 state中的数据.在 vuex-module-decorators 中有 MutationAction 修饰器，可以直接修改 state 数据。

标签|内容
:-|:-:
参数一：name | module名称，开启命名空间后会以name为命名空间
参数二：dynamic | 是否使用动态加载，简而言之只有在用到当前的module才会加载，详细可以看vuex官网。默认选择true，这也是为什么 index.ts 一直不用修改的原因，如果设置为false会有很大的变动
参数三：namespaced | 是否开启命名空间，如果你的模块很多，强烈建议开启 是否私有化
参数四：store | 挂载的store目标
| ——
[私有化介绍](https://www.jianshu.com/p/82e3f82c48f5)|

```js
// user.ts
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

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
  };

  @Mutation
  private SET_NAME(name: string) {
    this.name = name;
  };

  @Mutation
  private SET_MESSAGE(message: string) {
    this.message = message;
  };
}
export const UserModule = getModule(Main);

// 页面模块调用
import { UserStore } from '@/store/private/user';
{
  // 计算属性
  get pageStates(): any {
    let state = UserStore.MenuItemId;
    return state;
  }

  @Watch("pageStates", { deep: true, })
  private getShowStatus(newVal, oldVal) {
    let _that = this;
    if (newVal !== '') {
    }
    console.log(`【监听】TAG路由INDEX：${newVal}`);
  }

  // 跳转路由
  onTagsClick(item) {
    let _that = this;
    UserStore.getUser(item.index);
  }
}
```

**方式二：**

```js
/**
 * @indexVUEX 导出
 */
import indexVUEX from './modules/index';
Vuex.Store({
  modules: {
    indexVUEX
  }
})

---

// getModule: 创建类型安全的访问，index.ts
import { IndexState } from '@/types/views/index.interface';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

/**
 * @IndexState 校验
 */
const state: IndexState = {
  author: '三毛'
};
// 强制使用getter获取state
const getters: GetterTree<IndexState, any> = {
  author: (state: IndexState) => state.author
};
// 更新state
const mutations: MutationTree<IndexState> = {
  // 更新state都用该方法
};
const actions: ActionTree<IndexState, any> = {};
/**
 *  @param `vuex-class`
 *  namespaced为false的时候，
 *  state,mutations,actions 全局可以调用，为true，生成作用域，引用时要声明模块名称
 */
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

---

// vue中调用
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace,
} from 'vuex-class';
const someModule = namespace('indexVUEX'); // 私有名称
{
  @someModule.State(state => state.author) author:any // 取值
}
```

---

## @Emit(event?: string)

```js
// 【子】组件
// <button @click="addToCount(person)"> 点击emit </button>
@Emit()                       // 如果此处不设置别名字,则默认使用下面的函数命名
addToCount(p: Person) {       // 此处命名如果有大写字母则需要用横线隔开  @add-to-count
  return this.person;         // 此处不return,则会默认使用括号里的参数p;
}

// 【父】组件  -接收
// <EmitComponent sex='女' @add-to-count="returnPersons" @delemit="delemit"></EmitComponent>
returnPersons(data: any) {
  this.emitData = data;
}

// this.$emit("tags", this.tagsList);
```

---

## @Prop()

属性的 ts类型 后面需要加上undefined类型；或者在属性名后面加上!，表示非null 和 非undefined 的断言，否则编译器会给出错误提示；

```js

@Component({
  props: {
    defaultActiveKey: {
      type: String,
      default: ''
    }
  }
})
export default class Login extends Vue{
  defaultActiveKey: string
}

// 父
<login
  :default-active-key="type"
  @tab-change="onTabChange"
  @submit="handleSubmit" >
```

---

## 路由： query / params

- 标签跳转: `<router-link :to="{name:'c', query:{id: 1}}">第四个</router-link>`

```js
{
  this.$router.push({
    path: `/user`,
    params:{
      id: id
    }
  })
}
```
