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
    'modules/TaskList'
    //'modules/ListViewGroupedByDate'
], function(Parent, TaskList) {
    return new SingletonClass(Parent, {
        page: 'home',

        template: '\
<nav class="navbar navbar-default navbar-fixed-top">\
	<div class="container-fluid">\
		<div class="navbar-header">\
			<button id="prevList" class="btn btn-default navbar-btn"><span class="glyphicon glyphicon-chevron-left"></span>Prev list</button>\
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#mainPanel">\
				<span class="sr-only">Toggle navigation</span>\
				<span class="icon-bar"></span>\
				<span class="icon-bar"></span>\
				<span class="icon-bar"></span>\
			</button>\
			<a href="#" class="navbar-brand">TaskOnFly</a>\
		</div>\
\
		<div id="mainPanel" class="collapse navbar-collapse">\
			<ul class="nav navbar-nav navbar-right">\
				<li><a href="#add/task"><span class="glyphicon glyphicon-plus"></span> Add task</a></li>\
				<li><a href="#add/list"><span class="glyphicon glyphicon-plus"></span> Add list</a></li>\
				<li><a href="#about"><span class="glyphicon glyphicon-info-sign"></span> About</a></li>\
			</ul>\
		</div>\
	</div>\
</nav>\
\
<div id="content" class="container-fluid">\
	<div id="fastTaskModule" class="module" data-role="fieldcontain"></div>\
	<div id="listModule" class="module" data-role="fieldcontain"></div>\
</div>\
\
<footer class="footer">\
	<div class="container-fluid">\
		<div id="searchModule" class="module"></div>\
	</div>\
</footer>',

        _footerBtnsWidth: null,
		$content: null,
		$listModule: null,
		$fastTaskModule: null,
		$fastSearchModule: null,
        $addTaskBtn: null,
        $addListBtn: null,

		connect: function() {
			this.list = TaskOnFly.model.getCurrentList().useState('asList');
			this.fastTaskModule = TaskOnFly.useState('fastTask');
			this.fastSearchModule = TaskOnFly.useState('fastSearch');
			//this.mainPanel = TaskOnFly.useState('mainPanel');
		},
        _postProcessTemplate: function() {
			this.$content = this.$el.find('#content');
			this.$listModule = this.$content.find('#listModule');
			this.$fastTaskModule = this.$content.find('#fastTaskModule');
			this.$fastSearchModule = this.$el.find('#searchModule');
			this.$navBarToggler = this.$el.find('nav .navbar-toggle');
            this.$addTaskBtn = this.$el.find('#addTask');
            this.$addListBtn = this.$el.find('#addList');
            this.$prevListBtn = this.$el.find('#prevList');
        },

		update: function() {
			if (!this.$navBarToggler.hasClass('collapsed')) {
				this.$navBarToggler.click();
			}

			this.list.view.update();
			this.fastTaskModule.view.update();
			this.fastSearchModule.view.update();
			//this.mainPanel.view.update();
			
			if (this.list.model._path == '/') {
				this.$prevListBtn.prop('disabled', true);
			} else {
				this.$prevListBtn.prop('disabled', false);
			}
		},
        renderSubModules: function() {
            this.$listModule.append(this.list.view.render());
			this.$fastTaskModule.append(this.fastTaskModule.view.render());
			this.$fastSearchModule.append(this.fastSearchModule.view.render());
			//this.$el.append(this.mainPanel.view.render());
        },
		_postRenderModules: function() {
			this.list.view.postRender();
			this.fastTaskModule.view.postRender();
			this.fastSearchModule.view.postRender();
			//this.mainPanel.view.postRender();
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

			TaskOnFly.model.listen('changeList', _.bind(this._switchLists, this));
		},

        selectParentList: function() {
			TaskOnFly.model.changeView('path' + this.list.model.getParentLocation());
        },
        _switchLists: function(ev, newList) {
			var list = newList.useState('asList');
			if (this.list == list) {
				return;
			}
			if (!list.view._isRendered) {
				list.view.render();
			}
			var $newList = list.view.$el;
			var $currentList = this.list.view.$el;

			this.$listModule.append($newList);
			if (!list.view._isRendered) {
				$newList.trigger('create');
				list.view.postRender();
			}

            if (this.list.model._parent && this.list.model._parent.public.id === list.model.public.id) {
                //todo Position new list to the left side and move both lists from left to the right
            } else {
                //todo Position new list to the right side and move both lists from right to the left
            }

			$currentList.detach();
			this.list = list;

			this.list.view.update();

			if (this.list.model._path == '/') {
				this.$prevListBtn.prop('disabled', true);
			} else {
				this.$prevListBtn.prop('disabled', false);
			}
        }
    });
});
