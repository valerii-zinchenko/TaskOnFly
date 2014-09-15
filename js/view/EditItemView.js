/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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
    'control/EditItemControl'
], function(Control) {
    var EditItemView = new SingletonClass({
        page: 'task',

        template: Template(function(){/**
<div data-role="header">
    <a href="#home" data-role="back" data-icon="carat-l">Back</a>
    <h1>Item</h1>
    <a id="save" data-role="button" data-icon="plus" data-iconpos="right">Save</a>
</div>
<div data-role="content">
    <div data-role="fieldcontain">
        <table class="task-title" style="width: 100%">
        <tbody>
            <tr>
                <td>
                    <input type="checkbox" id="done" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off"/>
                </td>
                <td>
                    <input type="text" id="title" name="title" placeholder="Title" value=""/>
                </td>
            </tr>
        </tbody>
        </table>
    </div>

    <div data-role="fieldcontain">
        <div id="priority" data-role="controlgroup" data-type="horizontal" class="full-width ui-controlgroup-grid-b">
            <label for="0">Low</label>
            <input id="0" type="radio" name="priority" value="0">
            <label for="1">Normal</label>
            <input id="1" type="radio" name="priority" value="1">
            <label for="2">High</label>
            <input id="2" type="radio" name="priority" value="2">
        </div>
    </div>

    <div data-role="fieldcontain">
        <label for="start">Start:</label>
        <input type="date" id="start" value="" placeholder="YYYY-MM-DD">
    </div>
    <div data-role="fieldcontain">
        <label for="due">Due:</label>
        <input type="date" id="due" value="" placeholder="YYYY-MM-DD">
    </div>

    <div data-role="fieldcontain">
        <textarea id="notes" name="notes" placeholder="Notes"></textarea>
    </div>
</div>
        **/}),

        initialize: function() {
            this.$el = $('#' + this.page);
            this.$el.html(_.template(this.template));

            this.$isDone = this.$el.find('#done');
            this.$title = this.$el.find('#title');
            this.$priority = this.$el.find('#priority');
            this.$notes = this.$el.find('#notes');
            this.$startDate = this.$el.find('#start');
            this.$dueDate = this.$el.find('#due');

            this.$el.find('#save').on('vclick', this.save.bind(this));
            this.$el.find('form').on('submit', this.save.bind(this));

            this.control = new Control();
        },

        render: function() {
            this.setData();

            this.$isDone.prop('checked', this.data.isDone);
            this.$title.val(this.data.title);
            this.$priority.find('#' + this.data.priority).prop('checked', true);
            this.$startDate.val(this.data.startDate);
            this.$dueDate.val(this.data.dueDate);
            this.$notes.val(this.data.notes);

            this.$el.trigger('create');

            if (this.data.isDone) {
                this.$isDone.removeClass('ui-checkbox-off');
                this.$isDone.addClass('ui-checkbox-on');
            } else {
                this.$isDone.removeClass('ui-checkbox-on');
                this.$isDone.addClass('ui-checkbox-off');
            }

            this.control.resetItem();

            return this;
        },

        setData: function() {
            this.data = this.control.getData();
        },

        save: function(ev) {
            ev.preventDefault();
            var dueDateVal = this.$dueDate.val();

            this.control.save({
                title: this.$title.val(),
                priority: this.$priority.find(':checked').val(),
                startDate: new Date(this.$startDate.val()),
                dueDate: dueDateVal ? new Date(dueDateVal) : null,
                notes: this.$notes.val()
            });

            TaskOnFly.changeView('#home');
        }
    });

    TaskManager.EditItemView = EditItemView;
    return EditItemView;
});