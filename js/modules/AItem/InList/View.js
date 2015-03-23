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
    return new Class(AView, {
        template: '\
<tr data-item-id="<%= public.id %>">\
    <th>\
        <div class="list-item <%= public.type.toLowerCase() %> priority-<%= public.priority %> <% if (public.isDone) {%> done <% } %>">\
            <input id="<%= public.id %>" type="checkbox" <% if (public.isDone) { %> checked <% } %>>\
            <label class="title" for="<%= public.id %>"><%= public.title %></label>\
        </div>\
    </th>\
    <td>\
        <div data-role="controlgroup" data-type="horizontal">\
            <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button>\
        </div>\
    </td>\
</tr>',

        $listItem: null,
		$title: null,

        _postProcessTemplate: function() {
            this.$listItem = this.$el.find('.list-item');
			this.$title = this.$el.find('.title');
			this.$checkBox = this.$listItem.find('input');
        },

        _attachEvents: function() {
            this.$checkBox.on('change', this.onChange.bind(this));

            this.$el.find('.edit-btn').on('click', this.onEdit.bind(this));
            this.$el.find('.delete-btn').on('click', this.onRemove.bind(this));
        },

		updateIsDone: function(value) {
			if (value) {
				this.$listItem.addClass('done');
				this.$title.addClass('ui-checkbox-on');
				this.$title.removeClass('ui-checkbox-off');
				this.$checkBox.prop('checked', true);
			} else {
				this.$listItem.removeClass('done');
				this.$title.addClass('ui-checkbox-off');
				this.$title.removeClass('ui-checkbox-on');
				this.$checkBox.prop('checked', false);
			}
		},
		updateTitle: function(value) {
			this.$title.html(value);
		},

        onChange: function(ev) {
            ev.preventDefault();
			ev.stopPropagation();

            this.control.action();
        },
        onEdit: function(ev) {
            ev.preventDefault();

            this.control.editModel();
        },
        onRemove: function(ev) {
            ev.preventDefault();

            this.$el.remove();

            this.control.removeModel();
        }
    });
});
