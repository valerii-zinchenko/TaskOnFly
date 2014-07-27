/**
 * Created by valera on 7/25/14.
 */

suite('Class. General.', function() {
    suite('Input arguments', function() {
        test('No arguments', function() {
            assert.doesNotThrow(function() {
                new Class();
            });
        });
        test('Single argument', function() {
            assert.doesNotThrow(function() {
                new Class(Object);
            });
            assert.doesNotThrow(function() {
                new Class({});
            });
            assert.throw(function() {
                new Class(2);
            }, Error, 'Incorrect input arguments. It should be: new Class([[Function], Object])');
        });
        test('Two arguments', function() {
            assert.doesNotThrow(function() {
                new Class(Object, {});
            });
            assert.throw(function() {
                new Class(Object, 2);
            }, Error, 'Incorrect input arguments. It should be: new Class([[Function], Object])');
        });
    });

    test('initialize()', function() {
        assert.doesNotThrow(function() {
            new (new Class())();
        });
        assert.throw(function() {
            new (new Class({
                initialize: function() {
                    throw 'OK';
                }
            }))();
        }, 'OK');
    });

    test('Check constructor', function() {
        var Obj = new Class();
        assert(Obj === (new Obj()).constructor);
    });

    test('Class class should not behave as singleton', function() {
        var Obj = new Class();
        assert(new Obj() !== new Obj());
    });

    test('Property', function() {
        var value = 0;
        var Obj = new Class({
            value: value
        });

        assert(value === (new Obj()).value);
    });
    test('Method', function() {
        var value = 0;
        var Obj = new Class({
            fn: function() {
                return value;
            }
        });

        assert(value === (new Obj()).fn());
    });
    test('Calling of initialize()', function() {
        var Obj = new Class({
            initialize: function() {
                throw 'OK';
            }
        });

        assert.throw(function(){
            new Obj();
        }, 'OK');
    });
});

suite('Class. Inheritance.', function() {
    var Parent,
        prop = 5,
        value = 2;
    setup(function() {
        Parent = new Class({
            prop: prop,
            initialize: function() {
                this.value = value;
            }
        });
    });

    test('Check constructor', function() {
        var Child = new Class(Parent);

        assert(Child === (new Child()).constructor);
        assert(Parent !== (new Child()).constructor);
    });
    test('Public property', function() {
        var Child = new Class(Parent);
        assert(prop === (new Child()).prop);
    });
    test('Calling of parent initialize()', function() {
        var k = 2;
        var Child = new Class(Parent, {
            initialize: function() {
                this.value *= k;
            }
        });

        assert(value*k === (new Child()).value);
    });
});