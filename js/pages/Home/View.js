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
    '../APage/View',
    'modules/TaskList'/*,
    'modules/ListViewGroupedByDate',
    'modules/FastTask',
    'modules/SimpleSearch',
    'modules/MainPanel'*/
], function(Parent, TaskList /*, FastTask, SimpleSearch, MainPanel*/) {
    return new SingletonClass(Parent, {
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
                <button id="addList" class="btn-left" data-role="button" data-icon="plus">List</button> \
            </td> \
            <td> \
                <div id="searchModule"></div> \
            </td> \
            <td> \
                <button id="addTask" class="btn-right" data-role="button" data-icon="plus" data-iconpos="right">Task</button> \
            </td> \
        </tr> \
        </tbody> \
    </table> \
</div>',

        _footerBtnsWidth: null,
        $addTaskBtn: null,
        $addListBtn: null,

        initialize: function() {
            this.list = TaskOnFly.getCurrentList().useState('asList');

            this._buildModules();
        },
        _postProcessTemplate: function() {
			this.$content = this.$el.find('#content');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');
        },

		update: function() {
            this._fixFooterTable();

			this.list.view.update();
		},
        _buildModules: function() {
			/*
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
			*/
        },
        renderSubModules: function() {
            this.$el.find('#listModule').append(this.list.view.render());
            /*this.fastTask.view.render();
            this.simpleSearch.view.render();
            this.panel.view.render();*/
        },
		_postRenderModules: function() {
			this.list.view.postRender();
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
            this.selectParentList();
        },

		_attachEvents: function() {
            this.$addTaskBtn.on('click', this.addTask.bind(this));
            this.$addListBtn.on('click', this.addList.bind(this));

            // todo: Move this button and event handler into the TaskList
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));
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
        },

        selectParentList: function() {
            TaskOnFly.changeView('#path' + this.control.getList().getParentLocation());
        },
        _switchLists: function(newList) {
            var list = this.control.getList();
            this.control.setList(newList);

            var $newList = this._prepareListElement(newList);

            if (newList.public.items.length > 0) {
                this.$content.append($newList);
                $newList.trigger('create');
            }

            if (list._parent && list._parent.public.id === newList.public.id) {
                //todo Position new list to the left side and move both lists from left to the right
            } else {
                //todo Position new list to the right side and move both lists from right to the left
            }

            this.$currentList.remove();
            this.$currentList = $newList;

            if (newList.public.items.length > 0) {
                this._postRender();
            }
        }
    });
});
