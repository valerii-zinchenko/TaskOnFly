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
	'version',
	'modules/Task'
], function (version, Task) {
	return new SingletonClass(AControl, {
		action: function() {
			var data = this.view.getData();

			if (data.title) {
				TaskOnFly.model.getCurrentList().model.addItem(TaskOnFly.model.createTask({
					title: data.title,
					priority: data.priority,
					dueDate: utils.date(new Date(Date.now() + 86400000)),	// + 1 day
					version: version()
				}));
			}
		}
	});
});
