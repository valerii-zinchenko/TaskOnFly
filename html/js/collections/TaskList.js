/**
 * Created by valera on 7/17/14.
 */

'use strict';

define([
    'js/models/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _pathPrefix: 'L',
        models: {},
        length: 0,

        addSubList: function(data) {
            var list = new TaskList(this.public.path, data);
            this.models[list._name] = list;
            this.length++;

            return list;
        },
        addTask: function(data) {
            var task = new Task(this.public.path, data);
            this.models[task._name] = task;
            this.length++;

            return task;
        },

        getItem: function(name) {
            return _.find(this.models, function(item) {
                return name === item._name;
            });
        }
    });

    TaskList._counter = 0;

    return TaskList;
});