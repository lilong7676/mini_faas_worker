import path from 'node:path';
import fs from 'node:fs';
import { Deployment } from '@mini_faas_worker/types';
import { FastifyRequest } from 'fastify';

export const LocalDeploymentsDir = path.join(process.cwd(), '.deployments');

// deploymentHost 与 deployment 的映射
export const deploymentCache = new Map<string, Deployment>();

export const getDeploymentFromRequest = (request: FastifyRequest) => {
  const { url, protocol } = request;
  const { host } = request.headers; // localhost:port
  const fullUrl = new URL(`${protocol}://${host}${url}`); // http://localhost:port/path?query=*
  const deploymentHost = `${fullUrl.host}${fullUrl.pathname}`; // localhost:port/path

  return deploymentCache.get(deploymentHost);
};

export const getDeploymentCode = async (deploymentId: string) => {
  const codePath = path.join(LocalDeploymentsDir, deploymentId, 'index.js');
  return fs.promises.readFile(codePath, 'utf8');
};
