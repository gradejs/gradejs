const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    devtool: isDevelopment ? 'eval-source-map' : false,
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
      new webpack.DefinePlugin({
        ...(isDevelopment ? { 'process.env': JSON.stringify(dotenv.config().parsed) } : {}),
      }),
      ...(isDevelopment
        ? []
        : [
            new webpack.EnvironmentPlugin({
              API_ORIGIN: 'https://staging.api.gradejs.com',
              GA_ID: '',
              PLAUSIBLE_DOMAIN: '',
              DUMP_ANALYTICS: '',
            }),
          ]),
      new CopyPlugin({
        patterns: [
          { from: 'robots.txt', to: 'robots.txt' },
          { from: 'src/assets/sharing-image.png', to: 'static/sharing-image.png' },
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, distDir),
      },
      compress: true,
      historyApiFallback: {
        disableDotRule: true,
      },
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
