<template>
  <div class="login">
    <h3>登录</h3>
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
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import md5 from 'js-md5';
import { Component, Vue, Watch, } from 'vue-property-decorator';
import { dynamicRouter, subMenuRouters } from '@/router/routerMaps';
import router, { resetRouter } from '@/router/index';
import { UserStore } from '@/store/private/user';
import { MessageTips } from '@/filters/MessageTips';
import { TreeForeach } from '@/filters/common';
import { webGetUserLogin, webGetUserfindRoleById } from "@/api/index";

type IndexData = {
  userName: string,
  pass: string,
};
@Component({
  components: {},
})
export default class loginPage extends Vue {
  private ruleForm: IndexData = {
    userName: 'admin',
    pass: '123456',
  }

  // 校验
  validateuserName = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      callback(new Error('请输入用户名'));
    } else {
      callback();
    }
  }
  validatePass(rule: any, value: string, callback: Function) {
    if (value === '') {
      callback(new Error('请输入密码'));
    } else {
      callback();
    }
  }
  validatePass2 = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== this.ruleForm.pass) {
      callback(new Error('两次输入密码不一致!'));
    } else {
      callback();
    }
  }

  private rules = {
    userName: [
      { validator: this.validateuserName, trigger: 'blur' },
    ],
    pass: [
      { validator: this.validatePass, trigger: 'blur' },
    ],
  }

  /** 登录校验
   *  - validate 报错找不到类型
   */
  submitForm(formName: any) {
    let _that = this;
    let ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.validate( (valid: any) => {
      if (valid) {
        _that.submitFormClick();
        // console.log(_that.ruleForm);
        // this.$store.dispatch('login', this.ruleForm);

      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  async submitFormClick() {
    let _that = this;
    let { userName, pass } = _that.ruleForm;
    let md5s = md5(pass).toUpperCase();
    let subMenuUserId = await webGetUserLogin({
      'userName': userName,
      'loginPwd': md5s,
    });
    let type: any = MessageTips(subMenuUserId, false, true, '', null, null);
    if (type) {
      let roleId = subMenuUserId.data.data.roleId;
      UserStore.getStoreToken(subMenuUserId.data.data.token);
      UserStore.getStoreUserId(roleId);
      _that.submitFormRoleId(roleId);
      // 调用resetRouter方法，把原来的路由替换
      resetRouter();
    }
  }

  async submitFormRoleId(roleId: number) {
    let _that = this;
    let routersMapList = subMenuRouters;
    let subMenuRoleId = await webGetUserfindRoleById({
      'roleId': roleId,
    });
    MessageTips(subMenuRoleId, true, true, '登录成功，正在跳转', item => {
      let dynamicMapList = dynamicRouter;
      // 权限递归
      TreeForeach(item.data.data, tree => {
        dynamicMapList.forEach( el => {
          if(tree.router === el.path) {
            routersMapList[0].children.push(el);
          }
        });
      });

      UserStore.getStoreRouterMap(item.data.data);
      router.addRoutes(routersMapList);
      _that.$router.push({path: '/'});
      // console.log(item);
      
    }, null);
  }

  // 重置
  resetForm(formName) {
    let ref: any = this.$refs[formName];
    ref.resetFields();
  }
}
</script>

<style lang="scss" scoped>
.login {width:400px;margin:50px auto;box-shadow: 1px 1px 5px #ddd;padding:20px;border-radius: 10px;}
h3 { text-align: center; }
.skip-h5{
  display: block;
  color:#00a0e9;
  padding-top:15px;
  font-size: 12px;
}
</style>