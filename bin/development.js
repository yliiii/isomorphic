#!/usr/bin/env node
const path = require('path')
const ENV = process.env.NODE_ENV
const CLIENT = process.env.CLIENT
const ROOT_PATH = path.resolve(__dirname, '../')
const MOBILE_PATH = path.resolve(__dirname, '../app/client-mobile')
const PC_PATH = path.resolve(__dirname, '../app/client-pc')

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

var aliasConfig = {}
var baseAliasConfig = require(path.resolve(ROOT_PATH, 'app/build/alias.config.base'))
if (CLIENT === 'MOBILE') {
  aliasConfig = require(path.resolve(MOBILE_PATH, 'build/alias.config'))
}

console.log('Waiting for webpacking ...')

// Provide custom regenerator runtime and core-js
require('babel-polyfill')

// Javascript required hook
require('babel-core/register')({
  plugins: [
    ["module-resolver", {
      "alias": extend({}, baseAliasConfig, aliasConfig)
    }],
    ['babel-plugin-transform-require-ignore', {
      extensions: ['.styl', '.css']
    }],
    ['inline-replace-variables', {
      __SERVER__: true
    }]
  ]
})

// Css required hook
require('css-modules-require-hook')({
    extensions: ['.styl'],
    preprocessCss: (css, filename) => require('stylus')(css)
      .set('filename', filename)
      .render(),
    camelCase: true,
    generateScopedName: '[name]__[local]__[hash:base64:8]'
})

require('asset-require-hook')({
  extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'tif', 'tiff', 'webp'],
  name: '[name].[ext]',
  limit: 10000
})

var Koa = require('koa')
var webpack = require('webpack')
var KWM = require('koa-webpack-middleware')
var middlewareRegister = require(path.resolve(ROOT_PATH, 'server/middleware')).default
var config = require('./config').default

var app = new Koa()
var devMiddleware = KWM.devMiddleware
var hotMiddleware = KWM.hotMiddleware
// var chokidar = require('chokidar')
var webpackConfig = require(path.resolve((CLIENT === 'PC' ? PC_PATH : MOBILE_PATH), 'build/webpack.development')).default
var compiler = webpack(webpackConfig)
var devMiddlewareInstance = devMiddleware(compiler, {
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: false
  },
  publicPath: '/dist',
  stats: {
    colors: true
  }
})
var hotMiddlewareInstance = hotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
})

// set environment variable
app.env = ENV

// add middleware
app.use(devMiddlewareInstance)
app.use(hotMiddlewareInstance)

// reg middleware
middlewareRegister(app, CLIENT)

// error logger
app.on('error', function (err, ctx) {
  console.log('error occured:', err.stack)
})

// http
var server = require('http').createServer(app.callback())

// listen after webpack compile
var isListened = false
compiler._plugins['after-compile'].push(function (compilation, callback) {
  callback()
  !isListened && server.listen(config.port, function () {
    console.log('App started, at port %d, CTRL + C to terminate', config.port)
    isListened = true
  })
})
