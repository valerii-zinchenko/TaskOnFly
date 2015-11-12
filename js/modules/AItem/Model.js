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
    var AItem = new Class({
		Encapsulate: EventHandler,

        public: {
            isDone: false,
            title: '',

            id: '',
            type: 'Item'
        },

        _genID: function() {
            return [
                Date.now().toString(16),
                (Math.random() * 0x10000 | 0).toString(16) + AItem._counter++
            ].join('-');
        },

        initialize: function() {
            this.public.id = this._genID();
        },

        destruct: function() {
			this.trigger('remove', this.public.id);

            this.public = null;
        },

		toggleStatus: function() {
			this.public.isDone = !this.public.isDone;

			this.trigger('updateIsDone', this.public.isDone);
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
        }
    });

    AItem._counter = 0;

    return AItem;
});
