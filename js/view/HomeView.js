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

define([
    'control/HomeControl',
    'view/ListView',
    'modules/FastTask',
    'modules/SimpleSearch',
    'modules/MainPanel'
], function(Control, ListView, FastTask, SimpleSearch, MainPanel) {
    var HomeView = new SingletonClass({
        page: 'home',

        template:
'<div data-role="header"> \
    <a href="#" id="prevList" data-role="button" data-icon="carat-l">Previous list</a> \
    <h1>Home</h1> \
    <a href="#mainPanel" data-role="button" data-icon="gear" data-iconpos="notext"></a> \
</div> \
\
<div id="content" class="ui-content"> \
    <div id="fastTaskModule" data-role="fieldcontain"></div> \
    <div id="listModule" data-role="fieldcontain"></div> \
</div> \
\
<div data-role="footer" data-position="fixed" data-tap-toggle="false"> \
    <table class="full"> \
        <tbody> \
        <tr> \
            <td> \
                <button id="addList" class="btn-left" data-role="button" data-icon="plus">New list</button> \
            </td> \
            <td> \
                <div id="searchModule"></div> \
            </td> \
            <td> \
                <button id="addTask" class="btn-right" data-role="button" data-icon="plus" data-iconpos="right">New task</button> \
            </td> \
        </tr> \
        </tbody> \
    </table> \
</div>',

        _footerBtnsWidth: null,
        $addTaskBtn: null,
        $addListBtn: null,

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(this.template));

            this.$content = this.$el.find('#content');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');

            this.$addTaskBtn.on('click', this.addTask.bind(this));
            this.$addListBtn.on('click', this.addList.bind(this));
            // todo: Move this button and event handler into the ListView
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));

            this.list = new ListView(this.$content.find('#listModule'), TaskOnFly.getCurrentList());
            this.fastTask = new FastTask({
                view: this.$content.find('#fastTaskModule')
            });
            this.simpleSearch = new SimpleSearch({
                view: this.$el.find('#searchModule'),
                control: this.list
            });
            this.panel = new MainPanel({
                view: {
                    page: this.$el
                }
            });

            this.control = new Control();
        },
        render: function() {
            this.$el.trigger('create');
            this._fixFooterTable();

            this._renderModules();

            return this;
        },
        _renderModules: function() {
            this.list.render();
            this.fastTask.view.render();
            this.simpleSearch.view.render();
            this.panel.view.render();
        },
        addTask: function(ev) {
            ev.preventDefault();
            this.control.addTask();
        },
        addList: function(ev) {
            ev.preventDefault();
            this.control.addList();
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

    TaskManager.HomeView = HomeView;

    return HomeView;
});