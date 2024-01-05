const computedBehavior = require('miniprogram-computed').behavior
import { openBirdDetail, openMammalDetail } from '../../utils/openTaxonDetail'
import { fetchPlantDetail, fetchAnimalDetail } from '../../utils/service'

Page({
  behaviors: [computedBehavior],
  data: {
    taxon: {
      type: Object
    },
    taxonDetail: null,
  },
  computed: {
    taxonGroup(data) {
      return data.taxon?.iconic_taxon_name
    },
    useAnimalDB(data) {
      return ['Actinopterygii', 'Insecta', 'Mollusca', 'Amphibia'].includes(data.taxon?.iconic_taxon_name)
    }
  },
  fetchDetail() {
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
  },
  onLoad(options) {
    const taxon = {
      rank: decodeURIComponent(options.rank),
      name: decodeURIComponent(options.name),
      "iconic_taxon_name": decodeURIComponent(options.iconic_taxon_name)
    }

    this.setData({
      taxon
    })

    this.fetchDetail()
  }
})