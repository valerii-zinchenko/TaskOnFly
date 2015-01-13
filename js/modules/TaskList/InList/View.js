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
	'../../AItem/InList/View',
	'view/PopupDialog'
], function(Parent) {
	return new Class(Parent, {
		_postRender: function() {
			Parent.prototype._postRender.call(this);

			this.$listItem.find('input').prop('disabled', true);
		},

		onClick: function(ev) {
			ev.preventDefault();

			this.control.action();
		},
		onRemove: function(ev) {
			ev.preventDefault();

			if (this.model.public.items.length > 0) {
				new TaskManager.PopupDialog({
					messages: ['Are you sure you want to delete the list of tasks?', 'This action cannot be undone.'],
					controls: [
						{
							title:    'Yes',
							callback: this._continueRemoving.bind(this)
						},
						{
							title: 'Cancel'
						}
					]
				}).show();
			} else {
				this._continueRemoving();
			}
		},
		_continueRemoving: function() {
			this.$el.remove();

			this.control.removeModel();
		}
	});
});
