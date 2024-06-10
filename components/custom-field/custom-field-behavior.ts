import { fetchCustomFieldConfig } from "../../utils/service/customField";

const computedBehavior = require('miniprogram-computed').behavior;

export const CustomFieldBehavior = Behavior({
  behaviors: [computedBehavior],
  data: {
    customFieldConfig: [],
    customFieldValue: [],
  },
  // @ts-ignore
  computed: {
    validCustomFieldValue(data) {
      // 有效的自定义字段值，比如将一个鉴定的物种从昆虫改成植物后，“生活史阶段” 这个字段不再有效。
      return data.customFieldValue
        .filter(i => data.customFieldConfig.find(j => j.id === i.id))
    },
    customFieldValueDisplayList(data) {
      return data.validCustomFieldValue
        .map(i => {
          const item = data.customFieldConfig.find(j => j.id === i.id)
          return {
            ...item,
            ...i,
          }
        })
    }
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
  },
})