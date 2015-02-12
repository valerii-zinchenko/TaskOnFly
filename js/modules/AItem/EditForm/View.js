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

define(function() {
    return new SingletonClass(AView, {
        template: '\
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
    <div data-role="fieldcontain">\
        <label for="due">Due:</label>\
        <input type="date" id="due" value="" placeholder="YYYY-MM-DD">\
    </div>\
\
    <div data-role="fieldcontain">\
        <textarea id="notes" name="notes" placeholder="Notes"></textarea>\
    </div>\
',

        _postProcessTemplate: function() {
            this.$isDone = this.$el.find('#done');
            this.$title = this.$el.find('#title');
            this.$priority = this.$el.find('#priority');
            this.$notes = this.$el.find('#notes');
            this.$startDate = this.$el.find('#start');
            this.$dueDate = this.$el.find('#due');
        },

        _attachEvents: function() {
            this.$isDone.on('change', this.onToggleStatus.bind(this));
        },

        update: function() {
			var data = this.model.public;

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