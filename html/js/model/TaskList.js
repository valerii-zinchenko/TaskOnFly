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
    'model/Task'
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

            this.$.trigger('newItem', item);
            if (toSave) {
                TaskOnFly.saveItem(this);
            }
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
            TaskOnFly.removeItem(id);
            this.public.items.splice(this.public.items.indexOf(id), 1);
            delete this.models[id];

            TaskOnFly.saveItem(this);
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
            TaskOnFly.setCurrentList(list);
            TaskOnFly.getCurrentList()._parent = this;

            this.sort();

            return list;
        },
        selectParentList: function() {
            TaskOnFly.setCurrentList(this._parent);

            return this._parent;
        },

        sort: function() {
            var structuredList = {
                    // collect by completeness
                    open: {
                        // collect by due date or none (for tasks without due date property)
                        none: {
                            // collect by priority: 0 = low; 1 = normal; 2 = high
                            0: [],
                            1: [],
                            2: []
                        }
                    },
                    done: {
                        none: {
                            0: [],
                            1: [],
                            2: []
                        }
                    }
                },
                dueDates = ['none'];

            _.each(this.models, function(item) {
                var sort1 = structuredList[item.public.isDone ? 'done' : 'open'],
                    sort2 = item.public.dueDate || 'none',
                    sort3 = item.public.priority;

                sort1[sort2][sort3].unshift(item.public.id);

                if (dueDates.indexOf(sort2) === -1) {
                    dueDates.push(sort2);
                }
            });

            dueDates.sort();
            dueDates.reverse();

            for (var n = 0; n < 2; n++) {
                var comp = n ? 'done' : 'open';
                for (var m = 0, M = dueDates.length; m < M; m++) {
                    if (structuredList[comp][dueDates[m]]) {
                        structuredList[comp][dueDates[m]] = this._object2Array(structuredList[comp][dueDates[m]], [2,1,0]);
                    }
                }

                if (structuredList[comp]) {
                    structuredList[comp] = this._object2Array(structuredList[comp], dueDates);
                }
            }
            structuredList = this._object2Array(structuredList, ['open', 'done']);

            return structuredList;
        },

        filter: function(rules) {
            var NRules = 0,
                filterResult,
                result;

            for (var key in rules) {
                if (rules.hasOwnProperty(key)) {
                    NRules++;
                }
            }

            filterResult = _.filter(this.models, function(item) {
                var match = 0;
                for (var rule in rules) {
                    if (rules.hasOwnProperty(rule) && new RegExp(rules[rule], 'gi').test(item.public[rule])) {
                        match++;
                    }
                }

                return match === NRules;
            });

            result = new TaskList(this.public.id);
            for (var n = 0, N = filterResult.length; n < N; n++) {
                result._add(filterResult[n], false);
            }

            return result;
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

    return TaskList;
});