import path from 'path'
import devConfig from '../../build/webpack.config.development.js'

export default {
  ...devConfig,
  entry: {
    ...devConfig.entry,
    main: path.join(__dirname, '..', 'src/scripts/App.js')
  },
  resolve: {
    ...devConfig.resolve,
    alias: {
      ...devConfig.resolve.alias,
      store: path.join(__dirname, '..', 'src/scripts/store'),
      reducers: path.join(__dirname, '..', 'src/scripts/reducers'),
      router: path.join(__dirname, '..', 'src/scripts/router'),
      pages: path.join(__dirname, '..', 'src/scripts/pages')
    }
  },
  plugins: [
    ...devConfig.plugins
  ]
}