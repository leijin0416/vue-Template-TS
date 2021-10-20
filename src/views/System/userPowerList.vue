<template>
  <!-- 管理员列表 -->
  <div class="pages">
    <el-row>
      <el-col :span="24">
        <div class="v-refresh-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddsClick">{{ $t('Sats.添加管理员账号') }}</el-button>
          <el-button size="small" icon="el-icon-download" class="v-btn" @click="onExportClick">{{ $t('Sats.导出Excel') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagAdminId" :label="$t('Sats.账号状态')" align="center" width="auto">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1 ? true : false"
                :active-text="$t('Sats.正常')"
                :inactive-text="$t('Sats.禁用')"
                @change="handleOpenClick(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column slot="operateTagRoleName" :label="$t('Sats.管理员角色名称')" width="auto" align="center">
            <template slot-scope="scope">
              <el-tag>{{scope.row.roleName ? scope.row.roleName : $t('Sats.暂无') }}</el-tag>
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
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">{{ $t('Sats.添加管理员账号') }}</div>
      <div slot="title" class="el-dialog__title" v-else>{{ $t('Sats.修改管理员账号') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item :label="$t('Sats.管理员用户名')" prop="userName" >
                <el-input type="text" v-model="formData.userName" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Sats.登录密码')" prop="password">
                <el-input type="password" v-model="formData.password" size="medium" show-password></el-input>
              </el-form-item>
              <el-form-item :label="$t('Sats.用户角色')" prop="roleId">
                <el-select v-model="formData.roleId" :placeholder="$t('Sats.请选择')">
                  <el-option
                    v-for="item in optionsRoleIdData"
                    :key="item.roleId"
                    :label="item.name"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">{{ $t('Sats.重置') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">{{ $t('Sats.确定') }}</el-button>
      </div>
    </el-dialog>
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
import { 
  webGetAdminRegisterAdd, 
  webGetAdminPageDisable, 
  webGetAdminPageList 
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ExportExcels from "@/components/ExportExcels/index.vue";

type IndexData = {
  page: number;
  pageSize: number
};

@Component({
  name: "UserPowerList",
  components: {
    ElTable,
    ExportExcels
  },
})
export default class extends Vue {
  private vm = window['vm'];

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
      prop: 'adminId',
      label: this.vm.$t('Sats.管理员ID'),
      width: '200',
    },
    {
      prop: 'userName',
      label: this.vm.$t('Sats.管理员用户名'),
      width: 'auto',
    },
    {slot: 'operateTagRoleName'},
    {slot: 'operateTagAdminId'},
    {
      prop: 'formatTime',
      label: this.vm.$t('Sats.创建时间'),
      width: '200',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private loadingType:boolean = false;
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData = {
    userName: '',
    password: '',
    contractId: '',
    roleId: ''
  };
  private optionsRoleIdData = [];  // 角色列表

  private excelsTableHeader = [ '管理员ID', '管理员用户名', '管理员角色名称' ];  // 表格头
  private excelsFilterVal = [ 'adminId', 'userName', 'roleName' ];   // 表格参数
  private excelsName: string = 'Aelt.管理员列表';        // 表格名

  private rules = {
    userName: [
      { required: true, message: this.vm.$t('Sats.请输入管理员用户名'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: this.vm.$t('Sats.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
    password: [
      { required: true, message: this.vm.$t('Sats.请输入登录密码'), trigger: 'blur' },
      { min: 6, max: 18, message: this.vm.$t('Sats.密码长度'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: this.vm.$t('Sats.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
    roleId: [
      { required: true, message: this.vm.$t('Sats.请选择管理员用户角色'), trigger: 'change' },
    ],
  };

  // 获取数据
  get getAdminSystemPageList() {
    if(AdminSystemStore.getAdminSystemPageList.code === 200) {
      return AdminSystemStore.getAdminSystemPageList
    }
  };
  get getAdminSystemMenuRoleList() { // 角色列表
    // console.log(AdminSystemStore.getAdminSystemMenuRoleList);
    if(AdminSystemStore.getAdminSystemMenuRoleList.code === 200) {
      return AdminSystemStore.getAdminSystemMenuRoleList
    }
  };

  // 监听数据列表
  @Watch('getAdminSystemMenuRoleList', { deep: true })
  getMenuRoleList(newValue) {
    let list = newValue.data.list;
    if(list.length > 0) {
      this.optionsRoleIdData = list;
    }
    // console.log(newValue)
  };
  @Watch('getAdminSystemPageList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data.list;
    if(list.length > 0) {
      list.forEach( el => {
        el.formatTime = FTisFormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime);
      });
    }
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    AdminSystemStore.webGetAdminMenuRoleList(this.param);
    AdminSystemStore.storeActionAdminPageList(this.param);
  };

  // 生命周期
  mounted () {};

  // 导出
  private onExportClick() {
    UserStore.storeExportExcelsMap([{ids: 0}])
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
    AdminSystemStore.storeActionAdminPageList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    AdminSystemStore.storeActionAdminPageList(this.param);
  }

  // 导出
  private async getExportExcelInput(page, pageSize) {
    let res = await webGetAdminPageList({
      'page': page,
      'pageSize': pageSize,
    })
    if(res.data.data.list.length > 0) UserStore.storeExportExcelsMap(res.data.data.list)
    
    // console.log(res);
    // console.log(`${page}__${pageSize}`);
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

  // 表格Switch操作 确认框
  private handleOpenClick(row, id) {
    const _that = this;
    const text1 = this.vm.$t('Sats.此操作将执行重要信息');
    const text2 = this.vm.$t('Sats.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: this.vm.$t('Sats.确定'),
      cancelButtonText: this.vm.$t('Sats.取消'),
      type: 'warning',
    }).then(() => {
      _that.onSwitchChange(row)  // 用户状态
    })
  }

  // 激活/锁定 账号
  private async onSwitchChange(row) {
    if (row.status === 0) { // 激活
      let params = {
        status: 1,
        adminId: row.adminId
      }
      // console.log(params);
      
      let res = await webGetAdminPageDisable(params)
      const text = this.vm.$t('Sats.激活成功');
      MessageTips(res, true, true, text, item => {
        AdminSystemStore.storeActionAdminPageList(this.param);
      }, null);
    } else {
      let params = {
        status: 0,
        adminId: row.adminId
      }
      // console.log(params);
      
      let res = await webGetAdminPageDisable(params)
      const text = this.vm.$t('Sats.禁用成功');
      MessageTips(res, true, true, text, item => {
        AdminSystemStore.storeActionAdminPageList(this.param);
      }, null);

    }
  }

  private submitForm(formName: string) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        this.onDialogFormClick();
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
    let { userName, password, roleId, contractId} = this.formData;
    if(type) {
      let md5s = md5(password).toUpperCase();
      const res = await webGetAdminRegisterAdd({
        'userName': userName,
        'password': password,
        'roleId': roleId
      })
      // console.log(res);
      
      const text = this.vm.$t('Sats.添加成功');
      MessageTips(res, true, true, text, item => {
        this.loadingType = false;
        this.onRefreshClick();
        this.resetForm('ruleForm');
      }, err => {
        this.loadingType = false;
      });

    }
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