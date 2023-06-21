import { APP_URLS, MESSAGE_MONTHS } from 'app-constants';

/*
Do not access Object.prototype method 'hasOwnProperty' from target object  no-prototype-builtins
https://eslint.org/docs/latest/rules/no-prototype-builtins
*/
export const hasOwnProperty: (object: unknown, key: PropertyKey) => boolean = Function.prototype.call.bind(
  Object.prototype.hasOwnProperty,
);

export const isDefined = <T>(p: T): p is Exclude<T, undefined> => p !== undefined;

export const isNotNil = <T>(p: T): p is Exclude<T, undefined | null> => isDefined(p) && p !== null;

export const getDate = (time?: string) => {
  const date = new Date(time ?? new Date());
  return {
    minute: date.getMinutes(),
    hour: date.getHours(),
    day: date.getDay() + 1,
    month: date.getMonth(),
    year: date.getFullYear(),
  };
};

export const addLeadingZero = (value: number) => `0${value}`.slice(-2);

export const createFormattedDateString = ({ month, day, hour, minute }: ReturnType<typeof getDate>) =>
  `${addLeadingZero(day)} ${MESSAGE_MONTHS[month]} ${addLeadingZero(hour)}:${addLeadingZero(minute)}`;

export const createUrlToResource = (defaultUrl: string, value?: string | null) =>
  (value ? `${APP_URLS.RESOURCES}${value}` : defaultUrl).toString();

export const setElementByIndex = <A extends Array<E>, E>(array: A, newElement: E, index: number) => {
  if (index + 1 > array.length && index < 0) {
    return array;
  }

  return [...array.slice(0, index), newElement, ...array.slice(index + 1, array.length)];
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

type AnyObject = { [key: string]: any };

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

export const deepAssign = (target: AnyObject, ...sources: AnyObject[]): AnyObject => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepAssign(target[key] as AnyObject, source[key] as AnyObject);
      } else if (Array.isArray(source[key])) {
        if (Array.isArray(target[key])) {
          target[key] = [...(target[key] as any[]), ...(source[key] as any[])]; // Merge arrays
        } else {
          target[key] = [...(source[key] as any[])]; // Copy array if target is not an array
        }
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepAssign(target, ...sources);
};

export const isEqual = (a: any, b: any): boolean => {
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

export function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
  let timeoutID: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<typeof func>, ...args: T) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func.apply(this, args), delay);
  };
}
