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

define(function () {
    var Task = new Class({
        public: {
            isDone: false,
            title: '',
            priority: 1,
            startDate: null,
            dueDate: null,
            notes: '',
            timestamp: '',

            id: '',
            parentID: '',
            type: 'Task'
        },

        _genID: function() {
            return [
                Date.now().toString(16),
                (Math.random() * 0x10000 | 0).toString(16) + this.constructor._counter++
            ].join('-');
        },

        initialize: function(parentID, data) {
            if (arguments.length === 0
                || (typeof parentID === 'undefined' && typeof data === 'undefined'))
            {
                throw new Error('Invalid input arguments');
            }

            if (typeof parentID !== 'string' || 0 === parentID.length) {
                throw new Error('parentID is not defined');
            }
            this.public.parentID = parentID;

            this.public.id = this._genID();
            this.public.timestamp = new Date().toISOString();

            if (typeof data !== 'undefined') {
                if (typeof data === 'object') {
                    this.saveData(data);
                } else {
                    throw new Error('Incorrect type of data input argument');
                }
            }
        },
        saveData: function(data) {
            if (data) {
                if (data.startDate && typeof data.startDate !== 'string') {
                    data.startDate = data.startDate.toISOString();
                }
                if (data.dueDate && typeof data.dueDate !== 'string') {
                    data.dueDate = data.dueDate.toISOString();
                }

                utils.deepCopy(this.public, data);
            }

            TaskOnFly.saveItem(this);
        },
        toggleStatus: function() {
            this.saveData({
                isDone: !this.public.isDone
            });
        }
    });

    Task._counter = 0;

    return Task;
});