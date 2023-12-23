const uploadOSS = require("../../utils/uploadOSS");
const { getOSSUrlByKey } = require("../../utils/util")
const UUID = require("pure-uuid")
var EXIF = require('../../utils/libs/exif');
const computedBehavior = require('miniprogram-computed').behavior;
const { fetchAdressByGPS } = require("../../utils/qMap");
import { goToLocationSelector } from '../../utils/qMap'
const chooseLocation = requirePlugin('chooseLocation');
// pages/observation-create/observation-create.js
Page({
  behaviors: [computedBehavior],
  data: {
    fileList: [],
    note: '',
    time: '',
    timeSelectorVisible: false,
    address: null,
    addressVisible: '',
    artificial: false,
    taxon: null,
    gridConfig: {
      column: 3,
      width: 200,
      height: 200
    }
  },
  computed: {
    formattedLatitude(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      if (data.address?.GPSLatitude?.length) {
        const value = (data.address?.GPSLatitude[0] + (data.address?.GPSLatitude[1] / 60) + (data.address?.GPSLatitude[2] / 3600)).toFixed(6)
        const ref = data.address?.GPSLatitudeRef === 'N' ? 1 : -1
        return ref * value
      }
    },
    formattedLongitude(data) {
      if (data.address?.GPSLongitude?.length) {
        const value = (data.address?.GPSLongitude[0] + (data.address?.GPSLongitude[1] / 60) + (data.address?.GPSLongitude[2] / 3600)).toFixed(6)
        const ref = data.address?.GPSLongitudeRef === 'E' ? 1 : -1
        return ref * value
      }
    },
    formattedAddress(data) {
      debugger
      return data?.address?.qMapInfo?.formatted_addresses?.recommend
    }
  },
  goToSearchLocation() {
    goToLocationSelector({
      lat: this.data.formattedLatitude,
      lng: this.data.formattedLongitude
    })
  },
  noteChange(e) {
    this.setData({ note: e.detail.value })
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
    if (time && !this.time) {
      this.setData({
        time: time
      })
      file.metaData.time = time
    }

    if (exifInfo?.data?.GPSLatitude && !this.address) {
      const GPSInfo = {
        // 参考文档 https://exiftool.org/TagNames/GPS.html
        GPSLatitude: exifInfo?.data?.GPSLatitude,
        GPSLatitudeRef: exifInfo?.data?.GPSLatitudeRef,
        GPSLongitude: exifInfo?.data?.GPSLongitude,
        GPSLongitudeRef: exifInfo?.data?.GPSLongitudeRef,
      }
      file.metaData.gpsInfo = GPSInfo
      this.setData({ address: GPSInfo })
      fetchAdressByGPS({ lng: this.data.formattedLongitude, lat: this.data.formattedLatitude }).then(res => {
        this.setData({
          address: {
            ...this.data.address,
            qMapInfo: res.data.result
          }
        })
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
  timeChange(e) {
    this.setData({ time: e.detail.value })
  },
  addressVisibleChange(e) {
    this.setData({ addressVisible: e.detail.checked })
  },
  artificialChange(e) {
    this.setData({ artificial: e.detail.checked })
  },
  // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    debugger
    if (location?.latitude) {
      debugger
      fetchAdressByGPS({ lng: location.longitude, lat: location.latitude }).then(res => {
        this.setData({
          address: {
            ...this.data.address,
            qMapInfo: res.data.result
          }
        })
      }).catch(err => {
      })
    }
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
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
  }
})