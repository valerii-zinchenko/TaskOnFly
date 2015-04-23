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
	return new SingletonClass(AView, {
		template: '\
<div>\
	<input id="simpleSearch" class="form-control" placeholder="Search in current list...">\
</div>',

		_postRender: function() {
			this.$input = this.$el.find('#simpleSearch');
			this.$clear = this.$el.find('.ui-input-clear');
		},
		_attachEvents: function() {
			this.$input.on('keyup', this.onType.bind(this));
			this.$clear.on('click', this.onClear.bind(this));
		},

		onType: function(ev) {
			ev.preventDefault();

			var val = $(ev.target).val();

			if (val.length < 2) {
				this.control.reset();
				return;
			}

			this.control.search(val);
		},
		onClear: function(ev) {
			ev.preventDefault();

			this.control.reset();
		}
	});
});
