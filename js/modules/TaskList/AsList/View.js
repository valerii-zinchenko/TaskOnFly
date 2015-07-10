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

define([
	'view/PopupDialog'
], function() {
	return new Class(DynamicView, {
		template: '<div class="task-list"></div>',

		_subModules: [],

		update: function() {
			this.control.sortIDs();
		},

		insertNewItemTo: function(itemView, toIndex) {
			itemView.render();

			this.insertItemTo(itemView, toIndex);

			itemView.update();
		},

		insertItemTo: function(itemView, toIndex) {
			this._subModules.splice(toIndex, 0, itemView);

			var siblingItemView;
			var insertionFn;

			if (toIndex +1 === this._subModules.length) {
				siblingItemView = this._subModules[toIndex - 1];
				insertionFn = 'insertAfter';
			} else {
				siblingItemView = this._subModules[toIndex + 1];
				insertionFn = 'insertBefore';
			}

			if (siblingItemView) {
				itemView.$el[insertionFn](siblingItemView.$el);
			} else {
				this.$el.append(itemView.$el);
			}
		},

		moveItem: function(itemView, fromIndex, toIndex) {
			itemView.$el.detach();

			this._subModules.splice(fromIndex, 1);

			this.insertItemTo(itemView, toIndex);
		},

		removeItem: function(id) {
			var index = this._subModules.indexOf(id);
			this._subModules.splice(index, 1);
        }
	});
});
