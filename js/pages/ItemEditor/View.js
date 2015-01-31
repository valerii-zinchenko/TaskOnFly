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
        template:
'<div data-role="header">\
    <a href="#home" data-role="back" data-icon="carat-l">Back</a>\
    <h1 id="title">Item</h1>\
    <a class="save" data-role="button" data-icon="plus" data-iconpos="right">Save</a>\
</div>\
\
<div data-role="content">\
	<div id="itemForm"></div>\
\
	<div data-role="fieldcontain">\
		<button class="save">Save</button>\
	</div>\
</div>\
',

        page: 'editor',
        header: 'Item',

        _postProcessTemplate: function() {
            this.$header = this.$el.find('#title');
        },

		_postRenderModules: function() {
			this.item.view.postRender();
		},

		renderSubModules: function() {
			this.$el.find('#itemForm').append(this.item.view.render());
		},

        _attachEvents: function() {
            this.$el.find('.save').on('vclick', this.onSave.bind(this));
        },

        update: function() {
            this.$header.html(this.header);

			this.updateSubModules();
        },

		updateSubModules: function() {
			this.item.view.update();
		},

        onSave: function(ev) {
            ev.preventDefault();

            this.control.save();

            TaskOnFly.changeView('home');
        }
    });
});
