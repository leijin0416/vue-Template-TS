<template>
  <!-- 转账列表 -->
  <div class="container">
    <el-row>
      <el-col :span="24">
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagTradeType" label="交易类型" align="center" width="140">
            <template slot-scope="scope">
              <el-tag>{{scope.row.levelType === 1 ? '充值' : '转账'}}</el-tag>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { UserListStore } from '@/store/private/PageUserList';
import { AdminSystemStore } from '@/store/private/AdminIstrators';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminRegisterAdd } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number,
  pageSize: number,
};

@Component({
  components: {
    ElTable
  },
})
export default class userTurn extends Vue {
  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12,
  };
  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {
      prop: 'userId',
      label: '用户ID',
      width: 'auto',
    },
    {
      prop: 'txId',
      label: '交易ID',
      width: 'auto',
    },
    {
      prop: 'tradeId',
      label: '交易流水号',
      width: '320',
    },
    {
      prop: 'address',
      label: '交易地址',
      width: 'auto',
    },
    {
      prop: 'amount',
      label: '交易金额',
      width: 'auto',
    },
    {
      slot: 'operateTagTradeType', //内容slot
    },
  ]; // 表格行头

  // 获取数据
  get getUserLevelList() {
    return UserListStore.getUserLevelList
  };

  // 监听数据列表
  @Watch('getUserLevelList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data;
    // console.log(list);
    
    this.tableData = list;
    this.totalCount = 7; // newValue.data.total
    // console.log(newValue)
  };

  // 生命周期
  created() {
    // UserListStore.storeActionPageUserLevelList(this.param);
  };

  // 生命周期
  mounted () {};

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    UserListStore.storeActionPageUserLevelList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    UserListStore.storeActionPageUserLevelList(this.param);
  }
}
</script>

<style lang='scss' scoped>
.container {
  min-height: 700px;
  /deep/.el-tag {
    min-width: 60px;
    text-align: center;
  }
}
</style>