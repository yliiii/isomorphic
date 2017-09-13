import { bindActionCreators } from 'redux'
import { createAction } from 'redux-actions'
import { createApiAction } from 'actions'
import actionTypes from 'consts/content/actionTypes'
import store from 'store'

import ContentService from 'service/ContentService'

export default bindActionCreators({
  getContentList: createApiAction(actionTypes.GET_CONTENT_UNIT_LIST, ContentService.getContentList.bind(ContentService)),
  createUnit: createApiAction(actionTypes.CREATE_UNIT, ContentService.createUnit.bind(ContentService)),
  addContentUnit: createAction(actionTypes.ADD_CONTENT_UNIT),
  reSortContent: createAction(actionTypes.RESORT_CONTENT)
}, store.dispatch)