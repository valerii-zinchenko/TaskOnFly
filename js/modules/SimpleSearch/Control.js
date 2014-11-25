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
        list: null,
        listModule: null,

        initialize: function(listModule) {
            this.list = TaskOnFly.getCurrentList();

            if (listModule) {
                this.setListModule(listModule);
            }
        },
        setListModule: function(listModule) {
            if (!listModule || listModule.constructor !== TaskManager.Modules.ListView) {
                throw new Error('Incorrect type for listModule input argument');
            }

            this.listModule = listModule;

            TaskOnFly.$.on('showList', this.update.bind(this));
        },
        update: function(ev, list) {
            this.list = list;
        },
        _showResults: function(list) {
            if (this.listModule.control.getList() === this.list && list === this.list) {
                return;
            }

            this.listModule.control.setList(list);
            this.listModule.view.render();
        },
        search: function(val) {
            if (!val) {
                return;
            }

            if (!this.listModule) {
                throw new Error('listModule is not defined');
            }

            var filterResult = this.list.filter({
                title: val
            });

            var result = new TaskManager.TaskList(this.list.public.id);
            for (var n = 0, N = filterResult.length; n < N; n++) {
                result._add(filterResult[n], false);
            }
            this._showResults(result);
        },
        reset: function() {
            if (!this.listModule) {
                throw new Error('listModule is not defined');
            }

            this._showResults(this.list);
        }
    });
});