import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

const modes = ['default', 'profile'] as const;
type Modes = (typeof modes)[number];
const defaultMode = modes[0];

type TextFieldProps = {
  className?: string;
  mode?: Modes;
  isDisabled?: boolean;
  title: string;
  errorText?: string;
  type?: 'text' | 'password' | 'tel' | 'email' | 'file';
  name: string;
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  value?: string;
  onChange?: ({ e, value }: { e: InputEvent; value: string }) => void;
  onBlur?: (e: FocusEvent) => void;
};

const cnTextField = cn('TextField');

export class TextField extends Block<TextFieldProps> {
  static setInputInvalidState(el: HTMLInputElement, isValid: boolean) {
    el.dataset['error'] = !isValid ? 'show' : undefined;
  }
  constructor(props: TextFieldProps) {
    const { onChange, onBlur, ...otherProps } = props;

    const events = {
      input: (e: InputEvent) => {
        if (onChange) {
          onChange({
            e,
            value: (e.target as HTMLInputElement).value,
          });
        }
      },
      blur: (e: FocusEvent) => {
        if (onBlur) {
          onBlur(e);
        }
      },
    };

    super({ ...otherProps, events }, 'input');
  }

  render() {
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
      value,
    } = this.props;
    const requiredAttr = isRequired ? 'required="true"' : '';
    const disabledAttr = isDisabled ? 'disabled="true"' : '';
    const minLengthAttr = minLength ? `minlength="${minLength}"` : '';
    const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';

    const template = `
    <label class="${cnTextField('', { mode, isDisabled }, [className])}">
        <input
            class="${cnTextField('input')}"
            type="${type}"
            name="${name}"
            ${'' /* Пустой плейсхолдер нужен для корректной работы css селектора :placeholder-shown*/}
            placeholder=" "
            ${minLengthAttr}
            ${maxLengthAttr}
            ${requiredAttr}
            ${disabledAttr}
            value="{{value}}"
        >
        <span class="${cnTextField('title')}">${title}</span>
        <p class="${cnTextField('error', { show: errorText !== undefined })}">${errorText ?? ''}</p>
    </label>
    `;

    return this.compile(template, { value });
  }
}
