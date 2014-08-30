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


suite('Test Task model', function() {
    var Module;
    setup(function(done) {
        requirejs(['model/Task'], function(Task) {
            Module = Task;
            done();
        })
    });

    test('_defaults.public', function() {
        var pub = Module.prototype._defaults.public;

        assert.equal(pub.isDone, false);
        assert.equal(pub.title, '');
        assert.equal(pub.priority, 1);
        assert.equal(pub.startDate, null);
        assert.equal(pub.dueDate, null);
        assert.equal(pub.notes, '');
        assert.equal(pub.timestamp, '');
        assert.equal(pub.id, '');
        assert.equal(pub.parentID, '');
        assert.equal(pub.type, 'Task');
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
            timestamp = new Date(),
            startDate = new Date('2014-08-25'),
            dueDate = new Date('2014-08-31');

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
        assert.equal(task.public.startDate, startDate.toISOString());
        assert.equal(task.public.dueDate, dueDate.toISOString());
    });

    test('saveData()', function() {
        var parenID = 'parentID',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = new Date(),
            startDate = new Date('2014-08-25'),
            dueDate = new Date('2014-08-31');

        var task = new Module(parenID);
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
        assert.equal(task.public.startDate, startDate.toISOString());
        assert.equal(task.public.dueDate, dueDate.toISOString());
    });

    test('Is Module a singleton?', function() {
        assert.notEqual(new Module('id'), new Module('id'));
    });

    test('toggleStatus()', function() {
        var task = new Module('parentID');
        task.toggleStatus();

        assert.equal(task.public.isDone, true);
    });
});