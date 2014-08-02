/**
 * Created by Valerii Zinchenko on 7/17/14.
 */

'use strict';

define(function () {
    var Task = new Class({
        _type: 'task',

        public: {
            isDone: false,
            title: '',
            priority: 1,
            description: '',
            timestamp: '',
            id: '',
            parentID: ''
        },

        _genID: function() {
            return [
                Date.now().toString(16),
                (Math.random() * 0x10000 | 0).toString(16) + this.constructor._counter++
            ].join('-');
        },

        initialize: function(parentID, data) {
            if (arguments.length === 0
                || (typeof parentID === 'undefined' && typeof data === 'undefined'))
            {
                throw new Error('Invalid input arguments');
            }

            if (typeof parentID !== 'string' || 0 === parentID.length) {
                throw new Error('parentID is not defined');
            }
            this.public.parentID = parentID;

            this.public.id = this._genID();

            if (typeof data !== 'undefined') {
                if (typeof data === 'object') {
                    this.saveData(data);
                } else {
                    throw new Error('Incorrect type of data input argument');
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