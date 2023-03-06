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

export const isArray = (variable: unknown): variable is unknown[] => {
  return Array.isArray(variable);
};

export const isArrayOrObject = (variable: unknown): variable is unknown[] | PlainObject => {
  return isObject(variable) || isArray(variable);
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
