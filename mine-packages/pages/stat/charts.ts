import * as echarts from '../../../components/ec-canvas/echarts';
import geoJson from '../../../utils/libs/chinaMap';
import { statBgColor } from '../../../utils/constant';
import { getRandomInt } from '../../../utils/util';
import * as _ from 'lodash';


const getProvinceColor = (data, max, min) => {
  const colors = [
    '#b5c7ff',
    '#8eabff',
    '#618dff',
    '#366ef4',
    '#0052d9',
    '#003cab',
    '#002a7c'
  ]
  const step = (max - min) / colors.length
  const index = Math.floor((data - min) / step)
  return colors[index - 1] || '#b5c7ff'
}

const generatePieChartColor = ([color1, color2]) => {
  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: color1 },
    // { offset: 0.5, color: '#618dff'},
    { offset: 1, color: color2 }
  ])
}

export function initTaxonPie(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    series: [{
      label: {
        normal: {
          fontSize: 14,
          color: "#ffffff"
        }
      },
      type: 'pie',
      radius: ['25%', '55%'],
      center: ['50%', '50%'],
      labelLine: {
        lineStyle: {
          color: '#fff'
        },
      },
      itemStyle: {
        borderRadius: 6,
        borderColor: statBgColor,
        borderWidth: 3,
        color: function (colors) {
          const defaultGreenColor = generatePieChartColor(['#3fe966', '#16d142'])
          var colorList = [
            generatePieChartColor(['#f49d0c', '#d87607']),
            generatePieChartColor(['#c69cff', '#ad75fe']),
            defaultGreenColor,
            generatePieChartColor(['#41b8f2', '#029cd4']),
            defaultGreenColor,
            defaultGreenColor,
            defaultGreenColor,
            defaultGreenColor,
            defaultGreenColor,
            defaultGreenColor,
            defaultGreenColor,
            defaultGreenColor,
          ];
          return colorList[colors.dataIndex];
        }
      },
      data: [{
        value: 55,
        name: '昆虫'
      }, {
        value: 20,
        name: '植物'
      }, {
        value: 10,
        name: '鸟类'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

export const generateInitTaxonMap = (data: any[]) => {
  const max = _.maxBy(data, 'value').value
  const min = _.minBy(data, 'value').value

  function initTaxonMap(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    const option = {
      label: {
        color: statBgColor,
      },
      series: [
        {
          name: '地图',
          type: 'map',
          map: 'china',
          data: data.map(i => {
            const color = getProvinceColor(i.value, max, min)
            return {
              ...i,
              itemStyle: {
                areaColor: color
              },
              emphasis: {
                itemStyle: {
                  areaColor: color,
                },
                label: {
                  color: '#FFF',
                }
              }
            }
          }),
          itemStyle: {
            borderColor: statBgColor,
          }
        },
      ],
    };

    chart.setOption(option);
    return chart;
  }

  return initTaxonMap
}


export function initMonthBar(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);


  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: {
        textStyle: {
          color: '#eee'
        }
      },
      axisTick: {
        show: false // 隐藏x轴刻度
      },
      axisLine: {
        show: false // 隐藏x轴刻度
      }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: {
        textStyle: {
          color: '#eee'
        }
      }
    },
    tooltip: {
      show: true
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8e56dd' },
            { offset: 1, color: '#7137bf' }
          ]),
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

export function initCalendarChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);


  const option = {
    visualMap: {
      show: false,
      min: 0,
      max: 1000
    },
    calendar: {
      range: '2023'
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: [['2023-01-02', 900], ['2023-01-02', 877], ['2023-01-02', 699]]
    }
  };

  chart.setOption(option);
  return chart;
}

