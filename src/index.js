import {sum} from './modules/sum';

const root = document.querySelector('#root');
root.textContent = sum(1, -1).toString();