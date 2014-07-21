/**
 * Created by valera on 7/17/14.
 */
define([
    'js/models/Task'
],function (Task) {
    var Tasks;

    (function() {
        var instance;

        Tasks = function() {
            if (instance) {
                return instance;
            }

            _.extend(this, new (Backbone.Collection.extend({
                model: Task
            }))() );

            instance = this;
            return this;
        };
    })();

    return Tasks;
});