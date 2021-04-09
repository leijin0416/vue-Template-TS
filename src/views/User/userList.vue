<template>
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
            <el-form-item label="用户名">
              <el-input type="text" v-model="param.userName" size="small" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="submitSearchForm('ruleSearchForm')" size="small" icon="el-icon-search" class="v-btn" >搜 索</el-button>
            <el-button @click="resetSearchForm('ruleSearchForm')" size="small" icon="el-icon-refresh-left" class="v-btn">重 置</el-button>
          </el-form>
        </div>
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-user" class="v-btn" @click="onRegisterClick">注册用户</el-button>
          <el-button type="info" size="small" icon="el-icon-refresh" class="v-btn" @click="onRefreshClick" circle />
        </div>
        <!-- 表格 -->
        <ElTable :tableData="tableData"
          :tableColumnData="tableColumnData"
          :totalCount="totalCount"
          @handleSelectionChange="handleSelectionChange"
          @handleCurrentChange="handleCurrentChange">
          <!-- 内容部分-操作 -->
          <el-table-column slot="operateTagStatus" label="用户状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1 ? true : false"
                active-text="正常"
                inactive-text="已禁止"
                @change="handleOpenClick(scope.row, 1)">
              </el-switch>
            </template>
          </el-table-column>

          <!-- <el-table-column slot="operateTagRegister" label="注册方式" width="150" align="center">
            <template slot-scope="scope">
              <el-tag>{{scope.row.registerType === 1 ? '个人注册' : '邮箱注册'}}</el-tag>
            </template>
          </el-table-column> -->

          <el-table-column slot="operateTagActive" label="账号激活" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.active === 1 ? true : false"
                active-text="已激活"
                inactive-text="未激活"
                @change="handleOpenClick(scope.row, 2)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column slot="operateTagKyc" label="实名审核" width="150" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.kycStatus === 1">通过</el-tag>
              <el-tag type="info" v-else-if="scope.row.kycStatus === 0">待审核</el-tag>
              <el-tag type="danger" v-else-if="scope.row.kycStatus === 2">拒绝</el-tag>
              <el-tag type="info" v-else>未实名认证</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column slot="operateButton" label="操作" align='center' width="220">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleRowClick(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleRowModifyClick(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="handleRowContractClick(scope.row)" icon="el-icon-notebook-2" v-if="scope.row.contractRecordStatus  === 1">购买合约</el-button>
              <el-button type="text" size="small" @click="handleRowTaskClick(scope.row)" icon="el-icon-set-up" class="v-btn-yellow" v-if="scope.row.type === 2 && scope.row.contractRecordStatus === 0 && scope.row.remainingSum > 0 && scope.row.active === 1">预投任务</el-button>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
    <!-- 左侧弹窗 -->
    <el-drawer
      title="个人信息"
      :append-to-body="true"
      :visible.sync="drawerRightType"
      direction="rtl"
      size="40%" >
      <div v-if="drawerRegisterType">
        <UserRegister />
      </div>
      <div class="content" v-else>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户ID</div>
          <div class="weui-flex-bd">{{drawerRowData.userId}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户名</div>
          <div class="weui-flex-bd">{{drawerRowData.userName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户邀请码</div>
          <div class="weui-flex-bd">{{drawerRowData.userCode}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户等级</div>
          <div class="weui-flex-bd">{{drawerRowData.levelShortName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">已购合约名称</div>
          <div class="weui-flex-bd">{{drawerRowData.contractName ? drawerRowData.contractName : '无'}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户状态</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.status === 1">正常</el-tag>
            <el-tag type="danger" v-else>禁止</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">账户激活</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.active === 1">已激活</el-tag>
            <el-tag type="danger" v-else>未激活</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">实名审核</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.kycStatus === 1">审核通过</el-tag>
            <el-tag type="info" v-else-if="drawerRowData.kycStatus === 0">待审核</el-tag>
            <el-tag type="danger" v-else-if="drawerRowData.kycStatus === 2">审核拒绝</el-tag>
            <el-tag type="info" v-else>暂未实名</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">注册方式</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.registerType === 1">公众注册</el-tag>
            <el-tag v-else>个人注册</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">通知类型</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.isOpenNotice === 1">开启</el-tag>
            <el-tag type="danger" v-else>禁止</el-tag>
          </div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">推荐码</div>
          <div class="weui-flex-bd">{{drawerRowData.invitationUserCode != -1 ? drawerRowData.invitationUserCode : '无'}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">推荐人用户名</div>
          <div class="weui-flex-bd">{{drawerRowData.invitationUserName != -1 ? drawerRowData.invitationUserName : '无'}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">是否为子账户</div>
          <div class="weui-flex-bd">
            <el-tag v-if="drawerRowData.sonAccount === 1">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
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
          <div class="weui-flex-hd">用户全名</div>
          <div class="weui-flex-bd">{{drawerRowData.fullName}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户地址</div>
          <div class="weui-flex-bd">{{drawerRowData.address}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户邮箱</div>
          <div class="weui-flex-bd">{{drawerRowData.email}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户电话</div>
          <div class="weui-flex-bd">{{drawerRowData.phone}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">用户生日</div>
          <div class="weui-flex-bd">{{drawerRowData.birthdayTime}}</div>
        </div>
        <div class="weui-flex">
          <div class="weui-flex-hd">创建时间</div>
          <div class="weui-flex-bd">{{drawerRowData.formatTime}}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      @close="onObjectKeys(0)" >
      <div slot="title" class="el-dialog__title" v-if="dialogFormType">购买预投任务</div>
      <div slot="title" class="el-dialog__title" v-else>购买合约</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="15" v-if="dialogFormType">
            <el-form
              ref="ruleForm"
              label-width="130px"
              class="demo-ruleForm"
              :rules="rules"
              :model="formUserOpenTask">
              <el-form-item label="用户ID">
                <el-input type="text" v-model="formUserOpenTask.userId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="预投数量" prop="investmentAmount">
                <el-input type="number" v-model="formUserOpenTask.investmentAmount" size="medium" ></el-input>
                <i class="el-icon-bank-card" style="font-size: 18px; vertical-align: middle; margin-bottom: 3px; color:#409eff;" /> 余额: {{formUserOpenTask.amount}}
              </el-form-item>
              <el-form-item label="任务周期">
                <el-select v-model="formUserOpenTask.taskCycle" placeholder="请选择" @change="onChangeSelect" >
                  <el-option
                    v-for="item in userOpenTaskData"
                    :key="item.taskCycle"
                    :label="item.taskCycle"
                    :value="item.taskCycle">
                  </el-option>
                </el-select>
                <p><i class="el-icon-coin" style="font-size: 18px; vertical-align: middle; margin-bottom: 3px; color:#409eff;" /> 剩余可投数量：{{userTaskAmount}}</p>
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
              <el-form-item label="用户名">
                <el-input type="text" v-model="formData.userName" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="用户ID">
                <el-input type="text" v-model="formData.userId" size="medium" disabled></el-input>
              </el-form-item>
              <el-form-item label="合约名称">
                <el-select v-model="formData.contractId" placeholder="请选择">
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
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { UserListStore } from '@/store/private/PageUserList';
import { ContractListStore } from '@/store/private/PageContractList';
import { webGetAdminPageUserAtive, webGetAdminPageUserBlockedAccount, webGetAdminPageUserBuyContract, webGetAdminPageUserRemainingAccount, webGetAdminPageUserInvestmentTaskBuy } from "@/api/index";
import { IndexUserListData } from '@/types/views/index.interface';
import { sessionData } from '@/filters/storage';

import ElTable from "@/components/ElTable/index.vue";
import UserRegister from "./userRegister.vue";

type IndexData = {
  page: number,
  pageSize: number,
  userName: string,
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
  };

  private totalCount: number = 1;  // 表格总数
  private tableData: object = [];  // 表格数据
  private tableColumnData: object = [
    {
      type: 'selection',
    },
    {
      prop: 'userName',
      label: '用户名',
    },
    {
      prop: 'userCode',
      label: '用户邀请码',
      width: '150',
    },
    {
      prop: 'invitationUserName',
      label: '推荐人用户名',
      width: '150',
    },
    {
      slot: 'operateTagKyc',
    },
    {
      slot: 'operateTagStatus',
    },
    {
      slot: 'operateTagActive',
    },
    {
      prop: 'formatTime',
      label: '创建时间',
      width: 'auto',
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
    amount: 0,
  };

  private rules: any  = {
    investmentAmount: [
      { required: true, message: '请输入预投数量', trigger: 'blur' },
    ],
    limitAmount: [
      { required: true, message: '请输入身份证号', trigger: 'blur' },
      { min: 15, max: 18, message: '请如实填写18位号码', trigger: 'blur' },
      {
        required: true,
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '请输入正确的身份证号码',
        trigger: 'blur'
      }
    ]
  };

  // 获取数据
  get getUserPageList() {
    return UserListStore.getUserPageList
  };
  get getContractActivityId() {
    return ContractListStore.getContractActivityId
  };
  get getUserOpenTaskList() {
    return ContractListStore.getUserOpenTaskList
  };

  // 监听数据列表
  @Watch('getUserPageList', { deep: true })
  userPageChange(newValue: any) {
    let list = newValue.data.list;
    // console.log(list);
    
    list.forEach( el => {
      el.birthdayTime = FormatCurrentTime("YYYY-mm-dd",el.birthday)
      el.formatTime = FormatCurrentTime("YYYY-mm-dd HH:MM:SS",el.createTime)
    });
    
    this.tableData = list;
    this.totalCount = newValue.data.total;
    // console.log(newValue)
  };

  /**
   *  监听用户- 合约名称列表
   */
  @Watch('getContractActivityId', { deep: true })
  contractActivityId(newValue: any) {
    let list = newValue.data;
    // console.log(list);
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
  userOpenTaskList(newValue: any) {
    const list = newValue.data;
    this.userOpenTaskData = list;
    // console.log(list);
    // console.log(newValue)
  };

  @Watch('param', { deep: true })
  paramChange(newValue: any) {
    // console.log(newValue)
  };

  // 生命周期
  created() {
    UserListStore.storeActionPageUserList(this.param);    // 用户列表
    ContractListStore.storeActionContractActivityId({});  // 合约列表
  };

  // 生命周期
  mounted () {};

  // 获取剩余可投数量
  private onChangeSelect(event) {
    let data = this.userOpenTaskData;  // 任务周期列表
    data.forEach( el => {
      if(el.taskCycle === event) {
        this.userTaskAmount = el.taskAmount;
      }
    });
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
  
  private resetSearchForm(formName) {
    Object.keys(this.param).forEach(key => {
      if(key == 'userName') this.param[key] = ''
    });
    UserListStore.storeActionPageUserList(this.param);
    // console.log(this.param);
  }

  // 刷新
  private onRefreshClick() {
    UserListStore.storeActionPageUserList(this.param);
  }
  
  // 操作按钮  -查看
  private handleRowClick(row: IndexUserListData) {
    const _that = this;
    const obj = deepCloneData(row);
    _that.$nextTick(() => {
      _that.drawerRightType = true;
      _that.drawerRegisterType = false;
      _that.drawerRowData = obj;
    })
    // console.log(obj);
  }

  // 注册
  private onRegisterClick() {
    const _that = this;
    const row = {};
    UserListStore.storeActionPageUserRowInfo(row);
    _that.$nextTick(() => {
      _that.drawerRightType = true;
      _that.drawerRegisterType = true;
    })
  }

  // 修改
  private handleRowModifyClick(row: IndexUserListData) {
    const _that = this;
    const obj = deepCloneData(row);
    UserListStore.storeActionPageUserRowInfo(obj);
    _that.$nextTick(() => {
      _that.drawerRightType = true;
      _that.drawerRegisterType = true;
    })
    // console.log(row);
  }

  // 分页
  private handleCurrentChange(val) {
    const _that = this;
    _that.$nextTick(() => {
      _that.param.page = val
    })
    UserListStore.storeActionPageUserList(_that.param);
    // console.log(this.param);
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  // 表格Switch操作 确认框
  private handleOpenClick(row, id) {
    const _that = this;
    _that.$confirm('此操作将执行重要信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
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
      
      let res: any = await webGetAdminPageUserAtive(params)
      MessageTips(res, true, true, '修改成功', item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);
    } else {
      let params = {
        active: 0,
        userId: row.userId
      }
      // console.log(params);
      
      let res: any = await webGetAdminPageUserAtive(params)
      MessageTips(res, true, true, '修改成功', item => {
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
      
      let res: any = await webGetAdminPageUserBlockedAccount(params)
      // console.log(res);
      MessageTips(res, true, true, '修改状态成功', item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);
    } else {
      let params = {
        status: 0,
        userId: row.userId
      }
      let res: any = await webGetAdminPageUserBlockedAccount(params)
      MessageTips(res, true, true, '修改状态成功', item => {
        UserListStore.storeActionPageUserList(this.param);
      }, null);
    }
  }

  // 用户预投任务
  private async handleRowTaskClick(row) {
    let { userId } = row;
    let res: any = await webGetAdminPageUserRemainingAccount({'userId': userId});  // 用户余额
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
        let res: any = await webGetAdminPageUserInvestmentTaskBuy({
          'userId': userId,
          'taskCycle': taskCycle,
          'investmentAmount': investmentAmount,
        })
        // console.log(res);
        
        MessageTips(res, true, true, '预投成功', item => {
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
      let res: any = await webGetAdminPageUserBuyContract({
        'userId': userId,
        'contractId': contractId,
      })
      // console.log(res);
      MessageTips(res, true, true, '购买成功', item => {
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
.container {
  min-height: 800px;
  /deep/.el-switch__label {color: #909399;}
  /deep/.el-switch__label.is-active {
    font-weight: bold;
    color: #409EFF;
  }
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
    padding: 10px 0;
    border-top: 1px solid #eee;
    .weui-flex-hd {min-width: 120px;font-size: 12px; color: #666;}
  }
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
