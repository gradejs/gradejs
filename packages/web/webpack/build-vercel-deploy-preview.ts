import webpack from 'webpack';
import { getClientVars } from '../../shared/src/utils/env';
import { clientConfig } from './client';
import HtmlReplaceWebpackPlugin from 'html-replace-webpack-plugin';

// Vercel webpack build for branch deploy previews without SSR
webpack(
  [
    clientConfig({
      mode: 'production',
      publicPath: '/',
      plugins: [
        new HtmlReplaceWebpackPlugin([
          {
            pattern: 'window.process = { env: {} };',
            replacement: 'window.process = { env: ' + JSON.stringify(getClientVars()) + ' };',
          },
        ]),
      ],
    }),
  ],
  (err, stats) => {
    // [Stats Object](#stats-object)
    process.stdout.write(stats!.toString() + '\n');
  }
);
