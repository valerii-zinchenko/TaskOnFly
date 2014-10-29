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
    '../../model/Task',
    'model/TaskList'
],function (Task, TaskList) {
    return new SingletonClass({
        _callback: null,
        _defaults: Task.prototype._defaults.public,

        item: null,

        setItem: function(item) {
            if (!item || (item.constructor !== Task && item.constructor !== TaskList)) {
                throw new Error('Incorrect input arguments');
            }
            this.item = item;
        },

        setSaveCallback: function(callback) {
            if (typeof callback !== 'function') {
                throw new Error('Incorrect input arguments');
            }
            this._callback = callback;
        },

        getData: function() {
            var data = this.item ? this.item.public : this._defaults._defaults;
            data.startDate = data.startDate || data.timestamp;

            return data;
        },

        save: function(data) {
            this._callback({
                title: data.title,
                isDone: data.isDone,
                priority: data.priority,
                startDate: data.startDate,
                dueDate: data.dueDate,
                notes: data.notes
            });
        },

        resetItem: function() {
            this.item = null;
        }
    });
});