/**
 * Created by valera on 7/19/14.
 */

'use strict';

define([
    'text!templates/task.html',
    'js/models/Task'
],function (template, Task) {
    var TaskView = new Class({
        initialize: function() {},

        setList: function(list) {
            //todo: Check if list is instance of TaskList
            this.list = list;
        },
        setTask: function(task) {
            //todo: Check if task is instance of Task
            this.task = task;
        },
        render: function() {
            this.checkIntegrity();

            if (!this.$el || this.$el.length === 0) {
                this.$el = $('#task');
            }

            this.$el.html(_.template(template, this.task.attributes));
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
            if (!this.list) {
                throw new Error('List is not defined');
            }
            if (!this.task) {
                this.task = new Task();
            }
        },
        save: function(taskData) {
            this.task.set(taskData);
            this.task._listRef = this.list;
            this.list.add(this.task);
        }
    });

    return TaskView;
});