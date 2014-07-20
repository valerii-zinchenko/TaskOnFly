/**
 * Created by valera on 7/17/14.
 */
define([
    'js/models/Task'
],function (Task) {
    var GroupTask = Task.extend({
        defaults: _.extend({
            taskList: null
        }, Task.defaults)
    });

    return GroupTask;
});