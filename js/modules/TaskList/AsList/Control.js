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
	return new Class(AControl, {
		_items: {},
		sortedIDs: [],

		connect: function() {
			this.model.listen('newItem', _.bind(this.onNewItem, this));

			_.each(this.model.models, function(module) {
				this.connectItem(module);
			}, this);
		},
		connectItem: function(module) {
			var state = module.useState('inList');
			this._items[module.model.public.id] = state;

			state.model.listen('updateIsDone', _.bind(this.onUpdateIsDone, this));

			return state;
		},

		sortIDs: function() {
			this.model.sort();
			this.sortedIDs = this.model.public.items;

			return this.sortedIDs;
		},

		onNewItem: function(ev, module) {
			var item = this.connectItem(module);
			var index = this.sortIDs().indexOf(module.model.public.id);

			this.view.insertNewItemTo(item.view, index);
		},
		onUpdateIsDone: function(ev) {
			var id = ev.public.id;
			var item = this._items[id];

			var indexBefore = this.sortedIDs.indexOf(id);
			var indexAfter = this.sortIDs().indexOf(id);

			if (indexAfter != indexBefore) {
				this.view.moveItem(item.view, indexBefore, indexAfter);
			}
		}
	});
});
