/**
 * Created by valera on 7/14/14.
 */

assert = require('chai').assert;
dom = require('dom-lite');
Mocha = require('mocha');

requirejs = require('requirejs');
define = requirejs.define;

requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'libs/jQuery',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        }
    },

    nodeRequire: require
});

testRunner = new Mocha({ui: 'tdd'/*, reporter: 'html-cov'*/});
[
    ''
].forEach(function(file) {
        testRunner.addFile(file);
    });
testRunner.run();