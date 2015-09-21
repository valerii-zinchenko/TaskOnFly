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
    return new Class({
        template: '\
<div id="popupDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">\
	<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="modal-header">\
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
					<span aria-hidden="true">&times;</span>\
				</button>\
			<% if (title) { %>\
				<h4 class="modal-title"><%= title %></h4>\
			<% } %>\
			</div>\
\
			<div class="modal-body">\
			<% _.each(messages, function(msg) { %>\
				<p><%= msg %></p>\
			<% }); %>\
			</div>\
\
			<div class="modal-footer">\
			<% _.each(controls, function(control, indx) { %>\
				<button id="btn<%= indx %>" class="btn <%= control.btnClass %>"><%= control.title %></button>\
			<% }); %>\
			</div>\
		</div>\
	</div>\
</div>',

        title: '',
        messages: [],
        controls: [],

        initialize: function(properties) {
            if (arguments.length !== 1) {
                throw new Error('Incorrect input arguments');
            }

            if (!(properties instanceof Object)) {
                throw new Error('Incorrect types of input arguments');
            }

            if (!properties.messages) {
                throw new Error('No message is defined');
            }
            if (typeof properties.messages != 'string' && !(properties.messages instanceof Array)) {
                throw new Error('Incorrect type of "messages" property');
            }

            if (!properties.controls) {
                throw new Error('No controls defined');
            }
            if (!(properties.controls instanceof Array)) {
                throw new Error('Incorrect type of "controls" property');
            }
            if (properties.controls.some(function(control) {
                    return !(control instanceof Object);
                }))
            {
                throw new Error('Incorrect type of content in "controls" property');
            }
            if (properties.controls.some(function(control) {
                    return !control.hasOwnProperty('title');
                }))
            {
                throw new Error('All controls should have a "title" property');
            }
            if (properties.controls.some(function(control) {
                    return typeof control.title != 'string';
                }))
            {
                throw new Error('All control\'s "title" properties should be have string type');
            }
            if (properties.controls.some(function(control) {
                    if (!control.hasOwnProperty('callback')) {
                        return false;
                    } else {
                        return typeof control.callback != 'function';
                    }
                }))
            {
                throw new Error('All control\'s "callback" properties should be have function type');
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
            this.$el = $(_.template(this.template)(this));
            $(document.body).append(this.$el);

            this._attachEvents();

            return this.$el;
        },
        show: function() {
            if (!this.$el) {
                this.render();
            }

            this.$el.modal('show');
        },
        hide: function(callback) {
            if (callback) {
                callback();
            }

            this.$el.modal('hide');
        },

        _attachEvents: function() {
            _.each(this.controls, function(control, indx) {
                var $control = this.$el.find('#btn' + indx);
                $control.on('click', this.hide.bind(this, control.callback));
            }, this);
        }
    });
});
