export const getImgQuality = (url: string, percent) => {
  return url + `?x-oss-process=image/resize,p_${percent}/format,webp`
}