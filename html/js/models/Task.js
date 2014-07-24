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
            timestamp: null,
            path: ''
        },

        _genPath: function(path) {
            return [path, '/T', Task._counter++].join('');
        },

        initialize: function(path, data) {
            if (!arguments.length) {
                throw new Error('Path is not defined');
            }

            this.path = this._genPath(path);

            if (data) {
                if (typeof data !== 'object') {
                    this.saveData(data);
                } else {
                    throw new Error('Data should be an object');
                }
            }
        },
        saveData: function(data) {
            this.set(data);
        }
    });

    Task._counter = 0;

    return Task;
});