<template>
  <!-- 注册/修改 表单 -->
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
          <el-form-item :label="this.$t('Ureg.用户名')" prop="userName">
            <el-input type="text" v-model="ruleForm.userName" :placeholder="this.$t('Hlin.请输入用户名')" ></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.用户全名')" prop="fullName">
            <el-input type="text" v-model="ruleForm.fullName" :placeholder="this.$t('Ureg.请输入用户全名')" ></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.用户密码')" prop="password" v-if="getUserRowInfoType !== 0">
            <el-input v-model="ruleForm.password" :placeholder="this.$t('Ureg.请输入用户密码')" show-password></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.用户密码')" v-else>
            <el-input v-model="ruleForm.password" :placeholder="this.$t('Ureg.不更改则不用填写')" show-password></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.安全密码')" prop="securePassword" v-if="getUserRowInfoType !== 0">
            <el-input v-model="ruleForm.securePassword" :placeholder="this.$t('Ureg.请输入安全密码')" show-password></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.安全密码')" v-else>
            <el-input v-model="ruleForm.securePassword" :placeholder="this.$t('Ureg.不更改则不用填写')" show-password></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.推荐人用户名')" prop="invitationUserCode">
            <el-input v-model="ruleForm.invitationUserName" :placeholder="this.$t('Ureg.请输入推荐人用户名')" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="注册类型">
            <el-radio v-model="ruleForm.registerType" :label="1">公众注册</el-radio>
            <el-radio v-model="ruleForm.registerType" :label="2">个人注册</el-radio>
          </el-form-item> -->
          <el-form-item :label="this.$t('Ureg.是否为子账户')" label="是否为子账户" prop="sonAccount">
            <el-radio v-model="ruleForm.sonAccount" :label="1">{{ $t('Ureg.是') }}</el-radio>
            <el-radio v-model="ruleForm.sonAccount" :label="0">{{ $t('Ureg.否') }}</el-radio>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.通知类型')" prop="isOpenNotice">
            <el-radio v-model="ruleForm.isOpenNotice" :label="1">{{ $t('Ureg.开启') }}</el-radio>
            <el-radio v-model="ruleForm.isOpenNotice" :label="0">{{ $t('Ureg.禁止') }}</el-radio>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.证件类型')" prop="identityCardType" v-if="getUserRowInfoType !== 0">
            <el-radio v-model="ruleForm.identityCardType" :label="1">{{ $t('Ureg.身份证') }}</el-radio>
            <el-radio v-model="ruleForm.identityCardType" :label="2">{{ $t('Ureg.护照') }}</el-radio>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.证件类型')" v-else>
            <el-radio v-model="ruleForm.identityCardType" :label="1">{{ $t('Ureg.身份证') }}</el-radio>
            <el-radio v-model="ruleForm.identityCardType" :label="2">{{ $t('Ureg.护照') }}</el-radio>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.证件号码')" prop="identityCard" v-if="getUserRowInfoType !== 0">
            <el-input v-model="ruleForm.identityCard" :placeholder="this.$t('Ureg.请输入证件号码')"></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.证件号码')" v-else>
            <el-input v-model="ruleForm.identityCard" :placeholder="this.$t('Ureg.请输入证件号码')"></el-input>
          </el-form-item>
          <!-- <el-form-item label="提币地址" prop="address">
            <el-input type="text" v-model="ruleForm.address" placeholder="请输入提币地址"></el-input>
          </el-form-item> -->
          <el-form-item :label="this.$t('Ureg.用户电话')" prop="phone">
            <el-input v-model="ruleForm.phone" :placeholder="this.$t('Ureg.请输入用户电话')"></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.用户邮箱')" prop="email">
            <el-input v-model="ruleForm.email" :placeholder="this.$t('Ureg.请输入用户邮箱')"></el-input>
          </el-form-item>
          <el-form-item :label="this.$t('Ureg.用户生日')" prop="birthday">
            <el-date-picker
              v-model="ruleForm.birthday"
              type="date"
              :placeholder="this.$t('Ureg.选择日期')"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <!-- <el-button @click="resetForm('ruleForm')" v-if="getUserRowInfoType === 1">重置</el-button> -->
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" v-if="getUserRowInfoType === 1">{{ $t('Ureg.立即注册') }}</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" v-else>{{ $t('Ureg.确认修改') }}</el-button>
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
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
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
    registerType: '2',
    sonAccount: '',
    securePassword: '',
    userId: '',
    userName: '',
  };

  private loadingType: boolean = false;
  private rules = {
    address: [
      { required: true, message: '请输入地址', trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Ureg.不能含有空格'),
        trigger: 'blur'
      },
    ],
    email: [
      { required: true, message: window['vm'].$t('Ureg.请输入用户邮箱'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Ureg.不能含有空格'),
        trigger: 'blur'
      },
      {
        required: true,
        pattern: /\@/g,
        message: window['vm'].$t('Ureg.请输入正确的邮箱地址'),
        trigger: 'blur'
      }
    ],
    fullName: [
      { required: true, message: window['vm'].$t('Ureg.请输入用户全名'), trigger: 'blur' },
    ],
    identityCard: [
      { required: true, message: window['vm'].$t('Ureg.请输入用户证件号码'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Ureg.不能含有空格'),
        trigger: 'blur'
      },
    ],
    phone: [
      { required: true, message: window['vm'].$t('Ureg.请输入用户电话'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Ureg.不能含有空格'),
        trigger: 'blur'
      },
    ],
    userName: [
      { required: true, message:  window['vm'].$t('Hlin.请输入用户名'), trigger: 'blur' },
    ],
    securePassword: [
      { required: true, message: window['vm'].$t('Ureg.请输入安全密码'), trigger: 'blur' },
      {
        required: true,
        pattern: /^\S*$/,
        message: window['vm'].$t('Ureg.不能含有空格'),
        trigger: 'blur'
      },
    ],
    password: [
      { required: true, message: window['vm'].$t('Ureg.请输入用户密码'), trigger: 'blur' },
      { min: 6, max: 18, message: window['vm'].$t('Bslt.请输入6位以上'), trigger: 'blur' },
      {
        required: true,
        pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/,
        message: window['vm'].$t('Bslt.请输入6位以上'),
        trigger: 'blur'
      }
    ],
    identityCardType: [
      { required: true, message: window['vm'].$t('Ureg.请选择证件类型'), trigger: 'change' }
    ],
    isOpenNotice: [
      { required: true, message: window['vm'].$t('Ureg.请选择通知类型'), trigger: 'change' }
    ],
    birthday: [
      { type: 'date', required: true, message: window['vm'].$t('Ureg.请选择用户生日'), trigger: 'change' }
    ],
    sonAccount: [
      { required: true, message: window['vm'].$t('Ureg.请选择子账户'), trigger: 'change' }
    ],
  };

  private getUserRowInfoType: number = 1;

  // 获取数据
  get getUserRowInfo() {
    return UserListStore.getUserRowInfo
  };

  // 监听数据列表
  @Watch('getUserRowInfo', { immediate: true, deep: true })
  userRowInfo(newValue) {
    if(newValue.ids == 1) { // 注册
      this.getUserRowInfoType = 1;
      Object.keys(this.ruleForm).forEach(key => {
        this.ruleForm[key] = '';
      })
      // 异步更新
      this.$nextTick( ()=> {
        this.clearValidateForm('ruleForm');
      })

    } else {  // 修改
      let obj = deepCloneData(newValue);
      this.getUserRowInfoType = 0;
      this.ruleForm = obj;
      if(obj.identityCard === '-1') this.ruleForm.identityCard = '';
    }

    // console.log(newValue)
  };

  // 生命周期
  mounted() {};

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }
  private clearValidateForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.clearValidate();
  }

  // 注册
  private submitForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        this.submitFormClick();
      } else {
        this.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 注册提交
  private async submitFormClick() {
    const params = this.ruleForm;
    const id = this.getUserRowInfoType;   // 1注册 / 0修改类型
    // console.log(params);
    if (id === 1) {
      const text1 = window['vm'].$t('Ureg.注册成功');
      const res = await webGetAdminPageUserRegister(params)
      MessageTips(res, true, true, text1, item => {
        this.loadingType = false;
        this.getUserRowInfoType = 1;
        Object.keys(this.ruleForm).forEach( key => this.ruleForm[key] = '' );
        this.$nextTick(()=>{
          this.clearValidateForm('ruleForm');
        })

        this.$emit('getUserRegisterFormClick', 1);

      }, err => {
        this.loadingType = false;
      });

    } else {
      const text1 = window['vm'].$t('Ureg.修改成功');
      const res = await webGetAdminPageUserUpdateUser(params)
      MessageTips(res, true, true, text1, item => {
        this.loadingType = false;
        this.getUserRowInfoType = 0;

        this.$emit('getUserRegisterFormClick', 0);

      }, err => {
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
