<template>
  <!-- 实名审核列表 -->
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
            <el-form-item label="审核状态">
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
        <div class="v-button-box"></div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateStatus" label="审核状态" align='center' width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">审核通过</el-tag>
              <el-tag type="info" v-else-if="scope.row.status === 0">待审核</el-tag>
              <el-tag type="danger" v-else>审核拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateIdentityCardType" label="证件类型" align='center' width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.identityCardType === 1">身份证</el-tag>
              <el-tag v-else>护照</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column slot="operateButton" label="操作" align='center' width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 1)">查看</el-button>
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 2)" v-if="scope.row.status === 0">审核</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <!-- 左侧弹窗 -->
    <el-drawer
      title="个人信息"
      :append-to-body="true"
      :visible.sync="drawerFormVisible"
      direction="rtl"
      @close="onDrawerClose"
      size="40%" >
      <div class="content">
        <div class="weui-flex">
          <div class="weui-flex-hd">用户ID</div>
          <div class="weui-flex-bd">{{drawerRowData.userId}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户名</div>
          <div class="weui-flex-bd">{{drawerRowData.userName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">审核人</div>
          <div class="weui-flex-bd">{{drawerRowData.examineAdminId}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">审核状态</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.status === 1">审核成功</el-tag>
            <el-tag type="info" v-else-if="drawerRowData.status === 0">待审核</el-tag>
            <el-tag type="danger" v-else>审核拒绝</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">证件类型</div>
          <div class="weui-flex-bd">
            <el-tag>{{drawerRowData.identityCardType === 1 ? '身份证' : '护照'}}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">证件号码</div>
          <div class="weui-flex-bd">{{drawerRowData.identityCard}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-bd">
            <p class="v-text">证件正面</p>
            <div class="v-img-box">
              <viewer :images="viewerImage" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="drawerRowData.frontPicture"
                  title="点击查看大图"
                  alt="user_audit.png">
              </viewer>
            </div>
          </div>
          <div class="weui-flex-bd">
            <p class="v-text">证件背面</p>
            <div class="v-img-box">
              <viewer :images="viewerImage" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="drawerRowData.afterPicture"
                  title="点击查看大图"
                  alt="user_audit.png">
              </viewer>
            </div>
          </div>
          <div class="weui-flex-bd">
            <p class="v-text">手持证件自拍证明</p>
            <div class="v-img-box">
              <viewer :images="viewerImage" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="drawerRowData.holdPicture"
                  title="点击查看大图"
                  alt="user_audit.png">
              </viewer>
            </div>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">创建时间</div>
          <div class="weui-flex-bd">{{drawerRowData.createTime}}</div>
        </div>
      </div>
      <div class="drawer-footer" v-if="drawerRowId === 2">
        <div class="weui-flex">
          <div class="weui-flex-hd">选择审核状态</div>
          <div class="weui-flex-bd">
            <el-radio v-model="radioStatus" label="1">通过</el-radio>
            <el-radio v-model="radioStatus" label="2">拒绝</el-radio>
          </div>
        </div>
        <el-button type="primary" @click="submitForm('ruleForm')" icon="el-icon-check" :loading="loadingType" >确认审核</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { UserListStore } from '@/store/private/PageUserList';
import { webGetAdminAssetsCarryManual, webGetAdminAssetsCarryExamine } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number,
  pageSize: number,
  userId: string,
  status: string,
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
      label: '审核拒绝',
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
      prop: 'kycId',
      label: '审核编号',
      width: 'auto',
    },
    {
      slot: 'operateStatus',
    },
    {
      prop: 'userId',
      label: '用户ID',
      width: 'auto',
    },
    {
      prop: 'userName',
      label: '用户名',
      width: 'auto',
    },
    {
      slot: 'operateIdentityCardType',
    },
    {
      prop: 'identityCard',
      label: '证件号码',
      width: 'auto',
    },
    {
      prop: 'examineAdminId',
      label: '审核人',
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
  private drawerFormVisible:boolean = false;   // 左侧弹窗
  private drawerRowData:any = {}
  private drawerRowId:number = 1;    // 1查看/2审核
  private radioStatus:string = '';
  private viewerImage: string = '';

  // 获取数据
  get getUserAuditList() {
    return UserListStore.getUserAuditList
  };

  // 监听数据列表
  @Watch('getUserAuditList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data.list;
    const obj = deepCloneData(list);
    console.log(list);
    
    obj.forEach( el => {
      el.createTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
    });
    
    this.tableData = obj;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    UserListStore.storeActionPageUserAuditList(this.param);
  };

  // 生命周期
  mounted () {
  };

  private onDrawerClose() {
    this.radioStatus = '';
    this.drawerRowId = 1;
  }

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
    UserListStore.storeActionPageUserAuditList(this.param);
    // console.log(this.param);
  }

  private submitSearchForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        UserListStore.storeActionPageUserAuditList(this.param);
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
    UserListStore.storeActionPageUserAuditList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    UserListStore.storeActionPageUserAuditList(this.param);
  }

  // 审核
  private handleRowModifyClick(row, id) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.drawerFormVisible = true;
    _that.drawerRowData = obj;
    _that.drawerRowId = id;
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

  // 确认审核
  private async onDialogFormClick() {
    if(this.radioStatus == '') {

    } else {
      let res: any = await webGetAdminAssetsCarryManual(this.drawerRowData);
      // console.log(res);
      MessageTips(res, true, true, '审核成功', item => {
        this.drawerFormVisible = false;
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
/deep/.el-tag {
  min-width: 80px;
  text-align: center;
}
/deep/.el-drawer__header {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
/deep/.el-drawer__body {
  padding-bottom: 15px;
  overflow-y: auto;
  .content {
    padding: 0 20px;
  }
  .weui-flex {
    padding: 15px 0;
    border-top: 1px solid #eee;
    .weui-flex-hd, .v-text {min-width: 120px;font-size: 12px; color: #666;}
    .v-img-box {
      display: block;
      width: 100px;
      margin-top: 15px;
      .v-img {
        width: 100%;
      }
    }
  }
  .el-tag {
    
    text-align: center;
  }
  .drawer-footer {
    position: absolute;
    bottom: 15px;
    left: 15px;
    right: 15px;
    border-top: 1px solid #eee;
    .weui-flex {
      padding: 20px 0;
      border-top: none;
      .weui-flex-hd {font-weight: bold;}
    }
  }
}
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