/**
 * Created by valera on 7/19/14.
 */
define([
    'text!templates/task.html',
    'js/collections/Tasks',
    'js/models/Task'
],function (template, Tasks, Task) {
    var TaskView;

    (function() {
        var instance;

        TaskView = function() {
            if (instance) {
                return instance;
            }

            _.extend(this, {
                initialize: function() {
                    this.model = new Task();
                },
                render: function() {
                    if (!this.$el || this.$el.length === 0) {
                        this.$el = $('#addTask');
                    }

                    this.$el.html(_.template(template, this.model.attributes));
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
                    this.model.set(taskData);
                    new Tasks().add(this.model);
                }
            });

            this.initialize();

            instance = this;
            return this;
        };
    })();

    return TaskView;
});