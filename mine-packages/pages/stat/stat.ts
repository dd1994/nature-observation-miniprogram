// pages/stat/stat.ts

import { initCalendarChart, initMonthBar, initTaxonMap, initTaxonPie } from "./charts";
import * as echarts from '../../../components/ec-canvas/echarts';
import geoJson from '../../../utils/libs/chinaMap';
import { getUserStatCountWithoutLogin } from "../../../utils/service/user";
import { getUserProvinceStatCount } from "../../../utils/service/observations";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecTaxonPie: {
      lazyLoad: true,
    },
    ecTaxonMap: {
      lazyLoad: true,
    },
    ecMonthBarChart: {
      lazyLoad: true,
    },
    user_id: null,
    statCount: {}
    // ecCalendarChart: {
    //   lazyLoad: true,
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user_id: options.user_id
    })
    // @ts-ignore
    getUserStatCountWithoutLogin({ user_id: options.user_id }).then(res => {
      // @ts-ignore
      if (res?.data?.success) {
        // @ts-ignore
        this.setData({
          // @ts-ignore
          statCount: res.data.data
        })
      }
    })
    // @ts-ignore
    getUserProvinceStatCount({ user_id: options.user_id }).then(res => {
      // @ts-ignore
      const formattedRes = (res?.data?.data || []).map(i => {
        return {
          // 去掉末尾的 省/市，因为地图数据没有这个
          name: i.province.replace('省', '').replace('市', ''),
          value: i.count,
        }
      })
      this.ecTaxonMapComponent = this.selectComponent('#echart-taxon-map');
      this.ecTaxonMapComponent.init(initTaxonMap)
      // this.ecTaxonMapComponent.init(initTaxonMap)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取组件
    this.ecTaxonPieComponent = this.selectComponent('#echart-taxon-pie');
    this.ecTaxonMapComponent = this.selectComponent('#echart-taxon-map');
    this.ecMonthBarChartComponent = this.selectComponent("#echart-month-bar")
    // this.ecCalendarChartComponent = this.selectComponent('#echart-calendar-chart')
    echarts.registerMap('china', geoJson);

    setTimeout(() => {
      this.ecTaxonPieComponent.init(initTaxonPie)
      this.ecMonthBarChartComponent.init(initMonthBar)
      // this.ecCalendarChartComponent.init(initCalendarChart)
    }, 1000)
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