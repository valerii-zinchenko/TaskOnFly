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
    '../AItem/Model'
], function (Parent) {
    var TaskListModel = new Class(Parent, {
        _parent: null,
        _NDone: 0,
        _path: '/',
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

        desctuct: function() {
            this._parent = null;
            this._NDone = null;
            this._path = null;
            this.models = null;
            this.sortingOrder = null;

            this.parent.desctuct();
        },

        _add: function(item, toSave) {
            if (typeof toSave === 'undefined') {
                toSave = true;
            }

			var id = item.model.public.id;
            if (this.public.items.indexOf(id) === -1) {
                this.public.items.push(id);
            }

            this.models[id] = item;
            if (item.model.public.isDone) {
                this._NDone++;
            }

            this._checkListCompleteness();

            this.sort();

            if (toSave) {
                TaskOnFly.model.saveItem(this);
            }

			this.trigger('newItem', item);

			item.model.listen({
				updateIsDone: this.onUpdateIsDone.bind(this),
				remove: _.bind(this.onRemove, this)
			});

            return item;
        },
        _checkListCompleteness: function() {
            var isListDone = (this._NDone === this.public.items.length);

            if (this.public.isDone === isListDone) {
                return;
            }

			this.toggleStatus();
        },

        addTask: function(data) {
            return this._add(new TaskManager.Task(data));
        },
        addList: function(data) {
            var list = new TaskManager.TaskList(data);
            list._parent = this;
            list._path = [this._path, list.model.public.id, '/'].join('');
            return this._add(list);
        },

        getItem: function(id) {
            return this.models[id];
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

            if (order instanceof Array && order.length == 0) {
                throw new Error('Array of sorting rules is empty');
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
                var publicData = this.models[id].model.public;
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

                        if (this.sortingOrder[n] == 'date' && publicData.isDone) {
                            value = 99999999 - value;
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
                    if (!(new RegExp(rules[rule], 'gi').test(item.model.public[rule]))) {
                        match = false;

                        break;
                    }
                }

				item.model.trigger(match ? 'show' : 'hide');

                return match;
            });
        },

		onUpdateIsDone: function(model, isDone) {
			if (isDone) {
				this._NDone++;
			} else {
				this._NDone--;
			}

			this._checkListCompleteness();
		},
		onRemove: function(module, id) {
			this.removeItem(id);
		}
    });

    TaskListModel._counter = 0;

    return TaskListModel;
});
