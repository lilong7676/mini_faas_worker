/*
 * runtime domain，只实现了部分规范
 * @Author: lilonglong
 * @Date: 2023-02-13 23:54:23
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-13 14:36:14
 */
import eventDelegate from '../utils/eventDelegate';
import * as objManager from '../manager/objectManager';

const executionContext = {
  id: 1,
  name: 'top',
  origin: '',
};

export function enable() {
  eventDelegate.trigger('Runtime.executionContextCreated', {
    context: executionContext,
  });
}

export function getProperties(params: unknown) {
  return objManager.getProperties(params);
}

export function releaseObject(params: any) {
  objManager.releaseObj(params.objectId);
}
