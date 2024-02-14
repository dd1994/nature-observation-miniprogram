// pages/stat/stat.ts

import { initTaxonMap, initTaxonPie } from "./charts";

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取组件
    this.ecTaxonPieComponent = this.selectComponent('#echart-taxon-pie');
    this.ecTaxonMapComponent = this.selectComponent('#echart-taxon-map');

    setTimeout(() => {
      this.ecTaxonPieComponent.init(initTaxonPie)
      this.ecTaxonMapComponent.init(initTaxonMap)
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