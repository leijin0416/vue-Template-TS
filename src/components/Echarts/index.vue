<template>
  <!-- 图表数据 -->
  <div class="v-echarts-main" id="echarts">
    <!-- 饼状 -->
    <div class="v-echarts-doughnut" id="myChartDoughnut" v-if="chartFoldCount === 1" ></div>
    <!-- 折线 -->
    <div class="v-echarts-fold" id="myChartFold" v-if="chartFoldCount === 0" ></div>
    <div class="v-echarts-fold" id="myChartFold2" style="width:100%;" v-if="chartFoldCount === 2" ></div>
    <div class="v-echarts-fold" id="myChartFold3" v-if="chartFoldCount === 3" ></div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Prop } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { UserStore } from '@/store/private/user';

@Component({
  components: {
  },
})
export default class myChart extends Vue {
  @Prop({ default: 0 }) chartFoldCount!: number;  // 图表类型

  [x: string]: any;
  private screenWidth:number| string = '';
  private xAxisDoughnutData:object = [];
  private seriesFoldTimeData:object = [];
  private seriesFoldData:object = [];

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
  get getUserRegistrationList1() {
    if(UserStore.getUserRegistrationStatisticsList1.length > 0) {
      return UserStore.getUserRegistrationStatisticsList1
    }
  };
  get getUserRegistrationList2() {
    if(UserStore.getUserRegistrationStatisticsList2.length > 0) {
      return UserStore.getUserRegistrationStatisticsList2
    }
  };

  /**
   *  监听数据列表
   */
  @Watch('getUserInfoStatisticsList', { deep: true })
  userInfoStatisticsList(newValue: any) {
    if(newValue) {
      let list = newValue;
      let text1 = window['vm'].$t('Hlin.激活人数');
      let text2 = window['vm'].$t('Hlin.实名认证人数');
      let text3 = window['vm'].$t('Hlin.行为限制人数');
      let doughnutData = [
        { value: list.activeNums, name: text1 },
        { value: list.kycNums, name: text2 },
        { value: list.limitNums, name: text3 },
      ]
      if(this.chartFoldCount === 1) {
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
  @Watch('getUserRegistrationList1', { deep: true })
  userRegistrationList1(newValue: any, oldValue: any) {
    let data = newValue;
    if(newValue) {
      this.initChart1(data);
    }
    // console.log(newValue)
  };
  @Watch('getUserRegistrationList2', { deep: true })
  userRegistrationList2(newValue: any, oldValue: any) {
    let data = deepCloneData(newValue);
    let text = window['vm'].$t('Hlin.月');
    if(newValue) {
      let seriesFoldData: any = [];
      let seriesFoldTimeData: any = [];
      data.forEach( el => {
        seriesFoldData.push(el.registerNum);
        seriesFoldTimeData.push(el.dateTime+ text);
      });
      this.initChart2(seriesFoldTimeData, seriesFoldData);
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
    let {seriesFoldTimeData, seriesFoldData} = _that.initData(data);
    let xAxisName = window['vm'].$t('Hlin.近七天注册人数');
    let myChartsize: any = document.getElementById('myChartFold');
    myChartsize.style.width = '55vw';
    _that.$nextTick(() => {
      _that.$chart.lineFold('myChartFold', seriesFoldTimeData, xAxisName, seriesFoldData);
    });
  }
  private initChart1(data) {
    let _that = this;
    let {seriesFoldTimeData, seriesFoldData} = _that.initData(data);
    let xAxisName = window['vm'].$t('Hlin.近一个月注册人数');
    let myChartsize: any = document.getElementById('myChartFold2');
    myChartsize.style.width = '80vw';
    _that.$nextTick(() => {
      _that.$chart.lineFold('myChartFold2', seriesFoldTimeData, xAxisName, seriesFoldData);
    });
  }
  private initChart2(seriesFoldTimeData, seriesFoldData) {
    let _that = this;
    let xAxisName = window['vm'].$t('Hlin.今年注册人数');
    let myChartsize: any = document.getElementById('myChartFold3');
    myChartsize.style.width = '55vw';
    _that.$nextTick(() => {
      _that.$chart.lineFold('myChartFold3', seriesFoldTimeData, xAxisName, seriesFoldData);
    });
  }
  
  private initDoughnutChart() {
    let _that = this;
    _that.$chart.lineDoughnut('myChartDoughnut', this.xAxisDoughnutData);
  }

}
</script>

<style lang='scss' scoped>
.v-echarts-main {
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