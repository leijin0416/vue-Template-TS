const getComponentSMin = (name: any) => () =>
  import(`@/views/${name}.vue`);

const getComponentMMin = (name: any, component: any) => () =>
  import(`@/views/${name}/${component}.vue`);

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
    path: '/login',
    name: 'Login',
    component: getComponentMMin('login', 'index'),
    meta: { title: '登录_后台管理平台' }
  },
];

/**
 *  需要添加 -动态挂载路由1
 *  -navRouters
 */
export const subMenuRouters: any = [
  {
    path: '/',
    name: 'Index',
    redirect: '/index',
    component: (resolve) => require(['@/layout/Init'], resolve),
    meta: { title: '管理模块' },
    children: [
      {
        path: '/index',
        name: 'welcome',
        component: () => import('@/views/index.vue'),
        meta: { title: '管理模块' }
      },
    ]
  },
  { path: '/404', name: '404', component: () => import('@/views/404.vue'), meta: { title: '404' } },
  { path: '*', redirect: '/404' },
];

/**
 *  需要比对 -本地路由比对后台路由2
 *  -dynamicRouter
 */
export const dynamicRouter: any = [
  {
    path: '/user/info',
    name: 'userInfo',
    component: getComponentMMin('system', 'centre'),
    meta: { title: '树形控件' }
  },
  {
    path: '/user/property',
    name: 'userProperty',
    component: getComponentMMin('system', 'jurisdiction'),
    meta: { title: '用户列表' }
  }
];