import { getImgQuality } from "../../utils/img"

const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  properties: {
    observations: {
      type: Array,
      value: []
    },
  },
  data: {

  },
  methods: {
    gotoDetailPage(e) {
      wx.navigateTo({
        url: `/pages/observation-detail/observation-detail?id=${e.currentTarget.dataset.id}`,
        events: {
          refresh: () => {
            this.triggerEvent('refresh')
          }
        }
      })
    }
  },
  // @ts-ignore
  computed: {
    formattedObservations(data) {
      return (data.observations || []).map(i => {
        return {
          ...i,
          displayImg: getImgQuality(i.photos[0].url, 20)
        }
      })
    }
  }
})