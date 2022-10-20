import { resolve } from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SpritePlugin = require('svg-sprite-loader/plugin');

export const srcDir = 'src';

export const configCommon: (mode: 'development' | 'production') => Configuration = (mode) => ({
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [resolve(__dirname, '..', srcDir), 'node_modules'],
  },
  devtool: mode === 'development' ? 'eval-source-map' : false,
});

export const pluginsCommon = (mode: string, isServer: boolean) => [
  new DefinePlugin({
    __IS_SERVER__: isServer,
  }),
  new MiniCssExtractPlugin({
    filename: mode === 'development' ? '[name].css' : '[name].[fullhash].css',
    chunkFilename: mode === 'development' ? '[id].css' : '[id].[fullhash].css',
  }),
  new SpritePlugin(),
];
