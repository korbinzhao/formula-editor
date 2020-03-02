const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const {CheckerPlugin} = require('awesome-typescript-loader');


module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  entry: {
    demo: './demo/index.tsx',
    index: './src/index.ts'
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: 'awesome-typescript-loader'
        },
      ],
    },
    {
      test: /\.css$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            minimize: true
          },
        },
      ],
    },
    {
      test: /\.less$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            minimize: true
          },
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    },
    {
      test: /\.xml$/,
      use: [{
        loader: 'raw-loader',
      }, ],
    }
  ],
  },

  plugins: [

    new HtmlWebPackPlugin({
      template: "./demo/index.html",
      filename: "./index.html",
      chunks: ['demo']
    }),
    //   new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn|en-gb)$/),

    // // 合并规则：合并所有plugins，同名plugin只出现一次
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    // 允许错误不打断程序
    new webpack.NoEmitOnErrorsPlugin(),

    // // 检测打包体积大小
    // new BundleAnalyzerPlugin(),

    // 进度插件
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`📦 ${msg}: `);
        stream.clearLine(1);
      }
    }),

    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // load `moment/locale/ja.js` and `moment/locale/it.js`
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),

    new FilterWarningsPlugin({
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),

    new CheckerPlugin()
  ],

  optimization: {
    usedExports: true, // 标记去掉未使用方法
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
          test: module =>
            /[\\/]node_modules[\\/]/.test(module.resource) &&
            module.constructor.name !== 'CssModule',
          name: 'vendor',
          chunks: 'all',
        },
        styles: {
          test: module =>
            /[\\/]node_modules[\\/]/.test(module.resource) &&
            module.constructor.name === 'CssModule',
          chunks: 'all',
          name: 'vender',
          enforce: true
        }
      },
    },
    minimizer: [
      // new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

};