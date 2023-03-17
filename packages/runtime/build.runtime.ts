import * as esbuild from 'esbuild';
import tsup from 'tsup';
import { glob } from 'glob';
import rimraf from 'rimraf';
import path from 'path';
import watch from 'node-watch';

const argv = process.argv.slice(2);

const needWatch = argv[0] === 'watch';

const distDir = path.join(process.cwd(), 'dist');
await rimraf(distDir);

/**
 * 构建 src/runtime/**\/*.ts (注入到 isolate 中的 runtime)
 */
const buildRuntimeForInjectIsolate = async () => {
  const runtimeDistDir = path.join(distDir, 'runtime');

  const jsfiles = await glob('src/runtime/**/*.ts', {
    ignore: 'node_modules/**',
  });

  await esbuild.build({
    entryPoints: jsfiles,
    bundle: true,
    outdir: runtimeDistDir,
    format: 'esm',
    logLevel: 'debug',
  });
};

/**
 * 构建 packages/runtime
 */
const buildPackageRuntime = async () => {
  await tsup.build({
    entry: ['src/index.ts'],
    format: 'esm',
    dts: true,
    outDir: distDir,
  });
};

await buildRuntimeForInjectIsolate();
await buildPackageRuntime();

if (needWatch) {
  watch('src', { recursive: true }, async function (evt, name) {
    await buildRuntimeForInjectIsolate();
    await buildPackageRuntime();
  });
}
