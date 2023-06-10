export type GetTemplateProps<T extends Record<string, string>> = {
  [key in keyof T]: string;
};

export type CallbackFunction = (data?: any) => void;

export type GetFirstParameter<T extends (...args: any[]) => any> = Parameters<T>[0];
