const rankList = [
  {
    label: '界',
    rank: 'kingdom',
  },
  {
    label: '门',
    rank: 'phylum'
  },
  {
    label: '纲',
    rank: 'class',
  },
  {
    label: '目',
    rank: 'order',
  },
  {
    label: '科',
    rank: 'family'
  },
  {
    label: '属',
    rank: 'genus'
  },
  {
    lable: '种',
    rank: 'species'
  }
]

// 选择到某个具体级别，如 family
export const selectSubRankList = (rank) => {
  const index = rankList.findIndex(i => i.rank === rank)
  return rankList.slice(0, index + 1)
}

// 选择最近的三个祖先级别
export const selectLatest3LevelRank = (rank) => {
  const selectedTree = selectSubRankList(rank)
  const length = selectedTree.length
  const result = []
  for (let index = length - 1; index >= 0 && index >= length - 3; index--) {
    const item = selectedTree[index];
    result.push(item)
  }

  return result.reverse()
}

export const generateNameFromRankList = (tree, data) => {
  return tree.map((item) => {
    const rank = item.rank;
    return data[rank + 'ChineseName'] || data[rank]
  }).join('-')
}