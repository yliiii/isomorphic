const path = require('path')

const ENV = process.env.NODE_ENV
const CLIENT = process.env.CLIENT
const ROOT_PATH = path.resolve(__dirname, '../..')
const CLIENT_PATH = path.resolve(ROOT_PATH, 'app/client')
const PC_PATH = path.resolve(ROOT_PATH, 'app/client-pc')

module.exports = {
  ROOT_PATH,
  CLIENT_PATH,
  PC_PATH,
  CLIENT_PATH: CLIENT === 'PC' ? PC_PATH : CLIENT_PATH
}