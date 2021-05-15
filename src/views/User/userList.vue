<template>
  <!-- 用户列表 -->
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
            <el-form-item :label="$t('Ult.用户状态')">
              <el-select v-model="param.status" :placeholder="$t('Ult.请选择')" size="small">
                <el-option
                  v-for="item in formOptionsStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Ult.账号激活')">
              <el-select v-model="param.active" :placeholder="$t('Ult.请选择')" size="small">
                <el-option
                  v-for="item in formOptionsActive"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Ult.用户名')">
              <el-input type="text" v-model="param.userName" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('Ult.推荐人')">
              <el-input type="text" v-model="param.invitationUserName" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >{{ $t('Ult.搜索') }}</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">{{ $t('Ult.重置') }}</el-button>
          </el-form>
        </div>
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-user" class="v-btn" @click="onRegisterClick">{{ $t('Ult.注册用户') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-chat-dot-round" class="v-btn" @click="onMessageNotificationClick" plain>{{ $t('Ult.消息通知') }}</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <!-- 表格 -->
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <!-- 内容部分-操作 -->
          <el-table-column slot="operateTagStatus" :label="$t('Ult.用户状态')" align="center" width="auto" >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1 ? true : false"
                :active-text="$t('Ult.正常')"
                :inactive-text="$t('Ult.已禁止')"
                @change="handleOpenClick(scope.row, 1)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column slot="operateTagActive" :label="$t('Ult.账号激活')" align="center" width="auto" >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.active === 1 ? true : false"
                :active-text="$t('Ult.已激活')"
                :inactive-text="$t('Ult.未激活')"
                @change="handleOpenClick(scope.row, 2)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column slot="operateTagKyc" :label="$t('Ult.实名认证')" width="150" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.kycStatus === 1">{{ $t('Ult.认证通过') }}</el-tag>
              <el-tag type="info" v-else-if="scope.row.kycStatus === 0">{{ $t('Ult.待审核') }}</el-tag>
              <el-tag type="danger" v-else-if="scope.row.kycStatus === 2">{{ $t('Ult.认证拒绝') }}</el-tag>
              <el-tag type="info" v-else>{{ $t('Ult.未认证') }}</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column slot="operateButton" :label="$t('Ult.操作')" align='center' width="auto">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowClick(scope.row)">{{ $t('Ult.查看') }}</el-button>
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)" icon="el-icon-edit-outline">{{ $t('Ult.修改') }}</el-button>
              <el-button type="text" size="small" @click="handleRowContractClick(scope.row)" icon="el-icon-notebook-2" v-if="scope.row.contractRecordStatus  === 1">{{ $t('Ult.购买合约') }}</el-button>
              <el-button type="text" size="small" @click="handleRowTaskClick(scope.row)" icon="el-icon-set-up" class="v-btn-yellow" v-if="scope.row.type === 2 && scope.row.contractRecordStatus === 0 && scope.row.remainingSum > 0 && scope.row.active === 1">{{ $t('Ult.预投任务') }}</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <!-- 左侧弹窗 -->
    <el-drawer
      @close="onDrawerClose"
      :title="$t('Ult.个人信息')"
      :show-close="false"
      :append-to-body="true"
      :visible.sync="drawerRightType"
      direction="rtl"
      size="40%" >
      <!-- 注册/修改 模块 -->
      <div v-if="drawerRegisterType">
        <UserRegister
          @getUserRegisterFormClick="getUserRegisterFormClick" />
      </div>
      <div class="content" v-else>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户ID') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.userId}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户名') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.userName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户邀请码') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.userCode}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.推荐码') }}</div>
          <div class="weui-flex-bd">
            <span v-if="drawerRowData.invitationUserCode === '-1'">{{$t('Ult.暂无')}}</span>
            <span v-else>{{drawerRowData.invitationUserCode}}</span>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.推荐人') }}</div>
          <div class="weui-flex-bd">
            <span>{{drawerRowData.invitationUserName}}</span>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.已购合约名称') }}</div>
          <div class="weui-flex-bd">
            <span v-if="!drawerRowData.contractName">{{$t('Ult.暂无')}}</span>
            <span v-else>{{drawerRowData.contractName}}</span>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户等级') }}</div>
          <div class="weui-flex-bd">
            <el-tag>{{drawerRowData.levelShortName}}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户状态') }}</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.status === 1">{{ $t('Ult.正常') }}</el-tag>
            <el-tag type="danger" v-else>{{ $t('Ult.已禁止') }}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.账号激活') }}</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.active === 1">{{ $t('Ult.已激活') }}</el-tag>
            <el-tag type="danger" v-else>{{ $t('Ult.未激活') }}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.是否为子账户') }}</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.sonAccount === 1">{{ $t('Ult.是') }}</el-tag>
            <el-tag type="danger" v-else>{{ $t('Ult.否') }}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.通知类型') }}</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.isOpenNotice === 1">{{ $t('Ult.开启') }}</el-tag>
            <el-tag type="danger" v-else>{{ $t('Ult.禁止') }}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.实名认证') }}</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.kycStatus === 1">{{ $t('Ult.认证通过') }}</el-tag>
            <el-tag type="info" v-else-if="drawerRowData.kycStatus === 0">{{ $t('Ult.待审核') }}</el-tag>
            <el-tag type="danger" v-else-if="drawerRowData.kycStatus === 2">{{ $t('Ult.认证拒绝') }}</el-tag>
            <el-tag type="info" v-else>{{ $t('Ult.未认证') }}</el-tag>
          </div>
        </div>
        <!-- <div class="weui-flex">
          <div class="weui-flex-hd">注册方式</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.registerType === 1">公众注册</el-tag>
            <el-tag v-else>个人注册</el-tag>
          </div>
        </div> -->
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.证件类型') }}</div>
          <div class="weui-flex-bd" v-if="drawerRowData.identityCardType != 0">
            <el-tag v-if="drawerRowData.identityCardType === 1">{{ $t('Ult.身份证') }}</el-tag>
            <el-tag v-else>{{ $t('Ult.护照') }}</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.真实姓名') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.fullName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.证件号码') }}</div>
          <div class="weui-flex-bd">
            <span v-if="drawerRowData.identityCard === '-1'">{{$t('Ult.暂无')}}</span>
            <span v-else>{{drawerRowData.identityCard}}</span>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户邮箱') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.email}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户电话') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.phone}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.用户生日') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.birthdayTime}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">{{ $t('Ult.创建时间') }}</div>
          <div class="weui-flex-bd">{{drawerRowData.createTime}}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      @close="onObjectKeys(0)" >
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">{{ $t('Ult.购买预投任务') }}</div>
      <div slot="title" class="el-dialog__title" v-else>{{ $t('Ult.购买合约') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15" v-if="dialogFormType">
            <el-form
              ref="ruleForm"
              label-width="130px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formUserOpenTask">
              <el-form-item :label="$t('Ult.用户ID')">
                <el-input type="text" v-model="formUserOpenTask.userId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('Ult.预投数量')" prop="investmentAmount">
                <el-input type="number" v-model="formUserOpenTask.investmentAmount" size="medium" ></el-input>
                <i class="el-icon-bank-card" style="font-size: 18px; vertical-align: middle; margin-bottom: 3px; color:#409eff;" /> {{ $t('Ult.余额') }}: {{formUserOpenTask.amount}}
              </el-form-item>
              <el-form-item :label="$t('Ult.任务周期')">
                <el-select v-model="formUserOpenTask.taskCycle" :placeholder="$t('Ult.请选择')" @change="onChangeSelect" >
                  <el-option
                    v-for="item in userOpenTaskData"
                    :key="item.taskCycle"
                    :label="item.taskCycle"
                    :value="item.taskCycle">
                  </el-option>
                </el-select>
                <p><i class="el-icon-coin" style="font-size: 18px; vertical-align: middle; margin-bottom: 3px; color:#409eff;" /> {{ $t('Ult.剩余可投数量') }}: {{userTaskAmount}}</p>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="15" v-else>
            <el-form
              ref="ruleForm"
              label-width="130px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formData">
              <el-form-item :label="this.$t('Ult.用户ID')">
                <el-input v-model="formData.userId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item :label="this.$t('Ult.用户名')">
                <el-input v-model="formData.userName" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item :label="this.$t('Ult.合约名称')">
                <el-select v-model="formData.contractId" :placeholder="this.$t('Ult.请选择')">
                  <el-option
                    v-for="item in formOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="resetForm('ruleForm')" v-if="dialogFormType">重置</el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" >{{ $t('Ult.确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 消息通知 -->
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogNoticeFormVisible" >
      <div slot="title" class="el-dialog__title" >{{ $t('Ult.消息通知') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15" >
            <el-form
              ref="ruleNoticeForm"
              label-width="130px"
              class="demo-ruleForm"
              :rules="rulesNotice"
              :model="formNotice">
              <el-form-item :label="$t('Ult.通知类型')" prop="type" >
                <el-radio-group v-model="formNotice.type" @change="onNoticeChange">
                  <el-radio label="1" >{{ $t('Ult.全部') }}</el-radio>
                  <el-radio label="0" >{{ $t('Ult.部分') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('Ult.标题')" prop="title">
                <el-input type="text" v-model="formNotice.title" size="medium" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('Ult.消息')" prop="message">
                <el-input type="text" v-model="formNotice.message" size="medium" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('Ult.发送时间')" prop="dataTime">
                <el-date-picker
                  v-model="formNotice.dataTime"
                  type="datetime"
                  :placeholder="$t('Ult.请选择')"
                  value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="resetForm('ruleNoticeForm')" v-if="dialogFormType">重置</el-button> -->
        <el-button type="primary" @click="submitNoticeForm('ruleNoticeForm')" :loading="loadingType" >{{ $t('Ult.确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { sessionData } from '@/filters/storage';
import { IndexUserListData } from '@/types/views/index.interface';
import { UserListStore } from '@/store/private/PageUserList';
import { ContractListStore } from '@/store/private/PageContractList';
import { 
  webGetAdminPageUserAtive, 
  webGetAdminPageUserBlockedAccount, 
  webGetAdminPageUserBuyContract, 
  webGetAdminPageUserRemainingAccount, 
  webGetAdminPageUserInvestmentTaskBuy,
  webGetAdminSendNotice
} from "@/api/index";

import ElTable from "@/components/ElTable/index.vue";
import UserRegister from "./userRegister.vue";

type IndexData = {
  page: number;
  pageSize: number;
  userName: string;
  invitationUserName: string;
  status: string;
  active: string;
};

@Component({
  components: {
    ElTable,
    UserRegister
  },
})
export default class userList extends Vue {
  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12,
    userName: '',
    invitationUserName: '',
    status: '',
    active: ''
  };
  private formOptionsStatus: object = [
    {
      label: window['vm'].$t('Ult.正常'),
      value: '1'
    },
    {
      label: window['vm'].$t('Ult.已禁止'),
      value: '0'
    },
  ]
  private formOptionsActive: object = [
    {
      label: window['vm'].$t('Ult.已激活'),
      value: '1'
    },
    {
      label: window['vm'].$t('Ult.未激活'),
      value: '0'
    },
  ]

  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {
      prop: 'userName',
      label: window['vm'].$t('Ult.用户名'),
      width: 'auto',
    },
    {
      prop: 'userCode',
      label: window['vm'].$t('Ult.用户邀请码'),
      width: 'auto',
    },
    {
      prop: 'invitationUserName',
      label: window['vm'].$t('Ult.推荐人'),
      width: 'auto',
    },
    {
      slot: 'operateTagStatus',
    },
    {
      slot: 'operateTagActive',
    },
    {
      prop: 'createTime',
      label: window['vm'].$t('Ult.创建时间'),
      width: '165',
    },
    {
      slot: 'operateButton', //内容slot
    },
  ]; // 表格行头

  private drawerRightType: boolean = false;     // 个人信息弹窗
  private drawerRegisterType: boolean = false;  // 表格按钮弹窗
  private drawerRowData: object = {};      // 弹窗内容
  private loadingType: boolean = false;   //  加载
  private Disabled: boolean = false;      //  禁止

  private formOptions: any = [];
  private dialogFormType:boolean = true;
  private dialogFormVisible:boolean = false;
  private formData: any = {
    userId: '',
    contractId: '',
    userName: '',
  }

  private userOpenTaskData: any = [];
  private userTaskAmount: number | string = '0';  // 可投数量
  private formUserOpenTask: {
    // 装饰器名称
    userId: string;
    taskCycle: string;
    investmentAmount: number | string;
    amount: number | string;
  } = {
    userId: "",
    taskCycle: "",
    investmentAmount: "",
    amount: 0
  };

  // 消息通知
  private dialogNoticeFormVisible: boolean = false;
  private noticeFormNameMap: any = [];
  private formNotice = {
    message: '',
    title: '',
    type: '',
    userName: '',
    dataTime: '',
    userType: 'APP'
  }

  private rules = {
    investmentAmount: [
      { required: true, message: window['vm'].$t('Ult.请输入预投数量'), trigger: 'blur' },
    ],
    limitAmount: [
      { required: true, message: window['vm'].$t('Ult.请输入身份证号'), trigger: 'blur' },
      { min: 18, max: 19, message: window['vm'].$t('Ult.请填写18位数字号码'), trigger: 'blur' },
      {
        required: true,
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: window['vm'].$t('Ult.请输入正确的身份证号码'),
        trigger: 'blur'
      }
    ]
  };

  private rulesNotice = {
    message: [
      { required: true, message: window['vm'].$t('Ult.请输入消息'), trigger: 'blur' },
    ],
    title: [
      { required: true, message: window['vm'].$t('Ult.请输入标题'), trigger: 'blur' },
    ],
    type: [
      { required: true, message: window['vm'].$t('Ult.请选择通知类型'), trigger: 'change' },
    ],
    dataTime: [
      { required: true, message: window['vm'].$t('Ult.请选择时间'), trigger: 'change' },
    ],
  };

  // 获取数据
  get getUserPageList() {
    if(UserListStore.getUserPageList.code === 200) {
      return UserListStore.getUserPageList
    }
  };
  get getContractActivityId() {
    return ContractListStore.getContractActivityId
  };
  get getUserOpenTaskList() {
    return ContractListStore.getUserOpenTaskList
  };

  // 监听数据列表
  @Watch('getUserPageList', { deep: true })
  userPageChange(newValue) {
    let list = newValue.data.list;
    if(list.length > 0) {
      let obj = deepCloneData(list);
      obj.forEach( el => {
        el.birthdayTime = FormatCurrentTime("YYYY-mm-dd", el.birthday)
        el.createTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS", el.createTime)
      });
      this.tableData = obj;
    } else {this.tableData = list;}
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  /**
   *  监听用户- 合约名称列表
   */
  @Watch('getContractActivityId', { deep: true })
  contractActivityId(newValue) {
    let list = newValue.data;
    list.forEach( el => {
      el.value = el.contractId
      el.label = el.contractName
    });
    this.formOptions = list;
    // console.log(newValue)
  };

  /**
   *  监听用户- 合约任务周期列表
   */
  @Watch('getUserOpenTaskList', { deep: true })
  userOpenTaskList(newValue) {
    const list = newValue.data;
    this.userOpenTaskData = list;
    // console.log(newValue)
  };

  @Watch('param', { deep: true })
  paramChange(newValue) {
    // console.log(newValue)
  };

  // 生命周期
  created() {
    UserListStore.storeActionPageUserList(this.param);    // 用户列表
    ContractListStore.storeActionContractActivityId({});  // 合约列表
  };

  // 生命周期
  mounted () {};

  // 左侧弹窗关闭
  private onDrawerClose() {
    const row = {};
    // if(this.drawerRegisterType) UserListStore.storeActionPageUserRowInfo(row);
  }

  // 注册/修改 表单成功回调刷新
  private getUserRegisterFormClick(id) {
    UserListStore.storeActionPageUserList(this.param);
  }

  // 获取剩余可投数量
  private onChangeSelect(event) {
    let data = this.userOpenTaskData;  // 任务周期列表
    data.forEach( el => {
      if(el.taskCycle === event) {
        this.userTaskAmount = el.taskAmount;
      }
    });
  }

  // 刷新
  private onRefreshClick() {
    UserListStore.storeActionPageUserList(this.param);
  }

  // 复选框
  private handleSelectionChange(data) {
    this.noticeFormNameMap = data;
    // console.log(data);
  }
  // 分页
  private handleCurrentChange(val) {
    const _that = this;
    _that.param.page = val
    UserListStore.storeActionPageUserList(_that.param);
    // console.log(this.param);
  }
  
  // 操作按钮  -查看
  private handleRowClick(row: IndexUserListData) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.drawerRightType = true;
    _that.drawerRegisterType = false;
    _that.drawerRowData = obj;
    // console.log(obj);
  }

  // 注册
  private onRegisterClick() {
    const _that = this;
    const row = {
      ids: 1
    };
    _that.drawerRightType = true;
    _that.drawerRegisterType = true;
    UserListStore.storeActionPageUserRowInfo(row);
  }

  // 修改
  private handleRowModifyClick(row: IndexUserListData) {
    const _that = this;
    const obj = deepCloneData(row);
    UserListStore.storeActionPageUserRowInfo(obj);
    _that.drawerRightType = true;
    _that.drawerRegisterType = true;
    // console.log(row);
  }

  // 重置
  private resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }
  private resetSearchForm(formName) {
    Object.keys(this.param).forEach(key => {
      if(key == 'userName' || key == 'invitationUserName' || key == 'status' || key == 'active') this.param[key] = '';
    });
    UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }
  // 搜索
  private submitSearchForm(formName) {
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

  // 发送通知-弹窗
  private onMessageNotificationClick() {
    this.dialogNoticeFormVisible = true;
  }

  // 发送通知-部分用户
  private onNoticeChange(val) {
    // console.log(val);
    if(val === '0' && this.noticeFormNameMap.length === 0) {
      this.$message.error({
        message: window['vm'].$t('Ult.请先勾选用户'),
        duration: 3000,
        onClose: () => {
          this.resetForm('ruleNoticeForm');
          this.dialogNoticeFormVisible = false;
        }
      })
    }
  }

  private submitNoticeForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        this.onDialogNoticeFormClick();
      } else {
        this.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 通知提交
  private async onDialogNoticeFormClick() {
    let nameMap = this.noticeFormNameMap;
    let userName: any = [];
    nameMap.forEach( el => {
      userName.push(el.userName);
    });
    let { message, title, dataTime, type, userType } = this.formNotice;
    
    const res = await webGetAdminSendNotice({
      'message': message,
      'title': title,
      'dataTime': dataTime,
      'type': type,
      'userType': userType,
      'userName': userName.toString(),
    })
    const text = window['vm'].$t('Ult.发送成功')
    MessageTips(res, true, true, text, item => {
      this.loadingType = false;
      this.resetForm('ruleNoticeForm');
    }, err => {
      this.loadingType = false;
    });
  }

  // 表格Switch操作 确认框
  private handleOpenClick(row, id) {
    const _that = this;
    const text1 = window['vm'].$t('Ult.此操作将删除该条信息');
    const text2 = window['vm'].$t('Ult.提示');
    _that.$confirm(text1, text2, {
      confirmButtonText: window['vm'].$t('Ult.确定'),
      cancelButtonText: window['vm'].$t('Ult.取消'),
      type: 'warning',
    }).then(() => {
      if (id === 1) {
        _that.onSwitchStatusChange(row)  // 用户状态

      } else {
        _that.onSwitchChange(row)  // 账号激活
      }
    })
  }

  // 激活/锁定 账号
  private async onSwitchChange(row) {
    // 激活
    if (row.active === 0) {
      let params = {
        active: 1,
        userId: row.userId
      }
      // console.log(params);
      const res = await webGetAdminPageUserAtive(params)
      const text = window['vm'].$t('Ult.激活成功')
      MessageTips(res, true, true, text, item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);
    } else {
      let params = {
        active: 0,
        userId: row.userId
      }
      const res = await webGetAdminPageUserAtive(params)
      const text = window['vm'].$t('Ult.锁定成功')
      MessageTips(res, true, true, text, item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);

    }
  }

  // 正常/禁止 用户状态
  private async onSwitchStatusChange(row) {
    // 正常
    if (row.status === 0) {
      let params = {
        status: 1,
        userId: row.userId
      }
      const res = await webGetAdminPageUserBlockedAccount(params)
      const text = window['vm'].$t('Ult.修改成功')
      MessageTips(res, true, true, text, item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);
    } else {
      let params = {
        status: 0,
        userId: row.userId
      }
      const res = await webGetAdminPageUserBlockedAccount(params)
      const text = window['vm'].$t('Ult.禁止成功')
      MessageTips(res, true, true, text, item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);
    }
  }

  // 用户预投任务
  private async handleRowTaskClick(row) {
    let { userId } = row;
    let res = await webGetAdminPageUserRemainingAccount({'userId': userId});  // 用户余额
    ContractListStore.storeActionUserOpenTaskList({'userId': userId});  // 任务列表
    // console.log(res);
    if (res.data.code === 200) {
      this.$nextTick(() => {
        this.formUserOpenTask.userId = row.userId;
        this.formUserOpenTask.amount = res.data.data;
        this.dialogFormVisible = true;
        this.dialogFormType = true;
        // console.log(this.formUserOpenTask.amount);
      })
    } else {
      MessageTips(res, false, true, '', null, null);
    }
  }

  // 用户购买合约
  private handleRowContractClick(row) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.dialogFormVisible = true;
    _that.dialogFormType = false;
    _that.formData = obj;
  }

  private submitForm(formName) {
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

  // 清空表单对象
  private onObjectKeys(id: number) {
    const _that = this;
    _that.dialogFormVisible = false;
    this.userTaskAmount = 0;
    if(id === 1) {
      Object.keys(_that.formUserOpenTask).forEach(key => _that.formUserOpenTask[key] = '');
    } else if (id === 2) {
      Object.keys(_that.formData).forEach(key => _that.formData[key] = '');
    } else {
      Object.keys(_that.formUserOpenTask).forEach(key => _that.formUserOpenTask[key] = '');
      Object.keys(_that.formData).forEach(key => _that.formData[key] = '');
    }
    // console.log(_that.formUserOpenTask);
  }

  // 确认提交
  private async onDialogFormClick() {
    let type = this.dialogFormType;
    
    if(type) {
      let { userId, taskCycle, investmentAmount, amount  } = this.formUserOpenTask;
      if (investmentAmount > amount) {
        setTimeout(() => {
          this.loadingType = false;
        }, 3000);
      } else {
        // 任务
        let res = await webGetAdminPageUserInvestmentTaskBuy({
          'userId': userId,
          'taskCycle': taskCycle,
          'investmentAmount': investmentAmount,
        })
        // console.log(res);
        
        const text = window['vm'].$t('Ult.预投成功')
        MessageTips(res, true, true, text, item => {
          this.onRefreshClick();
          this.onObjectKeys(1);
          this.loadingType = false;
        }, item => {
          this.loadingType = false;
        });
      }
    } else {
      // 合约
      let { userId, contractId } = this.formData;
      let res = await webGetAdminPageUserBuyContract({
        'userId': userId,
        'contractId': contractId,
      })
      // console.log(res);
      const text = window['vm'].$t('Ult.购买成功')
      MessageTips(res, true, true, text, item => {
        this.onRefreshClick();
        this.onObjectKeys(2);
        this.loadingType = false;
      }, item => {
        this.loadingType = false;
      });
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.el-tag {
  min-width: 90px;
  text-align: center;
}
/deep/.el-button span {margin-left: 3px;}
// drawer 弹窗
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
    padding: 10px 0;
    border-top: 1px solid #eee;
    .weui-flex-hd {min-width: 120px;font-size: 12px; color: #666;}
  }
}
// dialog 弹窗
/deep/.el-dialog__body {
  min-height: 300px;
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
</style>
