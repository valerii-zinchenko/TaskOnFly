'use strict';

suite('ListItem.Control.', function() {
    var Module;
    setup(function(done) {
        requirejs('./modules/ListItem/Control', function(Control) {
            Module = Control;

            done();
        });
    });
    teardown(function() {
        Module = null;
    });

    suite('Constructor.', function() {
        test('new object', function() {
            assert.doesNotThrow(function () {
                new Module();
            });
        });

        test('Is Singleton?', function() {
            assert.notEqual(new Module(), new Module(), 'Control sub-module should not be an Singleton');
        });
    });

    suite('Methods.', function() {
        var object;
        setup(function() {
            object = new Module();
        });
        teardown(function() {
            object = null;
        });


        suite('setModel()', function() {
            test('no input arguments', function() {
                assert.throw(function() {
                    object.setModel();
                }, Error, 'Incorrect amount of input arguments');
            });
            test('incorrect type', function() {
                assert.throw(function() {
                    object.setModel(':)');
                }, Error, 'Incorrect type of input argument');
            });
            test('incorrect instance', function() {
                assert.throw(function() {
                    object.setModel({});
                }, Error, 'Incorrect instance of model');
            });

            test('correct input arguments', function() {
                assert.doesNotThrow(function() {
                    object.setModel(new TaskManager.Task('ok'));
                });
                assert.doesNotThrow(function() {
                    object.setModel(new TaskManager.TaskList('ok'));
                });
            });
        });

        test('toggleModelStatus()', function() {
            var model = new TaskManager.Task('ok');
            var stub = sinon.stub(model, 'toggleStatus', function(){});

            assert.doesNotThrow(function() {
                object.toggleModelStatus();
            });

            assert.equal(stub.callCount, 1, 'This method should call model\'s method toggleStatus()');

            stub.restore();
        });

        test('removeModel()', function() {
            object.model = $;
            var spy = sinon.spy(object.model, 'trigger');

            assert.doesNotThrow(function() {
                object.removeModel();
            });

            assert.equal(spy.callCount, 1, 'Control should trigger some the model\'s event');
            assert.equal(spy.args[0][0], 'remove', 'Control should trigger model\'s "remove" event');

            spy.restore();
        });
    });
});