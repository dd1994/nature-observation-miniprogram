import _ from 'lodash'
import { getOSSUrlByKey, formatExifGPSLongitude, formatExifGPSLatitude } from '../../utils/util'
const UUID = require("pure-uuid")
const computedBehavior = require('miniprogram-computed').behavior;
import { goToLocationSelector, fetchAdressByGPS, translateGPS } from '../../utils/service/qMap'
const chooseLocation = requirePlugin('chooseLocation');
import { defaultTimeFormat, exifTimeFormat } from '../../utils/constant'
import moment from 'moment'
import { fetchObservationDetail, createObservation, deleteObservation, updateObservation } from '../../utils/service/observations'
import { showErrorTips, showSuccessTips } from '../../utils/feedBack';
import { generateDataFromRes, generateSaveParamsFromData } from './util';
import { parseExifFromLocalImgUrl } from '../../utils/exif-util';
import uploadOSS from '../../utils/service/uploadOSS';
const app = getApp()
Page({
  behaviors: [computedBehavior],
  data: {
    id: null, // 编辑状态的观察 id
    fileList: [], // 上传的图片列表
    description: '', // 备注
    observedOn: moment().format(defaultTimeFormat), // 观察时间
    location: null, // 观察地址信息
    artificial: false, // 是否人工圈养或栽培
    taxon: null, // 观察物种
    uploadConfig: {
      sourceType: ['album']
    },
    gridConfig: {
      column: 3,
      width: 200,
      height: 200
    }
  },
  computed: {
    displayLocationName(data) {
      return data?.location?.recommend_address_name || ''
    },
    isEdit(data) {
      return !!data.id
    }
  },
  goToSearchLocation() {
    goToLocationSelector({
      lat: this.data.location?.latitude,
      lng: this.data.location?.longitude
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
      success: (res) => {
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
        const res: any = await fetchAdressByGPS({ lng, lat })
        const result = res?.data?.result

        if (result) {
          this.setData({
            location: {
              // 标准地址
              standard_address: result.formatted_addresses.standard_address,
              // 市
              city: result.address_component.city,
              // 区/县
              district: result.address_component.district,
              // 维度
              latitude: lat,
              // 经度
              longitude: lng,
              // 展示地址
              recommend_address_name: result.formatted_addresses.recommend,
              // 省
              province: result.address_component.province,
            }
          })
        }
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
  artificialChange(e) {
    this.setData({ artificial: e.detail.checked })
  },
  onShow() {
    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location?.latitude) {
      this.setData({
        location: {
          ..._.pick(location, ['latitude', 'longitude', 'province', 'city', 'district']),
          recommend_address_name: location.name,
          standard_address: location.address
        }
      })
    }
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },
  onLoad(options) {
    if (options.id) {
      // 编辑状态
      this.setData({ id: options.id })
      this.fetchObservationDetail()
    }
  },
  fetchObservationDetail() {
    fetchObservationDetail(this.data.id).then((res: any) => {
      const data = res?.data?.[0]
      if (!data) {
        showErrorTips("获取数据失败")
      }
      this.setData(generateDataFromRes(data))
    })
  },
  goToSearch() {
    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker',
      events: {
        backFromSearchPage: (taxon) => {
          this.setData({
            taxon: taxon
          })
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

    const params = generateSaveParamsFromData(this.data)

    const fn = this.data.isEdit ? updateObservation : createObservation
    fn(params, this.data.id).then((res: any) => {
      if (res?.data?.success) {
        showSuccessTips('保存成功')
        setTimeout(() => {
          this.goToIndexAndRefresh()
        }, 1000)
      } else {
        showErrorTips('保存失败，请稍后重试')
      }
    }).catch(err => {
      console.error(err)
      showErrorTips('保存失败，请稍后重试')
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
          }).catch(err => {
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

    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})