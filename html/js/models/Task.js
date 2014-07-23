/**
 * Created by valera on 7/17/14.
 */
define(function () {
    var Task = Backbone.Model.extend({
        defaults: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: null
        },
        _listRef: null
    });

    return Task;
});