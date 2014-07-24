/**
 * Created by valera on 7/17/14.
 */
define([
    'js/models/Task'
], function (Task) {
    var TaskList = Backbone.Collection.extend({
        model: null,

        attributes: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: null
        },
        path: '',

        _genPath: function(path) {
            return [path, '/L', TaskList._counter++].join('');
        },

        initialize: function(path, data) {
            switch (arguments.length) {
                case 0:
                    path = '';
                    console.log('TaskList::initialize() Root list is created.');
                case 1:
                    data = null;
                    break;

                case 2:
                    // All is OK
                    break;
                default :
                    throw new Error('Path is not defined');
            }

            this.path = this._genPath(path);

            if (data) {
                if (typeof data === 'object') {
                    this.saveData(data);
                } else {
                    throw new Error('Data should be an object');
                }
            }
        },
        saveData: function(data) {
            _.extend(this.attributes, data);
        },
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