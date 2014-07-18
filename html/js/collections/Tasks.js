/**
 * Created by valera on 7/17/14.
 */
define([
    'models/Task'
],function (Task) {
    var Tasks = Backbone.Collection.extend({
        model: Task
    });

    return Tasks;
});