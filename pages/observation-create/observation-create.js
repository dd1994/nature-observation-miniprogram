const uploadOSS = require("../../utils/uploadOSS");
import _ from 'lodash'
import { getOSSUrlByKey, formatExifGPSLongitude, formatExifGPSLatitude } from '../../utils/util'
const UUID = require("pure-uuid")
var EXIF = require('../../utils/libs/exif');
const computedBehavior = require('miniprogram-computed').behavior;
const { fetchAdressByGPS } = require("../../utils/qMap");
import { goToLocationSelector } from '../../utils/qMap'
const chooseLocation = requirePlugin('chooseLocation');
import { defaultTimeFormat, exifFormat } from '../../utils/constant'
import moment from 'moment'

// pages/observation-create/observation-create.js
Page({
  behaviors: [computedBehavior],
  data: {
    fileList: [],
    description: '',
    observedOn: moment().format(defaultTimeFormat),
    defaultTime: moment().format(defaultTimeFormat),
    timeSelectorVisible: false,
    location: null,
    artificial: false,
    taxon: null,
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
      return data?.location?.recommend_name || ''
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
  removeObservedOn() {
    this.setData({ observedOn: null })
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
    if (time && !this.data.observedOn) {
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
              recommend_name: result.formatted_addresses.recommend,
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
  openTimePicker() {
    this.setData({ timeSelectorVisible: true })
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
          recommend_name: location.name,
          standard_address: location.address
        }
      })
    }
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    debugger
    chooseLocation.setLocation(null);
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
    const basicInfo = {
      user_id: 1, // 测试，先写死 1
      description: this.data.description,
      observed_on: this.data.observedOn,
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

    const params = {
      fileList: this.data.fileList,
      ...basicInfo,
      ...this.data.location,
      ...taxonInfo,
      ...otherInfo
    }

    wx.request({
      url: 'http://127.0.0.1:7001/api/v1/observations',
      method: 'POST',
      data: params,
      success: (res) => {
        debugger
      },
      error: (err) => {
        debugger
      }
    })
  }
})