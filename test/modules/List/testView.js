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

suite('List.View', function() {
    var Module;
    var object;
    setup(function(done) {
        requirejs(['modules/List/View'], function(View) {
            Module = View;

            done();
        });
    });
    teardown(function() {
        Module = null;
    });

    suite('Methods', function() {
        var stub_popup;
        var stub_showPopup;

        setup(function() {
            object = new Module();

            stub_showPopup = sinon.stub(object.popup, 'show', function() {});
        });
        teardown(function() {
            object = null;

            stub_showPopup.restore();
        });

        test('onRemove()', function() {
            assert.doesNotThrow(function() {
                object.onRemove(ev);
            });
            assert.equal(stub_showPopup.callCount, 1, 'PopupDialog should be shown');
        });
    });
});
