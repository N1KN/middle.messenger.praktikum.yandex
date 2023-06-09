import { createStore } from 'lib/state-manager';
import { rootReducer } from './root-reducer';

export const store = createStore(rootReducer);
// store.subscribe((state) => console.log('UPDATE', state));
