import chalk from 'chalk';

export function logError(message: string) {
  console.log(`${chalk.red.bold('error  ')} ${message}`);
}

export function logWarn(message: string) {
  console.log(`${chalk.yellow.bold('warn   ')} ${message}`);
}

export function logSuccess(message: string) {
  console.log(`${chalk.green.bold('success')} ${message}`);
}

export function logInfo(message: string) {
  console.log(`${chalk.blueBright.bold('info   ')} ${chalk.gray(message)}`);
}

export function logSpace() {
  console.log(' ');
}
