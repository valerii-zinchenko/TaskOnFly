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
	var template = '\
<div class="list-item" data-item-id="<%= public.id %>">\
	<div class="model-data <%= public.type.toLowerCase() %> <% if (public.isDone) {%>done<% } %>" data-priority="<%= public.priority %>">\
		<div class="title btn btn-default">\
			<label for="<%= public.id %>">\
				<span class="checkbox-wrapper glyphicon glyphicon-ok">\
					<input id="<%= public.id %>" type="checkbox" <% if (public.isDone) { %> checked <% } %>>\
				</span>\
				<span class="title-text"><%= public.title %></span>\
			</label>\
			<span class="list-counter">\
				<span class="js-done-tasks"><%= _NDone %></span>/<span class="js-total-tasks"><%= public.items.length %></span>\
			</span>\
		</div>\
	</div>\
	<div class="btn-group model-controls" role="group">\
		<button class="btn btn-default js-btn-edit" aria-label="Edit"><span class="glyphicon glyphicon-pencil"></span></button>\
		<button class="btn btn-default js-btn-remove" aria-label="Remove"><span class="glyphicon glyphicon-remove"></button>\
	</div>\
</div>';

	return new Class(Parent, {
		template: template,

		_initElements: function() {
			Parent.prototype._initElements.call(this);

			this.$listItem.find('input').prop('disabled', true);

			this.$nDoneTasks = this.$titleWrapper.find('.js-done-tasks');
			this.$nTasks = this.$titleWrapper.find('.js-total-tasks');
		},
		_attachEvents: function() {
			Parent.prototype._attachEvents.call(this);

			this.$listItem.on('click', this.onClick.bind(this));
		},

		updateNItems: function(N) {
			this.$nTasks.html(N);
		},

		updateNDone: function(N) {
			this.$nDoneTasks.html(N);
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
