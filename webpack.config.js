// const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const loaders = {
  css: {
    loader: 'css-loader'
  },
  postcss: {
    loader: 'postcss-loader',
  },
  sass: {
    loader: 'sass-loader',
    options: {
      indentedSyntax: false,
      includePaths: [path.resolve(__dirname, './src')]
    }
  }
};

module.exports = {
  entry: [
    './src/js/index.js',
  ],
  output: {
    filename: 'js/app-[hash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.scss$|.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [loaders.css, loaders.postcss, loaders.sass]
        })
      },
      {
        test: /\.(png|jpe?g|gif|wav|aiff?|mp3|m4a|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'hex002',
      template: './src/template-index.ejs'
    }),
    new ExtractTextPlugin({
      filename: 'css/style-[contenthash].css',
      disable: process.env.NODE_ENV === 'development'
    }),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/) through BrowserSync
        proxy: 'http://localhost:3100/'
      },
      {
        reload: true
      }
    )
  ],
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  // let browser sync do the reloading instead of webpack-dev-server
  devServer: {
    hot: false,
    inline: false,
  }
};
