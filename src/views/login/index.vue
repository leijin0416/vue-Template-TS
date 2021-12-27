<template>
  <div class="login">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <section class="section reveal-top">
          <h2 class="v-h2-title">{{ $t('Hlin.PingPay') }}</h2>
          <el-form 
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="90px"
            label-position="left"
            :hide-required-asterisk="true"
            status-icon 
            class="demo-ruleForm">
            <el-form-item :label="$t('Hlin.用户名')" prop="userName">
              <el-input v-model="ruleForm.userName" />
            </el-form-item>
            <el-form-item :label="$t('Hlin.密码')" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password />
            </el-form-item>
            <div class="v-btn-box" >
              <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" size="medium" class="v-btn">{{ $t('Hlin.登录') }}</el-button>
            </div>
          </el-form>
          <div class="v-language-box">
            <div class="weui-flex">
              <div class="weui-flex-hd"><i class="el-icon-eleme"></i> {{ $t('Hlin.语言') }}</div>
              <div class="weui-flex-bd">
                <el-radio-group v-model="radioLocale" @change="onRadioChange">
                  <el-radio label="zh-CN" disabled>{{ $t('Hlin.简体中文') }}</el-radio>
                  <!-- <el-radio label="en-US">{{ $t('Hlin.English') }}</el-radio> -->
                </el-radio-group>
              </div>
            </div>
          </div>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import scrollReveal from 'scrollreveal';
import { Component, Vue, Watch, Provide } from 'vue-property-decorator';
import router, { resetRouter } from '@/router/index';

import { dynamicRouter, subMenuRouters } from '@/router/routerMaps';
import { UserStore } from '@/store/private/user';
import { MessageTips } from '@/filters/MessageTips';
import { regBlank } from '@/filters/RegexSplit';
import { TreeForeach, scrollRevealEffect } from '@/filters/common';

import { 
  webGetAdminUserLogin, 
  webGetAdminUserFindRoleById,
} from "@/api/index";

interface IndexData {
  userName: string;
  pass: string;
}
/**
 * 定义当前表单验证
 */
interface LoginRulesFun {
  userName: {
    required: boolean,
    trigger: string,
    validator: (rule: any, value: string, callback: () => {}) => void,
  };
  pass: {
    required: boolean,
    trigger: string,
    validator: (rule: any, value: string, callback: () => {}) => void,
  };
}

@Component({
  name: "Login",
  components: {},
})
export default class extends Vue {
  private vm = window['vm'];

  // 动画
  public scrollReveal = scrollReveal();
  // 定义input
  public ruleForm: IndexData = {
    userName: '',
    pass: ''
  };
  
  public radioLocale: string = 'zh-CN';
  public loadingType: boolean = false;
  
  // 表单验证
  private validateuserName = (rule: any, value: string, callback: (res?: any) => {}) => {
    if (value === '') {
      const text = this.vm.$t('Hlin.请输入用户名');
      callback(new Error(text));
    } else if (!regBlank.test(value)) {
      const text = this.vm.$t('Hlin.请勿输入空字符');
      callback(new Error(text));
    } else {
      callback();
    }
  };
  private validatePass = (rule: any, value: string, callback: (res?: any) => {}) => {
    if (value === '') {
      const text = this.vm.$t('Hlin.请输入密码');
      callback(new Error(text));
    } else if (value.length < 6) {
      const text = this.vm.$t('Hlin.密码不能小于6位');
      callback(new Error(text));
    } else if (!regBlank.test(value)) {
      const text = this.vm.$t('Hlin.请勿输入空字符');
      callback(new Error(text));
    } else {
      callback();
    }
  };
  private validatePass2 = (rule: any, value: string, callback: (res?: any) => {}) => {
    if (value === '') {
      const text = this.vm.$t('Hlin.请再次输入密码');
      callback(new Error(text));
    } else if (value !== this.ruleForm.pass) {
      const text = this.vm.$t('Hlin.两次输入密码不一致');
      callback(new Error(text));
    } else {
      callback();
    }
  };

