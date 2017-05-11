import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'

const APP_PATH = path.resolve(__dirname, '../..', 'app')
const CONTROLLER_PATH = path.resolve(APP_PATH, 'common/controller/src/')
const MOBILE_PATH = path.resolve(APP_PATH, 'client-mobile/src/scripts')
const PC_PATH = path.resolve(APP_PATH, 'client-pc/src/scripts')

function handleServerRender(client) {
  let store = () => {}
  let routerParse = require(path.resolve(CONTROLLER_PATH, 'routerParseCtl')).default
  let routerConfig = null

  if (client === 'MOBILE') {
    store = require(path.resolve(MOBILE_PATH, 'store')).default
    routerConfig = require(path.resolve(MOBILE_PATH, 'router/config')).default
  }

  return async (ctx, next) => {
    let context = {}
    let renderParams = {
      title: '',
      dev: ctx.app.env === 'development',
      reduxData: store.getState(),
      app: ReactDOMServer.renderToString(
        <Provider store={store}>
          <StaticRouter location={ctx.url} context={context}>
            <div>
              {routerParse(routerConfig)}
            </div>
          </StaticRouter>
        </Provider>
      )
    }

    await ctx.render('index', renderParams) 
  }
}

export default (client) => {
  return async (ctx, next) => {
    let serverRender = handleServerRender(client)
    await serverRender(ctx, next)
  }
}