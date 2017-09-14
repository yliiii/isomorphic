import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Route, StaticRouter } from 'react-router'
import { Provider } from 'react-redux'
import ENV_CONFIG from 'server-bin/config/env'

const { ROOT_PATH, CLIENT_PATH } = ENV_CONFIG

// 将路由配置转换为<Route>
let autoKey = 0
export function routerParse(config, routerPath) {
  if (!routerPath) autoKey = 0
  if (!config || !config.length) return

  let routerArray = []

  config.forEach(function(routerConfig) {
    const { routes, component, ...routerProp } = routerConfig

    if (!component) return

    if (routerPath) {
      routerProp.path = path.join(routerPath, routerProp.path)
    }

    routerProp.component = component().default

    routerArray.push(
      <Route {...routerProp} key={`${autoKey}_${new Date().getTime()}`} />
    )

    autoKey++

    if (routes) {
      routerParse(routes, routerProp.path).forEach(router => routerArray.push(router))
    }
  })

  return routerArray
}

// 将路由配置转换{ path: component }格式
export function matchComponents(config, routerPath) {
  if (!config || !config.length) return

  let routerMatch = {}

  config.forEach(function(routerConfig) {
    const { routes, ...routerProp } = routerConfig

    if (routerPath) {
      routerProp.path = path.join(routerPath, routerProp.path)
    }
    
    routerMatch[routerProp.path] = routerConfig

    if (routes) {
      routerMatch = { ...routerMatch, ...matchComponents(routes, routerProp.path) }
    }
  })

  return routerMatch
}

async function responseRender({ store, routerConfig, ctx, next }) {
  let context = {}
  let renderParams = {
    title: '',
    gData: {
      serverWrap: 'server', // server render直出容器
      clientWrap: 'main' // client render容器
    },
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

function initServerRender(app) {
  let store = require(path.resolve(CLIENT_PATH, 'src/scripts/store')).default
  let routerConfig = require(path.resolve(CLIENT_PATH, 'src/scripts/router/config')).default
  let routerComponents = matchComponents(routerConfig)

  return async (ctx, next) => {
    let renderComponent = routerComponents ? routerComponents[ctx.path] : null

    if (renderComponent && renderComponent.initData) {
      try {
        let initData = await renderComponent.initData()
        await initData.default()
        await responseRender({ store, routerConfig, ctx, next })
      } catch (e) {
        // TODO: 500
        console.log('---init data error:')
        console.log(e)
        throw e
      }
    } else {
      await responseRender({ store, routerConfig, ctx, next })
    }
  }
}

export default async (app, ctx, next) => {
  let serverRender = initServerRender(app)
  await serverRender(ctx, next)
}