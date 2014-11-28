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
        sortingOrder: ['isDone', 'priority'],
        // todo for future
        /*sortingOrder: [
            {
                property:'isDone',
                sort: 'asc'
            },
            {
                property: 'priority',
                sort: 'desc'
            }
        ],*/

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

        setSortingOrder: function(order) {
            if (!order) {
                throw new Error('No input arguments');
            }

            if (!(order instanceof Array)) {
                order = [order];
            }

            this.sortingOrder = null;
            this.sortingOrder = order;
        },
        sort: function() {
            if (this.sortingOrder.length == 0) {
                throw new Error('Sorting order is not defined');
            }

            //todo apply sorting order: asc, desc
            // Build ID-map for sorting
            var sortingIDs = this.public.items.map(function(id) {
                var modID = '';
                var publicData = this.models[id].public;
                for (var n = 0, N = this.sortingOrder.length; n < N; n++) {
                    var property = this.sortingOrder[n];
                    if (property === 'date') {
                        property = publicData.isDone ? 'doneDate' : 'dueDate';
                    }

                    var value = publicData[property];

                    if(typeof value == 'string') {
                        value = value.replace(/\D/g, '');

                        // This is currently for date only. If value is an empty string
                        // then simulate the maximum date value like '9999.99.99'
                        if (value === '') {
                            value = 99999999;
                        } else {
                            value = parseInt(value);
                        }
                    }

                    // Force casting to number;
                    value += 0;
                    if (!isNaN(value)) {
                        modID += value;
                    }
                }

                return {
                    sortID: modID,
                    timestamp: publicData.timestamp,
                    id: id
                };
            }, this);

            // Sort items
            sortingIDs.sort(function(a,b) {
                // Check the id length.
                // If length of a is lower than length of b - it means that a does not has some property.
                if (a.sortID.length < b.sortID.length) {
                    return 1;
                } else if (a.sortID.length > b.sortID.length) {
                    return -1;
                // Compare ids
                } else if (a.sortID < b.sortID) {
                    return -1;
                } else if (a.sortID > b.sortID) {
                    return 1;
                // If sortIDs are equal - sort items by their timestamp
                } else if (a.timestamp < b.timestamp) {
                    return -1;
                } else if (a.timestamp > b.timestamp) {
                    return 1;
                } else {
                    return 0;
                }
            });

            this.public.items = null;
            this.public.items = sortingIDs.map(function(info) {
                return info.id;
            });
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