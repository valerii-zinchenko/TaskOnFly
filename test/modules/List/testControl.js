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

suite(function() {
    var Module;
    setup(function(done) {
        requirejs(['js/modules/Task/Control'], function(Control) {
            Module = Control;

            done();
        });
    });
    teardown(function() {
        Module = null;
    });

    suite('Methods.', function() {
        var object;
        setup(function() {
            object = new Module();
        });
        teardown(function() {
            object = null;
        });

        test('action()', function() {
            var changeViewStub = sinon.stub(TaskOnFly, 'changeView', function() {});

            object.setModel(new TaskManager.TaskList('parent', {
                id: 'ok'
            }));

            assert.doesNotThrow(function() {
                object.action();
            });
            assert.equal(changeViewStub.callCount, 1, 'Control should call global application function to redirect the user to edit page');
            assert.equal(changeViewStub.args[0][0], '#path/ok/', 'Location hash should be changed to "#path/{itemID}/"');

            changeViewStub.restore();
        });
    });
});
