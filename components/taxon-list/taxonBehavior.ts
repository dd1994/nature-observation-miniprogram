import { fetchTaxonList } from "../../utils/service/taxon";

const computedBehavior = require('miniprogram-computed').behavior;

const TaxonBehavior = Behavior({
  behaviors: [computedBehavior],
  data: {
    taxon: [],
    taxonPageSize: 50,
    taxonPageIndex: 1,
    taxonTotal: 0,
    taxonIsEmpty: false,
    taxonLoading: true,
    q: {}
  },
  methods: {
    async fetchTaxonList() {
      this.setData({ taxonLoading: true })
      try {
        const res: any = await fetchTaxonList({ pageIndex: this.data.taxonPageIndex, pageSize: this.data.taxonPageSize, needLogin: this.data.needLogin, user_id: this.data.user_id, q: this.data.q })

        this.setData({
          taxon: (this.data.taxon || []).concat(res?.data?.data?.list || []),
          taxonTotal: res?.data?.data?.total_count || 0
        })
        if (!this.data.taxon.length && (this.data.taxonPageIndex === 1)) {
          this.setData({ taxonIsEmpty: true })
        } else {
          this.setData({ taxonIsEmpty: false })
        }
      } catch (error) {

      } finally {
        this.setData({ taxonLoading: false })
      }
    },
    resetAndFetchTaxon() {
      this.setData({
        taxonPageIndex: 1,
        taxon: []
      })
      return this.fetchTaxonList()
    },
  },
  // @ts-ignore
  computed: {
    taxonAllLoaded(data) {
      return (data.taxon.length === data.taxonTotal) && (data.taxonLoading === false)
    }
  }
})

export default TaxonBehavior