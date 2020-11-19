<template>
	<div id="app">
		<!-- v-wechat-title="$route.meta.title" -->
    <router-view />
	</div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Vue, Watch, } from 'vue-property-decorator';
import router from '@/router/index';
import { sessionData } from '@/filters/storage';
import { UserStore } from '@/store/private/user';

@Component({
  components: {
  },
})
export default class Index extends Vue {
  created () {
    let routerMap = UserStore.RouterMap;
    let sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    if (routerMap.length === 0 && sessionRouterMap !== null) {
      router.addRoutes(JSON.parse(sessionRouterMap));
    }
    console.log(routerMap.length);
  }
}
</script>

<style lang="scss">
</style>
