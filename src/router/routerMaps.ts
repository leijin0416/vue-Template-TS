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
    path: '/user/grade',
    name: 'userGrade',
    component: getComponentMMin('User', 'userGrade'),
    meta: { title: '等级列表' }
  },
  {
    path: '/contract/list',
    name: 'contractList',
    component: getComponentMMin('Contract', 'contractList'),
    meta: { title: '合约列表' }
  },
  {
    path: '/contract/tack',
    name: 'contractTackList',
    component: getComponentMMin('Contract', 'contractTackList'),
    meta: { title: '合约任务列表' }
  },
  {
    path: '/contract/activity',
    name: 'contractActivity',
    component: getComponentMMin('Contract', 'activityList'),
    meta: { title: '合约限时折扣列表' }
  },
  {
    path: '/coupon/list',
    name: 'contractCoupon',
    component: getComponentMMin('Coupon', 'couponList'),
    meta: { title: '优惠券列表' }
  },
  {
    path: '/extension',
    name: 'Extension',
    component: getComponentMMin('Extension', 'index'),
    meta: { title: '用户推广图' }
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