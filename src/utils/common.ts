/*
Do not access Object.prototype method 'hasOwnProperty' from target object  no-prototype-builtins
https://eslint.org/docs/latest/rules/no-prototype-builtins
*/

export const hasOwnProperty: (object: unknown, key: PropertyKey) => boolean = Function.prototype.call.bind(
  Object.prototype.hasOwnProperty,
);

export const getDate = (time: string) => {
  const date = new Date(time);
  return {
    minute: date.getMinutes(),
    hour: date.getHours(),
    day: date.getDay() + 1,
    month: date.getMonth(),
  };
};

export const getType = (e: any, low = true) => {
  const tmpResult = Object.prototype.toString.call(e).replace(/^\[\w*\s|]$/g, '');
  if (low) {
    return tmpResult.toLocaleLowerCase();
  } else {
    return tmpResult;
  }
};

export const getHTMLElementType = (e: any, low = true) => {
  if (Object.prototype.isPrototypeOf.call(HTMLElement.prototype, e)) {
    const tmpResult = getType(e, false).replace(/^HTML|Element$/g, '');
    return low ? tmpResult.toLocaleLowerCase() : tmpResult;
  } else {
    const tmpResult = 'NotHTMLElement';
    return low ? tmpResult.toLocaleLowerCase() : tmpResult;
  }
};
export const deepAssign = (target: Record<string, any>, ...sources: Record<string, any>[]) => {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (getType(target) === 'object' && getType(source) === 'object') {
    for (const key in source) {
      if (getType(source[key]) === 'object') {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        } else {
          target[key] = Object.assign({}, target[key]);
        }
        deepAssign(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  deepAssign(target, ...sources);
  return target;
};

export type PlainObject<T = unknown> = {
  [k in string]: T;
};

export const isObject = (variable: unknown): variable is PlainObject => {
  return (
    typeof variable === 'object' &&
    getType(variable) === 'object' &&
    variable !== null &&
    variable.constructor === Object
  );
};

export const isEqual = (a: PlainObject, b: PlainObject): boolean => {
  if (!isObject(a) || !isObject(b)) {
    return a === b;
  }

  for (const key in a) {
    let result;
    if (isObject(a[key]) && isObject(b[key])) {
      result = isEqual(a[key] as PlainObject<unknown>, b[key] as PlainObject<unknown>);
    } else {
      result = a[key] === b[key];
    }
    if (!result) {
      return false;
    }
  }
  return true;
};

export const trim = (string: string, chars?: string): string => {
  const str = ' ' + string + ' ';

  if (str && chars === undefined) {
    return string.trim();
  }

  if (!str || !chars) {
    return string || '';
  }

  const regFirst = new RegExp(` ${chars}`, 'gi');
  const regSecond = new RegExp(`${chars} `, 'gi');

  return str.replace(regFirst, '').replace(regSecond, '').trim();
};

function merge(lhs: Record<string, any>, rhs: Record<string, any>): Record<string, any> {
  for (const p in rhs) {
    if (!hasOwnProperty(rhs, p)) {
      continue;
    }

    try {
      if (rhs[p].constructor === Object) {
        rhs[p] = merge(lhs[p] as Record<string, any>, rhs[p] as Record<string, any>);
      } else {
        lhs[p] = rhs[p];
      }
    } catch (e) {
      lhs[p] = rhs[p];
    }
  }

  return lhs;
}

export function set(
  object: Record<string, any> | unknown,
  path: string,
  value: unknown,
): Record<string, any> | unknown {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  const result = path.split('.').reduceRight<Record<string, any>>(
    (acc, key) => ({
      [key]: acc,
    }),
    value as any,
  );
  return merge(object as Record<string, any>, result);
}

export function cloneDeep<T extends object = object>(obj: T) {
  const objectTypeGuard = (value: any): value is Record<PropertyKey, any> =>
    typeof value === 'object' && value instanceof Object;

  return (function _cloneDeep(item: T): T | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
    if (item === null || typeof item !== 'object') {
      return item;
    }

    if (item instanceof Date) {
      return new Date(item.valueOf());
    }

    if (item instanceof Array) {
      const copy: any[] = [];

      item.forEach((_, i) => (copy[i] = _cloneDeep(item[i])));

      return copy;
    }

    if (item instanceof Set) {
      const copy = new Set();

      item.forEach((v) => copy.add(_cloneDeep(v)));

      return copy;
    }

    if (item instanceof Map) {
      const copy = new Map();

      item.forEach((v, k) => copy.set(k, _cloneDeep(v)));

      return copy;
    }

    if (objectTypeGuard(item)) {
      const copy: Record<PropertyKey, any> = {};

      // TODO: Разобраться, как тут использовать type-guard
      // @ts-ignore
      Object.getOwnPropertySymbols(item).forEach((s) => (copy[s] = _cloneDeep(item[s])));
      // @ts-ignore
      Object.keys(item).forEach((k) => (copy[k] = _cloneDeep(item[k])));

      return copy;
    }

    throw new Error(`Unable to copy object: ${item}`);
  })(obj);
}

type StringIndexed = Record<string, any>;

export const queryStringify = (data: StringIndexed): string | never => {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const endLine = index < keys.length - 1 ? '&' : '';

    if (Array.isArray(value)) {
      const arrayValue = value.reduce<StringIndexed>(
        (result, arrData, index) => ({
          ...result,
          [`${key}[${index}]`]: arrData,
        }),
        {},
      );

      return `${result}${queryStringify(arrayValue)}${endLine}`;
    }

    if (typeof value === 'object') {
      const objValue = Object.keys(value || {}).reduce<StringIndexed>(
        (result, objKey) => ({
          ...result,
          [`${key}[${objKey}]`]: value[objKey],
        }),
        {},
      );

      return `${result}${queryStringify(objValue)}${endLine}`;
    }

    return `${result}${key}=${value}${endLine}`;
  }, '');
};
