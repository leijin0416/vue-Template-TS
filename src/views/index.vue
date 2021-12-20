<template>
  <div class="pages">
    <div class="v-header-main reveal-top" v-if="startType === 0">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="8">
          <div class="v-register-box">
            <div class="v-text-box">
              <h2 class="v-h2"><i class="el-icon-data-analysis" style="color: #777"></i> {{ $t('Hlin.平台数据') }}</h2>
              <div class="v-echarts-box">
                <Echarts :eChartCountId="1" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="17" :xl="16">
          <div class="v-register-box v-row-right">
            <div class="v-line-list">
              <div class="v-text-box text-center">
                <h1 class="v-h1">
                  <countTo :startVal='countToStartVal' :endVal='echartsUsersInfo.totalRegisterNum' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-custom" /> {{ $t('Hlin.总注册人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box text-center">
                <h1 class="v-h1">
                  <countTo :startVal='countToStartVal' :endVal='echartsUsersInfo.totalPurchasePackage' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-star-on" /> {{ $t('Hlin.总购买配套人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box text-center">
                <h1 class="v-h1">
                  <countTo :startVal='countToStartVal' :endVal='echartsUsersInfo.totalAppointments' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-custom" /> {{ $t('Hlin.总预约人数') }}</h4>
              </div>
            </div>
            <div class="v-line-list">
              <div class="v-text-box text-center">
                <h1 class="v-h1">
                  <countTo :startVal='countToStartVal' :endVal='echartsUsersInfo.todaySchedule' :duration='3000'></countTo>
                </h1>
                <h4 class="v-h4"><i class="el-icon-s-management" /> {{ $t('Hlin.当天预约人数') }}</h4>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="v-echarts-mian reveal-bottom" v-if="startType === 0">
      <h2 class="v-h2"><i class="el-icon-data-line" style="color: #777"></i> {{ $t('Hlin.会员注册折线图') }}</h2>
      <div class="v-tab-box">
        <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
          <el-tab-pane :label="$t('Hlin.近七天')" name="1">
          </el-tab-pane>
          <el-tab-pane :label="$t('Hlin.近一个月')" name="2">
          </el-tab-pane>
          <el-tab-pane :label="$t('Hlin.今年')" name="3">
          </el-tab-pane>
        </el-tabs>
      </div>
      <Echarts :eChartCountId="0" />
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
import { scrollRevealEffect, deepCloneData } from '@/filters/common';
import { UserStore } from '@/store/private/user';
import { 
  webGetAdminUserHomeStatisticEchartsPies,
  webGetAdminUserHomeStatisticEchartsLines,
} from "@/api/index";

import Echarts from "@/components/Echarts/index.vue";

type echartsUsersInfo = {
  totalAppointments: number;
  totalPurchasePackage: number;
  totalRegisterNum: number;
  todaySchedule?: number;
}
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
  private startType = 0;        // 0 表格数据  1 图片

  private echartsUsersInfo:echartsUsersInfo = {
    totalAppointments: 0,
    totalPurchasePackage: 0,
    totalRegisterNum: 0,
    todaySchedule: 0,
  };
  private countToStartVal = 0;
  private activeTabsName = '1'; // tab 切换
  private userInfoAssets:any = {};
  
  // 生命周期
  created() {
    this.initUserHomeEchartsPies();
    this.initUserHomeEchartsLines('1');
  };

  // 生命周期
  mounted () {
    let revealTop = scrollRevealEffect(400, 'top', false, false, '300px', 0);
    let revealBottom = scrollRevealEffect(400, 'bottom', false, false, '300px', 0);
    this.scrollReveal.reveal('.reveal-top', revealTop);
    this.scrollReveal.reveal('.reveal-bottom', revealBottom);
  };

  /**
   *  挂载 饼状图
   */
  private async initUserHomeEchartsPies() {
    const {data: res} = await webGetAdminUserHomeStatisticEchartsPies({});
    if(res.code === 200) {
      const datas = deepCloneData(res.data);
      this.echartsUsersInfo = datas;
      UserStore.storeUserHomeEchartsPiesMap(res);
    }
    // console.log(res);
  }

  /**
   *  挂载 折线图
   */
  private async initUserHomeEchartsLines(ids: string) {
    const {data: res} = await webGetAdminUserHomeStatisticEchartsLines({ 'type': ids });
    // console.log(res);
    if(res.code === 200) {
      UserStore.storeUserHomeEchartsLinesMap(res.data);
    }
  }

  private handleTabsClick(tab, event) {
    // console.log(event);
    this.initUserHomeEchartsLines(this.activeTabsName)
  }
}
</script>
<style lang="scss" scoped>
.pages {
  position: relative;
  min-height: 800px;
  background-color: #fff;
  .v-header-main {
    box-sizing: border-box;
    padding: 10px;
  }
  .v-register-box {
    padding-top: 20px;
    .v-line-list {
      display: inline-block;
      width: 25%;
      margin-top: 15px;
      vertical-align: middle;
      .v-h1 {
        font-size: 54px;
        margin-bottom: 15px;
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
  .v-row-right { 
    padding-top: 60px;
    text-align: center;
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
  .v-echarts-mian {
    padding: 30px 15px;
    .v-h2 {
      padding-bottom: 10px;
    }
    .v-tab-box {
      padding: 10px 0 30px;
    }
    /deep/.el-tabs__header {padding: 0 30px;}
  }
  .v-img-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 750px;
    transform: translate(-50%, -50%);
    .v-img {
      display: block;
      width: 100%;
    }
  }
}
</style>
