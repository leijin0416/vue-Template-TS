import { publicLinesChart, publicPiesChart } from './common';

/**
 * echarts 图表
 */
const install = (Vue: any) => {
  Object.defineProperties(Vue.prototype, {
    $eCharts: {
      get() {
        const vm = this;
        return {
          linesChart: (vm, id: string, xAxisData: any, xAxisName: string, seriesFoldData: any) => {
            publicLinesChart(vm, id, xAxisData, xAxisName, seriesFoldData)
          },
          piesChart: (vm, id: string, xAxisData: any) => {
            publicPiesChart(vm, id, xAxisData)
          }
        }
      }
    },
  })
}

export default {
  install
}