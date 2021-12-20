<template>
  <!-- 用户角色列表 -->
  <div class="pages">
    <el-row>
      <el-col :span="24">
        <div class="v-refresh-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddsClick" v-allow="'add'">{{ $t('Srls.添加用户角色') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagRoleName" :label="$t('Srls.角色名称')" width="auto" align="center">
            <template slot-scope="scope">
              <el-tag>{{scope.row.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateButton" :label="$t('Srls.操作')" align='center' width="300" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 3)" icon="el-icon-circle-plus-outline"  v-allow="'add'">{{ $t('Srte.授权按钮') }}</el-button>
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 2)" icon="el-icon-edit-outline"  v-allow="'modify'">{{ $t('Srls.修改') }}</el-button>
              <el-button type="text" size="small" @click="handleOpenClick(scope.row)" icon="el-icon-delete" class="v-btn-red" v-allow="'delete'">{{ $t('Srls.删除') }}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType === 1">{{ $t('Srls.添加用户角色') }}</div>
      <div slot="title" class="el-dialog__title" v-else-if="dialogFormType === 3">{{ $t('Srte.授权按钮') }}</div>
      <div slot="title" class="el-dialog__title" v-else>{{ $t('Srls.修改用户角色') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="16">
            <div v-if="dialogFormType === 3">
              <div class="v-btn-authorize" v-show="dialogFormReturnType">
                <div class="weui-flex">
                  <div class="weui-flex-hd">{{$t('Srls.角色名称')}}</div>
                  <div class="weui-flex-bd">
                    <h3>{{formDialogData.name}}</h3>
                  </div>
                </div>
                <div class="weui-flex">
                  <div class="weui-flex-hd">{{$t('Srte.路由名称')}}</div>
                  <div class="weui-flex-bd">
                    <h3>{{getDialogInfoData.title}}</h3>
                  </div>
                </div>
                <div class="weui-flex">
                  <div class="weui-flex-hd">{{$t('Srte.路由按钮')}}</div>
                  <div class="weui-flex-bd">
                    <el-checkbox-group v-model="formPermission" @change="onCheckboxChange">
                      <el-checkbox label="total" >{{ $t('Srls.全部') }}</el-checkbox>
                      <el-checkbox label="add" >{{ $t('Srls.添加') }}</el-checkbox>
                      <el-checkbox label="modify" >{{ $t('Srls.修改') }}</el-checkbox>
                      <el-checkbox label="delete" >{{ $t('Srls.删除') }}</el-checkbox>
                      <el-checkbox label="buys" v-if="getDialogInfoData.router === '/user/list'" >{{ $t('Srls.购买配套') }}</el-checkbox>
                      <el-checkbox label="damage" v-if="getDialogInfoData.router === '/inventory/list'" >{{ $t('Srls.添加损坏') }}</el-checkbox>
                      <el-checkbox label="progress" v-if="getDialogInfoData.router === '/coach/list'" >{{ $t('Srls.会员学习进度') }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
              <div v-show="!dialogFormReturnType">
                <h3 class="padd-bottom15"><i class="el-icon-warning"></i> {{ $t('Srls.请点击右侧') }}</h3>
                <ElTree
                  :treeType="2"
                  @handleNodeCheck="handleNodeCheck"
                  @handleMenuAddChange="handleMenuAddChange" />
              </div>

            </div>
            <div v-else>
              <el-form
                ref="ruleForm"
                label-width="140px"
                class="demo-ruleForm"
                :rules="rules"
                :model="formDialogData">
                <el-form-item :label="$t('Srls.角色ID')" v-if="dialogFormType !== 1" >
                  <el-input v-model="formDialogData.roleId" size="medium" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('Srls.角色名称')" prop="name" >
                  <el-input v-model="formDialogData.name" size="medium"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Srls.选择授权菜单')">
                  <ElTree
                    :treeType="0"
                    @handleNodeCheck="handleNodeCheck"
                    @handleMenuAddChange="handleMenuAddChange" />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- 按钮 -->
        <el-button @click="onBtnReturnClick" v-if="dialogFormReturnType">{{ $t('Srte.返回') }}</el-button>
        <el-button type="primary" @click="submitFormBtn" :loading="loadingType" v-if="dialogFormReturnType">{{ $t('Srte.确定') }}</el-button>
        <!-- 角色 -->
        <el-button @click="resetForm('ruleForm')" v-if="dialogFormType === 1">{{ $t('Srls.重置') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" v-if="dialogFormType !== 3">{{ $t('Srls.确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { AdminSystemStore } from '@/store/private/StoreAdminIstrators';
import { FTisFormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { 
  webGetAdminRoleAdd, 
  webGetAdminRoleUpdate, 
  webGetAdminRoleDelte,
  webGetAdminRoleButtonUpdate, 
  webGetAdminRoleButtonList
} from '@/api/index';

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
  name: "UserRoleList",
  components: {
    ElTree,
    ElTable
  },
})
export default class extends Vue {
  private vm = window['vm'];

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
      label: this.vm.$t('Srls.角色ID'),
      width: '220',
    },
    {
      slot: 'operateTagRoleName',
    },
    {
      prop: 'createTime',
      label: this.vm.$t('Srls.创建时间'),
      width: '220',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private loadingType:boolean = false;
  private dialogFormType:number = 1;
  private dialogFormReturnType:boolean = false;
  private dialogFormVisible:boolean = false;
  private formDialogData: any = {
    router: '',
    roleId: '',
    name: '',
    menuIds: [],
    childrenMenuId: []
  };
  private getDialogInfoData = {
    menuId: '',
    icon: '',
    title: '',
    router: '',
    type: '1',
    titleEn: '',
    sort: '',
  };
  private formPermission: any = [];

  private rules = {
    name: [
      { required: true, message: this.vm.$t('Srls.请输入角色名称'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: this.vm.$t('Srls.请勿输入空字符'),
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
        el.createTime = FTisFormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
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

  private onBtnReturnClick() {
    this.formPermission = [];
    this.dialogFormReturnType = false;
  }

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };

  // 关闭弹窗 Dialog 清空
  private onDialogClose() {
    this.onBtnReturnClick();
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

  // 添加按钮  -选中
  private onCheckboxChange(item) {
    if(item.length > 1) {
      item.forEach( el => {
        if(el === 'total') this.formPermission = ['total'];
      });
    }
    // console.log(item);
  }

  // 添加角色
  private onAddsClick() {
    Object.keys(this.formDialogData).forEach(key => {
      if(key === 'menuIds' || key === 'childrenMenuId') this.formDialogData[key] = []
      else this.formDialogData[key] = ''
    });
    this.dialogFormVisible = true;
    this.dialogFormType = 1;
  }

  // 获取添加按钮信息
  private handleMenuAddChange(item) {
    // console.log(item);
    const {permission} = item;
    if(permission) {
      const data = permission.split(",");
      this.formPermission = data;
    } 
    this.getDialogInfoData = item;
    this.dialogFormReturnType = true;
  }

   // 查询 授权按钮列表
  private async onGetTreeButton(row) {
    const {data} = await webGetAdminRoleButtonList({'roleId': row.roleId,});
    // console.log(data);
    if(data.code === 200) AdminSystemStore.storeActionAdminMenuTreeButtonList(data)
  }

  // 修改 按钮 | 路由
  private handleRowModifyClick(row, ids) {
    // console.log(row);
    const _that = this;
    const obj = deepCloneData(row);
    if(ids === 3) {
      this.onGetTreeButton(obj);

    } else {
      AdminSystemStore.webGetAdminRoleChildrenMenuId(obj.childrenMenuIds);   // 角色子路由
    }
    _that.dialogFormType = ids;
    _that.formDialogData = obj;
    _that.dialogFormVisible = true;
    // _that.formDialogData.roleName = obj.name;
  }

  // 删除
  private handleOpenClick(row) {
    const _that = this;
    const text1 = this.vm.$t('Srls.此操作将删除该条信息');
    const text2 = this.vm.$t('Srls.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: this.vm.$t('Srls.确定'),
      cancelButtonText: this.vm.$t('Srls.取消'),
      type: 'warning',
    }).then(() => {
      _that.handleRowDeleteClick(row)
    })
  }
  
  private async handleRowDeleteClick(row) {
    let res = await webGetAdminRoleDelte({'roleIds': row.roleId,});
    // console.log(res);
    const text = this.vm.$t('Srls.删除成功');
    MessageTips(res, true, true, text, item => {
      this.onRefreshClick();

    }, null);
  }

  /**
   * @description: 授权按钮
   * @return {*}
   */
  private async submitFormBtn() {
    this.loadingType = true;
    const text = this.vm.$t('Srte.授权成功');
    const { menuId } = this.getDialogInfoData;
    const { roleId } = this.formDialogData;
    
    const res = await webGetAdminRoleButtonUpdate({
      "menuId": menuId,
      "roleId": roleId,
      "permission": this.formPermission.toString(),
    });
    MessageTips(res, true, true, text, item => {
      this.onGetTreeButton(this.formDialogData);
      this.loadingType = false;
      this.dialogFormReturnType = false;
      
    }, err => {
      this.loadingType = false;
    });

  }

  // 提交
  private submitForm(formName: string) {
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
    
    if(type === 1) {
      const res = await webGetAdminRoleAdd({
        'roleName': name,
        'menuIds': menuIds,
        'childrenMenuId': childrenMenuId
      })
      // console.log(res);
      
      const text = this.vm.$t('Srls.添加成功');
      MessageTips(res, true, true, text, item => {
        this.resetForm('ruleForm');
        this.onRefreshClick();
        AdminSystemStore.webGetAdminRoleChildrenMenuId([]);
        this.loadingType = false;
        this.dialogFormVisible = false;

      }, err => {
        this.loadingType = false;
      });

    } else {
      const res = await webGetAdminRoleUpdate({
        'roleId': roleId,
        'roleName': name,
        'menuIds': menuIds,
        'childrenMenuId': childrenMenuId.toString()
      })
      const text = this.vm.$t('Srls.修改成功');
      MessageTips(res, true, true, text, item => {
        this.onRefreshClick();
        this.loadingType = false;
        this.dialogFormVisible = false;

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
  .v-btn-authorize {
    .weui-flex {
      padding: 10px 0;
      .weui-flex-hd {
        min-width: 100px;
      }
    }
  }
}
/deep/.el-tag {
  min-width: 80px;
  text-align: center;
}
.pages {
  min-height: 700px;
  /deep/.el-switch__label {color: #909399;}
  /deep/.el-switch__label.is-active {
    font-weight: bold;
    color: #409EFF;
  }
}
</style>