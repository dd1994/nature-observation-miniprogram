import * as echarts from '../../components/ec-canvas/echarts';
import geoJson from '../../utils/libs/chinaMap';
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
        borderColor: '#16d142',
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
      min: 0,
      max: 20000,
      inRange: {
        color: ['#e0ffff', '#006edd']
      }
    },
    series: [
      {
        type: 'map',
        mapType: 'china',
        data: data,
      },
    ],
  };

  chart.setOption(option);
  return chart;
}