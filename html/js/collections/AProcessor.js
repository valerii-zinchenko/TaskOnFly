/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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

define([
    'js/collections/TaskList'
] , function(TaskList) {
    return new Class({
        _list: null,
        _result: null,

        initialize: function(list) {
            if (!list) {
                return;
            }

            this.setList(list);
        },
        setList: function(list) {
            if (list && list.constructor !== TaskList) {
                throw new Error('List is incorrect');
            }

            this.list = list;
        },

        run: function() {
            if (!this.list || this.list.constructor !== TaskList) {
                throw new Error('List object is incorrect');
            }

            // Processing result.
            var result = _.filter(this.list.models, this._processor.bind(this));

            this._result = new TaskList(this.list.public.id);
            _.each(result, function(item) {
                this._result._add(item, false);
            }.bind(this));

            return this._result;
        },

        /**
         * Abstract processing function
         */
        _processor: function(){
            throw new Error('Can not execute raw abstract function');
        }
    });
});