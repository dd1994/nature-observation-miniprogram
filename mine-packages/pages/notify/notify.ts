import moment from 'moment'
import { fetchNotifyList, readNotify } from '../../../utils/service/notify'
moment.locale('zh-cn')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    notifyList: [],
  },
  onShow() {
    this.fetchNotifyList()
  },
  onLoad() {
  },
  viewNotify(e) {
    readNotify(e.currentTarget.dataset.item.id)
  },
  fetchNotifyList() {
    fetchNotifyList().then((res: any) => {
      this.setData({
        notifyList: res?.data || []
      })
    })
  }
})