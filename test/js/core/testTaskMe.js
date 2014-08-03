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
        }, Error, 'Item object does not contain public object');

        assert.throw(function() {
            TaskMe.saveItem({public: 5});
        }, Error, 'Item object does not contain public object');
        assert.throw(function() {
            TaskMe.saveItem({public: {}});
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
            TaskMe.saveItem(item);
        });
    });

    test('loadItem() with incorrect input arguments', function() {
        assert.throw(function() {
            TaskMe.loadItem();
        }, Error, 'Item id is not defined');
    });
});

suite('Test TaskMe IO', function() {
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
        TaskMe.saveItem(item);
        assert.equal(window.localStorage.getItem(id), JSON.stringify(item.public));
        assert.ok(window.localStorage.getItem('items'));
    });

    test('loadItem()', function() {
        TaskMe.saveItem(item);

        var storedItem = TaskMe.loadItem(item.public.id);
        assert.equal(storedItem.id, item.public.id);
        assert.equal(storedItem.value, item.public.value);
    });

    test('removeItem()', function() {
        assert.doesNotThrow(function() {
            TaskMe.removeItem();
        });

        TaskMe.saveItem(item);
        assert.doesNotThrow(function() {
            TaskMe.removeItem(item);
        });

        assert.isNull(TaskMe.loadItem(item.public.id));
    });
});