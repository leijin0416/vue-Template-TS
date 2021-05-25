const echarts = require('echarts')
// import * as echarts from 'echarts/core';
// import {
//   GridComponent,
//   TooltipComponent,
//   LegendComponent
// } from 'echarts/components';
// import {
//   LineChart,
//   PieChart
// } from 'echarts/charts';
// import {
//   CanvasRenderer
// } from 'echarts/renderers';

// echarts.use(
//   [GridComponent, LineChart, CanvasRenderer,TooltipComponent, LegendComponent, PieChart]
// );

/**
 * 图标折叠
 */
const install = function (Vue: any) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          lineFold: function (id: string, xAxisData: object, xAxisName: string, seriesFoldData: object) {  // 折线图
            if (document.getElementById(id) == null) {
              return
            }
            echarts.dispose(document.getElementById(id) as any);
            this.chart1 = echarts.init(document.getElementById(id) as any);
            this.chart1.clear();

            const optionData = {
              title: {
                text: '',
                x: 'center',
                top: 0,
              },
              tooltip: { // 提示框
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              legend: {
                x: 'center',      // 可设定图例在左、右、居中
                y: 'top',        // 可设定图例在上、下、居中,
                top: 20,
                data: [xAxisName]
              },
              toolbox: {
                orient: 'horizontal',
                show: false,      // 是否显示工具栏组件
                x: 'left',
                feature: {
                  saveAsImage: {}
                }
              },
              grid: {
                left: '15px',
                right: '15px',
                bottom: '0%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: '#899daf',  //更改坐标轴文字颜色
                      fontSize: 12      //更改坐标轴文字大小
                    }
                  },
                  axisTick: {
                    show: true
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#899daf' //更改坐标轴颜色
                    }
                  },
                  data: xAxisData
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  // interval: 200, // 设置左侧网格值
                  splitLine: {    // 设置网格线颜色
                    show: true,   // 隐藏网格线
                    lineStyle: {
                      color: ['rgb(235, 235, 235)'],
                      width: 1,
                      type: 'solid'
                    }
                  },
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: '#899daf',  //更改坐标轴文字颜色
                      fontSize: 12      //更改坐标轴文字大小
                    }
                  },
                  axisTick: {
                    show: true
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#899daf' //更改坐标轴颜色
                    }
                  }
                }
              ],
              series: [  // 数据源
                {
                  name: xAxisName,
                  type: 'line',
                  stack: '总量',
                  smooth: 0.3,    // 线条曲线
                  itemStyle: {
                    normal: {
                      color: '#409eff',   // 改变折线点的颜色
                      lineStyle: {
                        color: '#409eff' // 改变折线颜色
                      }
                    }
                  },
                  areaStyle: {
                    normal: { color: 'transparent', }  // 改变区域颜色
                  },
                  data: seriesFoldData
                },
              ]
            };
            // @ts-ignore
            this.chart1.setOption(optionData);
            this.chart1.resize();
          },
          lineDoughnut: function (id: string, xAxisData: any) {  // 饼状图
            if (document.getElementById(id) == null) {
              return
            }
            echarts.dispose(document.getElementById(id) as any);
            this.chart = echarts.init(document.getElementById(id) as any);
            this.chart.clear();

            const optionData = {
              tooltip: {
                trigger: 'item'
              },
              legend: {
                top: '5%',
                left: 'center'
              },
              color : [ '#2d8bec', ],
              series: [
                {
                  name: '平台数据',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: xAxisData
                }
              ]
            };
            // @ts-ignore
            this.chart.setOption(optionData);
          },
        }
      }
    },
  })
}

export default {
  install
}