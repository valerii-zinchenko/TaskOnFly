/**
 * Created by valera on 7/17/14.
 */

'use strict';

define(function () {
    var Task = new Class({
        _name: '',
        _pathPrefix: 'T',
        _type: 'task',

        public: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: '',
            path: ''
        },

        _genPath: function(path) {
            this._name = this._pathPrefix + this.constructor._counter++;
            return [path, '/', this._name].join('');
        },

        initialize: function(path, data) {
            if (arguments.length === 0 ||
                (typeof path === 'undefined' && typeof data === 'undefined'))
            {
                throw new Error('Path is not defined');
            }

            this.public.path = this._genPath(path);

            if (data !== undefined) {
                if (typeof data === 'object') {
                    this.saveData(data);
                } else {
                    throw new Error('Data should be an object');
                }
            }
        },
        saveData: function(data) {
            if (data.timestamp && typeof data.timestamp !== 'string') {
                data.timestamp = data.timestamp.toString();
            }
            utils.deepExtend(this.public, data);
        }
    });

    Task._counter = 0;

    return Task;
});