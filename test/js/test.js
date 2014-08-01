/**
 * Created by valera on 7/14/14.
 */

if (process.env.npm_lifecycle_event === 'test') {
    reporter = 'dot';
    srcPrefix = '../../html/js/';
    baseUrl = './html'
} else {
    reporter = 'html-cov';
    srcPrefix = '../_jsTestFiles/js/';
    baseUrl = 'test' + srcPrefix.slice(2,-3);
}


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
    baseUrl: baseUrl,

    nodeRequire: require
});

TaskMe = require(srcPrefix + 'core/TaskMe');
utils = require(srcPrefix + 'core/utils');
AClass = require(srcPrefix + 'core/AClass');
Class = require(srcPrefix + 'core/Class');
SingletonClass = require(srcPrefix + 'core/SingletonClass');

testRunner = new Mocha({
    ui: 'tdd',
    reporter: reporter
});

testPrefix = './test/js/';
[
    'core/testAClass',
    'core/testClass',
    'core/testSingletonClass',
    'models/testTask',
    'collections/testTaskList'
].forEach(function(file) {
    testRunner.addFile(testPrefix + file);
});
testRunner.run();