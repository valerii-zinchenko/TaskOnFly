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
    'js/models/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _parent: null,
        _NDone: 0,
        models: {},

        public: {
            type: 'List',
            items: []
        },

        initialize: function() {
            this.$ = $(this);
        },

        _add: function(item) {
            if (this.public.items.indexOf(item.public.id) === -1) {
                this.public.items.push(item.public.id);
            }

            this.models[item.public.id] = item;
            if (item.public.isDone) {
                this._NDone++;
            }

            TaskMe.saveItem(this);
            this.$.trigger('newItem', item);
            return item;
        },
        addTask: function(data) {
            return this._add(new Task(this.public.id, data));
        },
        addList: function(data) {
            return this._add(new TaskList(this.public.id, data));
        },

        getItem: function(id) {
            return this.models[id];
        },

        removeItem: function(id) {
            TaskMe.removeItem(id);
            this.public.items.splice(this.public.items.indexOf(id), 1);
            delete this.models[id];

            TaskMe.saveItem(this);
        },

        toggleItemStatus: function(id) {
            var task = this.models[id];
            task.toggleStatus();

            if (task.public.isDone) {
                this._NDone++;
            } else {
                this._NDone--;
            }

            var isListDone = (this._NDone === this.public.items.length);
            if (this.public.isDone !== isListDone) {
                if (this._parent) {
                    this._parent.toggleItemStatus(this.public.id);
                }
                this.saveData();
            }
        },

        selectList: function(id) {
            var list = this.getItem(id);
            TaskMe.setCurrentList(list);
            TaskMe.getCurrentList()._parent = this;

            return list;
        },
        selectParentList: function() {
            TaskMe.setCurrentList(this._parent);

            return this._parent;
        }
    });

    TaskList._counter = 0;

    return TaskList;
});