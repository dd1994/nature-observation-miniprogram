import { getImgQuality } from "../../utils/img"

const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  properties: {
    observations: {
      type: Array,
      value: []
    },
    userProfile: {
      type: Object,
    },
    allLoaded: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    previewImg(e) {
      const item = e.currentTarget?.dataset?.item
      const photos = item?.photos?.map(i => i.url) || []
      wx.previewImage({
        urls: photos,
        showmenu: this.data.userProfile?.id === item.user_id,
        current: photos[0],
      })
    },
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
    },
  }
})