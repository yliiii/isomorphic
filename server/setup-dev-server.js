import path from 'path'
import ENV_CONFIG from 'server-bin/config/env'

const { ROOT_PATH, CLIENT_PATH } = ENV_CONFIG

const webpack = require('webpack')
const clientWebpackConfig = require(path.resolve(CLIENT_PATH, 'build/webpack.development')).default

export default function setupDevServer (app, cb = () => null) {
  let resolve

  // initial promise object
  const readyPromise = new Promise(r => { resolve = r })
  const ready = (...args) => {
    cb(...args)
    resolve()
  }

  // webpack compiler
  const clientCompiler = webpack(clientWebpackConfig)

  // webpack dev server middleware
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const devMiddlewareInstance = webpackDevMiddleware(clientCompiler, {
    noInfo: true,
    quiet: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    publicPath: clientWebpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  })
  // add dev server middleware
  app.use((function(devMiddleware) {
    return async (ctx, next) => {
      await devMiddleware(ctx.req, {
        end: function(content) {
          return ctx.body = content
        },
        setHeader: function (name, value) {
          return ctx.set(name, value)
        }
      }, next)
    }
  })(devMiddlewareInstance))

  // hot middleware
  const KWM = require('koa-webpack-middleware')
  const hotMiddleware = KWM.hotMiddleware
  var hotMiddlewareInstance = hotMiddleware(clientCompiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  })
  // add hot middleware
  app.use(hotMiddlewareInstance)

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))

    if (stats.errors.length) return

    ready(stats)
  })
}