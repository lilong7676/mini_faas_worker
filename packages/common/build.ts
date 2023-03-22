import tsup from 'tsup';
import rimraf from 'rimraf';
import path from 'path';
import watch from 'node-watch';

const argv = process.argv.slice(2);

const needWatch = argv[0] === 'watch';

const distDir = path.join(process.cwd(), 'dist');
await rimraf(distDir);

/**
 * 构建 packages
 */
const startBuild = async () => {
  await tsup.build({
    entry: ['src/index.ts'],
    format: 'esm',
    dts: true,
    outDir: distDir,
  });
};

await startBuild();

if (needWatch) {
  watch('src', { recursive: true }, async function (evt, name) {
    await startBuild();
  });
}
