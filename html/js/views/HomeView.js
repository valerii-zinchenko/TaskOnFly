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
    'text!templates/home.html',
    'text!templates/list.html'
], function(template, templateList) {
    var HomeView = new SingletonClass({
        page: 'home',
        $addTaskBtn: null,
        $addListBtn: null,

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(template));
            this.$content = this.$el.find('#content');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');

            this.$addTaskBtn.on('click', this.addTask);
            this.$addListBtn.on('click', this.addList);
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));
        },
        render: function() {
            var list = TaskMe.getCurrentList();

            if (list.public.items.length > 0) {
                this.$content.find('.list').remove();
                this.$content.append(_.template(templateList, list));
            }

            this.$el.trigger('create');

            if (list.public.items.length > 0) {
                this._attachListEvents();
            }
            return this;
        },
        _attachListEvents: function() {
            this.$content.find('table.list td .edit-btn').off('click').on('click', this.editItem);
            this.$content.find('table.list td .delete-btn').off('click').on('click', this.removeItem);
            this.$content.find('table.list th .list').off('click').on('click', this.selectList.bind(this));
        },

        addTask: function(ev) {
            ev.preventDefault();
            TaskMe.changeView('add/task');
        },
        addList: function(ev) {
            ev.preventDefault();
            TaskMe.changeView('add/list');
        },
        editItem: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id');

            TaskMe.changeView('edit/' + id);
        },
        removeItem: function(ev) {
            ev.preventDefault();
            var $tr = $(ev.target).parents('tr'),
                id = $tr.data('item-id');

            TaskMe.getCurrentList().removeItem(id);
            $tr.remove();
        },
        selectList: function(ev) {
            ev.preventDefault();
            var id = $(ev.target).parents('tr').data('item-id'),
                list = TaskMe.getCurrentList().selectList(id);

            var $prevList = this.$content.find('.list'),
                $list = $(_.template(templateList, list));

            if (list.public.items.length > 0) {
                this.$content.append($list);
                $list.trigger('create');
            }

            //todo animate the list changing

            $prevList.remove();

            if (list.public.items.length > 0) {
                this._attachListEvents()
            }
        },
        selectPreviousList: function(ev) {
            ev.preventDefault();
            var list = TaskMe.getCurrentList().selectParentList(),
                $prevList = this.$content.find('.list'),
                $list = $(_.template(templateList, list));

            if (list.public.items.length > 0) {
                this.$content.append($list);
                $list.trigger('create');
            }

            //todo animate the list changing

            $prevList.remove();

            if (list.length > 0) {
                this._attachListEvents()
            }
        }
    });

    return HomeView;
});
