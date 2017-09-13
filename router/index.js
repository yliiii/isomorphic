import api from './api'

export default function(app, renderer) {
  return async (ctx, next) => {
    console.log('--------request: ', ctx.url)

    // static
    if (ctx.path.match(/^\/dist/)) {
      return await next()
    }

    // api server through koa-router
    if (ctx.path.match(/^\/api/)) {
      return await api.routes()(ctx, next)
    }

    // others react-router to render
    await renderer(app, ctx, next)
  }
}