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
    return new Class({
        initialize: function(model) {
            if (model) {
                this.setModel(model);
            }
        },
        setModel: function(model) {
            if (!model) {
                throw new Error('Incorrect amount of input arguments');
            }
            if (typeof model !== 'object') {
                throw new Error('Incorrect type of input argument');
            }
            if (!(model instanceof TaskManager.Task)) {
                throw new Error('Incorrect instance of model');
            }

            this.model = model;
        },
        action: function() {
            switch(this.model.public.type) {
                case 'Task':
                    this._toggleModelStatus();
                    break;
                case 'List':
                    this._selectList();
                    break;
            }
        },
        removeModel: function() {
            this.model.trigger('remove');
        },

        _toggleModelStatus: function() {
            this.model.toggleStatus();
        },
        _selectList: function() {
            TaskOnFly.changeView(['#path', this.model.getLocation(), this.model.public.id, '/'].join(''));
        },
        _editModel: function() {
            TaskOnFly.changeView(['#edit', this.model.public.id].join('/'));
        } 
    });
});
