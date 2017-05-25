import { bindActionCreators } from 'redux'
import { createAction } from 'redux-actions'
import { createApiAction } from 'actions'
import actionTypes from 'consts/actionTypes'
import store from 'store'

import GlobalService from 'service/GlobalService'

export default bindActionCreators({
  getUserInfo: createApiAction(actionTypes.GET_USER_INFO, GlobalService.getUserInfo.bind(GlobalService)),
  getUserList: createApiAction(actionTypes.GET_USER_LIST, GlobalService.getUserList.bind(GlobalService))
}, store.dispatch)