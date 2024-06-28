import { generateDisplayRegion } from "../../../utils/util";

const computedBehavior = require('miniprogram-computed').behavior;

Page({
  behaviors: [computedBehavior],
  data: {
    region: ['全部', '全部', '全部'],
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
    })
  },
  removeRegion() {
    this.setData({
      region: ['全部', '全部', '全部'],
    })
  },
  computed: {
    displayRegion(data) {
      return generateDisplayRegion(data.region)
    }
  }
})