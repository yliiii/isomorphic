import globalActions from 'actions/global'
import contentActions from 'actions/content'

export async function getUserInfo(userId = 111, callback) {
  await globalActions.getUserInfo({ userId }, callback)
}

export async function getContentList(callback) {
  await contentActions.getContentList(callback)
}

export async function createUnit(unitName, callback) {
  await contentActions.createUnit(unitName, callback)
}

export function addContentUnit(unit) {
  contentActions.addContentUnit(unit)
}

export function reSortContent({ unitId, ids }) {
  contentActions.reSortContent({ unitId, ids })
}

// server直出初始化数据
export default async function () {
  // await getUserInfo()
  await getContentList()
}