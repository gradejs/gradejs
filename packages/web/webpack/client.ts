import { join, resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StatsWriterPlugin } = require('webpack-stats-plugin');
import { configCommon, pluginsCommon, srcDir } from './common';
import { Configuration } from 'webpack';
import { WebpackConfigOptions } from './config';

const distDir = 'dist/static';

export const clientConfig: (options: WebpackConfigOptions) => Configuration = ({
  mode,
  publicPath,
  watch = false,
  plugins = [],
}) => ({
  entry: join(__dirname, '..', srcDir, 'index.tsx'),
  ...configCommon(mode),
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff(2)?|ttf|eot)$/i,
        exclude: /sprite\/([^\/]*)\.svg$/,
        type: 'asset/resource',
      },
      {
        test: /sprite\/([^\/]*)\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'sprite.svg',
        },
      },
      {
        test: /\.(tsx|ts)?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: mode === 'development',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: mode === 'development',
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        exclude: /\.module.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: mode === 'development',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...pluginsCommon(mode, false),
    new HtmlWebpackPlugin({
      template: join(__dirname, '..', 'index.html'),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/sharing-image.png', to: 'sharing-image.png' },
        { from: 'src/assets/default-favicon.png', to: 'default-favicon.png' },
        { from: 'src/assets/favicon.ico', to: 'favicon.ico' },
      ],
    }),
    ...plugins,
    new StatsWriterPlugin({
      filename: 'stats.json',
    }),
  ],
  output: {
    filename: 'bundle.[fullhash].js',
    path: resolve(__dirname, '..', distDir),
    publicPath,
    assetModuleFilename: '[hash][ext]',
  },
  watch,
});
