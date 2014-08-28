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

suite('Test TaskOnFly', function() {
    setup(function() {
        TaskOnFly.ROOT_TASK_LIST = null;
        TaskOnFly.CURRENT_TASK_LIST = null;
    });

    test('setRootList()', function() {
        assert.throw(function() {
            TaskOnFly.setRootList()
        }, Error, 'Invalid list');
        assert.doesNotThrow(function() {
            TaskOnFly.setRootList({})
        });
    });
    test('getRootList()', function() {
        assert.isNull(TaskOnFly.getRootList());
        var obj = {};
        TaskOnFly.setRootList(obj);
        assert.equal(TaskOnFly.getRootList(), obj);
    });

    test('setCurrentList()', function() {
        assert.throw(function() {
            TaskOnFly.setCurrentList()
        }, Error, 'Invalid list');
        assert.doesNotThrow(function() {
            TaskOnFly.setCurrentList({})
        });
    });
    test('getCurrentList()', function() {
        assert.isNull(TaskOnFly.getCurrentList());
        var obj = {};
        TaskOnFly.setCurrentList(obj);
        assert.equal(TaskOnFly.getCurrentList(), obj);
    });

    test('changeView()', function() {
        var hash = '';
        TaskOnFly.changeView(hash);
        assert.equal(window.location.hash, '#');

        hash = 'view';
        TaskOnFly.changeView(hash);
        assert.equal(window.location.hash, '#view');
    });

    test('saveItem() with incorrect input arguments', function() {
        assert.throw(function() {
            TaskOnFly.saveItem();
        }, Error, 'item is not defined');
        assert.throw(function() {
            TaskOnFly.saveItem({});
        }, Error, 'Item object does not contain public object');

        assert.throw(function() {
            TaskOnFly.saveItem({public: 5});
        }, Error, 'Item object does not contain public object');
        assert.throw(function() {
            TaskOnFly.saveItem({public: {}});
        }, Error, 'Item id is not defined');
    });
    test('saveItem() with correct input arguments', function() {
        var item = {
            public: {
                id: '04',
                value: 11
            }
        };
        assert.doesNotThrow(function() {
            TaskOnFly.saveItem(item);
        });
    });

    test('loadItem() with incorrect input arguments', function() {
        assert.throw(function() {
            TaskOnFly.loadItem();
        }, Error, 'Item id is not defined');
    });
});

suite('Test TaskOnFly IO', function() {
    var item = {
            public: {
                id: '04',
                value: 11
            }
        },
        id = item.public.id;

    setup(function() {
        window.localStorage.clear();
    });

    test('saveItem() Check localStorage', function() {
        TaskOnFly.saveItem(item);
        assert.equal(window.localStorage.getItem(id), JSON.stringify(item.public));
        assert.ok(window.localStorage.getItem('items'));
    });

    test('loadItem()', function() {
        TaskOnFly.saveItem(item);

        var storedItem = TaskOnFly.loadItem(item.public.id);
        assert.equal(storedItem.id, item.public.id);
        assert.equal(storedItem.value, item.public.value);
    });

    test('removeItem()', function() {
        assert.doesNotThrow(function() {
            TaskOnFly.removeItem();
        });

        TaskOnFly.saveItem(item);
        assert.doesNotThrow(function() {
            TaskOnFly.removeItem(item.public.id);
        });

        assert.isNull(TaskOnFly.loadItem(item.public.id));
    });
});