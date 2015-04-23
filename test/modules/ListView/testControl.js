/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

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

suite('ListView.Control', function() {
    var Module, TaskListModule;
    setup(function(done) {
        requirejs(['modules/ListView/Control'], function(Control) {
            Module = Control;
            TaskListModule = TaskManager.TaskList;
            done();
        })
    });
    teardown(function() {
        window.localStorage.storage = {};
    });

    suite('initialize()', function() {
        test('no arguments', function() {
            assert.doesNotThrow(function() {
                new Module();
            })
        });
        test('incorrect argument type', function() {
            assert.throw(function() {
                new Module('badList');
            }, Error, 'List is incorrect');
        });
        test('correct input argument', function() {
            assert.doesNotThrow(function() {
                new Module(new TaskListModule('root'));
            });
        });
    });

    suite('Test methods', function() {
        var module,
            list;
        setup(function() {
            module = new Module();
            list = new TaskListModule('root');

            sinon.spy(list.$, 'trigger');
            sinon.spy(list, 'removeItem');
        });
        teardown(function() {
            window.localStorage.storage = {};

            list.$.trigger.restore();
            list.removeItem.restore();
        });

        suite('setList()', function() {
            test('no arguments', function() {
                assert.throw(function() {
                    module.setList();
                }, Error, 'List is incorrect');
            });
            test('incorrect argument type', function() {
                assert.throw(function() {
                    module.setList('string');
                }, Error, 'List is incorrect');
            });
            test('correct input argument', function() {
                assert.doesNotThrow(function() {
                    module.setList(list);
                }, Error, 'List is incorrect');
            });
        });

        test('getList()', function() {
            module.setList(list);

            assert.equal(module.getList(), list, 'Lists have different references');
        });

        suite('selectList()', function() {
            test('non-existed ID', function() {
                module.setList(list);

                assert.isUndefined(module.selectList('bad'));
            });
            test('existed ID', function() {
                var ok = list.addList({id: 'ok'});
                module.setList(list);

                assert.equal(module.selectList('ok'), ok, 'Selected list is pointed to other list');
            });
        });

        test('selectParentList()', function() {
            var ok = list.addList({id: 'ok'});
            module.setList(ok);

            assert.equal(module.selectParentList(), list, 'Parent list is pointed to other list');
        });

        test('_toggleTaskStatus()', function() {
            var ok = list.addList({id: 'ok', isDone: false});
            module.setList(list);
            module._toggleTaskStatus('ok');

            assert.isTrue(ok.public.isDone, 'Item status was not changed');
        });

        test('_insertItem()', function() {
            module._insertItem();

            assert.equal(list.$.trigger.callCount, 1, 'Event was not triggered');
            assert.equal(list.$.trigger.args[0][0], 'newItem', 'Event name is incorrect');
        });

        test('_editItem()', function() {
            module._editItem('ok');

            assert.equal(window.location.hash, '#edit/ok');
        });

        test('_removeItem()', function() {
            module.setList(list);
            module._removeItem('ok');

            assert.equal(list.removeItem.callCount, 1, 'list.removeItem() was not called');
            assert.equal(list.removeItem.args[0][0], 'ok', 'incorrect item ID was trying to be removed');
        });
    });
});
