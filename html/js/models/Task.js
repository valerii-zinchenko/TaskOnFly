/**
 * Created by valera on 7/17/14.
 */

'use strict';

define(function () {
    var Task = new Class({
        public: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: null,
            path: ''
        },

        _pathPrefix: 'T',

        _genPath: function(path) {
            return [path, '/', this._pathPrefix, this.constructor._counter++].join('');
        },

        initialize: function(path, data) {
            if (arguments.length === 0) {
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