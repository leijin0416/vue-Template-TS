# TS + Element + VUE2.0

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
- 另外还设定本地运行环境`local`,可以在项目拉取下来后补充 `.env.development.local` 文件,并添加如下信息并替换你自己所在服务器的域名及端口;
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
