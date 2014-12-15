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
    return new Class({
        template: '\
<% var modelPublic = public; %> \
<tr data-item-id="<%= modelPublic.id %>"> \
    <th> \
        <div class="list-item <%= modelPublic.type.toLowerCase() %> priority-<%= modelPublic.priority %> <% if (modelPublic.isDone) {%> done <% } %>"> \
            <input id="<%= modelPublic.id %>" type="checkbox" <% if (modelPublic.isDone) { %> checked <% } %>> \
            <label for="<%= modelPublic.id %>"><%= modelPublic.title %></label> \
        </div> \
    </th> \
    <td> \
        <div data-role="controlgroup" data-type="horizontal"> \
            <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button> \
        </div> \
    </td> \
</tr> \
        ',

        $el: null,
        $listItem: null,
        isRendered: false,

        initialize: function() {
            this.$el = $(_.template(this.template, this.model));
        },
        render: function() {
            if (!this.isRendered) {
                this.$el.trigger('create');
                this.$listItem = this.$el.find('.list-item');

                this._postRender();

                this._attachEvents();

                this.isRendered = true;
            }

            return this.$el;
        },
        _postRender: function() {},

        _attachEvents: function() {
            if (this.model.public.type === 'Task') {
                this.$listItem.find('.task input').on('change', this.onClick.bind(this));
            }

            this.$el.find('.edit-btn').on('click', this.onEdit.bind(this));
            this.$el.find('.delete-btn').on('click', this.onRemove.bind(this));
        },
        onClick: function(ev) {
            ev.preventDefault();

            if (this.model.public.type === 'Task') {
                this.$listItem.toggleClass('done');
            }

            this.control.action();
        },
        onEdit: function(ev) {
            ev.preventDefault();

            this.control._editItem();
        },
        onRemove: function(ev) {
            ev.preventDefault();

            if (this.model.public.type === 'Task') {
                this._continueRemoving();
            }
        },
        _continueRemoving: function() {
            this.$el.remove();

            this.control.removeModel();
        }
    });
});
