<template>
  <div class="tagBar" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{'active': isActive(item.path)}"
        :key="index" >
        <span class="tags-li-title" @click="onTagsClick(item)">{{item.title}}</span>
        <span class="tags-li-icon" v-if="item.name === 'Index'">
          <i class="el-icon-s-opportunity"></i>
        </span>
        <span class="tags-li-icon" @click="closeTags(index)" v-else>
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
import { UserStore } from '@/store/private/user';
import { sessionData } from "@/filters/storage";
import { TreeForeach, FormatArrMapHas } from '@/filters/common';

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
  private tagsId: any = '';

  // computed -计算 get 用法
  get showTags(): any {
    return this.tagsList.length > 0;
  }

  get pageStates(): any {
    let state = UserStore.MenuItemId;
    return state;
  }

  @Watch("pageStates", { deep: true, })
  private getShowStatus(newVal, oldVal) {
    let _that = this;
    if (newVal !== '') {
      _that.tagsId = newVal;
      _that.setTags(_that.$route);
    }
    console.log(`【监听】TAG路由INDEX：${newVal}`);
  }

  created() {
    let _that = this;
    let sessionMenuItem: any = sessionData('get', 'HasSessionTagsMap', '');
    if (sessionMenuItem !== null) {
      _that.tagsList = JSON.parse(sessionMenuItem);
      // console.log(sessionMenuItem);
    } else {
      _that.setTags(_that.$route);
    }
  }
  
  // 添加Class
  isActive(path: any) {
    // console.log(path);
    let _that = this;
    return path === _that.$route.fullPath;
  }

  /**
   *  关闭【单个】标签
   *  @param {Object} item                 -关闭后的当前标签
   *  @param {Object} delItem              -要关闭的标签
   * 
   *  @param {String} getStoreMenuItemId   -更新INDEX
   *  @param {Array}  getStoreTagsItem     -更新TAG数组
   */
  closeTags(index: any) {
    let _that = this;
    const delItem = _that.tagsList.splice(index, 1)[0];
    const item = _that.tagsList[index] ? _that.tagsList[index] : _that.tagsList[index - 1];
    if (item) {
      delItem.path === _that.$route.fullPath && _that.$router.push(item.path);
    } else {
      _that.$router.push('/');
    }
    UserStore.getStoreMenuItemId(item.index);
    UserStore.getStoreTagsItem(_that.tagsList);
  }

  /**
   *  关闭【全部】标签
   *  @param {String} getStoreMenuItemId  -更新INDEX
   */
  closeAll() {
    let _that = this;
    _that.tagsList.length = 0;
    _that.$router.push('/');
    _that.tagsList.push({
      title: _that.$route.meta.title,
      path: _that.$route.fullPath,
      index: '',
      name: _that.$route.matched[1].components.default.name
    });
    UserStore.getStoreMenuItemId('');
  }

  /**
   *  关闭【其他】标签
   *  @param {String} getStoreMenuItemId  -更新INDEX
   *  @param {Array} getStoreTagsItem     -更新TAG数组
   */
  closeOther() {
    let _that = this;
    const curItem = _that.tagsList.filter(item => {
      return item.path === _that.$route.fullPath;
    })
    _that.tagsList = curItem;
    UserStore.getStoreMenuItemId(curItem[0].index);
    UserStore.getStoreTagsItem(curItem);
  }

  /**
   *  添加标签
   *  @param {String} route  -路由的数据
   */
  setTags(route: any) {
    let _that = this;
    let data = _that.tagsList;
    let sessionRouterMap: any = sessionData('get', 'HasSessionMenuItem', '');
    let sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
    let tagsId: string = _that.tagsId ? _that.tagsId : sessionRouterId;
    if (_that.tagsList.length == 0) {
      _that.tagsList.push({
        title: route.meta.title,
        path: route.fullPath,
        index: '',
        name: route.matched[1].components.default.name
      });
      
    } else {
      // 权限递归
      TreeForeach(JSON.parse(sessionRouterMap), tree => {
        // data.push(tree);
        if (tree.index === tagsId) {
          data.push({
            title: tree.title,
            path: tree.router,
            name: tree.remarks,
            index: tree.index,
          });
        }
      });
      _that.tagsList = FormatArrMapHas(data);
      
    }
    _that.$emit("tags", _that.tagsList);
    UserStore.getStoreTagsItem(_that.tagsList);
  }

  handleTags(command: any) {
    command === 'other' ? this.closeOther() : this.closeAll();
  }

  onTagsClick(item) {
    let _that = this;
    _that.$router.push(item.path);
    UserStore.getStoreMenuItemId(item.index);
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
