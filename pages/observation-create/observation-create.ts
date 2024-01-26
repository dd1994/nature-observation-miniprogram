const uploadOSS = require("../../utils/service/uploadOSS");
import _ from 'lodash'
import { getOSSUrlByKey, formatExifGPSLongitude, formatExifGPSLatitude } from '../../utils/util'
const UUID = require("pure-uuid")
var EXIF = require('../../utils/libs/exif');
const computedBehavior = require('miniprogram-computed').behavior;
import { goToLocationSelector, fetchAdressByGPS } from '../../utils/service/qMap'
const chooseLocation = requirePlugin('chooseLocation');
import { defaultTimeFormat, exifFormat } from '../../utils/constant'
import moment from 'moment'
import { fetchObservationDetail, createObservation, deleteObservation, updateObservation } from '../../utils/service/observations'
import { showErrorTips } from '../../utils/feedBack';

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
  handleAdd(e) {
    const { files } = e.detail;
    files.forEach(file => this.uploadFile(file))
  },
  uploadFile(file) {
    const uuid = (new UUID(1)).toString()
    const { fileList } = this.data;
    file.metaData = {}
    const array = wx.getFileSystemManager().readFileSync(file.url);

    var exifInfo = JSON.parse(JSON.stringify(EXIF.handleBinaryFile(array)));

    const time = exifInfo?.data?.DateTime
    if (time) {
      this.setData({
        observedOn: moment(time, exifFormat).format(defaultTimeFormat)
      })
      file.metaData.time = time
    }

    if (exifInfo?.data?.GPSLatitude && !this.location) {
      const GPSInfo = {
        // 参考文档 https://exiftool.org/TagNames/GPS.html
        GPSLatitude: exifInfo?.data?.GPSLatitude,
        GPSLatitudeRef: exifInfo?.data?.GPSLatitudeRef,
        GPSLongitude: exifInfo?.data?.GPSLongitude,
        GPSLongitudeRef: exifInfo?.data?.GPSLongitudeRef,
      }
      file.metaData.gpsInfo = GPSInfo
      fetchAdressByGPS({
        lng: formatExifGPSLongitude(GPSInfo.GPSLongitude, GPSInfo.GPSLongitudeRef),
        lat: formatExifGPSLatitude(GPSInfo.GPSLatitude, GPSInfo.GPSLatitudeRef)
      }).then(res => {
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
              latitude: result.location.lat,
              // 经度
              longitude: result.location.lng,
              // 展示地址
              recommend_address_name: result.formatted_addresses.recommend,
              // 省
              province: result.address_component.province,
            }
          })
        }
      }).catch(err => {
      })
    }
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

      }
    })

    task.onProgressUpdate((res) => {
      const index = this.data.fileList.findIndex(i => i.key === uuid)

      this.setData({
        [`fileList[${index}].percent`]: res.progress,
      });
    });

  },
  upload() {
    wx.chooseMedia({
      mediaType: 'mix',
      maxDuration: 60,
      success: (res) => {
        const tempFilePaths = res.tempFiles.map(file => {
          return {
            key: (new UUID(1)).toString(),
            filePath: file.tempFilePath
          }
        })
        uploadOSS(tempFilePaths)
      },
      fail: () => {
      }
    })
  },
  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
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
    fetchObservationDetail(this.data.id).then(res => {
      const data = res?.data?.[0]
      if (!data) {
        showErrorTips("获取数据失败")
      }
      this.setData({
        description: data.description,
        observedOn: moment(data.observed_on).format(defaultTimeFormat),
        "artificial": !!data.artificial,
        location: {
          "latitude": data.latitude,
          "longitude": data.longitude,
          "province": data.province,
          "city": data.city,
          "district": data.district,
          "recommend_address_name": data.recommend_address_name,
          "standard_address": data.standard_address,
        },
        taxon: {
          "preferred_common_name": data.common_name,
          "common_name": data.common_name,
          "name": data.scientific_name,
          "rank": data.taxon_rank,
          "iconic_taxon_name": data.iconic_taxon_name,
          "id": data.taxon_id,
        },
        fileList: data.photos.map(i => {
          return {
            url: i.url,
            key: i.key,
            type: 'image',
            status: 'done'
          }
        })
      })
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
    if (!this.data.taxon) {
      wx.showToast({
        title: '请选择物种',
        icon: 'none'
      })
    }
    const basicInfo = {
      description: this.data.description,
      observed_on: moment(this.data.observedOn, defaultTimeFormat).format('x'),
      artificial: this.data.artificial
    }
    const taxonInfo = {
      common_name: this.data.taxon.preferred_common_name,
      scientific_name: this.data.taxon.name,
      taxon_rank: this.data.taxon.rank,
      iconic_taxon_name: this.data.taxon.iconic_taxon_name,
      taxon_id: this.data.taxon.id
    }

    const otherInfo = {
      license: null
    }

    const locationInfo = {
      'latitude': this.data.location?.latitude || null,
      'longitude': this.data.location?.longitude || null,
      'province': this.data.location?.province || null,
      'city': this.data.location?.city || null,
      'district': this.data.location?.district || null,
      "recommend_address_name": this.data.location?.recommend_address_name || null,
      "standard_address": this.data.location?.standard_address || null,
    }

    const params = {
      fileList: this.data.fileList,
      ...basicInfo,
      ...locationInfo,
      ...taxonInfo,
      ...otherInfo
    }

    const fn = this.data.isEdit ? updateObservation : createObservation
    fn(params, this.data.id).then(res => {
      if (res?.data?.success) {
        wx.showToast({
          title: '保存成功',
        })
        setTimeout(() => {
          this.goToIndexAndRefresh()
        }, 1000)
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },
  delete() {
    wx.showModal({
      title: '',
      content: '确认删除这条记录吗',
      confirmText: '确认删除',
      complete: (res) => {
        if (res.confirm) {
          deleteObservation(this.data.id).then(res => {
            wx.showToast({
              title: res?.data?.success ? '删除成功' : '删除失败',
              icon: 'none'
            })
          }).catch(err => {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
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