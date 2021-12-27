<template>
	<div id="app">
    <router-view v-wechat-title="$t('Hlin.'+ $route.meta.title)" />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, } from 'vue-property-decorator';
import router, { resetRouter } from '@/router/index';
import { subMenuRouters, dynamicRouter } from '@/router/routerMaps';
import { sessionData } from '@/filters/storage';
import { TreeForeach } from '@/filters/common';
import { UserStore } from '@/store/private/user';

@Component({
  components: {},
})
export default class Index extends Vue {
  private vm = window['vm'];
  
  created () {
    const routersMapList = UserStore.RouterMap;
    const sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    
    if (routersMapList.length === 0 && sessionRouterMap !== null) {
      const jsonData = JSON.parse(sessionRouterMap);
      this.getRouterNavsData(jsonData);
      UserStore.storeActionRouterMap(jsonData);
      console.log(`【刷新】再次执行路由${routersMapList}`);
    }
    // sessionData('set', 'HasSessionLocale', 'zh');
    // console.log(sessionRouterMap);
  };
  
  // 刷新路由
	private getRouterNavsData(data) {
    const localsList = dynamicRouter;
    let routersMapList = subMenuRouters;
    // 权限递归
    TreeForeach(data, tree => {
      localsList.forEach(el => {
        if(tree.router === el.path) {
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
