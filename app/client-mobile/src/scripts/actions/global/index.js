import { bindActionCreators } from 'redux'
import { createAction } from 'redux-actions'
import actionTypes from 'consts/actionTypes'
import store from 'store'

export default bindActionCreators({
  getAuthInfo: createAction(actionTypes.GET_AUTH_INFO)
}, store.dispatch)