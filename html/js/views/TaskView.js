/**
 * Created by valera on 7/19/14.
 */
define([
    'text!templates/task.html',
    'js/collections/Tasks',
    'js/models/Task'
],function (template, Tasks, Task) {
    function TaskView() {
        var instance;

        TaskView = function TaskView() {
            return instance;
        };
        TaskView.prototype = this;

        instance = new TaskView();
        _.extend(instance, {
            constructor: TaskView,
            initialize: function() {
                this.model = new Task();
                this.render();
            },
            render: function() {
                this.$el = $('#addTask');
                this.$el.html(_.template(template, this.model.attributes));
                this.$el.trigger('create');

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

                return this;
            },

            // controls
            save: function(taskData) {
                this.model.set(taskData);
                new Tasks().add(this.model);
            }
        });

        instance.initialize();
        return instance;
    }

    return TaskView;
});