import path from 'path'
import webpack from 'webpack'
import baseConfig, { ROOT_DIR } from './webpack.config.base.js'

export default {
  ...baseConfig,
  devtool: 'source-map',
  entry: {
    // For old browsers
    polyfill: 'eventsource-polyfill',
    hot: 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
  },
  resolve: {
    ...baseConfig.resolve
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin()
  ]
}