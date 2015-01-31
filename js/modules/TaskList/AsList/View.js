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
			this.control.connect();

			var itemIDs = this.control.sortIDs();
			for (var n=0, N = itemIDs.length; n < N; n++) {
				this.$list.append(this.control._items[itemIDs[n]].view.render());
			}
		},

		update: function() {
			this._fixWidth();
	
			var itemIDs = this.control.sortIDs();
			for (var n=0, N = itemIDs.length; n < N; n++) {
				this.control._items[itemIDs[n]].view.update();
			}
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

			this.$list.find('.task').on('click', _.bind(this.onTaskClick, this));
		},

		// listen the status toggling of each model
        onTaskClick: function(ev) {
            var $target = $(ev.target);
            var $el = $target.parents('tr');
            var id = $target.prop('id');
            var list = this.control.sortedIDs;
            var siblingID,
                $sibling;

            var indexBefore = this.control.sortedIDs.indexOf(id);

            this.control.sortIDs();

            var indexAfter = this.control.sortedIDs.indexOf(id);
            if (indexAfter === indexBefore) {
                return;
            }

            $el.detach();

            if (indexAfter+1 === list.length) {
                siblingID = list[indexAfter - 1];
            } else {
                siblingID = list[indexAfter + 1];
            }
            $sibling = this.$currentList.find('tr[data-item-id=' + siblingID + ']');

            if (indexAfter+1 === list.length) {
                $el.insertAfter($sibling);
            } else {
                $el.insertBefore($sibling);
            }
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
