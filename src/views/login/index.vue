<template>
  <div class="login">
    <section class="section">
      <h3 class="v-h3">管理后台</h3>
      <el-form 
        :model="ruleForm"
        status-icon 
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        label-position="left"
        class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <div style="text-align:center">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" size="medium">登录</el-button>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import scrollReveal from 'scrollreveal';
import { Component, Vue, Watch, Provide} from 'vue-property-decorator';
import { dynamicRouter, subMenuRouters } from '@/router/routerMaps';
import router, { resetRouter } from '@/router/index';
import { UserStore } from '@/store/private/user';
import { MessageTips } from '@/filters/MessageTips';
import { webGetAdminUserLogin, webGetAdminUserFindRoleById } from "@/api/index";

import { regBlank } from '@/filters/splitRegex';
import { TreeForeach, scrollRevealEffect } from '@/filters/common';
import { childrenRouter } from '@/mock/childrenRouter';

type IndexData = {
  userName: string,
  pass: string,
};

@Component({
  components: {},
})
export default class login extends Vue {
  // 动画
  private scrollReveal = scrollReveal();
  // 定义input
  private ruleForm: IndexData = {
    userName: '',
    pass: ''
  };
  private loadingType: boolean = false;
  // 请求环境 本地/线上
  private LocalStatus: boolean = false;
  /**
   * 表单验证
   */
  validateuserName = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      callback(new Error('请输入用户名'));
    } else if (!regBlank.test(value)) {
      callback(new Error('请勿输入空格字符'));
    } else {
      callback();
    }
  };
  validatePass(rule: any, value: string, callback: Function) {
    if (value === '') {
      callback(new Error('请输入密码'));
    } else if (value.length < 6) {
      callback(new Error('密码不能小于6位'));
    } else if (!regBlank.test(value)) {
      callback(new Error('请勿输入空格字符'));
    } else {
      callback();
    }
  };
  validatePass2 = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== this.ruleForm.pass) {
      callback(new Error('两次输入密码不一致!'));
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

  mounted() {
    let revealTop = scrollRevealEffect(500, 'right', false, false, '400px');
    this.scrollReveal.reveal('.reveal-top', revealTop);
  }

  // 重置
  resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }

  /** 
   *  登录校验
   *  @validate   报错找不到类型
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
   *  按钮登录
   *  @storeActionUserName   缓存用户名
   *  @storeActionToken      缓存用户Token
   *  @resetRouter           重置路由
   */
  async submitFormClick() {
    let { userName, pass } = this.ruleForm;
    let md5s = md5(pass).toUpperCase();
    let subMenuUserId = await webGetAdminUserLogin({
      'userName': userName,
      'password': md5s,
    });
    let type: any = MessageTips(subMenuUserId, false, true, '', null, item => {
      this.loadingType = false;
    });
    // const roleId = subMenuUserId.data.data.roleId;
    // console.log(subMenuUserId);
    if (type) {
      // this.loadingType = false;
      UserStore.storeActionUserName(subMenuUserId.data.data.userName);
      UserStore.storeActionToken(subMenuUserId.data.data.token);  // 用户Token
      // 调用resetRouter方法，把原来的路由替换  【位置关系】
      resetRouter();

      this.submitFormRoleId(1);
    }
  }

  /** 
   *  拿用户ID -> 查询权限表
   *  @storeActionRouterMap   缓存后台路由数组
   *  @addRoutes              动态挂载路由
   *  @TreeForeach            递归遍历
   */
  async submitFormRoleId(roleId: number) {
    let routersMapList = subMenuRouters;  // 本地路由
    if (this.LocalStatus) {
      // 后台路由
      let subMenuRoleId = await webGetAdminUserFindRoleById({
        'roleId': roleId,
      });
      MessageTips(subMenuRoleId, true, true, '登录成功，正在跳转', item => {
        let dynamicMapList = dynamicRouter;  // 本地路由
        
        TreeForeach(item.data.data, tree => { // 权限递归
          dynamicMapList.forEach( el => {
            if(tree.router === el.path) {
              routersMapList[0].children.push(el);
            }
          });
        });

        UserStore.storeActionRouterMap(item.data.data);
        router.addRoutes(routersMapList);
        this.$router.push({path: '/'});
        this.loadingType = false;
        // console.log(item);
      }, null);

    } else {
      // 本地路由
      let data = { data: { code: 200 } }
      MessageTips(data, true, true, '登录成功，正在跳转', item => {
        let dynamicMapList = dynamicRouter;
        
        TreeForeach(childrenRouter, tree => {  // 权限递归
          dynamicMapList.forEach( el => {
            if(tree.router === el.path) {
              // console.log(el);
              routersMapList[0].children.push(el);
            }
          });
        });

        UserStore.storeActionRouterMap(childrenRouter);
        router.addRoutes(routersMapList);
        this.$router.push({path: '/'});
        this.loadingType = false;
      }, null);
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  background-color: #eee;
}
.section {
  position: absolute;
  left: 50%;
  top: 40%;
  width:400px;
  box-shadow: 1px 1px 5px #ddd;
  padding:20px;
  border-radius: 10px;
  background-color: #fff;
  transform: translate(-50%, -40%);
  /deep/.el-button--medium {padding: 10px 60px;}
}
.v-h3 { padding-bottom: 30px; text-align: center; }
.skip-h5{
  display: block;
  color:#00a0e9;
  padding-top:15px;
  font-size: 12px;
}
</style>