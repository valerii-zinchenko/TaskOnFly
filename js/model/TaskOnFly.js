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

define([
	'model/MainRouter'
], function(MainRouter) {
	function saveLocal(key, data) {
		window.localStorage.setItem(key, JSON.stringify(data));
	}

	function loadLocal(key) {
		var value = window.localStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	}

	function removeLocal(key) {
		window.localStorage.removeItem(key);
	}


	return new Class({
		Encapsulate: EventHandler,

		varsion: '2.0.0',
		ROOT_TASK_LIST: null,
		CURRENT_TASK_LIST: null,

		start: function() {
			var store = this.loadItem('root'),
				rootList = new TaskManager.TaskList({
					id:'root',
					version: this.version
				});

			if (store) {
				var ids = store.items;
				store.items = [];
				rootList.model.saveData(store);
				this.sync(rootList.model, ids);
			}

			this.setRootList(rootList);
			rootList.model.saveData();
			this.setCurrentList(rootList);

			new MainRouter();
			Backbone.history.start();
		},
		sync: function(listRef, ids) {
			var that = this;
			ids.forEach(function(itemID) {
				var itemData = that.loadItem(itemID);
				if (!itemData) {
					return;
				}

				var item = listRef['add' + itemData.type](itemData);

				if (itemData.type === 'List') {
					var ids = item.model.public.items;
					item.model.public.items = [];
					that.sync(item.model, ids);
				}
			});
		},

		setRootList: function(list) {
			if (!list) {
				throw new Error('Invalid list');
			}

			this.ROOT_TASK_LIST = list;
		},

		getRootList: function() {
			return this.ROOT_TASK_LIST;
		},

		setCurrentList: function(list) {
			if (!list) {
				throw new Error('Invalid list');
			}

			this.CURRENT_TASK_LIST = list;

			this.trigger('changeList', list);
		},

		getCurrentList: function() {
			return this.CURRENT_TASK_LIST;
		},

		changeView: function(page) {
			window.location.hash = '#' + page;
		},

		back: function() {
			window.history.back();
		},

		saveItem: function(item) {
			if (!item) {
				throw new Error('item is not defined');
			}

			if (!item.public || typeof item.public !== 'object') {
				throw new Error('Item object does not contain public object');
			}
			if (!item.public.id) {
				throw new Error('Item id is not defined');
			}

			var id = item.public.id;
			var items = loadLocal('items') || [];

			if (items.indexOf(id) === -1) {
				items.push(id);
			}

			saveLocal('items', items);
			saveLocal(id, item.public);
		},

		loadItem: function(id) {
			if (!id) {
				throw new Error('Item id is not defined');
			}

			return loadLocal(id);
		},

		removeItem: function(id) {
			if (!id) {
				return;
			}

			var items = loadLocal('items'),
			index = items.indexOf(id);

			if (index > -1) {
				items.splice(index,1);
			}

			saveLocal('items', items);
			removeLocal(id);
		},

		loadAllItems: function() {
			var itemList = loadLocal('items'),
			items = {};

			if (!itemList) {
				return null;
			}

			itemList.forEach(function(id) {
				items[id] = loadLocal(id)
			});

			return items;
		}
	});
});
