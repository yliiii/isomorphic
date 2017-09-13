import { handleActions } from 'redux-actions'
import { createApiReducers } from 'reducers'
import actionTypes from 'consts/content/actionTypes'

const initialState = {}
const initialUnit = {
  unitId: 0,
  unitName: '',
  contentList: []
}

const reducers = handleActions({
  [actionTypes.GET_CONTENT_UNIT_LIST](state, action) {
    return {
      ...state,
      list: [ ...action.payload ]
    }
  },
  [actionTypes.ADD_CONTENT_UNIT](state, action) {
    let { list } = state
    let { index, ...args } = action.payload
    let addData = {
      ...initialUnit,
      unitId: new Date().getTime(),
      ...action.payload
    }

    list.splice(index, 0, addData) // 在指定位置添加一项
    
    return {
      ...state,
      list
    }
  },
  [actionTypes.RESORT_CONTENT](state, action) {
    const { unitId: toUnitId, ids } = action.payload
    const list = [ ...state.list ]

    let reSortList = []
    let reSortContent = []
    list.forEach(unit => {
      const { contentList, ...args } = unit
      
      let filerArray = []
      contentList.forEach(content => {
        const { contentId } = content
        if (ids.indexOf(contentId) > -1) {
          reSortContent.push(content)
        } else {
          filerArray.push(content)
        }
      })

      reSortList.push({
        ...args,
        contentList: filerArray
      })
    })

    try {
      reSortList.forEach(unit => {
        if (unit.unitId === toUnitId) {
          unit.contentList = unit.contentList.concat(reSortContent)
          throw new Error('break')
        }
      })
    } catch (e) {}

    return {
      ...state,
      list: reSortList
    }
  }
}, initialState)

export default reducers