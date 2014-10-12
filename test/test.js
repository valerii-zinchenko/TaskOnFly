/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/

if (process.env.npm_lifecycle_event === 'start') {
//    reporter = 'spec';
    reporter = 'html-cov';
    srcPrefix = './_jsTestFiles/';
    baseUrl = './test' + srcPrefix.slice(1);
    libUrl = './js/lib/';

    // be quite
    console.log = function(){};
} else {
    reporter = 'spec';
    srcPrefix = '../js/';
    baseUrl = './js';
    libUrl = 'js/lib/';
}

TaskManager = {};
assert = require('chai').assert;
sinon = require('sinon');
dom = require('dom-lite');
Mocha = require('mocha');
_ = require('underscore');
Backbone = require('backbone');

requirejs = require('requirejs');
define = requirejs.define;

requirejs.config({
    baseUrl: baseUrl,
    paths: {
        'i18n': libUrl + 'i18n-2.0.4'
    },

    nodeRequire: require
});

requirejs('./test/moks.js');

AClass = require(srcPrefix + 'core/AClass');
Class = require(srcPrefix + 'core/Class');
SingletonClass = require(srcPrefix + 'core/SingletonClass');
require(srcPrefix + 'model/TaskOnFly');
utils = require(srcPrefix + 'core/utils').utils;
Template = require(srcPrefix + 'core/utils').Template;

testRunner = new Mocha({
    ui: 'tdd',
    reporter: reporter
});

testPrefix = './test/';
[
    'core/testAClass',
    'core/testClass',
    'core/testSingletonClass',
    'core/test_utils',

    'model/testTaskOnFly',
    'model/testTask',
    'model/testTaskList',
    'model/testMainRouter',

    'control/testListControl',
    'control/testHomeControl',
    'control/testEditItemControl',

    'test_main',

    'modules/FastTask/testFastTaskControl',
    'modules/SimpleSearch/testSimpleSearchControl'
].forEach(function(file) {
    testRunner.addFile(testPrefix + file);
});

testRunner.run();