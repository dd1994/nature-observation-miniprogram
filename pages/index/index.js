import { fetchObservationList } from '../../utils/restful/observations'

Component({
  data: {
    observations: [],
    limit: 20,
    offset: 0,
  },
  methods: {
    fetchObservations() {
      fetchObservationList().then(res => {
        this.setData({
          observations: res.data
        })
      })
    },
    onAddIconTap() {
      wx.navigateTo({
        url: "/pages/observation-create/observation-create",

      })
    }
  },
  created() {
    this.fetchObservations()
  },
  onShow() {
    this.fetchObservations()
  }
})
