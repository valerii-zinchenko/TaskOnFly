window.assert = chai.assert;
window.sinon = sinon;

//window.$ = window.jQuery = requirejs('jquery');
requirejs(['underscore', 'backbone', 'jquery']);

mocha.setup({
    ui: 'tdd',
    bail: false
});
