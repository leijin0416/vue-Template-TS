const echarts = require('echarts')

// 折线图
const publicLinesChart = (vm: any, id, xAxisData, xAxisName, seriesFoldData) => {
  if (document.getElementById(id) == null) {
    return
  }
  echarts.dispose(document.getElementById(id) as any);
  vm.chart1 = echarts.init(document.getElementById(id) as any);
  vm.chart1.clear();

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
            color: '#899daf',      // 更改X坐标轴文字颜色
            fontSize: 12          // 更改X坐标轴文字大小
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: '#899daf'       // 更改X坐标轴颜色
          }
        },
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value',
        // interval: 200,           // 设置左侧网格值
        splitLine: {               // 设置网格线颜色
          show: true,              // 隐藏网格线
          lineStyle: {
            color: ['rgb(235, 235, 235)'],
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#899daf',     // 更改Y坐标轴文字颜色
            fontSize: 12          // 更改Y坐标轴文字大小
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: '#899daf'       // 更改Y坐标轴颜色
          }
        }
      }
    ],
    series: [  // 数据源
      {
        name: xAxisName,
        type: 'line',
        smooth: 0.3,              // 线条曲线
        itemStyle: {
          normal: {
            color: '#409eff',    // 改变折线点的颜色
            lineStyle: {
              color: '#409eff'   // 改变折线颜色
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

  vm.chart1.setOption(optionData);
  vm.chart1.resize();
}

// 饼状图
const publicPiesChart = (vm: any, id, xAxisData) => {
  if (document.getElementById(id) == null) {
    return
  }
  echarts.dispose(document.getElementById(id) as any);
  vm.chart = echarts.init(document.getElementById(id) as any);
  vm.chart.clear();

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
        name: window['vm'].$t('Hlin.平台数据'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: { // 提示类型名称
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

  vm.chart.setOption(optionData);
}

export {
  publicLinesChart,
  publicPiesChart,
}