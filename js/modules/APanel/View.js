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
    return new Class({
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
        $el: null,
        _$holder: null,

        initialize: function(options) {
            if (!options) {
                return;
            }

            if (options.page) {
                this.setPanelPage(options.page);
            }

            if (options.id) {
                this.setPanelID(options.id);
            }

            if (options.items && options.items.length > 0) {
                this.setPanelItems(options.items);
            }
        },
        render: function() {
            if (this.$el) {
                return this.$el;
            }

            if (this.items.length === 0) {
                console.warn('No items for panel. Panel will be disabled.');
                return
            }
            if (!this._$holder) {
                throw new Error('Page element is not defined for panel');
            }
            if (!this.panelID) {
                throw new Error('Panel ID is not defined');
            }

            this.$el = $(_.template(this.template, this));
            this._$holder.append(this.$el);

            this.$el.trigger('create');

            this.$el.panel();

            this._attachEvents();

            return this.$el;
        },
        setPanelPage: function(page) {
            this._$holder = page;
        },
        setPanelID: function(id) {
            this.panelID = id;
        },
        setPanelItems: function(items) {
            this.items = items;
        },
        close: function() {
            this.$el.panel('close');
        },
        _attachEvents: function() {
            this.$el.find('a').on('vclick', this.close.bind(this));
        }
    });
});