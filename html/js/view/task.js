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

define(function() {
    return View(function(){/**
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
                                <input type="text" id="title" name="title" placeholder="Title" value="<%= title %>"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div data-role="fieldcontain">
                <div id="priority" data-role="controlgroup" data-type="horizontal" class="full-width ui-controlgroup-grid-b">
                    <label for="0">Low</label>
                    <input id="0" type="radio" name="priority" value="0" <% if (0 === priority) {%> checked <% } %>>
                    <label for="1">Normal</label>
                    <input id="1" type="radio" name="priority" value="1" <% if (1 === priority) {%> checked <% } %>>
                    <label for="2">High</label>
                    <input id="2" type="radio" name="priority" value="2" <% if (2 === priority) {%> checked <% } %>>
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
                <textarea id="notes" name="notes" placeholder="Notes"><%= notes %></textarea>
            </div>
        </div>
    **/});
});