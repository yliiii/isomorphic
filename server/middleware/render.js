import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'

const APP_PATH = path.resolve(__dirname, '../..', 'app')
const CONTROLLER_PATH = path.resolve(APP_PATH, 'common/controller/src/')
const MOBILE_PATH = path.resolve(APP_PATH, 'client-mobile/src/scripts')
const PC_PATH = path.resolve(APP_PATH, 'client-pc/src/scripts')

function handleServerRender(client) {
  let configureStore = () => {}
  let routerParseCtl = require(path.resolve(CONTROLLER_PATH, 'routerParseCtl')).default
  let routerConfig = null

  if (client === 'MOBILE') {
    configureStore = require(path.resolve(MOBILE_PATH, 'store/configureStore')).default
    routerConfig = require(path.resolve(MOBILE_PATH, 'router/config')).default
  }

  return async (ctx, next) => {
    let store = configureStore()
    let context = {}
    let renderParams = {
      title: '',
      dev: ctx.app.env === 'development',
      reduxData: store.getState() || {},
      app: ReactDOMServer.renderToString(
        <StaticRouter location={ctx.url} context={context} >
          <div>
            {routerParseCtl(routerConfig)}
          </div>
        </StaticRouter>
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