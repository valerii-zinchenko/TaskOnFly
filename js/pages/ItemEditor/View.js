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
		selector: '#editor',

		header: 'Item',

		_initElements: function() {
			this.$header = this.$el.find('#headerTitle');
			this.$isDone = this.$el.find('.is-done');
			this.$done = this.$el.find('#done');
			this.$title = this.$el.find('#title');
			this.$priority = this.$el.find('#priority');
			this.$notes = this.$el.find('#notes');
			this.$startDate = this.$el.find('#start');
			this.$dueDate = this.$el.find('#due');
		},

		_attachEvents: function() {
			this.$el.find('.back').on('vclick', this.onBack.bind(this));
			this.$el.find('form').on('submit', this.onSave.bind(this));
			this.$done.on('change', this.onToggleStatus.bind(this));
		},

		update: function() {
			this.resetForm();

			this.$header.html(this.header);

			if (!this._model) {
				this.$priority.find('#1') .prop('checked', true)
					.parent().addClass('active');
				return;
			}

			var data = this._model.public;
			this._model = null;

			this.$done.prop('checked', data.isDone);
			this.$title.val(data.title);
			this.$priority.find('#' + data.priority).prop('checked', true)
				.parent().addClass('active');
			this.$startDate.val(data.startDate);
			this.$dueDate.val(data.dueDate);
			this.$notes.val(data.notes);

			if (data.isDone) {
				this.$isDone
					.addClass('done')
					.addClass('active');
			}
		},

		onToggleStatus: function(ev) {
			this.$isDone.toggleClass('done');
		},
		onBack: function(ev) {
			ev.preventDefault();

			TaskOnFly.model.back();
		},
        onSave: function(ev) {
            ev.preventDefault();

            this.control.save();

            TaskOnFly.model.back();
        },

		setHeader: function(header) {
			this.header = header;
		},
		setDataModel: function(model) {
			this._model = model;
		},
		resetForm: function() {
			this.$done.prop('checked', false)
			this.$isDone
				.removeClass('done')
				.removeClass('active');
			this.$title.val('');
			this.$priority.find('input').prop('checked', false)
			this.$priority.find('label').removeClass('active');
			this.$startDate.val('');
			this.$dueDate.val('');
			this.$notes.val('');

			this.$isDone.removeClass('done');
		},
		getFormData: function() {
			return {
				title: this.$title.val().trim(),
				isDone: this.$done.prop('checked'),
				priority: this.$priority.find(':checked').val(),
				startDate: this.$startDate.val(),
				dueDate: this.$dueDate.val(),
				notes: this.$notes.val().trim(),
				version: TaskOnFly.model.version
			};
		}
	});
});
