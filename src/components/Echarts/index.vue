<template>
  <div class="v-echarts-wrap" id="echarts">
    <!-- 折线 -->
    <div class="v-echarts-fold" id="myChartFold" v-if="eChartCountId === 0" ></div>
    <!-- 饼状 -->
    <div class="v-echarts-doughnut" id="myChartDoughnut" v-if="eChartCountId === 1" ></div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Prop } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';
import { UserStore } from '@/store/private/user';

type inits = {
  id?: number;
  createTime: string;
  registerNum: number;
}
@Component({
  name: 'ECharts',
  components: {
  },
})
export default class extends Vue {
  [x: string]: any; // ts报错
  private vm = window['vm'];

  @Prop({ default: 0 }) eChartCountId!: number;  // 图表类型

  private xAxisDoughnutData: any = [];
  private initDatas: Array<inits> = [
    {createTime: "11/23", registerNum: 5},
    {createTime: "11/24", registerNum: 8},
    {createTime: "11/25", registerNum: 4},
    {createTime: "11/26", registerNum: 6},
    {createTime: "11/27", registerNum: 5},
    {createTime: "11/28", registerNum: 9},
    {createTime: "11/29", registerNum: 8},
  ]
  private screenWidth:number | string = '';

  // 获取数据
  get getStoreUserHomeEchartsPiesMap() {
    const res = UserStore.getStoreUserHomeEchartsPiesMap;
    if(res.code === 200) {
      // console.log(res);
      const data = deepCloneData(res.data)
      return data
    }
  };
  get getStoreUserHomeEchartsLinesMap() {
    const res = UserStore.getStoreUserHomeEchartsLinesMap;
    if(res.length > 0) {
      return res
    }
  };

  /**
   * @description: 监听数据列表
   * @param {array} getStoreUserHomeEchartsPiesMap    饼状
   * @param {array} getStoreUserHomeEchartsLinesMap   折线
   */
  @Watch('getStoreUserHomeEchartsPiesMap', { deep: true })
  watchStoreUserHomeEchartsPiesMap(newValue: any, oldValue: any) {
    // console.log(newValue)
    if(newValue) {
      const list = newValue;
      const text1 = this.vm.$t('Hlin.总注册数');
      const text2 = this.vm.$t('Hlin.总配套数');
      const text3 = this.vm.$t('Hlin.总预约数');
      const doughnutData = [
        { value: list.totalRegisterNum, name: text1 },
        { value: list.totalPurchasePackage, name: text2 },
        { value: list.totalAppointments, name: text3 },
      ]
      this.xAxisDoughnutData = doughnutData;
      this.initDoughnutChart();
    }
    // console.log(oldValue)
  };
  @Watch('getStoreUserHomeEchartsLinesMap', { deep: true })
  userRegistrationList(newValue: any, oldValue: any) {
    // console.log(newValue)
    if(newValue) {
      const data = deepCloneData(newValue);
      // this.$chart.linesChart('myChartFold', [], '', []);
      if(data.length === 12) {
        const text = this.vm.$t('Hlin.月');
        data.forEach( (el, i, arr) => {
          el.createTime += text
        });
      }
      this.initChartLines(data);
    }
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

  private initData(data) {
    let seriesFoldData: any = [];
    let seriesFoldTimeData: any = [];
    data.forEach( (el, i, arr) => {
      seriesFoldData.push(el.registerNum);
      seriesFoldTimeData.push(el.createTime);
    });
    return {
      seriesFoldData,
      seriesFoldTimeData
    };
  }
  
  /**
   * @description: 挂载图表 -折线
   * @param {array} seriesFoldTimeData   X轴时间线
   * @param {array} seriesFoldData       数据线
   * @param {string} xAxisName           标题
   * @return {*}
   */
  private initChartLines(data) {
    // console.log(data);
    const _that = this;
    const {seriesFoldTimeData, seriesFoldData} = _that.initData(data);
    const myChartsize: any = document.getElementById('myChartFold');
    let xAxisName = '';
    if(data.length === 7) xAxisName = this.vm.$t('Hlin.近七天注册人数');
    else if(data.length === 30) xAxisName = this.vm.$t('Hlin.近一个月注册人数');
    else xAxisName = this.vm.$t('Hlin.今年注册人数');

    _that.$chart.linesChart('myChartFold', seriesFoldTimeData, xAxisName, seriesFoldData);
    setTimeout(() => {
      _that.$nextTick(() => {
        // myChartsize.style.width = '100vw';
      });
    }, 1000);
  }
  
  /**
   * @description: 挂载图表 -饼状
   * @param {array} xAxisDoughnutData     数据线
   * @return {*}
   */
  private initDoughnutChart() {
    let _that = this;
    _that.$chart.piesChart('myChartDoughnut', this.xAxisDoughnutData);
  }

}
</script>

<style lang='scss' scoped>
.v-echarts-wrap {
  // min-height: 700px;
  .v-echarts-doughnut {
    display: block;
    width: 60%;
    height: 400px;
    margin: auto;
  }
  .v-echarts-fold {
    display: block;
    width: 100%;
    height: 500px;
    margin: auto;
  }
}
</style>