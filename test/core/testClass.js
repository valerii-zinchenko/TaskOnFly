/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
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


suite('Class.', function() {
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

    suite('Inheritance.', function() {
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
});