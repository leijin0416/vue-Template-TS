<template>
  <div class="login">
    <section class="section reveal-top">
      <h2 class="v-h2">{{ $t('Hlin.PingPay') }}</h2>
      <el-form 
        :model="ruleForm"
        status-icon 
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        label-position="left"
        :hide-required-asterisk="true"
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
          <div class="weui-flex-hd"><i class="el-icon-thumb"></i> {{ $t('Hlin.语言') }}</div>
          <div class="weui-flex-bd">
            <el-radio-group v-model="radioLocale" @change="onRadioChange">
              <el-radio label="zh-CN">{{ $t('Hlin.简体中文') }}</el-radio>
              <!-- <el-radio label="en-US">{{ $t('Hlin.English') }}</el-radio> -->
            </el-radio-group>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import scrollReveal from 'scrollreveal';
import { Component, Vue, Watch, Provide } from 'vue-property-decorator';
import router, { resetRouter } from '@/router/index';
import { dynamicRouter, subMenuRouters } from '@/router/routerMaps';
import { childrenRouterMap } from '@/mock/childrenRouter';

import { regBlank } from '@/filters/RegexSplit';
import { MessageTips } from '@/filters/MessageTips';
import { UserStore } from '@/store/private/user';
import { TreeForeach, scrollRevealEffect } from '@/filters/common';
import { webGetAdminUserLogin, webGetAdminUserFindRoleById } from "@/api/index";

type IndexData = {
  userName: string;
  pass: string
};

@Component({
  components: {},
})
export default class Login extends Vue {
  // 动画
  private scrollReveal = scrollReveal();
  private ruleForm: IndexData = {
    userName: '',
    pass: ''
  };
  private radioLocale: string = 'zh-CN';
  private loadingType: boolean = false;
  private isLocalStatus: boolean = true; // 请求环境 本地/线上

