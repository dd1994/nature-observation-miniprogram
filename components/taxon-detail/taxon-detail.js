const computedBehavior = require('miniprogram-computed').behavior
import { openBirdDetail, openMammalDetail } from '../../utils/openTaxonDetail'
import { fetchPlantDetail, fetchAnimalDetail } from '../../utils/service'

Component({
  behaviors: [computedBehavior],
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    taxon: {
      type: Object
    }
  },
  computed: {
    taxonGroup(data) {
      return data.taxon?.taxongroup
    },
    useAnimalDB(data) {
      return ['鱼类', '昆虫'].includes(data.taxon?.taxongroup)
    },
    popupVisible(data) {
      return data.visible && !['鸟类', '兽类'].includes(data.taxonGroup)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    taxonDetail: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onVisibleChange(e) {
      this.setData({
        visible: e.detail.visible
      })
    },
    openDetail() {
      const taxon = this.data.taxon
      const defaultAction = () => {
        wx.showToast({
          title: '暂时没有更多关于该物种的信息了~',
          icon: 'none',
          duration: 2500
        })
      }

      const defaultAnimalAction = () => {
        fetchAnimalDetail({
          name: taxon.name
        }).then(res => {
          if (res?.length) {
            debugger
            this.setData({
              taxonDetail: {
                detail: res,
                ...taxon
              }
            })
          } else {
            this.setData({
              taxonDetail: taxon
            })
          }
        }).catch(err => {
          this.setData({
            taxonDetail: taxon
          })
        })
      }

      const actionMap = {
        "鸟类": () => {
          if (taxon.rank === "Species") {
            openBirdDetail(taxon.name)
          }
        },
        "植物": () => {
          fetchPlantDetail({
            name: taxon.name,
            success: (res) => {
              if (res?.data?.frpsdesc) {
                this.setData({
                  taxonDetail: {
                    ...res.data,
                    ...taxon
                  }
                })
              } else {
                this.setData({
                  taxonDetail: taxon
                })
              }
            },
            fail: (err) => {
              this.setData({
                taxonDetail: taxon
              })
            }
          })
        },
        "昆虫": defaultAnimalAction,
        "鱼类": defaultAnimalAction,
        "兽类": () => {
          if (taxon.rank === "Species") {
            openMammalDetail(taxon.name)
          }
        }
      }
        ; (actionMap[taxon.taxongroup] || defaultAction)()
    }
  },
  observers: {
    'visible,taxon': function (visible, taxon) {
      if (visible && taxon) {
        this.openDetail()
      }
    }
  }
})