import cluster from 'node:cluster';
import master from './cluster/master';
import worker from './cluster/worker';

if (cluster.isPrimary) {
  master();
} else {
  worker();
}
