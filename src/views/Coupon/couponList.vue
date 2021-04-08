<template>
  <!-- 消费券列表 -->
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
            <el-form-item label="合约名称">
              <el-select v-model="param.contractId" placeholder="请选择" size="small">
                <el-option
                  v-for="item in formOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优惠码">
              <el-input type="text" v-model="param.couponCode" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >搜 索</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">重置</el-button>
          </el-form>
        </div>
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-plus" class="v-btn" @click="onAddsClick">添加优惠券</el-button>
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
                <el-tooltip class="item" effect="dark" content="生效中的优惠券不能再次选择" placement="right-start" >
                  <i class="el-icon-info v-icon-box"></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="优惠券ID" v-else>
                <el-input type="text" v-model="formData.couponId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="优惠券面值" prop="amount">
                <el-input type="number" v-model="formData.amount" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="优惠券数量" prop="couponNumber">
                <el-input type="number" v-model="formData.couponNumber" size="medium"></el-input>
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
import { webGetAdminCouponAdd, webGetAdminCouponUpdate, webGetAdminCouponDelte } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number,
  pageSize: number,
  contractId: string,
  couponCode: string
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
    contractId: '',
    couponCode:'',
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
      width: '200',
    },
    {
      prop: 'couponCode',
      label: '优惠码',
      width: 'auto',
    },
    {
      prop: 'couponId',
      label: '优惠券ID',
      width: '200',
    },
    {
      prop: 'amount',
      label: '优惠券面值',
      width: 'auto',
    },
    {
      prop: 'couponNumber',
      label: '优惠券数量',
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
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private formOptions: any = []
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: any = {
    amount: '',
    couponNumber: '',
    couponId: '',
    contractId: '',
  }

  private rules: any  = {
    couponNumber: [
      { required: true, message: '请输入优惠券数量', trigger: 'blur' },
    ],
    amount: [
      { required: true, message: '请输入优惠券面值', trigger: 'blur' },
      {
        required: true,
        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
        message: '暂不支持特殊字符',
        trigger: 'blur'
      }
    ],
    limitAmount: [
      { required: true, message: '请输入身份证号', trigger: 'blur' },
      { min: 15, max: 18, message: '请如实填写18位号码，以供学校保卫科核对', trigger: 'blur' },
      {
        required: true,
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '请输入正确的身份证号码',
        trigger: 'blur'
      }
    ]
  }

  // 获取数据
  get getCouponList() {
    return ContractListStore.getCouponList
  };
  get getContractActivityId() {
    return ContractListStore.getContractActivityId
  };
  

  // 监听数据列表
  @Watch('getCouponList', { deep: true })
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
    ContractListStore.storeActionCouponList(this.param);
    ContractListStore.storeActionContractActivityId({});  // 合约列表
  };

  // 生命周期
  mounted () {}

  private submitSearchForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        ContractListStore.storeActionCouponList(this.param);
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 重置
  private resetForm(formName:string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };
  private resetSearchForm(formName:string) {
    const _that = this;
    Object.keys(_that.param).forEach(key => {
      if(key == 'contractId' || key == 'couponCode') _that.param[key] = ''
    });
    ContractListStore.storeActionCouponList(this.param);
    // console.log(this.param);
  };

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    ContractListStore.storeActionCouponList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    ContractListStore.storeActionCouponList(this.param);
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
    let res: any = await webGetAdminCouponDelte({
      'couponId': row.couponId,
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
      let { amount, contractId, couponNumber, } = this.formData;
      // console.log(this.formData);
      let res: any = await webGetAdminCouponAdd({
        'amount': amount,
        'contractId': contractId,
        'couponNumber': couponNumber,
      })
      // console.log(res);
      
      MessageTips(res, true, true, '添加成功', item => {
        this.dialogFormVisible = false;
        this.onRefreshClick();
      }, null);
    } else {
      let { amount, couponId, couponNumber } = this.formData;
      
      let res: any = await webGetAdminCouponUpdate({
        'amount': amount,
        'couponId': couponId,
        'couponNumber': couponNumber,
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
.v-button-box {
  padding-top: 10px;
}
/deep/.el-dialog {
  .v-icon-box {
    cursor: pointer;
    margin-left: 8px;
    color: #57aaff;
  }
}

// 表格头部搜索
.v-header-search {
  border-bottom: 1px solid #eee;
  /deep/.el-form--inline .el-form-item, .v-btn {
    vertical-align: middle;
    margin-bottom: 10px;
  }
  .v-btn {margin-left: 15px;}
}
</style>