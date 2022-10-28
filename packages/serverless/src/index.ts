/*
 * 采用 nodejs cluster 模式监听函数的部署与触发执行
 * @Author: lilonglong
 * @Date: 2022-10-20 22:03:18
 * @Last Modified by: lilonglong
 * @Last Modified time: 2022-10-28 11:22:25
 */

import cluster from 'node:cluster';
import master from './cluster/master';
import worker from './cluster/worker';

if (cluster.isPrimary) {
  master();
} else {
  worker();
}
