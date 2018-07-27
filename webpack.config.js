const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

module.exports = {
  mode: 'development',

  entry: {
    index: './src/ts/index',
  },
  
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  
  devServer: {
    port: 8080
  },

  devtool: 'cheap-source-map',
  
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', include: path.resolve(__dirname, 'src') },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, 'src/scss')
      }
      // {
      //   test: /\.(bmp|gif|jpg|jpeg|png|svg)$/,
      //   include: path.resolve(__dirname, 'src/images'),
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]'
      //       }
      //     }
      //   ]
      // }
    ]
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: './public/favicon.ico',
      template: path.resolve(__dirname, 'index.html')
    })
  ]
}