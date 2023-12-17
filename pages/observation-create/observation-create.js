const uploadOSS = require("../../utils/uploadOSS");
const {getOSSUrlByKey} = require("../../utils/util")
const UUID = require("pure-uuid")
var EXIF = require('../../utils/exif');
const computedBehavior = require('miniprogram-computed').behavior

// pages/observation-create/observation-create.js
Page({
  behaviors: [computedBehavior],
  data: {
    fileList: [],
    note: '',
    time: '',
    timeSelectorVisible: false,
    address: null,
    taxon: '',
    addressVisible: '',
    artificial: false,
    gridConfig: {
      column: 3,
      width: 200,
      height: 200
    }
  },
  computed: {
    formattedLatitude(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      // 这个函数的返回值会被设置到 this.data.sum 字段中
      if(data.address?.GPSLatitude) {
        return `${data.address?.GPSLatitude[0]}°${data.address?.GPSLatitude[1]}'${data.address?.GPSLatitude[2]}"${data.address?.GPSLatitudeRef}`
      }
    },
    formattedLongitude(data) {
      if(data.address?.GPSLongitude) {
        return `${data.address?.GPSLongitude[0]}°${data.address?.GPSLongitude[1]}'${data.address?.GPSLongitude[2]}"${data.address?.GPSLongitudeRef}`
      }
    },
    formattedAltitude(data) {
      if(data.address?.GPSAltitude) {
        const prefix = data.address.GPSAltitudeRef === 0 ? '' : '-'
        return `${prefix}${Math.floor(data.address?.GPSAltitude)}米`
      }
    }
  },
  noteChange(e) {
    this.setData({note: e.detail.value})
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
      if(time && !this.time) {
        this.setData({
          time: time
       })
       file.metaData.time = time
      }

      if(exifInfo?.data?.GPSLatitude && !this.address) {
        const GPSInfo = {
          // 参考文档 https://exiftool.org/TagNames/GPS.html
           GPSLatitude: exifInfo?.data?.GPSLatitude,
           GPSLatitudeRef: exifInfo?.data?.GPSLatitudeRef,
           GPSLongitude: exifInfo?.data?.GPSLongitude,
           GPSLongitudeRef: exifInfo?.data?.GPSLongitudeRef,
           GPSAltitude: exifInfo?.data?.GPSAltitude,
           GPSAltitudeRef: exifInfo?.data?.GPSAltitudeRef,
        }
        file.metaData.gpsInfo = GPSInfo
        this.setData({address: GPSInfo})
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
          debugger
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
      success: (res)=>{
        const tempFilePaths = res.tempFiles.map(file => {
          return {
            key: (new UUID(1)).toString(),
            filePath: file.tempFilePath
          }
        })
        uploadOSS(tempFilePaths)
      },
      fail: () => {
        debugger
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
    this.setData({timeSelectorVisible: true})
  },
  timeChange(e) {
    this.setData({time: e.detail.value})
  },
  addressVisibleChange(e) {
    this.setData({addressVisible: e.detail.checked})
  },
  artificialChange(e) {
    this.setData({artificial: e.detail.checked})
  }
})