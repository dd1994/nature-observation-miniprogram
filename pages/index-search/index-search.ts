import _ from 'lodash';
import ObservationsBehavior from '../../components/observation-list/observationBehavior';
import { validRankList } from '../../components/taxon-tree/util';
import UserProfileBehavior from '../../components/user-profile/user-profile';
import { fetchObservationList } from '../../utils/service/observations';

Page({
  behaviors: [UserProfileBehavior, ObservationsBehavior],
  data: {
    inputWords: '',
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
})