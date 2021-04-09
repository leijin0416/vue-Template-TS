<template>
  <!-- 管理员列表 -->
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddsClick">添加管理员账号</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagAdminId" label="账号状态" align="center" width="160">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1 ? true : false"
                active-text="正常"
                inactive-text="禁用"
                @change="onSwitchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column slot="operateButton" label="操作" align='center' width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="handleOpenClick(scope.row)" class="v-btn-red">删除</el-button>
            </template>
          </el-table-column> -->
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">添加管理员账号</div>
      <div slot="title" class="el-dialog__title" v-else>修改管理员账号</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item label="管理员用户名" prop="userName" >
                <el-input type="text" v-model="formData.userName" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input type="text" v-model="formData.password" size="medium" show-password></el-input>
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
import md5 from 'js-md5';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { AdminSystemStore } from '@/store/private/AdminIstrators';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminRegisterAdd, webGetAdminPageDisable, webGetAdminContractUpdate, webGetAdminContractDelte } from '@/api/index';

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
export default class administrators extends Vue {
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
      prop: 'adminId',
      label: '管理员ID',
      width: 'auto',
    },
    {
      prop: 'userName',
      label: '管理员用户名',
      width: 'auto',
    },
    {
      prop: 'password',
      label: '管理员密码',
      width: '350',
    },
    {
      prop: 'contractId',
      label: '管理员角色',
      width: '160',
    },
    {slot: 'operateTagAdminId'},
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
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData = {
    userName: '',
    password: '',
    contractId: '',
    lotAmount: '',
  };

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
  get getContractList() {
    return AdminSystemStore.getAdminSystemPageList
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
    AdminSystemStore.storeActionAdminPageList(this.param);
  };

  // 生命周期
  mounted () {
  };

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
    AdminSystemStore.storeActionAdminPageList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    AdminSystemStore.storeActionAdminPageList(this.param);
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

  // 激活/锁定 账号
  private async onSwitchChange(row) {
    // 激活
    if (row.status === 0) {
      let params = {
        status: 1,
        adminId: row.adminId
      }
      // console.log(params);
      
      let res: any = await webGetAdminPageDisable(params)
      MessageTips(res, true, true, '修改成功', item => {
        AdminSystemStore.storeActionAdminPageList(this.param);
      }, null);
    } else {
      let params = {
        status: 0,
        adminId: row.adminId
      }
      // console.log(params);
      
      let res: any = await webGetAdminPageDisable(params)
      MessageTips(res, true, true, '修改成功', item => {
        AdminSystemStore.storeActionAdminPageList(this.param);
      }, null);

    }
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

  // 确认提交
  private async onDialogFormClick() {
    let type = this.dialogFormType;
    if(type) {
      let { userName, password } = this.formData;
      let md5s = md5(password).toUpperCase();
      const res: any = await webGetAdminRegisterAdd({
        'userName': userName,
        'password': md5s,
      })
      // console.log(res);
      
      MessageTips(res, true, true, '添加成功', item => {
        this.onRefreshClick();
        this.resetForm('ruleForm');
      }, null);

    } else {
      let { contractId, } = this.formData;
      const res: any = await webGetAdminContractUpdate({
        'contractId': contractId,
      })
      MessageTips(res, true, true, '修改成功', item => {
        this.onRefreshClick();
        this.resetForm('ruleForm');
      }, null);
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  min-height: 800px;
  /deep/.el-switch__label {color: #909399;}
  /deep/.el-switch__label.is-active {
    font-weight: bold;
    color: #409EFF;
  }
}
</style>