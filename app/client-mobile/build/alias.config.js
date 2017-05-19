const path = require('path')

module.exports = {
  actions: path.join(__dirname, '..', 'src/scripts/actions'),
  consts: path.join(__dirname, '..', 'src/scripts/consts'),
  store: path.join(__dirname, '..', 'src/scripts/store'),
  reducers: path.join(__dirname, '..', 'src/scripts/reducers'),
  router: path.join(__dirname, '..', 'src/scripts/router'),
  components: path.join(__dirname, '..', 'src/scripts/components'),
  containers: path.join(__dirname, '..', 'src/scripts/containers'),
  pages: path.join(__dirname, '..', 'src/scripts/pages')
}