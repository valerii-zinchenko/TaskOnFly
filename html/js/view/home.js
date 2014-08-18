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
            <a href="#" id="prevList" data-role="button" data-icon="carat-l">Previous list</a>
            <h1>Home</h1>
        </div>

        <div id="content" class="ui-content">
            <div id="fastTaskModule" data-role="fieldcontain"></div>
            <div id="listModule" data-role="fieldcontain"></div>
        </div>

        <div data-role="footer" data-position="fixed">
            <table class="full">
                <tbody>
                <tr>
                    <td>
                        <button id="addList" class="btn-left" data-role="button" data-icon="plus">New list</button>
                    </td>
                    <td>
                        <div id="searchModule"></div>
                    </td>
                    <td>
                        <button id="addTask" class="btn-right" data-role="button" data-icon="plus" data-iconpos="right">New task</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
     **/});
});