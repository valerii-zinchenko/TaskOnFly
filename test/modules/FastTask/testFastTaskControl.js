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

suite('FastTask', function() {
    var Module,
        module,
        list;
    setup(function(done) {
        requirejs(['modules/FastTask/Control'], function(FastTaskControl) {
            Module = FastTaskControl;
            module = new Module();

            list = TaskOnFly.getCurrentList();
            sinon.spy(list, 'addTask');

            done();
        });
    });
    teardown(function() {
        list.addTask.restore();
    });

    test('_addTask(undefined, undefined)', function() {
        module._addTask();

        assert.equal(list.addTask.callCount, 0, 'TaskOnFly.getCurrentList().addTask() was called');
    });

    test('_addTask(title, undefined)', function() {
        var title = 'title';
        module._addTask(title);

        assert.equal(list.addTask.callCount, 1, 'TaskOnFly.getCurrentList().addTask() was called incorrect times');
        assert.equal(list.addTask.args[0][0].title, title, 'Incorrect first argument');
        assert.isUndefined(list.addTask.args[0][0].priority, 'Second argument should be undefined');
    });

    test('_addTask(title, undefined)', function() {
        var title = 'title',
            priority = 3;

        module._addTask(title, priority);

        assert.equal(list.addTask.callCount, 1, 'TaskOnFly.getCurrentList().addTask() was called incorrect times');
        assert.equal(list.addTask.args[0][0].title, title, 'Incorrect first argument');
        assert.equal(list.addTask.args[0][0].priority, priority, 'Incorrect second argument');
    });
});