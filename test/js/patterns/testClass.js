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
                new Class(11);
            }, Error, 'Incorrect input arguments. It should be: new Class([[Function], Object])');
        });
        test('Two arguments', function() {
            assert.doesNotThrow(function() {
                new Class(Object, {});
            });
            assert.throw(function() {
                new Class(Object, 11);
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
        assert.equal((new Obj()).constructor, Obj);
    });

    test('Class class should not behave as singleton', function() {
        var Obj = new Class();
        assert.notEqual(new Obj(), new Obj());
    });

    test('Property', function() {
        var value = 11;
        var Obj = new Class({
            value: value
        });

        assert.equal((new Obj()).value, value);
    });
    test('Method', function() {
        var value = 11;
        var Obj = new Class({
            fn: function() {
                return value;
            }
        });

        assert.equal((new Obj()).fn(), value);
    });
    test('Cloning of property', function() {
        var value = 11;
        var Obj = new Class({
            obj: {
                key: value
            }
        });

        var obj1 = new Obj(),
            obj2 = new Obj();

        assert.notEqual(obj1.obj, obj2.obj);
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
        prop = 4,
        value = 11;
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

        assert.equal((new Child()).constructor, Child);
        assert.notEqual((new Child()).constructor, Parent);
    });
    test('Public property', function() {
        var Child = new Class(Parent);
        assert.equal((new Child()).prop, prop);
    });
    test('Calling of parent initialize()', function() {
        var k = 2;
        var Child = new Class(Parent, {
            initialize: function() {
                this.value *= k;
            }
        });

        assert.equal((new Child()).value, value*k);
    });
});