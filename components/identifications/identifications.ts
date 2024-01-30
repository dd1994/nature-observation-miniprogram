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
        iconic_taxon_name: taxon.iconic_taxon_name
      })
    },
  },
  // @ts-ignore
  computed: {
    formattedIdentifications(data) {
      return data.identifications.map(i => {
        return {
          ...i,
          created_from_now: moment(i.created_at).fromNow()
        }
      })
    }
  }
})