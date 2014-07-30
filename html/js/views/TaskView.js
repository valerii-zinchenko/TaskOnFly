/**
 * Created by valera on 7/19/14.
 */

'use strict';

define([
    'text!templates/task.html',
    'js/models/Task',
    'js/collections/TaskList'
],function (template, Task, TaskList) {
    var TaskView = new Class({
        _callback: null,
        item: null,
        page: 'task',
        _defaults: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: '',
            path: ''
        },

        initialize: function() {},

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
            if (!this.$el || this.$el.length === 0) {
                this.$el = $('#' + this.page);
            }

            this.$el.html(_.template(template, this.item.public || this._defaults));
            this.$el.trigger('create');

            if (!this.$task || this.$task.length === 0) {
                this.$task = {
                    title: this.$el.find('#title'),
                    priority: this.$el.find('#priority'),
                    description: this.$el.find('#description')
                };

                this.$el.find('#save').on('vclick', function() {
                    this.save({
                        title: this.$task.title.val(),
                        priority: this.$task.priority.find(':checked').val(),
                        description: this.$task.description.val(),
                        timestamp: new Date()
                    });
                }.bind(this));
            }

            return this;
        },

        // controls
        save: function(taskData) {
            this._callback(taskData);
        }
    });

    return TaskView;
});