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
    'modules/SimpleSearch/template',
    'model/FilterList',
    'control/ListView'
],function (template, FilterList, ListView) {
    return new SingletonClass({
        $el: $(template),

        initialize: function(holder, listModule) {
            if (!holder) {
                new Error('Holder element for module is not defined');
            }

            this.$holder = holder;
            this.$listModule = listModule;

            this.currentList = TaskMe.getCurrentList();
            this.filter = new FilterList(TaskMe.getCurrentList());
            this.listView = new ListView(this.$listModule, this.currentList);

            this.$el.on('keyup', this.onType.bind(this));
        },
        render: function() {
            this.$holder.empty();
            this.$holder.append(this.$el);

            this.$holder.trigger('create');

            this.$holder.find('.ui-input-clear').on('click', this.onClear.bind(this));

            return this;
        },
        showResults: function(list) {
            if (this.listView.list === this.currentList && list === this.currentList) {
                return;
            }

            this.listView.setList(list);
            this.listView.render();
        },
        onType: function(ev) {
            ev.preventDefault();

            var val = $(ev.target).val();

            if (val.length < 2) {
                this.onClear(ev);
                return;
            }

            this.filter.setRules({
                title: val
            });

            this.showResults(this.filter.run());
        },
        onClear: function(ev) {
            ev.preventDefault();

            this.showResults(this.currentList);
        }
    });
});