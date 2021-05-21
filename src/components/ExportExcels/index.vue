<template>
  <!-- 导出excel -->
  <div class="v-excel-main">
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title">{{ $t('Hlin.导出') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15" v-if="dialogFormType">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item :label="$t('Hlin.起始页')" prop="page" >
                <el-input type="text" v-model="formData.page" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Hlin.总条数')" prop="pageSize" >
                <el-input type="text" v-model="formData.pageSize" size="medium"></el-input>
                <p style="color: #999"><i class="el-icon-info"></i> {{ $t('Hlin.您可在分页处看到总条数') }}</p>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="15" v-else>
            <div class="v-text">
              <span><i class="el-icon-circle-check" style="font-size: 24px; color: #67c23a"></i></span>
              <span>{{ $t('Hlin.获取数据成功') }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="dialogFormType">{{ $t('Hlin.确定') }}</el-button>
        <el-button type="primary" 
          @click="onExportExcel"  
          icon="el-icon-download"
          class="v-btn-rd" 
          :loading="loadingType" 
          v-else >{{ $t('Hlin.立即导出') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Prop } from 'vue-property-decorator';
import { sessionData } from '@/filters/storage';
import { AdminSystemStore } from '@/store/private/AdminIstrators';
import { UserStore } from '@/store/private/user';

type IndexData = {
  page: number;
  pageSize: number
};
@Component({
  components: {},
})
export default class UserList extends Vue {
  // @Prop({ default: [] }) excelsTableData: Array<object> = [];     // 表格数据
  @Prop({ default: [] }) excelsTableHeader: Array<object> = [];   // 表格头
  @Prop({ default: [] }) excelsFilterVal: Array<object> = [];     // 表格参数
  @Prop({ default: '' }) excelsName: string = '';

  private excelsTableData: Array<object> = [];
  // 分页器
  private formData: IndexData = {
    page: 1,
    pageSize: 12
  };
  private loadingType: boolean = false;
  private dialogFormVisible: boolean = false;
  private dialogFormType: boolean = true;

  // 获取数据
  get getExportExcelsList() {
    return UserStore.getExportExcelsList
  };

  // 监听数据列表
  @Watch('getExportExcelsList', { deep: true })
  userPageChange(newValue) {
    if(newValue.length > 0) {
      if(newValue[0].ids === 0) {
        this.dialogFormVisible = true;
        this.dialogFormType = true;

      } else {  // 有数据
        this.dialogFormVisible = true;
        this.excelsTableData = newValue;
        this.dialogFormType = false;
      }
    }
    // console.log(newValue)
  };

  // 生命周期
  mounted () {};

  private onDialogClose() {
    this.excelsTableData = [];
    this.dialogFormType = true;
    UserStore.storeExportExcelsMap([])
  }

  private submitForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        this.onDialogFormClick();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
  private onDialogFormClick() {
    this.$emit('getExportExcelInput', this.formData.page, this.formData.pageSize);
  }

  private formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]));
  }

  // 拿到数据导出
  private onExportExcel() {
    let _that = this;
    let text1 = window['vm'].$t('Hlin.导出成功');
    let text2 = window['vm'].$t('Hlin.当前选择的数据已成功导出');

    _that.loadingType = true;
    if (_that.excelsTableData == []) return;
    require.ensure([], () => {
      let { export_json_to_excel } = require("@/utils/excel/Export2Excel.js");

      let tableHeader = _that.excelsTableHeader;
      let filterVal = _that.excelsFilterVal;
      let list = _that.excelsTableData;
      let tableData = _that.formatJson(filterVal, list);

      let text = window['vm'].$t('Hlin.文件导出');
      let name = text + _that.excelsName;
      
      this.$notify({
        title: text1,
        message: text2,
        type: 'success',
        duration: 3000,
        showClose: false,
        onClose: () => {
          _that.dialogFormVisible = false;
          _that.loadingType = false;
        }
      });
      
      export_json_to_excel(tableHeader, tableData, name);
    })
  }
}
</script>
<style lang="scss" scoped>
.v-excel-main {
  padding: 0 15px;
}
/deep/.el-dialog__body {
  .v-text {
    padding: 30px 30px 50px;
    span {
      display: inline-block;
      vertical-align: middle;
      padding: 0 5px;
      font-weight: bold;
    }
  }
}
</style>
