/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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


suite('Test utility functions', function() {
    test('object cloning', function() {
        var v1 = 11,
            v2 = 4,
            v3 = 19,
            obj1 = {
                value: v1,
                innObj: {
                    innValue: v2
                }
            },
            obj2 = {
                value: v3
            };

        utils.deepExtend(obj2, obj1);

        assert.equal(obj2.value, v3);
        assert.equal(obj2.innObj.innValue, v2);
        assert.notEqual(obj2.innObj, obj1.innObj);
    });
});