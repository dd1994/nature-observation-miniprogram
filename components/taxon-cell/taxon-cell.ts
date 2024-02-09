// components/taxon-cell/taxon-cell.js
import { openTaxonDetail } from '../../utils/openTaxonDetail'

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    taxon: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    openTaxonDetail() {
      openTaxonDetail({
        name: this.data.taxon.scientific_name,
        rank: this.data.taxon.taxon_rank,
        iconic_taxon_name: this.data.taxon.iconic_taxon_name
      })
    },
  }
})