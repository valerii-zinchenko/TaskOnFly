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

define(function () {
    return new SingletonClass(AView, {
        page: '',

		initialize: function() {
			this.$el = $('<div>', {
				id: this.page,
				'class': 'page'
			});

			$('body').append(this.$el);
        },

		processTemplate: function() {
			this.$el.html(_.template(this.template, this));
		},

		show: function() {
			this.$el.addClass('active');
		},
		hide: function() {
			this.$el.removeClass('active');
		}
    });
});
