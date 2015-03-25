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
	'view/PopupDialog'
], function() {
	return new Class(AView, {
		template: '\
<div class="task-list">\
	<table class="full">\
		<thead><tr><th></th><th></th></tr></thead>\
		<tbody></tbody>\
	</table>\
</div>',

		_subModules: [],

        __render: function() {
            if (this.$currentList) {
                this.$currentList.remove();
            }

            // The rendering of ~37 items on Android is too long
            // duration: ~81 ms
            this.$currentList = this._prepareListElement(this.control.getList());

            // duration: ~5 ms
            this.$content.append(this.$currentList);
            // duration: ~802 ms
            this.$content.trigger('create');

            // duration: ~142 ms
            this._postRender();
            return this;
        },

		_postProcessTemplate: function() {
			this.$list = this.$el.find('tbody');
		},

		_postRenderModules: function() {
			var itemIDs = this.control.sortIDs();
			for (var n=0, N = itemIDs.length; n < N; n++) {
				this.control._items[itemIDs[n]].view.postRender();
			}
		},

		renderSubModules: function() {
			// todo: make update()
			//this.control.connect();

			var view;
			var itemIDs = this.control.sortIDs();
			for (var n = 0, N = itemIDs.length; n < N; n++) {
				view = this.control._items[itemIDs[n]].view;
				this.$list.append(view.render());

				this._subModules.push(view);
			}
		},

		update: function() {
			this.control.sortIDs();
			for (var n=0, N = this._subModules.length; n < N; n++) {
				this._subModules[n].update();
			}

			this._fixWidth();
		},

		_attachEvents: function() {
			var that = this;
			$(window).on('orientationchange', function() {
				// Timeout is used here because at this moment there is no guaranties
				// that the new window dimensions are already applied.
				setTimeout(function(){
					that._fixWidth();
				}, 300);
			});
		},

		insertNewItemTo: function(itemView, toIndex) {
			itemView.render();

			this.insertItemTo(itemView, toIndex);

			itemView.$el.trigger('create');
			itemView.postRender();

			itemView.update();

			if (this._subModules.length == 1) {
				this._fixWidth();
			}
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
				this.$list.append(itemView.$el);
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
		},

        _fixWidth: function () {
            var $tables = this.$el.find('table');
            var th = $tables.find('th:first');
            var lists = $tables.find('.list-item label');

            $tables.removeClass('fixed');
            lists.removeClass('nowrap');

            th.css('width', th.width());

            $tables.addClass('fixed');
            lists.addClass('nowrap');
        }
	});
});
