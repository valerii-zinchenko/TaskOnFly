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

define(function () {
    var MainRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'home': 'home',
            'about': 'about',
            'add/:what': 'add',
            'edit/:name': 'edit',
            'path': 'path',
            'path/*path': 'path'
        },

        _view: null,

        /**
         *
         * @param {string} viewName View name, that should be opened
         * @param {Function} [fn] Function that calls before rendering of view.
         * @private
         */
        _openView: function(viewName, fn) {
            requirejs(['view/' + viewName], function(View) {
                this._view = new View();

                if (fn) {
                    fn.call(this._view);
                }

                $.mobile.pageContainer.pagecontainer('change', '#' + this._view.page);
            }.bind(this));
        },

        initialize: function() {
            $.mobile.pageContainer.pagecontainer({
                change: function() {
                    this._view.render();
                }.bind(this)
            });
        },

        home: function() {
            this._openView('HomeView');
        },
        about: function() {
            this._openView('About');
        },

        /**
         *
         * @param {string} what Defines what should be added to the current list. It can be: 'task', 'list'
         */
        add: function(what) {
            switch (what) {
                case 'task':
                case 'list':
                    break;
                default :
                    console.warn('Unknown element name "' + what + '"');
                    return;
            }

            var fn = 'add' + what[0].toUpperCase() + what.slice(1);
            this._openView('EditItemView', function() {
                this.header = 'Add ' + what;
                var list = TaskOnFly.getCurrentList();
                this.control.setSaveCallback(list[fn].bind(list));
            });
        },

        /**
         *
         * @param {string} id Item name in the current list.
         */
        edit: function(id) {
            var list = TaskOnFly.getCurrentList(),
                item = list.getItem(id);

            if (!item) {
                throw new Error('Item with id: "' + id + '" was not found');
            }

            this._openView('EditItemView', function() {
                this.header = item.public.type;
                this.control.setItem(item);
                this.control.setSaveCallback(list.saveData.bind(item));
            });
        },

        path: function(path) {
            var list = TaskOnFly.getRootList(),
                pathStack;

            if (path) {
                pathStack = path.split('/');
                pathStack.pop();
                list = list.findList(pathStack);
            }

            if (!list) {
                console.warn('Incorrect list path:' + path);
                return;
            }

            TaskOnFly.$.trigger('showList', list);
        }
    });

    TaskManager.MainRouter = MainRouter;
    return MainRouter;
});