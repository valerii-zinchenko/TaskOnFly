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
        <table class="full fast-task">
            <tbody>
            <tr>
                <td>
                    <input id="fastTitle" type="text" placeholder="Fast task">
                </td>
                <td class="select-priority">
                    <div id="priority" class="full-width ui-controlgroup-grid-b" data-role="controlgroup" data-type="horizontal" data-mini="true">
                        <label for="low" class="low ui-icon-arrow-d ui-btn-icon-notext">Low</label>
                        <input id="low" type="radio" name="priority" value="0">
                        <label for="normal" class="normal ui-icon-circle ui-btn-icon-notext">Normal</label>
                        <input id="normal" type="radio" name="priority" value="1" checked>
                        <label for="high" class="high ui-icon-arrow-u ui-btn-icon-notext">High</label>
                        <input id="high" type="radio" name="priority" value="2">
                    </div>
                </td>
                <td class="add-btn">
                    <button id="addFastTask" data-role="button" data-icon="plus" data-iconpos="notext">add</button>
                </td>
            </tr>
            </tbody>
        </table>
    **/});
});