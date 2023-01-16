import Handlebars from 'handlebars';
import { cn } from 'utils/bem';
import './styles.pcss';

type TextFieldProps = {
    className?: string;
    title: string;
    errorText?: string;
    type?: 'text'|'password'|'tel'|'mail';
    name: string;
    minLength?: number;
    maxLength?: number;
    isRequired?: boolean;
};

const cnTextField = cn('TextField')

export const TextField = ({ className, type = 'text', title, name, errorText, minLength, maxLength, isRequired }: TextFieldProps) => {
    const requiredAttr = isRequired ? 'required="true"' : '';

    const template = `
    <div class="${cnTextField('', [className])}">
        <label class="${cnTextField('inputWrapper')}">
            <input 
                class="${cnTextField('input')}"
                type="${type}"
                name="${name}"
                minlength="${minLength}"
                maxlength="${maxLength}"
                ${''/* Пустой плейсхолдер нужен для корректной работы css селектора :placeholder-shown*/}
                placeholder=" "
                ${requiredAttr}
            >
            <span class="${cnTextField('title')}">${title}</span>
        </label>
        <p class="${cnTextField('error', { show: errorText !== undefined })}">${errorText ?? ''}</p>
    </div>
    `;

    return Handlebars.compile(template)({});
};