// pages/stat/stat.ts

import { generateInitTaxonMap } from "./charts";
import * as echarts from '../../../components/ec-canvas/echarts';
import geoJson from '../../../utils/libs/chinaMap';
import { getUserProfileWithOutLogin, getUserStatCountWithoutLogin } from "../../../utils/service/user";
import { getUserDateStatCount, getUserProvinceStatCount } from "../../../utils/service/observations";
const computedBehavior = require('miniprogram-computed').behavior;
Page({
  behaviors: [computedBehavior],
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
    userProfile: {},
    user_id: null,
    statCount: {},
    locationCount: [],
    dateCount: 0,
    // ecCalendarChart: {
    //   lazyLoad: true,
    // }
  },

  computed: {
    provinceCount(data) {
      return (data?.locationCount || [])
        .filter(i => i.province).length
    },
    cityCount(data) {
      return (data?.locationCount || [])
        .filter(i => i.city).length
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user_id: options.user_id
    })
    this.getUserProfile()
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
      this.setData({
        // @ts-ignore
        locationCount: res?.data?.data || []
      })

      // @ts-ignore
      const formattedRes = (res?.data?.data || [])
        .filter(i => i.province)
        .map(i => {
          return {
            // 去掉末尾的 省/市，因为地图数据没有这个
            name: i.province.replace('省', '').replace('市', ''),
            value: i.count,
          }
        })
      this.ecTaxonMapComponent = this.selectComponent('#echart-taxon-map');
      this.ecTaxonMapComponent.init(generateInitTaxonMap(formattedRes))
      // this.ecTaxonMapComponent.init(initTaxonMap)
    })
    // @ts-ignore
    getUserDateStatCount({ user_id: options.user_id }).then(res => {
      this.setData({
        // @ts-ignore
        dateCount: res?.data?.data?.[0]?.count || 0
      })
    })
  },
  getUserProfile() {
    getUserProfileWithOutLogin(this.data.user_id).then(res => {
      this.setData({
        // @ts-ignore
        userProfile: res?.data?.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取组件
    // this.ecTaxonPieComponent = this.selectComponent('#echart-taxon-pie');
    // this.ecTaxonMapComponent = this.selectComponent('#echart-taxon-map');
    // this.ecMonthBarChartComponent = this.selectComponent("#echart-month-bar")
    // this.ecCalendarChartComponent = this.selectComponent('#echart-calendar-chart')
    echarts.registerMap('china', geoJson);

    setTimeout(() => {
      // this.ecTaxonPieComponent.init(initTaxonPie)
      // this.ecMonthBarChartComponent.init(initMonthBar)
      // this.ecCalendarChartComponent.init(initCalendarChart)
    }, 1000)
  },
  onShareAppMessage() {
    return {
      title: `${this.data?.userProfile?.user_name}的自然观察统计`,
      path: `mine-packages/pages/stat/stat?user_id=${this.data.user_id}`
    }
  },
  
})