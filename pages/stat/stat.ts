// pages/stat/stat.ts
import * as echarts from '../../components/ec-canvas/echarts';

function initChart(canvas, width, height, dpr) {
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
      radius: ['30%', '60%'],
      center: ['50%', '30%'],
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})