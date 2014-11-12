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

suite('Test MainRouter', function() {
    var Module;
    setup(function(done) {
        requirejs.undef('model/MainRouter');
        requirejs(['model/MainRouter'], function(MainRouter) {
            Module = MainRouter;
            done();
        });
    });
    teardown(function() {
        Module = null;
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

    test('#about', function() {
        assert.doesNotThrow(function() {
            new Module().about();
        });
    });

    suite('test MainRouter with list item and task', function() {
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
                List.addList({
                    id: 'list'
                });

                TaskOnFly.setRootList(List);
                TaskOnFly.setCurrentList(List);

                done();
            });
        });
        teardown(function() {
            window.localStorage.storage = {};
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


        suite('#path/', function() {
            test('no path; set root list as current', function() {
                var module = new Module();

                assert.doesNotThrow(function() {
                    module.path();
                });

                assert.equal(TaskOnFly.getCurrentList(), TaskOnFly.getRootList(), 'Root list was not set as current for #path/');
            });
            test('list', function() {
                var module = new Module();

                assert.doesNotThrow(function() {
                    module.path('list/');
                });

                assert.equal(TaskOnFly.getCurrentList(), List.models.list, 'Incorrect list was set as current for #path/list/');
            });
            test('nonexistent list', function() {
                var module = new Module();
                sinon.spy(TaskOnFly, 'changeView');
                sinon.spy(TaskOnFly, 'setCurrentList');

                assert.doesNotThrow(function() {
                    module.path('nolist/');
                });

                assert.equal(TaskOnFly.changeView.callCount, 1, 'TaskOnFly.changeView() should be called if list is not found');
                assert.equal(TaskOnFly.changeView.args[0][0], '#home', 'If list is not found user should be redirected to the home page');
                assert.equal(TaskOnFly.setCurrentList.callCount, 0, 'TaskOnFly.setCurrentList() should not be called if list is not found');

                TaskOnFly.changeView.restore();
                TaskOnFly.setCurrentList.restore();
            });

            test('list', function() {
                var module = new Module();

                sinon.spy(module, 'home');

                assert.doesNotThrow(function() {
                    module.path('list/');
                });

                assert.equal(module.home.callCount, 1, 'home() should be called if home page was not created before');

                module.home.restore();
            });
        });
    });
});