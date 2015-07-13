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
	'../../AItem/InList/Control'
], function (Parent) {
	return new Class(Parent, {
		connect: function() {
			Parent.prototype.connect.call(this);

			this.model.listen({
				updateNDone: _.bind(this.onUpdateNDone, this),
				updateNItems: _.bind(this.onUpdateNItems, this)
			});
		},

		action: function(id) {
			var id = this.model.public.id;
			TaskOnFly.model.changeView(['path', this.model._path].join(''));
		},

		onUpdateNDone: function(ev, N) {
			this.view.updateNDone(N);
		},

		onUpdateNItems: function(ev, N) {
			this.view.updateNItems(N);
		}
	});
});
