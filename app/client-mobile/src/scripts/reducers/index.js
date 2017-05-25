import { handleActions } from 'redux-actions'
import actionTypes from 'consts/actionTypes'

const initialState = {}

const reducers = handleActions({
  [actionTypes.GET_USER_INFO](state, action) {
    return {
      ...state,
      ...action.payload
    }
  },
  [actionTypes.GET_USER_LIST](state, action) {
    return {
      ...state,
      list: [ ...action.payload ]
    }
  }
}, initialState)

export default {
  global: reducers
}