  /** 
   * @description: 验证规则
	 * @param {*} required  是否必填
	 * @param {*} message  提示语
	 * @param {*} trigger  触发 blur失去焦点后
   * @return {*}
   */
  private rules: LoginRulesFun = {
    userName: { required: true, validator: this.validateuserName, trigger: 'blur' },
    pass: { required: true, validator: this.validatePass, trigger: 'blur' },
  };

  // 生命周期
  created() :void {
    let getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
    if(getLocaleI18n !== null) {
      this.radioLocale = getLocaleI18n;
    } else {
      sessionStorage.setItem('accessLocaleI18n', 'zh-CN');
    }
  };
  
  // 生命周期
  mounted() {
    let revealTop = scrollRevealEffect(400, 'right', false, false, '800px', 0);
    this.scrollReveal.reveal('.reveal-top', revealTop);
  };

  onRadioChange() {
    sessionStorage.setItem('accessLocaleI18n', this.radioLocale); // 设置语言包
    this.$message.success({
      message: this.vm.$t('Hlin.切换成功'),
      duration: 3000,
      onClose: () => {
        window.location.reload();
      }
    })
    // console.log(this.radioLocale);
  }

  // 重置
  private resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }

  /** 
   * @description: 登录校验
	 * @param {*} validate  报错找不到类型
   * @return {*}
   */
  private submitForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    
    ref.validate( (valid: boolean) => {
      if (valid) {
        _that.loadingType = true;
        _that.submitFormClick();
        // console.log(_that.ruleForm);

      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  /** 
   * @description: 按钮登录
	 * @param {*} storeActionUserName  缓存用户名
	 * @param {*} storeActionToken  缓存用户Token
	 * @param {*} resetRouter  重置路由
   * @return {*}
   */
  private async submitFormClick() {
    const { userName, pass } = this.ruleForm;
    const md5s = md5(pass).toUpperCase();
    const {data: res} = await webGetAdminUserLogin({
      'userName': userName,
      'password': pass,
    });
    if(res.code === 200) {
      const data = res.data;
      const roleId = data.userId;
      // 调用resetRouter方法，把原来的路由替换  【位置关系】
      resetRouter();
      UserStore.storeActionUserName(data.userName);
      UserStore.storeActionToken(data.token);      // 用户Token
      this.getRouterNavsData(roleId);

    } else {
      this.$message({
        message: res.message,
        type: 'error',
        onClose: () => {
          this.loadingType = false;
        }
      });

    }
    // console.log(res);
  }

  /** 
   * @description: 拿用户ID -> 查询权限表
	 * @param {*} storeActionRouterMap()  缓存后台路由数组
	 * @param {*} addRoutes()    动态挂载路由
	 * @param {*} TreeForeach()  递归遍历
   * @return {*}
   */
  public async getRouterNavsData(roleId: number) {
    const text = this.vm.$t('Hlin.登录成功');
    const localsList = dynamicRouter;     // 比对路由
    let routersMapList = subMenuRouters;  // 本地挂载路由
   
    let res = await webGetAdminUserFindRoleById({
      'adminId': roleId,
    });
    console.log(res);

    MessageTips(res, true, true, text, item => {
      let treeData = item.data.data;       // 后台权限路由

      TreeForeach(treeData, tree => { // 权限递归
        localsList.forEach( el => {
          if(tree.router === el.path) {
            routersMapList[0].children.push(el);
          }
        });
      });

      UserStore.storeActionRouterMap(treeData);
      router.addRoutes(routersMapList);
      this.$router.push({path: '/'});
      this.loadingType = false;

    }, err => {
      this.loadingType = false;
    });

  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url("../../assets/img/login_bg.png") center center / cover no-repeat;
}
.section {
  position: fixed;
  left: 50%;
  top: 40%;
  width: 430px;
  box-shadow: 1px 1px 10px #ddd;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  transform: translate(-50%, -40%);
  /deep/.el-button--medium {padding: 10px 60px;}
}
.v-h2-title { 
  padding-bottom: 30px;
  font-size: 24px;
  text-align: center; 
}
.v-btn-box {
  padding: 0 30px;
  margin-top: 50px;
  text-align: center;
  .v-btn {padding: 10px 100px;}
}
.v-language-box {
  padding-top: 20px;
  .weui-flex-hd {
    min-width: 100px;
  }
}
</style>