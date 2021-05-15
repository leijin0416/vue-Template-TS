<template>
  <!-- 实名审核列表 -->
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="v-header-search">
          <el-form
            ref="ruleSearchForm"
            label-width="auto"
            class="demo-form-inline"
            :inline="true" 
            :rules="rules"
            :model="param">
            <el-form-item :label="$t('审核状态')">
              <el-select v-model="param.status" :placeholder="$t('请选择')" size="small">
                <el-option
                  v-for="item in formOptionsStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('真实姓名')">
              <el-input type="text" v-model="param.fullName" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('搜索') }}</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('重置') }}</el-button>
          </el-form>
        </div>
        <div class="v-button-box"></div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateStatus" :label="$t('审核状态')" align='center' width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1">{{$t('审核状态')}}</el-tag>
              <el-tag type="info" v-else-if="scope.row.status === 0">{{$t('待审核')}}</el-tag>
              <el-tag type="danger" v-else>{{$t('审核拒绝')}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateIdentityCardType" :label="$t('证件类型')" align='center' width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.identityCardType === 1">{{$t('身份证')}}</el-tag>
              <el-tag v-else>{{$t('护照')}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateExamineAdminId" :label="$t('审核人ID')" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.examineAdminId != '-1'">{{scope.row.examineAdminId}}</span>
            </template>
          </el-table-column>
          
          <el-table-column slot="operateButton" :label="$t('操作')" align='center' width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row, 1)">{{$t('查看')}}</el-button>
              <el-button type="text" class="v-btn-yellow" size="small" @click="handleRowModifyClick(scope.row, 2)" v-if="scope.row.status === 0" icon="el-icon-document-checked">{{$t('审核')}}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <!-- 左侧弹窗 -->
    <el-drawer
      :title="this.$t('个人信息')"
      :show-close="false"
      :append-to-body="true"
      :visible.sync="drawerFormVisible"
      direction="rtl"
      @close="onDrawerClose"
      size="40%" >
      <div class="content">
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('用户ID')}}</div>
          <div class="weui-flex-bd">{{drawerRowData.userId}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('用户名')}}</div>
          <div class="weui-flex-bd">{{drawerRowData.userName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('真实姓名')}}</div>
          <div class="weui-flex-bd">{{drawerRowData.fullName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('审核状态')}}</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.status === 1">{{$t('审核通过')}}</el-tag>
            <el-tag type="info" v-else-if="drawerRowData.status === 0">{{$t('待审核')}}</el-tag>
            <el-tag type="danger" v-else>{{$t('审核拒绝')}}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('证件类型')}}</div>
          <div class="weui-flex-bd">
            <el-tag>{{ drawerRowData.identityCardType === 1 ? this.$t('身份证') : this.$t('护照') }}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('证件号码')}}</div>
          <div class="weui-flex-bd">{{drawerRowData.identityCard}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-bd">
            <p class="v-text"><i class="el-icon-picture-outline"></i> {{$t('证件正面')}}</p>
            <div class="v-img-box">
              <viewer :images="viewerImage" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="drawerRowData.frontPicture"
                  :title="$t('点击查看大图')"
                  alt="user-audit.png">
              </viewer>
            </div>
          </div>
          <div class="weui-flex-bd">
            <p class="v-text"><i class="el-icon-picture-outline"></i> {{$t('证件背面')}}</p>
            <div class="v-img-box">
              <viewer :images="viewerImage" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="drawerRowData.afterPicture"
                  :title="$t('点击查看大图')"
                  alt="user-audit.png">
              </viewer>
            </div>
          </div>
          <div class="weui-flex-bd">
            <p class="v-text"><i class="el-icon-picture-outline"></i> {{$t('手持证件自拍')}}</p>
            <div class="v-img-box">
              <viewer :images="viewerImage" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="drawerRowData.holdPicture"
                  :title="$t('点击查看大图')"
                  alt="user-audit.png">
              </viewer>
            </div>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-bd">
            <p class="v-text"><i class="el-icon-picture-outline"></i> {{$t('居住证')}}</p>
            <div class="v-img-box v-img-list" v-for="(item, index) in viewerLivePicturesList" :key="index">
              <viewer :images="viewerLivePicturesList" v-viewer="{movable: false, toolbar: false,}">
                <img class="v-img"
                  :src="item"
                  :title="$t('点击查看大图')"
                  alt="user-audit.png">
              </viewer>
            </div>
          </div>
        </div>
        <div class="weui-flex" v-if="drawerRowData.examineAdminId != '-1'">
          <div class="weui-flex-hd">{{$t('审核人ID')}}</div>
          <div class="weui-flex-bd">{{drawerRowData.examineAdminId}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{$t('创建时间')}}</div>
          <div class="weui-flex-bd">{{drawerRowData.createTime}}</div>
        </div>
      </div>
      <div class="drawer-footer" v-if="drawerRowId === 2">
        <div class="weui-flex">
          <div class="weui-flex-hd">* {{$t('选择审核状态')}}</div>
          <div class="weui-flex-bd">
            <el-radio v-model="radioStatus" label="1">{{$t('通过')}}</el-radio>
            <el-radio v-model="radioStatus" label="2">{{$t('拒绝')}}</el-radio>
          </div>
        </div>
        <el-button type="primary" @click="onDialogFormClick('ruleForm')" :loading="loadingType" >{{$t('确认审核')}}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { UserListStore } from '@/store/private/PageUserList';
import { webGetAdminPageUserAuditAgree } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number;
  pageSize: number;
  fullName: string;
  status: string
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
    fullName: '',
    status: '',
  };
  private formOptionsStatus: object = [
    {
      label: window['vm'].$t('审核通过'),
      value: '1'
    },
    {
      label: window['vm'].$t('待审核'),
      value: '0'
    },
    {
      label: window['vm'].$t('审核拒绝'),
      value: '2'
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
      label: window['vm'].$t('审核编号'),
      width: '180',
    },
    {
      slot: 'operateStatus',
    },
    {
      prop: 'userName',
      label: window['vm'].$t('用户名'),
      width: 'auto',
    },
    {
      prop: 'fullName',
      label: window['vm'].$t('真实姓名'),
      width: 'auto',
    },
    {
      slot: 'operateIdentityCardType',
    },
    {
      prop: 'identityCard',
      label: window['vm'].$t('证件号码'),
      width: 'auto',
    },
    {
      prop: 'createTime',
      label: window['vm'].$t('创建时间'),
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
  private viewerLivePicturesList = [];

  // 获取数据
  get getUserAuditList() {
    if(UserListStore.getUserAuditList.code === 200) {
      return UserListStore.getUserAuditList
    }
  };

  // 监听数据列表
  @Watch('getUserAuditList', { deep: true })
  userPageAuditList(newValue: any) {
    let list = newValue.data.list;
    // console.log(list);
    
    if(list.length > 0) {
      let obj = deepCloneData(list);
      obj.forEach( el => {
        el.createTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
      });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  // 生命周期
  created() {
    UserListStore.storeActionPageUserAuditList(this.param);
  };

  // 生命周期
  mounted () {};

  // 关闭左侧弹窗
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
      if(key == 'fullName' || key == 'status') _that.param[key] = '';
    });
    UserListStore.storeActionPageUserAuditList(this.param);
    // console.log(this.param);
  }

  private submitSearchForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    _that.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        UserListStore.storeActionPageUserAuditList(this.param);
      } else {
        _that.loadingType = false;
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

  // 审核弹出
  private handleRowModifyClick(row, id) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.drawerFormVisible = true;
    _that.drawerRowData = obj;
    _that.drawerRowId = id;
    _that.viewerLivePicturesList = obj.livePictures;
  }

  // 确认审核
  private async onDialogFormClick() {
    let { userId } = this.drawerRowData;
    let status = this.radioStatus;
    this.loadingType = true;

    if(status == '') {
      const text = window['vm'].$t('请先选择审核状态')
      this.$message({
        message: text,
        type: 'error',
        duration: 3000,
        onClose: () => {
          this.loadingType = false;
        }
      });
      
    } else {
      const text = window['vm'].$t('审核操作成功')
      let res = await webGetAdminPageUserAuditAgree({
        'userId': userId,
        'status': status,
      });
      // console.log(res);
      MessageTips(res, true, true, text, item => {
        this.onRefreshClick();
        this.loadingType = false;
        this.drawerFormVisible = false;
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
  overflow-y: auto;
  .content {
    padding: 0 20px 120px;
  }
  .weui-flex {
    padding: 15px 0;
    border-top: 1px solid #eee;
    .weui-flex-hd, .v-text {min-width: 100px;font-size: 12px; color: #666;}
    .v-img-box {
      cursor: pointer;
      position: relative;
      display: block;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      margin-top: 20px;
      margin-left: 20px;
      overflow: hidden;
      border: 1px solid #eee;
      background-color: #f5f5f5;
      .v-img {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 100%;
        transform: translate(-50%, -50%);
      }
    }
    .v-img-list {
      display: inline-block;
      vertical-align: text-top;
    }
  }
  .el-tag {
    text-align: center;
  }
  .drawer-footer {
    position: absolute;
    bottom: 0;
    left: 15px;
    right: 15px;
    padding-bottom: 20px;
    border-top: 1px solid #eee;
    background: #fff;
    .weui-flex {
      padding: 20px 0;
      border-top: none;
      .weui-flex-hd {font-weight: bold; color: red;}
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
  /deep/.el-form-item__label {padding-left: 12px;}
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