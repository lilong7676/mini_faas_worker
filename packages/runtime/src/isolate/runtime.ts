// import fs from 'node:fs';
// import path from 'node:path';
import ivm from 'isolated-vm';

export async function initRuntime(context: ivm.Context) {
  await context.global.set('global', context.global.derefInto());
  await context.global.set('eval', undefined);
}
