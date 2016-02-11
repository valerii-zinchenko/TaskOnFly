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


'use strict';

define(function() {
	return new SingletonClass(StaticView, {
        selector: '#home',

        initialize: function() {
			this.$navBarToggler = this.$el.find('nav .navbar-toggle');
			this.$prevListBtn = this.$el.find('#prevList');

			this.$list = this.$el.find('#list');
        },

		update: function() {
			if (!this.$navBarToggler.hasClass('collapsed')) {
				this.$navBarToggler.click();
			}

			if (!this.list) {
				this.list = TaskOnFly.model.getCurrentList().getState('asList');
				this.$list.append(this.list.view.$el);
				this.model.listen('changeList', _.bind(this._switchLists, this));
			}

			this.list.view.update();
			
			if (this.list.model._path == '/') {
				this.$prevListBtn.prop('disabled', true);
			} else {
				this.$prevListBtn.prop('disabled', false);
			}
		},

        selectPreviousList: function(ev) {
            ev.preventDefault();
            this.selectParentList();
        },

		_attachEvents: function() {
            // todo: Move this button and event handler into the TaskList
            this.$prevListBtn.on('click', this.selectPreviousList.bind(this));
		},

        selectParentList: function() {
			this.model.changeView('path' + this.list.model.getParentLocation());
        },

        _switchLists: function(ev, newList) {
			var list = newList.getState('asList');
			if (this.list == list) {
				return;
			}

			var $newList = list.view.$el;
			var $currentList = this.list.view.$el;

			this.$list.append($newList);

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
