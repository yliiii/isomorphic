import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'

import routerConfig from 'router/config'
import routerParse from 'controller/routerParseCtl'

let store = configureStore(window.__REDUX_STATE__)
let history = createHistory()

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
        {routerParse(routerConfig)}
      </div>
    </ConnectedRouter>
  </Provider>,
  document.querySelector('.main-wrapper')
)

