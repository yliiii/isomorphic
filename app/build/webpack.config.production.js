import path from 'path'
import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import baseConfig, { ROOT_DIR } from './webpack.config.base.js'


export default {
  ...baseConfig,
  resolve: {
    ...baseConfig.resolve
  },
  plugins: [
    ...baseConfig.plugins,
    new CleanWebpackPlugin(['dist'], {
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
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new UglifyJSPlugin({
      // 最紧凑的输出
      beautify: true,
      // 删除所有的注释
      comments: true,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
    }),
    new HtmlWebpackHarddiskPlugin() // HtmlWebpackPlugin保持将模板输出到指定目录，防止server render时找不到对应模板文件
  ]
}