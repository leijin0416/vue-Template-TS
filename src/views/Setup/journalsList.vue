<template>
  <!-- 系统日志列表 -->
  <div class="pages">
    <el-row>
      <el-col :span="24">
        <div class="v-refresh-box">
          <el-button size="small" icon="el-icon-download" class="v-btn" @click="onExportClick">{{ $t('Aelt.导出Excel') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <!-- <el-table-column slot="operateButton" label="操作" align='center' width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)">修改</el-button>
            </template>
          </el-table-column> -->
        </ElTable>
      </el-col>
    </el-row>
    <ExportExcels
     :excelsTableHeader="excelsTableHeader"
     :excelsFilterVal="excelsFilterVal"
     :excelsName="excelsName"
     @getExportExcelInput="getExportExcelInput" />
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { AdminSystemStore } from '@/store/private/StoreAdminIstrators';
import { UserStore } from '@/store/private/user';
import { FTisFormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminPageSysJournalList } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ExportExcels from "@/components/ExportExcels/index.vue";

type IndexData = {
  page: number;
  pageSize: number
};

@Component({
  name: "JournalsList",
  components: {
    ElTable,
    ExportExcels
  },
})
export default class extends Vue {
  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12
  };
  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {
      prop: 'id',
      label: window['vm'].$t('Aelt.日志ID'),
      width: '180',
    },
    {
      prop: 'userName',
      label: window['vm'].$t('Aelt.用户名'),
      width: '200',
    },
    {
      prop: 'url',
      label: window['vm'].$t('Aelt.URL地址'),
      width: 'auto',
    },
    {
      prop: 'method',
      label: window['vm'].$t('Aelt.方法'),
      width: '180',
    },
    {
      prop: 'remark',
      label: window['vm'].$t('Aelt.说明'),
      width: 'auto',
    },
    {
      prop: 'createTime',
      label: window['vm'].$t('Aelt.创建时间'),
      width: '180',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData = {
    userName: '',
    password: '',
    contractId: '',
    roleId: ''
  };
  private optionsRoleIdData: object = [];  // 角色列表

  
  private excelsTableHeader: object = [ '日志ID', '用户名', 'URL地址', '说明' ];  // 表格头
  private excelsFilterVal: object = [ 'id', 'userName', 'url', 'remark'];   // 表格参数
  private excelsName: string = '系统日志列表';        // 表格名

  private rules = {
    userName: [
      { required: true, message: '请输入管理员用户名', trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: '不能含有空格',
        trigger: 'blur'
      },
    ],
    password: [
      { required: true, message: '请输入登录密码', trigger: 'blur' },
      { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: '不能含有空格',
        trigger: 'blur'
      },
    ],
  };

  // 获取数据
  get getAdminSysJournalList() {
    if(AdminSystemStore.getAdminSysJournalList.code === 200) {
      return AdminSystemStore.getAdminSysJournalList
    }
  };

  // 监听数据列表
  @Watch('getAdminSysJournalList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data.list;
    if(list.length > 0) {
      list.forEach( el => {
        el.createTime = FTisFormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.time)
      });
    }
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    AdminSystemStore.storeActionAdminSysJournalList(this.param);
  };

  // 生命周期
  mounted () {};

  // 导出
  private onExportClick() {
    UserStore.storeExportExcelsMap([{ids: 0}])
  }

  // 导出数据
  private async getExportExcelInput(page, pageSize) {
    let res = await webGetAdminPageSysJournalList({
      'page': page,
      'pageSize': pageSize,
    })
    if(res.data.data.list.length > 0) UserStore.storeExportExcelsMap(res.data.data.list)
    
    // console.log(res);
    // console.log(`${page}__${pageSize}`);
  }

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    AdminSystemStore.storeActionAdminSysJournalList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    AdminSystemStore.storeActionAdminSysJournalList(this.param);
  }

  // 添加弹窗
  private onAddsClick() {
    Object.keys(this.formData).forEach(key =>this.formData[key]='');
    this.dialogFormVisible = true;
    this.dialogFormType = true;
  }

  // 修改弹窗
  private handleRowModifyClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;
    _that.formData = obj;
  }

}
</script>

<style lang='scss' scoped>
/deep/.el-dialog__body {
  min-height: 300px;
}
/deep/.el-tag {
  min-width: 80px;
  text-align: center;
}
.pages {
  min-height: 800px;
  /deep/.el-switch__label {color: #909399;}
  /deep/.el-switch__label.is-active {
    font-weight: bold;
    color: #409EFF;
  }
}
</style>