  /**
   * 表单验证
   */
  validateuserName = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      const text = window['vm'].$t('Hlin.请输入用户名');
      callback(new Error(text));
    } else if (!regBlank.test(value)) {
      const text = window['vm'].$t('Hlin.请勿输入空字符');
      callback(new Error(text));
    } else {
      callback();
    }
  };
  validatePass(rule: any, value: string, callback: Function) {
    if (value === '') {
      const text = window['vm'].$t('Hlin.请输入密码');
      callback(new Error(text));
    } else if (value.length < 6) {
      const text = window['vm'].$t('Hlin.密码不能小于6位');
      callback(new Error(text));
    } else if (!regBlank.test(value)) {
      const text = window['vm'].$t('Hlin.请勿输入空字符');
      callback(new Error(text));
    } else {
      callback();
    }
  };
  validatePass2 = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      const text = window['vm'].$t('Hlin.请再次输入密码');
      callback(new Error(text));
    } else if (value !== this.ruleForm.pass) {
      const text = window['vm'].$t('Hlin.两次输入密码不一致');
      callback(new Error(text));
    } else {
      callback();
    }
  };

  /** 
   *  验证规则
   *  @required   是否必填
   *  @message    提示语
   *  @trigger    触发 blur失去焦点后
   */
  private rules = {
    userName: [ { required: true, validator: this.validateuserName, trigger: 'blur' }],
    pass: [ { required: true, validator: this.validatePass, trigger: 'blur' } ],
  };

  // 生命周期
  created() {
    let getLocaleI18n = sessionStorage.getItem('accessLocaleI18n');
    if(getLocaleI18n !== null) {
      this.radioLocale = getLocaleI18n;
    } else {
      sessionStorage.setItem('accessLocaleI18n', 'zh-CN');
    }
  };
  
  // 生命周期
  mounted() {
    let revealTop = scrollRevealEffect(360, 'right', false, false, '600px');
    this.scrollReveal.reveal('.reveal-top', revealTop);
  };


  onRadioChange() {
    sessionStorage.setItem('accessLocaleI18n', this.radioLocale); // 设置语言包
    this.$message.success({
      message: window['vm'].$t('Hlin.切换成功'),
      duration: 3000,
      onClose: () => {
        window.location.reload();
      }
    })
    // console.log(this.radioLocale);
  }

  // 重置
  resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }

  /**
   * @description:   按钮-登录校验
   * @param {*} formName   标识
   * @param {*} validate   报错找不到类型
   * @return {*}
   */
  submitForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    _that.loadingType = true;
    ref.validate( (valid: boolean) => {
      if (valid) {
        _that.submitFormClick();
        // console.log(_that.ruleForm);
        // this.$store.dispatch('login', this.ruleForm);
      } else {
        _that.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  /**
   * @description:  按钮-登录
   * @param {*} storeActionUserName   缓存用户名
   * @param {*} storeActionToken      缓存用户Token
   * @param {*} resetRouter           API-重置路由
   * @return {*}
   */
  async submitFormClick() {
    let { userName, pass } = this.ruleForm;
    let md5s = md5(pass).toUpperCase();
    let res = await webGetAdminUserLogin({
      'userName': userName,
      'password': pass,
    });
    let type = MessageTips(res, false, true, '', null, err => {
      this.loadingType = false;
    });
    // console.log(res);
    if (type) {
      const roleId = res.data.data.userId;
      UserStore.storeActionUserName(res.data.data.userName);
      UserStore.storeActionToken(res.data.data.token);  // 用户Token

      // 调用resetRouter方法，把原来的路由替换  【位置关系】
      resetRouter();
      this.submitRouterRoleId(roleId);
    }
  }

  /**
   * @description:  拿用户ID -> 查询权限表
   * @param {*} storeActionRouterMap  缓存后台路由数组
   * @param {*} subMenuRouters        本地挂载路由(最上层)
   * @param {*} dynamicRouter         本地路由
   * @param {*} TreeForeach    递归遍历，对比路由
   * @param {*} addRoutes      API-动态挂载路由
   * @return {*}
   */
  async submitRouterRoleId(roleId: number) {
    let routersMapList = subMenuRouters;  // 本地挂载路由
    if (this.isLocalStatus) {
      // 后台路由
      let routerMenu = await webGetAdminUserFindRoleById({
        'adminId': roleId,
      });
      // console.log(routerMenu);
      const text = window['vm'].$t('Hlin.登录成功');
      MessageTips(routerMenu, true, true, text, item => {
        let treeData = item.data.data;
        let dynamicMapList = dynamicRouter;  // 本地路由
        
        TreeForeach(treeData, tree => {  // 权限递归
          dynamicMapList.forEach( el => {
            if(tree.router == el.path) {  // 比对
              routersMapList[0].children.push(el);
            }
            
          });
        });

        UserStore.storeActionRouterMap(treeData);
        router.addRoutes(routersMapList);
        this.$router.push({path: '/'});
        this.loadingType = false;

      }, err => {
        console.log(err);
      });

    } else {
      // 本地路由
      let data = { data: { code: 200 } }
      const text = window['vm'].$t('Hlin.登录成功');
      MessageTips(data, true, true, text, item => {
        let dynamicMapList = dynamicRouter;
        
        TreeForeach(childrenRouterMap, tree => {
          dynamicMapList.forEach( el => {
            if(tree.router === el.path) {
              // console.log(el);
              routersMapList[0].children.push(el);
            }
          });
        });
        this.loadingType = false;

        UserStore.storeActionRouterMap(childrenRouterMap);
        router.addRoutes(routersMapList);

        this.$router.push({path: '/'});

      }, err => {
        console.log(err);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  background: url("../../assets/img/login_bg.png") center center / cover no-repeat;
}
.section {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 430px;
  box-shadow: 1px 1px 10px #ddd;
  padding:30px;
  border-radius: 10px;
  background-color: #fff;
  transform: translate(-50%, -40%);
  /deep/.el-button--medium {padding: 10px 60px;}
}
.v-h2 { padding-bottom: 30px; text-align: center; }
.v-btn-box {
  margin-top: 40px;
  text-align: center;
  .v-btn {padding: 10px 80px;}
}
.v-language-box {
  padding-top: 20px;
  .weui-flex-hd {
    min-width: 80px;
  }
}
</style>