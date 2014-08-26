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

jscoverage = require('jscoverage');

srcPrefix =  './html/js/';
destPrefix = './test/_jsTestFiles/js/';

[
    'core/AClass.js',
    'core/Class.js',
    'core/SingletonClass.js',
    'core/utils.js',

    'model/TaskOnFly.js',
    'model/Task.js',
    'model/TaskList.js',
    'model/MainRouter.js',

    'view/home.js',
    'view/list.js',
    'view/task.js',

    'control/HomeControl.js',
    'control/ListControl.js',
    'control/EditItemControl.js',

    'main.js',

    'modules/FastTask/FastTaskControl.js',
    'modules/FastTask/template.js',

    'modules/SimpleSearch/SimpleSearchControl.js',
    'modules/SimpleSearch/template.js'
].forEach(function(file) {
    jscoverage.processFile(srcPrefix + file, destPrefix + file);
});
