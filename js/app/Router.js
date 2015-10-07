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
	return new HashRouter({
		'home': 'home',
		'about': 'about',
		'add/:what': 'add',
		'edit/:id': 'edit',
		'path/(.*/?)': 'path',
		'': 'home'
	},
	{
		prefix: '!',
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

			view.update();

			if (this._view) {
				this._view.hide();
			}

			view.show();

			this._view = view;

			if (window.ga) {
				ga('set', 'pageview', {
					'title': pageName
				});
				ga('send', 'pageview');
			}
		},

		home: function() {
			if (window.ga) {
				ga('set', 'pageview', {
					'page': '/#!home',
				});
			}

			this._openPage('home');
		},
		about: function() {
			if (window.ga) {
				ga('set', 'pageview', {
					'page': '/#!about',
				});
			}

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

			var fn = '_add' + what[0].toUpperCase() + what.slice(1);
			var _this = this;
			this._openPage('itemEditor', function() {
				this.setHeader('Add ' + what);

				this.control.setSaveCallback(_this[fn]);
			});
		},
		_addTask: function(data){
			var list = TaskOnFly.model.getCurrentList();

			list.model.addItem(TaskOnFly.model.createTask(data));
		},
		_addList: function(data){
			var list = TaskOnFly.model.getCurrentList();

			var newList = TaskOnFly.model.createTaskList(data);
			newList.model._parent = list.model;
			newList.model._path = [list.model._path, newList.model.public.id, '/'].join('');

			list.model.addItem(newList);
		},

		/**
		 *
		 * @param {string} id Item name in the current list.
		 */
		edit: function(id) {
			var item = TaskOnFly.model.getItem(id);

			if (!item) {
				throw new Error('Item with id: "' + id + '" was not found');
			}

			this._openPage('itemEditor', function() {
				this.setHeader(item.public.type);
				this.setDataModel(item);
				this.control.setSaveCallback(item.saveData.bind(item));
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
				TaskOnFly.model.changeView('home');

				return;
			}

			TaskOnFly.model.setCurrentList(list);

			if (!this._view || this._view.page !== 'home') {
				this.home();
			}
		}
	},
	'home');
});
