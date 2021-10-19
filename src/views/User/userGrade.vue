<template>
  <div class="pages">
    <el-row>
      <el-col :span="24">
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagLevelShortNameType" :label="this.$t('Uge.阶级')" width="auto">
            <template slot-scope="scope">
              {{scope.row.levelShortName}}
              <el-tag type="info" size="mini" style="margin-left: 15px;" v-if="scope.row.levelType === -1">{{$t('Uge.公司内部')}}</el-tag>
              <el-tag type="info" size="mini" style="margin-left: 15px;" v-else>{{ $t('Uge.会员') }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column slot="operateTagLevelType" :label="this.$t('Uge.全球分红')" align="center" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.levelType === 0">{{ $t('Uge.不需要') }}</el-tag>
              <el-tag v-else-if="scope.row.levelType === 1">{{ $t('Uge.需要') }}</el-tag>
              <el-tag v-else>{{ $t('Uge.公司内部') }}</el-tag>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { UserListStore } from '@/store/common/StorePageUsersList';
import { FTisFormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

interface IndexData {
  page: number;
  pageSize: number;
};

@Component({
  name: "UserGrade",
  components: {
    ElTable
  },
})
export default class extends Vue {
  private vm = window['vm'];

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
      prop: 'levelName',
      label: this.vm.$t('Uge.等级名称'),
      width: '200',
    },
    {
      slot: 'operateTagLevelShortNameType', //内容slot
    },
    {
      prop: 'levelCondition',
      label: this.vm.$t('Uge.描述'),
      width: 'auto',
    },
    {
      slot: 'operateTagLevelType', //内容slot
    },
    {
      prop: 'teamRewardRatio',
      label: this.vm.$t('Uge.团队奖励比例'),
      width: '200',
    },
    {
      prop: 'bonusRewardRatio',
      label: this.vm.$t('Uge.全球分红奖励比例'),
      width: '200',
    },
  ]; // 表格行头

  // 获取数据
  get getUserPageList() {
    if(UserListStore.getUserPageList.code === 200) {
      return UserListStore.getUserPageList
    }
  };

  // 监听数据列表
  @Watch('getUserPageList', { deep: true })
  userPageChange(newValue) {
    // console.log(newValue)
    let list = newValue.data.list;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      obj.forEach( el => {
        el.createTime = FTisFormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime);
      });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
  };

  // 生命周期
  created() {
    // UserListStore.storeActionPageUserList(this.param);
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
    // UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    // UserListStore.storeActionPageUserList(this.param);
  }
}
</script>

<style lang='scss' scoped>
.pages {
  overflow: hidden;
}
</style>