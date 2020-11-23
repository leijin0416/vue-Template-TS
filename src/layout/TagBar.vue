<template>
  <div class="tagBar" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item,index) in tagsList"
        :class="{'active': isActive(item.path)}"
        :key="index" >
        <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
  private tagsList: any = [];

  // computed -计算 get 用法
  get showTags(): any {
    return this.tagsList.length > 0;
  }

  @Watch("tagsList", {
    deep: true,
  })
  private onLayoutChange() {
  }

  created() {
    let _that = this;
    _that.setTags(_that.$route);
    // 监听关闭当前页面的标签页
    _that.$on("close_current_tags", () => {
      for (let i = 0, len = _that.tagsList.length; i < len; i++) {
        const item = _that.tagsList[i];
        if (item.path === _that.$route.fullPath) {
          if (i < len - 1) {
            _that.$router.push(_that.tagsList[i + 1].path);
          } else if (i > 0) {
            _that.$router.push(_that.tagsList[i - 1].path);
          } else {
            _that.$router.push("/");
          }
          _that.tagsList.splice(i, 1);
        }
      }
    });
  }
  
  isActive(path: any) {
    let _that = this;
    return path === _that.$route.fullPath;
  }

  // 关闭单个标签
  closeTags(index: any) {
    let _that = this;
    const delItem = _that.tagsList.splice(index, 1)[0];
    const item = _that.tagsList[index] ? _that.tagsList[index] : _that.tagsList[index - 1];
    if (item) {
      delItem.path === _that.$route.fullPath && _that.$router.push(item.path);
    } else {
      _that.$router.push('/');
    }
  }

  // 关闭全部标签
  closeAll() {
    let _that = this;
    _that.tagsList = [];
    _that.$router.push('/');
  }

  // 关闭其他标签
  closeOther() {
    let _that = this;
    const curItem = _that.tagsList.filter(item => {
      return item.path === _that.$route.fullPath;
    })
    _that.tagsList = curItem;
  }

  /**
   *  添加标签
   *  @param {String} route  -路由的数据
   */
  setTags(route: any) {
    let _that = this;
    const isExist = _that.tagsList.some(item => {
      return item.path === route.fullPath;
    });
    if (!isExist) {
      if (_that.tagsList.length >= 8) {
        _that.tagsList.shift();
      }
      _that.tagsList.push({
        title: route.meta.title,
        path: route.fullPath,
        name: route.matched[1].components.default.name
      });
    }
    console.log(route);
    _that.$emit("tags", this.tagsList);
  }

  handleTags(command: any) {
    command === 'other' ? this.closeOther() : this.closeAll();
  }
}
</script>

<style lang='scss' scoped>
.tagBar {
  z-index: 8;
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding: 5px 120px 5px 0;
  box-shadow: 0 4px 6px #ddd;

  ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 0;
  }

  .tags-li {
    cursor: pointer;
    display: inline-block;
    padding: 7px 12px;
    margin-left: 5px;
    vertical-align: middle;
    font-size: 12px;
    line-height: 1;
    overflow: hidden;
    border: 1px solid #e9eaec;
    border-radius: 3px;
    color: #666;
    background: #fff;
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
  }

  .tags-li:not(.active):hover {
    background: #f8f8f8;
  }

  .tags-li.active {
    color: #fff;
  }
  .tags-li.active {
    border: 1px solid #409eff;
    background-color: #409eff;
  }
  .tags-li-title {
    float: left;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
  }

  .tags-li.active .tags-li-title {
    color: #fff;
  }

  .tags-close-box {
    z-index: 10;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 110px;
    min-height: 30px;
    line-height: 35px;
    text-align: center;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
    background: #fff;
  }
}
</style>
