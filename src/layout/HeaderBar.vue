<template>
  <div class="headerBar">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">信息直通车</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="@/assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <a href="/index" target="_blank">
              <el-dropdown-item>关于作者</el-dropdown-item>
            </a>
            <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
              <el-dropdown-item>项目仓库</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
import { UserModule } from "@/store/private/index";
import { sessionData } from "@/filters/storage";
import Event from "@/utils/Event";

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
export default class HeaderBar extends Vue {
  // private -私有
  private data: IndexData = {
    collapses: false,
    fullscreens: false,
    names: "linxin",
    messages: 2
  };

  private collapse: boolean | undefined = false;
  private fullscreen: boolean | undefined = false;
  private name: string | undefined = "张三";
  private message: number | undefined = 2;

  @Watch("message", { immediate: true, deep: true })
  onChangeValue(newVal: any, oldVal: any) {
    // todo...
  }

  // 初始化记载
  created() {}
  // DOM加载完毕执行操作
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
  // 用户名下拉菜单选择事件
  handleCommand(command) {
    let _that = this;
    if (command === 'loginout') {
      _that.$router.push('/login');
      sessionData('clean', 'HasSessionUserId', '');
      sessionData('clean', 'HasSessionToken', '');
      sessionData('clean', 'HasSessionRouterMap', '');
      _that.$router.push({path: '/login'});
    }
  }
  // 侧边栏折叠
  collapseChage() {
    let _that = this;
    _that.collapse = !_that.collapse;
    Event.$emit("collapse", _that.collapse);
  }
  // 全屏事件
  handleFullScreen() {
    let _that = this;
    // any: 类型上不存在属性
    let element: any = document.documentElement;
    let documentScreen: any = document;
    if (_that.fullscreen) {
      if (documentScreen.exitFullscreen) {
        documentScreen.exitFullscreen();
      } else if (documentScreen.webkitCancelFullScreen) {
        documentScreen.webkitCancelFullScreen();
      } else if (documentScreen.mozCancelFullScreen) {
        documentScreen.mozCancelFullScreen();
      } else if (documentScreen.msExitFullscreen) {
        documentScreen.msExitFullscreen();
      }
    } else {
      document.body.style.width = "100%"; // 兼容谷歌58+68版本
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      }
    }
    _that.fullscreen = !_that.fullscreen;
  }
  // 离开路由的操作
  destroyed() {}
}
</script>

<style lang="scss" scoped>
.headerBar {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #242f42;

  .collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }

  .logo {
    float: left;
    width: 250px;
    line-height: 70px;
  }

  .header-right {
    float: right;
    padding-right: 50px;
  }

  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }

  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }

  .btn-bell,
  .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
  }

  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
  }

  .btn-bell .el-icon-bell {
    color: #fff;
  }

  .user-name {
    margin-left: 10px;
  }

  .user-avator {
    margin-left: 20px;
  }

  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }
}
</style>