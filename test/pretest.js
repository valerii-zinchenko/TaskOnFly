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

jscoverage = require('jscoverage');

srcPrefix =  './js/';
destPrefix = './test/_jsTestFiles/';

[
    'core/AClass.js',
    'core/Class.js',
    'core/MVCModule.js',
    'core/SingletonClass.js',
    'core/utils.js',

    'model/TaskOnFly.js',
    'model/Task.js',
    'model/TaskList.js',
    'model/MainRouter.js',

    'pages/About/View.js',
    'pages/About.js',
    'pages/APage/View.js',
    'pages/Home/Control.js',
    'pages/Home/View.js',
    'pages/Home.js',
    'pages/ItemEditor/Control.js',
    'pages/ItemEditor/View.js',
    'pages/ItemEditor.js',

    'view/PopupDialog.js',

    'modules/APanel/View.js',
    'modules/FastTask/Control.js',
    'modules/FastTask/View.js',
    'modules/FastTask.js',
    'modules/ListView/Control.js',
    'modules/ListView/View.js',
    'modules/ListView.js',
    'modules/MainPanel/View.js',
    'modules/MainPanel.js',
    'modules/SimpleSearch/Control.js',
    'modules/SimpleSearch/View.js',
    'modules/SimpleSearch.js',

    'main.js'
].forEach(function(file) {
    jscoverage.processFile(srcPrefix + file, destPrefix + file);
});
