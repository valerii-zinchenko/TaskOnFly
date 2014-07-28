/**
 * Created by valera on 7/17/14.
 */

'use strict';

define(function () {
    var Task = new Class({
        _pathPrefix: 'T',
        _name: '',

        public: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: null,
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
            _.extend(this.public, data);
        }
    });

    Task._counter = 0;

    return Task;
});