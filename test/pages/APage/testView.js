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

suite('Test View of APage page', function() {
    var Module;

    setup(function(done) {
        requirejs.undef('pages/APage/View');
        requirejs(['pages/APage/View'], function(View) {
            Module = View;
            done();
        });
    });
    teardown(function() {
        Module = null;
    });

    test('Constructor', function() {
        sinon.spy(_, 'template');
        sinon.spy($, 'append');
        //sinon.spy($);

        assert.doesNotThrow(function() {
            new Module();
        });

        assert.equal(_.template.callCount, 1, 'Template processor should be called in View constructor');
        assert.equal(_.template.args[0][0], '', 'Abstract page view template should not be defined');
        //assert.equal($.callCount, 2, '$ should called twice: 1 - create page container, 2 - select "body" from DOM');
        //assert.equal($.getCall(1).args[0], 'body', '"body" should be selected from DOM, where all pages where be stored');
        assert.equal($.append.callCount, 1, 'Newly created page element should be appended to the main DOM element');

        _.template.restore();
        $.append.restore();
        //$.restore();
    });

    test('Is Singleton?', function() {
        assert.equal(new Module(), new Module(), 'View of the page should be an singleton');
    });

    test('render()', function() {
        var module = new Module();
        sinon.spy(module.$el, 'trigger');

        assert.doesNotThrow(function() {
            module.render();
        });

        assert.equal(module.$el.trigger.callCount, 1, 'trigger() should be called once by calling render() method');
        assert.equal(module.$el.trigger.args[0][0], 'create', 'trigger() should be called with "create" input argument');

        module.$el.trigger.restore();
    });
});