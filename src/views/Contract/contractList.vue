<template>
  <!-- 合约列表 -->
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-plus" class="v-btn" @click="onAddsClick">添加合约</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
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
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">添加合约</div>
      <div slot="title" class="el-dialog__title" v-else>修改合约</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item label="合约名称" v-if="dialogFormType">
                <el-input type="text" v-model="formData.contractName" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="合约ID" v-else>
                <el-input v-model="formData.contractId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="合约费用" prop="contractCost">
                <el-input type="number" v-model="formData.contractCost" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="lot数量" prop="lotAmount">
                <el-input type="number" v-model="formData.lotAmount" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="lot价格" prop="lotPrice" v-if="!dialogFormType">
                <el-input type="number" v-model="formData.lotPrice" size="medium"></el-input>
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
import { webGetAdminContractAdd, webGetAdminContractUpdate, webGetAdminContractDelte } from '@/api/index';

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
      prop: 'contractId',
      label: '合约ID',
      width: 'auto',
    },
    {
      prop: 'contractCost',
      label: '合约费用',
      width: 'auto',
    },
    {
      prop: 'lotAmount',
      label: 'lot数量',
      width: '150',
    },
    {
      prop: 'lotPrice',
      label: 'lot价格',
      width: '150',
    },
    {
      prop: 'createId',
      label: '创建人ID',
      width: '150',
    },
    {
      prop: 'formatTime',
      label: '创建时间',
      width: '180',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: any = {
    contractCost: '',
    contractId: '',
    lotAmount: '',
    lotPrice: '',
    contractName: '',
  }

  private rules: any  = {
    contractCost: [
      { required: true, message: '请输入合约费用', trigger: 'blur' },
    ],
    lotPrice: [
      { required: true, message: '请输入价格', trigger: 'blur' },
    ],
    lotAmount: [
      { required: true, message: '请输入数量', trigger: 'blur' },
    ],
  }

  // 获取数据
  get getContractList() {
    return ContractListStore.getContractList
  };

  // 监听数据列表
  @Watch('getContractList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data.list;
    // console.log(list);
    
    list.forEach( el => {
      el.formatTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
    });
    
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    ContractListStore.storeActionContractList(this.param);
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
    ContractListStore.storeActionContractList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    ContractListStore.storeActionContractList(this.param);
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
    let res: any = await webGetAdminContractDelte({
      'contractId': row.contractId,
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
      let { contractName, contractCost, lotAmount, lotPrice } = this.formData;
      let res: any = await webGetAdminContractAdd({
        'contractName': contractName,
        'contractCost': contractCost,
        'lotAmount': lotAmount,
      })
      // console.log(res);
      
      MessageTips(res, true, true, '添加成功', item => {
        this.dialogFormVisible = false;
        this.onRefreshClick();
      }, null);
    } else {
      let { contractId, contractCost, lotAmount, lotPrice } = this.formData;
      let res: any = await webGetAdminContractUpdate({
        'contractId': contractId,
        'contractCost': contractCost,
        'lotAmount': lotAmount,
        'lotPrice': lotPrice,
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

</style>