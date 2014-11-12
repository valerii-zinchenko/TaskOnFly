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

suite('Test Home.View', function() {
    var Module;
    setup(function(done) {
        requirejs.undef('pages/Home/View');
        requirejs(['pages/Home/View'], function(View) {
            Module = View;
            done();
        });
    });
    teardown(function() {
        Module = null;
    });

    test('initialize()', function() {
        assert.doesNotThrow(function() {
            new Module();
        });
    });
    test('Is singleton?', function() {
        assert.equal(new Module(), new Module(), 'This view sub-module should be a singleton');
    });

    suite('Test object methods', function() {
        var module;
        setup(function() {
            module = new Module();

            sinon.stub(module.list.view, 'render');
            sinon.stub(module.fastTask.view, 'render');
            sinon.stub(module.simpleSearch.view, 'render');
            sinon.stub(module.panel.view, 'render');
        });
        teardown(function() {
            module.list.view.render.restore();
            module.fastTask.view.render.restore();
            module.simpleSearch.view.render.restore();
            module.panel.view.render.restore();

            module = null;
        });

        test('_renderModules()', function() {
            assert.doesNotThrow(function() {
                module._renderModules();
            });

            assert.equal(module.list.view.render.callCount, 1, 'render() of ListView module should be called');
            assert.equal(module.fastTask.view.render.callCount, 1, 'render() of FastTask module should be called');
            assert.equal(module.simpleSearch.view.render.callCount, 1, 'render() of SimpleSearch module should be called');
            assert.equal(module.panel.view.render.callCount, 1, 'render() of MainPanel module should be called');
        });

        suite('_fixFooterTable()', function () {
            test('_footerBtnsWidth is not defined', function() {
                assert.doesNotThrow(function() {
                    module._fixFooterTable();
                });
            });
            test('_footerBtnsWidth is defined', function() {
                module._footerBtnsWidth = 5;
                assert.doesNotThrow(function() {
                    module._fixFooterTable();
                });
            });
        });

        test('render()', function() {
            sinon.stub(module.parent, 'render');
            sinon.stub(module, '_fixFooterTable');
            sinon.stub(module, '_renderModules');

            assert.doesNotThrow(function() {
                module.render();
            });

            assert.equal(module.parent.render.callCount, 1, 'Parent render() method should be called');
            assert.equal(module._fixFooterTable.callCount, 1, '_fixFooterTable() should be called');
            assert.equal(module._renderModules.callCount, 1, '_renderModules() should be called');

            module.parent.render.restore();
            module._fixFooterTable.restore();
            module._renderModules.restore();
        });

        suite('Test events', function() {
            var ev = {
                preventDefault: function(){}
            };

            setup(function() {
                module.control = {
                    addTask: function(){},
                    addList: function(){}
                };

                sinon.stub(module.control, 'addTask');
                sinon.stub(module.control, 'addList');
                sinon.stub(module.list.view, 'selectParentList');
            });
            teardown(function() {
                module.control.addTask.restore();
                module.control.addList.restore();
                module.list.view.selectParentList.restore();
            });

            test('addTask()', function() {
                assert.doesNotThrow(function() {
                    module.addTask(ev);
                });

                assert.equal(module.control.addTask.callCount, 1, 'addTask() of control sub-module should be called');
            });
            test('addList()', function() {
                assert.doesNotThrow(function() {
                    module.addList(ev);
                });

                assert.equal(module.control.addList.callCount, 1, 'addList() of control sub-module should be called');
            });
            test('selectPreviousList()', function() {
                assert.doesNotThrow(function() {
                    module.selectPreviousList(ev);
                });

                assert.equal(module.list.view.selectParentList.callCount, 1, 'selectPreviousList() of ListView.View module should be called');
            });
        });
    });
});