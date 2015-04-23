/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

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


suite('Task', function() {
    var Module;
    setup(function(done) {
        requirejs(['model/Task'], function() {
            Module = TaskManager.Task;
            done();
        })
    });

    test('_defaults.public', function() {
        assert.deepEqual(Module.prototype._defaults.public, {
            isDone: false,
            title: '',
            priority: 1,
            startDate: null,
            dueDate: null,
            doneDate: null,
            notes: '',
            timestamp: '',
            id: '',
            parentID: '',
            type: 'Task',
            version: '1.0.0'
        });
    });

    test('Constructor without arguments', function() {
        assert.throw(function() {
            new Module();
        }, Error, 'Invalid input arguments');
    });
    test('Constructor with parentID', function() {
        var parentID = 'parentID',
            obj = new Module(parentID);
        assert.equal(obj.public.parentID, parentID);
    });

    test('Constructor with unaccepted data', function() {
        assert.throw(function() {
            new Module(undefined, undefined);
        }, Error, 'Invalid input arguments');
        assert.throw(function() {
            new Module('', 0);
        }, Error, 'parentID is not defined');
        assert.throw(function() {
            new Module('parentID', 0);
        }, Error, 'Incorrect type of data input argument');
    });
    test('Constructor with accepted data', function() {
        var parentID = 'parentID',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = Date.now(),
            startDate = '2014-08-25',
            dueDate = '2014-08-31';

        var task = new Module(parentID, {
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp,
            startDate: startDate,
            dueDate: dueDate
        });

        assert.equal(task.public.parentID, parentID);
        assert.equal(task.public.isDone, isDone);
        assert.equal(task.public.title, title);
        assert.equal(task.public.priority, priority);
        assert.equal(task.public.description, description);
        assert.equal(task.public.timestamp, timestamp);
        assert.equal(task.public.startDate, startDate);
        assert.equal(task.public.dueDate, dueDate);
        assert.equal(task.public.doneDate, null);
    });

    test('Is Module a singleton?', function() {
        assert.notEqual(new Module('id'), new Module('id'), 'Module should not be a singleton');
    });

    suite('Test object', function(){
        var task;
        setup(function(){
            task = new Module('parentID');
        });
        teardown(function(){
            task = null;
        });

        test('saveData()', function() {
            var isDone = true,
                title = 'test task',
                priority = 3,
                description = 'task description',
                timestamp = Date.now(),
                startDate = '2014-08-25',
                dueDate = '2014-08-31';

            task.saveData({
                isDone: isDone,
                title: title,
                priority: priority,
                description: description,
                timestamp: timestamp,
                startDate: startDate,
                dueDate: dueDate
            });

            assert.equal(task.public.isDone, isDone);
            assert.equal(task.public.title, title);
            assert.equal(task.public.priority, priority);
            assert.equal(task.public.description, description);
            assert.equal(task.public.timestamp, timestamp);
            assert.equal(task.public.startDate, startDate);
            assert.equal(task.public.dueDate, dueDate);
            assert.equal(task.public.doneDate, null);
        });

        test('toggleStatus()', function() {
            task.toggleStatus();

            assert.equal(task.public.isDone, true);
            assert.equal(task.public.doneDate, new Date().toISOString().slice(0,10));
        });

        suite('upgrade()', function(){
            test('{version: "0.0", priority: 0}', function(){
                var data = {
                    version: '0.0',
                    priority: 0
                };

                task.upgrade(data);

                assert.equal(data.priority, 2, 'Priority was not changed');
            });
            test('{version: "0.0", priority: 2}', function(){
                var data = {
                    version: '0.0',
                    priority: 2
                };

                task.upgrade(data);

                assert.equal(data.priority, 0, 'Priority was not changed');
            });
        });
    });
});
