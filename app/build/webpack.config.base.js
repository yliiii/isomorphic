import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'
import aliasBaseConfig from './alias.config.base'

export const ROOT_DIR = path.resolve(__dirname, '..')
export const APP_ROOT_DIR = path.resolve(__dirname, '../..')
export const postCssLoader  = {
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
        precss(),
        autoprefixer({
          browsers: ['> 1%', 'IE 8']
        })
      ]
    }
  }
}
              
export default {
  output: {
    path: path.resolve(APP_ROOT_DIR, 'dist'),
    publicPath: '/dist',
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.styl'],
    alias: aliasBaseConfig
  },
  module: {
    noParse: /\.min\.js/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024 * 4,
            name: 'images/[name]-[hash:base64:5].[ext]?[hash]'
          }
        }]
        
      }, {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url-loader?limit=10000&mimetype=application/font-woff']
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url-loader?limit=10000&mimetype=application/octet-stream']
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: ['file-loader']
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url?limit=10000&mimetype=image/svg+xml']
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [ 'css-loader', postCssLoader ]
        })
      }, {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [ 'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]', postCssLoader ]
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new ExtractTextPlugin({
      filename:  '[name].css',
      allChunks: true
    })
  ]
}

