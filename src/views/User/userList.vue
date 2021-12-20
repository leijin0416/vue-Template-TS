<template>
  <!-- 用户列表 -->
  <div class="pages">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="!userRegisterType">
        <div class="v-header-search">
          <el-form
            ref="ruleSearchForm"
            label-width="auto"
            class="demo-form-inline"
            :inline="true"
            :rules="rules"
            :model="param">
            <el-form-item :label="$t('User.会员编号')">
              <el-input type="text" v-model="param.memberId" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('User.姓名')">
              <el-input type="text" v-model="param.name" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('User.用户名')">
              <el-input type="text" v-model="param.nickName" size="small" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('User.会员配套')">
              <el-select v-model="param.businessStatus" :placeholder="$t('User.请选择')" size="small">
                <el-option
                  v-for="item in formOptionsStatus"
                  :key="item.id"
                  :label="item.packageName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('User.搜索') }}</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('User.重置') }}</el-button>
          </el-form>
        </div>
        <div class="v-refresh-box" style="min-height: 30px" >
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="v-btn" v-allow="'add'">{{ $t('User.注册新用户') }}</el-button>
          <el-button size="small" icon="el-icon-download" class="v-btn" @click="onExportClick" v-allow="'add'">{{ $t('Hlin.导出Excel') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <ElTable 
        :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <el-table-column slot="operateTagUserLevel" :label="$t('User.会员等级')" width="160" align='center'>
            <template slot-scope="scope">
              <el-tag effect="light" type="warning" v-if="scope.row.businessStatus === 0">{{$t('User.普通会员')}}</el-tag>
              <el-tag effect="light" type="warning" v-else-if="scope.row.businessStatus === 1">{{$t('User.白银会员')}}</el-tag>
              <el-tag effect="light" type="warning" v-else-if="scope.row.businessStatus === 2">{{$t('User.黄金会员')}}</el-tag>
              <el-tag effect="light" type="warning" v-else-if="scope.row.businessStatus === 3">{{$t('User.白金会员')}}</el-tag>
              <span v-else>{{ $t('User.暂无') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            slot="operateButton"
            fixed="right"
            :label="$t('User.操作')"
            align='center'
            width="250">
            <template slot-scope="scope">
              <el-button @click="onHandleRightClick(scope.row, 1)" type="text" icon="el-icon-tickets" size="small">{{$t('User.查看')}}</el-button>
              <el-button @click="onHandleRightClick(scope.row, 2)" type="text" icon="el-icon-shopping-bag-1" size="small" class="text-warning" v-allow="'buys'">{{$t('User.购买配套')}}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>

    <!-- 弹出层 -->
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title" v-if="dialogFormVisibleId === 2"><span class="text-red"> {{dialogsClassName}} </span>{{ $t('User.会员') }}{{ $t('User.购买配套') }}</div>
      <div slot="title" class="el-dialog__title" v-else-if="dialogFormVisibleId === 3">{{ $t('User.修改余量') }}</div>
      
      <!-- 课程 -->
      <div class="v-form-box" v-if="dialogFormVisibleId === 3">
        <el-row>
          <el-col :span="15">
            <el-form
              ref="fatherForm"
              label-width="90px"
              label-position="left"
              :hide-required-asterisk="true"
              status-icon 
              class="demo-ruleForm">
              <el-form-item :label="$t('User.课程编号')" >
                <el-input type="text" v-model="dialogsId" disabled />
              </el-form-item>
              <el-form-item :label="$t('User.名称')" >
                <el-input type="text" v-model="dialogsClassName" disabled />
              </el-form-item>
              <el-form-item :label="$t('User.数量')" >
                <el-input type="number" v-model="dialogsNum" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <!-- 配套 -->
      <div class="v-form-box" v-else>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="16">
            <el-form
              ref="ruleForm"
              label-width="auto"
              class="demo-ruleForm"
              :rules="rules"
              :model="ruleForm">
              <!-- <el-form-item :label="$t('User.附加配套')" prop="packageConfigId" >
                <el-cascader
                  v-model="ruleForm.addOnNumVoList"
                  :options="cascaderFormOptions"
                  :props="{ multiple: true, checkStrictly: true }"
                  :placeholder="$t('User.请选择')"
                  style="width: 100%"
                  @change="onCascadersChange"
                  clearable></el-cascader>
              </el-form-item> -->
              <el-form-item :label="$t('User.会员编号')" >
                <el-input type="text" v-model="ruleForm.memberId" disabled />
              </el-form-item>
              <el-form-item :label="$t('Intory.支付类型')" prop="payMethod" >
                <el-radio-group v-model="ruleForm.payMethod">
                  <el-radio :label="1">{{$t('Intory.现金')}}</el-radio>
                  <el-radio :label="2">{{$t('Intory.信用卡')}}</el-radio>
                  <el-radio :label="3">{{$t('Intory.电子钱包')}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div class="v-info-box">
              <h3 class="v-h3">{{$t('User.会员配套')}}</h3>
              <el-tabs v-model="editableTabsValue" @tab-click="handleTabsClick">
                <el-tab-pane
                  :key="item.id"
                  v-for="(item, index) in editableTabsData"
                  :label="item.packageName"
                  :name="item.id"
                >
                <h3 class="v-h3">{{$t('User.附加配套')}}</h3>
                <div class="v-select">
                  <el-select v-model="packageConfigId" :placeholder="$t('User.请选择')" style="width: 65%" >
                    <el-option
                      v-for="item in item.child"
                      :key="item.id"
                      :label="item.packageName + '/ ￥' + item.price"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <h3 class="v-h3">{{$t('User.生效日期')}}</h3>
                <div >
                  <el-date-picker
                    v-model="packageTime"
                    type="date"
                    :editable="false"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :placeholder="$t('User.选择日期')"
                    style="width: 65%" >
                  </el-date-picker>
                </div>
                <h3 class="v-h3">{{$t('User.优惠折扣')}}</h3>
                <div class="v-input">
                  <el-input type="number" v-model="discount" :placeholder="$t('User.请输入')+$t('User.优惠折扣')" @input="onDiscountChange" style="width: 65%">
                    <span slot="append" >%</span>
                  </el-input>
                </div>
                <h3 class="v-h3">{{$t('User.数量')}}</h3>
                <div class="v-input">
                  <el-input type="number" v-model="ruleAmount" :placeholder="$t('User.请输入')+$t('User.数量')" @blur="handleInputBlurAmount" style="width: 65%" />
                </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="v-text-bottom">
              <i class="el-icon-warning"></i> {{$t('User.注意附加配套')}}
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">{{ $t('Intory.重置') }}</el-button> -->
        <el-button type="primary" @click="submitFormClick" :loading="loadingType" v-if="dialogFormVisibleId === 3" >{{ $t('User.确定') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" v-else >{{ $t('User.确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 导出 -->
    <ExportExcels
     :excelsTableHeader="excelsTableHeader"
     :excelsFilterVal="excelsFilterVal"
     :excelsName="excelsName"
     @getExportExcelInput="getExportExcelInput" />
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { UserListStore } from '@/store/common/StorePageUsersList';
import { UserStore } from '@/store/private/user';
import { deepCloneData } from '@/filters/common';
import { regIntegerMin } from '@/filters/RegexSplit';
import { MessageTips } from '@/filters/MessageTips';
import { aLinkDownloadUrl } from '@/utils/downloadUrl';
import debounceUtils from '@/utils/debounce-throttling';
import { 
  webGetAdminPageUserList,
  webGetAdminPageUserMemberPackageList,
  webGetAdminPageUserMemberAdditionalAdd,
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ExportExcels from "@/components/ExportExcels/index.vue";

type IndexData = {
  page: number;
  pageSize: number;
  name: string;
  nickName: string;
  memberId: string;
};
@Component({
  name: "UserList",
  components: {
    ElTable,
    ExportExcels,
  },
})
export default class extends Vue {
  private vm = window['vm'];
  
  // 分页器
  public param: IndexData = {
    page: 1,
    pageSize: 12,
    name: '',
    nickName: '',
    memberId: '',
  };
  public userRegisterInfo: any = {};
  public userRegisterId = 1;
  public userRegisterContactId = 3;
  public formOptionsStatus = [];
  private coachInfoList = [];

  private loadingType = false;
  private dialogFormVisible = false;
  private dialogFormVisibleId = 3;
  private ruleForm: any = {
    addOnNumVoList: [],
    productName: '',
    payMethod: '',
    memberId: '',
    packageConfigId: '',
  };
  private addOnNumVoList: any = []; // 会员配套
  private cascaderFormOptions = [];
  
  private ruleAmount: any = '';
  private discount: any = 0;
  private packageConfigId = '';
  private packageTime = '';
  private editableTabsValue = 1;
  private editableTabsData = [];

  private dialogsId = '';  // 课程弹窗参数
  private dialogsClassName = '';
  private dialogsNum = '';

  public totalCount: number = 1; // 表格总数
  public tableData: any = [];    // 表格数据
  public tableColumnData = [
    {
      type: 'selection',
    },
    {
      prop: 'memberId',
      label: this.vm.$t('User.会员编号'),
      width: '180',
    },
    {
      prop: 'name',
      label: this.vm.$t('User.姓名'),
      width: '200',
    },
    {
      prop: 'nickName',
      label: this.vm.$t('User.用户名'),
      width: '220',
    },
    {
      prop: 'referrerId',
      label: this.vm.$t('User.推荐人'),
      width: '200',
    },
    {
      prop: 'contactNumber',
      label: this.vm.$t('User.电话'),
      width: '180',
    },
    {
      prop: 'email',
      label: this.vm.$t('User.邮箱'),
      width: '280',
    },
    {
      prop: 'dateOfBirth',
      label: this.vm.$t('User.出生日期'),
      width: '180',
    },
    {
      prop: 'occupation',
      label: this.vm.$t('User.职业'),
      width: '200',
    },
    {
      prop: 'createTime',
      label: this.vm.$t('User.创建时间'),
      width: '180',
    },
    {
      slot: 'operateButton', // 内容slot
    },
  ]; // 表格行头
  public userRegisterType = false;
  public userInfoType = 0;

  /** 
   * @description: 验证规则
	 * @param {*} required  是否必填
	 * @param {*} message  提示语
	 * @param {*} trigger  触发 blur失去焦点后
   * @return {*}
   */
  private rules = {
    packageConfigId: [
      { required: true, message: this.vm.$t('User.请选择') + this.vm.$t('User.会员配套'), trigger: 'change' },
    ],
    payMethod: [
      { required: true, message: this.vm.$t('User.请选择') + this.vm.$t('User.支付类型'), trigger: 'change' },
    ],
  };

  private excelsTableHeader = [ '会员编号', '姓名', '用户名', '推荐人', '电话', '邮箱', '职业', '来源', '性别', '证件类型', '证件号码', '是否成年', '出生日期', '身高', '体重', '地址' ];  // 表格头
  private excelsFilterVal = [ 'memberId', 'name', 'nickName', 'referrerId', 'contactNumber', 'email', 'occupation', 'source', 'gender', 'identityType', 'identityNumber', 'isAdult', 'dateOfBirth', 'height', 'weight', 'address' ];   // 表格参数
  private excelsName: string = '会员列表';        // 表格名

  // 获取数据
  get getUserPageList() {
    const data = UserListStore.getUserPageList;
    if(data.code === 200) return data
  };

  // 监听数据列表
  @Watch('getUserPageList', { deep: true })
  getWatchUserPageList(newValue) {
    // console.log(newValue)
    const list = newValue.data.list;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      // obj.forEach( el => {
      //   el.createTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime);
      // });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
  };

  // 生命周期
  created() {
    UserListStore.storeActionPageUserList(this.param);
    this.getPagesList();
  };

  // 生命周期
  mounted () {
  };

  // 导出弹窗
  private onExportClick() {
    UserStore.storeExportExcelsMap([{ids: 0}])
  }

  // 导出数据
  private async getExportExcelInput(page, pageSize) {
    const {memberId, name, nickName} = this.param;
    const {data: res} = await webGetAdminPageUserList({
      'page': page,
      'pageSize': pageSize,
      'memberId': memberId,
      'name': name,
      'nickName': nickName,
    })
    if(res.data.list.length > 0) UserStore.storeExportExcelsMap(res.data.list)
    // console.log(res);
    // console.log(`${page}__${pageSize}`);
  }

  // 关闭弹窗
  private onDialogClose() {
    this.addOnNumVoList = [];
    this.dialogsNum = '';
    this.ruleAmount = '';
    this.discount = 0;
    this.packageConfigId = '';
    this.packageTime = '';
    this.editableTabsValue = 1;
    this.resetForm('ruleForm');
    this.loadingType = false;
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 返回
  private onEmitGoBackClick(item) {
    UserListStore.storeActionPageUserList(this.param);
    this.userRegisterInfo = {};
    this.userRegisterId = 1;
    this.userRegisterContactId = 3;
    this.userRegisterType = false;
  }

  // 刷新
  private onRefreshClick() {
    UserListStore.storeActionPageUserList(this.param);
  }
  
  // 重置
  private resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }
  private resetSearchForm() {
    Object.keys(this.param).forEach(key => {
      if(key == 'page' || key == 'pageSize') return
      else this.param[key] = ''
    });
    UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }

  // 搜索
  private submitSearchForm(formName: string) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        UserListStore.storeActionPageUserList(this.param);
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 分页
  private handleCurrentChange(val) {
    this.param.page = val;
    UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }

  /**
   * @description: 获取数据- 配套 | 课程
   * @return {*}
   */
  private async getPagesList() {
    const {data: res} = await webGetAdminPageUserMemberPackageList({}); // 配套
    // console.log(res);
    if(res.code === 200) {
      this.editableTabsData = res.data;

    } else console.log(res);
  }

  /**
   * @description: 添加新用户
   * @return {*}
   */
  private onAddUsersClick() {
  }

  /**
   * @description: 弹窗- 查看更多1 | 购买配套2 | 修改余量3 
   * @param {*} item 数据
   * @return {*}
   */
  private async onHandleRightClick(item: any, ids: number) {
    // console.log(item);
    if(ids === 1) {

    } else if(ids === 3) {
      this.dialogsId = item.id;
      this.dialogsClassName = item.className;
      this.dialogFormVisibleId = ids;
      this.dialogFormVisible = true;

    } else {
      this.dialogsClassName = item.name;
      this.ruleForm.memberId = item.memberId;
      this.dialogFormVisibleId = ids;
      this.dialogFormVisible = true;
    }
  }

  /**
   * @description: Tab 切换
   * @return {*}
   */
  private handleTabsClick(val) {
    let data = this.addOnNumVoList;
    this.discount = 0;
    this.ruleAmount = '';
    this.packageConfigId = '';
    this.packageTime = '';

    if(data.length > 0) {
      data.forEach( el => {
        if(el.tabsId === this.editableTabsValue) {
          this.ruleAmount = el.num;
          this.discount = el.discount === 0 ? el.discount : (el.discount * 100);
          this.packageConfigId = el.packageAddOnId;
          this.packageTime = el.confirmDate;
        }
      });
    }
    // console.log(val);
  }

  /**
   * @description: 折扣输入框变化
   * @return {*}
   */
  private onDiscountChange(val) {
    debounceUtils.debounce(() => {
      if(val < 0) {
        this.$message.error({
          message: this.vm.$t('User.请输入') + this.vm.$t('User.正确的优惠折扣'),
          duration: 3000,
          onClose: () => {
            this.discount = 0;
          }
        })

      } else if(!regIntegerMin.test(val)) {
        this.$message.error({
          message: this.vm.$t('User.优惠折扣请输入整数值'),
          duration: 3000,
          onClose: () => {
            this.discount = 0;
          }
        })

      }
    }, 1500);
  }

  /**
   * @description: 数量输入框变化
   * @return {*}
   */
  private handleInputBlurAmount() {
    if(this.packageConfigId === '') {
      this.$message.error({
        message: this.vm.$t('User.请选择') + this.vm.$t('User.附加配套'),
        duration: 3000,
        onClose: () => {
          this.ruleAmount = '';
          this.discount = 0;
        }
      })

    } else if(this.discount === '' || this.discount > 100) {
      this.$message.error({
        message: this.vm.$t('User.请输入') + this.vm.$t('User.正确的优惠折扣'),
        duration: 3000,
        onClose: () => {
          this.ruleAmount = '';
          this.discount = 0;
        }
      })

    } else if(this.packageTime === '') {
      this.$message.error({
        message: this.vm.$t('User.请选择') + this.vm.$t('User.生效日期'),
        duration: 3000,
        onClose: () => {
        }
      })

    }  else if(this.ruleAmount === '' || this.ruleAmount < 0) {
      this.$message.error({
        message: this.vm.$t('User.请输入') + this.vm.$t('User.数量'),
        duration: 3000,
        onClose: () => {
          this.ruleAmount = '';
        }
      })

    } else {
      if(this.ruleAmount > 0) {
        let discounts = this.discount === 0 ? this.discount : (this.discount / 100).toFixed(2);
        let param = {
          "discount": discounts,
          "tabsId": this.editableTabsValue,
          "num": this.ruleAmount,
          "packageAddOnId": this.packageConfigId,
          "confirmDate": this.packageTime,
        }
        this.addOnNumVoList.push(param);
      } else {
        this.addOnNumVoList = [];
        console.log(`输入框未变化${this.ruleAmount}`);
      }

    }
  }

  // 注册校验
  private submitForm(formName) {
    let data: any = this.cascaderFormOptions;
    let additionalData: any = [];
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;

    ref.validate((valid) => {
      if (valid) {
        const list = this.addOnNumVoList;
        if(list.length === 0) {
          this.$message.error({
            message: this.vm.$t('User.必要信息不能为空'),
            duration: 3000,
            onClose: () => {
              this.loadingType = false;
            }
          })

        } else {
          // console.log(this.addOnNumVoList);
          
          this.ruleForm.addOnNumVoList = this.addOnNumVoList;
          this.submitFormClick();
        }
        
      } else {
        this.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 弹窗提交
  private async submitFormClick() {
    if(this.dialogFormVisibleId === 3) {

    } else {
      const text = this.vm.$t('User.购买成功');
      const res = await webGetAdminPageUserMemberAdditionalAdd({ ...this.ruleForm });
      // console.log(res);
      MessageTips(res, true, true, text, () => {
        UserListStore.storeActionPageUserList(this.param);
        Object.keys(this.ruleForm).forEach(key => {
          if(key === 'addOnNumVoList') this.ruleForm[key] = []
          else this.ruleForm[key] = ''
        });
        this.loadingType = false;
        this.dialogFormVisible = false;

        const downloadFileUrl = res.data.data.filePath;
        aLinkDownloadUrl(downloadFileUrl);

      }, err => {
        this.loadingType = false;
      });
    }
  }
}
</script>

<style lang='scss' scoped>
.table-box {
  /deep/.el-table .el-button--text {padding: 5px 0 !important;}
}

/deep/.el-dialog__body {
  .el-form-item {margin-bottom: 15px !important;}
  .v-atcive {
    color: #409eff;
    .v-text {font-weight: bold;}
  }
  .v-info-box {
    .v-select {
      margin: 10px 0 5px;
    }
    .v-h3 {
      padding: 15px 0 10px;
      &:nth-child(1) {padding: 0 0 5px;}
    }
    .weui-flex {margin: 10px 0;}
    .v-title {
      font-size: 14px;
    }
  }
  .v-text-bottom {
    margin-top: 15px;
  }
}

// 表格头部搜索
.v-header-search {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  /deep/.el-form-item__label {padding-left: 12px;}
  /deep/.el-form--inline .el-form-item, .v-btn {
    vertical-align: middle;
    margin-bottom: 15px;
  }
  .v-btn {margin-left: 15px;}
}
.pages {
  min-height: 700px;
  /deep/.el-tag {
    min-width: 60px;
    text-align: center;
  }
  .v-coach-box {
    padding: 15px;
    .v-header-box {
      position: relative;
      .v-text {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 10px;
        font-size: 16px;
        color: #666;
      }
      .v-title {
        margin-bottom: 30px;
      }
    }
    .weui-flex {
      padding: 15px 0;
      border-top: 1px solid #f1f1f1;
      .weui-flex-bd {
        padding: 0 10px;
      }
    }
  }
}
</style>