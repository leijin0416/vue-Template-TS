<template>
  <!-- 布局 -->
  <div class="init">
    <HeaderBar></HeaderBar>
    <NavBar></NavBar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <TagBar></TagBar>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Inject,
  Provide,
  Emit,
  Prop,
  Vue,
  Watch
} from "vue-property-decorator";
import HeaderBar from './HeaderBar.vue';
import NavBar from './NavBar.vue';
import TagBar from './TagBar.vue';
import Event from '@/utils/Event';
import { sessionData } from "@/filters/storage";

type IndexData = {
  collapses: boolean;
  fullscreens: boolean;
  names: string;
  messages: number;
};
// 挂载组件
@Component({
  components: {
    HeaderBar, TagBar, NavBar
  }
})
export default class Init extends Vue {
  private tagsList: any = [];
  private collapse: boolean = false;

  // computed -计算 get 用法
  get onRoutes(): any {
    return this.$route.path.replace('/', '');
  }

  created() {
    let _that = this;
    Event.$on('collapse', msg => {
      _that.collapse = msg;
    })

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    Event.$on('tags', msg => {
      let arr: any = [];
      for(let i = 0, len = msg.length; i < len; i ++){
        msg[i].name && arr.push(msg[i].name);
      }
      _that.tagsList = arr;
    })
  }
  // 离开路由的操作
  destroyed() {
  }
}
</script>

<style lang='scss' scoped>
.init{height: 100%;}
.content-box {position: absolute;left: 250px;right: 0;top: 70px;bottom: 0;padding-bottom: 30px;-webkit-transition: left .3s ease-in-out;transition: left .3s ease-in-out;background: #f0f0f0;}
.content {width: auto;height: 100%;padding: 10px;overflow-y: scroll;box-sizing: border-box;}
.content-collapse {left: 65px;}
</style>