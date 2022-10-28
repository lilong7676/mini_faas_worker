import path from 'node:path';
import fs from 'node:fs';
import { LocalDeploymentsDir } from './deployments';

export async function fetchAndSaveOSSFile(deploymentId: string) {
  const fakeOssFilePath = path.resolve(
    process.cwd(),
    `../gateway/.fakeOSS/${deploymentId}/index.js`
  );
  const copyDestDir = path.join(LocalDeploymentsDir, deploymentId);
  const copyDest = path.join(copyDestDir, `index.js`);
  await fs.promises.mkdir(copyDestDir, { recursive: true });
  await fs.promises.copyFile(fakeOssFilePath, copyDest);
}
