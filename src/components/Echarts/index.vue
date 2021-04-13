<template>
  <!-- 折线图 -->
  <div class="v-echarts-main">
    <div class="v-echarts" id="myChart" ></div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class myChart extends Vue {
  [x: string]: any;
  private screenWidth:number| string = '';
  private xAxisData:object = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {
    // this.screenWidth = document.body.clientWidth;
    // window.onresize = () => {
    //   return (() => {
    //     this.screenWidth = document.body.clientWidth;
    //   })();
    // }
    this.initChart();
  };

  /**
   *  挂载
   */
  initChart() {
    let _that = this;
    let newArrs = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    let xAxisName = '价格';
    let xAxisNameTwo = '成交量';

    _that.$chart.lineFold('myChart', newArrs, xAxisName, xAxisNameTwo);
  }

}
</script>

<style lang='scss' scoped>
.v-echarts-main {
  min-height: 700px;
  .v-echarts {
    width: 50%;
    height: 400px;
  }
}
</style>