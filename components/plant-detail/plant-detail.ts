const computedBehavior = require('miniprogram-computed').behavior
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'
import { fetchPlantFrpsDetail, fetchPlantFocnDetail, fetchPlantFrpsPhoto } from '../../utils/service/plantApi'
import { removeRichTextTag } from '../../utils/util'

Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: {
      value: {}
    },
    taxonTree: {
      value: []
    }
  },
  computed: {
    taxonTreeTitle(data) {
      const taxonTree = data.taxonTree
      return '分类'

      if (taxonTree) {
        const rankList = selectLatest3LevelRank(data.taxon?.rank)
        return generateCombinedChineseNameFromRankList(rankList, data.taxonTree)
      } else {
        return '分类'
      }
    },
    frpsdesc(data) {
      return data.frpsContent?.frpsdesc || ''
    },
    frpsnolink(data) {
      return removeRichTextTag((data.frpsContent?.frpsnolink || '')).replace("PDF", "")
    },
    externalResource(data) {
      const encodedName = encodeURIComponent(data.taxon.name)
      return [
        {
          label: "PPBC",
          url: `https://ppbc.iplant.cn/list21?keyword=${encodedName}&sel=like`,
          desc: "超过1400万张植物图片，多数图片由专业人士提供，鉴定准确度较高。"
        },
        {
          label: "联盟图片",
          url: `https://image.cubg.cn/search?sort=default&text=${encodedName}&shitu=-1&taxonId=`,
          desc: '索引了全球320个主题网站的720万张图片，涵盖全球45万个物种，图片鉴定基本准确可靠。'
        }, {
          label: "CFH",
          url: `https://www.cfh.ac.cn/Spdb/spsearch.aspx?aname=${encodedName}`,
          desc: '超过2000万张用户上传的植物照片，以中国植物为主。拥有最全的植物中文别名数据库'
        }]
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    frpsContent: null, // 中国植物志
    focnContent: null // Flower  of China 翻译版
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchDetailFrpsDetail() {
      if (!this.data?.taxon?.name) {
        return
      }

      fetchPlantFrpsDetail({
        name: this.data.taxon.name
      }).then((res) => {
        if (res?.data?.data?.frpsdesc) {
          this.setData({
            frpsContent: res.data.data
          })
        }
        return res
      })
    },
    fetchPlantFocnDetail() {
      if (!this.data?.taxon?.name) {
        return
      }

      fetchPlantFocnDetail({
        name: this.data.taxon.name
      }).then((res) => {
        if (res?.data?.data) {
          this.setData({
            focnContent: res.data?.data
          })
        }
      })
    },
    previewFrpsPhoto() {
      wx.previewImage({
        urls: [this.data?.frpsContent?.photoUrl],
      })
    }
  },
  lifetimes: {
    attached() {
      this.fetchDetailFrpsDetail()
      this.fetchPlantFocnDetail()
    }
  }
})