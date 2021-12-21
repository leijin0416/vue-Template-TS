import { publicLinesChart, publicPiesChart } from './common';

/**
 * echarts 图表
 */
const install = (Vue: any) => {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          linesChart: (id: string, xAxisData: any, xAxisName: string, seriesFoldData: any) => {
            const vms: any = this;
            publicLinesChart(vms, id, xAxisData, xAxisName, seriesFoldData)
          },
          piesChart: (id: string, xAxisData: any) => {
            const vms: any = this;
            publicPiesChart(vms, id, xAxisData)
          }
        }
      }
    },
  })
}

export default {
  install
}