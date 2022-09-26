#!/usr/bin/env node

import { runCli } from './cli';
import { logError } from './utils/logger';
// import pkg from '../package.json';
// import updateNotifier from 'update-notifier';

// updateNotifier({ pkg }).notify();

function main() {
  try {
    runCli();
  } catch (error) {
    logError((error as Error).message);
  }
}

main();
