const uploadOSS = require("../../utils/uploadOSS");
const {getOSSUrlByKey} = require("../../utils/util")
var UUID = require("pure-uuid")

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