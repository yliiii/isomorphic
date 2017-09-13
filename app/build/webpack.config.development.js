import path from 'path'
import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import baseConfig, { ROOT_DIR } from './webpack.config.base.js'

export default {
  ...baseConfig,
  devtool: 'source-map',
  entry: {
    hot: 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
  },
  resolve: {
    ...baseConfig.resolve
  },
  plugins: [
    ...baseConfig.plugins,
    new CleanWebpackPlugin(['server/templates/index.ejs'], {
      // Absolute path to your webpack root folder (paths appended to this)
      // Default: root of your package
      root: path.resolve(__dirname, '../..'),

      // Write logs to console.
      verbose: true,
      
      // Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false,           

      // If true, remove files on recompile. 
      // Default: false
      watch: false,

      // Instead of removing whole path recursively,
      // remove all path's content with exclusion of provided immediate children.
      // Good for not removing shared files from build directories.
      exclude: [ 'files', 'to', 'ignore' ] 
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new HtmlWebpackHarddiskPlugin() // HtmlWebpackPlugin保持将模板输出到指定目录，防止server render时找不到对应模板文件
  ]
}