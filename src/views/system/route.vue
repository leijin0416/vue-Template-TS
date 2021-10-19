<template>
  <!-- 路由配置 -->
  <div class="pages">
    <div class="v-header-search">
      <el-form
        ref="ruleSearchForm"
        label-width="100px"
        class="demo-form-inline"
        :inline="true" 
        :rules="rules"
        :model="param">
        <el-form-item :label="$t('Srte.路由名称')" >
          <el-input type="text" v-model="param.title" size="small" clearable></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('Srte.搜索') }}</el-button>
        <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('Srte.重置') }}</el-button>
      </el-form>
    </div>
    <div class="v-button-box"></div>
    <el-row :gutter="40">
      <el-col :span="9">
        <ElTree
          :treeType="1"
          @handleMenuAddChange="handleMenuAddChange" />
      </el-col>
      <el-col :span="15">
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateButton" :label="$t('Srte.操作')" align='center' width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 1)"><i class="el-icon-edit-outline" /> {{ $t('Srte.修改') }}</el-button>
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 2)" class="v-btn-red"><i class="el-icon-delete" /> {{ $t('Srte.删除') }}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">{{ $t('Srte.新增路由') }}</div>
      <div slot="title" class="el-dialog__title" v-else>{{ $t('Srte.修改路由') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="160px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formRouteData"
            >
              <el-form-item :label="$t('Srte.路由ID')" >
                <el-input type="text" v-model="formRouteData.menuId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srte.路由名称')" prop="title">
                <el-input type="text" v-model="formRouteData.title" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srte.路由名称英文')" prop="titleEn" >
                <el-input type="text" v-model="formRouteData.titleEn" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srte.路由地址')" prop="router">
                <el-input type="text" v-model="formRouteData.router" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srte.路由图标名称')" prop="icon">
                <el-input type="text" v-model="formRouteData.icon" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Srte.路由排序')" >
                <el-input type="text" v-model="formRouteData.sort" size="medium"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">{{ $t('Srte.重置') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">{{ $t('Srte.确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { AdminSystemStore } from '@/store/private/StoreAdminIstrators';
import { FTisFormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { 
  webGetAdminMenuAdd, 
  webGetAdminMenuUpdate, 
  webGetAdminMenuDelte 
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ElTree from "@/components/ElTree/index.vue";

type IndexData = {
  page: number;
  pageSize: number;
  title: string;
};
type FormData = {
  menuId: number | string;
  icon: string;
  title: string;
  router: string;
  titleEn: string;
  type: string;
  sort: string;
};

@Component({
  name: "RouteList",
  components: {
    ElTree,
    ElTable
  },
})
export default class RouteList extends Vue {
  private vm = window['vm'];

  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12,
    title: ''
  };
  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {
      prop: 'menuId',
      label: this.vm.$t('Srte.路由ID'),
      width: '100',
    },
    {
      prop: 'title',
      label: this.vm.$t('Srte.路由名称'),
      width: 'auto',
    },
    {
      prop: 'router',
      label: this.vm.$t('Srte.路由地址'),
      width: 'auto',
    },
    {
      prop: 'icon',
      label: this.vm.$t('Srte.路由图标名称'),
      width: 'auto',
    },
    {
      prop: 'createTime',
      label: this.vm.$t('Srte.创建时间'),
      width: '170',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private loadingType:boolean = false;
  private dialogFormVisible:boolean = false;
  private dialogFormType:boolean = true;
  private formRouteData: FormData = {
    menuId: '',
    icon: '',
    title: '',
    router: '',
    type: '1',
    titleEn: '',
    sort: ''
  };

  private rules = {
    icon: [
      { required: true, message: this.vm.$t('Srte.请输入路由图标名称'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: this.vm.$t('Srte.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
    title: [
      { required: true, message: this.vm.$t('Srte.请输入路由名称'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: this.vm.$t('Srte.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
    titleEn: [
      { required: true, message: this.vm.$t('Srte.请输入英文路由名称'), trigger: 'blur' },
    ],
    router: [
      { required: true, message: this.vm.$t('Srte.请输入路由地址'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: this.vm.$t('Srte.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
  };

  // 获取数据
  get getAdminSystemMenuRightList() {
    return AdminSystemStore.getAdminSystemMenuRightList
  };

  // 监听数据列表
  @Watch('getAdminSystemMenuRightList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data.list;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      obj.forEach( el => {
        el.createTime = FTisFormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime)
      });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    AdminSystemStore.storeActionAdminMenuRightList(this.param);  // 表格
    AdminSystemStore.storeActionAdminMenuTreeList({});  // 树状图
  };

  // 生命周期
  mounted () {};

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  }
  private resetSearchForm(formName:string) {
    const _that = this;
    Object.keys(_that.param).forEach(key => {
      if(key == 'title') _that.param[key] = '';
    });
    AdminSystemStore.storeActionAdminMenuRightList(this.param);
    // console.log(this.param);
  }

  private submitSearchForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        AdminSystemStore.storeActionAdminMenuRightList(this.param);
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 刷新
  private onRefreshClick() {
    AdminSystemStore.storeActionAdminMenuTreeList({});
    AdminSystemStore.storeActionAdminMenuRightList(this.param);
  }

  // 关闭弹窗 Dialog
  private onDialogClose() {
    Object.keys(this.formRouteData).forEach(key => {
      if(key !== 'type') this.formRouteData[key] = ''
    });
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val;
    AdminSystemStore.storeActionAdminMenuRightList(this.param);
    // console.log(this.param);
  }

  // 按钮操作
  private handleRowModifyClick(row, id) {
    const _that = this;
    if(id === 1) {
      const obj = deepCloneData(row);
      _that.dialogFormVisible = true;
      _that.dialogFormType = false;
      _that.formRouteData = obj;
    } else {
      _that.handleOpenClick(row);
    }
  }
  // 删除
  private handleOpenClick(row) {
    const _that = this;
    const text1 = this.vm.$t('Srte.此操作将删除该条信息');
    const text2 = this.vm.$t('Srte.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: this.vm.$t('Srte.确定'),
      cancelButtonText: this.vm.$t('Srte.取消'),
      type: 'warning',
    }).then(() => {
      _that.handleRowDeleteClick(row)
    })
  }

  private async handleRowDeleteClick(row) {
    let res = await webGetAdminMenuDelte({
      'menuIds': row.menuId,
    })
    // console.log(res);
    
    const text = this.vm.$t('Srte.删除成功');
    MessageTips(res, true, true, text, item => {
      this.onRefreshClick();
    }, null);
  }

  // 新增路由按钮
  private handleMenuAddChange(data) {
    this.dialogFormVisible = true;
    this.dialogFormType = true;
    this.formRouteData.menuId = data.menuId;
    // console.log(data);
  }

  private submitForm(formName: string) {
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
    let dialogType = this.dialogFormType;
    let { menuId, router, type, title, icon, titleEn, sort } = this.formRouteData;
    if(dialogType) {
      let res = await webGetAdminMenuAdd({
        'parentId': menuId,
        'router': router,
        'type': type,
        'title': title,
        'icon': icon,
        'titleEn': titleEn,
        'sort': sort
      });
      // console.log(res);
      const text = this.vm.$t('Srte.添加成功');
      MessageTips(res, true, true, text, item => {
        this.dialogFormVisible = false;
        this.loadingType = false;
        this.onRefreshClick();
      }, err => {
        this.loadingType = false;
      });

    } else {
      let res = await webGetAdminMenuUpdate({
        'menuId': menuId,
        'router': router,
        'type': type,
        'title': title,
        'icon': icon,
        'titleEn': titleEn,
        'sort': sort
      });
      const text = this.vm.$t('Srte.修改成功');
      MessageTips(res, true, true, text, item => {
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
.pages {
  padding: 15px;
  min-height: 700px;
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