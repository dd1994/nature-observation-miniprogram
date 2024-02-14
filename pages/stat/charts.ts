import * as echarts from '../../components/ec-canvas/echarts';
import geoJson from '../../utils/libs/chinaMap';
import wordCloud from "../../components/echarts-wordcloud/wordCloud";

wordCloud({
  createCanvas: function () {
    return wx.createOffscreenCanvas({
      type: "2d",
    });
  },
});

const bgColor = '#0bae31'
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
      radius: ['30%', '55%'],
      center: ['50%', '30%'],
      labelLine: {
        lineStyle: {
          color: '#fff'
        },
      },
      itemStyle: {
        borderRadius: 5,
        borderColor: bgColor,
        borderWidth: 2,
        color: function (colors) {
          var colorList = [
            '#029cd4',
            '#ad75fe',
            '#ff79cd',
            '#ef6567',
            '#f9c956',
            '#75bedc'
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

export function initTaxonMap(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  // 模拟数据
  const data = [
    { "name": "台湾", "value": 20000 },
    { "name": "河北", "value": 2000 },
    { "name": "山西", "value": 2000 },
    { "name": "内蒙古", "value": 2000 },
    { "name": "辽宁", "value": 2000 },
    { "name": "吉林", "value": 2000 },
    { "name": "黑龙江", "value": 0 },
    { "name": "江苏", "value": 10000 },
    { "name": "浙江", "value": 10000 },
    { "name": "安徽", "value": 10000 },
    { "name": "福建", "value": 6500 },
    { "name": "江西", "value": 6500 },
    { "name": "山东", "value": 6500 },
    { "name": "河南", "value": 6500 },
    { "name": "湖北", "value": 1500 },
    { "name": "湖南", "value": 100 },
    { "name": "广东", "value": 20000 },
    { "name": "广西", "value": 1500 },
    { "name": "海南", "value": 1000 },
    { "name": "四川", "value": 3000 },
    { "name": "贵州", "value": 3000 },
    { "name": "云南", "value": 3000 },
    { "name": "西藏", "value": 3000 },
    { "name": "陕西", "value": 100 },
    { "name": "甘肃", "value": 5000 },
    { "name": "青海", "value": 2000 },
    { "name": "宁夏", "value": 2000 },
    { "name": "新疆", "value": 2000 },
    { "name": "北京", "value": 2000 },
    { "name": "天津", "value": 2000 },
    { "name": "上海", "value": 2000 },
    { "name": "重庆", "value": 200 },
    { "name": "香港", "value": 200 },
    { "name": "澳门", "value": 200 },
    { "name": "南海诸岛", "value": 15000 }
  ]
  const option = {
    visualMap: {
      left: 'right',
      min: 100,
      max: 30000,
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026'
        ]
      },
      text: ['High', 'Low'],
      calculable: true
    },
    series: [
      {
        name: '地图',
        type: 'map',
        map: 'china',
        data: data,
      },
    ],
  };

  chart.setOption(option);
  return chart;
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
            { offset: 0, color: '#366ef4' },
            // { offset: 0.5, color: '#618dff'},
            { offset: 1, color: '#0052d9' }
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

export function initWordCloudChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);


  
  const option = {
    tooltip: {
      confine: true,
    },
    series: [
      {
        type: "wordCloud",
        gridSize: 2,
        sizeRange: [12, 50],
        rotationRange: [0, 90],
        //渲染的梯度就是 rotationStep ，这个值越小，词云里出现的角度种类就越多
        rotationStep: 90,
        shape: "circle",
        // width: 375,
        // height: 200,
        drawOutOfBound: true,
        textStyle: {
          color: function () {
            return (
              "rgb(" +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(",") +
              ")"
            );
          },
        },
        emphasis: {
          textStyle: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: [
          {
            name: "Sam S Club",
            value: 10000,
            textStyle: {
              color: "black",
            },
            emphasis: {
              textStyle: {
                color: "red",
              },
            },
          },
          {
            name: "Macys",
            value: 6181,
          },
          {
            name: "Amy Schumer",
            value: 4386,
          },
          {
            name: "Jurassic World",
            value: 4055,
          },
          {
            name: "Charter Communications",
            value: 2467,
          },
          {
            name: "Chick Fil A",
            value: 2244,
          },
          {
            name: "Planet Fitness",
            value: 1898,
          },
          {
            name: "Pitch Perfect",
            value: 1484,
          },
          {
            name: "Express",
            value: 1112,
          },
          {
            name: "Home",
            value: 965,
          },
          {
            name: "Johnny Depp",
            value: 847,
          },
          {
            name: "Lena Dunham",
            value: 582,
          },
          {
            name: "Lewis Hamilton",
            value: 555,
          },
          {
            name: "KXAN",
            value: 550,
          },
          {
            name: "Mary Ellen Mark",
            value: 462,
          },
          {
            name: "Farrah Abraham",
            value: 366,
          },
          {
            name: "Rita Ora",
            value: 360,
          },
          {
            name: "Serena Williams",
            value: 282,
          },
          {
            name: "NCAA baseball tournament",
            value: 273,
          },
          {
            name: "Point Break",
            value: 265,
          },
        ],
        wait: 1000,
      },
    ],
  };


  chart.setOption(option);
  return chart;
}