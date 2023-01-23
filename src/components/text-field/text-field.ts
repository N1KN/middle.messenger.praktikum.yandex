import Handlebars from 'handlebars';
import { cn } from 'utils/bem';

import './styles.pcss';

const modes = ['default', 'profile'] as const;
type Modes = typeof modes[number];
const defaultMode = modes[0];

type TextFieldProps = {
    className?: string;
    mode?: Modes;
    isDisabled?: boolean;
    title: string;
    errorText?: string;
    type?: 'text' | 'password' | 'tel' | 'email';
    name: string;
    minLength?: number;
    maxLength?: number;
    isRequired?: boolean;
};

const cnTextField = cn('TextField');

export const TextField = (props: TextFieldProps) => {
    const {
        className,
        mode = defaultMode,
        isDisabled,
        type = 'text',
        title,
        name,
        errorText,
        minLength,
        maxLength,
        isRequired,
    } = props;
    const requiredAttr = isRequired ? 'required="true"' : '';
    const disabledAttr = isDisabled ? 'disabled="true"' : '';
    const minLengthAttr = minLength ? `minlength="${minLength}"` : '';
    const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';

    const template = `
    <div class="${cnTextField('', {mode}, [className])}">
        <label class="${cnTextField('inputWrapper')}">
            <input 
                class="${cnTextField('input')}"
                type="${type}"
                name="${name}"
                ${''/* Пустой плейсхолдер нужен для корректной работы css селектора :placeholder-shown*/}
                placeholder=" "
                ${minLengthAttr}
                ${maxLengthAttr}
                ${requiredAttr}
                ${disabledAttr}
            >
            <span class="${cnTextField('title')}">${title}</span>
        </label>
        <p class="${cnTextField('error', {show: errorText !== undefined})}">${errorText ?? ''}</p>
    </div>
    `;

    return Handlebars.compile(template)({});
};