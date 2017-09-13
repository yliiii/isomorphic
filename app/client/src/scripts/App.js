import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import store from 'store'

import routerConfig from 'router/config'
import { routerParse } from 'router'

import { getGlobalState } from 'controller/constsCtl'

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
  document.getElementById(getGlobalState('clientWrap'))
)

