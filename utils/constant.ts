export const defaultTimeFormat = 'YYYY-MM-DD'
export const exifTimeFormat = 'YYYY:MM:DD HH:mm:ss'
export const apiDomain = 'https://www.nature-notes.com'
// export const apiDomain = 'http://192.168.3.179:7001'
export const statBgColor = '#0bae31'
export const defaultPlaceholder = '搜索物种，比如“银杏”'

export const RankChineseMap = {
  "kingdom": "界",
  "subkingdom": "亚界",
  "phylum": "门",
  "subphylum": "亚门",
  "superclass": "总纲",
  "class": "纲",
  "subclass": "亚纲",
  "infraclass": "附纲",
  "superorder": "总目",
  "order": "目",
  "suborder": "亚目",
  "infraorder": "下目",
  "subterclass": "子类",
  "parvorder": "小目",
  "zoosection": "派",
  "zoosubsection": "动物群落",
  "superfamily": "总科",
  "epifamily": "领科",
  "family": "科",
  "subfamily": "亚科",
  "supertribe": "总族",
  "tribe": "族",
  "subtribe": "亚族",
  "genus": "属",
  "genushybrid": "属间杂种",
  "subgenus": "亚属",
  "section": "组",
  "subsection": "亚组",
  "complex": "复合群",
  "species": "种",
  "hybrid": "杂种",
  "subspecies": "亚种",
  "variety": "变种",
  "form": "型",
  "infrahybrid": "种内杂种"
}

export const sortKeyOptions = [
  {
    label: '上传日期',
    value: 'created_at',
  },
  {
    label: '拍照日期',
    value: 'observed_on'
  }
]

export const sortTypeOptions = [
  {
    value: 'DESC',
    label: '降序'
  },
  {
    value: 'ASC',
    label: '升序'
  }
]