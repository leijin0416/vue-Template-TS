<template>
  <!-- 轮播图列表 -->
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
            <el-form-item :label="$t('Iblt.标题')" >
              <el-input type="text" v-model="param.bannerTitle" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('Iblt.类型')" >
              <el-select v-model="param.type" :placeholder="$t('Iblt.请选择')" size="small">
                <el-option
                  v-for="item in formOptionNoticeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Iblt.状态')" >
              <el-select v-model="param.status" :placeholder="$t('Iblt.请选择')" size="small">
                <el-option
                  v-for="item in formOptionStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('Iblt.搜索') }}</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('Iblt.重置') }}</el-button>
          </el-form>
        </div>
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" @click="onAddsClick">{{ $t('Iblt.添加轮播图') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagType" :label="$t('Iblt.类型')" align="center" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === '1'">{{ $t('Iblt.会员') }}</el-tag>
              <el-tag type="warning" v-else>{{ $t('Iblt.商户') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="operateTagStatus" :label="$t('Iblt.状态')" align="center" width="200">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1 ? true : false"
                :active-text="$t('Iblt.正常')"
                :inactive-text="$t('Iblt.禁用')"
                @change="handleOpenClick(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column slot="operateTagImage" :label="$t('Iblt.图片')" align="center" width="200">
            <template slot-scope="scope">
              <div class="v-img-box">
                <img :src="scope.row.bannerPic" alt="image.png" class="v-img">
              </div>
            </template>
          </el-table-column>
          <el-table-column slot="operateButton" :label="$t('Iblt.操作')" align='center' width="140">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)" icon="el-icon-edit-outline">{{ $t('Iblt.修改') }}</el-button>
              <!-- <el-button type="text" size="small" @click="handleOpenClick(scope.row)" class="v-btn-red">删除</el-button> -->
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">{{ $t('Iblt.添加轮播图') }}</div>
      <div slot="title" class="el-dialog__title" v-else>{{ $t('Iblt.修改轮播图') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item :label="$t('Iblt.轮播图ID')" v-if="!dialogFormType" >
                <el-input type="text" v-model="formData.bannerId" size="medium" :readonly="true"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Iblt.标题')" prop="bannerTitle" >
                <el-input type="text" v-model="formData.bannerTitle" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Iblt.类型')" prop="type" >
                <el-radio-group v-model="formData.type">
                  <el-radio label="1">{{ $t('Iblt.会员') }}</el-radio>
                  <el-radio label="2">{{ $t('Iblt.商户') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('Iblt.状态')" prop="status" v-if="!dialogFormType" >
                <el-radio-group v-model="formData.status">
                  <el-radio :label="1">{{ $t('Iblt.正常') }}</el-radio>
                  <el-radio :label="0">{{ $t('Iblt.禁用') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('Iblt.图片')" prop="bannerPic" >
                <el-upload
                  class="avatar-uploader"
                  :action="actionUrl"
                  :headers="myHeaders"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  v-model="formData.bannerPic"
                  >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">重置</el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">{{ $t('Iblt.确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { InformationStore } from '@/store/private/PageInformation';
import { UserStore } from '@/store/private/user';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminUserBannerAdd, webGetAdminUserBannerUpdateStatus, webGetAdminUserBannerUpdate, webGetAdminPageList } from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ExportExcels from "@/components/ExportExcels/index.vue";
import { log } from 'console';

type IndexData = {
  page: number;
  pageSize: number;
  status: string;
  type: string;
  bannerTitle: string
};

@Component({
  components: {
    ElTable,
  },
})
export default class administrators extends Vue {
  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12,
    status: '',
    type: '',
    bannerTitle: ''
  };
  private formOptionNoticeType: object = [
    {
      label: window['vm'].$t('Iblt.会员'),
      value: '1'
    },
    {
      label: window['vm'].$t('Iblt.商户'),
      value: '2'
    },
  ];
  private formOptionStatus: object = [
    {
      label: window['vm'].$t('Iblt.正常'),
      value: '1'
    },
    {
      label: window['vm'].$t('Iblt.禁用'),
      value: '0'
    },
  ];

  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {slot: 'operateTagType'},
    {
      prop: 'bannerTitle',
      label: window['vm'].$t('Iblt.标题'),
      width: 'auto',
    },
    {slot: 'operateTagImage'},
    {slot: 'operateTagStatus'},
    {
      prop: 'createId',
      label: window['vm'].$t('Iblt.创建人ID'),
      width: '180',
    },
    {
      prop: 'createTime',
      label: window['vm'].$t('Iblt.创建时间'),
      width: '180',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头
  private imageUrl:string = '';
  private actionUrl:string = 'http://23.111.163.146:10086/api/ping-banner/uploadFile';
  private myHeaders:object = {
    responseType: "blob",
		AuthType: "WEB",
  };

  private loadingType:boolean = false;
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData = {
    bannerTitle: '',
    bannerPic: '',
    bannerId: '',
    status: '',
    type: ''
  };

  private rules = {
    bannerTitle: [
      { required: true, message: window['vm'].$t('Iblt.请输入轮播图标题'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Iblt.请勿输入空字符'),
        trigger: 'blur'
      },
    ],
    bannerPic: [
      { required: true, message: window['vm'].$t('Iblt.请上传图片'), trigger: 'change' },
    ],
    status: [
      { required: true, message: window['vm'].$t('Iblt.请选择状态'), trigger: 'change' },
    ],
    type: [
      { required: true, message: window['vm'].$t('Iblt.请选择类型'), trigger: 'change' },
    ],
  };

  // 获取数据
  get getInformationBannerList() {
    if(InformationStore.getInformationBannerList.code === 200) {
      return InformationStore.getInformationBannerList
    }
  };

  // 监听数据列表
  @Watch('getInformationBannerList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data.list;
    
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
    InformationStore.storeActionInformationBannerList(this.param);
  };

  // 生命周期
  mounted () {};

  private onDialogClose() {
    this.imageUrl = '';
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val
    InformationStore.storeActionInformationBannerList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    InformationStore.storeActionInformationBannerList(this.param);
  }

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  }

  // 搜索
  private resetSearchForm(formName: string) {
    const _that = this;
    Object.keys(_that.param).forEach(key => {
      if(key === 'status' || key === 'type' || key === 'bannerTitle') _that.param[key] = '';
    });
    InformationStore.storeActionInformationBannerList(this.param);
    // console.log(this.param);
  }
  private submitSearchForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        InformationStore.storeActionInformationBannerList(this.param);
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 图片成功
  private handleAvatarSuccess(res, file) {
    this.imageUrl = URL.createObjectURL(file.raw);
    this.formData.bannerPic = res.data.filePath;
    // console.log(res);
    // console.log(file);
  }

  private beforeAvatarUpload(file) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;

    if (!isJPG) {
      const text = window['vm'].$t('Iblt.上传图片格式');
      this.$message.error(text);
    }
    if (!isLt2M) {
      const text = window['vm'].$t('Iblt.上传图片大小');
      this.$message.error(text);
    }
    return isJPG && isLt2M;
  }

  // 添加弹窗
  private onAddsClick() {
    Object.keys(this.formData).forEach(key => this.formData[key] = '');
    this.dialogFormVisible = true;
    this.dialogFormType = true;
  }

  // 删除
  private handleOpenDeleteClick(row) {
    const _that = this;
    const text1 = window['vm'].$t('Iblt.此操作将删除该条信息');
    const text2 = window['vm'].$t('Iblt.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: window['vm'].$t('Iblt.确定'),
      cancelButtonText: window['vm'].$t('Iblt.取消'),
      type: 'warning',
    }).then(() => {
      // _that.handleRowDeleteClick(row)
    })
  }

  // 表格Switch操作 确认框
  private handleOpenClick(row, id) {
    const _that = this;
    const text1 = window['vm'].$t('Iblt.此操作将执行重要信息');
    const text2 = window['vm'].$t('Iblt.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: window['vm'].$t('Iblt.确定'),
      cancelButtonText: window['vm'].$t('Iblt.取消'),
      type: 'warning',
    }).then(() => {
      _that.onSwitchChange(row)  // 用户状态
    })
  }

  // 激活/锁定 轮播图
  private async onSwitchChange(row) {
    if (row.status === 0) { // 激活
      let params = {
        status: 1,
        bannerId: row.bannerId
      }
      // console.log(params);
      
      let res = await webGetAdminUserBannerUpdateStatus(params);
      const text = window['vm'].$t('Iblt.激活成功');
      MessageTips(res, true, true, text, item => {
        InformationStore.storeActionInformationBannerList(this.param);
      }, null);
    } else {
      let params = {
        status: 0,
        bannerId: row.bannerId
      }
      // console.log(params);
      
      let res = await webGetAdminUserBannerUpdateStatus(params);
      const text = window['vm'].$t('Iblt.禁用成功');
      MessageTips(res, true, true, text, item => {
        InformationStore.storeActionInformationBannerList(this.param);
      }, null);

    }
  }

  // 修改弹窗
  private handleRowModifyClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;
    _that.formData = obj;
    _that.imageUrl = obj.bannerPic;
    // console.log(obj)
  }

  private submitForm(formName) {
    this.loadingType = true;
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
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
    let types = this.dialogFormType;
    let { bannerPic, bannerId, type, bannerTitle, status} = this.formData;
    if(types) {
      const res = await webGetAdminUserBannerAdd({
        'bannerPic': bannerPic,
        'type': type,
        'bannerTitle': bannerTitle,
        'status': 1
      })
      // console.log(res);
      
      const text = window['vm'].$t('Iblt.添加成功');
      MessageTips(res, true, true, text, item => {
        this.loadingType = false;
        this.formData.bannerPic = '';
        this.imageUrl = '';
        this.onRefreshClick();
        this.$nextTick(() => {
          this.resetForm('ruleForm');
        })
      }, null);

    } else {
      const res = await webGetAdminUserBannerUpdate({
        'bannerPic': bannerPic,
        'bannerId': bannerId,
        'type': type,
        'bannerTitle': bannerTitle,
        'status': status
      })
      const text = window['vm'].$t('Iblt.修改成功');
      MessageTips(res, true, true, text, item => {
        this.loadingType = false;
        this.onRefreshClick();
      }, null);
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
.container {
  min-height: 800px;
  /deep/.el-switch__label {color: #909399;}
  /deep/.el-switch__label.is-active {
    font-weight: bold;
    color: #409EFF;
  }
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

/deep/.avatar-uploader .el-upload {
  width: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.v-img-box {
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  margin: auto;
  border: 1px dashed #f1f1f1;
  .v-img {
    width: 100%;
  }
}
</style>