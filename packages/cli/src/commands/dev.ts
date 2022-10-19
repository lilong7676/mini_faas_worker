import path from 'node:path';
import fs from 'node:fs';
import { Client as ClientSDK } from '@mini_faas_worker/sdk';
import {
  logInfo,
  logError,
  logSuccess,
  logSpace,
  logWarn,
} from '../utils/logger';
import Fastify from 'fastify';
import { bundleFunction } from '../utils/deployments';
import chalk from 'chalk';
import { getAssetsDir, getClientFile, getFileToDeploy } from '../utils';
import { extensionToContentType } from '@mini_faas_worker/common';

const fastify = Fastify({
  logger: false,
});

const dateFormatter = Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});
const getDate = () => dateFormatter.format(new Date());

export async function dev(
  file: string,
  {
    client,
    publicDir,
    port,
    host,
  }: {
    client: string;
    publicDir: string;
    port: string;
    host: string;
  }
) {
  const fileToDeploy = getFileToDeploy(file);

  if (!fileToDeploy) {
    return;
  }

  const assetsDir = getAssetsDir(fileToDeploy, publicDir);

  if (!assetsDir) {
    return;
  }

  let clientFile: string | undefined;

  if (client) {
    clientFile = getClientFile(fileToDeploy, client);

    if (!clientFile) {
      return;
    }
  }

  let { code, assets } = await bundleFunction({
    file: fileToDeploy,
    clientFile,
    assetsDir,
  });

  const watcher = fs.watch(path.parse(fileToDeploy).dir, async eventType => {
    if (eventType === 'change') {
      console.clear();
      logInfo('Detected change, recompiling...');

      const { code: newCode, assets: newAssets } = await bundleFunction({
        file: fileToDeploy,
        clientFile,
        assetsDir,
      });
      code = newCode;
      assets = newAssets;

      logSpace();
      logSuccess('Done!');
      logSpace();
    }
  });

  const deployment = {
    assets: assets.map(({ name }) => name),
  };

  process.on('SIGINT', () => {
    watcher.close();

    process.exit();
  });

  fastify.all('/*', async (request, reply) => {
    console.log(
      `${chalk.gray(getDate())} ${chalk.blue.bold(
        request.method
      )} ${chalk.black(request.url)}`
    );

    const asset = deployment.assets.find(asset => request.url === `/${asset}`);

    if (asset) {
      const extension = path.extname(asset);
      console.log(
        chalk.black(
          `            ${chalk.gray('Found asset:')} ${chalk.gray.bold(asset)}`
        )
      );

      reply
        .status(200)
        .header(
          'Content-Type',
          extensionToContentType(extension) || 'text/plain'
        )
        .send(fs.createReadStream(path.join(assetsDir, asset)));
      return;
    }

    if (request.url === '/favicon.ico') {
      reply.code(204);
      return;
    }

    try {
      const response = await ClientSDK.invokeFunctionWithCode(
        code,
        undefined,
        request
      );
      reply.status(200).send(response);
    } catch (error) {
      reply.status(500).header('Content-Type', 'text/html').send();

      logError(
        `An error occured while running the function: ${
          (error as Error).message
        }: ${(error as Error).stack}`
      );
    }
  });

  // get an available port to listen.
  let retryCount = 0;
  async function start(nextPort: number) {
    try {
      const address = await fastify.listen(nextPort, host);
      console.clear();
      logSpace();
      logSuccess(`Dev server running at: ${address}`);
      logSpace();
    } catch (err: any) {
      if (err) {
        if (err.code === 'EADDRINUSE' && retryCount < 10) {
          retryCount++;
          logError(
            `Port ${err.port} is in use, trying ${err.port + 1} instead.`
          );
          await start(err.port + 1);
        } else {
          console.error(err);
          process.exit(1);
        }
      }
    }
  }

  const parsedPort = parseInt(port);
  start(isNaN(parsedPort) ? 1234 : parsedPort);
}
