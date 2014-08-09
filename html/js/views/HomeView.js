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
    'text!templates/home.html',
    'js/views/List'
], function(template, List) {
    var HomeView = new SingletonClass({
        _footerBtnsWidth: null,

        page: 'home',
        $addTaskBtn: null,
        $addListBtn: null,

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(template));
            this.$content = this.$el.find('#content');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');

            this.$addTaskBtn.on('click', this.addTask);
            this.$addListBtn.on('click', this.addList);
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));

            this.$listModule = this.$content.find('#listModule');
            this.list = new List(this.$listModule, TaskMe.getRootList());
        },
        render: function() {
            this.$el.trigger('create');
            this._fixFooterTable();

            this.list.render();

            return this;
        },
        addTask: function(ev) {
            ev.preventDefault();
            TaskMe.changeView('add/task');
        },
        addList: function(ev) {
            ev.preventDefault();
            TaskMe.changeView('add/list');
        },
        selectPreviousList: function(ev) {
            ev.preventDefault();
            this.list.selectParentList();
        },

        _fixFooterTable: function() {
            if (!this._footerBtnsWidth) {
                var offset = parseFloat(this.$addTaskBtn.css('left'));
                this._footerBtnsWidth = {
                    addTaskBtn: this.$addTaskBtn.outerWidth() + offset*2,
                    addListBtn: this.$addListBtn.outerWidth() + offset*2
                };
            }
            this.$addTaskBtn.parents('td').css('width', this._footerBtnsWidth.addTaskBtn);
            this.$addListBtn.parents('td').css('width', this._footerBtnsWidth.addListBtn);
        }
    });

    return HomeView;
});
