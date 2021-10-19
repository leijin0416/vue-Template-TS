<template>
	<div id="app">
    <router-view v-wechat-title="$t('Hlin.'+ $route.meta.title)" />
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
      UserStore.storeActionRouterMap(JSON.parse(sessionRouterMap));
      console.log(`【刷新】再次执行路由${routersMapList}`);
    }
    // sessionData('set', 'HasSessionLocale', 'zh');
    // console.log(sessionRouterMap);
  };
  
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
    // console.log(routersMapList);
    router.addRoutes(routersMapList);
  }
}
</script>

<style lang="scss">
</style>
