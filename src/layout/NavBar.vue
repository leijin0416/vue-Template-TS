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
                    <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                  </template>
                  <!-- 三级 children -->
                  <template v-for="subItem in item.children">
                    <el-submenu v-if="subItem.children && subItem.children.length > 0" :index="subItem.index" :key="subItem.index" :route="subItem.router">
                      <template slot="title">{{ subItem.title }}</template>
                      <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.index" :route="threeItem.router" >
                        {{ threeItem.title }}
                      </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :index="subItem.index" :key="subItem.index" :route="subItem.router" >
                      {{ subItem.title }}
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="item.index" :key="item.index" :route="item.router" >
                  <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                </el-menu-item>
              </template>
            </template>
        </el-menu>
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
  private items: any = [
    {
      icon: 'el-icon-lx-home',
      index: '/user/info',
      title: '系统首页'
    },
    {
      icon: 'el-icon-lx-cascades',
      index: '/user/property',
      title: '基础表格'
    },
    {
      icon: 'el-icon-lx-copy',
      index: 'tabs',
      title: 'tab选项卡'
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
    {
      icon: 'el-icon-lx-emoji',
      index: 'icon.less',
      title: '自定义图标'
    },
    {
      icon: 'el-icon-lx-favor',
      index: 'charts',
      title: 'schart图表'
    },
    {
      icon: 'el-icon-rank',
      index: '6',
      title: '拖拽组件',
      children: [
        {
          index: 'drag',
          title: '拖拽列表',
        },
        {
          index: 'dialog',
          title: '拖拽弹框',
        }
      ]
    },
    {
      icon: 'el-icon-lx-warn',
      index: '7',
      title: '错误处理',
      children: [
        {
          index: 'permission',
          title: '权限测试'
        },
        {
          index: '404',
          title: '404页面'
        }
      ]
    }
  ];
  private navMenuData: any = [];
  private collapse: boolean = false;
  private activeIndex: string = '';

  // computed -计算 get 用法
  get onRoutes(): any {
    let routes = this.activeIndex ? this.activeIndex : this.$route.path.replace('/', '');
    return routes
  }

  get pageStates(): any {
    let state = UserStore.MenuItemId;
    return state;
  }

  @Watch("pageStates", { deep: true, })
  private getShowStatus(newVal, oldVal) {
    let _that = this;
    if (newVal === '') {
      _that.activeIndex = '';
    } else {
      _that.activeIndex = newVal;
    }
    console.log(`【监听】NAV路由INDEX：${newVal}`);
  }

  created() {
    let _that = this;
    let sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
    // 获取并循环 路由数组
    let data: any = sessionData('get', 'HasSessionRouterMap', '');
    let navbarData: any = JSON.parse(data);
    if (sessionRouterId != null) _that.activeIndex = sessionRouterId;
    if (navbarData) {
      navbarData.forEach( el => {
        let data = el.children;
        el.icon = 'el-icon-folder-opened';
        el.index = el.id; // 父标识
        if (data.length > 0) {
          data.forEach( (cd, j) => {
            let size = Number(j) + 1;
            cd.index = el.id + '-' + size;  // 子标识
          });
        }
      });
      // console.log(navbarData);
      _that.navMenuData = navbarData;
      UserStore.getStoreMenuItem(navbarData);
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
    UserStore.getStoreMenuItemId(key);
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