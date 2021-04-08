<template>
  <div class="component">
    <el-tree
      ref="tree"
      :data="childrenRouters"
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      @node-click="handleNodeClick" >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span><i :class="data.icon"></i> {{ node.label }}</span>
        <span v-if="!data.leaf">
          <el-button
            type="text"
            size="mini"
            @click="() => onAddsClick(data)">
            新增
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { sessionData } from '@/filters/storage';

import { childrenRouter } from '@/mock/childrenRouter';

@Component({
  components: {},
})
export default class tree extends Vue {
  private childrenRouters: any = [
    {
      id: 0,
      title: '全部路由',
      children: childrenRouter,
      icon: "el-icon-monitor",
      leaf: false
    }
  ];
  private defaultProps: any = {
    children: 'children',
    label: 'title',
    icon: 'icon',
    leaf: 'leaf'
  };

  private defaultCheckedKeys: any = [];    // 默认勾选的节点的 key 的数组 [0]
  private defaultExpandedKeys: any = [0];  // 默认展开的节点的 key 的数组

  // 生命周期
  mounted () {}

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
   *  @data 属性的数组中该节点所对应的对象
   */
  private onAddsClick(data) {
    console.log(data);
    
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
