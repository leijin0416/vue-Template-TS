<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-plus" class="v-btn" @click="onAddsClick">添加合约任务</el-button>
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
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">添加合约任务</div>
      <div slot="title" class="el-dialog__title" v-else>修改合约任务</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item label="合约任务ID" v-if="!dialogFormType">
                <el-input type="text" v-model="formData.taskId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="任务数量">
                <el-input v-model="formData.taskAmount" size="medium"></el-input>
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
import { webGetAdminContractTaskAdd, webGetAdminContractTaskUpdate, webGetAdminContractTaskDelte } from '@/api/index';

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
      prop: 'taskCycle',
      label: '周期',
      width: 'auto',
    },
    {
      prop: 'taskId',
      label: '合约任务ID',
      width: 'auto',
    },
    {
      prop: 'taskAmount',
      label: '任务需要达到的数量',
      width: 'auto',
    },
    {
      prop: 'createId',
      label: '创建人ID',
      width: 'auto',
    },
    {
      prop: 'formatTime',
      label: '创建时间',
      width: '180',
    },
    {
      prop: 'updateId',
      label: '更新人ID',
      width: 'auto',
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      width: '180',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: any = {
    taskAmount: '',
    taskId: '',
    lotAmount: '',
    lotPrice: '',
  }

  private rules: any  = {
    taskAmount: [
      { required: true, message: '请输入合约费用', trigger: 'blur' },
    ],
  }

  // 获取数据
  get getContractTaskList() {
    return ContractListStore.getContractTaskList
  };

  // 监听数据列表
  @Watch('getContractTaskList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data.list;
    // console.log(list);
    
    list.forEach( el => {
      el.formatTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
      el.updateTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.updateTime)
    });
    
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    ContractListStore.storeActionContractTaskList(this.param);
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
    ContractListStore.storeActionContractTaskList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    ContractListStore.storeActionContractTaskList(this.param);
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
    let res: any = await webGetAdminContractTaskDelte({
      'taskId': row.taskId,
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
      let { taskAmount, } = this.formData;
      let res: any = await webGetAdminContractTaskAdd({
        'taskAmount': taskAmount,
      })
      // console.log(res);
      
      MessageTips(res, true, true, '添加成功', item => {
        this.dialogFormVisible = false;
        this.onRefreshClick();
      }, null);
    } else {
      let { taskAmount, taskId, } = this.formData;
      let res: any = await webGetAdminContractTaskUpdate({
        'taskAmount': taskAmount,
        'taskId': taskId,
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