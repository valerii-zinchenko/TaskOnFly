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

define(function () {
	return new Class(AView, {
		template:
'<div id="<%= panelID %>" data-role="panel" data-position="right" data-display="overlay"> \
	<ul data-role="listview"> \
	<% _.each(items, function(item) { %> \
		<li> \
			<a href="<%= item.link %>"><%= item.title %></a> \
		</li> \
	<% }); %> \
	</ul> \
</div>',

		panelID: '',
		items: [],


		processTemplate: function() {
			this.$el = $(_.template(this.template, this));
		},

        initialize: function() {
            if (!this.panelID) {
                throw new Error('Panel ID is not defined');
            }

            if (!(this.items instanceof Array)) {
                throw new Error('Incorrect type of the "items" property');
            }
            if (this.items.length === 0) {
                console.warn('No items for panel. Panel will be disabled.');
                return
            }
            if (this.items.some(function(item) {
                    return !(item instanceof Object);
                }))
            {
                throw  new Error('Incorrect type of the content in "items" property');
            }

            if (this.items.some(function(item) {
                    return !item.title;
                }))
            {
                throw  new Error('"title" property is missed in object content in "items" array');
            }
            if (this.items.some(function(item) {
                    return typeof item.title != 'string';
                }))
            {
                throw  new Error('Incorrect type of "title" property in object content in "items" array');
            }

            if (this.items.some(function(item) {
                    return !item.link;
                }))
            {
                throw  new Error('"link" property is missed in object content in "items" array');
            }
            if (this.items.some(function(item) {
                    return typeof item.link != 'string';
                }))
            {
                throw  new Error('Incorrect type of "link" property in object content in "items" array');
            }
        },

        _postRender: function() {
        },

        close: function() {
        },
        _attachEvents: function() {
            this.$el.find('a').on('vclick', this.close.bind(this));
        }
	});
});
