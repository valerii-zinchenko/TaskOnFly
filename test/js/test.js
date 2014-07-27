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

AClass = require('../../html/js/patterns/AClass');
Class = require('../../html/js/patterns/Class');
SingletonClass = require('../../html/js/patterns/SingletonClass');

requirejs = require('requirejs');
define = requirejs.define;

requirejs.config({
    baseUrl: 'html',
    paths: {
        'text':         'js/lib/text-2.0.12',
        'i18n':         'js/lib/i18n-2.0.4'
    },

    nodeRequire: require
});

testRunner = new Mocha({ui: 'tdd'/*, reporter: 'html-cov'*/});
[
    'test/js/patterns/testAClass',
    'test/js/patterns/testClass',
    'test/js/patterns/testSingletonClass'/*,
    'test/js/models/testTask',
    'test/js/collections/testTaskList'*/
].forEach(function(file) {
        testRunner.addFile(file);
    });
testRunner.run();