const observationPhotoHost = 'https://observation-images.oss-cn-beijing.aliyuncs.com';
export const avatarHost = 'https://nature-observation-user-avatar.oss-cn-beijing.aliyuncs.com';
const signature = '';
const ossAccessKeyId = '<accessKey>';
const policy = '<policyBase64Str>';
const key = '<object name>';
const securityToken = '<x-oss-security-token>';
const filePath = '<filePath>'; // 待上传文件的文件路径。

function uploadOSS({ filePath, key, success, fail, url = observationPhotoHost }) {
  return wx.uploadFile({
    url: url,
    filePath: filePath,
    name: 'file', // 必须填file。
    formData: {
      key: key // files[index].key,
      // policy,
      // OSSAccessKeyId: ossAccessKeyId,
      // signature,
      // 'x-oss-security-token': securityToken // 使用STS签名时必传。
    },
    success: (res) => {
      if (res.statusCode === 204) {
        console.log('上传成功');
        success(res)
      } else {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
      }
    },
    fail: err => {
      wx.showToast({
        title: '图片上传失败',
        icon: 'none'
      })
      fail(err)
    }
  })
}

export default uploadOSS