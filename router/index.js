import path from 'path'

export default (client) => {
  return async (ctx, next) => {
    let serverRender = require(path.resolve(__dirname, './render')).default(client)
    await serverRender(ctx, next)
  }
}