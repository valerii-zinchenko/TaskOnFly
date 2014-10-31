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

suite('ItemEditor.Control', function() {
    var Module,
        module;
    var taskList;
    setup(function(done) {
        requirejs(['pages/ItemEditor/Control'], function(Control) {
            Module = Control;
            module = new Module();

            taskList = new TaskManager.TaskList('root', {id: 'root'});
            done();
        })
    });
    teardown(function() {
        module.item = null;
        module._callback = null;

        window.localStorage.storage = {};
    });

    test('setItem(no item)', function() {
        assert.throw(function() {
            module.setItem();
        }, Error, 'Incorrect input arguments');
    });
    test('setItem(incorrect item type)', function() {
        assert.throw(function() {
            module.setItem('string');
        }, Error, 'Incorrect input arguments');
    });
    test('setItem(Task)', function() {
        assert.doesNotThrow(function() {
            module.setItem(taskList.addTask());
        });
    });
    test('setItem(TaskList)', function() {
        assert.doesNotThrow(function() {
            module.setItem(taskList.addList());
        });
    });

    test('setSaveCallback()', function() {
        assert.throw(function() {
            module.setSaveCallback();
        }, Error, 'Incorrect input arguments');
    });
    test('setSaveCallback(not function)', function() {
        assert.throw(function() {
            module.setSaveCallback('I am function');
        }, Error, 'Incorrect input arguments');
    });
    test('setSaveCallback()', function() {
        function fn() {}

        assert.doesNotThrow(function() {
            module.setSaveCallback(fn);
        });
        assert.equal(module._callback, fn);
    });

    test('getData() from _defaults', function() {
        var itemData = module._defaults._defaults;
        itemData.timestamp = new Date().toISOString();
        assert.deepEqual(module.getData(), itemData);
    });
    test('getData() from item without startDate and dueDate', function() {
        var item = taskList.addTask({
            id: 'ok',
            timestamp: new Date().toISOString()
        });
        module.setItem(item);

        assert.deepEqual(module.getData(), item.public);
    });
    test('getData() from item with all data', function() {
        var item = taskList.addTask({
            title: 'all ok',
            isDone: false,
            priority: 2,
            startDate: '2014-09-10',
            dueDate: '2014-10-01',
            notes: 'note',
            timestamp: '2014-09-09T20:30:17.572Z',
            id: 'ok',
            parentID: 'root',
            type: 'Task'
        });
        module.setItem(item);

        assert.deepEqual(module.getData(), item.public);
    });

    test('save()', function() {
        var saveFN = sinon.spy();
        var data = {
            title: 'title',
            isDone: 'isDone',
            priority: 'priority',
            startDate: 'startDate',
            dueDate: 'dueDate',
            notes: 'notes'
        };

        module.setSaveCallback(saveFN);
        module.save(data);

        assert.equal(saveFN.callCount, 1, 'Save callback function was not called');
        assert.deepEqual(saveFN.args[0][0], data, 'Incorrect data was send to the save callback function');
    });
});