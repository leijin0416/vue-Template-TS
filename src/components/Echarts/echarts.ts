// import echarts from 'echarts';
// import 'echarts/map/js/china.js';
const echarts = require('echarts');

/**
 * 图标折叠
 */
const install = function (Vue: any) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 画一条简单的线
          lineFold: function (id: string, xAxisData: any, xAxisName: string, xAxisNameTwo: string) {
            this.chart = echarts.init(document.getElementById(id) as any);
            this.chart.clear();

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
                data: [xAxisName, xAxisNameTwo]
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
                  //设置网格线颜色
                  splitLine: {
                    show: true,//隐藏网格线
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
                      color: '#00c775',   // 改变折线点的颜色
                      lineStyle: {
                        color: '#00c775' // 改变折线颜色
                      }
                    }
                  },
                  areaStyle: {
                    normal: { color: 'transparent', }  // 改变区域颜色
                  },
                  data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                  name: xAxisNameTwo,
                  type: 'line',
                  stack: '总量',
                  smooth: 0.3,
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: '#ff928f',   // 改变折线点的颜色
                      lineStyle: {
                        color: '#ff928f' // 改变折线颜色
                      }
                    }
                  },
                  areaStyle: {
                    normal: { color: 'rgb(245, 245, 245)', }  // 改变区域颜色
                  },
                  data: [220, 182, 191, 234, 290, 330, 310]
                }
              ]
            };
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