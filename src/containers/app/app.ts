import Handlebars from 'handlebars';
import { AppContainerTemplate, AppContainerTemplateProps } from './app.tpl';
import './styles.pcss';

type AppContainerProps = {
    page: string;
}
export const AppContainer = ({page}: AppContainerProps) => {
    return Handlebars.compile<AppContainerTemplateProps>(AppContainerTemplate)({
        page,
    });
};