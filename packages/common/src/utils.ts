import { Stream } from 'stream';

const regObj = /^\[object\s+(.*?)]$/;

const fnToStr = Function.prototype.toString;

// 参考 https://stackoverflow.com/a/67729663/11825450
export async function stream2buffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();

    stream.on('data', chunk => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', err => reject(`error converting stream - ${err}`));
  });
}

export function toStr(val: any): string {
  return val == null ? '' : val.toString();
}

export function isFn(val: any): boolean {
  const objStr = Object.prototype.toString.call(val);

  return (
    objStr === '[object Function]' ||
    objStr === '[object GeneratorFunction]' ||
    objStr === '[object AsyncFunction]'
  );
}

export function isEl(val: any): boolean {
  return !!(val && val.nodeType === 1);
}

export function isErr(val: unknown): val is Error {
  return Object.prototype.toString.call(val) === '[object Error]';
}

export function isMap(val: unknown): val is Map<unknown, unknown> {
  return Object.prototype.toString.call(val) === '[object Map]';
}

export function isSet(val: unknown): val is Set<unknown> {
  return Object.prototype.toString.call(val) === '[object Set]';
}

export function isRegExp(val: unknown): val is RegExp {
  return Object.prototype.toString.call(val) === '[object RegExp]';
}

export function isBuffer(val: any): val is Buffer {
  if (val == null) return false;
  if (val._isBuffer) return true;

  return (
    val.constructor &&
    isFn(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  );
}

export function isNum(val: unknown): val is number {
  return Object.prototype.toString.call(val) === '[object Number]';
}

export function isNaN(val: unknown): val is typeof NaN {
  return isNum(val) && val !== +val;
}

export function getValueType(val: any, lower = true) {
  let ret;
  if (val === null) ret = 'Null';
  if (val === undefined) ret = 'Undefined';
  if (isNaN(val)) ret = 'NaN';
  if (isBuffer(val)) ret = 'Buffer';

  if (!ret) {
    ret = Object.prototype.toString.call(val).match(regObj);
    if (ret) ret = ret[1];
  }

  if (!ret) return '';

  return lower ? toStr(lower).toLocaleLowerCase() : ret;
}

/**
 * Convert function to its source code.
 * example
 * toSrc(Math.min); // -> 'function min() { [native code] }'
 * toSrc(function() {}); // -> 'function () { }'
 */
export function toSrc(fn: any) {
  if (fn === null) return '';

  try {
    return fnToStr.call(fn);
    /* eslint-disable no-empty */
  } catch (e) {}

  try {
    return fn + '';
    /* eslint-disable no-empty */
  } catch (e) {}

  return '';
}

export function isObj(val: any) {
  const type = typeof val;

  return !!val && (type === 'function' || type === 'object');
}

const getPrototypeOf = Object.getPrototypeOf;
const ObjectCtr = {}.constructor;
export function getProto(obj: any) {
  if (!isObj(obj)) return;

  if (getPrototypeOf) return getPrototypeOf(obj);

  const proto = obj.__proto__;
  if (proto || proto === null) return proto;
  if (isFn(obj.constructor)) return obj.constructor.prototype;
  if (obj instanceof ObjectCtr) return ObjectCtr.prototype;
}

const getOwnPropertyNames = Object.getOwnPropertyNames;
const getOwnPropertySymbols = Object.getOwnPropertySymbols;
/* Retrieve all the names of object's own and inherited properties.
 *
 * |Name   |Desc                       |
 * |-------|---------------------------|
 * |obj    |Object to query            |
 * |options|Options                    |
 * |return |Array of all property names|
 *
 * Available options:
 *
 * |Name              |Desc                     |
 * |------------------|-------------------------|
 * |prototype=true    |Include prototype keys   |
 * |unenumerable=false|Include unenumerable keys|
 * |symbol=false      |Include symbol keys      |
 *
 * Members of Object's prototype won't be retrieved.
 */

/* example
 * const obj = Object.create({ zero: 0 });
 * obj.one = 1;
 * allKeys(obj); // -> ['zero', 'one']
 *
 */
export function allKeys(
  obj: any,
  { prototype = true, unenumerable = false, symbol = false } = {}
) {
  let ret: (string | symbol)[] = [];

  if ((unenumerable || symbol) && getOwnPropertyNames) {
    let getKeys = Object.keys;
    if (unenumerable && getOwnPropertyNames) {
      getKeys = getOwnPropertyNames;
    }
    do {
      ret = ret.concat(getKeys(obj));
      if (symbol && getOwnPropertySymbols) {
        ret = ret.concat(getOwnPropertySymbols(obj));
      }
    } while (prototype && (obj = getProto(obj)) && obj !== Object.prototype);
    ret = Array.from(new Set(ret));
  } else {
    if (prototype) {
      for (const key in obj) ret.push(key);
    } else {
      ret = Object.keys(obj);
    }
  }

  return ret;
}

/* Check if value is a native function.
 *
 * |Name  |Desc                              |
 * |------|----------------------------------|
 * |val   |Value to check                    |
 * |return|True if value is a native function|
 */

/* example
 * isNative(function() {}); // -> false
 * isNative(Math.min); // -> true
 */
export function isNative(val: any): boolean {
  if (!isObj(val)) return false;

  if (isFn(val)) return regIsNative.test(toSrc(val));

  // Detect host constructors (Safari > 4; really typed array specific)
  return regIsHostCtor.test(toSrc(val));
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const regIsNative = new RegExp(
  '^' +
    toSrc(hasOwnProperty)
      .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(
        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
        '$1.*?'
      ) +
    '$'
);

const regIsHostCtor = /^\[object .+?Constructor\]$/;

export function isSymbol(val: any): boolean {
  return typeof val === 'symbol';
}

const hasOwnProp = Object.prototype.hasOwnProperty;
export function has(obj: Record<PropertyKey, any>, key: PropertyKey) {
  return hasOwnProp.call(obj, key);
}
