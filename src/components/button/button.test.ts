import chai from 'chai';
import chaiDom from 'chai-dom';
import sinon, { SinonSpy } from 'sinon';
import { Button } from './button';

chai.use(chaiDom);
describe('Button', () => {
  it('Должен рендирится компонент', () => {
    new Button({ label: 'Click me', onClick: () => null });
  });

  let mockFunction: SinonSpy;

  beforeEach(() => {
    mockFunction = sinon.fake();
  });

  it('При клике должна сработать функция onClick', () => {
    const instance = new Button({ label: 'Кнопка', onClick: mockFunction });

    const element = instance.element!;
    element?.click();

    chai.expect(mockFunction.callCount).to.eq(1);
  });

  it('При установке поля isSubmit у элемента должен быть аргумент [type="submit"]', () => {
    const instance = new Button({
      label: 'Кнопка',
      onClick: mockFunction,
      isSubmit: true,
    });

    const element = instance.element;
    element?.click();

    chai.expect(element).to.have.attr('type', 'submit');
  });
});
