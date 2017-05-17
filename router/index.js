import api from './api'
import render from './render'

export default function(platform) {
  return async (ctx, next) => {
    // api server through koa-router
    if (ctx.path.match(/^\/api/)) {
      return await api.routes()(ctx, next)
    }
    // others react-router to render
    await render(platform, ctx, next)
  }
}