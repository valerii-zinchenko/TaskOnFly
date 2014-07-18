/**
 * Created by valera on 7/17/14.
 */
define([
    'backbone'
],function () {
    var Task = Backbone.Model.extend({
        defaults: {
            title: '',
            isDone: false,
            priority: 1,
            description: ''
        }
    });

    return Task;
});