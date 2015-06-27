/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

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

// todo: Subscribe storages to the model events

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

            version: '0.0.0'
        },

		storages: [],

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

		/**
		 * @params {Object} data
		 */
        initialize: function(data, version, storages) {
            if (arguments.length !== 3) {
                throw new Error('Invalid input arguments');
            }

			if (!utils.isObject(data)) {
				throw new Error('Incorrect type of "data" argument');
			}
			if (!utils.isString(version)) {
				throw new Error('Incorrect type of "version" argument');
			}
			if (!utils.isArray(storages)) {
				throw new Error('Incorrect type of "storages" argument');
			}

			this.storages = storages;

            this.public.id = this._genID();
            this.public.timestamp = Date.now();
			this.public.startDate = utils.date(new Date(this.public.timestamp));

			if (!data.version) {
				data.version = '0.0.0';
			}

			if (utils.compareVersions(data.version, version) < 0) {
				this.upgrade(data);
				data.version = version;
			}

			this.saveData(data);
        },

        destruct: function() {
            var id = this.public.id;

			this.trigger('remove', id);

            this.public = null;

			this.storages.forEach(function(storage) {
				storage.removeItem(id);
			});
        },

        saveData: function(data) {
            if (!data) {
				return;
			}

			for (var key in data) {
				if (this.public[key] == data[key]) {
					delete data[key];
				}
			}

			if (utils.isObjectEmpty(data)) {
				return;
			}

			utils.deepCopy(this.public, data);

			this.triggerEvents(data);

			this.trigger('update');

			this.storages.forEach(function(storage) {
				storage.saveItem(this);
			}, this);
        },

		triggerEvents: function(data) {
			for (var key in data) {
				if (utils.isObject(data[key])) {
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
            for (var version in this.versionUpgrades) {
				if (utils.compareVersions(data.version, version) < 0) {
                    this.versionUpgrades[version](data);
                }
            }
        }
    });

    Task._counter = 0;

    return Task;
});
