/**
 * Created by valera on 7/17/14.
 */
define(function () {
    var TaskList = Backbone.Collection.extend({
        initialize: function() {
            this.id = TaskList.counter++;
        },
        createSubList: function() {
            this.models.push(new TaskList());
        }
    });
    TaskList.counter = 0;

    return TaskList;
});