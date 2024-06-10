import { showErrorTips } from "../../utils/feedBack";

const computedBehavior = require('miniprogram-computed').behavior;

Component({
  behaviors: [computedBehavior],
  properties: {
    customFieldConfig: {
      type: Array,
      value: []
    },
    customFieldValue: {
      type: Array,
      value: []
    }
  },
  data: {
  },
  // @ts-ignore
  computed: {
    validCustomFieldValue(data) {
      // 有效的自定义字段值，比如将一个鉴定的物种从昆虫改成植物后，“生活史阶段” 这个字段不再有效。
      return data.customFieldValue
        .filter(i => data.customFieldConfig.find(j => j.id === i.customFieldConfigId))
    },
    customFieldValueDisplayList(data) {
      return data.validCustomFieldValue
        .map(i => {
          const item = data.customFieldConfig.find(j => j.id === i.customFieldConfigId)
          return {
            ...item,
            ...i,
          }
        })
    }
  },
  methods: {
    bindCustomFieldItemChange(e) {
      const selectId = this.data.customFieldConfig?.[e.detail.value]?.id
      if (selectId) {
        const exist = this.data.customFieldValue?.find(i => i.customFieldConfigId === selectId)
        if (exist) {
          return showErrorTips('请勿重复选择')
        }
        this.triggerEvent('customFieldValueChange',
          this.data.customFieldValue.concat({
            customFieldConfigId: selectId,
            value: null,
            extra: null
          }))
      }
    },
    removeCustomItem(e) {
      this.triggerEvent('customFieldValueChange', (this.data.customFieldValue || [])
        .filter(i => i.customFieldConfigId !== e.currentTarget.dataset.id)
      )
    },
    bindCustomFieldValueChange(e) {
      const index = e.detail.value
      const customFieldId = e.currentTarget.dataset.id

      const valueItemIndex = this.data.customFieldValue?.findIndex(i => i.customFieldConfigId === customFieldId)
      const configItem = this.data.customFieldConfig?.find(i => i.id === customFieldId)
      this.triggerEvent('customFieldValueChange', (this.data.customFieldValue || []).map((item, i) => {
        if (i === valueItemIndex) {
          return {
            ...item,
            value: configItem?.config?.options?.[index]?.value
          }
        } else {
          return item
        }
      }))
    },
    customFieldValueGoToSearchTaxon(e) {
      const customFieldId = e.currentTarget.dataset.id
      const valueItemIndex = this.data.customFieldValue?.findIndex(i => i.customFieldConfigId === customFieldId)

      wx.navigateTo({
        url: '/pages/taxon-picker/taxon-picker',
        events: {
          backFromSearchPage: (taxon) => {
            this.triggerEvent('customFieldValueChange', (this.data.customFieldValue || []).map((item, i) => {
              if (i === valueItemIndex) {
                return {
                  ...item,
                  value: taxon.id,
                  extra: { taxon }
                }
              } else {
                return item
              }
            }))
          }
        }
      })
    },
  }
})