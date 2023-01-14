import Handlebars from 'handlebars';
import { buttonTemplate, ButtonTemplateProps, buttonTemplateWithId } from 'components/button/tpl.hbs';
import 'components/button/styles.css';

type ButtonProps = {
    id?: string;
    value: string
}

export const Button = ({id, value}: ButtonProps) => {
    if (id) {
        return Handlebars.compile<ButtonTemplateProps>(buttonTemplate)({ id, value });
    }

    return Handlebars.compile<Omit<ButtonTemplateProps, 'id'>>(buttonTemplateWithId)({ value });
}
