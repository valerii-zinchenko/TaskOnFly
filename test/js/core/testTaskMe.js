/**
 * Created by Valerii Zinchenko on 8/2/14.
 */

suite('Test TaskMe', function() {
    setup(function() {
        TaskMe.ROOT_TASK_LIST = null;
        TaskMe.CURRENT_TASK_LIST = null;
    });

    test('setRootList()', function() {
        assert.throw(function() {
            TaskMe.setRootList()
        }, Error, 'Invalid list');
        assert.doesNotThrow(function() {
            TaskMe.setRootList({})
        });
    });
    test('getRootList()', function() {
        assert.isNull(TaskMe.getRootList());
        var obj = {};
        TaskMe.setRootList(obj);
        assert.equal(TaskMe.getRootList(), obj);
    });

    test('setCurrentList()', function() {
        assert.throw(function() {
            TaskMe.setCurrentList()
        }, Error, 'Invalid list');
        assert.doesNotThrow(function() {
            TaskMe.setCurrentList({})
        });
    });
    test('getCurrentList()', function() {
        assert.isNull(TaskMe.getCurrentList());
        var obj = {};
        TaskMe.setCurrentList(obj);
        assert.equal(TaskMe.getCurrentList(), obj);
    });

    test('changeView()', function() {
        var hash = '';
        TaskMe.changeView(hash);
        assert.equal(window.location.hash, '#');

        hash = 'view';
        TaskMe.changeView(hash);
        assert.equal(window.location.hash, '#view');
    });

    test('saveItem() with incorrect input arguments', function() {
        assert.throw(function() {
            TaskMe.saveItem();
        }, Error, 'item is not defined');
        assert.throw(function() {
            TaskMe.saveItem({});
        }, Error, 'Unknown item type');

        assert.throw(function() {
            TaskMe.saveItem({_type: 'type'});
        }, Error, 'Unknown item type');
        assert.throw(function() {
            TaskMe.saveItem({_type: 'task'});
        }, Error, 'Item object does not contain public object');
        assert.throw(function() {
            TaskMe.saveItem({_type: 'list'});
        }, Error, 'Item object does not contain public object');

        assert.throw(function() {
            TaskMe.saveItem({_type: 'task', public: 5});
        }, Error, 'Item object does not contain public object');
        assert.throw(function() {
            TaskMe.saveItem({_type: 'task', public: {}});
        }, Error, 'Item id is not defined');
    });
    test('saveItem() with correct input arguments', function() {
        var item = {
            _type: 'task',
            public: {
                id: '04',
                value: 11
            }
        };
        assert.doesNotThrow(function() {
            TaskMe.saveItem(item);
        });
    });

    test('loadItem() with incorrect input arguments', function() {
        assert.throw(function() {
            TaskMe.loadItem('item');
        }, Error, 'Unknown item type');
        assert.throw(function() {
            TaskMe.loadItem('task');
        }, Error, 'Item id is not defined');
    });
});

suite('Test TaskMe IO', function() {
    var item = {
            _type: 'task',
            public: {
                id: '04',
                value: 11
            }
        },
        id = [item._type, item.public.id].join('-');

    setup(function() {
        window.localStorage.clear();
    });

    test('saveItem() Check localStorage', function() {
        TaskMe.saveItem(item);
        assert.equal(window.localStorage.getItem(id), JSON.stringify(item.public));
    });
    test('loadItem()', function() {
        TaskMe.saveItem(item);

        var storedItem = TaskMe.loadItem(item._type, item.public.id);
        assert.equal(storedItem.id, item.public.id);
        assert.equal(storedItem.value, item.public.value);
    })
});