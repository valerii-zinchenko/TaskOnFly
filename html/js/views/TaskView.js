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
    'text!templates/task.html',
    'js/models/Task',
    'js/collections/TaskList'
],function (template, Task, TaskList) {
    var TaskView = new SingletonClass({
        _callback: null,
        _defaults: Task.prototype._defaults.public,

        item: null,
        page: 'task',

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(template, this._defaults));

            this.$title= this.$el.find('#title');
            this.$priority = this.$el.find('#priority');
            this.$notes = this.$el.find('#notes');
            this.$startDate = this.$el.find('#start');
            this.$dueDate = this.$el.find('#due');

            this.$el.find('#save').on('vclick', this.save.bind(this));
            this.$el.find('form').on('submit', this.save.bind(this));
        },

        setItem: function(item) {
            if (item && item.constructor !== Task && item.constructor !== TaskList) {
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
        render: function() {
            var data = this.item ?  this.item.public : this._defaults;
            var startDate = data.startDate || new Date(data.timestamp).toISOString();
            var dueDate = data.startDate || '';

            startDate = startDate.slice(0,10);
            if (dueDate) {
                dueDate = dueDate.slice(0,10);
            }

            this.$title.val(data.title);
            this.$priority.find('#' + data.priority).attr('checked', 'checked');
            this.$startDate.val(startDate);
            this.$dueDate.val(dueDate);
            this.$notes.val(data.notes);

            this.$el.trigger('create');

            this.item = null;
            return this;
        },

        // controls
        save: function(ev) {
            ev.preventDefault();
            var dueDateVal = this.$dueDate.val();

            this._callback({
                title: this.$title.val(),
                priority: this.$priority.find(':checked').val(),
                startDate: new Date(this.$startDate.val()),
                dueDate: dueDateVal ? new Date(dueDateVal) : null,
                notes: this.$notes.val(),
                timestamp: new Date()
            });

            TaskMe.changeView('#home');
        }
    });

    return TaskView;
});