const path = require('path');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ASSETS_NAME = 'app';

const HOST = 'localhost';
const PROXY_SERVER_PORT = 3100;
const SERVER_PORT = 3000;

function getPath(filePath) {
  return path.resolve(__dirname, filePath);
}

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    entry: getPath('./src/js/index.js'),
    output: {
      filename: `${ASSETS_NAME}-[hash].js`,
      path: getPath('./dist'),
    },
    resolve: {
      modules: [
        getPath('./src'),
        'node_modules',
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isProduction,
                },
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
                options: {
                  indentedSyntax: false,
                  includePaths: [
                    getPath('./src'),
                  ],
                },
              },
            ],
          }),
        },
        {
          test: /\.(png|ico|jpe?g|gif|wav|aiff?|mp3|m4a|ogg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          },
        },
      ],
    },
    plugins: [
      new BrowserSyncPlugin({
        host: HOST,
        port: SERVER_PORT,
        proxy: `http://${HOST}:${PROXY_SERVER_PORT}/`,
      }, {
        reload: true,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: {
          collapseWhitespace: isProduction,
        },
      }),
      new ExtractTextPlugin({
        filename: `${ASSETS_NAME}-[hash].css`,
      }),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            safari10: true,
          },
        }),
      ],
    },
    devtool: isProduction ? false : 'source-map',
    devServer: {
      hot: false,
      inline: false,
      port: PROXY_SERVER_PORT,
    },
  };
};
