import { fetchCustomFieldConfig, fetchCustomFieldValue } from "../../utils/service/customField";

const computedBehavior = require('miniprogram-computed').behavior;

export const CustomFieldBehavior = Behavior({
  behaviors: [computedBehavior],
  data: {
    customFieldConfig: [],
    customFieldValue: [],
  },
  // @ts-ignore
  computed: {
  },
  methods: {
    fetchCustomFieldConfig(taxon_id) {
      if (taxon_id) {
        fetchCustomFieldConfig(taxon_id).then(res => {
          this.setData({
            // @ts-ignore
            customFieldConfig: (res?.data || []).map(i => {
              if (i.config) {
                return {
                  ...i,
                  config: JSON.parse(i.config)
                }
              } else {
                return i
              }
            })
          })
        }).catch(() => {
          this.setData({
            customFieldConfig: []
          })
        })
      } else {
        this.setData({
          customFieldConfig: []
        })
      }
    },
    fetchCustomFieldValue(observation_id) {
      if (observation_id) {
        fetchCustomFieldValue(observation_id).then(res => {
          this.setData({
            // @ts-ignore
            customFieldValue: (res?.data || []).map(i => {
              if (i.extra) {
                return {
                  ...i,
                  extra: JSON.parse(i.extra)
                }
              } else {
                return i
              }
            })
          })
        }).catch(() => {
          this.setData({
            customFieldConfig: []
          })
        })
      } else {
        this.setData({
          customFieldConfig: []
        })
      }
    },
  },
})