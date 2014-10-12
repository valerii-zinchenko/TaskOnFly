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

suite('HomeControl', function() {
    var Module,
        module;
    setup(function(done) {
        requirejs(['control/HomeControl'], function() {
            Module = TaskManager.HomeControl;
            module = new Module();
            done();
        });

        sinon.spy(TaskOnFly,'changeView');
    });
    teardown(function() {
        TaskOnFly.changeView.restore();
    });

    test('module should be a singleton', function() {
        assert.equal(new Module(), module, 'Module is not a singleton');
    });

    test('addTask()', function() {
        module.addTask();

        assert.equal(TaskOnFly.changeView.callCount, 1, 'TaskOnFly.changeView() was not called');
        assert.equal(TaskOnFly.changeView.args[0][0], 'add/task', 'TaskOnFly.changeView() was called with incorrect argument');
    });

    test('addTask()', function() {
        module.addList();

        assert.equal(TaskOnFly.changeView.callCount, 1, 'TaskOnFly.changeView() was not called');
        assert.equal(TaskOnFly.changeView.args[0][0], 'add/list', 'TaskOnFly.changeView() was called with incorrect argument');
    });
});