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

define(function () {
    return Backbone.Router.extend({
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
         * @param {string} pageName Page name, that should be opened.
         * @param {Function} [fn] Function that calls before rendering of view.
         * @private
         */
		_openPage: function(pageName, fn) {
			var page = TaskOnFly.useState(pageName);
			var view = page.view;

			if (fn) {
				fn.call(view);
			}

			view.render();
			view.postRender();

			//view.update();

			if (this._view) {
				this._view.hide();
			}

			view.show();
			view.update();

			this._view = view;
		},

        home: function() {
            this._openPage('home');
        },
        about: function() {
            this._openPage('about');
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
            this._openPage('itemEditor', function() {
				this.setHeader('Add ' + what);

                this.control.setSaveCallback(function(data) {
					var list = TaskOnFly.model.getCurrentList();

					list.model[fn](data);
				});
            });
        },

        /**
         *
         * @param {string} id Item name in the current list.
         */
        edit: function(id) {
            var list = TaskOnFly.model.getCurrentList(),
                item = list.model.getItem(id);

            if (!item) {
                throw new Error('Item with id: "' + id + '" was not found');
            }

            this._openPage('itemEditor', function() {
                this.setHeader(item.model.public.type);
				this.setDataModel(item.model);
                this.control.setSaveCallback(list.model.saveData.bind(item.model));
            });
        },

        path: function(path) {
            var list = TaskOnFly.model.getRootList(),
                pathStack;

            if (path) {
                pathStack = path.split('/');
                pathStack.pop();
                list = list.model.findList(pathStack);
            }

            if (!list) {
                console.warn('Incorrect list path:' + path);
                TaskOnFly.model.changeView('home');

                return;
            }

            TaskOnFly.model.setCurrentList(list);

            if (!this._view || this._view.page !== 'home') {
                this.home();
            }
        }
    });
});
