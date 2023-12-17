const uploadOSS = require("../../utils/uploadOSS");
const {getOSSUrlByKey} = require("../../utils/util")
const UUID = require("pure-uuid")
var myexif = require('../../utils/exif');

// pages/observation-create/observation-create.js
Page({
  data: {
    fileList: [],
    note: '',
    time: '',
    timeSelectorVisible: false,
    address: '',
    taxon: '',
    addressVisible: '',
    artificial: false,
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
    wx.getImageInfo({
      src: file.url,
    }).then((res) => {
      file.metaData = res
      var array = wx.getFileSystemManager().readFileSync(file.url);;

      var res = myexif.handleBinaryFile(array);
      const GPSLatitude = res?.data?.GPSLatitude
      const GPSLongitude = res?.data?.GPSLongitude
      wx.showModal({
        title: '',
        content: JSON.stringify(res),
      })
      if(GPSLatitude) {
        file.metaData.GPSLatitude = GPSLatitude
        file.metaData.GPSLongitude = GPSLongitude
        this.setData({address: [GPSLatitude, GPSLongitude]})
      }

    }).then(() => {
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
    })
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