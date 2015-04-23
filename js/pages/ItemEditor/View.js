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
    '../APage/View'
], function(Parent) {
    return new SingletonClass(Parent, {
        template:'\
<nav class="navbar navbar-default navbar-fixed-top">\
	<div class="container-fluid">\
		<div class="navbar-header">\
			<a href="#" class="navbar-brand">TaskOnFly</a>\
			<p id="headerTitle" class="navbar-text">Item</p>\
		</div>\
	</div>\
</nav>\
<div class="container-fluid">\
	<form class="form-horizontal">\
		<div class="form-group">\
			<div class="col-xs-12">\
				<div class="input-group" data-toggle="buttons">\
					<label class="is-done btn btn-default input-group-addon" for="done">\
						<input id="done" type="checkbox" aria-label="Is task done?">\
						<span class="glyphicon glyphicon-ok"></span>\
					</label>\
					<input type="text" id="title" class="form-control" name="title" placeholder="Title" value=""/>\
				</div>\
			</div>\
		</div>\
\
		<div class="form-group">\
			<div id="priority" class="col-xs-12 btn-group btn-group-justified" data-toggle="buttons">\
				<label for="2" class="low btn btn-default">\
					<input id="2" type="radio" name="priority" value="2">Low\
				</label>\
				<label for="1" class="normal btn btn-default active">\
					<input id="1" type="radio" name="priority" value="1" checked>Normal\
				</label>\
				<label for="0" class="high btn btn-default">\
					<input id="0" type="radio" name="priority" value="0">High\
				</label>\
			</div>\
		</div>\
\
		<div class="form-group">\
			<div class="col-xs-12 col-sm-6">\
				<div class="row">\
					<label for="start" class="control-label col-xs-2">Start:</label>\
					<div class="col-xs-10">\
						<input type="date" id="start" class="form-control" value="" placeholder="YYYY-MM-DD">\
					</div>\
				</div>\
			</div>\
			<div class="col-xs-12 col-sm-6">\
				<div class="row">\
					<label for="due" class="control-label col-xs-2">Due:</label>\
					<div class="col-xs-10">\
						<input type="date" id="due" class="form-control" value="" placeholder="YYYY-MM-DD">\
					</div>\
				</div>\
			</div>\
		</div>\
\
		<div class="form-group">\
			<div class="col-xs-12">\
				<textarea id="notes" class="form-control" name="notes" placeholder="Notes..."></textarea>\
			</div>\
		</div>\
\
		<div class="form-group">\
			<div class="col-xs-12">\
				<input type="submit" value="Save" class="save btn btn-primary btn-block">\
			</div>\
		</div>\
	</form>\
</div>\
		',

		page: 'editor',
		header: 'Item',

		_postProcessTemplate: function() {
			this.$header = this.$el.find('#headerTitle');
			this.$isDone = this.$el.find('#done');
			this.$title = this.$el.find('#title');
			this.$priority = this.$el.find('#priority');
			this.$notes = this.$el.find('#notes');
			this.$startDate = this.$el.find('#start');
			this.$dueDate = this.$el.find('#due');
		},

		_attachEvents: function() {
			this.$el.find('.back').on('vclick', this.onBack.bind(this));
			this.$el.find('form').on('submit', this.onSave.bind(this));
			this.$isDone.on('change', this.onToggleStatus.bind(this));
		},

		update: function() {
			this.$header.html(this.header);

			if (!this._model) {
				this.resetForm();
				return;
			}

			var data = this._model.public;
			this._model = null;

			this.$priority.find(':checked').prop('checked', false);

			this.$isDone.prop('checked', data.isDone);
			this.$title.val(data.title);
			this.$priority.find('#' + data.priority).prop('checked', true);
			this.$startDate.val(data.startDate);
			this.$dueDate.val(data.dueDate);
			this.$notes.val(data.notes);

			if (data.isDone) {
				this.$isDone.addClass('done');
			} else {
				this.$isDone.removeClass('done');
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
			this.$isDone.prop('checked', false);
			this.$title.val('');
			this.$priority.find('#1').prop('checked', true);
			this.$priority.find('#0, #2').prop('checked', false);
			this.$startDate.val('');
			this.$dueDate.val('');
			this.$notes.val('');

			this.$isDone.removeClass('done');
		},
		getFormData: function() {
			return {
				title: this.$title.val().trim(),
				isDone: this.$isDone.prop('checked'),
				priority: this.$priority.find(':checked').val(),
				startDate: this.$startDate.val(),
				dueDate: this.$dueDate.val(),
				notes: this.$notes.val().trim(),
				version: TaskOnFly.model.version
			};
		}
	});
});
