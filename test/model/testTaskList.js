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

suite('Test TaskList', function() {
    var Module,
        List;
    setup(function(done) {
        requirejs(['model/TaskList'], function() {
            Module = TaskManager.TaskList;
            List = new Module('root');
            done();
        });

        sinon.spy(TaskOnFly, 'removeItem');
    });
    teardown(function() {
        window.localStorage.storage = {};

        TaskOnFly.removeItem.restore();
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
    test('removeItem(badID)', function() {
        List.removeItem('ok');

        assert.equal(TaskOnFly.removeItem.callCount, 0, 'Non-existed item id should not be removed globally');
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
    test('selectParentList() of root list', function() {
        var list = new Module('root', {id: 'root'});
        assert.equal(list.selectParentList(), list);
    });

    test('getLocation()', function() {
        var list = new Module('root', {id: 'root'});
        var l1 = list.addList({id: 'list'});

        assert.equal(list.getLocation(), '/', 'Incorrect root list location address');
        assert.equal(l1.getLocation(), '/list/', 'Incorrect list location address');
    });

    test('getParentLocation()', function() {
        var list = new Module('root', {id: 'root'});
        var l1 = list.addList({id: 'list'});

        assert.equal(list.getParentLocation(), '/', 'Incorrect parent location address of the root list');
        assert.equal(l1.getParentLocation(), '/', 'Incorrect parent location address of the list');
    });

    suite('findList()', function() {
        var list, searchedList;

        setup(function() {
            list = new Module('root', {id: 'root'});
            list.addList({id: 'l1'});
            searchedList = list.addList({id: 'l2'}).addList({id: 'l3'}).addList({id: 'l4'});
        });
        teardown(function() {
            window.localStorage.data = {};
        });

        test('non existing list', function() {
            assert.isNull(list.findList(['l1', 'l8']), 'null should be returned if list does not exist under defined path');
        });
        test('existing list', function() {
            assert.equal(list.findList(['l2', 'l3', 'l4']), searchedList, 'Incorrect list was found by defined path');
        });
    });

    test('_object2Array()', function() {
        var obj = {
            1: 1,
            2: 2,
            3: 3
        };

        var result = Module.prototype._object2Array(obj, [3,2,1]);

        assert.isArray(result);
        assert.deepEqual(result, [3,2,1]);
    });

    test('sort()', function() {
        var objs = [
            {
                id: '0',
                isDone: false,
                dueDate: '2014-08-30',
                priority: 0
            },
            {
                id: '1',
                isDone: false,
                dueDate: '2014-08-31',
                priority: 2
            },
            {
                id: '2',
                isDone: false,
                dueDate: '2014-08-31',
                priority: 1
            },
            {
                id: '3',
                isDone: false,
                dueDate: '2014-08-31',
                priority: 0
            },
            {
                id: '4',
                isDone: false,
                dueDate: '2014-08-31',
                priority: 0
            },
            {
                id: '5',
                isDone: false,
                dueDate: '',
                doneDate: '2014-09-05',
                priority: 1
            },
            {
                id: '6',
                isDone: true,
                dueDate: '2014-09-01',
                priority: 2
            },
            {
                id: '7',
                isDone: true,
                dueDate: '2014-09-01',
                doneDate: '2014-09-08',
                priority: 0
            },
            {
                id: '8',
                isDone: true,
                dueDate: '2014-09-02',
                doneDate: '2014-09-05',
                priority: 1
            }
        ];

        List.addTask(objs[7]);
        List.addTask(objs[1]);
        List.addTask(objs[8]);
        List.addTask(objs[5]);
        List.addTask(objs[2]);
        List.addTask(objs[6]);
        List.addTask(objs[4]);
        List.addTask(objs[0]);
        List.addTask(objs[3]);

        var items = List.public.items;

        assert.equal(items.length, objs.length, 'Count of expected task is not equal to the count of added tasks');
        assert.isDefined(List.groups, '"groups" property should be already defined');
        assert.equal(List.getGroups(), List.groups, 'Incorrect object is returned');

        for (var n = 0, N = objs.length; n < N; n++) {
            assert.notEqual(List.groups[objs[n].isDone][objs[n].isDone ? (objs[n].doneDate || "null") : objs[n].dueDate][objs[n].priority].indexOf(objs[n].id), -1, 'List item is assigned to the incorrect group');
        }
    });

    suite('filter()', function() {
        setup(function(done) {
            requirejs(['model/TaskList'], function(TaskList) {
                Module = TaskList;
                List = new Module('root');

                List.addTask({
                    id: '0',
                    title: 'title',
                    isDone: true,
                    dueDate: '2014-08-31'
                });
                List.addTask({
                    id: '1',
                    title: 'task',
                    isDone: false,
                    dueDate: '2014-08-31'
                });
                List.addTask({
                    id: '2',
                    title: 'another title',
                    isDone: false,
                    dueDate: '2014-09-01'
                });

                done();
            })
        });

        test('filter by title', function() {
            var res = List.filter({
                title: 'itl'
            });

            assert.equal(res.public.items.length, 2, 'Incorrect count of founded items');
            assert.property(res.models, '0', 'no item with ID 0');
            assert.property(res.models, '2', 'no item with ID 2');
        });

        test('filter by completeness', function() {
            var res = List.filter({
                isDone: true
            });

            assert.equal(res.public.items.length, 1, 'Incorrect count of founded items');
            assert.property(res.models, '0', 'no item with ID 0');
        });

        test('filter by due date', function() {
            var res = List.filter({
                dueDate: '2014-08'
            });

            assert.equal(res.public.items.length, 2, 'Incorrect count of founded items');
            assert.property(res.models, '0', 'no item with ID 0');
            assert.property(res.models, '1', 'no item with ID 2');
        });

        test('filter by title and completeness', function() {
            var res = List.filter({
                title: 'itl',
                isDone: false
            });

            assert.equal(res.public.items.length, 1, 'Incorrect count of founded items');
            assert.property(res.models, '2', 'no item with ID 2');
        });

        test('filter by title and due date', function() {
            var res = List.filter({
                title: 'itl',
                dueDate: '2014-08-31'
            });

            assert.equal(res.public.items.length, 1, 'Incorrect count of founded items');
            assert.property(res.models, '0', 'no item with ID 0');
        });

        test('filter by completeness and due date', function() {
            var res = List.filter({
                isDone: false,
                dueDate: '2014-09'
            });

            assert.equal(res.public.items.length, 1, 'Incorrect count of founded items');
            assert.property(res.models, '2', 'no item with ID 2');
        });
    });
});