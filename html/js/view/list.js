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
        <div data-role="fieldcontain">
            <table class="full task-list">
                <thead><tr><th></th><th></th></tr></thead>
                <tbody>
                <% _.each(models, function(item) { %>
                    <tr data-item-id="<%= item.public.id %>">
                        <th>
                            <div class="list-item <%= item.public.type.toLowerCase() %> priority-<%= item.public.priority %>">
                                <input id="<%= item.public.id %>" type="checkbox" <% if (item.public.isDone) { %> checked <% } %>>
                                <label for="<%= item.public.id %>"><%= item.public.title %></label>
                            </div>
                        </th>
                        <td>
                            <div data-role="controlgroup" data-type="horizontal">
                                <button class="custom edit-btn" data-role="button" data-icon="edit" data-iconpos="notext">edit</button><button class="custom delete-btn" data-role="button" data-icon="delete" data-iconpos="notext">delete</button>
                            </div>
                        </td>
                    </tr>
                <% }) %>
                </tbody>
            </table>
        </div>
    **/});
});