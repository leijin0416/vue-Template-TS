<template>
  <div class='navBar'>
    <el-menu 
      class="sidebar-el-menu"
      :default-active="activeIndex" 
      :collapse="collapse" 
      @select="onSelect"
      background-color="#324157"
      text-color="#bfcbd9" 
      active-text-color="#20a0ff" 
      unique-opened
      collapse-transition router >
      <template v-for="item in navMenuData" >
        <!-- 二级 children -->
        <template v-if="item.children && item.children.length > 0">
          <el-submenu :index="item.index" :key="item.index" :route="item.router" >
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ activeLocale === 'zh-CN' ? item.title : item.titleEn }}</span>
            </template>
            <!-- 三级 children -->
            <template v-for="subItem in item.children">
              <el-submenu v-if="subItem.children && subItem.children.length > 0" :index="subItem.index" :key="subItem.index" :route="subItem.router">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.index" :route="threeItem.router" >
                  <span>{{ activeLocale === 'zh-CN' ? threeItem.title : threeItem.titleEn }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item :index="subItem.index" :key="subItem.index" :route="subItem.router" v-else >
                {{ activeLocale === 'zh-CN' ? subItem.title : subItem.titleEn }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" :route="item.router" >
            <i :class="item.icon"></i>
            <span slot="title">{{ activeLocale === 'zh-CN' ? item.title : item.titleEn }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Provide, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import Event from '@/utils/Event';
import { UserStore } from '@/store/private/user';
import { sessionData } from "@/filters/storage";

type IndexData = {
  collapses: boolean;
  fullscreens: boolean;
  names: string;
  messages: number;
};

// 挂载组件
@Component({
  components: {}
})
export default class vNavBar extends Vue {
  private items: object = [
    {
      icon: 'el-icon-lx-home',
      index: '/user/info',
      title: '系统首页'
    },
    {
      icon: 'el-icon-lx-calendar',
      index: '3',
      title: '表单相关',
      children: [
        {
          index: 'form',
          title: '基本表单'
        },
        {
          index: '3-2',
          title: '三级菜单',
          children: [
            {
              index: 'editor',
              title: '富文本编辑器'
            },
            {
              index: 'markdown',
              title: 'markdown编辑器'
            },
          ]
        },
        {
          index: 'upload',
          title: '文件上传'
        }
      ]
    },
  ];
  private navMenuData: any = [];
  private collapse: boolean = false;
  private activeLocale: string = '';  // 当前语言
  private activeIndex: string = '';   // 当前激活
  private defaultOpeneds: any = [];   // 当前打开

  // computed -计算 get 用法
  get onRoutes(): any {
    const routes = this.activeIndex ? this.activeIndex : this.$route.path.replace('/', '');
    return routes;
  }

  get pageStates(): any {
    const state = UserStore.MenuItemId;
    return state;
  }

  @Watch("pageStates", { deep: true, })
  private getShowStatus(newVal, oldVal) {
    const _that = this;
    if (newVal === '') _that.activeIndex = '';
    else _that.activeIndex = newVal;
    console.log(`【watch】左侧导航路由index：${newVal}`);
  }

  created() {
    const _that = this;
    let getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
    if(getLocaleI18n !== null) this.activeLocale = getLocaleI18n;

    const sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');  // 左侧导航路由数组index
    const routerData: any = sessionData('get', 'HasSessionRouterMap', '');       // 循环左侧导航路由数组
    const navbarData: any = JSON.parse(routerData);
    // console.log(navbarData);
    
    if (sessionRouterId != null) this.activeIndex = sessionRouterId;
    if (navbarData) {
      navbarData.forEach( el => {
        let data = el.children;
        el.index = el.menuId.toString();       // 父标识
        if (data.length > 0) {
          data.forEach( (cd, j) => {
            let size = Number(j) + 1;
            let num = el.menuId + '-' + size;
            cd.index = num.toString();  // 子标识
          });
        }
      });
      this.navMenuData = navbarData;
      UserStore.storeActionMenuMap(navbarData);   // 缓存菜单
    };
    
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    Event.$on('collapse', msg => {
      _that.collapse = msg;
    });
  };

  // 点击导航
  onSelect(key: any, keyPath: any) {
    let _that = this;
    _that.activeIndex = key;
    UserStore.storeActionLeftMenuMapId(key);
    // console.log(key, keyPath);
  };
}
</script>

<style lang='scss' scoped>
.el-menu-item.is-active {
  color: #20a0ff !important;
  background-color: #43556f !important;
}
.navBar {
  ul {
    position: relative;
    z-index: 9;
    height: 100%;
  }
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
}
</style>