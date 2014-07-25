/**
 * Created by valera on 7/25/14.
 */

suite('SingletonClass. General', function() {
    test('initialize()', function() {
        assert.doesNotThrow(function() {
            (new SingletonClass())();
        });
        assert.throw(function() {
            (new SingletonClass({
                initialize: function() {
                    throw 'OK';
                }
            }))();
        }, 'OK');
    });

    test('Check constructor', function() {
        var Obj = new SingletonClass();
        assert(Obj === (new Obj()).constructor);
    });

    test('SingletonClass class should behave as singleton', function() {
        var Obj = new SingletonClass();
        assert(new Obj() === new Obj());
    });

    test('Second calling of initialize() for Singleton object', function() {
        var Obj = new SingletonClass({
            initialize: function() {
                throw 'OK';
            }
        });

        assert.throw(function() {
            new Obj();
        }, 'OK');
        assert.doesNotThrow(function() {
            new Obj();
        })
    });

    test('Calling of parent initialize()', function() {
        var value = 5,
            k = 2;

        var Parent = new SingletonClass({
            initialize: function() {
                this.value = value;
            }
        });
        var Child = new SingletonClass(Parent, {
            initialize: function() {
                this.value *= k;
            }
        });

        assert(value*k === (new Child()).value);
    });
});