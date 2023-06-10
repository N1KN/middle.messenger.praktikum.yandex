const { JSDOM } = require('jsdom');
const { window } = new JSDOM(`<div id="root"></div>`, {
  url: 'http://localhost:3000',
});

global.window = window;
global.document = window.document;
global.FormData = window.FormData;
global.DocumentFragment = window.DocumentFragment;

require.extensions['.pcss'] = function () {
  module.exports = () => ({});
};
