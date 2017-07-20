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

// Javascript required hook
require('babel-register')({
  extensions: [".jsx", ".js"],
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
  preprocessCss: (css, filename) => require('stylus')(css)
    .set('filename', filename)
    .render(),
  camelCase: true,
  generateScopedName: '[local]_[folder]'
})

require('asset-require-hook')({
  extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'tif', 'tiff', 'webp'],
  name: '[name].[ext]',
  limit: 10000
})

var Koa = require('koa')
var app = new Koa()

// set environment variable
app.env = ENV

// reg server render middleware
var middlewareRegister = require(path.resolve(ROOT_PATH, 'server/middleware')).default
middlewareRegister(app, CLIENT)

// error logger
app.on('error', function (err, ctx) {
  console.log('error occured:', err.stack)
})

// http
var server = require('http').createServer(app.callback())

// listen after webpack compile
var isListened = false
var config = require('./config').default
server.listen(config.port, function () {
  console.log('App started, at port %d, CTRL + C to terminate', config.port)
})
