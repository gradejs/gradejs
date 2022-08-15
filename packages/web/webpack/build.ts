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

webpack(
  [
    clientConfig(args.production ? 'production' : 'development', args.watch),
    serverConfig(args.production ? 'production' : 'development', args.watch),
  ],
  (err, stats) => {
    // [Stats Object](#stats-object)
    process.stdout.write(stats!.toString() + '\n');
  }
);
