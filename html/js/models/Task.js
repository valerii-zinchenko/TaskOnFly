/**
 * Created by valera on 7/17/14.
 */
define([
    'backbone'
],function () {
    var Task = Backbone.Model.extend({
        defaults: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: null
        }
    });

    return Task;
});