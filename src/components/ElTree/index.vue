<template>
  <div class="component">
    <el-tree
      ref="tree"
      :data="childrenRouterData"
      show-checkbox
      node-key="menuId"
      :accordion="accordion"
      :expand-on-click-node="false"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      @check="handleNodeCheck"
      @node-click="handleNodeClick" >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i class="el-icon-folder-opened" v-if="data.depth === 1" /> 
          <i class="el-icon-folder" v-else /> 
          {{ node.label }}
        </span>
        <div class="v-btn-box" v-if="treeType === 1">
          <div class="v-btn" v-if="data.depth === 1">
            <el-button
              type="text"
              size="mini"
              @click="() => handleMenuAddChange(data)">
              <i class="el-icon-plus" /> 新增
            </el-button>
          </div>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Emit, Prop } from 'vue-property-decorator';
import { AdminSystemStore } from '@/store/private/AdminIstrators';
import { sessionData } from '@/filters/storage';

import { childrenRouterMap } from '@/mock/childrenRouter';

type IndexData = {
  children: string;
  label: string
};

@Component({
  components: {},
})
export default class tree extends Vue {
  /** three -新增状态
   *  @treeType 1要 0不要
   */
  @Prop({ default: 0 }) treeType!: number;
  private accordion: boolean = this.treeType === 0 ? true : false;

  private childrenRouterData = [
    {
      depth: 1,
      menuId: 0,
      parentId: 0,
      title: '全部路由',
      children: [],
      icon: "el-icon-monitor"
    }
  ];
  private defaultProps: IndexData = {
    children: 'children',
    label: 'title'
  };

  private defaultCheckedKeys: Array<number> = [];    // 默认勾选的节点的 key 的数组 [0]
  private defaultExpandedKeys: Array<number> = [0];  // 默认展开的节点的 key 的数组

  // 获取数据
  get getAdminSystemMenuTreeList() {
    return AdminSystemStore.getAdminSystemMenuTreeList
  };
  get getAdminRoleChildrenMenuId() {
    return AdminSystemStore.getAdminRoleChildrenMenuId
  };

  // 监听数据列表
  @Watch('getAdminSystemMenuTreeList', { immediate: true, deep: true })  // 树状图数据
  getMenuTreeList(newValue: any) {
    let list = newValue.data;
    if(newValue.data) {
      if(list.length > 0) this.childrenRouterData[0].children = list;
      else this.childrenRouterData[0].children = [];
    }
    //console.log(newValue)
  };
  @Watch('getAdminRoleChildrenMenuId', { immediate: true, deep: true })  // 默认勾选
  getRoleChildrenMenuId(newValue: any) {
    if(newValue) {
      let tree: any = this.$refs.tree;
      if(newValue.length > 0) {
        let list = newValue.map(Number);
        list.forEach((item, i) => {
          if (item == 0) {
            list.splice(i, 1); // 从下标 i 开始, 删除 1 个元素
          }
        })
        this.defaultCheckedKeys = list;
        // console.log(list);
      } else {
        this.$nextTick(() => {
          if(tree) tree.setCheckedKeys([])  // 清空选中
        });
      }
    }
  };

  // 生命周期
  mounted () {}

  /** 按钮 -树状图勾选事件
   *  节点被点勾选的回调
   * 
   *  @data 属性的数组中该节点所对应的对象
   */
  @Emit('handleNodeCheck')
  private handleNodeCheck(data, node) {
    
    let tree: any = this.$refs.tree;
    let arrayCheckedKeys: any = tree.getCheckedKeys();  // 当前选中的子
    let arrayData: any = tree.getCheckedKeys().concat(tree.getHalfCheckedKeys());  // 当前选中的父+子
    arrayData.forEach((item, i) => {
      if (item == 0) {
        arrayData.splice(i, 1); // 从下标 i 开始, 删除 1 个元素
      }
    })
    // console.log(arrayCheckedKeys);
    // console.log(arrayData);
    return{
      arrayCheckedKeys: arrayCheckedKeys,
      arrayData: arrayData
    }
  }

  /** 按钮 -树状图点击事件
   *  节点被点击时的回调
   * 
   *  @data 属性的数组中该节点所对应的对象
   */
  private handleNodeClick(data, node) {
    console.log(data);
  }

  /** 按钮 -新增
   *  render-content 方法
   * 
   *  @val 属性的数组中该节点所对应的对象
   */
  @Emit('handleMenuAddChange')
  private handleMenuAddChange(val) {
    return val
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  position: relative;
  display: block;
  width: 100%;
  font-size: 14px;
  .v-btn-box {
    z-index: 999;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
