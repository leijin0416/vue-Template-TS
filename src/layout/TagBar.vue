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
import { Component, Vue, Watch, Inject, Provide, Emit, Prop } from "vue-property-decorator";
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
export default class vTagBar extends Vue {
  private tagsList: any = [];
  private tagsId: any = '';
  private activeLocale: string = 'zh-CN';

  // computed -计算 get 用法
  get showTags(): any {
    return this.tagsList.length > 0;
  }

  get pageStates(): any {
    return UserStore.MenuItemId;
  }

  @Watch("pageStates", { deep: true, })
  private getShowStatus(newVal, oldVal) {
    const _that = this;
    if (newVal !== '') {
      _that.tagsId = newVal;
      _that.setTags(_that.$route);
    }
    console.log(`【watch】TAG标签index：${newVal}`);
  }

  created() {
    const _that = this;
    const sessionMenuItem: any = sessionData('get', 'HasSessionTagsMap', '');
    if (sessionMenuItem !== null) {
      _that.tagsList = JSON.parse(sessionMenuItem);
    } else {
      _that.setTags(_that.$route);
    }

    const getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
    if(getLocaleI18n !== null) {
      this.activeLocale = getLocaleI18n;
    }
  }
  
  /**
   * 是否高亮  添加Class
   * @param path path路由对象
   */
  isActive(path: any) {
    // console.log(path);
    const _that = this;
    return path === _that.$route.fullPath;
  }

  // 点击标签跳转路由
  onTagsClick(item) {
    const _that = this;
    _that.$router.push(item.path);
    UserStore.storeActionLeftMenuMapId(item.index);
  }

  /**
   *  关闭【单个】标签
   *  @param {Object} item                 -关闭后的当前新的标签信息
   *  @param {Object} delItem              -要关闭的标签
   *  @param {Object} fullPath             -新的地址
   * 
   *  @param {String} storeActionLeftMenuMapId   -更新INDEX
   *  @param {Array}  storeActionTagsListMap     -更新TAG数组标签集合
   */
  closeTags(index: number) {
    const _that = this;

    const delItem = _that.tagsList.splice(index, 1)[0];  // 关闭当前并跳转到上一个
    const item = _that.tagsList[index] ? _that.tagsList[index] : _that.tagsList[index - 1];
    
    if(index != 0) {
      const type = this.isActive(delItem.path);  // 判断是否是高亮的标签，是则跳转上一条
      if (type) {
        delItem.path === _that.$route.fullPath && _that.$router.push(item.path);
        UserStore.storeActionLeftMenuMapId(item.index);
        console.log('123');
        
      }
    }
    UserStore.storeActionTagsListMap(_that.tagsList);
    
    // console.log(this.isActive(delItem.path));
    // console.log(delItem.path);
    // console.log(item);
    // console.log(_that.$route.fullPath);
    // console.log(_that.tagsList[index]);
  }

  /**
   *  关闭【全部】标签
   * 
   *  @param {String} storeActionLeftMenuMapId  -【缓存】更新INDEX
   *  @param {Array} storeActionTagsListMap     -【缓存】更新TAG数组标签集合
   */
  closeAll() {
    const _that = this;
    const arr = _that.tagsList;
    _that.$router.push('/');
    const arrFilter = arr.filter(ele => ele.index === '');
    _that.tagsList = arrFilter;
    
    UserStore.storeActionLeftMenuMapId('');
    UserStore.storeActionTagsListMap(arrFilter);
  }

  /**
   *  关闭【其他】标签
   * 
   *  @param {String} storeActionLeftMenuMapId  -【缓存】更新INDEX
   *  @param {Array} storeActionTagsListMap     -【缓存】更新TAG数组标签集合
   */
  closeOther() {
    const _that = this;
    const curItem = _that.tagsList.filter(item => {
      return item.path === _that.$route.fullPath;
    })
    _that.tagsList = curItem;
    UserStore.storeActionLeftMenuMapId(curItem[0].index);
    UserStore.storeActionTagsListMap(curItem);
  }

  /**
   *  添加标签
   *  @param {String} route  -路由的数据
   * 
   *  @param {Array}  sessionRouterMap           -【缓存】左侧NAV数组集合
   *  @param {String} sessionRouterId            -【缓存】左侧NAV数组INDEX
   *  @param {Array} storeActionTagsListMap      -【缓存】TAG数组标签集合
   */
  setTags(route: any) {
    const _that = this;
    const data = _that.tagsList;
    const sessionRouterMap: any = sessionData('get', 'HasSessionMenuItem', '');
    const sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
    const tagsId: string = _that.tagsId ? _that.tagsId : sessionRouterId;
    if (_that.tagsList.length == 0) {
      _that.tagsList.push({
        titleEn: route.meta.titleEn,
        title: route.meta.title,
        path: route.fullPath,
        index: '',
        name: route.matched[1].components.default.name
      });
      
    } else {
      TreeForeach(JSON.parse(sessionRouterMap), tree => {  // 权限递归
        // data.push(tree);
        if (tree.index === tagsId) {
          data.push({
            title: tree.title,
            titleEn: tree.titleEn,
            path: tree.router,
            name: tree.remarks,
            index: tree.index,
          });
        }
      });
      _that.tagsList = FormatArrMapHas(data);
      
    }
    _that.$emit("tags", _that.tagsList);
    UserStore.storeActionTagsListMap(_that.tagsList);
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
  padding: 3px 120px 3px 0;
  box-shadow: 0 4px 6px #ddd;

  ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 0;
    overflow: hidden;
  }

  .tags-li {
    cursor: pointer;
    position: relative;
    display: inline-block;
    padding: 7px 12px;
    margin-left: 5px;
    vertical-align: middle;
    font-size: 12px;
    line-height: 1.2;
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
    border: 1px solid #409eff;
    color: #fff;
    background-color: #409eff;
    .tags-li-title::before {
      content: "";
      background: #fff;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: relative;
      margin-right: 5px;
    }
  }
  
  .tags-li-title {
    float: left;
    min-width: 50px;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 10px;
    color: #666;
  }

  .tags-li.active .tags-li-title {
    color: #fff;
  }
  .tags-li-icon {
    z-index: 999;
    position: absolute;
    top: 2px;
    right: 0;
    width: 20px;
    height: 100%;
    .el-icon-close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .tags-close-box {
    z-index: 99;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 110px;
    min-height: 30px;
    line-height: 32px;
    text-align: center;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
    background: #fff;
    .el-button {
      line-height: 1.2;
    }
  }
}
</style>
