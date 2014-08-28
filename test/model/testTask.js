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
            timestamp = new Date();

        var task = new Module(parentID, {
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp
        });

        assert.equal(task.public.parentID, parentID);
        assert.equal(task.public.isDone, isDone);
        assert.equal(task.public.title, title);
        assert.equal(task.public.priority, priority);
        assert.equal(task.public.description, description);
        assert.equal(task.public.timestamp, timestamp);
    });

    test('saveData()', function() {
        var parenID = 'parentID',
            isDone = true,
            title = 'test task',
            priority = 3,
            description = 'task description',
            timestamp = new Date();

        var task = new Module(parenID);
        task.saveData({
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp
        });

        assert.equal(task.public.isDone, isDone);
        assert.equal(task.public.title, title);
        assert.equal(task.public.priority, priority);
        assert.equal(task.public.description, description);
        assert.equal(task.public.timestamp, timestamp);
    });

    test('Is Module a singleton?', function() {
        assert.notEqual(new Module('id'), new Module('id'));
    });

    test('Two instances', function() {
        var parentID = 'parentID',
            isDone = true,
            title = 'test task',
            title1 = 'test task1',
            priority = 3,
            priority1 = 4,
            description = 'task description',
            description1 = 'task description1',
            timestamp = new Date().toString();

        var task1 = new Module(parentID);
        task1.saveData({
            isDone: isDone,
            title: title,
            priority: priority,
            description: description,
            timestamp: timestamp
        });

        var task2 = new Module(parentID);
        task2.saveData({
            isDone: isDone,
            title: title1,
            priority: priority1,
            description: description1,
            timestamp: timestamp
        });

        assert.equal(task1.public.isDone, isDone);
        assert.equal(task1.public.title, title);
        assert.equal(task1.public.priority, priority);
        assert.equal(task1.public.description, description);
        assert.equal(task1.public.timestamp, timestamp);

        assert.equal(task2.public.isDone, isDone);
        assert.equal(task2.public.title, title1);
        assert.equal(task2.public.priority, priority1);
        assert.equal(task2.public.description, description1);
        assert.equal(task2.public.timestamp, timestamp);
    });
});