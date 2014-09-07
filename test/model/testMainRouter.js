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


'use strict';

suite('SimpleSearch', function() {
    var Module;
    setup(function(done) {
        requirejs(['model/MainRouter'], function(MainRouter) {
            Module = MainRouter;
            done();
        });
    });

    test('initialise', function() {
        assert.doesNotThrow(function() {
            new Module();
        });
    });

    test('#home', function() {
        assert.doesNotThrow(function() {
            new Module().home();
        });
    });

    test('#add/task', function() {
        assert.doesNotThrow(function() {
            new Module().add('task');
        });
    });

    test('#add/list', function() {
        assert.doesNotThrow(function() {
            new Module().add('list');
        });
    });

    test('#add/unhandled', function() {
        assert.doesNotThrow(function() {
            new Module().add('unhandled');
        });
    });

    suite('#edit/', function() {
        var List;
        setup(function(done) {
            requirejs(['model/MainRouter', 'model/TaskList'], function(MainRouter, TaskList) {
                Module = MainRouter;
                List = new TaskList('root', {
                    id: 'root'
                });
                List.addTask({
                    id: 'ok'
                });
                TaskOnFly.setCurrentList(List);
                done();
            });
        });

        test('ok', function() {
            assert.doesNotThrow(function() {
                new Module().edit('ok');
            });
        });

        test('badID', function() {
            assert.throw(function() {
                new Module().edit('badID');
            }, Error, 'Item with id: "badID" was not found');
        });
    });
});