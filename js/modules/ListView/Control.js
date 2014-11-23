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
    'model/TaskList'
], function (TaskList) {
    return new Class({
        list: null,
        orderedItemIDs: [],

        initialize: function(list) {
            this.$ = $(this);

            if (list) {
                this.setList(list);
            }
        },
        setList: function(list) {
            if (!list || list.constructor !== TaskList) {
                throw new Error('List is incorrect');
            }

            this.list = list;
            this.list.$.on('newItem', this._insertItem.bind(this));
        },
        getList: function() {
            return this.list;
        },
        selectList: function(id) {
            this.list = this.list.selectList(id);

            this.$.trigger('select', this.list);

            return this.list;
        },
        selectParentList: function() {
            this.list = this.list.selectParentList();

            this.$.trigger('select', this.list);

            return this.list;
        },
        getSortedItems: function() {
            var groups = this.list.getGroups();
            var dates = {
                dueDate: groups.dueDate,
                doneDate: groups.doneDate.reverse()
            };
            var items = [];
            var date;
            var filteredItems;

            this.orderedItemIDs = null;
            this.orderedItemIDs = [];

            for (var complete = 0; complete <= 1; complete++) {
                var isDone = !!complete;
                var dateProp = isDone ? 'doneDate' : 'dueDate';
                var filterProps = {
                    isDone: isDone
                };

                for (var p = 2; p >= 0; p--) {
                    filterProps.priority = p;
                    for (var n = 0, N = dates[dateProp].length; n < N; n++) {
                        date = dates[dateProp][n];
                        filterProps[dateProp] = date || '^$';

                        filteredItems = this.list.filter(filterProps);
                        Array.prototype.push.apply(items, filteredItems);

                        for (var i = 0, I = filteredItems.length; i < I; i++) {
                            var item = filteredItems[i];
                            this.orderedItemIDs.push({
                                localID: this._getLocalItemID(item),
                                id: item.public.id
                            });
                        }
                    }
                }

                filterProps = null;
            }

            return items;
        },
        _getLocalItemID: function(item) {
            var itemPublic = item.public;
            var isDone = itemPublic.isDone;
            var dateProp = isDone ? 'doneDate' : 'dueDate';
            var date = itemPublic[dateProp];
            var priority = itemPublic.priority;

            return [1-isDone, priority, date].join('');
        },
        getItemPosition: function(id) {
            for (var n = 0, N = this.orderedItemIDs.length; n < N; n++) {
                if (this.orderedItemIDs[n].id === id) {
                    return n;
                }
            }
        },
        _toggleTaskStatus: function(id) {
            var item = this.list.models[id];
            var beforePos = this.getItemPosition(id);

            // Remove from the ordered list
            var info = this.orderedItemIDs.splice(beforePos, 1)[0];

            this.list.toggleItemStatus(id);

            var itemLocalID = this._getLocalItemID(item);
            info.localID = itemLocalID;

            // Find and insert into the new position of the item on the top of the new group in ordered list
            var afterPos;
            if (item.public.isDone) {
                afterPos = this.orderedItemIDs.length-1;
                if (itemLocalID < this.orderedItemIDs[afterPos].localID) {
                    this.orderedItemIDs.push(info);
                } else {
                    for (; afterPos >= 0; afterPos--) {
                        if (itemLocalID > this.orderedItemIDs[afterPos].localID) {
                            break;
                        }
                    }

                    this.orderedItemIDs.splice(afterPos, 0, info);
                }
            } else {
                afterPos = 0;
                if (itemLocalID > this.orderedItemIDs[afterPos].localID) {
                    this.orderedItemIDs.unshift(info);
                } else {
                    for (; afterPos < this.orderedItemIDs.length; afterPos++) {
                        if (itemLocalID >= this.orderedItemIDs[afterPos].localID) {
                            break;
                        }
                    }

                    this.orderedItemIDs.splice(afterPos, 0, info);
                }
            }
        },
        _insertItem: function() {
            this.$.trigger('newItem');
        },
        _editItem: function(id) {
            TaskOnFly.changeView('edit/' + id);
        },
        _removeItem: function(id) {
            this.list.removeItem(id);
        }
    });
});