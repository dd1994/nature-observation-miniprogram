const {fetchPlantDetail} = require('../../utils/service')

Component({

  /**
   * 组件的属性列表
   */
  properties: {

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
    created() {
      fetchPlantDetail({
        name: 'Sapindus saponaria',
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
})