const uploadOSS = require("../../utils/uploadOSS");
var UUID = require("pure-uuid")

// pages/observation-create/observation-create.js
Page({
  data: {
    fileList: [],
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
        });
      },
      fail: (err) => {
        debugger
      }
    })

    // const task = wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
    //   filePath: file.url,
    //   name: 'file',
    //   formData: { user: 'test' },
    //   success: () => {
    //     this.setData({
    //       [`fileList[${length}].status`]: 'done',
    //     });
    //   },
    // });
    task.onProgressUpdate((res) => {
      const index = this.data.fileList.findIndex(i => i.key === uuid)

      this.setData({
        [`fileList[${index}].percent`]: res.progress,
      });
    });
  },
  handleRemove(e) {
    debugger
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
})