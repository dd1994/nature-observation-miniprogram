// components/identifications/identifications.js
const computedBehavior = require('miniprogram-computed').behavior;
import moment from 'moment'
import { openTaxonDetail } from '../../utils/openTaxonDetail';
moment.locale('zh-cn')

Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    identifications: {
      type: Array,
      value: []
    },
    userProfile: {
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
    openTaxonDetail(e) {
      const taxon = e.currentTarget.dataset.taxon
      openTaxonDetail({
        name: taxon.scientific_name,
        rank: taxon.taxon_rank,
        iconic_taxon_name: taxon.iconic_taxon_name,
        id: taxon.taxon_id,
      })
    },
    agreeID(e) {
      const taxon = e.currentTarget.dataset.taxon
      this.triggerEvent('agreeID', taxon)
    }
  },
  // @ts-ignore
  computed: {
    formattedIdentifications(data) {
      return data.identifications.map(i => {
        const created_from_now = moment(i.created_at).fromNow()
        return {
          ...i,
          created_from_now: created_from_now === '几秒后' ? '几秒前' : created_from_now
        }
      })
    }
  }
})