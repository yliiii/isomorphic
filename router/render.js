import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'

const APP_PATH = path.resolve(__dirname, '../', 'app')
const CONTROLLER_PATH = path.resolve(APP_PATH, 'common/controller/src/')
const MOBILE_PATH = path.resolve(APP_PATH, 'client-mobile/src/scripts')
const PC_PATH = path.resolve(APP_PATH, 'client-pc/src/scripts')
const router = require(path.resolve(CONTROLLER_PATH, 'routerParseCtl'))


async function responseRender({ store, routerConfig, ctx, next }) {
  let routerParse = router.default
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

function initServerRender(platform) {
  let store = () => {}
  let matchComponents = router.matchComponents
  let routerConfig = null
  let routerComponents = null

  if (platform === 'MOBILE') {
    store = require(path.resolve(MOBILE_PATH, 'store')).default
    routerConfig = require(path.resolve(MOBILE_PATH, 'router/config')).default
    routerComponents = matchComponents(routerConfig)
  }

  return async (ctx, next) => {
    let renderComponent = routerComponents ? routerComponents[ctx.url] : null

    if (renderComponent && renderComponent.initData) {
      try {
        let data = await renderComponent.initData()
        await responseRender({ store, routerConfig, ctx, next })
      } catch (e) {
        // TODO: 500
        console.log('---------init data error:' + e.toString())
      }
    } else {
      await responseRender({ store, routerConfig, ctx, next })
    }
  }
}

export default async (platform, ctx, next) => {
  let serverRender = initServerRender(platform)
  await serverRender(ctx, next)
}