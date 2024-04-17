const computedBehavior = require('miniprogram-computed').behavior
import { showErrorTips } from '../../utils/feedBack'
import { openBirdDetail, openMammalDetail } from '../../utils/openTaxonDetail'
import { fetchTaxonTree } from '../../utils/service/taxon'

Page({
  behaviors: [computedBehavior],
  data: {
    taxon: {
      type: Object
    },
    taxonTree: null,
    taxonTreeLoading: false
  },
  computed: {
    taxonGroup(data) {
      return data.taxon?.iconic_taxon_name
    },
    useAnimalDB(data) {
      return ['Actinopterygii', 'Insecta', 'Mollusca', 'Amphibia'].includes(data.taxon?.iconic_taxon_name)
    }
  },
  async fetchTaxonTree() {
    this.setData({
      taxonTreeLoading: true
    })
    try {
      const res = await fetchTaxonTree({ rank: this.data.taxon.rank, name: this.data.taxon.name, id: this.data.taxon.id })
      this.setData({
        // @ts-ignore
        taxonTree: (res?.data?.data || []).slice().reverse()
      })
    } catch (e) {
      showErrorTips("获取分类失败，请稍后重试~")
    } finally {
      this.setData({
        taxonTreeLoading: false
      })
    }
  },
  fetchDetail() {
    const taxon = this.data.taxon
    const defaultAction = () => {
    }

    const defaultAnimalAction = () => {
    }

    const actionMap = {
      "Aves": () => {
        if (taxon.rank === "species") {
          openBirdDetail(taxon.name)
        }
      },
      "Plantae": () => {
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
      "iconic_taxon_name": decodeURIComponent(options.iconic_taxon_name),
      id: decodeURIComponent(options.id)
    }

    this.setData({
      taxon
    })

    this.fetchTaxonTree()
    this.fetchDetail()
  },
  onShareAppMessage() {
    return {
      // todo: 分享标题加上中文名
      title: `生灵觅迹：物种详情`,
      path: "pages/mine/mine"
    }
  },
  onShareTimeline() {
    return {
      title: `生灵觅迹：物种详情`
    }
  }
})