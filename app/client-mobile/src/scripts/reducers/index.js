import { handleActions } from 'redux-actions'

const initialState = {}

const reducers = handleActions({
  ['GET_AUTH_INFO'](state, action) {
    return {
      ...state
    }
  }
}, initialState)

export default {
  global: reducers
}
