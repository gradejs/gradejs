import webpack from 'webpack';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { clientConfig } from './client';
import { serverConfig } from './server';

const args = yargs(hideBin(process.argv))
  .option('production', {
    alias: 'p',
    type: 'boolean',
    description: 'Run in production mode',
    default: false,
  })
  .option('watch', {
    alias: 'w',
    type: 'boolean',
    description: 'Watch changes',
    default: false,
  })
  .parse();

const publicPath = '/static/';

webpack(
  [
    clientConfig({
      mode: args.production ? 'production' : 'development',
      watch: args.watch,
      publicPath,
    }),
    serverConfig({
      mode: args.production ? 'production' : 'development',
      watch: args.watch,
      publicPath,
    }),
  ],
  (err, stats) => {
    if (stats?.hasErrors()) {
      process.stderr.write(
        stats?.stats?.map((s) => s.compilation.errors.map((e) => e.toString())).join('\n')
      );
      process.exit(1);
    }
    // [Stats Object](#stats-object)
    process.stdout.write(stats!.toString() + '\n');
  }
);
