// components/animal-detail/animal-detail.js
import { fetchAnimalFaunaDetail } from '../../utils/service/plantApi'
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    taxon: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    faunaContent: [] // 中国动物志
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchDetail() {
      if (!this.data.taxon?.name) {
        return
      }
      fetchAnimalFaunaDetail({
        name: this.data.taxon.name
      }).then(res => {
        if (res?.length) {
          this.setData({
            faunaContent: res
          })
        }
      })
    }
  },
  lifetimes: {
    attached() {
      this.fetchDetail()
    }
  }
})