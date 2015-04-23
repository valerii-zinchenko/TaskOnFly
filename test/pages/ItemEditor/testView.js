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

suite('ItemEditor.View', function() {
    var Module;
    setup(function(done) {
        requirejs.undef('pages/ItemEditor/View');
        requirejs(['pages/ItemEditor/View'], function(View) {
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
        assert.equal(new Module(), new Module(), 'This module should be a singleton');
    });

    suite('Test methods', function() {
        var module;
        setup(function() {
            module = new Module();

            module.control = {
                resetItem: function(){},
                getData: function(){},
                save: function(){}
            }
        });
        teardown(function() {
            module = null;
        });

        test('_attachEvents()', function() {
            assert.doesNotThrow(function() {
                module._attachEvents();
            });
        });

        suite('render()', function() {
            setup(function() {
                sinon.spy(module.$isDone, 'addClass');
                sinon.spy(module.$isDone, 'removeClass');
            });
            teardown(function() {
                module.$isDone.addClass.restore();
                module.$isDone.removeClass.restore();
            });

            test('test internal called methods', function() {
                sinon.spy(module.parent, 'render');
                sinon.spy(module, 'setData');
                sinon.spy(module.control, 'resetItem');
                sinon.stub(module.control, 'getData', function() {return {};});

                assert.doesNotThrow(function() {
                    module.render();
                });
                assert.equal(module.setData.callCount, 1, 'setData() should be called to set the model properties to the view');
                assert.equal(module.parent.render.callCount, 1, 'Parent render() method should be called here in order to reuse code');
                assert.equal(module.control.resetItem.callCount, 1, 'Edited item should be reset to prevent the data caching of current item');

                module.parent.render.restore();
                module.setData.restore();
                module.control.resetItem.restore();
                module.control.getData.restore();
            });
            test('display item as "not done"', function() {
                sinon.stub(module.control, 'getData', function() {return {isDone: false};});

                assert.doesNotThrow(function() {
                    module.render();
                });

                assert.isTrue(module.$isDone.addClass.callCount === 1
                    && module.$isDone.addClass.args[0][0] === 'ui-checkbox-off'
                    && module.$isDone.removeClass.callCount === 1
                    && module.$isDone.removeClass.args[0][0] === 'ui-checkbox-on', 'Item should be displayed as "not done"');

                module.control.getData.restore();
            });
            test('display item as "done"', function() {
                sinon.stub(module.control, 'getData', function() {return {isDone: true}; });

                assert.doesNotThrow(function() {
                    module.render();
                });

                assert.isTrue(module.$isDone.addClass.callCount === 1
                && module.$isDone.addClass.args[0][0] === 'ui-checkbox-on'
                && module.$isDone.removeClass.callCount === 1
                && module.$isDone.removeClass.args[0][0] === 'ui-checkbox-off', 'Item should be displayed as "done"');

                module.control.getData.restore();
            });
        });

        test('setDate()', function() {
            var data = {};
            sinon.stub(module.control, 'getData', function(){return data});

            assert.doesNotThrow(function() {
                module.setData();
            });
            assert.equal(module.data, data, 'Data was incorrectly set');
        });

        suite('Test events', function() {
            var ev;
            setup(function() {
                ev = {
                    preventDefault: function(){}
                }
            });
            teardown(function() {
                ev= null;
            });

            test('save', function() {
                sinon.spy(module.control, 'save');
                sinon.stub(module.$title, 'val', function() {return ''});
                sinon.spy(TaskOnFly, 'changeView');

                assert.doesNotThrow(function() {
                    module.save(ev);
                });
                assert.equal(module.control.save.callCount, 1, 'save() of control sub-module should be called to set the data to the model');
                assert.equal(TaskOnFly.changeView.callCount, 1, 'After saveing the data redirect the user to the home page');

                module.control.save.restore();
                module.$title.val.restore();
                TaskOnFly.changeView.restore();
            });
            test('onToggleStatus', function() {
                var spy = sinon.spy(module.$isDone, 'toggleClass');
                spy.withArgs('ui-checkbox-on');
                spy.withArgs('ui-checkbox-off');

                assert.doesNotThrow(function() {
                    module.onToggleStatus(ev);
                });
                assert.equal(module.$isDone.toggleClass.callCount, 2, 'Two classes should be toggled');
                assert.isTrue(spy.withArgs('ui-checkbox-on').calledOnce, 'Class "ui-checkbox-on" of the checkbox element should be toggled');
                assert.isTrue(spy.withArgs('ui-checkbox-off').calledOnce, 'Class "ui-checkbox-off" of the checkbox element should be toggled');

                module.$isDone.toggleClass.restore();
            });
        });
    });
});
