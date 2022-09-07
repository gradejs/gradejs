import webpack from 'webpack';
import { clientConfig } from './client';

// Vercel webpack build for branch deploy previews without SSR
webpack(
  [
    clientConfig('production', false),
  ],
  (err, stats) => {
    // [Stats Object](#stats-object)
    process.stdout.write(stats!.toString() + '\n');
  }
);
