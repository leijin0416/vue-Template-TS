<template>
    <div class='navBar'>
        <el-menu 
            class="sidebar-el-menu" 
            :default-active="onRoutes" 
            :collapse="collapse" 
            background-color="#324157"
            text-color="#bfcbd9" 
            active-text-color="#20a0ff" 
            unique-opened
            collapse-transition >
            <template v-for="item in navMenuData" router >
              <!-- 二级 children -->
              <template v-if="item.children && item.children.length > 0">
                <el-submenu :index="item.index" :key="item.index">
                  <template slot="title">
                    <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                  </template>
                  <!-- 三级 children -->
                  <template v-for="subItem in item.children">
                    <el-submenu v-if="subItem.children && subItem.children.length > 0" :index="subItem.index" :key="subItem.index">
                      <template slot="title">{{ subItem.title }}</template>
                      <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.index" >
                        {{ threeItem.title }}
                      </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                      {{ subItem.title }}
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="item.index" :key="item.index" >
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
import { UserModule } from "@/store/private/index";
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
export default class TagBar extends Vue {
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

  // computed -计算 get 用法
  get onRoutes(): any {
    return this.$route.path.replace('/', '');
  }

  created() {
    let data: any = sessionData('get', 'HasSessionRouterMap', '');
    let navbarData: any = JSON.parse(data);
    if (navbarData) {
      navbarData.forEach( el => {
        el.index = el.router
      });
      console.log(navbarData);
      this.navMenuData = navbarData;
    }
    
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    Event.$on('collapse', msg => {
      this.collapse = msg;
    });
  }
}
</script>

<style lang='scss' scoped>
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