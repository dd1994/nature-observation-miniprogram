const {fetchPlantDetail} = require('../../utils/service')

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
    desc: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    attached() {
      debugger
      if(this.data.taxon?.name) {
        debugger
        fetchPlantDetail({
          name: this.data.taxon.name,
          success: (res) => {
            this.setData({
              desc: res.data.frpsdesc
            })
          },
          fail: (err) => {
  
          }
        })
      }
    }
  }
})