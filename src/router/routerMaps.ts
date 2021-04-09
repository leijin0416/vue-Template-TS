import Layout from '@/layout/Init.vue';

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
    component: Layout,
    meta: { title: '首页' },
    children: [
      {
        path: '/index',
        name: 'welcome',
        component: () => import('@/views/index.vue'),
        meta: { title: '首页' }
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
    path: '/user/list',
    name: 'userList',
    component: getComponentMMin('User', 'userList'),
    meta: { title: '用户列表' }
  },
  {
    path: '/user/audit',
    name: 'userAudit',
    component: getComponentMMin('User', 'userAudit'),
    meta: { title: '用户审核列表' }
  },
  {
    path: '/assets/recharge',
    name: 'userAssetsRecharge',
    component: getComponentMMin('UserAssets', 'userRecharge'),
    meta: { title: '充币列表' }
  },
  {
    path: '/assets/carry',
    name: 'userAssetsCarry',
    component: getComponentMMin('UserAssets', 'userCarry'),
    meta: { title: '提币列表' }
  },
  {
    path: '/assets/turn',
    name: 'userAssetsTurn',
    component: getComponentMMin('UserAssets', 'userTurn'),
    meta: { title: '转账列表' }
  },
  {
    path: '/extension',
    name: 'extensionList',
    component: getComponentMMin('Extension', 'index'),
    meta: { title: '用户推广图列表' }
  },
  {
    path: '/system/route',
    name: 'systemRoute',
    component: getComponentMMin('System', 'route'),
    meta: { title: '路由配置' }
  },
  {
    path: '/system/user',
    name: 'systemUser',
    component: getComponentMMin('System', 'administrators'),
    meta: { title: '管理员列表' }
  }
];