#!/usr/bin/env node
const Koa = require('koa')
const path = require('path')
const ENV_CONF = require('./config/env')
const ENV = ENV_CONF.ENV
const CLIENT = ENV_CONF.CLIENT
const ROOT_PATH = ENV_CONF.ROOT_PATH
const CLIENT_PATH = ENV_CONF.CLIENT_PATH

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

var baseAliasConfig = require(path.resolve(ROOT_PATH, 'app/build/alias.config.base'))
let aliasConfig = require(path.resolve(CLIENT_PATH, 'build/alias.config'))

console.log('Waiting for webpacking ...')

// Javascript required hook
require('babel-core/register')({
  extensions: [".js"],
  plugins: [
    ["module-resolver", {
      "alias": extend({}, baseAliasConfig, aliasConfig)
    }],
    ['inline-replace-variables', {
      __SERVER__: true
    }]
  ]
})

// Css required hook
require('css-modules-require-hook')({
  extensions: ['.styl'],
  preprocessCss: (css, filename) => {
    return require('stylus')(css).set('filename', filename).render()
  },
  camelCase: true,
  generateScopedName: '[local]_[hash:5]'
})

require('asset-require-hook')({
  extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'tif', 'tiff', 'webp'],
  name: '[name].[ext]',
  limit: 10000
})

// 启动server
let server
let hasListen = false
function startServer (app) {
  if (server) {
    try {
      console.log('waiting for restart server ...')
      server && server.close()
      hasListen = false
    } catch (e) {}
  }

  if (hasListen) return

  let config = require('./config').default
  server = require('http').createServer(app.callback())

  server.listen(config.port, function () {
    hasListen = true
    console.log('App started, at port %d, CTRL + C to terminate', config.port)
  })
}

const app = new Koa()
// set environment variable
app.env = ENV
app.client = CLIENT

// reg server render middleware
const middlewareRegister = require(path.resolve(ROOT_PATH, 'server/middleware')).default

if (ENV === 'production') {
  // PM2
  middlewareRegister(app)
  startServer(app)
} else {
  const devReadyPromise = require(path.resolve(ROOT_PATH, 'server/setup-dev-server')).default
  devReadyPromise(app, stats => {
    middlewareRegister(app)
    startServer(app)
  })
}
