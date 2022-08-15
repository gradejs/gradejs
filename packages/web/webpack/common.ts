import { resolve } from 'path';
import { Configuration, EnvironmentPlugin, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const env = [
  'API_ORIGIN',
  'PLAUSIBLE_DOMAIN',
  'GA_ID',
  'DUMP_ANALYTICS',
  'CORS_ORIGIN',
].reduce((acc, val) => {
  acc[val] = `"${process.env[val]}"`;
  return acc;
}, {} as Record<string, any>);

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
  new EnvironmentPlugin(env),
  new DefinePlugin({
    __isServer__: isServer,
  }),
  new MiniCssExtractPlugin({
    filename: mode === 'development' ? '[name].css' : '[name].[fullhash].css',
    chunkFilename: mode === 'development' ? '[id].css' : '[id].[fullhash].css',
  }),
];
