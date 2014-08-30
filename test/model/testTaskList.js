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


suite('Test TaskList', function() {
    var Module,
        List;
    setup(function(done) {
        requirejs(['model/TaskList'], function(TaskList) {
            Module = TaskList;
            List = new Module('root');
            done();
        })
    });

    test('_defaults.public', function() {
        var pub = Module.prototype._defaults.public;

        assert.equal(pub.type, 'List');
        assert.isArray(pub.items);
        assert.equal(pub.items.length, 0);
    });

    test('_add()', function() {
        var item = {
            public: {
                id: '11',
                isDone: true,
                dueDate: null,
                priority: 0
            }
        };

        assert.equal(List._add(item), item);
        assert.equal(List.models[item.public.id], item);
        assert.equal(List.public.items.length, 1);
    });

    test('addList()', function() {
        assert.doesNotThrow(function() {
            assert.equal(List.addList().constructor, Module);
        })
    });

    test('addTask()', function() {
        assert.doesNotThrow(function() {
            var value = 11;
            assert.equal(List.addTask({value: value}).public.value, value);
        })
    });

    test('getItem()', function() {
        var item = List.addList();
        assert.equal(List.getItem(item.public.id), item);
    });

    test('removeItem()', function() {
        var task = List.addTask();

        assert.equal(List.public.items.length, 1);
        assert.doesNotThrow(function() {
            List.removeItem(task.public.id);
        });
        assert.equal(List.public.items.length, 0);
        assert.isUndefined(List.models[task.public.id]);
    });

    test('toggleItemStatus() & _checkListCompleteness()', function() {
        var list = List.addList();
        var task = list.addTask();

        list.toggleItemStatus(task.public.id);

        assert.isTrue(list.public.isDone, 'inner list completeness status was not changed to true');
        assert.isTrue(List.public.isDone, 'root list completeness status was not changed to true');

        list.toggleItemStatus(task.public.id);

        assert.isFalse(list.public.isDone, 'inner list completeness status was not changed to false');
        assert.isFalse(List.public.isDone, 'root list completeness status was not changed to false');

        list.toggleItemStatus(task.public.id);
        list.addTask();

        assert.isFalse(list.public.isDone, 'inner list completeness status was not changed to false after adding new task');
        assert.isFalse(List.public.isDone, 'root list completeness status was not changed to false after adding new task');
    });

    test('selectList()', function() {
        var List2 = List.addList();
        List.selectList(List2.public.id);

        assert.equal(TaskOnFly.getCurrentList(), List2);
    });

    test('selectParentList()', function() {
        var List2 = List.addList();
        List.selectList(List2.public.id);
        List2.selectParentList();

        assert.equal(TaskOnFly.getCurrentList(), List);
    });

    test('_object2Array()', function() {});

    test('sort()', function() {});

    test('filter()', function() {});
});