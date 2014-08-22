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
    'view/list',
    'model/TaskList'
], function (template, TaskList) {
    return new Class({
        _width: 0,

        list: null,
        $content: null,
        $currentList: null,

        initialize: function(holder, list) {
            this.$content = holder;

            if (list) {
                this.setList(list);
            }
        },
        setList: function(list) {
            if (list && list.constructor !== TaskList) {
                throw new Error('List is incorrect');
            }

            this.list = list;
            this.list.$.on('newItem', this._insertItem.bind(this));
        },
        render: function() {
            if (this.$currentList) {
                this.$currentList.remove();
            }

            this.$content.append(_.template(template, this.list));
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
                this._postRender();
            }

            this.setList(newList);
        },
        _attachEvents: function() {
            this.$currentList.find('.list-item.task input').on('change', this._toggleTaskStatus.bind(this));
            this.$currentList.find('.list-item.list').on('vclick', this.selectList.bind(this));
            this.$currentList.find('.edit-btn').on('click', this._editItem);
            this.$currentList.find('.delete-btn').on('click', this._removeItem);
        },
        _toggleTaskStatus: function(ev) {
            ev.preventDefault();

            var $target = $(ev.target);
            var $el = $target.parents('tr');
            var id = $target.prop('id');
            var indexBefore = this.list.public.items.indexOf(id),
                indexAfter,
                siblingID,
                $sibling;

            this.list.toggleItemStatus(id);

            indexAfter = this.list.public.items.indexOf(id);

            if (indexAfter === indexBefore) {
                return;
            }

            $el.detach();
            if (indexAfter+1 === this.list.public.items.length) {
                siblingID = this.list.public.items[indexAfter - 1];
                $sibling = this.$currentList.find('tr[data-item-id=' + siblingID + ']');
                $el.insertAfter($sibling);
            } else {
                siblingID = this.list.public.items[indexAfter + 1];
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

            TaskOnFly.changeView('edit/' + id);
        },
        _removeItem: function(ev) {
            ev.preventDefault();
            var $tr = $(ev.target).parents('tr'),
                id = $tr.data('item-id');

            TaskOnFly.getCurrentList().removeItem(id);
            $tr.remove();
        },

        _fixWidth: function () {
            var th = this.$currentList.find('th:first');
            if (!this._width) {
                this._width = th.width();
            }
            th.css('width', this._width);

            this.$currentList.addClass('fixed');
            this.$currentList.find('.list-item label').addClass('nowrap');
        },

        _disableListCheckbox: function () {
            this.$currentList.find('.list-item.list input').prop('disabled', true);
        }
    });
});