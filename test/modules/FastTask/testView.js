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

'use strict';

suite('Test FastTask.View', function() {
    var Module;
    setup(function(done) {
        requirejs.undef('modules/FastTask/View');
        requirejs(['modules/FastTask/View'], function(View) {
            Module = View;
            done();
        });
    });
    teardown(function() {
        Module = null;
    });

    suite('initialize()', function() {
        test('without arguments', function() {
            assert.throw(function() {
                new Module();
            }, Error, 'Holder element of FastTask module is not defined.');
        });

        test('incorrect argument type', function() {
            assert.throw(function() {
                new Module(':)');
            }, Error, 'Incorrect input argument type');
        });

        test('correct input argument', function() {
            assert.doesNotThrow(function() {
                new Module($);
            });
        });
    });

    test('Is Singleton?', function() {
        assert.equal(new Module($), new Module($), 'View of FastTask should be an singleton class');
    });

    suite('Test class methods', function() {
        var module;
        setup(function() {
            module = new Module($);
        });
        teardown(function() {
            module = null;
        });

        test('render()', function() {
            assert.doesNotThrow(function() {
                module.render();
            });
        });

        test('_addTask()', function() {
            module.control = {_addTask: function(){}};
            sinon.spy(module, 'render');
            sinon.spy(module.control, '_addTask');

            assert.doesNotThrow(function() {
                module._addTask({preventDefault: function(){}});
            });

            assert.equal(module.control._addTask.callCount, 1, '_addTask() of control sub-module should be called');
            assert.equal(module.render.callCount, 1, 'FastTask.View should be refreshed after task is added');
        });
    });
});