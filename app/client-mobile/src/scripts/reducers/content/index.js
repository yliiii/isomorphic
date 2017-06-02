import { handleActions } from 'redux-actions'
import { createApiReducers } from 'reducers'
import actionTypes from 'consts/content/actionTypes'

const initialState = {}
const initialUnit = {
  unitId: 0,
  unitName: '',
  videoList: []
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
    return {
      ...state
    }
  }
}, initialState)

export default reducers