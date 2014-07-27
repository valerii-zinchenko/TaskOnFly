/**
 * Created by valera on 7/17/14.
 */

'use strict';

define([
    'js/models/Task'
], function (Task) {
    var TaskList = new Class(Task, {
        _pathPrefix: 'L',
        models: [],

        createSubList: function(data) {
            var list = new TaskList(this.path, data);
            this.models.push(list);
        },
        createTask: function(data) {
            var task = new Task(this.path, data);
            this.models.push(task);
        }
    });

    TaskList._counter = 0;

    return TaskList;
});