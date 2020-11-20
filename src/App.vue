<template>
	<div id="app">
		<!-- v-wechat-title="$route.meta.title" -->
    <router-view />
	</div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Vue, Watch, } from 'vue-property-decorator';
import router, { resetRouter } from '@/router/index';
import { subMenuRouters, dynamicRouter } from '@/router/routerMaps';
import { sessionData } from '@/filters/storage';
import { UserStore } from '@/store/private/user';
import { TreeForeach } from '@/filters/common';

@Component({
  components: {
  },
})
export default class Index extends Vue {
  created () {
    let routerMap = UserStore.RouterMap;
    let sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    
    if (routerMap.length === 0 && sessionRouterMap !== null) {
      this.onUserAddRoutes();
      UserStore.getStoreRouterMap(JSON.parse(sessionRouterMap));
      console.log(`再次执行路由${routerMap}`);
    }
    // console.log(sessionRouterMap);
  }
  
  // 刷新路由
	onUserAddRoutes () {
    // 有详情也的可以使用fullpath
    let subMenuRoutersList = subMenuRouters;
    let routers = dynamicRouter;
    let sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');

    TreeForeach(JSON.parse(sessionRouterMap), tree => {
      routers.forEach(el => {
        if (tree.router === el.path) {
          subMenuRoutersList[0].children.push(el);
        }
      });
    });
    router.addRoutes(subMenuRoutersList);
  }
}
</script>

<style lang="scss">
</style>
