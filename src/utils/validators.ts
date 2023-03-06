type Validator = (text: string) => boolean;
export const createTextValidator =
  (...validators: Validator[]) =>
  (text: string) =>
    validators.every((validator) => validator(text));

export const validatePhone: Validator = (text) => /^[\d+]\d{8,13}\d$/i.test(text);
export const validateEmail: Validator = (text) => /^\w[\w-.]*@[\w-]+\.[a-z]{2,4}$/i.test(text);
export const validateName: Validator = (text) => /^[A-ZА-ЯЁ][a-zA-Zа-яёА-ЯЁ-]+$/.test(text);
export const validateLogin: Validator = (text) => /^[a-zA-Z][a-zA-Z0-9]+$/i.test(text);
export const validatePassword: Validator = (text) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]+$/.test(text);

export const validateMinLength: (min: number) => Validator = (min: number) => (text) => text.length >= min;
export const validateMaxLength: (max: number) => Validator = (max: number) => (text) => text.length <= max;
