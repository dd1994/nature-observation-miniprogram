import moment from 'moment'
import { fetchNotifyList, readNotify } from '../../../utils/service/notify'
moment.locale('zh-cn')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    notifyList: [],
    allNotifyLoaded: false,
  },
  onShow() {
    this.fetchNotifyList()
  },
  viewNotify(e) {
    readNotify(e.currentTarget.dataset.item.id)
  },
  fetchNotifyList() {
    fetchNotifyList().then((res: any) => {
      this.setData({
        allNotifyLoaded: true,
        notifyList: (res?.data || []).map(i => {
          return {
            ...i,
            created_at: moment(i.created_at).fromNow()
          }
        })
      })
    })
  }
})