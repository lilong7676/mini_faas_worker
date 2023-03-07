import { program } from 'commander';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from '../package.json';
import { dev } from './commands/dev';

export function runCli() {
  program
    .name('mini_faas_worker')
    .description('mini_faas_worker demo')
    .version(version);
  program
    .command('dev')
    .description('Launch a local dev server')
    .argument('<file>', 'The file to serve')
    .option('--port <port>', 'Specify dev server port number', '1234')
    .option('--host <host>', 'Specify dev server host name', 'localhost')
    .option('-c, --client <file>', 'Bundle this file as a client-side script')
    .option(
      '-p, --public-dir <dir>',
      'The directory to serve the public assets from',
      'public'
    )
    .action(dev);
  program.parse();
}
