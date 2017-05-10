import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// import createHistory from 'history/createBrowserHistory'
// import createHistory from 'history/createMemoryHistory'
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

export default function configureStore(initialState = {}) {
  const store = createStoreWithMiddleware(combineReducers({
    ...rootReducer,
    router: routerReducer
  }), initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}