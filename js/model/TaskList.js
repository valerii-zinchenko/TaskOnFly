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
    'model/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _parent: null,
        _NDone: 0,
        _path: '/',
        groups: {
            isDone: [],
            priority: [],
            startDate: [],
            dueDate: [],
            doneDate: []
        },
        models: {},

        public: {
            type: 'List',
            items: []
        },

        initialize: function() {
            this.$ = $(this);
        },

        _add: function(item, toSave) {
            if (typeof toSave === 'undefined') {
                toSave = true;
            }

            if (this.public.items.indexOf(item.public.id) === -1) {
                this.public.items.push(item.public.id);
            }

            this.models[item.public.id] = item;
            if (item.public.isDone) {
                this._NDone++;
            }

            this._registerItem(item);
            this._checkListCompleteness();

            this.$.trigger('newItem', item);
            if (toSave) {
                TaskOnFly.saveItem(this);
            }

            return item;
        },
        _checkListCompleteness: function() {
            var isListDone = (this._NDone === this.public.items.length);

            if (this.public.isDone === isListDone) {
                return;
            }

            if (this._parent) {
                this._parent.toggleItemStatus(this.public.id);
            } else {
                this.public.isDone = isListDone;
            }

            this.saveData();
        },
        addTask: function(data) {
            return this._add(new Task(this.public.id, data));
        },
        addList: function(data) {
            var list = new TaskList(this.public.id, data);
            list._parent = this;
            list._path = [this._path, list.public.id, '/'].join('');
            return this._add(list);
        },

        getItem: function(id) {
            return this.models[id];
        },

        removeItem: function(id) {
            if (!id || !this.models[id]) {
                console.warn('removeItem(id): item id "' + id + '" was not found');
                return;
            }

            this.public.items.splice(this.public.items.indexOf(id), 1);
            delete this.models[id];

            this.sort();
            this._checkListCompleteness();

            TaskOnFly.saveItem(this);
            TaskOnFly.removeItem(id);
        },

        toggleItemStatus: function(id) {
            var task = this.models[id];
            task.toggleStatus();

            if (task.public.isDone) {
                this._NDone++;
            } else {
                this._NDone--;
            }

            this._checkListCompleteness();
        },

        selectList: function(id) {
            var list = this.getItem(id);

            if (list) {
                TaskOnFly.setCurrentList(list);
            }

            return list;
        },
        selectParentList: function() {
            if (this.public.id === 'root') {
                return this;
            }

            TaskOnFly.setCurrentList(this._parent);

            return this._parent;
        },

        getLocation: function() {
            return this._path;
        },
        getParentLocation: function() {
            if (!this._parent) {
                return '/';
            }

            return this._parent.getLocation();
        },

        getGroups: function() {
            return this.groups;
        },

        findList: function(path, list) {
            if (!list) {
                list = this;
            }

            if (path.length === 0) {
                return list;
            }

            var subList = list.models[path.shift()];

            if (!subList) {
                return null;
            }

            return this.findList(path, subList);
        },

        /**
         * Register unique item property that can be filtered.
         *
         * @param {Task|TaskList} item New item in list.
         * @private
         */
        _registerItem: function(item) {
            for (var property in this.groups) {
                if (this.groups[property].indexOf(item.public[property]) == -1) {
                    this.groups[property].push(item.public[property]);
                    this.groups[property].sort();
                }
            }

            if (this.groups.dueDate[0] === '') {
                this.groups.dueDate.push(this.groups.dueDate.shift());
            }
        },

        filter: function(rules) {
            return _.filter(this.models, function(item) {
                var match = true;
                for (var rule in rules) {
                    if (!(new RegExp(rules[rule], 'gi').test(item.public[rule]))) {
                        match = false;
                        break;
                    }
                }

                return match;
            });
        },

        _object2Array: function(obj, sortedKeys) {
            var result = [];

            for (var n = 0, N = sortedKeys.length; n < N; n++) {
                if (obj[sortedKeys[n]]) {
                    result = result.concat(obj[sortedKeys[n]]);
                }
            }

            return result;
        }
    });

    TaskList._counter = 0;

    TaskManager.TaskList = TaskList;
    return TaskList;
});