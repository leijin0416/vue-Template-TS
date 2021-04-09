<template>
  <!-- 表单信息 -->
  <div class="form-box">
    <el-row>
      <el-col :span="18">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="用户ID" v-if="getUserRowInfoType === 0">
            <el-input v-model="ruleForm.userId" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input type="text" v-model="ruleForm.userName" placeholder="请输入6位以上字符的英文+数字格式"></el-input>
          </el-form-item>
          <el-form-item label="用户全名" prop="fullName">
            <el-input type="text" v-model="ruleForm.fullName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="getUserRowInfoType !== 0">
            <el-input v-model="ruleForm.password" show-password></el-input>
            <!-- <el-tooltip class="item" effect="dark" content="修改时可不传" placement="right-start" v-if="getUserRowInfoType === 0">
              <i class="el-icon-info v-icon-box"></i>
            </el-tooltip> -->
          </el-form-item>
          <el-form-item label="安全密码" prop="securePassword" v-if="getUserRowInfoType !== 0">
            <el-input v-model="ruleForm.securePassword" show-password></el-input>
            <!-- <el-tooltip class="item" effect="dark" content="修改时可不传" placement="right-start" v-if="getUserRowInfoType === 0">
              <i class="el-icon-info v-icon-box"></i>
            </el-tooltip> -->
          </el-form-item>
          <el-form-item label="推荐人用户名" prop="invitationUserCode">
            <el-input v-model="ruleForm.invitationUserName"></el-input>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio v-model="ruleForm.registerType" :label="1">公众注册</el-radio>
            <el-radio v-model="ruleForm.registerType" :label="2">个人注册</el-radio>
          </el-form-item>
          <el-form-item label="是否为子账户" v-if="getUserRowInfoType === 0">
            <el-radio v-model="ruleForm.sonAccount" :label="1">是</el-radio>
            <el-radio v-model="ruleForm.sonAccount" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="通知类型">
            <el-radio v-model="ruleForm.isOpenNotice" :label="1">开启</el-radio>
            <el-radio v-model="ruleForm.isOpenNotice" :label="0">禁止</el-radio>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-radio v-model="ruleForm.identityCardType" :label="1">身份证</el-radio>
            <el-radio v-model="ruleForm.identityCardType" :label="2">护照</el-radio>
          </el-form-item>
          <el-form-item label="证件号码" prop="identityCard">
            <el-input v-model="ruleForm.identityCard"></el-input>
          </el-form-item>
          <el-form-item label="用户地址" prop="address">
            <el-input type="text" v-model="ruleForm.address"></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="用户生日" >
            <el-date-picker
              v-model="ruleForm.birthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType">立即注册</el-button>
            <el-button @click="resetForm('ruleForm')" v-if="getUserRowInfoType === 1">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from "vue-property-decorator";
import { UserListStore } from '@/store/private/PageUserList';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminPageUserRegister, webGetAdminPageUserUpdateUser } from "@/api/index";
// import { error } from "node:console";
// import { sessionData } from "@/filters/storage";

@Component({
  components: {},
})
export default class userRegister extends Vue {
  private ruleForm = {
    address: '',
    birthday: '',
    email: '',
    fullName: '',
    identityCard: '',
    identityCardType: '',
    invitationUserName: '',
    isOpenNotice: '',
    password: '',
    phone: '',
    registerType: '',
    sonAccount: '',
    securePassword: '',
    userId: '',
    userName: '',
  };

  private loadingType: boolean = false;
  private rules = {
    address: [
      { required: true, message: '请输入地址', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入用户邮箱地址', trigger: 'blur' },
      {
        required: true,
        pattern: /\@/g,
        message: '请输入正确的邮箱地址',
        trigger: 'blur'
      }
    ],
    fullName: [
      { required: true, message: '请输入用户全名', trigger: 'blur' },
    ],
    identityCard: [
      { required: true, message: '请输入用户证件号码', trigger: 'blur' },
    ],
    phone: [
      { required: true, message: '请输入用户电话', trigger: 'blur' },
    ],
    userName: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: '不能含有空格',
        trigger: 'blur'
      },
      { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
      {
        required: true,
        pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/,
        message: '请输入 英文+ 数字 组合格式',
        trigger: 'blur'
      }
    ],
    // invitationUserCode: [
    //   { required: true, message: '请输入推荐码', trigger: 'blur' },
    // ],
    // securePassword: [
    //   { required: true, message: '请输入安全密码', trigger: 'blur' },
    // ],
    // password: [
    //   {
    //     required: true,
    //     pattern: /^\S*$/,
    //     message: '不能含有空格',
    //     trigger: 'blur'
    //   },
    // ],
  };

  private getUserRowInfoType: number = 1;

  // 获取数据
  get getUserRowInfo() {
    return UserListStore.getUserRowInfo
  };

  // 监听数据列表
  @Watch('getUserRowInfo', { deep: true })
  userRowInfo(newValue: any) {
    if (JSON.stringify(newValue) != "{}") {
      this.getUserRowInfoType = 0;
      this.ruleForm = newValue;
      // console.log(newValue)
    } else {
      this.getUserRowInfoType = 1;
      Object.keys(this.ruleForm).forEach(key =>this.ruleForm[key]='');
      // console.log(this.getUserRowInfoType);
    }
  };

  // 生命周期
  mounted() {
    if (JSON.stringify(this.getUserRowInfo) != "{}") {
      this.ruleForm = this.getUserRowInfo;
      this.getUserRowInfoType = 0;
      // console.log(this.getUserRowInfo);
    }
  };

  // 注册
  private submitForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate((valid) => {
      if (valid) {
        this.submitFormClick();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  };

  // 重置
  private resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  }

  // 注册提交
  private async submitFormClick() {
    let params = this.ruleForm;
    let id = this.getUserRowInfoType;
    let pages = {
      page: 1,
      pageSize: 12,
      userName: '', 
    };
    this.loadingType = true;
    // console.log(params);
    if (id === 1) {
      let res: any = await webGetAdminPageUserRegister(params)
      MessageTips(res, true, true, '注册成功', item => {
        UserListStore.storeActionPageUserList(pages);
        this.getUserRowInfoType = 1;
        Object.keys(this.ruleForm).forEach(key =>this.ruleForm[key]='');
        this.loadingType = false;
      }, errors => {
        this.loadingType = false;
      });
    } else {
      let res: any = await webGetAdminPageUserUpdateUser(params)
      // console.log(res);
      MessageTips(res, true, true, '修改成功', item => {
        UserListStore.storeActionPageUserList(pages);
        this.getUserRowInfoType = 0;
        this.loadingType = false;
      }, errors => {
        this.loadingType = false;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  padding: 15px 30px;
  /deep/.el-form {
    .v-input-box {
      width: 94%;
    }
    .v-icon-box {
      cursor: pointer;
      margin-left: 5px;
      color: #57aaff;
    }
  }
}
</style>
