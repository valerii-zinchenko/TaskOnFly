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
    var PopupDialog = new Class({
        template: Template(function(){/**
<div data-role="popup" id="popupDialog" data-overlay-theme="b" data-theme="a" data-dismissible="false" data-position-to="window" style="max-width:400px;">
<% if (false) { %>
    <div data-role="header" data-theme="a">
        <h1><%= title %></h1>
    </div>
<% } %>
    <div role="main" class="ui-content">
    <% _.each(messages, function(msg) { %>
        <h3 class="ui-title"><%= msg %></h3>
    <% }); %>

        <div class="buttons">
        <% _.each(controls, function(control, indx) { %>
            <button id="btn<%= indx %>" data-inline="true"><%= control.title %></button>
        <% }); %>
        </div>
    </div>
</div>
        **/}),
        title: '',
        messages: [],
        controls: [],

        initialize: function(properties) {
            if (arguments.length !== 1) {
                throw new Error('Incorrect input arguments');
            }

            if (!properties.messages) {
                throw new Error('No message is defined');
            }
            if (!properties.controls) {
                throw new Error('No controls defined');
            }

            if (properties.controls && !(properties.controls instanceof Array)) {
                throw new Error('Incompatible "controls" type');
            }
            if (_.any(properties.controls, function(control) { return !control.title; })) {
                throw new Error('Not all controls have a title');
            }

            if (properties.title) {
                this.title = properties.title;
            }
            if (typeof properties.messages === 'string') {
                this.messages[0] = properties.messages;
            } else {
                this.messages = properties.messages;
            }

            this.controls = properties.controls;
        },
        render: function() {
            this.$el = $(_.template(this.template, this));
            $(document.body).append(this.$el);

            this.$el.popup();
            this._attachEvents();

            this.$el.trigger('create');

            return this.$el;
        },
        show: function() {
            if (!this.$el) {
                this.render();
            }

            this.$el.popup('open');
        },
        hide: function(callback) {
            if (callback) {
                callback();
            }

            this.$el.popup('close');
        },

        _attachEvents: function() {
            _.each(this.controls, function(control, indx) {
                var $control = this.$el.find('#btn' + indx);
                $control.on('vclick', this.hide.bind(this, control.callback));
            }, this);
        }
    });

    TaskManager.PopupDialog = PopupDialog;

    return PopupDialog;
});