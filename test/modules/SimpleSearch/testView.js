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

suite('Test SimpleSearch.View', function() {
    suite('initialize()', function() {
        var Module;
        setup(function(done) {
            requirejs.undef('modules/SimpleSearch/View');
            requirejs(['modules/SimpleSearch/View'], function(View) {
                Module = View;
                done();
            })
        });
        teardown(function() {
            Module = null;
        });

        test('no arguments', function() {
            assert.throw(function() {
                new Module();
            }, Error, 'Holder element for module is not defined');
        });
        test('incorrect argument type', function() {
            assert.throw(function() {
                new Module(':)');
            }, Error, 'Incorrect input argument type');
        });
        test('correct argument', function() {
            assert.doesNotThrow(function() {
                new Module($);
            });
        });

        test('Is Singleton?', function() {
            assert.equal(new Module($), new Module($));
        });
    });

    suite('Test methods', function() {
        var module;
        setup(function(done) {
            requirejs(['modules/SimpleSearch/View'], function(View) {
                module = new View($);

                // mock control sub-module
                module.control = {
                    search: function(){},
                    reset: function(){}
                };
                done();
            })
        });
        teardown(function() {
            module = null;
        });

        test('_attachEvents()', function() {
            assert.doesNotThrow(function() {
                module._attachEvents();
            });
        });

        test('render()', function() {
            sinon.spy(module.$holder, 'empty');
            sinon.spy(module.$holder, 'append');
            sinon.spy(module.$holder, 'trigger');
            sinon.spy(module, '_attachEvents');

            assert.doesNotThrow(function() {
                module.render();
            });

            assert.equal(module.$holder.empty.callCount, 1, 'The content of holder element should be removed first');
            assert.equal(module.$holder.append.callCount, 1, 'append() should be called in order to add new content');
            assert.equal(module.$holder.append.args[0][0], module.$el, 'The new content should be appended into the holder element');
            assert.equal(module.$holder.trigger.callCount, 1, 'trigger() should be called');
            assert.equal(module.$holder.trigger.args[0][0], 'create', 'trigger("create") should be called to run jQuery creation wrappers');
            assert.equal(module._attachEvents.callCount, 1, 'Event handlers should be attached to the new content');

            module.$holder.empty.restore();
            module.$holder.append.restore();
            module.$holder.trigger.restore();
            module._attachEvents.restore();
        });

        suite('Test events', function() {
            var ev;
            setup(function() {
                ev = {
                    preventDefault: function(){}
                }
            });
            teardown(function() {
                ev = null;
            });

            suite('onType()', function() {
                setup(function() {
                    sinon.stub(module, 'onClear', function(){});
                    sinon.stub(module.control, 'search', function(){});
                });
                teardown(function() {
                    module.onClear.restore();
                    module.control.search.restore();
                });

                test('value length < 2', function() {
                    sinon.stub($, 'val', function() {
                        return '0';
                    });

                    assert.doesNotThrow(function() {
                        module.onType(ev);
                    });

                    assert.equal(module.onClear.callCount, 1, 'onClear() should be called in this case');
                    assert.equal(module.control.search.callCount, 0, 'Control should not search anything in this case');

                    $.val.restore();
                });
                test('value length >= 2', function() {
                    sinon.stub($, 'val', function() {
                        return '0123';
                    });

                    assert.doesNotThrow(function() {
                        module.onType(ev);
                    });

                    assert.equal(module.onClear.callCount, 0, 'onClear() should not be called in this case');
                    assert.equal(module.control.search.callCount, 1, 'Control call search() in this case');

                    $.val.restore();
                });
            });

            test('onClear()', function() {
                sinon.stub(module.control, 'reset', function(){});

                assert.doesNotThrow(function() {
                    module.onClear(ev);
                });

                assert.equal(module.control.reset.callCount, 1, 'onClear event should call reset() of control sub-module');

                module.control.reset.restore();
            });
        });
    });
});