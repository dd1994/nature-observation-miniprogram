import { openTaxonDetail } from '../../utils/openTaxonDetail'

Component({
  properties: {
    taxon: {
      type: Object,
      value: {}
    },
    url: {
      type: String
    }
  },
  data: {

  },
  methods: {
    openTaxonDetail() {
      if (this.data.url) {
        wx.navigateTo({
          url: this.data.url
        })
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