import { join, resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { configCommon, pluginsCommon, srcDir } from './common';
import { Configuration } from 'webpack';

const distDir = 'dist/static';

export const clientConfig: (mode: 'development' | 'production', watch: boolean) => Configuration = (
  mode,
  watch
) => ({
  entry: join(__dirname, '..', srcDir, 'index.tsx'),
  ...configCommon(mode),
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
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'src/assets/sharing-image.png', to: 'sharing-image.png' },
      ],
    }),
  ],
  output: {
    filename: 'bundle.[fullhash].js',
    path: resolve(__dirname, '..', distDir),
    publicPath: '/static/',
    assetModuleFilename: '[hash][ext]',
  },
  watch,
});