import { apiDomain } from "../../utils/constant"
import { requestPromise } from "../../utils/util"

// components/remote-rich-text/remote-rich-text.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
      required: true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    richText: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchRichText() {
      return requestPromise({
        url: apiDomain + '/rich-text/' + this.data.url
      }).then(res => {
        this.setData({
          richText: res.data.data
        })
      })
    }
  },

  lifetimes: {
    attached() {
      this.fetchRichText()
    }
  }
})