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

define([
    'model/MainRouter',
    'model/TaskList'
], function() {
    function sync(listRef, ids) {
        ids.forEach(function(itemID) {
            var itemData = TaskOnFly.loadItem(itemID);
            var item = listRef['add' + itemData.type](itemData);

            if (itemData.type === 'List') {
                var ids = item.public.items;
                item.public.items = [];
                sync(item, ids);
            }
        });

    }
    return function() {
        var store = TaskOnFly.loadItem('root'),
            rootList = new TaskManager.TaskList('root', {
                id:'root',
                version: TaskManager.TaskList.prototype._defaults.public.version
            });

        if (store) {
            var ids = store.items;
            store.items = [];
            rootList.saveData(store);
            sync(rootList, ids);
        }

        TaskOnFly.setRootList(rootList);
        TaskOnFly.getRootList().saveData();
        TaskOnFly.setCurrentList(TaskOnFly.getRootList());

        new TaskManager.MainRouter();
    }
});
