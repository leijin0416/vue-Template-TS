<template>
  <div class="table-box">
    <el-table
      ref="filterTable"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange" >
      <template v-for="(column, index) in tableColumnData">
        <!--复选框（START）-->
        <el-table-column
          v-if="column.type == 'selection'"
          type="selection"
          :width="column.width ? column.width : 60"
          :align="column.align ? column.align : 'center'">
        </el-table-column>
        <!--序号（END）-->

        <!-- 操作列/自定义列  slot 添加自定义配置项 -->
        <slot v-else-if="column.slot" :name="column.slot" :tit='index'></slot>

        <!-- 默认渲染列-渲染每一列的汉字 -->
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.width"
          :show-overflow-tooltip="true"
          v-else >
        </el-table-column>

      </template>
    </el-table>
    <!-- 分页 -->
    <div class="v-pagination-box">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { sessionData } from '@/filters/storage';

@Component({
  components: {},
})
export default class vElTable extends Vue {
  private pageSize: number = 12;

  @Prop({ default: [] }) tableData!: Array<object>;         // 表格数据
  @Prop({ default: [] }) tableColumnData!: Array<object>;   // 表格表头
  @Prop({ default: '' }) totalCount!: number | string;      //  总信息条数

  // 生命周期
  mounted () {}

  // 复选框
  @Emit("handleSelectionChange")
  private handleSelectionChange(val): void {
    return val;
  }
  
  // 获取用户点击的当前页后刷新页面数据
  @Emit('handleCurrentChange')
  private handleCurrentChange(val) {
    return val
  }

  // 根据用户获取的每页显示页面数量显示页面
  private handleSizeChange(val) {
    console.log(val);
  }

}
</script>

<style lang="scss" scoped>
/deep/.el-table th {background: rgba(249, 249, 249, .8);}
.v-pagination-box {
  padding: 30px 5px 5px;
  text-align: right;
}
</style>
