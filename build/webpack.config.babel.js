require('dotenv').config()
const { identity } = require('lodash')
const TerserPlugin = require('terser-webpack-plugin')
const { resolve } = require('path')
const { LoaderOptionsPlugin } = require('webpack')
const { env } = process
const pack = require('../package.json')
const devPort = env.devPort || 6066
const host = env.host || 'localhost'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const camel = require('camelcase')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const extractTextPlugin1 = new MiniCssExtractPlugin({
  filename: 'css/[name].styles.bundle.css'
})
const stylusSettingPlugin = new LoaderOptionsPlugin({
  test: /\.styl$/,
  stylus: {
    preferPathResolver: 'webpack'
  },
  'resolve url': false
})
const {
  RINGCENTRAL_APP_SERVER,
  APP_HOME,
  NODE_ENV
} = env
const isProd = NODE_ENV === 'production'
const fix = APP_HOME
const home = (RINGCENTRAL_APP_SERVER + fix).replace(/\/$/, '')
const dict = {
  appName: camel(pack.name),
  description: pack.description,
  authorEmail: pack.author.email,
  authorName: pack.author.name,
  authorUrl: pack.author.url,
  home
}
const config = {
  mode: 'development',
  entry: {
    app: './src/client/app.js',
    work: './src/client/work.js',
    config: './src/app/config.xml'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.json']
  },
  output: {
    path: resolve(__dirname, '../deploy/dist/static'),
    filename: 'js/[name].bundle.js',
    publicPath: '/',
    chunkFilename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              // publicPath: '../'
            }
          },
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
              // modifyVars: theme
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|svg|mp3)$/,
        use: ['url-loader?limit=100000&name=images/[name].[ext]']
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.xml?$/,
        use: [
          'null-loader',
          {
            loader: resolve(__dirname, '../src/loaders/xml-loader.js'),
            options: {
              dict,
              file: resolve(__dirname, '../config.xml')
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  devServer: {
    host,
    disableHostCheck: true,
    contentBase: '../deploy/dist/static',
    port: devPort,
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true,
    proxy: {
      '/': {
        target: `http://${env.RINGCENTRAL_HOST}:${env.RINGCENTRAL_PORT}`,
        bypass: function (req, res, proxyOptions) {
          if (req.path.includes('.bundle.')) {
            return req.path
          }
        }
      }
    }
  },
  plugins: [
    extractTextPlugin1
  ].filter(identity)
}

if (isProd) {
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  }
  config.mode = 'production'
  delete config.watch
  delete config.devtool
  delete config.devServer
  config.plugins = [
    extractTextPlugin1,
    new LodashModuleReplacementPlugin({
      collections: true,
      paths: true
    }),
    stylusSettingPlugin
  ]
}

module.exports = config
