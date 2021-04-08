import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import { constantRouterMaps } from './routerMaps';
import { sessionData } from '@/filters/storage';

import 'nprogress/nprogress.css';

Vue.use(Router);

const createRouter = () => new Router({
  routes: constantRouterMaps,
  mode: 'history',  // hash
});

const router: any = createRouter();

// 清除路由
export function resetRouter() {
  const newRouter: any = createRouter();
  router.matcher = newRouter.matcher;
}

// 登陆页面路由 name
const LOGIN_PAGE_NAME = 'Login';

// 跳转之前
router.beforeEach((to: any, from, next) => {
  document.title = to.meta.title;    // 改变每次页面的标题
  const token = sessionData('get', 'HasSessionToken', '');
  // console.log(to);
  // console.log(from);
  // console.log(token);
  
  if (to.path !== from.path) NProgress.start();  // 进度条
  if (token !== null) next();
  else {
    // 未登陆且要跳转的页面是登录页
    if (to.name === LOGIN_PAGE_NAME) next();
    else {
      // 未登录且要跳转的页面不是登录页，则跳转到登录页
      next({
        name: LOGIN_PAGE_NAME
      });
    }
  }
});


// 跳转之后
router.afterEach(to => {
  NProgress.done();
});

export default router;