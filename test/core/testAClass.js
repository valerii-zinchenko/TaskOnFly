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

'use strict';

suite('AClass', function() {
    suite('Input arguments', function() {
        test('No arguments', function() {
            assert.throw(function() {
                new AClass();
            }, Error, 'Incorrect input arguments. Constructor function is not defined');
        });
        test('Single argument', function() {
            assert.doesNotThrow(function() {
                new AClass(function() {});
            });
            assert.throw(function() {
                new AClass(2);
            }, Error, 'Constructor should be an function');
        });
    });

    suite('Test returning class constructor', function() {
        var SomeClassBuilder;
        setup(function() {
            SomeClassBuilder = new AClass(function(){});
        });

        test('Test types and values of the properties', function() {
            var obj = new (new SomeClassBuilder({
                number: 1,
                string: ':)',
                bool: true,
                nullValue: null,
                array: [0,1],
                obj: {
                    v: 11
                },
                fn: function() {return this.number;}
            }))();

            assert.isNumber(obj._defaults.number, 'Number type was not saved');
            assert.isString(obj._defaults.string, 'String type was not saved');
            assert.isBoolean(obj._defaults.bool, 'Boolean type was not saved');
            assert.isNull(obj._defaults.nullValue, 'Null type was not saved');
            assert.isArray(obj._defaults.array, 'Array type was not saved');
            assert.isObject(obj._defaults.obj, 'Object type was not saved');
            assert.isFunction(obj.fn, 'Function type was not saved');

            assert.equal(obj._defaults.number, 1);
            assert.equal(obj._defaults.string, ':)');
            assert.equal(obj._defaults.bool, true);
            assert.isTrue(obj._defaults.array[0] === 0 && obj._defaults.array[1] === 1);
            assert.equal(obj._defaults.obj.v, 11);
        });
    });
});