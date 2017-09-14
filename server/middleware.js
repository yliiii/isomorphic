import path from 'path'
import Bodyparser from 'koa-bodyparser'
import json from 'koa-json'
import logger from 'koa-logger'
import views from 'koa-views'
import serve from 'koa-static'
import ENV_CONFIG from 'server-bin/config/env'
import router from 'server-router'
import renderer from './renderer'

const { ROOT_PATH } = ENV_CONFIG
const templatePath = path.join(__dirname, 'templates')

export default app => {
  // reg middlewares
  app.use(Bodyparser())
  app.use(json())
  app.use(logger())

  // template ejs
  app.use(views(templatePath, { extension: 'ejs' }))

  // renderer dispatcher
  app.use(router(app, renderer))

  // 静态资源
  app.use(serve(path.resolve(ROOT_PATH)))

  // logger
  if (app.env === 'development') {
    app.use(async (ctx, next) => {
      const start = new Date()
      await next()
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  }
}
