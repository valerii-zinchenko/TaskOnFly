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

'use strict';

suite('TaskList', function() {
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

    test('setSortingOrder()', function(){
        assert.throw(function(){
            List.setSortingOrder();
        }, Error, 'No input arguments');

        assert.throw(function(){
            List.setSortingOrder([]);
        }, Error, 'Array of sorting rules is empty');

        List.setSortingOrder('isDone');
        assert.isArray(List.sortingOrder, 'sortingOrder should be an Array');
        assert.equal(List.sortingOrder[0], 'isDone');

        List.setSortingOrder(['priority']);
        assert.equal(List.sortingOrder[0], 'priority');
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

    test('empty sorting order', function(){
        List.sortingOrder = [];

        assert.throw(function(){
            List.sort();
        }, Error, 'Sorting order is not defined');
    });

    suite('sort()', function(){
        var objs;
        setup(function(){
            objs = [
                {
                    id: '0',
                    isDone: false,
                    dueDate: '2014-08-30',
                    priority: 2,
                    timestamp: 7,
                    version: '1.0'
                },
                {
                    id: '1',
                    isDone: false,
                    dueDate: '2014-08-31',
                    priority: 0,
                    timestamp: 1,
                    version: '1.0'
                },
                {
                    id: '2',
                    isDone: false,
                    dueDate: '2014-08-31',
                    priority: 1,
                    timestamp: 5,
                    version: '1.0'
                },
                {
                    id: '3',
                    isDone: false,
                    dueDate: '2014-08-31',
                    priority: 2,
                    timestamp: 8,
                    version: '1.0'
                },
                {
                    id: '4',
                    isDone: false,
                    dueDate: '2014-08-31',
                    priority: 2,
                    timestamp: 6,
                    version: '1.0'
                },
                {
                    id: '5',
                    isDone: false,
                    dueDate: '',
                    doneDate: '2014-09-05',
                    priority: 1,
                    timestamp: 4,
                    version: '1.0'
                },
                {
                    id: '6',
                    isDone: true,
                    dueDate: '2014-09-01',
                    priority: 0,
                    timestamp: 6,
                    version: '1.0'
                },
                {
                    id: '7',
                    isDone: true,
                    dueDate: '2014-09-01',
                    doneDate: '2014-09-08',
                    priority: 2,
                    timestamp: 1,
                    version: '1.0'
                },
                {
                    id: '8',
                    isDone: true,
                    dueDate: '2014-09-02',
                    doneDate: '2014-09-05',
                    priority: 1,
                    timestamp: 2,
                    version: '1.0'
                }
            ];
        });
        teardown(function(){
            objs = null;
            window.localStorage.storage = {};
        });

        test('default sort order: isDone, priority', function() {
            List.setSortingOrder(['isDone', 'priority']);

            List.addTask(objs[7]);
            List.addTask(objs[1]);
            List.addTask(objs[8]);
            List.addTask(objs[5]);
            List.addTask(objs[2]);
            List.addTask(objs[6]);
            List.addTask(objs[4]);
            List.addTask(objs[0]);
            List.addTask(objs[3]);

            var expectedOrder = ['1','5','2','4','0','3','6','8','7'];

            assert.equal(List.public.items.length, objs.length, 'Count of expected task is not equal to the count of added tasks');
            for (var n = 0, N = objs.length; n < N; n++) {
                assert.equal(List.public.items[n], expectedOrder[n], [
                    'incorrect sorting: expected ',
                    JSON.stringify(List.public.items),
                    ' to be equal to ',
                    JSON.stringify(expectedOrder)
                ].join(''));
            }
        });

        test('sort order: isDone, date, priority', function() {
            List.setSortingOrder(['isDone', 'date', 'priority']);

            List.addTask(objs[7]);
            List.addTask(objs[1]);
            List.addTask(objs[8]);
            List.addTask(objs[5]);
            List.addTask(objs[2]);
            List.addTask(objs[6]);
            List.addTask(objs[4]);
            List.addTask(objs[0]);
            List.addTask(objs[3]);

            var expectedOrder = ['0','1','2','4','3','5','7','8','6'];

            assert.equal(List.public.items.length, objs.length, 'Count of expected task is not equal to the count of added tasks');
            for (var n = 0, N = objs.length; n < N; n++) {
                assert.equal(List.public.items[n], expectedOrder[n], [
                    'incorrect sorting: expected ',
                    JSON.stringify(List.public.items),
                    ' to equal ',
                    JSON.stringify(expectedOrder)
                ].join(''));
            }
        });

        test('sort order: isDone, priority, date', function() {
            List.setSortingOrder(['isDone', 'priority', 'date']);

            List.addTask(objs[7]);
            List.addTask(objs[1]);
            List.addTask(objs[8]);
            List.addTask(objs[5]);
            List.addTask(objs[2]);
            List.addTask(objs[6]);
            List.addTask(objs[3]);
            List.addTask(objs[0]);
            List.addTask(objs[4]);

            var expectedOrder = ['1','2','5','0','4','3','8','7','6'];

            for (var n = 0, N = objs.length; n < N; n++) {
                assert.equal(List.public.items[n], objs[expectedOrder[n]].id, [
                    'incorrect sorting: expected ',
                    JSON.stringify(List.public.items),
                    ' to be equal to ',
                    JSON.stringify(expectedOrder)
                ].join(''));
            }
        });
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

        test('{title: "itl"}', function() {
            var res = List.filter({
                title: 'itl'
            });

            assert.equal(res.length, 2, 'Incorrect count of founded items');
            assert.equal(res[0].public.id, 0, 'no item with ID 0');
            assert.equal(res[1].public.id, 2, 'no item with ID 2');
        });

        test('{isDone: true}', function() {
            var res = List.filter({
                isDone: true
            });

            assert.equal(res.length, 1, 'Incorrect count of founded items');
            assert.equal(res[0].public.id, '0', 'no item with ID 0');
        });

        test('{dueDate: "2014-08"}', function() {
            var res = List.filter({
                dueDate: '2014-08'
            });

            assert.equal(res.length, 2, 'Incorrect count of founded items');
            assert.equal(res[0].public.id, 0, 'no item with ID 0');
            assert.equal(res[1].public.id, 1, 'no item with ID 2');
        });

        test('{title: "itl", isDone: false}', function() {
            var res = List.filter({
                title: 'itl',
                isDone: false
            });

            assert.equal(res.length, 1, 'Incorrect count of founded items');
            assert.equal(res[0].public.id, 2, 'no item with ID 2');
        });

        test('{title: "itl", dueDate: "2014-08-31"}', function() {
            var res = List.filter({
                title: 'itl',
                dueDate: '2014-08-31'
            });

            assert.equal(res.length, 1, 'Incorrect count of founded items');
            assert.equal(res[0].public.id, 0, 'no item with ID 0');
        });

        test('{isDone: false, dueDate: "2014-09"}', function() {
            var res = List.filter({
                isDone: false,
                dueDate: '2014-09'
            });

            assert.equal(res.length, 1, 'Incorrect count of founded items');
            assert.equal(res[0].public.id, 2, 'no item with ID 2');
        });
    });
});
