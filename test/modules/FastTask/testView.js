'use strict';

suite('Test FastTask.View', function() {
    var Module;
    setup(function(done) {
        requirejs(['modules/FastTask/View'], function(View) {
            Module = View;
            done();
        });
    });
    teardown(function() {
        requirejs.undef('modules/FastTask/View');
    });

    suite('initialize()', function() {
        test('without arguments', function() {
            assert.throw(function() {
                new Module();
            }, Error, 'Holder element of FastTask module is not defined.');
        });

        test('incorrect argument type', function() {
            assert.throw(function() {
                new Module(':)');
            }, Error, 'Incorrect input argument type');
        });

        test('correct input argument', function() {
            assert.doesNotThrow(function() {
                new Module($);
            });
        });
    });

    test('Is Singleton?', function() {
        assert.equal(new Module(), new Module(), 'View of FastTask should be an singleton class');
    });

    suite('Test class methods', function() {
        var module;
        setup(function() {
            module = new Module($);
        });

        test('render()', function() {
            assert.doesNotThrow(function() {
                module.render();
            });
        });

        test('_addTask()', function() {
            module.control = {_addTask: function(){}};
            sinon.spy(module, 'render');
            sinon.spy(module.control, '_addTask');

            assert.doesNotThrow(function() {
                module._addTask({preventDefault: function(){}});
            });

            assert.equal(module.control._addTask.callCount, 1, '_addTask() of control sub-module should be called');
            assert.equal(module.render.callCount, 1, 'FastTask.View should be refreshed after task is added');
        });
    });
});