/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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
    /**
     *
     * @param {string} viewName View name, that should be opened
     * @param {Function} [fn] Function that calls before rendering of view.
     * @private
     */
    function _openView (viewName, fn) {
        requirejs(['view/' + viewName], function(View) {
            var view = new View();

            if (fn) {
                fn.call(view);
            }

            $.mobile.changePage('#' + view.page);
            view.render();
        });
    }

    var MainRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'home': 'home',
            'add/:what': 'add',
            'edit/:name': 'edit'
        },

        home: function() {
            _openView('HomeView');
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
            _openView('EditItemView', function() {
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

            _openView('EditItemView', function() {
                this.control.setItem(item);
                this.control.setSaveCallback(list.saveData.bind(item));
            });
        }
    });

    TaskManager.MainRouter = MainRouter;
    return MainRouter;
});