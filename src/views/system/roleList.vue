<template>
  <!-- 用户角色列表 -->
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddsClick">{{ $t('Srls.添加用户角色') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagRoleName" :label="$t('Srls.角色名称')" width="200" align="center">
            <template slot-scope="scope">
              <el-tag>{{scope.row.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateButton" :label="$t('Srls.操作')" align='center' width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)" icon="el-icon-edit-outline">{{ $t('Srls.修改') }}</el-button>
              <el-button type="text" size="small" @click="handleOpenClick(scope.row)" icon="el-icon-delete" class="v-btn-red">{{ $t('Srls.删除') }}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">{{ $t('Srls.添加用户角色') }}</div>
      <div slot="title" class="el-dialog__title" v-else>{{ $t('Srls.修改用户角色') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formDialogData">
              <el-form-item :label="$t('Srls.角色ID')" v-if="!dialogFormType" >
                <el-input v-model="formDialogData.roleId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srls.角色名称')" prop="name" >
                <el-input v-model="formDialogData.name" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srls.选择授权菜单')">
                <ElTree
                  :treeType="0"
                  @handleNodeCheck="handleNodeCheck" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">{{ $t('Srls.重置') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">{{ $t('Srls.确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FTisFormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { AdminSystemStore } from '@/store/private/AdminIstrators';
import { webGetAdminRoleAdd, webGetAdminRoleUpdate, webGetAdminRoleDelte } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ElTree from "@/components/ElTree/index.vue";

type IndexData = {
  page: number;
  pageSize: number
};
type IndexDialogData = {
  roleId: number | string;
  name: string;
  menuIds: object;
  childrenMenuId: object
};

@Component({
  components: {
    ElTree,
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
      prop: 'roleId',
      label: window['vm'].$t('Srls.角色ID'),
      width: 'auto',
    },
    {
      slot: 'operateTagRoleName',
    },
    {
      prop: 'createId',
      label: window['vm'].$t('Srls.创建人ID'),
      width: 'auto',
    },
    {
      prop: 'createTime',
      label: window['vm'].$t('Srls.创建时间'),
      width: '200',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private loadingType:boolean = false;
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formDialogData: any = {
    roleId: '',
    name: '',
    menuIds: [],
    childrenMenuId: []
  };

  private rules = {
    name: [
      { required: true, message: window['vm'].$t('Srls.请输入角色名称'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Srls.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
  };

  // 获取数据
  get getAdminSystemMenuRoleList() {
    return AdminSystemStore.getAdminSystemMenuRoleList
  };

  // 监听数据列表
  @Watch('getAdminSystemMenuRoleList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data.list;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      obj.forEach( el => {
        el.createTime = FTisFormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime);
      });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
    
    // console.log(newValue)
  };

  // 生命周期
  created() {
    AdminSystemStore.webGetAdminMenuRoleList(this.param);
    AdminSystemStore.storeActionAdminMenuTreeList({});
  };

  // 生命周期
  mounted () {};

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };

  // 关闭弹窗 Dialog 清空
  private onDialogClose() {
    AdminSystemStore.storeActionAdminMenuTreeList({});
    AdminSystemStore.webGetAdminRoleChildrenMenuId([]);
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    AdminSystemStore.webGetAdminMenuRoleList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    AdminSystemStore.webGetAdminMenuRoleList(this.param);
  }

  // 勾选的路由列表
  private handleNodeCheck(data) {
    this.formDialogData.childrenMenuId = data.arrayCheckedKeys;
    this.formDialogData.menuIds = data.arrayData;
    // console.log(data);
  }

  // 添加
  private onAddsClick() {
    Object.keys(this.formDialogData).forEach(key =>this.formDialogData[key] = '');
    this.dialogFormVisible = true;
    this.dialogFormType = true;
  }

  // 修改
  private handleRowModifyClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;

    _that.formDialogData = obj;
    // _that.formDialogData.roleName = obj.name;
    AdminSystemStore.webGetAdminRoleChildrenMenuId(obj.childrenMenuIds);   // 角色子路由
    // console.log(row);
  }

  // 删除
  private handleOpenClick(row) {
    const _that = this;
    const text1 = window['vm'].$t('Srls.此操作将删除该条信息');
    const text2 = window['vm'].$t('Srls.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: window['vm'].$t('Srls.确定'),
      cancelButtonText: window['vm'].$t('Srls.取消'),
      type: 'warning',
    }).then(() => {
      _that.handleRowDeleteClick(row)
    })
  }
  
  private async handleRowDeleteClick(row) {
    let res = await webGetAdminRoleDelte({
      'roleIds': row.roleId,
    })
    // console.log(res);
    
    const text = window['vm'].$t('Srls.删除成功');
    MessageTips(res, true, true, text, item => {
      this.onRefreshClick();
    }, null);
  }

  private submitForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid && this.formDialogData.menuIds != []) {
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
    let { name, menuIds, childrenMenuId, roleId } = this.formDialogData;
    // console.log(this.formDialogData);
    
    if(type) {
      const res = await webGetAdminRoleAdd({
        'roleName': name,
        'menuIds': menuIds,
        'childrenMenuId': childrenMenuId
      })
      // console.log(res);
      
      const text = window['vm'].$t('Srls.添加成功');
      MessageTips(res, true, true, text, item => {
        this.loadingType = false;
        this.resetForm('ruleForm');
        this.onRefreshClick();
        AdminSystemStore.webGetAdminRoleChildrenMenuId([]);
      }, err => {
        this.loadingType = false;
      });

    } else {
      const res = await webGetAdminRoleUpdate({
        'roleId': roleId,
        'roleName': name,
        'menuIds': menuIds,
        'childrenMenuId': childrenMenuId
      })
      const text = window['vm'].$t('Srls.修改成功');
      MessageTips(res, true, true, text, item => {
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
/deep/.el-dialog__body {
  min-height: 350px;
  .el-form-item:last-child {
    .el-form-item__label {
      line-height: 20px;
    }
  }
}
/deep/.el-tag {
  min-width: 80px;
  text-align: center;
}
.container {
  min-height: 700px;
  /deep/.el-switch__label {color: #909399;}
  /deep/.el-switch__label.is-active {
    font-weight: bold;
    color: #409EFF;
  }
}
</style>