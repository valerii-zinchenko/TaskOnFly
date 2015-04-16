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
    'model/TaskOnFly',
    'pages/Home',
    'pages/ItemEditor',
	'pages/About',
	'modules/FastTask',
	'modules/SimpleSearch'
], function(Model, Home, ItemEditor, About, FastTask, FastSearch) {
	return new MVCModule({
		Model: Model,
		states: {
			home: new Home(),
			itemEditor: new ItemEditor(),
			about: new About(),
			fastTask: new FastTask(),
			fastSearch: new FastSearch()
		}
	});
});
