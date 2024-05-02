import _ from 'lodash';
import ObservationsBehavior from '../../components/observation-list/observationBehavior';
import UserProfileBehavior from '../../components/user-profile/user-profile';

Page({
  behaviors: [UserProfileBehavior, ObservationsBehavior],
  data: {
    inputWords: '',
    needLogin: false,
  },
  searchWords: _.throttle(function (e) {
    // 请求接口
    this.setData({
      inputWords: e.detail.value,
      q: { common_name: e.detail.value }
    })
    if (!this.data.inputWords.length) {
      return this.setData({ observations: [] })
    }
    this.resetAndFetchObservations()
  }, 2000),
  bindscrolltolower() {
    if (this.data.observationsAllLoaded) {
      return
    }
    this.setData({
      observationsPageIndex: this.data.observationsPageIndex + 1
    })
    this.fetchObservationList()
  },
  onLoad(options) {
    if (options.needLogin) {
      this.setData({
        needLogin: true
      })
    }
  }
})