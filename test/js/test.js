/**
 * Created by valera on 7/14/14.
 */

assert = require('chai').assert;
dom = require('dom-lite');
Mocha = require('mocha');
_ = require('underscore');
Backbone = require('backbone');
jquery = require('jquery');
$ = jquery;

requirejs = require('requirejs');
define = requirejs.define;

requirejs.config({
    baseUrl: 'html',
    paths: {
//        'jquery.mobile':    'js/lib/jquery.mobile-1.4.3',
        'text':             'js/lib/text-2.0.12',
        'i18n':             'js/lib/i18n-2.0.4'
    },
    shim: {
        'jquery.mobile': {
            deps: ['jquery']
        }
    },

    nodeRequire: require
});

testRunner = new Mocha({ui: 'tdd'/*, reporter: 'html-cov'*/});
[
    'test/js/models/testTask',
    'test/js/collections/testTaskList'
].forEach(function(file) {
        testRunner.addFile(file);
    });
testRunner.run();