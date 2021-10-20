import Layout from '@/layout/Init.vue';

const getComponentSMin = (name: any) => () =>
  import(`@/views/${name}.vue`)

/** 
 * @description: 动态路由懒加载
 * @return {*}
 */
const getComponentMMin = (name: any, component: any) => {
  return (resolve: any) => require([`@/views/${name}/${component}.vue`], resolve)
}

/**
 * @description: meta 可配置参数
 * @param {*} displayNavBar 是否需要底部导航
 * @param {*} keepAlive 是否缓存页面
 * @param {*} title 页面标题
 * @return {*}
 * to.meta.index || from.meta.index || this.$router.isBack
 */
export const constantRouterMaps = [
  {
    path: '/login',
    name: 'Login',
    component: getComponentMMin('login', 'index'),
    meta: { title: '登录_后台管理平台' }
  },
]

/**
 * @description: 动态挂载路由 1
 * @return {*}
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
]

/**
 * @description: 本地路由比对后台路由 2
 * @return {*}
 */
export const dynamicRouter: any = [
  {
    path: '/system/route',
    name: 'RouteAdd',
    component: getComponentMMin('System', 'routeAdd'),
    meta: { title: '路由配置列表', permission: [] }
  },
  {
    path: '/system/role',
    name: 'UserRoleList',
    component: getComponentMMin('System', 'userRoleList'),
    meta: { title: '用户角色列表', permission: [] }
  },
  {
    path: '/system/user',
    name: 'UserPowerList',
    component: getComponentMMin('System', 'userPowerList'),
    meta: { title: '管理员列表', permission: [] }
  },
  {
    path: '/system/journal',
    name: 'systemJournalsList',
    component: getComponentMMin('Setup', 'journalsList'),
    meta: { title: '系统日志列表', permission: [] }
  },
  {
    path: '/system/edition',
    name: 'systemEditionList',
    component: getComponentMMin('Setup', 'editionList'),
    meta: { title: 'APP版本列表', permission: [] }
  },
  {
    path: '/information/notice',
    name: 'informationsNoticeList',
    component: getComponentMMin('NoticeBanner', 'noticeList'),
    meta: { title: '公告列表', permission: [] }
  },
  {
    path: '/information/banner',
    name: 'informationsBannerList',
    component: getComponentMMin('NoticeBanner', 'bannerList'),
    meta: { title: '轮播图列表', permission: [] }
  },
  {
    path: '/user/list',
    name: 'userList',
    component: getComponentMMin('User', 'userList'),
    meta: { title: '用户列表', permission: [] }
  },
]