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
        item: null,
        page: 'task',
        _defaults: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: '',
            id: ''
        },

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(template, this.item.public || this._defaults));

            this.$title= this.$el.find('#title');
            this.$priority = this.$el.find('#priority');
            this.$description = this.$el.find('#description');

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
            var data = this.item.public || this._defaults;
            this.$title.val(data.title);
            this.$priority.find('#' + data.priority).attr('checked', 'checked');
            this.$description.val(data.description);

            this.$el.trigger('create');

            return this;
        },

        // controls
        save: function(ev) {
            ev.preventDefault();

            this._callback({
                title: this.$title.val(),
                priority: this.$priority.find(':checked').val(),
                description: this.$description.val(),
                timestamp: new Date()
            });

            TaskMe.changeView('#home');
        }
    });

    return TaskView;
});