/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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

if (process.env.npm_lifecycle_event === 'test') {
    reporter = 'spec';
    srcPrefix = '../../html/js/';
    baseUrl = './html';
    libUrl = 'js/lib/';
    templatesUrl = '';
} else {
    reporter = 'html-cov';
    srcPrefix = '../_jsTestFiles/js/';
    baseUrl = 'test' + srcPrefix.slice(2,-3);
    libUrl = '../../html/js/lib/';
    templatesUrl = '../../html/templates';
}


assert = require('chai').assert;
dom = require('dom-lite');
Mocha = require('mocha');
_ = require('underscore');
Backbone = require('backbone');

requirejs = require('requirejs');
define = requirejs.define;

requirejs.config({
    baseUrl: baseUrl,
    paths: {
        'text': libUrl + 'text-2.0.12',
        'i18n': libUrl + 'i18n-2.0.4',
        'templates': templatesUrl
    },

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
    'core/testTaskMe',
    'core/test_utils',
    'test_main',
    'models/testTask',
    'collections/testTaskList'
].forEach(function(file) {
    testRunner.addFile(testPrefix + file);
});

requirejs('./test/js/moks.js');

testRunner.run();