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

  const option = {
    series: [
      {
        type: 'map',
        mapType: 'china',

        label: {
          normal: {
          },
          emphasis: {
            textStyle: {
              color: '#fff',
            },
          },
        },

        itemStyle: {
          normal: {
            borderColor: '#389BB7',
            // areaColor: '#fff',
          },
          emphasis: {
            areaColor: '#389BB7',
            borderWidth: 0,
          },
        },

        data: [
          { name: '郑州市', value: 100 },
          { name: '洛阳市', value: 10 },
          { name: '开封市', value: 20 },
          { name: '信阳市', value: 30 },
          { name: '驻马店市', value: 40 },
          { name: '南阳市', value: 41 },
          { name: '周口市', value: 15 },
          { name: '许昌市', value: 25 },
          { name: '平顶山市', value: 35 },
          { name: '新乡市', value: 35 },
          { name: '漯河市', value: 35 },
          { name: '商丘市', value: 35 },
          { name: '三门峡市', value: 35 },
          { name: '济源市', value: 35 },
          { name: '焦作市', value: 35 },
          { name: '安阳市', value: 35 },
          { name: '鹤壁市', value: 35 },
          { name: '濮阳市', value: 35 },
          { name: '开封市', value: 45 },
        ],
      },
    ],
  };

  chart.setOption(option);
  return chart;
}