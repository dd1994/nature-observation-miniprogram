const EXIF = require('./libs/exif');

export const parseExifFromLocalImgUrl = (localUrl) => {
  const base64File = wx.getFileSystemManager().readFileSync(localUrl);

  // 两次 json 操作是为了格式化
  var exifInfo = JSON.parse(JSON.stringify(EXIF.handleBinaryFile(base64File)));
  
  const time = exifInfo?.data?.DateTime
  let GPSInfo
  if (exifInfo?.data?.GPSLatitude) {
    GPSInfo = {
      // 参考文档 https://exiftool.org/TagNames/GPS.html
      GPSLatitude: exifInfo?.data?.GPSLatitude,
      GPSLatitudeRef: exifInfo?.data?.GPSLatitudeRef,
      GPSLongitude: exifInfo?.data?.GPSLongitude,
      GPSLongitudeRef: exifInfo?.data?.GPSLongitudeRef,
    }
  }

  return {GPSInfo, time}
}