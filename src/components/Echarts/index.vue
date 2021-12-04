<template>
  <div class="v-echarts-wrap" id="echarts">
    <!-- 饼状 -->
    <div class="v-echarts-doughnut" id="myChartDoughnut" v-if="eChartCountId === 1" ></div>
    <!-- 折线 -->
    <div class="v-echarts-fold" id="myChartFold" v-if="eChartCountId === 0" ></div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Prop } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';
import { UserStore } from '@/store/private/user';

@Component({
  name: 'ECharts',
  components: {
  },
})
export default class extends Vue {
  [x: string]: any; // ts报错
  private vm = window['vm'];

  @Prop({ default: 0 }) eChartCountId!: number;  // 图表类型

  private screenWidth: number| string = '';
  private xAxisDoughnutData: any = [];
  private initDatas = [
    {dateTime: "11/23", registerNum: 5},
    {dateTime: "11/24", registerNum: 8},
    {dateTime: "11/25", registerNum: 4},
    {dateTime: "11/26", registerNum: 6},
    {dateTime: "11/27", registerNum: 5},
    {dateTime: "11/28", registerNum: 9},
    {dateTime: "11/29", registerNum: 8},
  ]

  // 获取数据
  get getUserInfoStatisticsList() {
    if(UserStore.getUserInfoStatisticsList.length === 0) {
      return null
    } else {
      // console.log(UserStore.getUserInfoStatisticsList);
      return UserStore.getUserInfoStatisticsList
    }
  };
  get getUserRegistrationList() {
    if(UserStore.getUserRegistrationStatisticsList.length > 0) {
      return UserStore.getUserRegistrationStatisticsList
    }
  };

  /**
   *  监听数据列表
   */
  @Watch('getUserInfoStatisticsList', { deep: true })
  userInfoStatisticsList(newValue: any) {
    if(newValue) {
      let list = newValue;
      let text1 = this.vm.$t('Hlin.激活');
      let text2 = this.vm.$t('Hlin.实名认证');
      let text3 = this.vm.$t('Hlin.行为限制');
      let doughnutData = [
        { value: list.activeNums, name: text1 },
        { value: list.kycNums, name: text2 },
        { value: list.limitNums, name: text3 },
      ]
      if(this.eChartCountId === 1) {
        this.xAxisDoughnutData = doughnutData;
        this.initDoughnutChart();
      }
    }
    // console.log(newValue)
  };
  @Watch('getUserRegistrationList', { deep: true })
  userRegistrationList(newValue: any, oldValue: any) {
    let data = newValue;
    if(newValue) {
      this.initChart(data);
    }
    // console.log(newValue)
  };

  // 生命周期
  created() {};

  // 生命周期
  mounted () {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    }
  };

  initData(data) {
    let seriesFoldData: Array<object> = [];
    let seriesFoldTimeData: Array<object> = [];
    data.forEach( el => {
      seriesFoldData.push(el.registerNum);
      seriesFoldTimeData.push(el.dateTime);
    });
    return {
      seriesFoldData,
      seriesFoldTimeData
    };
  }
  
  /**
   *  挂载
   */
  private initChart(data) {
    let _that = this;
    let {seriesFoldTimeData, seriesFoldData} = _that.initData(this.initDatas);
    let xAxisName = this.vm.$t('Hlin.近七天注册人数');
    let myChartsize: any = document.getElementById('myChartFold');

    _that.$nextTick(() => {
      myChartsize.style.width = '55vw';
    });
    _that.$eCharts.linesChart('myChartFold', seriesFoldTimeData, xAxisName, seriesFoldData);
  }
  
  private initDoughnutChart() {
    let _that = this;
    _that.$eCharts.piesChart('myChartDoughnut', this.xAxisDoughnutData);
  }

}
</script>

<style lang='scss' scoped>
.v-echarts-wrap {
  // min-height: 700px;
  .v-echarts-doughnut {
    display: block;
    width: 75%;
    height: 400px;
    margin: auto;
  }
  .v-echarts-fold {
    display: block;
    width: 100%;
    height: 400px;
    margin: auto;
  }
}
</style>