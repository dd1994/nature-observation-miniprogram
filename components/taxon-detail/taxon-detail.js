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
      return data.taxon?.iconic_taxon_name
    },
    useAnimalDB(data) {
      return ['Actinopterygii', 'Insecta', 'Mollusca', 'Amphibia'].includes(data.taxon?.iconic_taxon_name)
    },
    useEmbeddedMiniProgram(data) {
      return ['Aves', 'Mammalia'].includes(data.taxon?.iconic_taxon_name)
    },
    popupVisible(data) {
      return data.visible && !data.useEmbeddedMiniProgram
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
        "Aves": () => {
          if (taxon.rank === "species") {
            openBirdDetail(taxon.name)
          }
        },
        "Plantae": () => {
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
        'Actinopterygii': defaultAnimalAction,
        'Insecta': defaultAnimalAction,
        'Mollusca': defaultAnimalAction,
        'Amphibia': defaultAnimalAction,
        "Mammalia": () => {
          if (taxon.rank === "species") {
            openMammalDetail(taxon.name)
          }
        }
      }
        ; (actionMap[taxon.iconic_taxon_name] || defaultAction)()
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