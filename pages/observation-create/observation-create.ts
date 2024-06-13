import _ from 'lodash'
import { getOSSUrlByKey, formatExifGPSLongitude, formatExifGPSLatitude } from '../../utils/util'
const UUID = require("pure-uuid")
const computedBehavior = require('miniprogram-computed').behavior;
import { fetchAdressByGPS, translateGPS } from '../../utils/service/map'
import { defaultTimeFormat, exifTimeFormat } from '../../utils/constant'
import moment from 'moment'
import { fetchObservationDetail, createObservation, deleteObservation, updateObservation } from '../../utils/service/observations'
import { showErrorTips, showSuccessTips } from '../../utils/feedBack';
import { generateDataFromRes, generateSaveParamsFromData, mapFileList } from './util';
import { parseExifFromLocalImgUrl } from '../../utils/exif-util';
import uploadOSS from '../../utils/service/uploadOSS';
import { fetchCustomFieldConfig } from '../../utils/service/customField';
import { CustomFieldBehavior } from '../../components/custom-field/custom-field-behavior';

const locationExpirationKey = 'location_expiration'
const locationKey = 'location'

const app = getApp()
Page({
  behaviors: [computedBehavior, CustomFieldBehavior],
  data: {
    id: null, // 编辑状态的观察 id
    fileList: [], // 上传的图片列表
    description: '', // 备注
    observedOn: moment().format(defaultTimeFormat), // 观察时间
    location: null, // 观察地址信息
    captive_cultivated: false, // 是否人工圈养或栽培
    address_hidden: false,
    taxon: null, // 观察物种
    originTaxonName: null, // 用来保存从服务端获取的物种，编辑时会用到，如果修改了，会生成一条新的鉴定记录
    notSelectedTaxonTips: false,
    noticeBarVisible: false,
    isSaving: false,
    tUploadConfig: {
      uploadConfig: {
        sourceType: ['album'],
        sizeType: ['original']
      },
    }
  },
  computed: {
    displayLocationName(data) {
      return data?.location?.recommend_address_name || ''
    },
    isEdit(data) {
      return !!data.id
    },
    taxonChanged(data) {
      return data.isEdit && (data.originTaxonName !== data.taxon?.name)
    }
  },
  noticeBarClick() {
    this.setData({
      noticeBarVisible: false,
    })
    wx.setStorage({
      key: 'noticeBarVisible',
      data: false,
    })
  },
  goToSearchLocation() {
    wx.chooseLocation({
      latitude: this.data.location?.latitude,
      longitude: this.data.location?.longitude
    }).then((location) => {
      if (location?.latitude) {
        // 因为 wx.chooseLocation 没有返回省市县信息，所以需要用这个接口去获取一下。
        this.fetchAndSetAddresByGPS({
          lat: location?.latitude,
          lng: location?.longitude,
        }).then(() => {
          const locationDetail = location.address ? `(${location.address})` : ''
          const locationData = {
            ...this.data.location,
            recommend_address_name: location?.name + locationDetail,
          }
          this.setData({
            location: locationData
          })

          if (!this.data.isEdit) {
            var expiration = Date.now() + 3 * 60 * 60 * 1000; // 为 iOS 用户设置观察位置缓存 3 小时
            wx.setStorage({
              key: locationExpirationKey,
              data: expiration,
            });

            wx.setStorage({
              key: locationKey,
              data: locationData,
            })
          }
        })
      }
    })
  },
  removeLocation() {
    this.setData({ location: null })
  },
  descriptionChange(e) {
    this.setData({ description: e.detail.value })
  },
  onAddUploadFiles(e) {
    const { files } = e.detail;
    files.forEach(file => this.uploadFile(file))
  },
  uploadFile(file) {
    const uuid = (new UUID(1)).toString()
    const { fileList } = this.data;
    this.setData({
      fileList: [...fileList, { ...file, key: uuid, status: 'loading' }],
    });

    const task = uploadOSS({
      filePath: file.url,
      key: uuid,
      success: () => {
        const index = this.data.fileList.findIndex(i => i.key === uuid)
        this.setData({
          [`fileList[${index}].status`]: 'done',
          [`fileList[${index}].url`]: getOSSUrlByKey(uuid),
        });
      },
      fail: (err) => {
        showErrorTips('图片上传失败，请稍后重试')
        console.error(err)
      }
    })

    task.onProgressUpdate((res) => {
      const index = this.data.fileList.findIndex(i => i.key === uuid)
      this.setData({
        [`fileList[${index}].percent`]: res.progress,
      });
    });

    this.setTimeAndLocationFromParseImg(file.url)
  },
  async fetchAndSetAddresByGPS({ lng, lat }) {
    const res: any = await fetchAdressByGPS({ lng, lat })
    const result = res?.data?.regeocode
    if (result) {
      this.setData({
        location: {
          // 市，如果是直辖市，为空
          city: result.addressComponent.city,
          // 区/县
          district: result.addressComponent.district,
          // 维度
          latitude: lat,
          // 经度
          longitude: lng,
          // 展示地址
          recommend_address_name: result.formatted_address,
          // 省
          province: result.addressComponent.province,
        }
      })
    }
  },

  async setTimeAndLocationFromParseImg(fileUrl) {
    const { time, GPSInfo } = parseExifFromLocalImgUrl(fileUrl)
    if (time) {
      this.setData({
        observedOn: moment(time, exifTimeFormat).format(defaultTimeFormat)
      })
    }

    if (GPSInfo && !this.data.location) {
      try {
        this.setData({
          location: {
            latitude: formatExifGPSLongitude(GPSInfo.GPSLongitude, GPSInfo.GPSLongitudeRef),
            longitude: formatExifGPSLatitude(GPSInfo.GPSLatitude, GPSInfo.GPSLatitudeRef),
          }
        })
        const { lng, lat } = await translateGPS({
          // @ts-ignore
          lng: formatExifGPSLongitude(GPSInfo.GPSLongitude, GPSInfo.GPSLongitudeRef),
          // @ts-ignore
          lat: formatExifGPSLatitude(GPSInfo.GPSLatitude, GPSInfo.GPSLatitudeRef)
        })

        this.fetchAndSetAddresByGPS({ lng, lat })
      } catch (error) {
        console.error(error)
      }
    }
  },
  onRemoveUploadFile(e) {
    const { index } = e.detail;
    const { fileList } = this.data;

    fileList.splice(index, 1);
    this.setData({ fileList });
  },
  observedOnChange(e) {
    this.setData({ observedOn: e.detail.value })
  },
  captiveCultivatedChange(e) {
    this.setData({ captive_cultivated: e.detail.checked })
  },
  toggleCaptiveCultivated() {
    this.setData({ captive_cultivated: !this.data.captive_cultivated })
  },
  addressHiddenChange(e) {
    this.setData({ address_hidden: e.detail.checked })
  },
  toggleAddressHidden() {
    this.setData({ address_hidden: !this.data.address_hidden })
  },
  onLoad(options) {
    if (options.id) {
      // 编辑状态
      this.setData({ id: options.id })
      this.fetchObservationDetail()
      this.fetchCustomFieldValue(options.id)
    }

    if (options.files) {
      try {
        const files = JSON.parse(decodeURIComponent(options.files)).map(file => {
          return mapFileList(file)
        })
        if (files.length) {
          files.forEach(file => this.uploadFile(file))
        }
      } catch (error) {

      }
    }

    const key = 'noticeBarVisible'
    const naticeBarVisible = wx.getStorageSync(key)
    if (naticeBarVisible === "") {
      this.setData({
        noticeBarVisible: true
      })
    }

    if (!options.id) {
      // 为 iOS 用户获取观察位置缓存，默认缓存三小时
      try {
        const deviceInfo = wx.getDeviceInfo()
        if (deviceInfo.platform.toLowerCase().includes('ios')) {
          wx.getStorage({ key: locationExpirationKey })
            .then(res => {
              if (Date.now() < res.data) {
                wx.getStorage({ key: locationKey })
                  .then(res2 => {
                    if (res2.data) {
                      this.setData({
                        location: res2.data
                      })
                    }
                  })
              }
            })
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  fetchObservationDetail() {
    fetchObservationDetail(this.data.id).then((res: any) => {
      const data = res?.data?.[0]
      if (!data) {
        showErrorTips("获取数据失败")
      }
      if (data.taxon_source !== 'CFH') {
        this.fetchCustomFieldConfig(data.taxon_id)
      }
      this.setData(generateDataFromRes(data))
    })
  },
  goToSearchTaxon() {
    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker',
      events: {
        backFromSearchPage: (taxon) => {
          this.setData({
            taxon: taxon
          })
          if (taxon.taxon_source === 'iNat') {
            this.fetchCustomFieldConfig(taxon.id)
          } else {
            this.setData({
              customFieldConfig: []
            })
          }
        }
      }
    })
  },
  save() {
    if (this.data.fileList?.find(i => i.status === 'loading')) {
      return showErrorTips('请等待图片上传完成后再保存')
    }

    if (this.data.fileList?.find(i => i.status !== 'done')) {
      return showErrorTips('部分图片上传失败，请尝试重新上传')
    }

    if (!this.data.fileList?.length) {
      return showErrorTips('请上传图片')
    }

    if (!this.data.taxon?.name) {
      this.setData({
        notSelectedTaxonTips: true,
      })
      return showErrorTips('请选择你看到了什么')
    }

    const params = generateSaveParamsFromData(this.data)

    const fn = this.data.isEdit ? updateObservation : createObservation

    this.setData({
      isSaving: true
    })

    fn(params, this.data.id).then((res: any) => {
      if (res?.data?.success) {
        showSuccessTips('保存成功')
        wx.setStorage({
          key: 'noticeBarVisible',
          data: false,
        })

        wx.setStorage({
          key: 'newComer',
          data: false
        })
        setTimeout(() => {
          if (this.data.isEdit) {
            wx.redirectTo({
              url: `/pages/observation-detail/observation-detail?id=${this.data.id}`
            })
          } else {
            this.goToIndexAndRefresh()
          }
        }, 1000)
      } else {
        showErrorTips('保存失败，请稍后重试')
      }
    }).catch(err => {
      console.error(err)
      showErrorTips('保存失败，请稍后重试')
      // @ts-ignore
    }).finally(() => {
      this.setData({
        isSaving: false
      })
    })
  },
  delete() {
    wx.showModal({
      title: '',
      content: '确认删除这条记录吗',
      confirmText: '确认删除',
      complete: (res: any) => {
        if (res.confirm) {
          deleteObservation(this.data.id).then((res: any) => {
            wx.showToast({
              title: res?.data?.success ? '删除成功' : '删除失败',
              icon: 'none'
            })
          }).catch(() => {
            showErrorTips('删除失败，请稍后重试')
          }).then(() => {
            setTimeout(() => {
              this.goToIndexAndRefresh()
            }, 1000)
          })
        }
      }
    })
  },
  goToIndexAndRefresh() {
    app.globalData.indexPageNeedRefresh = true
    app.globalData.explorePageNeedRefresh = true

    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  customFieldValueChange(e) {
    this.setData({
      customFieldValue: e.detail.value
    })
  },
  gotoAiTools() {
    wx.navigateTo({
      url: '/mine-packages/pages/ai-tools/ai-tools'
    })
  }
})