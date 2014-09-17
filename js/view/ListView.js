/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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
    'control/ListControl'
], function(Control) {
    var ListView = new Class({
        template: Template(function(){/**
<table class="full task-list">
    <thead><tr><th></th><th></th></tr></thead>
    <tbody>
    <% _.each(public.items, function(item) { %>
        <% var modelPublic = models[item].public; %>
        <tr data-item-id="<%= modelPublic.id %>">
            <th>
                <div class="list-item <%= modelPublic.type.toLowerCase() %> priority-<%= modelPublic.priority %>">
                    <input id="<%= modelPublic.id %>" type="checkbox" <% if (modelPublic.isDone) { %> checked <% } %>>
                    <label for="<%= modelPublic.id %>"><%= modelPublic.title %></label>
                </div>
            </th>
            <td>
                <div data-role="controlgroup" data-type="horizontal">
                    <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button>
                </div>
            </td>
        </tr>
    <% }) %>
    </tbody>
</table>
        **/}),

        $content: null,
        $currentList: null,

        initialize: function(holder, list) {
            this.$content = holder;

            this.control = new Control(list);
            this.control.$.on('newItem', this._insertItem.bind(this));

            $(window).on('orientationchange', this._fixWidth.bind(this));
        },
        render: function() {
            if (this.$currentList) {
                this.$currentList.remove();
            }

            this.$content.append(_.template(this.template, this.control.getList()));
            this.$currentList = this.$content.find('.task-list');

            this.$content.trigger('create');

            this._postRender();
            return this;
        },
        _postRender: function() {
            this._attachEvents();
            this._fixWidth();
            this._disableListCheckbox();
        },

        selectList: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');
            this._switchLists(this.control.selectList(id), 'left');
        },
        selectParentList: function() {
            this._switchLists(this.control.selectParentList(), 'right');
        },
        _switchLists: function(newList, direction) {
            var $newList = $(_.template(this.template, newList));

            if (newList.public.items.length > 0) {
                this.$content.append($newList);
                $newList.trigger('create');
            }

            if (direction === 'left') {
                //todo Position new list to the right side and move both lists from right to the left
            } else {
                //todo Position new list to the left side and move both lists from left to the right
            }

            this.$currentList.remove();
            this.$currentList = $newList;

            if (this.control.getList().public.items.length > 0) {
                this._postRender();
            }

            this.control.setList(newList);
        },
        _attachEvents: function() {
            this.$currentList.find('.list-item.task input').on('change', this._toggleTaskStatus.bind(this));
            this.$currentList.find('.list-item.list').on('vclick', this.selectList.bind(this));
            this.$currentList.find('.edit-btn').on('click', this._editItem.bind(this));
            this.$currentList.find('.delete-btn').on('click', this._removeItem.bind(this));
        },
        _toggleTaskStatus: function(ev) {
            ev.preventDefault();

            var $target = $(ev.target);
            var $el = $target.parents('tr');
            var id = $target.prop('id');
            var list = this.control.getList();
            var siblingID,
                $sibling;

            var indexBefore = list.public.items.indexOf(id);
            this.control._toggleTaskStatus(id);
            var indexAfter = list.public.items.indexOf(id);

            if (indexAfter === indexBefore) {
                return;
            }

            $el.detach();
            if (indexAfter+1 === list.public.items.length) {
                siblingID = list.public.items[indexAfter - 1];
                $sibling = this.$currentList.find('tr[data-item-id=' + siblingID + ']');
                $el.insertAfter($sibling);
            } else {
                siblingID = list.public.items[indexAfter + 1];
                $sibling = this.$currentList.find('tr[data-item-id=' + siblingID + ']');
                $el.insertBefore($sibling);
            }
        },
        _insertItem: function() {
            this.render();
        },
        _editItem: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');

            this.control._editItem(id);
        },
        _removeItem: function(ev) {
            ev.preventDefault();
            var $tr = $(ev.target).parents('tr'),
                id = $tr.data('item-id');

            this.control._removeItem(id);
            $tr.remove();
        },

        _fixWidth: function () {
            var th = this.$currentList.find('th:first');
            var lists = this.$currentList.find('.list-item label');

            this.$currentList.removeClass('fixed');
            lists.removeClass('nowrap');

            th.css('width', th.width());

            this.$currentList.addClass('fixed');
            lists.addClass('nowrap');
        },

        _disableListCheckbox: function () {
            this.$currentList.find('.list-item.list input').prop('disabled', true);
        }
    });

    TaskManager.ListView = ListView;
    return ListView;
});