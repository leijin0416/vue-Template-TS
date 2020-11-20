<template>
	<div id="app">
		<!-- v-wechat-title="$route.meta.title" -->
    <router-view />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, } from 'vue-property-decorator';
import router, { resetRouter } from '@/router/index';
import { subMenuRouters, dynamicRouter } from '@/router/routerMaps';
import { UserStore } from '@/store/private/user';
import { sessionData } from '@/filters/storage';
import { TreeForeach } from '@/filters/common';

@Component({
  components: {},
})
export default class Index extends Vue {
  created () {
    let routersMapList = UserStore.RouterMap;
    let sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    
    if (routersMapList.length === 0 && sessionRouterMap !== null) {
      this.onUserAddRoutes();
      UserStore.getStoreRouterMap(JSON.parse(sessionRouterMap));
      console.log(`再次执行路由${routersMapList}`);
    }
    // console.log(sessionRouterMap);
  }
  
  // 刷新路由
	onUserAddRoutes () {
    let routersMapList = subMenuRouters;
    let dynamicMapList = dynamicRouter;
    let sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    // 权限递归
    TreeForeach(JSON.parse(sessionRouterMap), tree => {
      dynamicMapList.forEach(el => {
        if (tree.router === el.path) {
          routersMapList[0].children.push(el);
        }
      });
    });
    router.addRoutes(routersMapList);
  }
}
</script>

<style lang="scss">
</style>
