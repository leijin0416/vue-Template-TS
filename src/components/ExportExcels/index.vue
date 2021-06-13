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
              :hide-required-asterisk="true"
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
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" v-if="dialogFormType">{{ $t('Hlin.确定') }}</el-button>
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
import { UserStore } from '@/store/private/user';
import { sessionData } from '@/filters/storage';

type IndexData = {
  page: number;
  pageSize: number;
};

@Component({
  components: {},
})
export default class ExportExcels extends Vue {

  @Prop({ default: [] }) excelsTableHeader: Array<string> = [];      // 表格头
  @Prop({ default: [] }) excelsFilterVal: Array<string> = [];        // 表格参数
  @Prop({ default: '' }) excelsName: string = '';                    // 表格名称
  // @Prop({ default: [] }) excelsTableData: Array<object> = [];     // 表格数据

  private excelsTableData: Array<object> = [];  // 表格数据
  private formData: IndexData = { // 分页器
    page: 1,
    pageSize: 12
  };
  private loadingType: boolean = false;
  private dialogFormVisible: boolean = false;  // 弹窗
  private dialogFormType: boolean = true;      // 类型

  private rules = {
    page: [ { required: true, message: 'err', trigger: 'blur' }],
    pageSize: [ { required: true, message: 'err', trigger: 'blur' } ],
  };

  // 获取数据
  get getExportExcelsList() {
    return UserStore.getExportExcelsList
  };

  // 监听表格数据
  @Watch('getExportExcelsList', { deep: true })
  userPageChange(newValue) {
    // console.log(newValue)
    if(newValue.length > 0) {
      if(newValue[0].ids === 0) {
        this.dialogFormVisible = true;
        this.dialogFormType = true;

      } else {  // 有数据
        this.loadingType = false;
        this.dialogFormVisible = true;
        this.dialogFormType = false;
        this.excelsTableData = newValue;
      }
    } else console.log('数据为空');
  };

  // 生命周期
  mounted () {};

  // 重置
  resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }

  /**
   *  关闭弹窗
   */
  private onDialogClose() {
    this.excelsTableData = [];
    this.dialogFormType = true;
    this.loadingType = false;
    this.formData.page = 1;
    this.formData.pageSize = 12;
    UserStore.storeExportExcelsMap([]);
  }

  /**
   *  提交
   */
  private submitForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        this.onDialogFormClick();
      } else {
        console.log('error submit!!');
        this.loadingType = false;
        return false;
      }
    });
  }

  /**
   *  向父级传递请求参数，传递分页
   */
  private onDialogFormClick() {
    this.$emit('getExportExcelInput', this.formData.page, this.formData.pageSize);
  }

  /** 利用表格参数拿到对应数据
   *  @param filterVal  -表格参数
   *  @param jsonData   -后台数据
   */
  private formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]));
  }

  /** 拿到数据进行导出
   *  https://juejin.cn/post/6966495816429076516  
   *  https://juejin.cn/post/6966062224892756005
   *  @param export_json_to_excel   生成方法
   */
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
      // console.log(list);
      // console.log(tableData);

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

      export_json_to_excel(tableHeader, tableData, name);  // 生成
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
