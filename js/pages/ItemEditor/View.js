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
    '../APage/View'
], function(Parent) {
    return new SingletonClass(Parent, {
        template:'\
<div data-role="header">\
	<a href="#" class="back" data-role="back" data-icon="carat-l">Back</a>\
	<h1 id="headerTitle">Item</h1>\
	<a href="#" class="save" data-role="button" data-icon="plus" data-iconpos="right">Save</a>\
</div>\
\
<div data-role="content">\
	<div data-role="fieldcontain">\
		<table class="task-title" style="width: 100%">\
		<tbody>\
			<tr>\
				<td>\
					<input type="checkbox" id="done" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off"/>\
				</td>\
				<td>\
					<input type="text" id="title" name="title" placeholder="Title" value=""/>\
				</td>\
			</tr>\
		</tbody>\
		</table>\
	</div>\
\
	<div data-role="fieldcontain">\
		<div id="priority" data-role="controlgroup" data-type="horizontal" class="full-width ui-controlgroup-grid-b">\
			<label for="2">Low</label>\
			<input id="2" type="radio" name="priority" value="2">\
			<label for="1">Normal</label>\
			<input id="1" type="radio" name="priority" value="1">\
			<label for="0">High</label>\
			<input id="0" type="radio" name="priority" value="0">\
		</div>\
	</div>\
\
	<div data-role="fieldcontain">\
		<label for="start">Start:</label>\
		<input type="date" id="start" value="" placeholder="YYYY-MM-DD">\
	</div>\
\
	<div data-role="fieldcontain">\
		<label for="due">Due:</label>\
		<input type="date" id="due" value="" placeholder="YYYY-MM-DD">\
	</div>\
\
	<div data-role="fieldcontain">\
		<textarea id="notes" name="notes" placeholder="Notes"></textarea>\
	</div>\
\
	<div data-role="fieldcontain">\
		<button class="save">Save</button>\
	</div>\
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
			this.$el.find('.save').on('vclick', this.onSave.bind(this));
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

			this.$priority.find(':checked').prop('checked', false).checkboxradio('refresh');

			this.$isDone.prop('checked', data.isDone);
			this.$title.val(data.title);
			this.$priority.find('#' + data.priority).prop('checked', true).checkboxradio('refresh');;
			this.$startDate.val(data.startDate);
			this.$dueDate.val(data.dueDate);
			this.$notes.val(data.notes);

			if (data.isDone) {
				this.$isDone.removeClass('ui-checkbox-off');
				this.$isDone.addClass('ui-checkbox-on');
			} else {
				this.$isDone.removeClass('ui-checkbox-on');
				this.$isDone.addClass('ui-checkbox-off');
			}
		},

		onToggleStatus: function(ev) {
			this.$isDone.toggleClass('ui-checkbox-on');
			this.$isDone.toggleClass('ui-checkbox-off');
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
			this.$priority.find('#1').prop('checked', true).checkboxradio('refresh');;
			this.$priority.find('#0, #2').prop('checked', false).checkboxradio('refresh');;
			this.$startDate.val('');
			this.$dueDate.val('');
			this.$notes.val('');

			this.$isDone.removeClass('ui-checkbox-on');
			this.$isDone.addClass('ui-checkbox-off');
		},
		getFormData: function() {
			return {
				title: this.$title.val().trim(),
				isDone: this.$isDone.prop('checked'),
				priority: this.$priority.find(':checked').val(),
				startDate: this.$startDate.val(),
				dueDate: this.$dueDate.val(),
				notes: this.$notes.val().trim(),
				version: TaskManager.version
			};
		}
	});
});
