import Handlebars from 'handlebars';
import { linkButtonTemplate, LinkButtonTemplateProps } from './link-button.tpl';
import './styles.pcss';

type LinkButtonProps = {
  className?: string;
  url: string;
  text: string;
};

export const LinkButton = ({ url, text, className }: LinkButtonProps) => {
  const additionalClassName = className ? ` ${className}` : '';
  return Handlebars.compile<LinkButtonTemplateProps>(linkButtonTemplate)({ url, text, additionalClassName });
};
