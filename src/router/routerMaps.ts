const getComponentSMin = (name: any) => () =>
  import(`@/views/${name}.vue`);

const getComponentMMin = (name: any, component: any) => () =>
  import(`@/views/${name }/${component}.vue`);

/**
 * meta 可配置参数
 * @param displayNavBar 是否需要底部导航
 * @param keepAlive 是否缓存页面
 * @param title 页面标题
 *
 * to.meta.index || from.meta.index || this.$router.isBack
 */
export const constantRouterMaps = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: getComponentMMin('login', 'index'),
    meta: { title: '登录_后台管理平台' }
  },
  {
    path: '/',
    component: resolve => require.ensure([], () => resolve(require('@/components/layout/Init')), 'Index'),
    meta: { title: '初始化组件_后台管理平台' },
    children: [
      {
        path: '/index',
        name: 'Index',
        component: getComponentSMin('index'),
        meta: { title: '绿色星球' }
      }
    ]
  },
];

/**
 *  需要添加 -动态挂载路由1
 *  -navRouters
 */
export const subMenuRouters = [
  // {
  //     path: '/403',
  //     component: resolve => require.ensure([], () => resolve(require('@/components/page/403')), 'error'),
  //     meta: { title: '403' }
  // },
  // {
  //     path: '*',
  //     component: resolve => require.ensure([], () => resolve(require('@/components/page/404')), 'error'),
  //     meta: { title: '404' }
  // }
];

/**
 *  需要比对 -本地路由比对后台路由2
 *  -dynamicRouter
 */
export const dynamicRouter = [
  // {
  //     path: '/user/info',
  //     name: 'userInfo',
  //     component: getComponentMAx('admin', 'userstree'),
  //     meta: { title: '树形控件' }
  // },
  // {
  //     path: '/user/property',
  //     name: 'userProperty',
  //     component: getComponentMAx('admin', 'usersrole'),
  //     meta: { title: '用户列表' }
  // }
];