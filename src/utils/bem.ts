import { hasOwnProperty } from 'utils/common';

export declare type ClassNameList = Array<string | undefined>;
export declare type EntityMods = Record<string, string | boolean | number | undefined>;

const modDelimiter = '_';
const elemsDelimiter = '-';

function stringify(block: string, elem?: string, mods?: EntityMods, mix?: ClassNameList) {
  const entityName = elem ? block + elemsDelimiter + elem : block;
  let className = entityName;

  if (mods) {
    const modPrefix = ` ${className}${modDelimiter}`;

    for (const key in mods) {
      if (hasOwnProperty(mods, key)) {
        const modVal = mods[key];

        if (modVal === true) {
          className += ` ${modPrefix}${key}`;
        } else if (modVal) {
          className += ` ${modPrefix}${key}${modDelimiter}${modVal}`;
        }
      }
    }
  }

  if (mix !== undefined) {
    for (let i = 0, len = mix.length; i < len; i++) {
      const value = mix[i];

      // Skipping empty strings and non-string values
      if (!value || typeof value.valueOf() !== 'string') {
        continue;
      }

      const mixes = value.valueOf().split(' ');

      for (let j = 0; j < mixes.length; j++) {
        const val = mixes[j];
        if (val !== entityName) {
          className += ` ${val}`;
        }
      }
    }
  }

  return className;
}

export function cn(b: string) {
  /**
   * @params elemOrMods: string
   * */
  return (elemOrMods?: string, elemModsOrBlockMix?: EntityMods | ClassNameList, elemMix?: ClassNameList) => {
    if (typeof elemOrMods === 'string') {
      if (Array.isArray(elemModsOrBlockMix)) {
        return stringify(b, elemOrMods, undefined, elemModsOrBlockMix);
      }
      return stringify(b, elemOrMods, elemModsOrBlockMix, elemMix);
    }
    return stringify(b, undefined, elemOrMods, elemModsOrBlockMix as ClassNameList);
  };
}
