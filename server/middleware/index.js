import path from 'path'
import views from 'koa-views'
import json from 'koa-json'
import logger from 'koa-logger'
import koaOnError from 'koa-onerror'
import convert from 'koa-convert'
import Bodyparser from 'koa-bodyparser'
import router from '../../router'

const templatePath = path.join(__dirname, '..', 'templates')

export default (app, client = '') => {
  // reg middlewares
  app.use(Bodyparser())
  app.use(json())
  app.use(logger())

  // template ejs
  app.use(views(templatePath, { extension: 'ejs' }))

  // render dispatcher
  app.use(router(client))

  // logger
  if (app.env === 'development') {
    app.use(async (ctx, next) => {
      const start = new Date()
      await next()
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  }

  // 404
  // app.use(async (ctx) => {
  //   ctx.status = 404
  //   await ctx.render('404')
  // })
}
