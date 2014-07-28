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

        initialize: function() {},

        setItem: function(item) {
            if (item && item.constructor !== Task && item.constructor !== TaskList) {
                throw new Error('Incorrect input arguments');
            }
            this.item = item;
        },
        setCallback: function(callback) {
            if (typeof callback !== 'function') {
                throw new Error('Incorrect input arguments');
            }
            this._callback = callback;
        },
        render: function() {
            this.checkIntegrity();

            if (!this.$el || this.$el.length === 0) {
                this.$el = $('#' + this.page);
            }

            this.$el.html(_.template(template, this.item.public));
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
        checkIntegrity: function() {
            if (!this.item) {
                throw new Error('Item is not defined');
            }
        },
        save: function(taskData) {
            this._callback.call(this.item, taskData);
        }
    });

    return TaskView;
});