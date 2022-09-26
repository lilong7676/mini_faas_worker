import fs from 'node:fs';
import { build } from 'esbuild';
import path from 'node:path';
import { logDeploymentSuccessful, logError, logInfo } from './logger';
import { API_URL } from './constants';
import fetch, { FormData, File } from 'node-fetch';

export const CONFIG_DIRECTORY = path.join(process.cwd(), '.mini_faas_worker');

export async function bundleFunction({
  file,
  clientFile,
  assetsDir,
}: {
  file: string;
  clientFile?: string;
  assetsDir: string;
}): Promise<{ code: string; assets: { name: string; content: string | Buffer }[] }> {
  const assets: { name: string; content: string | Buffer }[] = [];

  logInfo('Bundling function handler...');

  const { outputFiles } = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.js': 'js',
      '.jsx': 'jsx',
    },
    format: 'esm',
    target: 'es2020',
    platform: 'browser',
    // TODO: minify identifiers
    // Can't minify identifiers yet because `masterHandler` in runtime
    // needs to call a `handler` function.
    // TODO: not working with react, find why
    // minifyWhitespace: true,
    minifySyntax: true,
  });

  if (clientFile) {
    logInfo(`Bundling client file...`);

    const { outputFiles: clientOutputFiles } = await build({
      entryPoints: [clientFile],
      bundle: true,
      write: false,
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx',
      },
      format: 'esm',
      target: 'es2020',
      platform: 'browser',
      // TODO: minify identifiers
      // Can't minify identifiers yet because `masterHandler` in runtime
      // needs to call a `handler` function.
      minifyWhitespace: true,
      minifySyntax: true,
    });

    assets.push({
      name: `${path.basename(clientFile).toLowerCase()}.js`,
      content: clientOutputFiles[0].text,
    });
  }

  if (fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
    logInfo(`Found public directory (${path.basename(assetsDir)}), bundling assets...`);

    const getAssets = (directory: string, root?: string): { name: string; content: string | Buffer }[] => {
      const assets: { name: string; content: string | Buffer }[] = [];
      const files = fs.readdirSync(directory);

      for (const file of files) {
        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath);

          assets.push({
            name: root ? root + '/' + file : file,
            content,
          });
        } else {
          assets.push(...getAssets(filePath, root ? root + '/' + file : file));
        }
      }

      return assets;
    };

    assets.push(...getAssets(assetsDir));
  } else {
    logInfo('No public directory found, skipping...');
  }

  return {
    code: outputFiles[0].text,
    assets,
  };
}
