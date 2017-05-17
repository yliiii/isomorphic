import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import store, { configureStore } from 'store'

import routerConfig from 'router/config'
import routerParse from 'controller/routerParseCtl'

let history = createHistory()

let appStore = store
if (window && window.__REDUX_STATE__) {
  appStore = configureStore(window.__REDUX_STATE__)
}

ReactDOM.render(
  <Provider store={appStore}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
        {routerParse(routerConfig)}
      </div>
    </ConnectedRouter>
  </Provider>,
  document.querySelector('.main-wrapper')
)

