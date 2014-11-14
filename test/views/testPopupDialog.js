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

suite('PopupDialog', function() {
    var Module;
    setup(function(done) {
        requirejs(['view/PopupDialog'], function(View) {
            Module = View;
            done()
        });
    });
    teardown(function() {
        Module = null;
    });

    suite('initialize()' , function() {
        test('no arguments', function(){
            assert.throw(function(){
                new Module();
            }, Error, 'Incorrect input arguments');
        });
        test('incorrect input arguments type', function(){
            assert.throw(function(){
                new Module(':)');
            }, Error, 'Incorrect types of input arguments');
        });

        test('{}', function() {
            assert.throw(function(){
                new Module({});
            }, Error, 'No message is defined');
        });
        test('{message: []}', function(){
            assert.throw(function(){
                new Module({messages: {}});
            }, Error, 'Incorrect type of "messages" property');
        });
        test('{message: "msg"}', function(){
            assert.throw(function(){
                new Module({messages: 'msg'});
            }, Error, 'No controls defined');
        });
        test('{message: ["msg"]}', function(){
            assert.throw(function(){
                new Module({messages: ['msg']});
            }, Error, 'No controls defined');
        });
        test('{message: "msg", controls: "control"}', function(){
            assert.throw(function(){
                new Module({
                    messages: 'msg',
                    controls: 'control'
                });
            }, Error, 'Incorrect type of "controls" property');
        });
        test('{message: "msg", controls: ["control"]}', function(){
            assert.throw(function(){
                new Module({
                    messages: 'msg',
                    controls: ['control']
                });
            }, Error, 'Incorrect type of content in "controls" property');
        });
        test('{message: "msg", controls: [{}]}', function(){
            assert.throw(function(){
                new Module({
                    messages: 'msg',
                    controls: [{}]
                });
            }, Error, 'All controls should have a "title" property');
        });
        test('{message: "msg", controls: [{title: {}}]}', function(){
            assert.throw(function(){
                new Module({
                    messages: 'msg',
                    controls: [{
                        title: {}
                    }]
                });
            }, Error, 'All control\'s "title" properties should be have string type');
        });
        test('{message: "msg", controls: [{title: "title"; callback: "fn"}]}', function(){
            assert.throw(function(){
                new Module({
                    messages: 'msg',
                    controls: [{
                        title: 'title',
                        callback: 'fn'
                    }]
                });
            }, Error, 'All control\'s "callback" properties should be have function type');
        });
        test('{message: "msg", controls: [{title: "title", callback: function(){}}]}', function(){
            var module;
            var controls = [{
                title: 'title',
                callback: function(){}
            }];

            assert.doesNotThrow(function(){
                module = new Module({
                    messages: 'msg',
                    controls: controls
                });
            });
            assert.isArray(module.messages, 'Property "messages" should be an array');
            assert.equal(module.controls, controls, '"controls" property was incorrectly created');
        });
    });

    suite('Test methods', function() {
        var module;
        setup(function(){
            module = new Module({
                messages: 'msg',
                controls: [{title: 'title'}]
            });
        });
        teardown(function(){
            module = null;
        });

        test('render()', function(){
            module.$el = $;

            var processTemplate = sinon.stub(_, 'template');
            var insertElInDOM = sinon.spy($, 'append');
            var makePopup = sinon.spy(module.$el, 'popup');
            var create = sinon.spy(module.$el, 'trigger');
            var attachEvents = sinon.stub(module, '_attachEvents');

            assert.doesNotThrow(function(){
                module.render();
            });
            sinon.assert.callOrder(
                processTemplate,
                insertElInDOM,
                makePopup,
                create
            );
            sinon.assert.calledOnce(attachEvents);
            assert.equal(module.$el.trigger.args[0][0], 'create', 'Main view element should call trigger("create")');

            processTemplate.restore();
            insertElInDOM.restore();
            makePopup.restore();
            create.restore();
            attachEvents.restore();
        });

        test('show()', function() {
            var spyPopup;
            var spyRender = sinon.stub(module, 'render', function(){
                module.$el = $;
                spyPopup = sinon.spy(module.$el, 'popup');
            });

            assert.doesNotThrow(function() {
                module.show();
            });
            assert.equal(module.render.callCount, 1, 'By uninitialized $el render() should be called');
            assert.equal(module.$el.popup.callCount, 1);
            assert.equal(module.$el.popup.args[0][0], 'open', 'popup("open") should be called');
            sinon.assert.callOrder(
                spyRender,
                spyPopup
            );

            assert.doesNotThrow(function() {
                module.show();
            });
            assert.equal(module.render.callCount, 1, 'render() should not be called when $el is initialized');

            spyPopup.restore();
            spyRender.restore();
        });

        suite('hide()', function(){
            setup(function() {
                module.$el = $;
            });
            test('without callback function', function() {
                var spyPopup = sinon.spy(module.$el, 'popup');

                assert.doesNotThrow(function() {
                    module.hide();
                });
                assert.equal(module.$el.popup.callCount, 1);
                assert.equal(module.$el.popup.args[0][0], 'close', 'popup("close") should be called');

                spyPopup.restore();
            });

            test('with callback function', function() {
                var spyPopup = sinon.spy(module.$el, 'popup');
                var spyCallback = sinon.stub();

                assert.doesNotThrow(function() {
                    module.hide(spyCallback);
                });
                assert.equal(spyCallback.callCount, 1, 'callback function should be called');
                assert.equal(module.$el.popup.callCount, 1);
                assert.equal(module.$el.popup.args[0][0], 'close', 'popup("close") should be called');
                sinon.assert.callOrder(
                    spyCallback,
                    spyPopup
                );

                spyPopup.restore();
                spyCallback.restore();
            });
        });

        test('_attachEvents()', function() {
            module.$el = $;
            var spy = sinon.spy(module.$el, 'find');
            module.controls = [
                {
                    title: 'title 1'
                },
                {
                    title: 'title 2',
                    callback: function(){}
                }
            ];

            assert.doesNotThrow(function(){
                module._attachEvents();
            });
            assert.equal(spy.callCount, 1, 'Some event handler should not be attached to the first control element');

            spy.restore();
        });
    });
});