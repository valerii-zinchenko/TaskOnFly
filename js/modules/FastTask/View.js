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
<div class="full fast-task">\
	<div class="task-name">\
		<input id="fastTitle" class="form-control" type="text" placeholder="Fast task">\
	</div>\
	<div class="controls">\
		<div id="priority" class="btn-group" data-toggle="buttons">\
			<label class="low btn btn-default" for="low">\
				<input id="low" type="radio" name="priority" value="2" aria-label="Low priority">\
				<span class="glyphicon glyphicon-download"></span>\
			</label>\
			<label class="normal btn btn-default active" for="normal">\
				<input id="normal" type="radio" name="priority" value="1" aria-label="Normal priority" checked>\
				<span class="glyphicon glyphicon-record"></span>\
			</label>\
			<label class="high btn btn-default" for="high">\
				<input id="high" type="radio" name="priority" value="0" aria-label="High priority">\
				<span class="glyphicon glyphicon-upload"></span>\
			</label>\
		</div>\
		<button id="addFastTask" class="btn btn-default" aria-label="Create"><span class="glyphicon glyphicon-plus"></span></button>\
	</div>\
</div>',

        _postRender: function() {
            this.$fastTilte = this.$el.find('#fastTitle');
            this.$priority = this.$el.find('#priority');
            this.$add = this.$el.find('#addFastTask');
			this.$radioButtons = this.$priority.find('input');
        },
		_attachEvents: function() {
            this.$add.on('click', this.onAddTask.bind(this));
        },
        update: function() {
            this.$fastTilte.val('');

            this.$radioButtons.prop('checked', false);
            this.$priority.find('#normal').prop('checked', true);
        },
		getData: function() {
			return {
				title: this.$fastTilte.val(),
				priority: this.$priority.find(':checked').val()
			};
		},
        onAddTask: function(ev) {
            ev.preventDefault();

            this.control.action();

			this.update();
        }
    });
});
