/*
Do not access Object.prototype method 'hasOwnProperty' from target object  no-prototype-builtins
https://eslint.org/docs/latest/rules/no-prototype-builtins
*/
export const hasOwnProperty: (object: unknown, key: PropertyKey) => boolean = Function.prototype.call.bind(
  Object.prototype.hasOwnProperty,
);
