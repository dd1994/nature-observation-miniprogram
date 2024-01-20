import { fetchObservationExploreList, fetchObservationList } from "../../utils/service/observations"

Component({
  data: {
    observations: [],
    limit: 20,
    offset: 0,
  },
  methods: {
    fetchObservations() {
      fetchObservationExploreList().then(res => {
        this.setData({
          observations: res?.data?.data || []
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
})
