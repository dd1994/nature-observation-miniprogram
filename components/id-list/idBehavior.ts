import { fetchIndexIdList } from "../../utils/service/identifications";

const computedBehavior = require('miniprogram-computed').behavior;

const IdBehavior = Behavior({
  behaviors: [computedBehavior],
  data: {
    ids: [],
    idPageSize: 20,
    idPageIndex: 1,
    idTotal: 0,
    idIsEmpty: false,
    idLoading: true,
    q: {}
  },
  methods: {
    async fetchIndexIdList() {
      this.setData({ idLoading: true })
      try {
        const res: any = await fetchIndexIdList({ pageIndex: this.data.idPageIndex, pageSize: this.data.idPageSize, user_id: this.data.user_id, q: this.data.q })

        this.setData({
          ids: (this.data.ids || []).concat(res?.data?.data?.list || []),
          idTotal: res?.data?.data?.total_count || 0
        })
        if (!this.data.ids.length && (this.data.idPageIndex === 1)) {
          this.setData({ idIsEmpty: true })
        } else {
          this.setData({ idIsEmpty: false })
        }
      } catch (error) {

      } finally {
        this.setData({ idLoading: false })
      }
    },
    resetAndFetchIndexId() {
      this.setData({
        idPageIndex: 1,
        ids: []
      })
      return this.fetchIndexIdList()
    },
  },
  // @ts-ignore
  computed: {
    idAllLoaded(data) {
      return (data.ids.length === data.idTotal) && (data.idLoading === false)
    }
  }
})

export default IdBehavior