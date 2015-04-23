window.assert = chai.assert;
window.sinon = sinon;

requirejs(['underscore', 'backbone', 'jquery']);

mocha.setup({
    ui: 'tdd',
    bail: false
});
