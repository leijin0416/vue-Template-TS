import Layout from '@/layout/Init.vue'

/**
 * @description: 动态路由加载
 * @param {string} name  文件夹名
 * @param {string} content  文件名
 * @return {*}  const getComponentMMin = (name: any, component: any) => () => import(`@/views/${name}/${component}.vue`);
 * 
 * require()  -ts引入
 */
const getComponentMMin = (name: string, content: string) => {
  return (resolve: any) => require([`@/views/${name}/${content}.vue`], resolve)
}


/**
 * @description:   meta 可配置参数
 * @param displayNavBar 是否需要底部导航
 * @param keepAlive     是否缓存页面
 * @param title         页面标题
 * @return {*}
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
]


/**
 *  @description:  需要添加 -动态挂载路由1
 *  @param component    -权限模板，集合
 *  @return {*}
 * 
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
]

/**
 *  @description:  需要比对 -本地路由比对后台路由2
 *  @param permission    -权限按钮
 *  @return {*}
 * 
 *  -dynamicRouter
 */
export const dynamicRouter = [
  {
    path: '/user/list',
    name: 'userList',
    component: getComponentMMin('User', 'userList'),
    meta: { title: '用户列表', permission: [] }
  },
  {
    path: '/user/audit',
    name: 'userAudit',
    component: getComponentMMin('User', 'userAudit'),
    meta: { title: '用户审核列表', permission: [] }
  },
  {
    path: '/system/route',
    name: 'systemRoute',
    component: getComponentMMin('System', 'route'),
    meta: { title: '路由配置列表', permission: [] }
  },
  {
    path: '/system/role',
    name: 'systemList',
    component: getComponentMMin('System', 'roleList'),
    meta: { title: '用户角色列表', permission: [] }
  },
  {
    path: '/system/user',
    name: 'administratorList',
    component: getComponentMMin('System', 'administratorList'),
    meta: { title: '管理员列表', permission: [] }
  },
  {
    path: '/information/notice',
    name: 'informationsNoticeList',
    component: getComponentMMin('Informations', 'noticeList'),
    meta: { title: '公告列表', permission: [] }
  },
  {
    path: '/information/banner',
    name: 'informationsBannerList',
    component: getComponentMMin('Informations', 'bannerList'),
    meta: { title: '轮播图列表', permission: [] }
  },
]