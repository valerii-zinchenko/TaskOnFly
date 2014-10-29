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
        useGroups: true,

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
        getGroupTitle: function(list, id) {
            var item = list.models[id];
            var title;

            if (item.public.isDone) {
                title = 'done ';
                if (item.public.doneDate) {
                    title += 'at ' + item.public.doneDate;
                }
            } else {
                if (item.public.dueDate) {
                    title = 'till ' + item.public.dueDate;
                } else {
                    title = 'to do';
                }
            }

            return title;
        },
        getGroupID: function(list, id) {
            var item = list.models[id];
            var groupID;

            if (item.public.isDone) {
                groupID = 'true';
                if (item.public.doneDate) {
                    groupID += item.public.doneDate;
                }
            } else {
                groupID = 'false';
                if (item.public.dueDate) {
                    groupID += item.public.dueDate;
                }
            }

            return groupID;
        },
        _toggleTaskStatus: function(id) {
            this.list.toggleItemStatus(id);
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