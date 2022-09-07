import { readFileSync, writeFileSync } from 'fs';
import path from 'path/posix';
import webpack from 'webpack';
import { getClientVars } from '../../shared/src/utils/env';
import { clientConfig } from './client';

// Vercel webpack build for branch deploy previews without SSR
webpack(
  [
    clientConfig({
      mode: 'production',
      publicPath: '/',
    }),
  ],
  (err, stats) => {
    // [Stats Object](#stats-object)
    process.stdout.write(stats!.toString() + '\n');

    const indexHtmlPath = path.resolve(__dirname, '../dist/static', 'index.html');
    // Update env configuration
    let indexHtml = readFileSync(indexHtmlPath, { encoding: 'utf-8' });

    indexHtml = indexHtml.replace(
      'window.process = { env: {} };',
      'window.process = { env: ' + JSON.stringify(getClientVars()) + ' };'
    );

    writeFileSync(indexHtmlPath, indexHtml);
  }
);
