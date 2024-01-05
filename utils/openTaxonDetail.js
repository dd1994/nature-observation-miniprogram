import { generateUrlWithParams } from "./util";

export function openBirdDetail(name) {
  // 感谢懂鸟: https://mp.weixin.qq.com/s/FK1G67KM96yqMBYSdwcEHA
  wx.openEmbeddedMiniProgram({
    appId: 'wx0d6a77cb8b27cf91',
    path: 'pages/detail/detail?name=' + encodeURIComponent(name),
  });
}

export function openMammalDetail(name) {
  // 感谢懂鸟: https://mp.weixin.qq.com/s/FK1G67KM96yqMBYSdwcEHA
  wx.openEmbeddedMiniProgram({
    appId: 'wx39173a9ffd43d645',
    path: 'pages/detail/detail?name=' + encodeURIComponent(name),
  });
}

export const openTaxonDetail = (taxon) => {
  if (taxon?.iconic_taxon_name === 'Aves') {
    openBirdDetail(taxon.name)
  } else if (taxon?.iconic_taxon_name === 'Mammalia') {
    openMammalDetail(taxon.name)
  } else {
    wx.navigateTo({
      url: generateUrlWithParams('/pages/taxon-detail/taxon-detail', {
        name: taxon.name,
        rank: taxon.rank,
        iconic_taxon_name: taxon.iconic_taxon_name
      })
    })
  }
}