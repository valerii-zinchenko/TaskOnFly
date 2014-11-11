// This is for WebStorm test runner only

assert = require('chai').assert;
sinon = require('sinon');
_ = require('underscore');
Backbone = require('backbone');
requirejs = require('requirejs');
define = requirejs.define;


requirejs.config({
    baseUrl: './js/',
    nodeRequire: require
});

var src = '../js/';
AClass = require(src + 'core/AClass');
Class = require(src + 'core/Class');
SingletonClass = require(src + 'core/SingletonClass');
MVCModule = require(src + 'core/MVCModule');
utils = require(src + 'core/utils');

TaskManager = {
    Pages: {},
    Modules: {}
};

require('./mocks');
require('../js/model/TaskOnFly');