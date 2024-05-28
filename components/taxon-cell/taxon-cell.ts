import { openTaxonDetail } from '../../utils/openTaxonDetail'

Component({
  properties: {
    taxon: {
      type: Object,
      value: {}
    },
    url: {
      // 如果配置了 url 直接跳转到 url
      type: String
    },
    defaultOpenTaxon: {
      // 是否默认跳转到物种详情页
      type: Boolean,
      value: true,
    }
  },
  data: {

  },
  methods: {
    openTaxonDetail() {
      if (this.data.url) {
        return wx.navigateTo({
          url: this.data.url
        })
      } else if (!this.data.defaultOpenTaxon) {
        return
      } else {
        openTaxonDetail({
          name: this.data.taxon.scientific_name,
          rank: this.data.taxon.taxon_rank,
          iconic_taxon_name: this.data.taxon.iconic_taxon_name,
          id: this.data.taxon.taxon_id
        })
      }
    },
  },
})