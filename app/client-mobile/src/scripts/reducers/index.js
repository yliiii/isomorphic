import { handleActions } from 'redux-actions'
import actionTypes from 'consts/actionTypes'
import content from './content'

const initialState = {}

const reducers = handleActions({
  [actionTypes.GET_USER_INFO](state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}, initialState)

export default {
  global: reducers,
  content
}

export function createApiReducers(actionTypes = []) {
  return actionTypes.reduce((previous, current, index, array)=>({
    ...previous,
    [current + '_request'](state) {
      return {
        ...state,
        requestings: { ...state.requestings, [current]: true },
        errors: { ...state.errors, [current]: null }
      }
    },
    [current](state, action) {
      return {
        ...state,
        requestings: { ...state.requestings, [current]: false },
        errors: { ...state.errors, [current]: null },
        payloads: {
          ...state.payloads,
          [current]: {
            params: action.params,
            payload: action.payload
          }
        }
      }
    },
    [current + '_failure'](state, action) {
      return {
        ...state,
        requestings: { ...state.requestings, [current]: false },
        errors: { ...state.errors, [current]: action.payload }
      }
    }
  }), {})
}
