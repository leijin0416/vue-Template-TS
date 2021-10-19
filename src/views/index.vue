<template>
  <div class="pages">
    <div class="v-header-main reveal-top" v-if="startType === 0">
      <el-row>
        <el-col :span="6">
          <div class="v-register-box">
            <div class="v-text-box">
              <h2 class="v-h2"><i class="el-icon-data-analysis" style="color: #777"></i> {{ $t('Hlin.平台数据') }}</h2>
              <div class="v-echarts-box">
                <Echarts :chartFoldCount="1" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="v-register-box v-text-right">
            <div class="v-line-list">
              <div class="v-text-box v-text-center">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoStatistic.registerNums' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-custom" /> {{ $t('Hlin.总注册人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box v-text-center">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoStatistic.sameDayRegistrationNums' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-custom" /> {{ $t('Hlin.当天注册人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box v-text-center">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoStatistic.activeNums' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-custom" /> {{ $t('Hlin.总激活人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box v-text-center">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoStatistic.kycNums' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-check" /> {{ $t('Hlin.总实名认证人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box v-text-center">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoStatistic.limitNums' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-warning" /> {{ $t('Hlin.总行为限制人数') }}</h4>
              </div>
            </div>
          </div>
          <div class="v-register-box v-count-box v-text-right">
            <div class="v-line-list">
              <div class="v-text-box">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoAssets.rechargeCount ? userInfoAssets.rechargeCount : 0' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-goods" /> {{ $t('Hlin.总充币') }}</h4>
                <p class="v-text"><span>{{ $t('Hlin.当天充币') }}</span> {{userInfoAssets.recharge ? userInfoAssets.recharge : 0}}</p>
                <p class="v-text"><span>{{ $t('Hlin.总充币人数') }}</span> {{userInfoAssets.rechargePeopleCount}}</p>
                <p class="v-text"><span>{{ $t('Hlin.当天充币人数') }}</span> {{userInfoAssets.rechargePeople}}</p>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoAssets.transferCount ? userInfoAssets.transferCount : 0' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-goods" /> {{ $t('Hlin.总转账') }}</h4>
                <p class="v-text"><span>{{ $t('Hlin.当天转账') }}</span> {{userInfoAssets.transfer ? userInfoAssets.transfer : 0}}</p>
                <p class="v-text"><span>{{ $t('Hlin.总转账人数') }}</span> {{userInfoAssets.transferPeopleCount}}</p>
                <p class="v-text"><span>{{ $t('Hlin.当天转账人数') }}</span> {{userInfoAssets.transferPeople}}</p>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box">
                <h1 class="v-h1">
                  <countTo :startVal='startVal' :endVal='userInfoAssets.withdrawalCount ? userInfoAssets.withdrawalCount : 0' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-goods" /> {{ $t('Hlin.总提币') }}</h4>
                <p class="v-text"><span>{{ $t('Hlin.当天提币') }}</span> {{userInfoAssets.withdrawal ? userInfoAssets.withdrawal : 0}}</p>
                <p class="v-text"><span>{{ $t('Hlin.总提币人数') }}</span> {{userInfoAssets.withdrawalPeopleCount}}</p>
                <p class="v-text"><span>{{ $t('Hlin.当天提币人数') }}</span> {{userInfoAssets.withdrawalPeople}}</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="v-echarts-mian reveal-bottom" v-if="startType === 0">
      <h2 class="v-h2"><i class="el-icon-data-line" style="color: #777"></i> {{ $t('Hlin.平台注册折线图') }}</h2>
      <div class="v-tab-box">
        <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
          <el-tab-pane :label="$t('Hlin.近七天')" name="0">
            <Echarts :chartFoldCount="0" />
          </el-tab-pane>
          <el-tab-pane :label="$t('Hlin.近一个月')" name="1">
            <Echarts :chartFoldCount="2" />
          </el-tab-pane>
          <el-tab-pane :label="$t('Hlin.今年')" name="2">
            <Echarts :chartFoldCount="3" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="v-img-box" v-else>
      <img src="@/assets/img/icon-welcome.jpg" alt="home.png" class="v-img reveal-top" >
    </div>
  </div>
</template>

<script lang="ts">
import scrollReveal from 'scrollreveal';
import countTo from 'vue-count-to';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { UserStore } from '@/store/private/user';
import { scrollRevealEffect } from '@/filters/common';
import { sessionData } from '@/filters/storage';
import { 
  webGetAdminUserMemberStatistics,
  webGetAdminUserRegistrationsStatistics,
  webGetAdminUserRegistrationsStatisticsList,
} from "@/api/index";

import Echarts from "@/components/Echarts/index.vue";

@Component({
  name: "AdminHome",
  components: {
    Echarts,
    countTo
  },
})
export default class extends Vue {
  // 动画
  private scrollReveal = scrollReveal();
  private startType: number = 1;        // 0 表格数据  1 图片

  private userInfoStatistic: object = {
    sameDayRegistrationNums: 0,
    registerNums: 0,
    limitNums: 0,
    kycNums: 0,
    activeNums: 0
  };
  private startVal:number = 0;
  private activeTabsName:string = '0';
  private userInfoAssets: object = {};
  

  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {
    let revealTop = scrollRevealEffect(400, 'top', false, false, '300px', 0);
    let revealBottom = scrollRevealEffect(400, 'bottom', false, false, '300px', 0);
    this.scrollReveal.reveal('.reveal-top', revealTop);
    this.scrollReveal.reveal('.reveal-bottom', revealBottom);
  };

  private async initUserAssetsList() {
    let res = await webGetAdminUserRegistrationsStatisticsList({});
    if(res.data.code === 200) {
      this.userInfoAssets = res.data.data;
    }
    // console.log(res);
  }

  /**
   *  挂载 饼状图
   */
  private async initUserInfoStatistics() {
    let res = await webGetAdminUserMemberStatistics({});
    if(res.data.code === 200) {
      UserStore.storeUserInfoStatisticsMap(res.data.data);
      this.userInfoStatistic = res.data.data;
    }
    // console.log(res);
  }

  /**
   *  挂载 折线图
   */
  private async initUserRegistrationStatistics() {
    let sevenDays = await webGetAdminUserRegistrationsStatistics({ 'type': 1 });
    let thirtyDays = await webGetAdminUserRegistrationsStatistics({ 'type': 2 });
    let yearDays = await webGetAdminUserRegistrationsStatistics({ 'type': 3 });
    if(sevenDays.data.code === 200) {
      let userSevenDays = sevenDays.data.data.reverse();
      let userThirtyDays = thirtyDays.data.data.reverse();
      let userYearDays = yearDays.data.data;
      UserStore.storeUserRegistrationStatisticsMap(userSevenDays);
      UserStore.storeUserRegistrationStatisticsMap1(userThirtyDays);
      UserStore.storeUserRegistrationStatisticsMap2(userYearDays);
    }
    // console.log(sevenDays);
    // console.log(thirtyDays);
  }

  private handleTabsClick() {}
}
</script>
<style lang="scss" scoped>
.pages {
  position: relative;
  min-height: 800px;
  background-color: #fff;
  .v-header-main {
    box-sizing: border-box;
    padding: 10px 30px;
    /deep/.el-row {border-bottom: 1px solid #f1f1f1;}
  }
  .v-register-box {
    padding: 30px 0;
    .v-line-list {
      display: inline-block;
      width: 20%;
      padding-top: 15px;
      vertical-align: middle;
      .v-h1 {
        font-size: 44px;
        padding-bottom: 15px;
        color: #409eff;
      }
      .v-h4 {
        color: #666;
      }
    }
    .v-text-box {
      padding: 0 5px;
      .v-h2 {
        padding-bottom: 10px;
      }
    }
  }
  .v-text-right {
    .v-text-box {
      position: relative;
      &::after {
        content: ' ';
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: 40px;
        background-color: #eee;
        transform: translateY(-50%);
      }
    }
    .v-line-list {
      &:last-child .v-text-box::after {
        display: none;
      }
    }
    .v-text {
      padding-top: 5px;
      color: #666;
    }
  }
  .v-count-box {
    text-align: center;
    .v-line-list {
      width: 30%;
    }
    .v-text-box {
      padding: 0 15px;
      &::after {
        display: none;
      }
    }
    .v-h1, .v-h4 {
      text-align: center;
    }
    .v-h4 {
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f1f1;
    }
    .v-text {
      position: relative;
      min-height: 19px;
      margin-top: 10px;
      font-size: 14px;
      font-weight: bold;
      text-align: right;
      span {
        position: absolute;
        top: 50%;
        left: 0;
        display: block;
        font-size: 12px;
        font-weight: initial;
        transform: translateY(-50%);
      }
    }
  }
  .v-echarts-mian {
    padding: 30px;
    .v-h2 {
      padding-bottom: 10px;
    }
    .v-tab-box {
      padding: 10px 0;
    }
    /deep/.el-tabs__header {padding: 0 30px;}
  }
  .v-img-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 610px;
    transform: translate(-50%, -50%);
    .v-img {
      display: block;
      width: 100%;
    }
  }
}
</style>
