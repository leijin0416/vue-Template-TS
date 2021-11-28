<template>
  <div class="pages">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="v-header-search">
          <el-form
            ref="ruleSearchForm"
            label-width="auto"
            class="demo-form-inline"
            :inline="true"
            :rules="rules"
            :model="param">
            <el-form-item :label="$t('Intory.商品名称')">
              <el-input type="text" v-model="param.productName" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('Intory.搜索') }}</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('Intory.重置') }}</el-button>
          </el-form>
        </div>
        <div class="v-refresh-box" style="min-height: 30px" >
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddIntoryClick">{{ $t('Intory.添加商品') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
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
import { deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminPageUserList } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
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
  private getTablePagesList: any = {};

  private totalCount: number = 1;  // 表格总数
  private tableData: any = [];  // 表格数据
  private tableColumnData = [
    {
      type: 'selection',
    },
    {
      prop: 'levelName',
      label: this.vm.$t('Uge.等级名称'),
      width: '200',
    },
    {
      prop: 'levelCondition',
      label: this.vm.$t('Uge.描述'),
      width: 'auto',
    },
    {
      slot: 'operateTagLevelType', //内容slot
    },
  ]; // 表格行头

  // 获取数据
  get getUserPageList() {
    const data = UserListStore.getUserPageList;
    if(data.code === 200) return data
  };

  // 监听数据列表
  @Watch('getUserPageList', { deep: true })
  getWatchUserPageList(newValue) {
    // console.log(newValue)
    const list = newValue.data.list;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      // obj.forEach( el => {
      //   el.createTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime);
      // });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
  };

  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {};

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  private async getPagesList() {
    const {data: res} = await webGetAdminPageUserList(
      { ...this.param }
    );
    if(res.code === 200) this.getTablePagesList = res;
    else console.log(res);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val;
    this.getPagesList();
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    this.getPagesList();
  }
  
  // 重置
  private resetSearchForm() {
    Object.keys(this.param).forEach(key => {
      if(key == 'page' || key == 'pageSize') return
      else this.param[key] = ''
    });
    this.getPagesList();
    // console.log(this.param);
  }

  // 搜索
  private submitSearchForm(formName: string) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        this.getPagesList();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
}
</script>

<style lang='scss' scoped>
// 表格头部搜索
.v-header-search {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  /deep/.el-form-item__label {padding-left: 12px;}
  /deep/.el-form--inline .el-form-item, .v-btn {
    vertical-align: middle;
    margin-bottom: 15px;
  }
  .v-btn {margin-left: 15px;}
}
.pages {
  overflow: hidden;
}
</style>