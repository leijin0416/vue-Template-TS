<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-plus" class="v-btn" @click="onAddsClick">添加合约限时折扣</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagStatus" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">正常</el-tag>
              <el-tag type="danger" v-else>过期</el-tag>
            </template>
          </el-table-column>

          <el-table-column slot="operateButton" label="操作" align='center' width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="handleOpenClick(scope.row)" class="v-btn-red">删除</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">添加合约限时折扣</div>
      <div slot="title" class="el-dialog__title" v-else>修改合约限时折扣</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="130px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item label="合约名称" v-if="!dialogFormType">
                <el-input type="text" v-model="formData.contractName" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="合约名称" v-if="dialogFormType">
                <el-select v-model="formData.contractId" placeholder="请选择">
                  <el-option
                    v-for="item in formOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" content="生效中的折扣不能再次选择" placement="right-start" >
                  <i class="el-icon-info v-icon-box"></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="限时折扣ID" v-else>
                <el-input type="text" v-model="formData.contractActivityId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="限时折扣数量" prop="limitAmount">
                <el-input v-model="formData.limitAmount" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="限时折扣时间">
                <el-date-picker
                  v-model="formData.limitTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { ContractListStore } from '@/store/private/PageContractList';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminContractActivityAdd, webGetAdminContractActivityUpdate, webGetAdminContractActivityDelte } from '@/api/index';

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
export default class UserList extends Vue {
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
      prop: 'contractName',
      label: '合约名称',
      width: 'auto',
    },
    {
      prop: 'contractActivityId',
      label: '合约限时折扣ID',
      width: 'auto',
    },
    {
      prop: 'limitAmount',
      label: '折扣数量',
      width: 'auto',
    },
    {
      prop: 'limitsTime',
      label: '合约限时折扣时间',
      width: 'auto',
    },
    {
      slot: 'operateTagStatus'
    },
    {
      prop: 'createId',
      label: '创建人ID',
      width: '120',
    },
    {
      prop: 'formatTime',
      label: '创建时间',
      width: '170',
    },
    {
      prop: 'updateId',
      label: '更新人ID',
      width: '120',
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      width: '170',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private formOptions: any = []
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: any = {
    limitAmount: '',
    limitTime: '',
    contractActivityId: '',
    contractId: '',
  }

  private rules: any  = {
    limitAmount: [
      { required: true, message: '请输入合约费用', trigger: 'blur' },
    ],
  }

  // 获取数据
  get getContractActivityList() {
    return ContractListStore.getContractActivityList
  };
  get getContractActivityId() {
    return ContractListStore.getContractActivityId
  };
  

  // 监听数据列表
  @Watch('getContractActivityList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data.list;
    // console.log(list);
    
    list.forEach( el => {
      el.formatTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
      el.updateTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.updateTime)
      el.limitsTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.limitTime)
    });
    
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  @Watch('getContractActivityId', { deep: true })
  contractActivityId(newValue: any) {
    let list = newValue.data;
    // console.log(list);
    list.forEach( el => {
      el.value = el.contractId
      el.label = el.contractName
    });

    this.formOptions = list;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    ContractListStore.storeActionContractActivityList(this.param);
    ContractListStore.storeActionContractActivityId({});
  };

  // 生命周期
  mounted () {
  }

  // 重置
  private resetForm(formName) {
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
    ContractListStore.storeActionContractActivityList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    ContractListStore.storeActionContractActivityList(this.param);
  }

  // 添加
  private onAddsClick() {
    Object.keys(this.formData).forEach(key =>this.formData[key]='');
    this.dialogFormVisible = true;
    this.dialogFormType = true;
  }

  // 修改
  private handleRowModifyClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;
    _that.formData = obj
  }

  // 删除
  private handleOpenClick(row) {
    const _that = this;
    _that.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      _that.handleRowDeleteClick(row)
    })
  }

  private async handleRowDeleteClick(row) {
    let res: any = await webGetAdminContractActivityDelte({
      'contractActivityId': row.contractActivityId,
    })
    // console.log(res);
    
    MessageTips(res, true, true, '删除成功', item => {
      this.onRefreshClick();
    }, null);
  }

  private submitForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        _that.onDialogFormClick();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  };

  // 确认提交
  private async onDialogFormClick() {
    let type = this.dialogFormType;
    if(type) {
      let { limitTime, contractId, limitAmount, } = this.formData;
      // console.log(this.formData);
      let res: any = await webGetAdminContractActivityAdd({
        'limitTime': limitTime,
        'contractId': contractId,
        'limitAmount': limitAmount,
      })
      // console.log(res);
      
      MessageTips(res, true, true, '添加成功', item => {
        this.onRefreshClick();
      }, null);
    } else {
      let { limitTime, contractActivityId, limitAmount } = this.formData;
      
      let res: any = await webGetAdminContractActivityUpdate({
        'limitTime': limitTime,
        'contractActivityId': contractActivityId,
        'limitAmount': limitAmount,
      })
      MessageTips(res, true, true, '修改成功', item => {
        this.dialogFormVisible = false;
        this.onRefreshClick();
      }, null);
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  min-height: 800px;
  padding: 15px;
}
/deep/.el-dialog {
  .v-icon-box {
    cursor: pointer;
    margin-left: 8px;
    color: #57aaff;
  }
}
</style>