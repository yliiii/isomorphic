import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'

let createHistory = () => {}
if (typeof window === 'undefined') {
  createHistory = require('history/createMemoryHistory').default
} else {
  createHistory = require('history/createBrowserHistory').default
}

const history = createHistory()
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  routerMiddleware(history)
)(createStore)

let store = createStoreWithMiddleware(combineReducers({
  ...rootReducer,
  router: routerReducer
}), typeof window !== 'undefined' && window.__REDUX_STATE__ ? window.__REDUX_STATE__ : {})

export function configureStore(initialState = {}) {
  store = createStoreWithMiddleware(combineReducers({
    ...rootReducer,
    router: routerReducer
  }), initialState)

  return store
}

export default store

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const nextReducer = require('../reducers')
    store.replaceReducer(nextReducer)
  })
}