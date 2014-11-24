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
        groups: {},
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
                this.public.items.unshift(item.public.id);
            }

            this.models[item.public.id] = item;
            if (item.public.isDone) {
                this._NDone++;
            }

            this._checkListCompleteness();

            this.sort();

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
                this._parent.sort();
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

            this.sort();
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

        sort: function() {
            var dueDates = {
                    'false': [],
                    'true': []
                };
            this.groups = {};

            _.each(this.models, function(item) {
                var sort1 = item.public.isDone,     // collect by completeness
                    sort2 = sort1 ? item.public.doneDate : item.public.dueDate,    // collect by dateGroup or none (for tasks without due dateGroup property)
                    sort3 = item.public.priority;   // collect by priority: 0 = low; 1 = normal; 2 = high

                if (!this.groups[sort1]) {
                    this.groups[sort1] = {};
                }
                if (!this.groups[sort1][sort2]) {
                    this.groups[sort1][sort2] = {};
                    if (dueDates[sort1].indexOf(sort2) === -1) {
                        dueDates[sort1].push(sort2);
                    }
                }
                if (!this.groups[sort1][sort2][sort3]) {
                    this.groups[sort1][sort2][sort3] = [];
                }

                if (this.groups[sort1][sort2][sort3].indexOf(item.public.id) === -1) {
                    this.groups[sort1][sort2][sort3].push(item.public.id);
                }
            }, this);

            dueDates.false.sort();
            dueDates.true.sort().reverse();

            // Move the group without end date to the end of the list
            if (dueDates.false[0] === '') {
                dueDates.false.push(dueDates.false.shift());
            }

            this.groups.sortingOrder = {
                0: ['false', 'true'],
                1: dueDates,
                2: ['2', '1', '0']
            };

            var arr = {};
            for (var n = 0, N = this.groups.sortingOrder['0'].length; n < N; n++) {
                var comp = this.groups.sortingOrder['0'][n];
                var dateGroup = this.groups.sortingOrder['1'][comp];

                arr[comp] = {};
                for (var m = 0, M = dateGroup.length; m < M; m++) {
                    var dueDate = dateGroup[m];
                    if (this.groups[comp] && this.groups[comp][dueDate]) {
                        arr[comp][dueDate] = this._object2Array(this.groups[comp][dueDate], this.groups.sortingOrder['2']);
                    }
                }

                if (arr[comp]) {
                    arr[comp] = this._object2Array(arr[comp], dateGroup);
                }
            }

            this.public.items = this._object2Array(arr, this.groups.sortingOrder['0']);
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