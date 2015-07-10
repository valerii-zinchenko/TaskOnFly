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
	var template = '\
<div class="list-item" data-item-id="<%= public.id %>">\
	<div class="model-data <%= public.type.toLowerCase() %> <% if (public.isDone) {%>done<% } %>" data-priority="<%= public.priority %>">\
		<label class="title btn btn-default" for="<%= public.id %>">\
			<span class="checkbox-wrapper glyphicon glyphicon-ok">\
				<input id="<%= public.id %>" type="checkbox" <% if (public.isDone) { %> checked <% } %>>\
			</span>\
			<span class="title-text"><%= public.title %></span>\
		</label>\
	</div>\
	<div class="btn-group model-controls" role="group">\
		<button class="btn btn-default js-btn-edit" aria-label="Edit"><span class="glyphicon glyphicon-pencil"></span></button>\
		<button class="btn btn-default js-btn-remove" aria-label="Remove"><span class="glyphicon glyphicon-remove"></button>\
	</div>\
</div>';

    return new Class(DynamicView, {
        template: template,

        $listItem: null,
		$titleWrapper: null,
		$title: null,

        _initElements: function() {
            this.$listItem = this.$el.find('.model-data');
			this.$titleWrapper = this.$el.find('.title');
			this.$title = this.$el.find('.title-text');
			this.$checkBox = this.$listItem.find('input');
        },

        _attachEvents: function() {
            this.$checkBox.on('change', this.onChange.bind(this));

            this.$el.find('.js-btn-edit').on('click', this.onEdit.bind(this));
            this.$el.find('.js-btn-remove').on('click', this.onRemove.bind(this));
        },

		updateIsDone: function(value) {
			if (value) {
				this.$listItem.addClass('done');
				this.$titleWrapper.addClass('ui-checkbox-on');
				this.$titleWrapper.removeClass('ui-checkbox-off');
				this.$checkBox.prop('checked', true);
			} else {
				this.$listItem.removeClass('done');
				this.$titleWrapper.addClass('ui-checkbox-off');
				this.$titleWrapper.removeClass('ui-checkbox-on');
				this.$checkBox.prop('checked', false);
			}
		},
		updateTitle: function(value) {
			this.$title.html(value);
		},
		updatePriority: function(value) {
			this.$listItem.attr('data-priority', value);
		},

		hide: function() {
			this.$el.addClass('hidden');
		},
		show: function() {
			this.$el.removeClass('hidden');
		},

        onChange: function(ev) {
            ev.preventDefault();
			ev.stopPropagation();

            this.control.action();
        },
        onEdit: function(ev) {
            ev.preventDefault();

            this.control.editModel();
        },
        onRemove: function(ev) {
            ev.preventDefault();

            this.$el.remove();

            this.control.removeModel();
        }
    });
});
