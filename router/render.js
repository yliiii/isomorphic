import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Route, StaticRouter } from 'react-router'
import { Provider } from 'react-redux'

// 设置路径
const APP_PATH = path.resolve(__dirname, '../', 'app')
const CONTROLLER_PATH = path.resolve(APP_PATH, 'common/controller/src/')
const MOBILE_PATH = path.resolve(APP_PATH, 'client-mobile/src/scripts')
const PC_PATH = path.resolve(APP_PATH, 'client-pc/src/scripts')

// 将路由配置转换为<Route>
let autoKey = 0
export function routerParse(platform, config, routerPath) {
  if (!routerPath) autoKey = 0
  if (!config || !config.length) return

  let routerArray = []

  config.forEach(function(routerConfig) {
    const { routes,componentPath, ...routerProp } = routerConfig

    if (!componentPath) return

    if (routerPath) {
      routerProp.path = path.join(routerPath, routerProp.path)
    }

    routerProp.component = require(path.resolve(platform === 'MOBILE' ? MOBILE_PATH : PC_PATH, componentPath)).default

    routerArray.push(
      <Route {...routerProp} key={`${autoKey}_${new Date().getTime()}`} />
    )

    autoKey++

    if (routes) {
      routerParse(platform, routes, routerProp.path).forEach(router => routerArray.push(router))
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

async function responseRender({ platform, store, routerConfig, ctx, next }) {
  let context = {}
  let renderParams = {
    title: '',
    dev: ctx.app.env === 'development',
    gData: {
      serverWrap: 'server', // server render直出容器
      clientWrap: 'main' // client render容器
    },
    reduxData: store.getState(),
    app: ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <div>
            {routerParse(platform, routerConfig)}
          </div>
        </StaticRouter>
      </Provider>
    )
  }

  await ctx.render('index', renderParams) 
}

function initServerRender(platform) {
  let store = () => {}
  let routerConfig = null
  let routerComponents = null

  if (platform === 'MOBILE') {
    store = require(path.resolve(MOBILE_PATH, 'store')).default
    routerConfig = require(path.resolve(MOBILE_PATH, 'router/config')).default
    routerComponents = matchComponents(routerConfig)
  }

  return async (ctx, next) => {
    let renderComponent = routerComponents ? routerComponents[ctx.path] : null

    if (renderComponent && renderComponent.initData) {
      try {
        await renderComponent.initData()
        await responseRender({ platform, store, routerConfig, ctx, next })
      } catch (e) {
        // TODO: 500
        console.log('---init data error:')
        console.log(e)
      }
    } else {
      await responseRender({ platform, store, routerConfig, ctx, next })
    }
  }
}

export default async (platform, ctx, next) => {
  let serverRender = initServerRender(platform)
  await serverRender(ctx, next)
}