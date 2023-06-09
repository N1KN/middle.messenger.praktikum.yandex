import { TextField } from 'components/text-field';
import { EventBus } from 'lib/event-bus';
import sanitizeHtml from 'sanitize-html';
import { CallbackFunction } from 'types/common';
import { getHTMLElementType } from 'utils/common';

type Validator = (text: string) => boolean;
type ValidateFormConfig = {
  onlyConfiguredKeys?: boolean;
  form: HTMLFormElement;
  validators?: {
    [key: string]: Validator;
  };
  equality?: {
    [key: string]: string;
  };
};
export class FormHandler {
  static readonly eventName = 'submit';
  private _eventBus!: () => EventBus;
  private readonly _form!: HTMLFormElement;
  private readonly _validatorMap!: Required<ValidateFormConfig>['validators'];
  private readonly _equalityMap!: Required<ValidateFormConfig>['equality'];
  private readonly _nameValidityMap: Map<string, boolean> = new Map();
  private _formKeys: string[] = [];
  private _onlyConfiguredKeys = true;

  constructor(props: ValidateFormConfig) {
    // const {form, ...otherProps} = props

    const eventBus = new EventBus();
    this._eventBus = () => eventBus;
    this._form = props.form;
    this._validatorMap = props.validators ?? {};
    this._equalityMap = props.equality ?? {};

    const formKeys = new Set(Object.keys(this._validatorMap));
    const equalityFormKeys = Object.entries(this._equalityMap).flat();
    equalityFormKeys.forEach((value) => formKeys.add(value));

    this._formKeys = Array.from(formKeys.values());
    this._formKeys.forEach((key) => this._nameValidityMap.set(key, false));

    this._onlyConfiguredKeys = props.onlyConfiguredKeys ?? true;

    // FormHandler.__instance = this;

    return this;
  }

  public subscribeSubmit(callback: CallbackFunction): void {
    this._eventBus().on(FormHandler.eventName, callback);
  }

  public unsubscribeSubmit(callback: CallbackFunction): void {
    this._eventBus().off(FormHandler.eventName, callback);
  }

  protected _inputFocusHandler = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      return;
    }
  };

  protected _inputBlurHandler = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      const isValid = this._isValidInput(e.target);
      TextField.setInputInvalidState(e.target, isValid);
    }
  };

  protected _formSubmitHandler = (e: SubmitEvent) => {
    if (e.target instanceof HTMLFormElement || e.composedPath().includes(this._form)) {
      e.stopPropagation();
      e.preventDefault();
      this._onSubmit(this._form);
    }
  };

  public setListeners(form: HTMLFormElement): void {
    const inputs = this._queryElements(form);
    inputs.forEach((input) => {
      input.addEventListener('focus', this._inputFocusHandler);
      input.addEventListener('blur', this._inputBlurHandler);
    });

    form.addEventListener('submit', this._formSubmitHandler);
  }

  public removeListeners(form: HTMLFormElement) {
    const inputs = this._queryElements(form);
    inputs.forEach((input) => {
      input.removeEventListener('focus', this._inputFocusHandler);
      input.removeEventListener('blur', this._inputBlurHandler);
    });

    form.removeEventListener('submit', this._formSubmitHandler);
  }

  public checkIsValid = () => Array.from(this._nameValidityMap.values()).every((isValid) => isValid);

  private async _onSubmit(form: HTMLFormElement) {
    const inputs = this._queryElements(form);

    let isFormValid = true;
    inputs.forEach((input) => {
      if (input.type === 'text') {
        input.value = sanitizeHtml(input.value);
      }
      if (!this._isValidInput(input)) {
        isFormValid = false;
        TextField.setInputInvalidState(input, false);
      }
    });
    if (!isFormValid) {
      return;
    }

    const formData = new FormData(form);
    let entries: [string, string][] = Array.from(formData.entries()) as [string, string][];

    if (this._onlyConfiguredKeys) {
      entries = entries.filter(([key]) => this._formKeys.includes(key));
    }

    this._eventBus().emit(FormHandler.eventName, Object.fromEntries(entries));
  }

  private _isValidInput(inputElement: HTMLInputElement) {
    const validator = this._validatorMap[inputElement.name];
    const isValid = validator ? validator(inputElement.value) : true;

    const equalityTargetName: string | null = this._equalityMap[inputElement.name] ?? null;
    const equalityTarget = this._form.elements.namedItem(equalityTargetName) as HTMLInputElement | null;

    const isEqual = equalityTarget !== null ? inputElement.value === equalityTarget.value : true;

    return isValid && isEqual;
  }

  private _queryElements(form: HTMLFormElement): HTMLInputElement[] {
    return this._formKeys.reduce((prev, nextKey) => {
      const element = form.elements.namedItem(nextKey);
      if (element && getHTMLElementType(element) === 'input') {
        return [...prev, element as HTMLInputElement];
      }

      return prev;
    }, [] as HTMLInputElement[]);
  }
}
