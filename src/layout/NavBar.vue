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
              <span class="v-title-box">{{ $t('Hlin.'+ item.title) }}</span>
            </template>
            <!-- 三级 children -->
            <template v-for="subItem in item.children">
              <el-submenu v-if="subItem.children && subItem.children.length > 0" :index="subItem.index" :key="subItem.index" :route="subItem.router">
                <template slot="title">
                  <span class="v-title-box">{{ $t('Hlin.'+ subItem.title) }}</span> 
                </template>
                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.index" :route="threeItem.router" >
                  <span class="v-title-box">{{ $t('Hlin.'+ threeItem.title) }}</span>
                  
                </el-menu-item>
              </el-submenu>
              <el-menu-item :index="subItem.index" :key="subItem.index" :route="subItem.router" v-else >
                <span class="v-title-box">{{ $t('Hlin.'+ subItem.title) }}</span> 
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <!-- 一级 -->
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" :route="item.router" >
            <i :class="item.icon"></i>
            <span slot="title" class="v-title-box">{{ $t('Hlin.'+ item.title) }}</span>
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
export default class NavBar extends Vue {
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
  private activeIndex: string = '';
  private activeLocale: string = 'zh-CN';
  private routeStatusType: boolean = false;    // 判断是否是手动点击

  // computed -计算 get 用法
  get onRoutes(): any {
    const routes = this.activeIndex ? this.activeIndex : this.$route.path.replace('/', '');
    return routes;
  }

  get getMenuItemActiveId(): any {
    const state = UserStore.MenuItemId;
    return state;
  }

  @Watch("getMenuItemActiveId", { deep: true, })
  WatchGetMenuItemId(newVal, oldVal) {
    const _that = this;
    console.log(`【监听】NavsLeft 路由index: ${newVal}`);
  }

  // 路由变化时执行
  @Watch('$route', {deep: true, immediate: true})
  onRouteChange(newVal, oldVal) {
    // console.log(newVal);
    // console.log(oldVal);
    if(this.routeStatusType) this.routeStatusType = false
    else {
      const sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
      if(this.activeIndex === '' && sessionRouterId != null) {
        this.getNavsMenuItemData();
        this.getNavMenuItemActiveId(newVal);

      } else if(this.activeIndex !== '') {
        this.getNavMenuItemActiveId(newVal);

      }

    }
  }

  created() {
    const _that = this;
    const sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
    const getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
    
    if(getLocaleI18n !== null) this.activeLocale = getLocaleI18n;
    if(sessionRouterId === null) {
      this.getNavsMenuItemData();
      this.activeIndex = '1';
    }
    
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    Event.$on('collapse', msg => {
      _that.collapse = msg;
    });
  };

  /**
   * @description: 获取导航高亮 index
   * @param {*} newVal 路由信息
   * @return {*}
   */
  getNavMenuItemActiveId(newVal) {
    const navBarMenuData = this.navMenuData;
    // console.log(newVal);
    
    navBarMenuData.forEach(item => {
      if(item.children.length > 0) {
        const data = item.children;
        // 比对子级 children
        let key = data.findIndex(item => item.router === newVal.path)
        
        if(key != -1) {
          // let index = data[key].index.split('-')
          this.activeIndex = data[key].index
        }
        
      } else {
        if(item.router === newVal.path) this.activeIndex = item.index
      }
    })
  }

  /**
   * @description: 导航栏
   * @param {*} menuSort 父标识
   * @return {*}
   */
  getNavsMenuItemData() {
    const _that = this;
    // 获取并循环 左侧路由数组
    const sessionRouterData: any = sessionData('get', 'HasSessionRouterMap', '');
    const navBarMenuData = JSON.parse(sessionRouterData);
    // console.log(navBarMenuData);
    
    if (navBarMenuData.length > 0) {
      navBarMenuData.forEach( el => {
        let data = el.children;
        el.index = el.menuId.toString();       // 父标识
        if (data.length > 0) {
          data.forEach( (cd, j) => {
            let num = Number(j) + 1;
            let index = (el.menuId + '-' + num).toString();
            cd.index = index;  // 子标识
          });
        }
      });
      // console.log(navBarMenuData);
      _that.navMenuData = navBarMenuData;
      UserStore.storeActionMenuMap(navBarMenuData);   // 缓存菜单
    };

  }

  // 点击导航
  onSelect(key: any, keyPath: any) {
    let _that = this;
    _that.routeStatusType = true;
    _that.activeIndex = key;
    UserStore.storeActionLeftMenuMapId(key);
    // console.log(key, keyPath);
  };
}
</script>

<style lang='scss' scoped>
/deep/.el-submenu__title {
  padding: 0 10px !important;
}
/deep/.el-submenu__icon-arrow {
  right: 15px !important;
}
/deep/.el-submenu [class^=el-icon-] {
  margin-right: 2px !important;
}
/deep/.el-menu-item {
  min-width: 200px;
  height: auto;
  padding: 15px 15px 15px 30px;
  line-height: 1.25;
}
/deep/.el-menu-item.is-active {
  color: #20a0ff !important;
  background-color: #43556f !important;
}

.navBar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  ul {
    position: relative;
    z-index: 9;
    height: 100%;
    span {
      word-wrap: break-word;
      white-space: normal;
      word-break: break-all;
    }
  }

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