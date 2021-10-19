<template>
  <!-- 员工列表 -->
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
            <el-form-item :label="$t('User.员工编号')">
              <el-input type="text" v-model="param.userName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('User.姓名')">
              <el-input type="text" v-model="param.userName" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('User.搜索') }}</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('User.重置') }}</el-button>
          </el-form>
        </div>
        <div class="v-refresh-box" style="min-height: 30px" >
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddUsersClick">{{ $t('User.注册新员工') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable 
          :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagStatus" :label="$t('User.工作岗位')" width="160" align='center'>
            <template slot-scope="scope">
              <el-tag effect="light" type="info" v-if="scope.row.businessStatus === 0">{{$t('User.普通会员')}}</el-tag>
              <el-tag effect="light" type="info" v-else>{{ $t('User.白金会员') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateTagBindStatus" :label="$t('User.证件类型')" width="160" align='center'>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.bindStatus === 1">{{$t('User.身份证')}}</el-tag>
              <el-tag v-else>{{ $t('User.护照') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            slot="operateTagBindStatus"
            fixed="right"
            :label="$t('User.操作')"
            align='center'
            width="180">
            <template slot-scope="scope">
              <el-button @click="onHandleRightClick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FTisFormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { UserListStore } from '@/store/common/StorePageUsersList';
import { } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

interface IndexData {
  page: number;
  pageSize: number;
  userName: string;
  businessStatus: string;
  bindStatus: string;
};
@Component({
  name: "EmployeeUserList",
  components: {
    ElTable
  },
})
export default class extends Vue {
  private vm = window['vm'];
  
  // 分页器
  public param: IndexData = {
    page: 1,
    pageSize: 12,
    userName: '',
    businessStatus: '',
    bindStatus: '',
  };
  public formOptionsStatus = [
    {
      label: this.vm.$t('User.普通会员'),
      value: '0'
    },
    {
      label: this.vm.$t('User.白银会员'),
      value: '1'
    },
    {
      label: this.vm.$t('User.黄金会员'),
      value: '2'
    },
    {
      label: this.vm.$t('User.白金会员'),
      value: '2'
    },
  ];
  public formOptionsBindStatus = [
    {
      label: this.vm.$t('User.已绑定'),
      value: '1'
    },
    {
      label: this.vm.$t('User.绑定失败'),
      value: '2'
    },
  ];
  public totalCount: number = 1; // 表格总数
  public tableData: any = [];    // 表格数据
  public tableColumnData = [
    {
      type: 'selection',
    },
    {
      prop: 'userId',
      label: this.vm.$t('User.员工编号'),
      width: '180',
    },
    {
      prop: 'userName',
      label: this.vm.$t('User.姓名'),
      width: '200',
    },
    {
      prop: 'userName',
      label: this.vm.$t('User.用户名'),
      width: '200',
    },
    {
      slot: 'operateTagStatus', // 内容slot
    },
    {
      slot: 'operateTagBindStatus', // 内容slot
    },
    {
      prop: 'email',
      label: this.vm.$t('User.证件号码'),
      width: '300',
    },
    {
      prop: 'email',
      label: this.vm.$t('User.电话'),
      width: '300',
    },
    {
      prop: 'email',
      label: this.vm.$t('User.邮箱'),
      width: '300',
    },
    {
      prop: 'createTime',
      label: this.vm.$t('User.紧急联络电话'),
      width: '180',
    },
    {
      prop: 'createTime',
      label: this.vm.$t('User.创建时间'),
      width: '180',
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
    UserListStore.storeActionPageUserList(this.param);
  };

  // 生命周期
  mounted () {};

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val;
    UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    UserListStore.storeActionPageUserList(this.param);
  }
  
  // 重置
  private resetSearchForm(formName: string) {
    Object.keys(this.param).forEach(key => {
      if(key == 'page' || key == 'pageSize') return
      else this.param[key] = ''
    });
    UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }

  // 搜索
  private submitSearchForm(formName: string) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        UserListStore.storeActionPageUserList(this.param);
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  /**
   * @description: 查看更多
   * @param {*} item 数据
   * @return {*}
   */
  private onHandleRightClick(item) {}

  /**
   * @description: 添加用户
   * @return {*}
   */
  private onAddUsersClick() {}
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
  min-height: 700px;
  /deep/.el-tag {
    min-width: 60px;
    text-align: center;
  }
}
</style>