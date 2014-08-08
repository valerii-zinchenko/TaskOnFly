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
    'js/routers/MainRouter',
    'js/collections/TaskList'
], function(MainRouter, TaskList) {
    function sync(listRef) {
        listRef.public.items.forEach(function(itemID) {
            var itemData = TaskMe.loadItem(itemID),
                item = listRef['add' + itemData.type](itemData);

            if (itemData.type === 'List') {
                sync(item);
            }
        });

    }
    return function() {
        var rooter = new MainRouter(),
            store = TaskMe.loadAllItems(),
            rootList = new TaskList('root', {id:'root'});

        if (store && store.root) {
            rootList.saveData(store.root);
            sync(rootList);
        }

        TaskMe.setRootList(rootList);
        TaskMe.getRootList().saveData();
        TaskMe.setCurrentList(TaskMe.getRootList());

        //todo: sync data from device

        rooter.home();
    }
});
