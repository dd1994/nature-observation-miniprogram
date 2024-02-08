import { fetchObservationList } from "../../utils/service/observations"
const computedBehavior = require('miniprogram-computed').behavior;

const ObservationsBehavior = Behavior({
  behaviors: [computedBehavior],
  data: {
    observations: [],
    pageSize: 20,
    pageIndex: 1,
    total: 0,
    isEmpty: false,
    loading: true,
  },
  methods: {
    async fetchObservationList() {
      this.setData({
        loading: true,
      })
      const res = await fetchObservationList({ pageIndex: this.data.pageIndex, pageSize: this.data.pageSize })

      this.setData({
        observations: (this.data.observations || []).concat(res?.data?.data?.list || []),
        total: res?.data?.data?.total_count || 0
      })
      if (!this.data.observations.length && (this.pageIndex === 1)) {
        this.setData({
          isEmpty: true
        })
      } else {
        this.setData({
          isEmpty: false
        })
      }
    },
    resetAndFetchObservations() {
      this.setData({
        pageIndex: 1,
        observations: []
      })
      this.fetchObservationList()
    },
  },
  // @ts-ignore
  computed: {
    allLoaded(data) {
      return data.observations.length === data.total
    }
  }
})

export default ObservationsBehavior