export type WebpackConfigOptions = {
  mode: 'production' | 'development';
  watch?: boolean;
  publicPath: string;
  plugins?: unknown[];
};
