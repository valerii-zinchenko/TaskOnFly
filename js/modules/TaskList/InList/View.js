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

define([
	'../../AItem/InList/View',
	'view/PopupDialog'
], function(Parent, PopupDialog) {
	var taskCounterTemplate = '\
<span class="list-counter">\
	<span class="js-done-tasks"></span>/<span class="js-total-tasks"></span>\
</span>\
';
	return new Class(Parent, {
		_postProcessTemplate: function() {
			Parent.prototype._postProcessTemplate.call(this);

			this.$listItem.find('input').prop('disabled', true);

			this.$title.append(taskCounterTemplate);

			this.$nDoneTasks = this.$title.find('.js-done-tasks');
			this.$nTasks = this.$title.find('.js-total-tasks');
		},
		_attachEvents: function() {
			Parent.prototype._attachEvents.call(this);

			this.$listItem.on('click', this.onChange.bind(this));
		},
		update: function() {
			this.$nDoneTasks.html(this.model._NDone);
			this.$nTasks.html(this.model.public.items.length);
		},

		onRemove: function(ev) {
			ev.preventDefault();

			if (this.model.public.items.length > 0) {
				new PopupDialog({
					title: "Remove non-empty list of tasks?",
					messages: ['Are you sure you want to remove the list of tasks?', 'This action cannot be undone.'],
					controls: [
						{
							title: 'Cancel',
							btnClass: 'btn-default'
						},
						{
							title: 'Yes',
							callback: this._continueRemoving.bind(this),
							btnClass: 'btn-primary'
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
