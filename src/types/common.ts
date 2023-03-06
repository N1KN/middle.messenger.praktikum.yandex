export type GetTemplateProps<T extends Record<string, string>> = {
  [key in keyof T]: string;
};

export type CallbackFunction = (data?: any) => void;
