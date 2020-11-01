# TS + Element + VUE2

标签|内容
:-|:-:
[vuex-class 如何使用](https://blog.csdn.net/qq_33447462/article/details/85251527) +++ [1\ 模板 06/19](https://github.com/livelyPeng/vue-cli3-tpl) | [1\ 模板 06/22](https://github.com/Jack-Star-T/Vue3.0-typescript/tree/master/src)
[vscode 的注释](https://segmentfault.com/q/1010000013367208) +++ [TS 规范](https://juejin.im/post/5c173a84f265da610e7ffe44#heading-6)  | [Vue2.x对比Composition API写法](https://juejin.im/post/5e9d81b851882573866ba89c)
 | ——
[【VUEX私有】vuex-module-decorators](https://blog.csdn.net/SkelleBest/article/details/102971817) | [git 上案例](https://github.com/chengxintuan/vue-typescript-project/blob/master/src/page/todo/todo.ts)
[【1.0】vue-property-decorator 简单用法 -详细](https://blog.csdn.net/sllailcp/article/details/102542796/) +++ [【1.1】git form校验案例](https://github.com/slailcp/vue-cli3/blob/master/src/pc-project/views/login/index.vue) | ——
[【2.0】Git -前端内参](https://github.com/coffe1891/frontend-hard-mode-interview) +++ [【2.1】Git -tower1229 -Tree树形](https://github.com/tower1229) | ——

---

## Vuex 私有化

```js
// 默认
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

## @Emit(event?: string)

```js
// 子组件
// <button @click="addToCount(person)"> 点击emit </button>
@Emit()                       // 如果此处不设置别名字,则默认使用下面的函数命名
addToCount(p: Person) {       // 此处命名如果有大写字母则需要用横线隔开  @add-to-count
  return this.person;         // 此处不return,则会默认使用括号里的参数p;
}

// 父组件  -接收
// <EmitComponent sex='女' @add-to-count="returnPersons" @delemit="delemit"></EmitComponent>
returnPersons(data: any) {
    this.emitData = data;
}
```

## @Prop()

属性的 ts类型 后面需要加上undefined类型；或者在属性名后面加上!，表示非null 和 非undefined 的断言，否则编译器会给出错误提示；

```js

```

---

## vue2.5后增加了对ts的支持

- `vue-class-component：` 强化 Vue 组件，使用 TypeScript/装饰器 增强 Vue 组件；
- `vue-property-decorator：` 在 vue-class-component 上增强更多的结合 Vue 特性的装饰器；`@Watch`、`@Prop`等

---

## 从新建项目到设置打包环境

```html
1. vue create vue-cli3-template
2. 新建 vue.config.js 文件，设置baseUrl: './';更多配置请[点击链接](https://cli.vuejs.org/zh/guide/)
3. 新建各个环境的文件，例如：.env.development .env.test .env.production
4. 在 package.json 中设置打包命令，例如：build:development build:test build:production，在执行命令的语句中设置 mode 环境，例如：--mode test
```

## 关于环境变量的注意事项

- 环境名应该与环境文件统一
- 环境文件放置根目录下
- 关于打包配置路径,请修改vue.config.js文件下的输出地址
- 除了 `baseUrl` 和 `NODE_ENV` 其他环境变量使用 VUE_APP 开头
- 另外还设定本地运行环境`local`,你可以在项目拉取下来后补充 `.env.development.local` 文件,并添加如下信息并替换你自己所在服务器的域名及端口;
例如 :
    NODE_ENV='development'
    VUE_APP_URL='http://localhost:8080'  

## vue 文件中 TS 上下文顺序

```html
- data
- @Prop
- @State
- @Getter
- @Action
- @Mutation
- @Watch
- 生命周期钩子
    - beforeCreate（按照生命周期钩子从上到下）
    - created
    - beforeMount
    - mounted
    - beforeUpdate
    - updated
    - activated
    - deactivated
    - beforeDestroy
    - destroyed
    - errorCaptured（最后一个生命周期钩子）
- 路由钩子
    - beforeRouteEnter
    - beforeRouteUpdate
    - beforeRouteLeave
- computed
- methods
- 组件引用，mixins，filters 等放在 @Component 里面
```

## 工程目录结构

```bash
src：项目源码。开发的时候代码写在这里。
 |--api # 服务层ajax请求服务
 |    |--index # api数据入口文件
 |--assets # 项目静态资源
 |--axios # axios封装请求//拦截配置
 |    |--config.ts # axios拦截器配置文件
 |    |--service,ts # axios请求配置文件
 |--components # 项目公共组件库
 |--router # 项目路由
 |    |--index.ts # 入口及路由初始化
 |    |--filterRouter # 页面路由文件
 |--store # 基于Vuex的状态管理模块
 |    |--index.ts # 入口及store初始化
 |    |--modules # 子模块的store对象
 |--utils # 公共库函数
 |--views # 项目应用页面，根据应用需要，还可以有子页面，各子页面目录结构和顶级子页面类似
 |--App.vue # 项目根视图
 |--main.ts # 项目入口文件

 ```

## 使用

### 使用命令行

```html
git clone git@github.com:luchx/ECHI_VUE_CLI3.0.git
$ cd ECHI_VUE_CLI3.0
$ yarn install
$ yarn run serve         # 访问 http://localhost:8080
$ yarn run build         # Compiles and minifies for production
$ yarn run lint          # Lints and fixes files
$ yarn run test:unit     # Run your unit tests
```

## 支持环境

现代浏览器及 IE11。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions
