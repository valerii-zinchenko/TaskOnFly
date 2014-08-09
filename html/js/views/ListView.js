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


define([
    'text!templates/list.html',
    'js/collections/TaskList'
], function (template, TaskList) {
    var ListView = new Class({
        _width: 0,

        list: null,
        $content: null,
        $currentList: null,

        initialize: function(holder, list) {
            if (!list) {
                throw new Error('list is not defined');
            }
            if (list.constructor !== TaskList) {
                throw new Error('Incorrect list type');
            }

            this.list = list;
            this.$content = holder;
        },
        render: function() {
            this.$content.empty();
            this.$content.append(_.template(template, this.list));
            this.$currentList = this.$content.find('.task-list');
            this._attachEvents();

            this.$content.trigger('create');

            this._fixWidth();
            this._disableListCheckbox();

            return this.$content;
        },

        selectList: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');
            this.list = this.list.selectList(id);
            this._switchLists(this.list, 'left');
        },
        selectParentList: function() {
            this.list = this.list.selectParentList();
            this._switchLists(this.list, 'right');
        },
        _switchLists: function(newList, direction) {
            var $newList = $(_.template(template, newList));

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

            if (this.list.public.items.length > 0) {
                this._attachEvents()
            }
        },
        _attachEvents: function() {
            this.$currentList.find('.list-item.task input').off('change').on('change', this._toggleTaskStatus.bind(this));
            this.$currentList.find('.edit-btn').off('click').on('click', this._editItem);
            this.$currentList.find('.delete-btn').off('click').on('click', this._removeItem);
            this.$currentList.find('.list-item.list').off('click').on('click', this.selectList.bind(this));
        },
        _toggleTaskStatus: function(ev) {
            this.list.toggleItemStatus($(ev.target).prop('id'));
        },
        _editItem: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');

            TaskMe.changeView('edit/' + id);
        },
        _removeItem: function(ev) {
            ev.preventDefault();
            var $tr = $(ev.target).parents('tr'),
                id = $tr.data('item-id');

            TaskMe.getCurrentList().removeItem(id);
            $tr.remove();
        },

        _fixWidth: function () {
            var th = this.$currentList.find('th:first');
            if (!this._width) {
                this._width = th.width();

                this.$currentList.addClass('fixed');
                this.$currentList.find('.list-item label').addClass('nowrap');
            }

            th.css('width', this._width);
        },

        _disableListCheckbox: function () {
            this.$currentList.find('.list-item.list input').prop('disabled', true);
        }
    });

    return ListView;
});