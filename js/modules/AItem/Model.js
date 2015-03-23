/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/


'use strict';

define(function () {
    var Task = new Class({
		Encapsulate: EventHandler,

        public: {
            isDone: false,
            title: '',
            priority: 1,
            startDate: null,
            dueDate: null,
            doneDate: null,
            notes: '',
            timestamp: '',

            id: '',
            type: 'Task',

            version: TaskManager.version
        },
        versionUpgrades: {
            /** Change order of priority values.
             * Before 1.0.9 was: 0 - low, 1 - normal, 2 - high.
             *   From 1.0.9    : 0 - high, 1 - normal, 2 - low.
             *
             * @param {Object} data Task properties
             */
            '1.0.9': function (data) {
                switch (data.priority) {
                    case 0:
                    case '0':
                        data.priority = 2;
                        break;

                    case 2:
                    case '2':
                        data.priority = 0;
                        break;
                }
            }
        },

        _genID: function() {
            return [
                Date.now().toString(16),
                (Math.random() * 0x10000 | 0).toString(16) + this.constructor._counter++
            ].join('-');
        },

        initialize: function(data) {
            if (arguments.length === 0 || typeof data === 'undefined') {
                throw new Error('Invalid input arguments');
            }

            this.public.id = this._genID();
            this.public.timestamp = Date.now();
			this.public.startDate = utils.date(new Date(this.public.timestamp));

			if (!data.version) {
				data.version = '0.0.0';
			}

			var dataV = data.version.split('.').map(function(str) {return parseInt(str);});
			var curV = this.public.version.split('.').map(function(str) {return parseInt(str);});
			if (dataV.some(function(version, indx) {
					return version < curV[indx];
				}))
			{
				this.upgrade(data);
			}


            if (typeof data !== 'undefined') {
                if (typeof data === 'object') {
                    this.saveData(data);
                } else {
                    throw new Error('Incorrect type of data input argument');
                }
            }
        },
        destruct: function() {
            var id = this.public.id;

            this.public = null;

			this.trigger('remove', id);

            TaskOnFly.model.removeItem(id);
        },
        saveData: function(data) {
            if (data) {
                utils.deepCopy(this.public, data);

				this.triggerEvents(data);
            }

            TaskOnFly.model.saveItem(this);

			this.trigger('update');
        },

		triggerEvents: function(data) {
			for (var key in data) {
				if (Object.prototype.toString.call(data[key]) == '[object Object]') {
					this.triggerEvents(data[key]);
				}

				this.trigger(this._buildPropertyEventName(key, 'update'), data[key]);
			}
		},

		_buildPropertyEventName: function(property, prefix) {
			return (prefix ? prefix : '') + property[0].toUpperCase() + property.slice(1);
		},

        toggleStatus: function() {
            this.saveData({
                isDone: !this.public.isDone,
                doneDate: utils.date()
            });

			this.trigger('toggleStatus', this.public.isDone);
        },

        upgrade: function(data) {
            var dataV = data.version.split('.').map(function(str) {return parseInt(str);});
            for (var version in this.versionUpgrades) {
                var curV = version.split('.').map(function(str) {return parseInt(str);});

                if (dataV.some(function(version, indx) {
                        return version < curV[indx];
                    }))
                {
                    this.versionUpgrades[version](data);
                }
            }
        }
    });

    Task._counter = 0;

    return Task;
});
