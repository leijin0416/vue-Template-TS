<template>
  <!-- 版本升级 -->
  <div class="pages">
    <el-row>
      <el-col :span="24">
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagAppType" :label="this.$t('Aelt.版本类型')" align="center" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.appType === 'person'">{{ $t('Aelt.会员') }}</el-tag>
              <el-tag v-else>{{ $t('Aelt.商户') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateTagType" :label="this.$t('Aelt.APP类型')" align="center" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 'android'">{{ $t('Aelt.安卓') }}</el-tag>
              <el-tag v-else>{{ $t('Aelt.苹果') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateButton" :label="this.$t('Aelt.操作')" align='center' width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)" icon="el-icon-edit-outline">{{ $t('Aelt.修改') }}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title">{{ $t('Aelt.修改版本信息') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item :label="this.$t('Aelt.版本名称')" prop="versionName" >
                <el-input type="text" v-model="formData.versionName" size="medium" ></el-input>
              </el-form-item>
              <el-form-item :label="this.$t('Aelt.版本号')" prop="versionCode" >
                <el-input type="text" v-model="formData.versionCode" size="medium" ></el-input>
              </el-form-item>
              <el-form-item :label="this.$t('Aelt.说明')" prop="content" >
                <el-input type="text" v-model="formData.content" size="medium" ></el-input>
              </el-form-item>
              <el-form-item :label="this.$t('Aelt.下载地址')" prop="downloadUrl" >
                <el-input 
                  type="textarea" 
                  v-model="formData.downloadUrl"
                  :autosize="{ minRows: 2, maxRows: 4}"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">{{ $t('Aelt.确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { AdminSystemStore } from '@/store/private/StoreAdminIstrators';
import { deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminEditionUpdate, } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number;
  pageSize: number;
};
type FormData = {
  appType: string;
  content: string;
  downloadUrl: string;
  type: string;
  versionCode: string;
  versionName: string;
};

@Component({
  name: "EditionList",
  components: {
    ElTable
  },
})
export default class extends Vue {
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
    {slot: 'operateTagAppType'},
    {slot: 'operateTagType'},
    {
      prop: 'content',
      label: window['vm'].$t('Aelt.说明'),
      width: 'auto',
    }, 
    {
      prop: 'downloadUrl',
      label: window['vm'].$t('Aelt.下载地址'),
      width: 'auto',
    },
    {
      prop: 'versionName',
      label: window['vm'].$t('Aelt.版本名称'),
      width: '160',
    },
    {
      prop: 'versionCode',
      label: window['vm'].$t('Aelt.版本号'),
      width: '160',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private loadingType:boolean = false;
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: FormData = {
    appType: '',
    content: '',
    downloadUrl: '',
    type: '',
    versionCode: '',
    versionName: ''
  };

  private rules = {
    versionName: [
      { required: true, message: window['vm'].$t('Aelt.请输入版本名称'), trigger: 'blur' },
    ],
    downloadUrl: [
      { required: true, message: window['vm'].$t('Aelt.请输入下载地址'), trigger: 'blur' },
    ],
    versionCode: [
      { required: true, message: window['vm'].$t('Aelt.请输入版本号'), trigger: 'blur' },
    ],
    content: [
      { required: true, message: window['vm'].$t('Aelt.请输入说明'), trigger: 'blur' },
    ],
  };

  // 获取数据
  get getAdminSysEditionList() {
    if(AdminSystemStore.getAdminSysEditionList.code === 200) {
      return AdminSystemStore.getAdminSysEditionList
    }
  };

  // 监听数据列表
  @Watch('getAdminSysEditionList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = 4;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    AdminSystemStore.storeActionAdminSysEditionList(this.param);
  };

  // 生命周期
  mounted () {
  };

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    AdminSystemStore.storeActionAdminSysEditionList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    AdminSystemStore.storeActionAdminSysEditionList(this.param);
  }

  // 添加
  private onAddsClick() {
    Object.keys(this.formData).forEach(key => this.formData[key] = '');
    this.dialogFormVisible = true;
    this.dialogFormType = true;
  }

  // 删除
  private handleOpenDeleteClick(row) {
    const _that = this;
    _that.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      // _that.handleRowDeleteClick(row)
    })
  }

  // 修改
  private handleRowModifyClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;
    _that.formData = obj;
  }

  private submitForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    _that.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        _that.onDialogFormClick();
      } else {
        _that.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 确认提交
  private async onDialogFormClick() {
    let res = await webGetAdminEditionUpdate(this.formData)
    const text = window['vm'].$t('Aelt.修改成功');
    MessageTips(res, true, true, text, item => {
      this.loadingType = false;
      this.dialogFormVisible = false;
      this.onRefreshClick();
    }, null);
  }
}
</script>

<style lang='scss' scoped>
.pages {
  min-height: 800px;
  padding: 15px;
}
</style>