import path from 'path'
import devConfig from '../../build/webpack.config.production'
import aliasConfig from './alias.config'

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
      ...aliasConfig
    }
  },
  plugins: [
    ...devConfig.plugins
  ]
}