<template>
  <div class="headerBar">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-s-unfold" v-if="collapse"></i>
      <i class="el-icon-s-fold" v-else></i>
    </div>
    <div class="logo">PingPay 后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message ? `有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div> -->

        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="@/assets/img/logo-tx.jpg" class="v-img" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" @command="handleCommand">
          <span class="el-dropdown-link v-text">
            {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="loginHome">回到首页</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Inject, Provide, Emit, Prop, Vue, Watch
} from "vue-property-decorator";
import Event from "@/utils/Event";
import { UserStore } from '@/store/private/user';
import { sessionData } from "@/filters/storage";

type IndexData = {
  collapses: boolean;
  fullscreens: boolean;
  names: string;
  messages: number;
};

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
  private name: any = "";
  private message: number | undefined = 2;

  // 获取数据
  get getUserName() {
    return UserStore.getUserName
  };

  @Watch("getUserName", { immediate: true, deep: true })
  onChangeValue(newVal: any, oldVal: any) {
    if(newVal) this.name = newVal;
    else this.name = sessionData('get', 'HasSessionUserName', '');
    // console.log(newVal);
  }

  // 初始化记载
  created() {
    if(this.getUserName === '') {
      this.name = sessionData('get', 'HasSessionUserName', '')
    }
  }

  // DOM加载完毕执行操作
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
    // console.log(sessionData('get', 'HasSessionUserName', ''));
  }
  // 用户名下拉菜单选择事件
  handleCommand(command) {
    if (command === 'loginout') {
      sessionData('clean', 'HasSessionUserId', '');
      sessionData('clean', 'HasSessionToken', '');
      sessionData('clean', 'HasSessionRouterMap', '');
      sessionData('clean', 'HasSessionMenuItemId', '');
      sessionData('clean', 'HasSessionMenuItem', '');
      sessionData('clean', 'HasSessionTagsMap', '');
      sessionData('clean', 'HasSessionUserName', '')
      window.location.reload();
      // _that.$router.push({path: '/login'});
    } else if (command === 'loginHome') {
      this.$router.push('/');
      UserStore.storeActionLeftMenuMapId('');
    }
  }

  // 侧边栏折叠
  collapseChage() {
    const _that = this;
    _that.collapse = !_that.collapse;
    Event.$emit("collapse", _that.collapse);
  }

  // 全屏事件
  handleFullScreen() {
    const _that = this;
    // any: 类型上不存在属性
    const element: any = document.documentElement;
    const documentScreen: any = document;
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
  background-color: #2e4d84;

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
    .v-text {
      font-size: 16px;
    }
  }

  .user-avator {
    margin-left: 10px;
    font-size: 0;
    .v-img, .v-text {
      display: inline-block;
      vertical-align: middle;
    }
    .v-img {
      width: 40px;
      height: 40px;
      margin-right: 5px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, .3);
    }
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