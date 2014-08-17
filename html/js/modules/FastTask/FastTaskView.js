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
    'modules/FastTask/template'
],function (template) {
    return new SingletonClass({
        initialize: function($holder) {
            if (!$holder) {
                throw new Error('Holder element of FastTask module is not defined.');
            }

            this.$el = $(template);
            this.$fastTilte = this.$el.find('#fastTitle');
            this.$priority = this.$el.find('#priority');
            this.$add = this.$el.find('#addFastTask');

            this.$add.on('click', this._addTask.bind(this));

            this.$content = $holder;
            this.$content.empty();
            this.$content.append(this.$el);

            this.$content.trigger('create');
        },
        render: function() {
            this.$fastTilte.val('');

            this.$priority.find(':checked').prop('checked', false).checkboxradio("refresh");
            this.$priority.find('#normal').prop('checked', true).checkboxradio("refresh");

            return this.$content;
        },
        _addTask: function(ev) {
            ev.preventDefault();
            var title = this.$fastTilte.val();

            if (!title) {
                return;
            }

            TaskMe.getCurrentList().addTask({
                title: title,
                priority: this.$priority.find(':checked').val(),
                timestamp: new Date()
            });

            this.render();
        }
    });
});