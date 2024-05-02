import { fetchObservationList } from "../../utils/service/observations"
const computedBehavior = require('miniprogram-computed').behavior;

const ObservationsBehavior = Behavior({
  behaviors: [computedBehavior],
  data: {
    observations: [],
    observationsPageSize: 50,
    observationsPageIndex: 1,
    observationsTotal: 0,
    observationsIsEmpty: false,
    observationsIsLoading: false,
    q: {}
  },
  methods: {
    async fetchObservationList() {
      this.setData({ observationsIsLoading: true })
      try {
        const res: any = await fetchObservationList({ pageIndex: this.data.observationsPageIndex, pageSize: this.data.observationsPageSize, q: this.data.q, needLogin: this.data.needLogin, user_id: this.data.user_id })

        this.setData({
          observations: (this.data.observations || []).concat(res?.data?.data?.list || []),
          observationsTotal: res?.data?.data?.total_count || 0
        })
        if (!this.data.observations.length && (this.data.observationsPageIndex === 1)) {
          this.setData({ observationsIsEmpty: true })
        } else {
          this.setData({ observationsIsEmpty: false })
        }
      } catch (error) {

      } finally {
        this.setData({ observationsIsLoading: false })
      }
    },
    resetAndFetchObservations() {
      this.setData({
        observationsPageIndex: 1,
        observations: [],
      })
      return this.fetchObservationList()
    },
  },
  // @ts-ignore
  computed: {
    observationsAllLoaded(data) {
      return (data.observations.length === data.observationsTotal) && (data.observationsIsLoading === false)
    }
  }
})

export default ObservationsBehavior