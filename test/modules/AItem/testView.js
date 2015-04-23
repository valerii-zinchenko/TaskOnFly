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
suite('ListItem.View', function() {
    var Module;
    setup(function(done) {
        requirejs(['modules/ListItem/View'], function(View) {
            Module = View;

            done();
        });
    });
    teardown(function() {
        Module = null;
    });


    suite('Constructor', function() {
        test('New object', function() {
            assert.doesNotThrow(function() {
                new Module();
            });
        });

        test('Is singleton?', function() {
            assert.notEqual(new Module(), new Module(), 'View sub-module should not be an singleton');
        });
    });

    suite('Methods', function() {
        var object;
        var control;
        setup(function() {
            object = new Module();
            object.control = sinon.stub({
                setModel: function(){},
                action: function(){},
                removeModel: function(){},
                _editItem: function(){}
            });
            object.$listItem = $;
        });
        teardown(function() {
            object = null;
        });

        // For task - toggle; for list - select
        suite('onClick()', function() {
            test('for Task', function() {
                var stubListItem = sinon.spy(object.$listItem, 'toggleClass');

                object.model = new TaskManager.Task('parent');

                assert.doesNotThrow(function() {
                    object.onClick(ev);
                });
                assert.equal(object.control.action.callCount, 1, 'View should call the method action() of control sub-module');
                assert.equal(object.$listItem.toggleClass.callCount, 1);
                assert.equal(object.$listItem.toggleClass.args[0][0], 'done', '"done" class should be toggled for Task item element');

                stubListItem.restore();
            });

            test('for TaskList', function() {
                var stubListItem = sinon.spy(object.$listItem, 'toggleClass');

                object.model = new TaskManager.TaskList('parent');

                assert.doesNotThrow(function() {
                    object.onClick(ev);
                });
                assert.equal(object.control.action.callCount, 1, 'View should call the method action() of control sub-module');
                assert.equal(object.$listItem.toggleClass.callCount, 0);

                stubListItem.restore();
            });
        });

        test('onEdit()', function() {
            assert.doesNotThrow(function() {
                object.onEdit(ev);
            });
            assert.equal(object.control._editItem.callCount, 1, 'View should call the method editModel() of control sub-module');
        });

        test('onRemove()', function() {
            // Mock model
            object.model = {
                public: {type: 'Task'}
            };

            assert.doesNotThrow(function() {
                object.onRemove(ev);
            });
            assert.equal(object.control.removeModel.callCount, 1, 'View should call the method removeModel() of control sub-module');
        });
    });
});
