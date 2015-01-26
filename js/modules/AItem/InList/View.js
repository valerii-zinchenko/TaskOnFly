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
<tr data-item-id="<%= public.id %>"> \
    <th> \
        <div class="list-item <%= public.type.toLowerCase() %> priority-<%= public.priority %> <% if (public.isDone) {%> done <% } %>"> \
            <input id="<%= public.id %>" type="checkbox" <% if (public.isDone) { %> checked <% } %>> \
            <label for="<%= public.id %>"><%= public.title %></label> \
        </div> \
    </th> \
    <td> \
        <div data-role="controlgroup" data-type="horizontal"> \
            <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button> \
        </div> \
    </td> \
</tr>',

        $listItem: null,

        _postProcessTemplate: function() {
            this.$listItem = this.$el.find('.list-item');
        },

        _attachEvents: function() {
            this.$listItem.on('click', this.onClick.bind(this));

            this.$el.find('.edit-btn').on('click', this.onEdit.bind(this));
            this.$el.find('.delete-btn').on('click', this.onRemove.bind(this));
        },

        onClick: function(ev) {
            ev.preventDefault();

            this.$listItem.toggleClass('done');

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
