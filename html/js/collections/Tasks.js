/**
 * Created by valera on 7/17/14.
 */
define([
    'js/models/Task'
],function (Task) {
    function Tasks() {
        var instance;

        Tasks = function() {
            return instance;
        };
        Tasks.prototype = this;

        instance = new Tasks();
        _.extend(instance, new (Backbone.Collection.extend({
            model: Task
        }))() );

        return instance;
    }

    return Tasks;
});