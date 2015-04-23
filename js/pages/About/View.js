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
],function (Parent) {
    return new SingletonClass(Parent, {
        page: 'about',
        template:
'<nav class="navbar navbar-default navbar-fixed-top">\
	<div class="container-fluid">\
		<div class="navbar-header">\
			<a href="#" class="navbar-brand">TaskOnFly</a>\
		</div>\
	</div>\
</nav>\
<div class="container-fluid">\
	<div class="well">\
		<p class="justify">Version <%= TaskOnFly.model.version %></p>\
		<p class="justify">TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.</p>\
		<p class="justify">Copyright (C) 2014-2015  Valerii Zinchenko</p>\
		<p class="justify">TaskOnFly is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>\
		<p class="justify">TaskOnFly is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.</p>\
		<p class="justify">You should have received a copy of the GNU General Public License along with TaskOnFly.  If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.</p>\
		<p class="justify">All source files are available at: <a href="http://github.com/valerii-zinchenko/TaskOnFly">http://github.com/valerii-zinchenko/TaskOnFly</a></p>\
	</div>\
</div>',

		_attachEvents: function() {
			this.$el.find('#toHome', this.onToHome.bind(this));
		},

		onToHome: function(ev) {
			ev.preventDefault();

			this.toHome();
		},

		toHome: function() {
			TaskOnFly.changeView('home');
		}
    });
});
