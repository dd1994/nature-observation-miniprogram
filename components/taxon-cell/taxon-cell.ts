import { openTaxonDetail } from '../../utils/openTaxonDetail'

Component({
  properties: {
    taxon: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    openTaxonDetail() {
      openTaxonDetail({
        name: this.data.taxon.scientific_name,
        rank: this.data.taxon.taxon_rank,
        iconic_taxon_name: this.data.taxon.iconic_taxon_name,
        id: this.data.taxon.taxon_id
      })
    },
  },
})