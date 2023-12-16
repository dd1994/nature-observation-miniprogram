const host = 'https://observation-images.oss-cn-beijing.aliyuncs.com';
const signature = '';
const ossAccessKeyId = '<accessKey>';
const policy = '<policyBase64Str>';
const key = '<object name>';
const securityToken = '<x-oss-security-token>'; 
const filePath = '<filePath>'; // 待上传文件的文件路径。

function uploadOSS(filesPaths) {
  const path = Array.isArray(filesPaths) ? filesPaths : [filesPaths]

  for (let index = 0; index < path.length; index++) {
    wx.uploadFile({
      url: host,
      filePath: path[index],
      name: 'file', // 必须填file。
      formData: {
        key: 'test.png',
        // policy,
        // OSSAccessKeyId: ossAccessKeyId,
        // signature,
        // 'x-oss-security-token': securityToken // 使用STS签名时必传。
      },
      success: (res) => {
        debugger
        if (res.statusCode === 204) {
          console.log('上传成功');
        }
      },
      fail: err => {
        debugger
        console.log(err);
      }
    });
  }
}

module.exports = uploadOSS