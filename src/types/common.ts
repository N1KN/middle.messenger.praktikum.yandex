export type GetTemplateProps<T extends Record<string, string>> = {
    [key in keyof T]: string;
};