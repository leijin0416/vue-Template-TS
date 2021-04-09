<template>
  <!-- 提币列表 -->
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-header-search">
          <el-form
            ref="ruleSearchForm"
            label-width="100px"
            class="demo-form-inline"
            :inline="true" 
            :rules="rules"
            :model="param">
            <el-form-item label="订单状态">
              <el-select v-model="param.status" placeholder="请选择" size="small">
                <el-option
                  v-for="item in formOptionsStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input type="text" v-model="param.userId" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >搜 索</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">重 置</el-button>
          </el-form>
        </div>
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddsClick">手动提币</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateStatus" label="订单状态" align='center' width="110">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 2">审核通过</el-tag>
              <el-tag type="info" v-else-if="scope.row.status === 1">待审核</el-tag>
              <el-tag type="danger" v-else-if="scope.row.status === 3">提币拒绝</el-tag>
              <el-tag type="danger" v-else>提币失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateButton" label="操作" align='center' width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)" v-if="scope.row.status === 1">提币审核</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">手动提币</div>
      <div slot="title" class="el-dialog__title" v-else>提币审核</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData"
              v-if="dialogFormType"
            >
              <el-form-item label="用户ID" prop="userId">
                <el-input type="text" v-model="formData.userId" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="币种类型" prop="mold">
                <el-radio-group v-model="formData.mold">
                  <el-radio label="ERC20"></el-radio>
                  <el-radio label="TRC20"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="币种名称" prop="coin">
                <el-input v-model="formData.coin" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="提币数量" prop="amount">
                <el-input type="number" v-model="formData.amount" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="手续费" prop="fee">
                <el-input v-model="formData.fee" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="提币地址" prop="address">
                <el-input v-model="formData.address" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="原因" prop="reason">
                <el-input v-model="formData.reason" size="medium"></el-input>
              </el-form-item>
            </el-form>
            <el-form
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData"
              v-else
            >
              <el-form-item label="订单编号" prop="withdrawOrderId">
                <el-input type="text" v-model="formData.withdrawOrderId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="订单状态" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio label="2">通过</el-radio>
                  <el-radio label="3">拒绝</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { UserAssetsListStore } from '@/store/private/PageUserAssets';
import { webGetAdminAssetsCarryManual, webGetAdminAssetsCarryExamine } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number,
  pageSize: number,
  userId: string,
  status: string,
};
type FormData = {
  mold: string,
  address: string,
  amount: string | number,
  coin: string,
  fee: string,
  userId: string,
  reason: string,
  status: string,
  withdrawOrderId: string,
};

@Component({
  components: {
    ElTable
  },
})
export default class userCarry extends Vue {
  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12,
    userId: '',
    status: '',
  };
  private formOptionsStatus: object = [
    {
      label: '审核通过',
      value: '2'
    },
    {
      label: '待审核',
      value: '1'
    },
    {
      label: '提币拒绝',
      value: '3'
    }
  ]
  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {
      prop: 'id',
      label: '订单编号',
      width: '180',
    },
    {
      slot: 'operateStatus',
    },
    {
      prop: 'userId',
      label: '用户ID',
      width: '180',
    },
    {
      prop: 'coin',
      label: '币种',
      width: 'auto',
    },
    {
      prop: 'amount',
      label: '数量',
      width: 'auto',
    },
    {
      prop: 'address',
      label: '地址',
      width: 'auto',
    },
    {
      prop: 'fee',
      label: '手续费',
      width: 'auto',
    },
    {
      prop: 'reason',
      label: '原因',
      width: 'auto',
    },
    {
      prop: 'createTime',
      label: '创建时间',
      width: '165',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private loadingType:boolean = false;
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: FormData = {
    mold: '',
    address: '',
    amount: '',
    coin: '',
    fee: '',
    userId: '',
    reason: '',
    status: '',
    withdrawOrderId: '',
  };

  private rules = {
    userId: [
      { required: true, message: '用户ID不能为空', trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: '不能含有空格',
        trigger: 'blur'
      },
    ],
    mold: [
      { required: true, message: '币种类型不能为空', trigger: 'blur' },
    ],
    coin: [
      { required: true, message: '币种不能为空', trigger: 'blur' },
    ],
    address: [
      { required: true, message: '提币地址不能为空', trigger: 'blur' },
    ],
    amount: [
      { required: true, message: '提币数量不能为空', trigger: 'blur' },
    ],
    fee: [
      { required: true, message: '手续费不能为空', trigger: 'blur' },
    ],
    reason: [
      { required: true, message: '原因不能为空', trigger: 'blur' },
    ],
    status: [
      { required: true, message: '订单状态不能为空', trigger: 'blur' },
    ],
    withdrawOrderId: [
      { required: true, message: '订单编号不能为空', trigger: 'blur' },
    ],
  };

  // 获取数据
  get getAssetsCarryList() {
    return UserAssetsListStore.getAssetsCarryList
  };

  // 监听数据列表
  @Watch('getAssetsCarryList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data.list;
    // console.log(list);
    
    list.forEach( el => {
      el.createTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
    });
    
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    UserAssetsListStore.storeActionPageAssetsCarryList(this.param);
  };

  // 生命周期
  mounted () {
  };

  // 重置
  private resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  }
  private resetSearchForm(formName:string) {
    const _that = this;
    Object.keys(_that.param).forEach(key => {
      if(key == 'userId' || key == 'status') _that.param[key] = '';
    });
    UserAssetsListStore.storeActionPageAssetsCarryList(this.param);
    // console.log(this.param);
  }

  private submitSearchForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        UserAssetsListStore.storeActionPageAssetsCarryList(this.param);
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    UserAssetsListStore.storeActionPageAssetsCarryList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    UserAssetsListStore.storeActionPageAssetsCarryList(this.param);
  }

  // 手动提币
  private onAddsClick() {
    Object.keys(this.formData).forEach(key =>this.formData[key]='');
    this.dialogFormVisible = true;
    this.dialogFormType = true;
  }

  // 提币审核
  private handleRowModifyClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;
    _that.formData = obj;
  }

  private submitForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        _that.onDialogFormClick();
      } else {
        this.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 确认提交
  private async onDialogFormClick() {
    let type = this.dialogFormType;
    if(type) {
      let res: any = await webGetAdminAssetsCarryManual(this.formData);
      // console.log(res);
      MessageTips(res, true, true, '订单手动提币成功', item => {
        this.dialogFormVisible = false;
        this.loadingType = false;
        this.onRefreshClick();
      }, err => {
        this.loadingType = false;
      });

    } else {
      let { status, withdrawOrderId, } = this.formData;
      let res: any = await webGetAdminAssetsCarryExamine({
        'status': status,
        'withdrawOrderId': withdrawOrderId,
      });
      MessageTips(res, true, true, '订单提币审核成功', item => {
        this.dialogFormVisible = false;
        this.loadingType = false;
        this.onRefreshClick();
      }, err => {
        this.loadingType = false;
      });
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  min-height: 800px;
  padding: 15px;
}
// 表格头部搜索
.v-header-search {
  border-bottom: 1px solid #eee;
  /deep/.el-form--inline .el-form-item, .v-btn {
    vertical-align: middle;
    margin-bottom: 15px;
  }
  .v-btn {margin-left: 15px;}
}
.v-button-box {
  padding-top: 15px;
}
</style>