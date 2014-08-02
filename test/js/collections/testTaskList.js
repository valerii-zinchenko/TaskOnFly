/**
 * Created by Valerii Zinchenko on 7/21/14.
 */
suite('Test TaskList', function() {
    var Module,
        List;
    setup(function(done) {
        requirejs(['js/collections/TaskList'], function(TaskList) {
            Module = TaskList;
            List = new Module('root');
            done();
        })
    });

    test('_add()', function() {
        var item = {
            public: {id: '11'}
        };

        assert.equal(List._add(item), item);
        assert.equal(List.models[item.public.id], item);
        assert.equal(List.length, 1);
    });

    test('addList()', function() {
        assert.doesNotThrow(function() {
            var item = List.addList();
            assert.equal(item.constructor, Module);
        })
    });

    test('addList()', function() {
        assert.doesNotThrow(function() {
            var value = 11;
            assert.equal(List.addTask({value: value}).public.value, value);
        })
    });

    test('getItem()', function() {
        var item = List.addList();
        assert.equal(List.getItem(item.public.id), item);
    });

    test('selectList()', function() {
        var List2 = List.addList();
        List.selectList(List2.public.id);

        assert.equal(TaskMe.getCurrentList(), List2);
    });

    test('selectParentList()', function() {
        var List2 = List.addList();
        List.selectList(List2.public.id);
        List2.selectParentList();

        assert.equal(TaskMe.getCurrentList(), List);
    });
});