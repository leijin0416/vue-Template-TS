import Vue from 'vue';
import Router from 'vue-router';
import { constantRouterMaps } from './routerMaps';
import { sessionData } from '@/filters/storage';

Vue.use(Router);
const router = new Router({
  routes: constantRouterMaps,
  mode: 'history',
});

// 登陆页面路由 name
const LOGIN_PAGE_NAME = 'Login';

// 跳转之前
router.beforeEach((to: any, from, next) => {
  document.title = to.meta.title;    // 改变每次页面的标题
  const token = sessionData('get', 'HasSessionToken', '');
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    });
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next();
  } else {
    if (token) {
      next();
    }
  }
});


// 跳转之后
router.afterEach(to => {
    //
});

export default router;