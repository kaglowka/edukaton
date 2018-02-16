const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const localPath = (...args) => path.resolve(__dirname, ...args);

const BUILD_DIR = localPath('dist');

const appSettings = require('./app-settings.js');

const config = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: [
      localPath('src'),
      localPath('node_modules'),
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                "react",
                [
                  "es2015",
                  {
                    "modules": false
                  }
                ],
                "es2016"
              ]
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        /* CSS global styles */
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        /* SCSS global styles */
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]'
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR]),
    new webpack.DefinePlugin({
      // use appropriate (dev or production) PP settings
      SETTINGS: appSettings[process.env.NODE_ENV || 'dev']
    }),
  ],
};

module.exports = config;
