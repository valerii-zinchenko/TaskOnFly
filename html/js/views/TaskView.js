/**
 * Created by valera on 7/19/14.
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