import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './langs';
import filters from './filters';

import Viewer from 'v-viewer';
import VueWechatTitle from 'vue-wechat-title';           // 动态修改
import myECharts from "./components/Echarts/common";     // 挂载图表
import './utils/btnPermission';                         // 全局按钮权限

import './assets/styles/css/font.css';
import './assets/styles/css/main.css';
import './assets/styles/common.scss';
import 'viewerjs/dist/viewer.css';

// 引入图片查看器
Vue.use(Viewer)
Viewer.setDefaults({})
Vue.use(VueWechatTitle)
Vue.use(myECharts)

Vue.config.productionTip = false;

// 全局过滤器
Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
})

// 将Vue对象存在window
window['vm'] = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
