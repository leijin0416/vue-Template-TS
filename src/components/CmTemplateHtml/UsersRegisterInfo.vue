<template>
  <div class="v-info-wrap">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="v-header-box">
          <h2 class="v-title">{{$t('User.会员资料')}}</h2>
          <div class="v-text" @click="onGoBackClick"><i class="el-icon-back"></i> {{$t('User.返回')}}</div>
        </div>
        <div class="v-info-box">
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.姓名')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.name}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.用户名')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.userName}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.性别')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.gender === '1' ? $t('User.男') : $t('User.女')}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.游泳程度')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.swimLevel}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.来源')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.source}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.证件类型')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.identityType === '1' ? $t('User.身份证') : $t('User.护照')}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.证件号码')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.identityNumber}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.出生日期')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.dateOfBirth}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.身高/体重')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.height}}/{{userRegisterInfo.weight}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.电话')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.contactNumber}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.邮箱')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.email}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.职业')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.occupation}}</div>
          </div>
          <div class="weui-flex">
            <div class="weui-flex-hd">{{$t('User.地址')}}</div>
            <div class="weui-flex-bd">{{userRegisterInfo.address}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: "UserRegisterInfo",
  components: {
  },
})
export default class extends Vue {
  @Prop({ default: {} }) private userRegisterInfo!: object;

  private vm = window['vm'];

  // 获取数据
  get getUserPageList() {
    return
  };

  // 监听数据列表
  @Watch('userRegisterInfo', { deep: true })
  getWatchPagesInfoData(newValue) {
    // console.log(newValue)
  };

  // 生命周期
  created() {
    // UserListStore.storeActionPageUserList(this.param);
  };

  // 生命周期
  mounted () {};

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
  }

  /**
   * @description: 返回上级
   * @param {*}
   * @return {*}
   */
  private onGoBackClick() {
    this.$emit('onEmitGoBackClick', true);
  }
}
</script>

<style lang='scss' scoped>
.v-info-wrap {
  padding: 20px;
  .v-title {
    padding: 0 0 20px;
    margin-bottom: 5px;
    margin-top: 15px;
    border-bottom: 1px solid #f1f1f1;
  }
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
      margin-top: 0;
    }
  }
  .v-info-box {
    padding: 15px;
    .v-list {
      margin: 10px 0;
    }
    .weui-flex {
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
      &:last-child {border: none;}
      .weui-flex-hd {
        min-width: 120px;
        color: #666;
      }
    }
  }
}
</style>