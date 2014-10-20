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

suite('SimpleSearch', function() {
    var Module,
        listView,
        TaskList;
    setup(function(done) {
        requirejs(['modules/SimpleSearch/Control', 'view/ListView', 'model/TaskList'], function(SimpleSearchControl, ListView, List) {
            Module = SimpleSearchControl;
            listView = new ListView();
            TaskList = List;
            done();
        })
    });
    teardown(function() {
        window.localStorage.storage = {};
    });

    test('initialize()', function() {
        assert.doesNotThrow(function() {
            new Module();
        });
    });
    test('initialize(string)', function() {
        assert.throw(function() {
            new Module('listView');
        }, Error, 'Incorrect type for listModule input argument');
    });

    test('not singleton', function() {
        assert.notEqual(new Module(), new Module(), 'This module should not be an singleton');
    });

    suite('Test object.', function() {
        var module;
        setup(function() {
            module = new Module();
        });

        test('setListModule()', function() {
            assert.throw(function() {
                module.setListModule();
            }, Error, 'Incorrect type for listModule input argument');
        });
        test('setListModule(string)', function() {
            assert.throw(function() {
                module.setListModule('string');
            }, Error, 'Incorrect type for listModule input argument');
        });
        test('setListModule(listView)', function() {
            assert.doesNotThrow(function() {
                module.setListModule(listView);
            });
            assert.equal(module.listModule, listView, 'listModule has incorrect reference');
        });

        suite('Test _showResults method', function() {
            setup(function() {
                module.setListModule(listView);

                sinon.stub(module.listModule.control, 'setList', function() {});
                sinon.stub(module.listModule, 'render', function() {});
            });
            teardown(function() {
                module.listModule.control.setList.restore();
                module.listModule.render.restore();
            });

            test('_showResults(list)', function() {
                var list = new TaskList('root', {id: 'root'});
                module._showResults(list);

                assert.equal(module.listModule.control.setList.callCount, 1, 'list was not set to the ListModule');
                assert.equal(module.listModule.control.setList.args[0][0], list, 'Incorrect list was set to the ListModule');
                assert.equal(module.listModule.render.callCount, 1, 'ListModule was not rendered');
            });

            test('_showResults(this.list) && this.list === this.listModule.control.getList()', function() {
                module.listModule.control.list = module.list;
                module._showResults(module.list);

                assert.equal(module.listModule.control.setList.callCount, 0, 'setList() should not be called');
            });
        });

        suite('spy on _showResults()', function() {
            setup(function() {
                sinon.stub(module, '_showResults', function() {});
            });
            teardown(function() {
                module._showResults.restore();
            });

            test('search(undefined)', function() {
                module.setListModule(listView);
                module.search();

                assert.equal(module._showResults.callCount, 0, '_showResults() should not be called');
            });
            test('search(value) without listModule', function() {
                assert.throw(function() {
                    module.search('value');
                }, Error, 'listModule is not defined');
            });
            test('search(value)', function() {
                sinon.spy(module.list, 'filter');

                var searchValue = 'value';

                module.setListModule(listView);
                module.search(searchValue);

                assert.equal(module._showResults.callCount, 1, '_showResults() was not called');
                assert.equal(module.list.filter.callCount, 1, 'filter() was not called');
                assert.equal(module.list.filter.args[0][0].title, searchValue, 'incorrect searching value');

                module.list.filter.restore();
            });

            test('reset() without listModule', function() {
                assert.throw(function() {
                    module.reset();
                }, Error, 'listModule is not defined');
            });
            test('reset()', function() {
                module.setListModule(listView);
                module.reset();

                assert.equal(module._showResults.callCount, 1);
                assert.equal(module._showResults.args[0][0], module.list, 'Incorrect list was reset');
            });
        });
    });
});