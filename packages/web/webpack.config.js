const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcDir = 'src';
const distDir = 'dist';

module.exports = (_, argv) => {
  const { mode = 'development' } = argv;
  const isDevelopment = mode === 'development';

  return {
    mode,
    entry: path.join(__dirname, srcDir, 'index.tsx'),
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve(__dirname, srcDir), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif|woff(2)?|ttf|eot)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(tsx|ts)?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.module\.scss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDevelopment,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          exclude: /\.module.scss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[fullhash].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[fullhash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
      }),
      isDevelopment
        ? new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config().parsed),
          })
        : new webpack.EnvironmentPlugin(['API_ORIGIN', 'GTM_ID']),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, distDir),
      },
      compress: true,
      port: 3000,
    },
    output: {
      filename: 'bundle.[fullhash].js',
      path: path.resolve(__dirname, distDir),
      publicPath: '/',
      assetModuleFilename: 'static/[hash][ext]',
    },
  };
};
