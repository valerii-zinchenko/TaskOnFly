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
            prop = 4;
        var object;
        setup(function() {
            Parent = new Class({
                prop: prop,
                initialize: function() {
                    this.isParent = true;
                },
                parentFn: function(){}
            });
        });
        teardown(function() {
            Parent = null;
            object = null;
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
            var Child = new Class(Parent, {
                initialize: function() {
                    this.isChild = true;
                }
            });
            object = new Child();

            assert.isTrue(object.isChild, 'Child constructor was not executed');
            assert.isTrue(object.isParent, 'Parent constructor was not executed');
        });
        test('Calling of parent initialize() of parent class', function() {
            var Child = new Class(Parent, {
                initialize: function() {
                    this.isChild = true;
                }
            });
            var Grandchild = new Class(Child, {
                initialize: function() {
                    this.isGrundchild = true;
                }
            });
            object = new Grandchild();

            assert.isTrue(object.isGrundchild, 'GrundChild constructor was not executed');
            assert.isTrue(object.isChild, 'Child constructor was not executed');
            assert.isTrue(object.isParent, 'Parent constructor was not executed');
        });
        test('Parents methods', function() {
            var Child = new Class(Parent, {
                initialize: function() {
                    this.isChild = true;
                },
                childFn: function(){}
            });
            var Grandchild = new Class(Child, {
                initialize: function() {
                    this.isGrundchild = true;
                },
                grandchildFn: function(){}
            });
            object = new Grandchild();

            assert.isDefined(object.parentFn, 'Parent function was not copied');
            assert.isDefined(object.childFn, 'Child function was not copied');
            assert.isDefined(object.grandchildFn, 'Grandchild function was not copied');
        });
    });
});
